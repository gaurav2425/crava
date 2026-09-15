import { Tabs } from 'expo-router';

import { CustomTabBar } from '../../../navigation/AppNavigator';

export const unstable_settings = {
  initialRouteName: 'home',
};

function renderTabBar(props: Record<string, unknown>) {
  return <CustomTabBar {...props} />;
}

export default function TabsLayout() {
  return (
    <Tabs
      sceneContainerStyle={{ backgroundColor: '#FFFFFF' }}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: '#FFFFFF' },
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
      tabBar={renderTabBar}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="map" options={{ title: 'Map' }} />
      <Tabs.Screen name="plan" options={{ title: 'Plan' }} />
    </Tabs>
  );
}
