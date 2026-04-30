import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const TopTabs = withLayoutContext(createMaterialTopTabNavigator().Navigator);

export default function MarketsTabLayout() {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#060c0a' }}
      edges={['top']}
    >
      <TopTabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: '#060c0a',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          tabBarScrollEnabled: true,
          tabBarItemStyle: {
            width: 'auto',
            paddingHorizontal: 8,
            paddingTop: 0,
          },
          tabBarContentContainerStyle: {
            paddingLeft: 4,
          },
          tabBarActiveTintColor: '#ffffff',
          tabBarInactiveTintColor: '#5c6460',
          tabBarIndicatorStyle: {
            height: 0,
            display: 'none',
          },
          tabBarLabelStyle: {
            fontFamily: 'Poppins_600SemiBold',
            textTransform: 'none',
            fontSize: 18,
            letterSpacing: 0.5,
          },
          tabBarPressColor: 'transparent',
        }}
      >
        <TopTabs.Screen name="index" options={{ title: 'Top 100' }} />
      </TopTabs>
    </SafeAreaView>
  );
}
