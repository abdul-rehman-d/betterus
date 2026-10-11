export type ChartDatum = { date: string; value: number };

export function buildChartGeometry(values: ChartDatum[], width: number, height = 150, pad = 14) {
  if (!values.length) return { path: "", points: [] };
  const min = Math.min(...values.map((item) => item.value));
  const max = Math.max(...values.map((item) => item.value));
  const spread = max - min || 1;
  const timestamps = values.map((item) => new Date(`${item.date}T12:00:00`).getTime());
  const timeStart = Math.min(...timestamps);
  const timeSpread = Math.max(...timestamps) - timeStart || 1;
  const points = values.map((item, index) => ({
    x:
      values.length === 1
        ? width / 2
        : pad + ((timestamps[index] - timeStart) / timeSpread) * (width - pad * 2),
    y: pad + ((max - item.value) / spread) * (height - pad * 2),
  }));
  const path = points
    .map(
      (point, index) =>
        `${index && timestamps[index] - timestamps[index - 1] <= 86400000 * 1.5 ? "L" : "M"}${point.x},${point.y}`,
    )
    .join(" ");
  return { path, points };
}
