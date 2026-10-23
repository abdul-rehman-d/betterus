export type ChartDatum = { date: string; value: number };
export type ChartPoint = ChartDatum & { x: number; y: number };

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
  if (days <= 7) return [0, 3, 6];
  if (days <= 30) return [0, 7, 14, 21, 29];
  if (days <= 90) return [0, 21, 42, 63, 89];
  return [0, 90, 180, 270, 364];
}
