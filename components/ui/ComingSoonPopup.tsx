import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ComingSoonPopupProps = {
  label: string | null;
  isVisible: boolean;
};

export default function ComingSoonPopup({
  label,
  isVisible,
}: ComingSoonPopupProps) {
  const insets = useSafeAreaInsets();

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 7,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      opacity.setValue(0);
      scale.setValue(0.9);
    }
  }, [isVisible, opacity, scale]);

  if (!isVisible) return null;

  return (
    <View
      className="pointer-events-none absolute z-50 self-center"
      style={{
        bottom: 96 + insets.bottom,
      }}
    >
      <Animated.View
        style={{ opacity, transform: [{ scale }] }}
        className="border-border/70 bg-surface mx-auto rounded-full border px-4 py-2 shadow-lg"
      >
        <Text className="font-pmedium text-center text-xs tracking-wide">
          <Text className="text-white">{label}</Text>{' '}
          <Text className="text-muted">Coming Soon</Text>
        </Text>
      </Animated.View>
    </View>
  );
}
