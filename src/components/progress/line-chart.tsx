import { useState } from "react";
import { View } from "react-native";
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop } from "react-native-svg";
import { buildChartGeometry } from "@/lib/chart";
import { colors } from "@/lib/constants";
import { formatBodyMetric } from "@/lib/numbers";

export default function LineChart({ values }: { values: Array<{ date: string; value: number }> }) {
  const [width, setWidth] = useState(0);
  const height = 150;
  const pad = 14;
  if (!values.length) return null;
  const { path, points } = buildChartGeometry(values, width, height, pad);
  return (
    <View
      accessible
      accessibilityLabel={`Chart from ${formatBodyMetric(values[0].value)} to ${formatBodyMetric(values.at(-1)?.value ?? values[0].value)}`}
      className="mt-2 h-[150px]"
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
    >
      {width ? (
        <Svg width={width} height={height}>
          <Defs>
            <LinearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={colors.berry} stopOpacity={0.18} />
              <Stop offset="1" stopColor={colors.berry} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          {[0.25, 0.5, 0.75].map((fraction) => (
            <Line
              key={fraction}
              x1={pad}
              x2={width - pad}
              y1={height * fraction}
              y2={height * fraction}
              stroke={colors.outline}
              strokeDasharray="3 4"
            />
          ))}
          {points.length > 1 ? (
            <Path
              d={`${path} L ${points.at(-1)?.x ?? pad} ${height - pad} L ${points[0]?.x ?? pad} ${height - pad} Z`}
              fill="url(#chartFill)"
            />
          ) : null}
          <Path
            d={path}
            fill="none"
            stroke={colors.berry}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {points.map((point, index) => (
            <Circle
              key={values[index].date}
              cx={point.x}
              cy={point.y}
              r={index === points.length - 1 ? 5 : 3.5}
              fill={colors.white}
              stroke={colors.berry}
              strokeWidth={2.5}
            />
          ))}
        </Svg>
      ) : null}
    </View>
  );
}
