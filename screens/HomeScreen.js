import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Calendar from '../components/Calendar';
import { GlassPanel } from '../components/GlassPanel';
import ProgressRing from '../components/ProgressRing';
import { colors, radius, spacing } from '../constants/theme';

const ACTIVITY = [
  {
    id: '1',
    name: 'Noodles',
    time: '12:40 Pm',
    calories: 45,
    protein: 152,
    carbs: 125,
    fat: 125,
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200',
  },
];

const WEEKDAY_NAMES = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function greetingFor(date) {
  const today = new Date();
  if (isSameDay(date, today)) {
    const hour = today.getHours();
    if (hour < 12) return 'Good morning!';
    if (hour < 18) return 'Good afternoon!';
    return 'Good evening!';
  }
  return WEEKDAY_NAMES[date.getDay()];
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const caloriesEaten = 1822;
  const caloriesGoal = 2353;

  return (
    <View style={styles.safe}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 84 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Calendar - collapses to a week row, expands to a full month grid */}
        <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />

        {/* Calories card */}
        <View style={styles.caloriesCard}>
          <View>
            <Text style={styles.caloriesValue}>
              {caloriesEaten}
              <Text style={styles.caloriesGoal}> / {caloriesGoal}</Text>
            </Text>
            <Text style={styles.caloriesLabel}>Calories today</Text>
          </View>
          <ProgressRing
            size={64}
            strokeWidth={6}
            progress={caloriesEaten / caloriesGoal}
            trackColor={colors.border}
            progressColor={colors.dark}
          >
            <Ionicons name="flame" size={22} color={colors.dark} />
          </ProgressRing>
        </View>

        {/* Macro cards */}
        <View style={styles.macroRow}>
          <MacroCard
            value="100 g"
            label="Protein left"
            progress={0.62}
            color={colors.protein}
            track={colors.proteinTrack}
            icon={<Feather name="feather" size={14} color={colors.protein} />}
          />
          <MacroCard
            value="34 g"
            label="Carbs left"
            progress={0.35}
            color={colors.carbs}
            track={colors.carbsTrack}
            icon={<Ionicons name="leaf-outline" size={14} color={colors.carbs} />}
          />
          <MacroCard
            value="22 g"
            label="Fat over"
            progress={0.85}
            color={colors.fat}
            track={colors.fatTrack}
            icon={<Ionicons name="leaf" size={14} color={colors.fat} />}
          />
        </View>

        {/* Activity */}
        <View style={styles.activityHeader}>
          <Text style={styles.sectionTitle}>Today's Activity</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {ACTIVITY.map((item) => (
          <View key={item.id} style={styles.activityCard}>
            <Image source={{ uri: item.image }} style={styles.activityImage} />
            <View style={styles.activityInfo}>
              <View style={styles.activityTopRow}>
                <Text style={styles.activityName}>{item.name}</Text>
                <Text style={styles.activityTime}>{item.time}</Text>
              </View>
              <Text style={styles.activityCalories}>+ {item.calories} Calories</Text>
              <View style={styles.pillRow}>
                <Pill icon="feather" color={colors.protein} value={`${item.protein} g`} />
                <Pill icon="carbs" color={colors.carbs} value={`${item.carbs} g`} />
                <Pill icon="fat" color={colors.fat} value={`${item.fat} g`} />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Floating scan button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/camera')}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={30} color={colors.white} />
      </TouchableOpacity>

      <View style={[styles.headerWrap, { paddingTop: insets.top + 8 }]} pointerEvents="box-none">
        <GlassPanel style={styles.headerGlass}>
          <View style={styles.headerLeft}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/100?img=47' }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.greeting}>{greetingFor(selectedDate)}</Text>
              <Text style={styles.name}>Alessia Effie</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.bellButton}>
            <Ionicons name="notifications-outline" size={20} color={colors.text} />
          </TouchableOpacity>
        </GlassPanel>
      </View>
    </View>
  );
}

function MacroCard({ value, label, progress, color, track, icon }) {
  return (
    <View style={styles.macroCard}>
      <Text style={styles.macroValue}>{value}</Text>
      <Text style={styles.macroLabel}>{label}</Text>
      <ProgressRing size={44} strokeWidth={4} progress={progress} trackColor={track} progressColor={color}>
        {icon}
      </ProgressRing>
    </View>
  );
}

function Pill({ icon, color, value }) {
  const iconName =
    icon === 'feather' ? 'feather' : icon === 'carbs' ? 'sunny-outline' : 'leaf-outline';
  const IconComponent = icon === 'feather' ? Feather : Ionicons;
  return (
    <View style={styles.pill}>
      <IconComponent name={iconName} size={12} color={color} />
      <Text style={styles.pillText}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: 140 },
  headerWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
  },
  headerGlass: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    overflow: 'hidden',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: spacing.sm },
  greeting: { color: colors.textMuted, fontSize: 13 },
  name: { color: colors.text, fontSize: 17, fontWeight: '700' },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  caloriesCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  caloriesValue: { fontSize: 30, fontWeight: '700', color: colors.text },
  caloriesGoal: { fontSize: 18, fontWeight: '500', color: colors.textMuted },
  caloriesLabel: { color: colors.textMuted, marginTop: 4, fontSize: 13 },

  macroRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  macroCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  macroValue: { fontSize: 16, fontWeight: '700', color: colors.text },
  macroLabel: { fontSize: 11, color: colors.textMuted, marginBottom: spacing.sm },

  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  seeAll: { color: colors.textMuted, fontSize: 13 },

  activityCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  activityImage: { width: 64, height: 64, borderRadius: radius.sm, marginRight: spacing.sm },
  activityInfo: { flex: 1, justifyContent: 'center' },
  activityTopRow: { flexDirection: 'row', justifyContent: 'space-between' },
  activityName: { fontSize: 15, fontWeight: '700', color: colors.text },
  activityTime: { fontSize: 11, color: colors.textMuted },
  activityCalories: { fontSize: 12, color: colors.textMuted, marginVertical: 4 },
  pillRow: { flexDirection: 'row', gap: spacing.md },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pillText: { fontSize: 12, color: colors.text },

  fab: {
    position: 'absolute',
    bottom: 90,
    alignSelf: 'center',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
});