import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  FadeOutUp,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors, radius, spacing } from '../constants/theme';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const EXPAND_DURATION = 320;

function startOfWeek(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addDays(date, amount) {
  const d = new Date(date);
  d.setDate(d.getDate() + amount);
  return d;
}

function addMonths(date, amount) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + amount);
  return d;
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildMonthGrid(monthAnchor) {
  const gridStart = startOfWeek(startOfMonth(monthAnchor));
  const weeks = [];
  let cursor = gridStart;
  for (let w = 0; w < 6; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      week.push(cursor);
      cursor = addDays(cursor, 1);
    }
    weeks.push(week);
  }
  return weeks;
}

export default function Calendar({ selectedDate, onSelectDate }) {
  const today = useMemo(() => new Date(), []);
  const [expanded, setExpanded] = useState(false);
  const [viewDate, setViewDate] = useState(selectedDate || today);
  const chevron = useSharedValue(0);

  const weeks = useMemo(() => {
    if (expanded) return buildMonthGrid(viewDate);
    return [Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(viewDate), i))];
  }, [expanded, viewDate]);

  const monthLabel = `${MONTH_NAMES[viewDate.getMonth()]} ${viewDate.getFullYear()}`;

  const goPrev = () => {
    setViewDate((d) => (expanded ? addMonths(d, -1) : addDays(d, -7)));
  };
  const goNext = () => {
    setViewDate((d) => (expanded ? addMonths(d, 1) : addDays(d, 7)));
  };
  const goToday = () => {
    const now = new Date();
    setViewDate(now);
    onSelectDate(now);
  };
  const toggleExpanded = () => {
    const next = !expanded;
    chevron.value = withTiming(next ? 180 : 0, {
      duration: EXPAND_DURATION,
      easing: Easing.out(Easing.cubic),
    });
    setExpanded(next);
  };
  const handleSelect = (date) => {
    onSelectDate(date);
    setViewDate(date);
  };

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevron.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.monthRow}>
        <Text style={styles.monthLabel}>{monthLabel}</Text>
        <View style={styles.navButtons}>
          <TouchableOpacity onPress={goPrev} style={styles.navButton} hitSlop={8}>
            <Ionicons name="chevron-back" size={16} color={colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity onPress={goToday} style={styles.todayButton} activeOpacity={0.7}>
            <Text style={styles.todayButtonText}>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={goNext} style={styles.navButton} hitSlop={8}>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.labelRow}>
        {DAY_LABELS.map((label, i) => (
          <View key={`${label}-${i}`} style={styles.dayItem}>
            <Text style={styles.dayLabel}>{label}</Text>
          </View>
        ))}
      </View>

      <Animated.View
        style={styles.grid}
        layout={LinearTransition.duration(EXPAND_DURATION).easing(Easing.out(Easing.cubic))}
      >
        {weeks.map((week, weekIndex) => (
          <Animated.View
            style={styles.weekRow}
            key={week.map((date) => date.toISOString()).join('-')}
            layout={LinearTransition.duration(EXPAND_DURATION).easing(Easing.out(Easing.cubic))}
            entering={
              weekIndex > 0
                ? FadeInDown.duration(240).delay(weekIndex * 28).easing(Easing.out(Easing.cubic))
                : undefined
            }
            exiting={FadeOutUp.duration(180).easing(Easing.in(Easing.cubic))}
          >
            {week.map((date) => {
              const selected = isSameDay(date, selectedDate);
              const isToday = isSameDay(date, today);
              const inCurrentMonth = date.getMonth() === viewDate.getMonth();
              const dimmed = expanded && !inCurrentMonth;
              return (
                <TouchableOpacity
                  key={date.toISOString()}
                  style={styles.dayItem}
                  onPress={() => handleSelect(date)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.dateWrap,
                      selected && styles.dateSelected,
                      !selected && isToday && styles.dateTodayOutline,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dateText,
                        dimmed && styles.dateTextDimmed,
                        selected && styles.dateTextSelected,
                      ]}
                    >
                      {date.getDate()}
                    </Text>
                  </View>
                  {isToday && !selected && <View style={styles.todayDot} />}
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        ))}
      </Animated.View>

      <TouchableOpacity
        onPress={toggleExpanded}
        style={styles.toggleButton}
        hitSlop={8}
        activeOpacity={0.7}
      >
        <Animated.View style={chevronStyle}>
          <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },

  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  monthLabel: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  navButtons: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  navButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayButton: {
    height: 26,
    paddingHorizontal: 10,
    borderRadius: 13,
    backgroundColor: colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.white,
  },

  labelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  grid: { overflow: 'hidden' },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  dayItem: { alignItems: 'center', width: 38 },
  dayLabel: { color: colors.textMuted, fontSize: 12 },
  dateWrap: {
    width: 34,
    height: 34,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateSelected: {
    backgroundColor: colors.dark,
  },
  dateTodayOutline: {
    borderWidth: 1.5,
    borderColor: colors.text,
  },
  dateText: { fontSize: 14, fontWeight: '600', color: colors.text },
  dateTextDimmed: { color: colors.textMuted, opacity: 0.4 },
  dateTextSelected: { color: colors.white },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.dark,
    marginTop: 2,
  },

  toggleButton: {
    alignSelf: 'center',
    marginTop: spacing.xs,
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
});
