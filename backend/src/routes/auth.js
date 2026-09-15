const express = require('express');
const { User, toPublicUser } = require('../models/User');
const {
  requireAuth,
  signAppToken,
  upsertGoogleUser,
  verifyGoogleAccessToken,
  verifyGoogleIdToken,
} = require('../auth');
const {
  consumePending,
  exchangeGoogleCode,
  redirectWithParams,
  startGoogleOAuth,
} = require('../googleOAuth');

const router = express.Router();

router.get('/google/start', startGoogleOAuth);

router.get('/google/callback', async (req, res) => {
  const { code, state, error } = req.query;
  const pendingAuth = consumePending(state);

  if (!pendingAuth) {
    return res.status(400).send('Google sign-in expired. Close this window and try again.');
  }

  if (error || !code) {
    return res.redirect(
      redirectWithParams(pendingAuth.returnTo, {
        error: error || 'Google sign-in was cancelled.',
      }),
    );
  }

  try {
    const tokens = await exchangeGoogleCode(req, code, pendingAuth.codeVerifier);
    const profile = tokens.id_token
      ? await verifyGoogleIdToken(tokens.id_token)
      : await verifyGoogleAccessToken(tokens.access_token);
    const user = await upsertGoogleUser(profile);
    const token = signAppToken(user);

    return res.redirect(redirectWithParams(pendingAuth.returnTo, { token }));
  } catch (callbackError) {
    console.error('Google OAuth callback failed:', callbackError.message);
    return res.redirect(
      redirectWithParams(pendingAuth.returnTo, {
        error: callbackError.message || 'Google login failed.',
      }),
    );
  }
});

router.post('/google', async (req, res) => {
  try {
    const { idToken, accessToken } = req.body || {};

    if (!idToken && !accessToken) {
      return res.status(400).json({ error: 'idToken or accessToken is required.' });
    }

    const profile = idToken
      ? await verifyGoogleIdToken(idToken)
      : await verifyGoogleAccessToken(accessToken);

    const user = await upsertGoogleUser(profile);
    const token = signAppToken(user);

    return res.json({
      token,
      user: toPublicUser(user),
    });
  } catch (error) {
    console.error('Google login failed:', error.message);
    return res.status(401).json({ error: error.message || 'Google login failed.' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.auth.sub);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  return res.json({ user: toPublicUser(user) });
});

router.post('/logout', requireAuth, (_req, res) => {
  return res.json({ ok: true });
});

module.exports = router;
