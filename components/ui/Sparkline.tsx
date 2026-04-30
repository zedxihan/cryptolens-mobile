import { memo } from 'react';
import { View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

interface SparklineProps {
  data: number[];
  isPositive: boolean;
  strokeWidth?: number;
  width?: number;
  height?: number;
}

export default function Sparkline({
  data,
  isPositive,
  strokeWidth = 2,
  width = 80,
  height = 40,
}: SparklineProps) {
  if (!data || data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  const color = isPositive ? '#00a83e' : '#ff3a33';

  return (
    <View style={{ width, height }}>
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
}

// SPARKLINE CELL
interface SparklineCellProps {
  data: number[];
  isPositive: boolean;
  strokeWidth?: number;
  className?: string;
}

export const SparklineCell = memo(function SparklineCell({
  data,
  isPositive,
  strokeWidth = 2,
  className = '',
}: SparklineCellProps) {
  return (
    <View className={`items-end justify-center ${className}`}>
      <Sparkline
        data={data}
        isPositive={isPositive}
        strokeWidth={strokeWidth}
      />
    </View>
  );
});
