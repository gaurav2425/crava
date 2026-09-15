import Constants from 'expo-constants';

const DEFAULT_API_URL = 'https://crava-backend-g4qo.onrender.com';

function resolveApiUrl() {
  const url =
    process.env.EXPO_PUBLIC_API_URL ||
    Constants.expoConfig?.extra?.apiUrl ||
    DEFAULT_API_URL;
  return String(url).replace(/\/$/, '');
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
