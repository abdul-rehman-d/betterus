import { useState } from "react";
import { View } from "react-native";
import Svg, { Circle, Line, Path } from "react-native-svg";
import { colors } from "@/lib/constants";
import { buildChartGeometry } from "@/lib/chart";

export default function LineChart({ values }: { values: Array<{ date: string; value: number }> }) {
  const [width, setWidth] = useState(0);
  const height = 150;
  const pad = 14;
  if (!values.length) return null;
  const { path, points } = buildChartGeometry(values, width, height, pad);
  return (
    <View
      accessible
      accessibilityLabel={`Chart from ${values[0].value} to ${values.at(-1)?.value}`}
      className="mt-2 h-[150px]"
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
    >
      {width ? (
        <Svg width={width} height={height}>
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
