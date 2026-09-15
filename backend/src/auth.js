const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { User, toPublicUser } = require('./models/User');

const googleClient = new OAuth2Client();

function getAudiences() {
  return [process.env.GOOGLE_IOS_CLIENT_ID, process.env.GOOGLE_WEB_CLIENT_ID].filter(Boolean);
}

function signAppToken(user) {
  return jwt.sign({ sub: user._id.toString(), email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
}

async function verifyGoogleIdToken(idToken) {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: getAudiences(),
  });
  const payload = ticket.getPayload();
  if (!payload?.sub || !payload.email) {
    throw new Error('Google token is missing user details.');
  }

  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name || '',
    photo: payload.picture || '',
  };
}

async function verifyGoogleAccessToken(accessToken) {
  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error('Google access token is invalid.');
  }

  const profile = await response.json();
  if (!profile.sub || !profile.email) {
    throw new Error('Google profile is missing user details.');
  }

  return {
    googleId: profile.sub,
    email: profile.email,
    name: profile.name || '',
    photo: profile.picture || '',
  };
}

async function upsertGoogleUser(profile) {
  const user = await User.findOneAndUpdate(
    { googleId: profile.googleId },
    {
      $set: {
        email: profile.email,
        name: profile.name,
        photo: profile.photo,
        provider: 'google',
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  return user;
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Missing auth token.' });
  }

  try {
    req.auth = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired auth token.' });
  }
}

module.exports = {
  signAppToken,
  verifyGoogleIdToken,
  verifyGoogleAccessToken,
  upsertGoogleUser,
  requireAuth,
  toPublicUser,
};
