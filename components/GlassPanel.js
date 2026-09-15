import { BlurView } from 'expo-blur';
import { GlassView, isGlassEffectAPIAvailable } from 'expo-glass-effect';
import { StyleSheet } from 'react-native';

function canUseNativeGlass() {
  try {
    return isGlassEffectAPIAvailable();
  } catch {
    return false;
  }
}

export function GlassPanel({ style, children, tint = 'light' }) {
  if (canUseNativeGlass()) {
    return (
      <GlassView
        style={style}
        glassEffectStyle="regular"
        isInteractive
        colorScheme={tint}
      >
        {children}
      </GlassView>
    );
  }

  return (
    <BlurView
      intensity={48}
      tint={tint}
      style={[tint === 'dark' ? styles.darkFallback : styles.lightFallback, style]}
    >
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  lightFallback: {
    backgroundColor: 'rgba(255,255,255,0.62)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.75)',
  },
  darkFallback: {
    backgroundColor: 'rgba(20,20,20,0.38)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.18)',
  },
});
