import { useFearGreedQuery } from '@/services/queries';
import { ChevronRight } from 'lucide-react-native';
import { ActivityIndicator, Text, View } from 'react-native';
import { clamp } from 'react-native-reanimated';
import Svg, { Circle, G, Path } from 'react-native-svg';

const GAUGE_COLORS = ['#b91c1c', '#ef4444', '#facc15', '#4ade80', '#16a34a'];

export default function FearGreedCard() {
  const { data, isLoading } = useFearGreedQuery();

  const value = clamp(data?.value ?? 0, 0, 100);
  const label = isLoading ? 'Loading...' : (data?.label ?? '_');

  // SVG Geometry
  const strokeWidth = 4.5;
  const radius = 44;
  const centerX = 50;
  const centerY = 48;
  const gaugePath = `M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`;

  const arcLength = Math.PI * radius;
  const gapSize = 6.5;
  const dashLength = (arcLength - gapSize * 4) / 5;
  const stepOffset = dashLength + gapSize;

  return (
    <View className="border-border-2 bg-surface-2 flex-1 rounded-xl border p-3">
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="font-psemibold text-muted text-sm">Fear & Greed</Text>
        <ChevronRight size={18} color="#5f7d73" />
      </View>

      <View
        className="mt-4 w-full items-center justify-center"
        style={{ aspectRatio: 100 / 55 }}
      >
        {isLoading ? (
          <ActivityIndicator color="#29d18b" />
        ) : (
          <View className="relative h-full w-full items-center">
            <Svg
              width="100%"
              height="100%"
              viewBox="0 0 100 55"
              className="absolute top-0"
            >
              {/* The Track */}
              {GAUGE_COLORS.map((color, index) => (
                <Path
                  key={color}
                  d={gaugePath}
                  stroke={color}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={`${dashLength} 150`}
                  strokeDashoffset={-(index * stepOffset)}
                />
              ))}

              <G
                transform={`rotate(${(value / 100) * 180}, ${centerX}, ${centerY})`}
              >
                <Circle
                  cx={centerX - radius}
                  cy={centerY}
                  r="4"
                  fill="#d8f1e7"
                  stroke="#0e0e0e"
                  strokeWidth="2.5"
                />
              </G>
            </Svg>

            <View className="absolute bottom-1.5 items-center justify-end">
              <Text className="font-psemibold text-text text-2xl leading-6">
                {value}
              </Text>
              <Text className="font-pmedium text-muted mt-0.5 text-sm capitalize">
                {label}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
