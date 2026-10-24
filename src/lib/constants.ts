const lightColors = {
  background: "#FFF9FA",
  backgroundDeep: "#FBEFF3",
  berry: "#B51E52",
  berryDark: "#81143C",
  berryLight: "#D94B7C",
  petal: "#FFD7E4",
  petalSoft: "#FFF0F5",
  plum: "#2A131E",
  muted: "#765F68",
  mutedLight: "#A38E96",
  outline: "#EAD7DE",
  outlineSoft: "#F3E7EB",
  success: "#16834A",
  successSoft: "#E8F7EE",
  danger: "#B42335",
  dangerSoft: "#FFF0F1",
  gold: "#B87924",
  goldSoft: "#FFF4DF",
  white: "#FFFFFF",
  overlay: "rgba(42, 19, 30, 0.34)",
} as const;

const darkColors = {
  ...lightColors,
  background: "#1D1218",
  backgroundDeep: "#281820",
  berry: "#F0789E",
  berryDark: "#A6375E",
  berryLight: "#D95F87",
  petal: "#653044",
  petalSoft: "#38202B",
  plum: "#FFF1F5",
  muted: "#D1B8C2",
  mutedLight: "#A88D98",
  outline: "#573745",
  outlineSoft: "#422B35",
  success: "#65D99A",
  successSoft: "#20392C",
  danger: "#FF8390",
  dangerSoft: "#43242B",
  gold: "#F2C06F",
  goldSoft: "#40321F",
  white: "#30212A",
  overlay: "rgba(12, 7, 10, 0.68)",
} as const;

export { darkColors, lightColors };
export type AppColors = { [K in keyof typeof lightColors]: string };
export const colors = lightColors;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  section: 32,
  screen: 20,
} as const;

export const radii = {
  sm: 12,
  md: 18,
  lg: 24,
  card: 28,
  pill: 999,
} as const;

export const shadows = {
  card: {
    shadowColor: "#5F223A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.11,
    shadowRadius: 20,
  },
  floating: {
    shadowColor: "#4A172D",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
  },
} as const;

export const genders = [
  { value: "man", label: "Male", icon: "gender-male" },
  { value: "woman", label: "Female", icon: "gender-female" },
] as const;

export const measurements = [
  ["neck", "Neck"],
  ["shoulders", "Shoulders"],
  ["chest_bust", "Chest / Bust"],
  ["underbust", "Underbust"],
  ["waist", "Waist"],
  ["abdomen_at_navel", "Abdomen"],
  ["hips_glutes", "Hips / Glutes"],
  ["biceps_relaxed", "Biceps (relaxed)"],
  ["biceps_flexed", "Biceps (flexed)"],
  ["forearms", "Forearms"],
  ["thighs", "Thighs"],
  ["calves", "Calves"],
] as const;

export type Gender = (typeof genders)[number]["value"];
export type MeasurementKey = (typeof measurements)[number][0];
export type WeightUnit = "kg" | "lb";
export type MeasurementUnit = "cm" | "in";

export const measurementLabel = (key: MeasurementKey) =>
  measurements.find(([value]) => value === key)?.[1] ?? key;
