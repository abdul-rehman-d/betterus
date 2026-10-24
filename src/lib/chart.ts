export type ChartDatum = { date: string; value: number };
export type ChartPoint = ChartDatum & { x: number; y: number };

// A monotone cubic curve keeps peaks and dips inside the recorded values.
export function smoothChartPath(points: ChartPoint[]) {
  if (!points.length) return "";
  if (points.length === 1) return `M${points[0].x},${points[0].y}`;

  const slopes = points.slice(1).map((point, index) => {
    const previous = points[index];
    return (point.y - previous.y) / (point.x - previous.x);
  });
  const tangents = points.map((_, index) => {
    if (index === 0) return slopes[0];
    if (index === points.length - 1) return slopes.at(-1) ?? 0;
    const before = slopes[index - 1];
    const after = slopes[index];
    return before * after <= 0 ? 0 : (2 * before * after) / (before + after);
  });

  return points.slice(1).reduce((path, point, index) => {
    const previous = points[index];
    const third = (point.x - previous.x) / 3;
    return `${path} C${previous.x + third},${previous.y + tangents[index] * third} ${point.x - third},${point.y - tangents[index + 1] * third} ${point.x},${point.y}`;
  }, `M${points[0].x},${points[0].y}`);
}

function dayNumber(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
}

function niceStep(span: number, targetCount: number) {
  const rough = span / Math.max(1, targetCount - 1);
  const power = 10 ** Math.floor(Math.log10(rough));
  const fraction = rough / power;
  return (
    (fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 2.5 ? 2.5 : fraction <= 5 ? 5 : 10) * power
  );
}

export function buildChartGeometry(
  values: ChartDatum[],
  width: number,
  height = 184,
  options: {
    startDate: string;
    endDate: string;
    left: number;
    right: number;
    top: number;
    bottom: number;
    maxGapDays?: number;
  },
) {
  const { startDate, endDate, left, right, top, bottom, maxGapDays = 1.5 } = options;
  if (!values.length || width <= left + right) {
    return {
      points: [] as ChartPoint[],
      segments: [] as ChartPoint[][],
      yTicks: [] as number[],
      plot: { left, right: width - right, top, bottom: height - bottom },
    };
  }

  const rawMin = Math.min(...values.map((item) => item.value));
  const rawMax = Math.max(...values.map((item) => item.value));
  const rawSpan = rawMax - rawMin;
  const padding = rawSpan > 0 ? rawSpan * 0.18 : Math.max(Math.abs(rawMin) * 0.025, 0.5);
  const step = niceStep(rawSpan + padding * 2, 4);
  const min = Math.floor((rawMin - padding) / step) * step;
  const max = Math.ceil((rawMax + padding) / step) * step;
  const ySpan = max - min || step;
  const start = dayNumber(startDate);
  const end = Math.max(start + 1, dayNumber(endDate));
  const points = values.map((item) => ({
    ...item,
    x: left + 5 + ((dayNumber(item.date) - start) / (end - start)) * (width - left - right - 10),
    y: top + ((max - item.value) / ySpan) * (height - top - bottom),
  }));

  const segments: ChartPoint[][] = [];
  for (const point of points) {
    const segment = segments.at(-1);
    const previous = segment?.at(-1);
    if (!segment || !previous || dayNumber(point.date) - dayNumber(previous.date) > maxGapDays) {
      segments.push([point]);
    } else {
      segment.push(point);
    }
  }
  const yTicks = Array.from(
    { length: Math.round((max - min) / step) + 1 },
    (_, index) => min + index * step,
  );
  return {
    points,
    segments,
    yTicks,
    plot: { left, right: width - right, top, bottom: height - bottom },
  };
}

export function formatChartValue(value: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value);
}

export function dateTickOffsets(days: number) {
  const last = Math.max(0, days - 1);
  const tickCount = Math.min(days, days <= 7 ? 3 : days <= 30 ? 4 : 5);
  if (tickCount <= 1) return [0];
  return Array.from({ length: tickCount }, (_, index) =>
    Math.round((index / (tickCount - 1)) * last),
  );
}
