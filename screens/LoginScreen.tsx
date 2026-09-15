import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import {
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { GlassPanel } from '../components/GlassPanel';
import { getCurrentUser } from '../lib/api';
import { signInWithGoogleViaApi } from '../lib/googleAuth';
import { getStoredToken, saveSession } from '../lib/session';

// ── Lottie animation ────────────────────────────────────────────────────────
// const HeroIllustration = () => (
//   <LottieView
//     source={require('../../assets/icons/Notebook.json')}
//     autoPlay
//     loop
//     style={{ width: width, height: height * 0.48 }}
//     resizeMode="contain"
//   />
// );

// ── Google "G" logo drawn in SVG ─────────────────────────────────────────────
const GoogleIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 48 48">
    <Path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <Path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <Path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <Path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
  </Svg>
);

// ── Arrow icon ───────────────────────────────────────────────────────────────
const ArrowIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 12h14M13 6l6 6-6 6"
      stroke="white"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ── Main Screen ──────────────────────────────────────────────────────────────
const LoginScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isInProgress, setIsInProgress] = useState(false);

  useEffect(() => {
    WebBrowser.warmUpAsync();
    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      const token = await getStoredToken();
      if (!token) {
        return;
      }

      try {
        await getCurrentUser(token);
        router.replace('/home');
      } catch {
        // Token expired; stay on login.
      }
    };

    restoreSession().catch(() => {});
  }, [router]);

  const signIn = async () => {
    setIsInProgress(true);
    try {
      const session = await signInWithGoogleViaApi();
      await saveSession(session);
      router.replace('/home');
    } catch (error: any) {
      if (error.code === 'cancelled') {
        return;
      }

      Alert.alert('Sign-in Error', error.message ?? 'Could not sign in with Google.');
    } finally {
      setIsInProgress(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F3EE" />

      <View style={[styles.headerWrap, { paddingTop: insets.top + 8 }]} pointerEvents="box-none">
        <GlassPanel style={styles.headerGlass}>
          <Text style={styles.headerTitle}>Calora</Text>
        </GlassPanel>
      </View>

      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        {/* <HeroIllustration /> */}
      </View>

      {/* Bottom content card */}
      <View style={styles.card}>
        {/* Heading */}
        <Text style={styles.heading}>Note Organize Sync.</Text>
        <Text style={styles.subHeading}>
          Upgrade For{' '}
          <Text style={styles.highlight}>Seamless Productivity!</Text>
        </Text>

        {/* Description */}
        <Text style={styles.description}>
          Take notes, organize tasks, and sync seamlessly.{'\n'}
          Upgrade now for a smarter workflow!
        </Text>

        {/* Google sign-in row */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.googleButton}
            activeOpacity={0.85}
            onPress={signIn}
            disabled={isInProgress}
          >
            <GoogleIcon />
            <Text style={styles.googleButtonText}>Continue With Google</Text>
          </TouchableOpacity>

        </View>
      </View>
    </View>
  );
};

export default LoginScreen;

// ── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  headerWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    zIndex: 2,
  },
  headerGlass: {
    minHeight: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  illustrationContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  card: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  },
  heading: {
    fontSize: 56,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 10,
    letterSpacing: 0.2,
    fontFamily:'SFProDisplay-Bold'
  },
  subHeading: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 14,
    letterSpacing: 0.2,
    // fontFamily:'SFProDisplay-Medium'
  },
  highlight: {
    color: '#000000',
  },
  description: {
    fontSize: 14,
    color: '#6b6b6b',
    lineHeight: 21,
    marginBottom: 28,
    fontFamily:'SFProDisplay-Regular'
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  googleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: '#d0d0d0',
    borderRadius: 50,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
  },
  googleButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    fontFamily:'SFProDisplay-Bold'
  },
  arrowButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
