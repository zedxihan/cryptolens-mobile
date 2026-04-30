import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const S = { dampingRatio: 1, duration: 400 };

export const ExpandableTabs = ({
  tabs,
  selectedId,
  onTabSelect,
  activeColor = '#29d18b',
  activeBgColor = 'rgba(41, 209, 139, 0.15)',
  inactiveColor = '#71717a',
}: any) => (
  <View className="border-border bg-surface/95 flex-row items-center gap-1.5 rounded-2xl border p-1 px-2 shadow-lg">
    {tabs.map((t: any, i: number) =>
      t.type === 'separator' ? (
        <View key={i} className="bg-border mx-1 h-7 w-px" />
      ) : (
        <TabButton
          key={t.id}
          t={t}
          sel={selectedId === t.id}
          onSel={() => onTabSelect(t.id)}
          active={activeColor}
          bg={activeBgColor}
          inactive={inactiveColor}
        />
      ),
    )}
  </View>
);

const TabButton = ({ t, sel, onSel, active, bg, inactive }: any) => {
  const [w, setW] = useState(0);
  const p = useSharedValue(sel ? 1 : 0);
  useEffect(() => {
    p.value = withSpring(sel ? 1 : 0, S);
  }, [sel]);

  const style = useAnimatedStyle(() => ({
    paddingHorizontal: interpolate(p.value, [0, 1], [12, 22]),
    gap: interpolate(p.value, [0, 1], [0, 8]),
    backgroundColor: interpolateColor(p.value, [0, 1], ['transparent', bg]),
  }));

  const textStyle = useAnimatedStyle(() => ({
    width: interpolate(p.value, [0, 1], [0, w]),
    opacity: p.value,
  }));
  const Icon = t.icon;

  return (
    <Pressable onPress={onSel}>
      <Animated.View
        style={[
          style,
          {
            height: 48,
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 16,
          },
        ]}
      >
        <Icon
          size={20}
          color={sel ? active : inactive}
          strokeWidth={sel ? 2.5 : 2}
        />
        <View style={{ position: 'absolute', opacity: 0 }} pointerEvents="none">
          <Text
            onLayout={(e) => setW(e.nativeEvent.layout.width)}
            className="font-psemibold text-sm"
          >
            {t.title}
          </Text>
        </View>
        <Animated.View style={[textStyle, { overflow: 'hidden' }]}>
          <Text
            className="font-psemibold text-sm"
            numberOfLines={1}
            style={{ width: w, color: active }}
          >
            {t.title}
          </Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};
