export function formatBodyMetric(value: number) {
  return value.toFixed(2);
}

export function roundBodyMetric(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
