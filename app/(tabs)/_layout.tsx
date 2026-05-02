import Topbar from '@/components/layout/Topbar';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import BottomTabBar from '../../components/layout/BottomTabBar';

import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export default function TabLayout() {
  return (
    <View className="bg-bg flex-1">
      <Tabs
        tabBar={() => <BottomTabBar />}
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: '#060c0a' },
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="markets" />
      </Tabs>
      <Topbar />
    </View>
  );
}
