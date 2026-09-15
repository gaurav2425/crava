import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

SplashScreen.preventAutoHideAsync();

const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFFFFF',
    card: '#FFFFFF',
  },
};

export const unstable_settings = {
  initialRouteName: 'index',
  anchor: 'index',
};

export default function RootLayout() {
  useEffect(() => {
    SystemUI.setBackgroundColorAsync('#FFFFFF');
  }, []);

  return (
    <ThemeProvider value={LightTheme}>
      <AnimatedSplashOverlay />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#FFFFFF' },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="camera" options={{ presentation: 'fullScreenModal' }} />
        <Stack.Screen name="scan-result" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
