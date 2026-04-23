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
    <View className="flex-1 bg-bg">
      <Topbar />
      <Tabs
        tabBar={() => <BottomTabBar />}
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: '#060c0a' },
        }}
      >
        <Tabs.Screen name="index" />
      </Tabs>
    </View>
  );
}
