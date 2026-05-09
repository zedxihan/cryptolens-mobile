import { memo } from 'react';
import { View, ViewStyle } from 'react-native';
import Svg, { Polyline, Rect } from 'react-native-svg';

interface ChartProps {
  data: (number | { value: number })[];
  width?: number;
  height?: number;
  style?: ViewStyle;
}

const getValues = (data: (number | { value: number })[]) =>
  data.map((d) => (typeof d === 'number' ? d : d.value));

// sparkline
interface SparklineProps extends ChartProps {
  isPositive?: boolean;
  strokeWidth?: number;
}

export const Sparkline = memo(function Sparkline({
  data,
  isPositive,
  strokeWidth = 2,
  width = 80,
  height = 40,
  style,
}: SparklineProps) {
  if (!data?.length) return null;

  const values = getValues(data);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  const color = isPositive ? '#00a83e' : '#ff3a33';

  return (
    <View style={[{ width, height }, style]}>
      <Svg
        width="100%"
        height="100%"
        viewBox={`0 -${strokeWidth} ${width} ${height + strokeWidth * 2}`}
      >
        <Polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
});

export const SparklineCell = memo(function SparklineCell(props: any) {
  return (
    <View className="items-end justify-center">
      <Sparkline {...props} />
    </View>
  );
});

// barchart
interface BarChartProps extends ChartProps {
  positiveColor?: string;
  negativeColor?: string;
}

export const MiniBarChart = memo(function MiniBarChart({
  data,
  width = 56,
  height = 32,
  positiveColor = '#00a83e',
  negativeColor = '#ff3a33',
  style,
}: BarChartProps) {
  if (!data?.length) return null;

  const values = getValues(data);
  const max = Math.max(...values.map(Math.abs), 1);
  const midPoint = height / 2;

  const barCount = values.length;
  const barWidth = 5;
  const spacing = (width - barWidth) / (barCount - 1 || 1);

  return (
    <View style={[{ width, height }, style]}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        {values.map((val, i) => {
          const barHeight = (Math.abs(val) / max) * midPoint;
          const y = val >= 0 ? midPoint - barHeight : midPoint;

          return (
            <Rect
              key={i}
              x={i * spacing}
              y={y}
              width={barWidth}
              height={Math.max(barHeight, 1)}
              fill={val >= 0 ? positiveColor : negativeColor}
              rx={1.5}
              opacity={i === barCount - 1 ? 1 : 0.6}
            />
          );
        })}
      </Svg>
    </View>
  );
});
