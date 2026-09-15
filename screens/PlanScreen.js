import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassPanel } from '../components/GlassPanel';
import { colors, radius, spacing } from '../constants/theme';

export default function PlanScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.safe}>
      <View style={styles.center}>
        <Text style={styles.title}>Your meal plan goes here.</Text>
      </View>

      <View style={[styles.headerWrap, { paddingTop: insets.top + 8 }]} pointerEvents="box-none">
        <GlassPanel style={styles.headerGlass}>
          <Text style={styles.headerTitle}>Plan</Text>
        </GlassPanel>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 80 },
  title: { fontSize: 15, color: colors.textMuted },
  headerWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
  },
  headerGlass: {
    minHeight: 56,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
});
