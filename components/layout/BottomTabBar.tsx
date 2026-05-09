import { usePathname, useRouter } from 'expo-router';
import {
  BarChart2,
  Calendar,
  Home,
  PieChart,
  TrendingUp,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ComingSoonPopup from '@/components/ui/ComingSoonPopup';
import { ExpandableTabs, type TabItem } from '@/components/ui/ExpandableTabs';

const TABS: TabItem[] = [
  { id: 'index', icon: Home, title: 'Home', route: '/' },
  { id: 'markets', icon: TrendingUp, title: 'Markets', route: '/markets' },
  { id: 'charts', icon: BarChart2, title: 'Charts' },
  { id: 'calendar', icon: Calendar, title: 'Calendar' },
  { type: 'separator', id: 'sep' },
  { id: 'portfolio', icon: PieChart, title: 'Portfolio' },
];

export default function BottomTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const [soon, setSoon] = useState<string | null>(null);

  useEffect(() => {
    if (soon) {
      const t = setTimeout(() => setSoon(null), 1500);
      return () => clearTimeout(t);
    }
  }, [soon]);

  const onSelect = (id: string) => {
    const tab = TABS.find((t) => t.id === id);
    if (tab?.route) router.push(tab.route);
    else if (tab?.title) setSoon(tab.title);
  };

  const activeId =
    TABS.find((t) => {
      if (!t.route) return false;
      const route = t.route as string;
      return route === '/' ? pathname === '/' : pathname.startsWith(route);
    })?.id || 'index';

  return (
    <View
      className="absolute inset-x-0 z-50 items-center"
      style={{ bottom: insets.bottom + 25 }}
      pointerEvents="box-none"
    >
      <ExpandableTabs
        tabs={TABS}
        selectedId={activeId}
        onTabSelect={onSelect}
      />
      <ComingSoonPopup label={soon} isVisible={!!soon} />
    </View>
  );
}
