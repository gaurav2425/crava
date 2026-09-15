import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassPanel } from '../components/GlassPanel';
import { colors } from '../constants/theme';

const TAB_META = {
  home: {
    label: 'Home',
    icon: { focused: 'home', unfocused: 'home-outline' },
  },
  map: {
    label: 'Map',
    icon: { focused: 'map', unfocused: 'map-outline' },
  },
  plan: {
    label: 'Plan',
    icon: { focused: 'calendar', unfocused: 'calendar-outline' },
  },
};

export function CustomTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.tabBarWrap} pointerEvents="box-none">
      <GlassPanel style={[styles.tabBar, { paddingBottom: insets.bottom || 12 }]}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const meta = TAB_META[route.name] ?? {
            label: route.name,
            icon: { focused: 'ellipse', unfocused: 'ellipse-outline' },
          };

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isFocused ? meta.icon.focused : meta.icon.unfocused}
                size={22}
                color={isFocused ? colors.dark : colors.textMuted}
              />
              <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                {meta.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </GlassPanel>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarWrap: {
    backgroundColor: 'transparent',
  },
  tabBar: {
    flexDirection: 'row',
    paddingTop: 12,
    overflow: 'hidden',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2 },
  tabLabel: { fontSize: 11, color: colors.textMuted },
  tabLabelActive: { color: colors.dark, fontWeight: '600' },
});
