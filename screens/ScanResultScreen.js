import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { GlassPanel } from '../components/GlassPanel';
import { colors, spacing, radius } from '../constants/theme';

const RESULT = {
  name: 'Vanilla Ice Cream',
  calories: 186,
  carbs: 28,
  protein: 32,
  fats: 19,
  healthScore: 9,
  image:
    'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=600',
};

function first(value, fallback) {
  const resolved = Array.isArray(value) ? value[0] : value;
  return resolved ?? fallback;
}

function firstNumber(value, fallback) {
  const parsed = Number(first(value, fallback));
  return Number.isFinite(parsed) ? parsed : fallback;
}

export default function ScanResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const image = first(params.imageUri, RESULT.image);
  const name = first(params.name, RESULT.name);
  const user = first(params.user, null);
  const calories = firstNumber(params.calories, RESULT.calories);
  const carbs = firstNumber(params.carbs, RESULT.carbs);
  const protein = firstNumber(params.protein, RESULT.protein);
  const fats = firstNumber(params.fats, RESULT.fats);
  const healthScore = firstNumber(params.healthScore, RESULT.healthScore);

  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.image} />

      <SafeAreaView style={styles.topBar} edges={['top']}>
        <GlassPanel style={styles.headerGlass} tint="dark">
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <Ionicons name="close" size={20} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.topTitle}>{user ? 'Details' : 'Scan Result'}</Text>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="information-circle-outline" size={18} color={colors.white} />
          </TouchableOpacity>
        </GlassPanel>
      </SafeAreaView>

      <View style={styles.sheet}>
        <Text style={styles.foodName}>{name}</Text>
        {user ? <Text style={styles.postedBy}>Posted by {user}</Text> : null}

        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Total {calories} Kcal</Text>
          <View style={styles.fireBadge}>
            <Ionicons name="flame" size={14} color="#E0524B" />
          </View>
        </View>

        <View style={styles.macroRow}>
          <Macro icon={<Feather name="sunrise" size={18} color={colors.carbs} />} value={`${carbs}g`} label="Carbs" color={colors.carbs} track={colors.carbsTrack} />
          <Macro icon={<Feather name="feather" size={18} color={colors.protein} />} value={`${protein}g`} label="Protein" color={colors.protein} track={colors.proteinTrack} />
          <Macro icon={<Ionicons name="leaf" size={18} color={colors.fat} />} value={`${fats}g`} label="Fats" color={colors.fat} track={colors.fatTrack} />
        </View>

        <View style={styles.healthCard}>
          <View style={styles.heartCircle}>
            <Ionicons name="heart" size={16} color="#E0524B" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.healthLabel}>
              {healthScore >= 8 ? 'High Health Score' : healthScore >= 6 ? 'Moderate Health Score' : 'Low Health Score'}
            </Text>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(healthScore / 10) * 100}%` },
                ]}
              />
            </View>
          </View>
          <Text style={styles.healthScore}>{healthScore}/10</Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.outlineButton}>
            <Text style={styles.outlineButtonText}>Update Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filledButton}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/home');
              }
            }}
          >
            <Text style={styles.filledButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function Macro({ icon, value, label, color, track }) {
  return (
    <View style={styles.macroItem}>
      <View style={[styles.macroIconWrap, { backgroundColor: track }]}>{icon}</View>
      <Text style={styles.macroValue}>{value}</Text>
      <Text style={styles.macroLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  image: { width: '100%', height: 380 },

  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  headerGlass: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    overflow: 'hidden',
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: { color: colors.white, fontSize: 16, fontWeight: '700' },

  sheet: {
    marginTop: -28,
    backgroundColor: '#F4EFE9',
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
    flex: 1,
  },
  foodName: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  postedBy: { fontSize: 13, color: colors.textMuted, marginTop: -8, marginBottom: spacing.sm },

  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  totalText: { fontSize: 15, fontWeight: '700', color: colors.text },
  fireBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FBEAE9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  macroItem: { alignItems: 'center', flex: 1 },
  macroIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  macroValue: { fontSize: 15, fontWeight: '700', color: colors.text },
  macroLabel: { fontSize: 12, color: colors.textMuted },

  healthCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  heartCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FBEAE9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  healthLabel: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 6 },
  progressTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#3FAE6A', borderRadius: 3 },
  healthScore: { fontSize: 14, fontWeight: '700', color: colors.text, marginLeft: spacing.sm },

  buttonRow: { flexDirection: 'row', gap: spacing.sm, marginTop: 'auto' },
  outlineButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  outlineButtonText: { fontWeight: '600', color: colors.text },
  filledButton: {
    flex: 1,
    backgroundColor: colors.dark,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  filledButtonText: { fontWeight: '600', color: colors.white },
});
