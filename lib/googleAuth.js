import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import { API_URL, getCurrentUser } from './api';

WebBrowser.maybeCompleteAuthSession();

export const GOOGLE_IOS_CLIENT_ID =
  '611544155056-g6iaoifggid6pogrn7dlaikn3t9eeaeg.apps.googleusercontent.com';

export const GOOGLE_REVERSED_CLIENT_ID =
  'com.googleusercontent.apps.611544155056-g6iaoifggid6pogrn7dlaikn3t9eeaeg';

export const GOOGLE_WEB_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
  '611544155056-r23a9vm20a59p9j12n01ghit9p07l2t7.apps.googleusercontent.com';

const googleDiscovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

export function isExpoGo() {
  return Constants.executionEnvironment === 'storeClient';
}

export function getGoogleRedirectUri() {
  return AuthSession.makeRedirectUri({
    scheme: 'calora',
    path: 'oauthredirect',
    native: `${GOOGLE_REVERSED_CLIENT_ID}:/oauthredirect`,
  });
}

export function getGoogleClientId() {
  if (Platform.OS === 'web') {
    return GOOGLE_WEB_CLIENT_ID;
  }

  return GOOGLE_IOS_CLIENT_ID;
}

export function useGoogleAuthRequest() {
  const redirectUri = getGoogleRedirectUri();

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: getGoogleClientId(),
      redirectUri,
      scopes: ['openid', 'profile', 'email'],
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true,
      extraParams: {
        include_granted_scopes: 'true',
        prompt: 'select_account',
      },
    },
    googleDiscovery,
  );

  return { request, response, promptAsync, redirectUri };
}

export async function tokensFromAuthResponse(request, response) {
  if (response?.type !== 'success') {
    return null;
  }

  const idToken = response.params?.id_token ?? response.authentication?.idToken ?? null;
  const accessToken =
    response.params?.access_token ?? response.authentication?.accessToken ?? null;

  if (idToken || accessToken) {
    return { idToken, accessToken };
  }

  if (!response.params?.code || !request) {
    throw new Error('Google did not return an auth code.');
  }

  const tokenResponse = await AuthSession.exchangeCodeAsync(
    {
      clientId: getGoogleClientId(),
      code: response.params.code,
      redirectUri: request.redirectUri,
      extraParams: {
        code_verifier: request.codeVerifier ?? '',
      },
    },
    googleDiscovery,
  );

  return {
    idToken: tokenResponse.idToken ?? null,
    accessToken: tokenResponse.accessToken ?? null,
  };
}

export function isGoogleSignInCancelled(result) {
  return result?.type === 'cancel' || result?.type === 'dismiss';
}

export async function signInWithGoogleViaApi() {
  const returnTo = AuthSession.makeRedirectUri({
    scheme: 'calora',
    path: 'oauthredirect',
  });
  const authUrl = `${API_URL}/auth/google/start?returnTo=${encodeURIComponent(returnTo)}`;
  const result = await WebBrowser.openAuthSessionAsync(authUrl, returnTo);

  if (isGoogleSignInCancelled(result)) {
    const error = new Error('Google sign-in was cancelled.');
    error.code = 'cancelled';
    throw error;
  }

  if (result.type !== 'success' || !result.url) {
    throw new Error('Google sign-in failed.');
  }

  const parsed = new URL(result.url.replace('#', '?'));
  const token = parsed.searchParams.get('token');
  const errorMessage = parsed.searchParams.get('error');

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  if (!token) {
    throw new Error('Google sign-in did not return a session.');
  }

  const session = await getCurrentUser(token);
  return { token, user: session.user };
}
