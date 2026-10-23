import { Fragment, useId, useState } from "react";
import { View } from "react-native";
import Svg, {
  Circle,
  ClipPath,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text,
} from "react-native-svg";
import { buildChartGeometry, dateTickOffsets, formatChartValue } from "@/lib/chart";
import { colors } from "@/lib/constants";
import { formatDate, fromIsoDate, addDays } from "@/lib/dates";
import { formatBodyMetric } from "@/lib/numbers";

type ChartValue = { date: string; value: number; unit: string };

export default function LineChart({
  title,
  values,
  startDate,
  endDate,
  maxGapDays,
}: {
  title: string;
  values: ChartValue[];
  startDate: string;
  endDate: string;
  maxGapDays: number;
}) {
  const [width, setWidth] = useState(0);
  const uniqueId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const height = 184;
  const left = 54;
  const right = 12;
  const top = 14;
  const bottom = 35;
  if (!values.length) return null;
  const orderedValues = [...values].sort((a, b) => a.date.localeCompare(b.date));
  const { points, segments, yTicks, plot } = buildChartGeometry(orderedValues, width, height, {
    startDate,
    endDate,
    left,
    right,
    top,
    bottom,
    maxGapDays,
  });
  const first = orderedValues[0];
  const latest = orderedValues.at(-1) ?? first;
  const latestPoint = points.at(-1);
  const labelsClose =
    latestPoint && Math.abs(latest.value - first.value) > 0.000001
      ? Math.abs(latestPoint.y - points[0].y) < 16
      : false;
  const dayNumber = (value: string) => {
    const [year, month, day] = value.split("-").map(Number);
    return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
  };
  const dayCount = Math.max(1, dayNumber(endDate) - dayNumber(startDate) + 1);
  const dateTicks = dateTickOffsets(dayCount).map((offset) => {
    const date = addDays(startDate, Math.min(offset, dayCount - 1));
    const position = left + 5 + (offset / (dayCount - 1 || 1)) * (width - left - right - 10);
    return { date, position };
  });
  const accessibilityLabel = `${title} chart. ${values.length} recorded ${values.length === 1 ? "value" : "values"}. First: ${formatBodyMetric(first.value)} ${first.unit} on ${formatDate(first.date)}. Latest: ${formatBodyMetric(latest.value)} ${latest.unit} on ${formatDate(latest.date)}.`;

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      className="mt-2 h-[184px]"
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
    >
      {width > left + right ? (
        <Svg width={width} height={height}>
          <Defs>
            <LinearGradient id={`chartFill-${uniqueId}`} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={colors.berry} stopOpacity={0.23} />
              <Stop offset="1" stopColor={colors.berry} stopOpacity={0.015} />
            </LinearGradient>
            <ClipPath id={`chartClip-${uniqueId}`}>
              <Rect
                x={plot.left}
                y={plot.top}
                width={plot.right - plot.left}
                height={plot.bottom - plot.top}
              />
            </ClipPath>
          </Defs>

          {yTicks
            .filter(
              (tick) =>
                Math.abs(tick - first.value) > (yTicks[1] - yTicks[0]) * 0.16 &&
                Math.abs(tick - latest.value) > (yTicks[1] - yTicks[0]) * 0.16,
            )
            .map((tick) => {
              const y =
                top +
                ((Math.max(...yTicks) - tick) / (Math.max(...yTicks) - Math.min(...yTicks) || 1)) *
                  (plot.bottom - top);
              return (
                <Fragment key={tick}>
                  <Line
                    x1={plot.left}
                    x2={plot.right}
                    y1={y}
                    y2={y}
                    stroke={colors.outline}
                    strokeDasharray="2 4"
                  />
                  <Text
                    x={plot.left - 7}
                    y={y + 3.5}
                    textAnchor="end"
                    fontSize={10}
                    fill={colors.muted}
                  >
                    {formatChartValue(tick)}
                  </Text>
                </Fragment>
              );
            })}

          <G clipPath={`url(#chartClip-${uniqueId})`}>
            {segments.map((segment) => {
              if (segment.length < 2) return null;
              const linePath = segment
                .map((point, pointIndex) => `${pointIndex ? "L" : "M"}${point.x},${point.y}`)
                .join(" ");
              const areaPath = `${linePath} L ${segment.at(-1)?.x},${plot.bottom} L ${segment[0].x},${plot.bottom} Z`;
              return (
                <Path
                  key={`area-${segment[0].date}`}
                  d={areaPath}
                  fill={`url(#chartFill-${uniqueId})`}
                />
              );
            })}
            {points.length > 1 ? (
              <>
                <Line
                  x1={plot.left}
                  x2={plot.right}
                  y1={points[0].y}
                  y2={points[0].y}
                  stroke={colors.muted}
                  strokeWidth={1.2}
                  strokeDasharray="2 4"
                />
                {Math.abs(latest.value - first.value) > 0.000001 ? (
                  <Line
                    x1={plot.left}
                    x2={plot.right}
                    y1={points.at(-1)?.y}
                    y2={points.at(-1)?.y}
                    stroke={colors.berry}
                    strokeWidth={1.2}
                    strokeDasharray="2 4"
                  />
                ) : null}
              </>
            ) : (
              <Line
                x1={plot.left}
                x2={plot.right}
                y1={points[0].y}
                y2={points[0].y}
                stroke={colors.berry}
                strokeWidth={1.2}
                strokeDasharray="2 4"
              />
            )}
            {segments.map((segment) =>
              segment.length > 1 ? (
                <Path
                  key={`line-${segment[0].date}`}
                  d={segment
                    .map((point, pointIndex) => `${pointIndex ? "L" : "M"}${point.x},${point.y}`)
                    .join(" ")}
                  fill="none"
                  stroke={colors.berry}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : null,
            )}
            {points.map((point, index) => (
              <Circle
                key={point.date}
                cx={point.x}
                cy={point.y}
                r={index === points.length - 1 ? 5 : 3.5}
                fill={colors.white}
                stroke={colors.berry}
                strokeWidth={2.5}
              />
            ))}
          </G>

          <Text
            x={plot.left - 7}
            y={points[0].y + (labelsClose ? -7 : 3.5)}
            textAnchor="end"
            fontSize={10}
            fontWeight="600"
            fill={colors.muted}
          >
            {formatChartValue(first.value)}
          </Text>
          {Math.abs(latest.value - first.value) > 0.000001 ? (
            <Text
              x={plot.left - 7}
              y={(latestPoint?.y ?? top) + (labelsClose ? 14 : 3.5)}
              textAnchor="end"
              fontSize={10}
              fontWeight="600"
              fill={colors.berry}
            >
              {formatChartValue(latest.value)}
            </Text>
          ) : null}
          {dateTicks.map(({ date, position }, index) => {
            const label = new Intl.DateTimeFormat(undefined, {
              month: "short",
              ...(dayCount > 90 ? { year: "numeric" as const } : { day: "numeric" as const }),
            }).format(fromIsoDate(date));
            return (
              <Fragment key={date}>
                <Line
                  x1={position}
                  x2={position}
                  y1={plot.bottom}
                  y2={plot.bottom + 3}
                  stroke={colors.mutedLight}
                />
                <Text
                  x={position}
                  y={plot.bottom + 17}
                  textAnchor={
                    index === 0 ? "start" : index === dateTicks.length - 1 ? "end" : "middle"
                  }
                  fontSize={9}
                  fill={colors.muted}
                >
                  {label}
                </Text>
              </Fragment>
            );
          })}
        </Svg>
      ) : null}
    </View>
  );
}
