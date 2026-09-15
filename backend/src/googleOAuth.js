const crypto = require('node:crypto');

const pending = new Map();
const STATE_TTL_MS = 10 * 60 * 1000;

function cleanupPending() {
  const now = Date.now();
  for (const [state, value] of pending.entries()) {
    if (now - value.createdAt > STATE_TTL_MS) {
      pending.delete(state);
    }
  }
}

function createCodeVerifier() {
  return crypto.randomBytes(32).toString('base64url');
}

function createCodeChallenge(verifier) {
  return crypto.createHash('sha256').update(verifier).digest('base64url');
}

function isAllowedReturnTo(returnTo) {
  try {
    const url = new URL(returnTo);
    return ['calora:', 'exp:', 'exps:'].includes(url.protocol);
  } catch {
    return false;
  }
}

function getGoogleRedirectUri(req) {
  if (process.env.GOOGLE_REDIRECT_URI) {
    return process.env.GOOGLE_REDIRECT_URI;
  }

  const host = req.get('x-forwarded-host') || req.get('host');
  const proto = req.get('x-forwarded-proto') || req.protocol;
  return `${proto}://${host}/auth/google/callback`;
}

function getWebClientId() {
  return process.env.GOOGLE_WEB_CLIENT_ID;
}

function redirectWithParams(returnTo, params) {
  const dest = new URL(returnTo);
  for (const [key, value] of Object.entries(params)) {
    if (value != null) {
      dest.searchParams.set(key, String(value));
    }
  }
  return dest.toString();
}

function startGoogleOAuth(req, res) {
  cleanupPending();

  const returnTo = req.query.returnTo;
  if (!returnTo || !isAllowedReturnTo(returnTo)) {
    return res.status(400).send('A valid Calora returnTo URL is required.');
  }

  const clientId = getWebClientId();
  if (!clientId) {
    return res.status(500).send('GOOGLE_WEB_CLIENT_ID is missing.');
  }

  const state = crypto.randomBytes(16).toString('hex');
  const codeVerifier = createCodeVerifier();
  pending.set(state, { returnTo, codeVerifier, createdAt: Date.now() });

  const redirectUri = getGoogleRedirectUri(req);
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    code_challenge: createCodeChallenge(codeVerifier),
    code_challenge_method: 'S256',
    prompt: 'select_account',
    include_granted_scopes: 'true',
  });

  return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
}

async function exchangeGoogleCode(req, code, codeVerifier) {
  const body = new URLSearchParams({
    client_id: getWebClientId(),
    code,
    code_verifier: codeVerifier,
    grant_type: 'authorization_code',
    redirect_uri: getGoogleRedirectUri(req),
  });

  if (process.env.GOOGLE_WEB_CLIENT_SECRET) {
    body.set('client_secret', process.env.GOOGLE_WEB_CLIENT_SECRET);
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  const tokens = await response.json();
  if (!response.ok) {
    throw new Error(tokens.error_description || tokens.error || 'Google token exchange failed.');
  }

  return tokens;
}

function consumePending(state) {
  cleanupPending();
  const value = pending.get(state);
  if (value) {
    pending.delete(state);
  }
  return value;
}

module.exports = {
  startGoogleOAuth,
  exchangeGoogleCode,
  consumePending,
  redirectWithParams,
};
