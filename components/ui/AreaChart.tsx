import { formatCurrency, formatPrice } from '@/utils/format';
import { scaleLinear, scaleTime } from 'd3-scale';
import * as d3 from 'd3-shape';
import React, { memo, useId, useMemo, useState } from 'react';
import { PanResponder, StyleSheet, Text, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Path,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

const [H, W, L_CLR, ACC] = [220, 45, '#86a79b', '#29d18b'];

export default memo(function AreaChart({
  data,
  dataKey = 'price',
  accentColor = ACC,
}: any) {
  const gradId = `grad-${useId().replace(/\W/g, '')}`;
  const [plotW, setPlotW] = useState(0);
  const [hoverX, setHoverX] = useState<number | null>(null);

  const isMcap = dataKey === 'market_cap';
  const fmtV = (v: number) =>
    isMcap ? formatCurrency(v, { compact: true }) : formatPrice(v);
  const fmtD = (t: number) =>
    new Date(t).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

  const engine = useMemo(
    () => calcEngine(data, dataKey, plotW),
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
        className="mt-2 min-h-[220px] flex-1"
        onLayout={(e) => setPlotW(e.nativeEvent.layout.width - W)}
      />
    );

  const active =
    hoverX !== null
      ? engine.pts.reduce((a, b) =>
          Math.abs(engine.x(b.t) - hoverX) < Math.abs(engine.x(a.t) - hoverX)
            ? b
            : a,
        )
      : null;

  return (
    <View className="mt-2 w-full flex-1">
      <View style={{ height: H + 38 }} {...pan.panHandlers}>
        <Svg width={plotW + W} height={H + 38}>
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

          {engine.yL.map((lbl, i) => (
            <SvgText
              key={i}
              x={plotW + 5}
              y={Math.min(Math.max(lbl.y + 4, 11), H - 2)}
              fill={L_CLR}
              fontSize={11}
              textAnchor="start"
            >
              {fmtV(lbl.v)}
            </SvgText>
          ))}
          {engine.xL.map((lbl, i) => (
            <SvgText
              key={i}
              x={lbl.x}
              y={H + 20}
              fill={L_CLR}
              fontSize={11}
              textAnchor={lbl.a}
            >
              {fmtD(lbl.t)}
            </SvgText>
          ))}
        </Svg>

        {active && (
          <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            <Svg style={StyleSheet.absoluteFill}>
              <Line
                x1={engine.x(active.t)}
                x2={engine.x(active.t)}
                y1={0}
                y2={H}
                stroke={accentColor}
                strokeWidth={1}
              />
              <Circle
                cx={engine.x(active.t)}
                cy={engine.y(active.v)}
                r={4}
                fill={accentColor}
              />
            </Svg>
            <View
              className="absolute min-w-[104px] rounded-lg border border-[rgba(148,255,214,0.18)] bg-surface px-3 py-2 shadow-lg"
              style={{
                left: Math.min(
                  Math.max(engine.x(active.t) - 40, 0),
                  plotW - 76,
                ),
                top: Math.min(Math.max(engine.y(active.v) - 62, 0), H - 58),
              }}
            >
              <Text className="mb-1 text-xs text-muted">{fmtD(active.t)}</Text>
              <Text
                className="text-[13px] font-semibold tabular-nums"
                style={{ color: accentColor }}
              >
                {fmtV(active.v)}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
});

// Math Engine
function calcEngine(data: any[], key: string, w: number) {
  const pts = (data || [])
    .map((d) => ({ v: Number(d?.[key]), t: Number(d?.timestamp) }))
    .filter((d) => isFinite(d.v) && d.v > 0)
    .sort((a, b) => a.t - b.t);
  if (pts.length < 2 || w <= 0) return null;

  const [minR, maxR] = [
    Math.min(...pts.map((p) => p.v)),
    Math.max(...pts.map((p) => p.v)),
  ];
  const tick = (maxR - minR) / 4 || 1;
  const mag = Math.pow(10, Math.floor(Math.log10(tick)));
  const nice =
    mag * (tick / mag < 1.5 ? 1 : tick / mag < 3 ? 2 : tick / mag < 7 ? 5 : 10);
  const [yMin, yMax] = [
    Math.floor(minR / nice) * nice,
    Math.ceil(maxR / nice) * nice,
  ];

  const scX = scaleTime()
    .domain([new Date(pts[0].t), new Date(pts[pts.length - 1].t)])
    .range([0, w]);
  const scY = scaleLinear().domain([yMin, yMax]).range([H, 0]);

  const x = (t: number) => scX(new Date(t)),
    y = (v: number) => scY(v);
  const line =
    d3
      .line<any>()
      .x((d) => x(d.t))
      .y((d) => y(d.v))
      .curve(d3.curveMonotoneX)(pts) || '';
  const area =
    d3
      .area<any>()
      .x((d) => x(d.t))
      .y0(H)
      .y1((d) => y(d.v))
      .curve(d3.curveMonotoneX)(pts) || '';

  const xL = [0, 1, 2, 3, 4].map((i) => {
    const p = pts[Math.round((i * (pts.length - 1)) / 4)];
    return {
      x: x(p.t),
      t: p.t,
      a: i === 0 ? 'start' : i === 4 ? 'end' : ('middle' as any),
    };
  });
  const yL = [0, 1, 2, 3, 4].map((i) => ({
    y: y(yMin + ((yMax - yMin) * i) / 4),
    v: yMin + ((yMax - yMin) * i) / 4,
  }));

  return { pts, line, area, x, y, xL, yL };
}
