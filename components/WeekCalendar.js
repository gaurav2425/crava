import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../constants/theme';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function startOfWeek(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay()); // Sunday-start week
  return d;
}

function addDays(date, amount) {
  const d = new Date(date);
  d.setDate(d.getDate() + amount);
  return d;
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * A real, working week calendar.
 * - Always reflects the actual current date (highlights "today").
 * - Lets the user tap any day to select it (`onSelectDate`).
 * - Lets the user page to the previous/next week with the chevrons.
 *
 * Props:
 *  - selectedDate: Date - the currently selected day
 *  - onSelectDate: (date: Date) => void - called when a day is tapped
 */
export default function WeekCalendar({ selectedDate, onSelectDate }) {
  const today = useMemo(() => new Date(), []);
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(selectedDate || today)
  );

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const goPrevWeek = () => setWeekStart((prev) => addDays(prev, -7));
  const goNextWeek = () => setWeekStart((prev) => addDays(prev, 7));

  const goToday = () => {
    setWeekStart(startOfWeek(today));
    onSelectDate(today);
  };

  const monthLabel = `${MONTH_NAMES[weekStart.getMonth()]} ${weekStart.getFullYear()}`;

  return (
    <View>
      <View style={styles.monthRow}>
        <TouchableOpacity onPress={goToday} activeOpacity={0.7}>
          <Text style={styles.monthLabel}>{monthLabel}</Text>
        </TouchableOpacity>
        <View style={styles.navButtons}>
          <TouchableOpacity onPress={goPrevWeek} style={styles.navButton} hitSlop={8}>
            <Ionicons name="chevron-back" size={16} color={colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity onPress={goNextWeek} style={styles.navButton} hitSlop={8}>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.weekRow}>
        {days.map((date) => {
          const selected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);
          return (
            <TouchableOpacity
              key={date.toISOString()}
              style={styles.dayItem}
              onPress={() => onSelectDate(date)}
              activeOpacity={0.7}
            >
              <Text style={styles.dayLabel}>{DAY_LABELS[date.getDay()]}</Text>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  monthLabel: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  navButtons: { flexDirection: 'row', gap: spacing.xs },
  navButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },

  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  dayItem: { alignItems: 'center', width: 38 },
  dayLabel: { color: colors.textMuted, fontSize: 12, marginBottom: 6 },
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
  dateTextSelected: { color: colors.white },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.dark,
    marginTop: 4,
  },
});
