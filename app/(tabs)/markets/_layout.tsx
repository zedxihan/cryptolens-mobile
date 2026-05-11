import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TopTabs = withLayoutContext(createMaterialTopTabNavigator().Navigator);

export default function MarketsTabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#060c0a',
        paddingTop: insets.top + 70,
      }}
    >
      <TopTabs
        screenOptions={{
          lazy: true,
          tabBarStyle: {
            backgroundColor: '#060c0a',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          tabBarScrollEnabled: true,
          tabBarItemStyle: {
            width: 'auto',
            paddingHorizontal: 4,
            paddingTop: 0,
          },
          tabBarContentContainerStyle: {
            paddingLeft: 8,
          },
          tabBarActiveTintColor: '#d8f1e7',
          tabBarInactiveTintColor: '#5f7d73',
          tabBarIndicatorStyle: {
            height: 0,
            display: 'none',
          },
          tabBarLabelStyle: {
            fontFamily: 'Poppins_600SemiBold',
            textTransform: 'none',
            fontSize: 16,
          },
          tabBarPressColor: 'transparent',
        }}
      >
        <TopTabs.Screen name="index" options={{ title: 'Top 100' }} />
        <TopTabs.Screen name="trending" options={{ title: 'Trending' }} />
        <TopTabs.Screen name="gainers" options={{ title: 'Top Gainers' }} />
      </TopTabs>
    </View>
  );
}
