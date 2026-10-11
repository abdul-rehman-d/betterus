export function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function fromIsoDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day, 12);
}

export function addDays(value: string, amount: number) {
  const date = fromIsoDate(value);
  date.setDate(date.getDate() + amount);
  return toIsoDate(date);
}

export function startOfRange(end: string, days: number) {
  return addDays(end, -(days - 1));
}

export function formatDate(value: string, options?: Intl.DateTimeFormatOptions) {
  return fromIsoDate(value).toLocaleDateString(
    undefined,
    options ?? {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );
}

export function isSunday(value: string) {
  return fromIsoDate(value).getDay() === 0;
}

export function weekAround(value: string) {
  return Array.from({ length: 7 }, (_, index) => addDays(value, index - 3));
}

export function calendarGrid(monthIso: string) {
  const month = fromIsoDate(monthIso);
  const first = new Date(month.getFullYear(), month.getMonth(), 1, 12);
  const start = new Date(first);
  start.setDate(1 - first.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return { date: toIsoDate(day), inMonth: day.getMonth() === month.getMonth() };
  });
}

export function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
