import { formatCurrency, formatPrice } from '@/utils/format';
import { scaleLinear, scaleTime } from 'd3-scale';
import * as d3 from 'd3-shape';
import { useId, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, Text, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Path,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

const [H, YW, L_CLR, ACC] = [220, 45, '#86a79b', '#29d18b'];

export default function AreaChart({
  data,
  dataKey = 'price',
  accentColor = ACC,
}: any) {
  const gradId = `grad-${useId().replace(/\W/g, '')}`;
  const [plotW, setPlotW] = useState(0);
  const [hoverX, setHoverX] = useState<number | null>(null);

  const animX = useRef(new Animated.Value(0)).current;
  const animY = useRef(new Animated.Value(0)).current;

  const isMcap = dataKey === 'market_cap' || dataKey === 'marketCap';
  const fmtV = (v: number) =>
    !isFinite(v)
      ? '$0'
      : isMcap
        ? formatCurrency(v, { compact: true })
        : formatPrice(v);
  const fmtD = (t: number) =>
    new Date(t).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

  const engine = useMemo(
    () => calcEngine(data, dataKey, plotW, H),
    [data, dataKey, plotW],
  );

  const pan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (e) => setHoverX(e.nativeEvent.locationX),
        onPanResponderMove: (e) => setHoverX(e.nativeEvent.locationX),
        onPanResponderRelease: () => setHoverX(null),
        onPanResponderTerminate: () => setHoverX(null),
      }),
    [],
  );

  if (!engine || plotW <= 0)
    return (
      <View
        className="min-h-[220px] flex-1"
        onLayout={(e) => setPlotW(e.nativeEvent.layout.width - YW)}
      />
    );

  const active =
    hoverX !== null
      ? engine.pts.reduce((p: any, curr: any) =>
          Math.abs(engine.xSc(curr.t) - hoverX) <
          Math.abs(engine.xSc(p.t) - hoverX)
            ? curr
            : p,
        )
      : null;

  if (active) {
    Animated.spring(animX, {
      toValue:
        engine.xSc(active.t) > plotW / 2
          ? engine.xSc(active.t) - 150
          : engine.xSc(active.t) + 12,
      useNativeDriver: true,
      speed: 24,
      bounciness: 0,
    }).start();
    Animated.spring(animY, {
      toValue: Math.min(Math.max(engine.ySc(active.v) - 30, 0), H - 58),
      useNativeDriver: true,
      speed: 24,
      bounciness: 0,
    }).start();
  }

  return (
    <View className="w-full flex-1">
      <View style={{ height: H + 30 }} {...pan.panHandlers}>
        <Svg width={plotW + YW} height={H + 30}>
          <Defs>
            <LinearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="5%" stopColor={accentColor} stopOpacity={0.32} />
              <Stop offset="95%" stopColor={accentColor} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Path d={engine.area} fill={`url(#${gradId})`} />
          <Path
            d={engine.line}
            fill="none"
            stroke={accentColor}
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {engine.yL.map((v: number, i: number) => (
            <SvgText
              key={`y-${i}`}
              x={plotW + 5}
              y={Math.min(Math.max(engine.ySc(v) + 4, 11), H - 2)}
              fill={L_CLR}
              fontSize={11}
            >
              {fmtV(v)}
            </SvgText>
          ))}
          {engine.xL.map((l: any, i: number) => (
            <SvgText
              key={`x-${i}`}
              x={engine.xSc(l.pt.t)}
              y={H + 20}
              fill={L_CLR}
              fontSize={11}
              textAnchor={l.a}
            >
              {fmtD(l.pt.t)}
            </SvgText>
          ))}

          {active && (
            <>
              <Line
                x1={engine.xSc(active.t)}
                x2={engine.xSc(active.t)}
                y1={0}
                y2={H}
                stroke={accentColor}
                strokeWidth={1}
              />
              <Circle
                cx={engine.xSc(active.t)}
                cy={engine.ySc(active.v)}
                r={4}
                fill={accentColor}
              />
            </>
          )}
        </Svg>

        {active && (
          <Animated.View
            className="absolute min-w-[135px] rounded-lg border border-[rgba(148,255,214,0.18)] bg-surface p-3 shadow-lg"
            style={{
              transform: [{ translateX: animX }, { translateY: animY }],
            }}
          >
            <Text className="mb-1 text-xs text-muted">{fmtD(active.t)}</Text>
            <Text
              className="text-[13px] font-semibold tabular-nums"
              style={{ color: accentColor }}
            >
              {isMcap ? 'Market Cap : ' : 'Price : '}
              {fmtV(active.v)}
            </Text>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

// Math Engine
function calcEngine(data: any[], key: string, w: number, h: number) {
  const pts = (data || [])
    .map((d: any) => ({ v: Number(d?.[key]), t: Number(d?.timestamp) }))
    .filter((d: any) => isFinite(d.v) && d.v > 0);
  if (pts.length < 2 || w <= 0) return null;
  pts.sort((a, b) => a.t - b.t);

  const minV = Math.min(...pts.map((p) => p.v));
  const maxV = Math.max(...pts.map((p) => p.v));

  const tick = (maxV - minV) / 4 || 1;
  const mag = Math.pow(10, Math.floor(Math.log10(tick)));
  const nice =
    mag * (tick / mag < 1.5 ? 1 : tick / mag < 3 ? 2 : tick / mag < 7 ? 5 : 10);
  const yMin = Math.floor(minV / nice) * nice;
  const yMax = Math.ceil(maxV / nice) * nice;

  const xSc = scaleTime()
    .domain([pts[0].t, pts[pts.length - 1].t])
    .range([0, w]);
  const ySc = scaleLinear().domain([yMin, yMax]).range([h, 0]);

  return {
    pts,
    xSc,
    ySc,
    line:
      d3
        .line<any>()
        .x((d) => xSc(d.t))
        .y((d) => ySc(d.v))
        .curve(d3.curveMonotoneX)(pts) || '',
    area:
      d3
        .area<any>()
        .x((d) => xSc(d.t))
        .y0(h)
        .y1((d) => ySc(d.v))
        .curve(d3.curveMonotoneX)(pts) || '',
    xL: [0, 1, 2, 3, 4].map((i) => ({
      pt: pts[Math.round((i * (pts.length - 1)) / 4)],
      a: i === 0 ? 'start' : i === 4 ? 'end' : ('middle' as const),
    })),
    yL: [0, 1, 2, 3, 4].map((i) => yMin + ((yMax - yMin) * i) / 4),
  };
}
