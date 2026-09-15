import Constants from 'expo-constants';

function resolveApiUrl() {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  const hostUri = Constants.expoConfig?.hostUri ?? Constants.linkingUri;
  const host = String(hostUri || '')
    .replace(/^[a-z]+:\/\//, '')
    .split(':')[0]
    .split('/')[0];

  if (host && host !== 'localhost' && host !== '127.0.0.1') {
    return `http://${host}:4000`;
  }

  return 'http://localhost:4000';
}

export const API_URL = resolveApiUrl();

export async function apiRequest(path, { method = 'GET', token, body } = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Request failed (${response.status})`);
  }

  return data;
}

export function loginWithGoogleApi({ idToken, accessToken }) {
  return apiRequest('/auth/google', {
    method: 'POST',
    body: { idToken, accessToken },
  });
}

export function getCurrentUser(token) {
  return apiRequest('/auth/me', { token });
}

export function logoutApi(token) {
  return apiRequest('/auth/logout', { method: 'POST', token });
}
