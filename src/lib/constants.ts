export const colors = {
  background: "#FFF8F8",
  berry: "#B91F54",
  berryDark: "#8F1642",
  petal: "#FFDCE7",
  petalSoft: "#FFF0F4",
  plum: "#2B141F",
  muted: "#765A65",
  outline: "#E8D5DB",
  success: "#188A42",
  danger: "#BA1A1A",
  white: "#FFFFFF",
} as const;

export const genders = [
  { value: "woman", label: "Woman", icon: "gender-female" },
  { value: "man", label: "Man", icon: "gender-male" },
  { value: "non_binary", label: "Non-binary", icon: "gender-non-binary" },
  { value: "prefer_not_to_say", label: "Prefer not to say", icon: "dots-horizontal" },
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
