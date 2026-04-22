import { usePathname, useRouter } from 'expo-router';
import {
  BarChart2,
  Home,
  Newspaper,
  PieChart,
  User,
} from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { TabItem } from '../../types';
import ComingSoonPopup from '../ui/ComingSoonPopup';

const TAB_CONFIG: TabItem[] = [
  { id: 'index', icon: Home, label: 'Home', route: '/' },
  { id: 'portfolio', icon: PieChart, label: 'Portfolio' },
  { id: 'charts', icon: BarChart2, label: 'Charts' },
  { id: 'news', icon: Newspaper, label: 'News' },
  { id: 'profile', icon: User, label: 'Profile' },
];

export default function BottomTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const [comingSoon, setComingSoon] = useState<string | null>(null);

  const handlePress = (item: TabItem) => {
    if (item.route) {
      router.push(item.route);
    } else {
      setComingSoon(item.label);
      setTimeout(() => setComingSoon(null), 1500);
    }
  };

  return (
    <View
      pointerEvents="box-none"
      className="absolute inset-x-0 z-50 w-full items-center justify-center px-4"
      style={{ bottom: insets.bottom + 12 }}
    >
      <View className="w-full max-w-md flex-row items-center justify-between gap-1.5 rounded-2xl border border-border-2 bg-surface/95 px-3 py-1.5 shadow-lg">
        {TAB_CONFIG.map((item) => {
          const isActive = pathname === item.route;
          const Icon = item.icon;

          return (
            <Pressable
              key={item.id}
              onPress={() => handlePress(item)}
              className={`relative h-14 flex-1 items-center justify-center rounded-xl p-2 ${
                isActive ? 'bg-white/10' : ''
              }`}
            >
              <View className={isActive ? '-translate-y-2' : ''}>
                <Icon size={20} color={isActive ? '#ffffff' : '#6b7280'} />
              </View>
              <Text
                className={`font-Poppins_500Medium absolute bottom-1.5 text-[10px] ${
                  isActive ? 'text-white' : 'translate-y-1 text-muted opacity-0'
                }`}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ComingSoonPopup label={comingSoon} isVisible={!!comingSoon} />
    </View>
  );
}
