import { createContext, type PropsWithChildren, useContext, useMemo, useState } from "react";
import type { Gender, MeasurementKey, MeasurementUnit, WeightUnit } from "@/lib/constants";

export type OnboardingDraft = {
  username: string;
  name: string;
  gender: Gender;
  weightUnit: WeightUnit;
  measurementUnit: MeasurementUnit;
  measurementPreferences: MeasurementKey[];
};
const initial: OnboardingDraft = {
  username: "",
  name: "",
  gender: "man",
  weightUnit: "kg",
  measurementUnit: "cm",
  measurementPreferences: ["shoulders", "chest_bust", "waist", "hips_glutes", "biceps_relaxed"],
};
const Context = createContext<{
  draft: OnboardingDraft;
  update: (values: Partial<OnboardingDraft>) => void;
} | null>(null);
export function OnboardingProvider({ children }: PropsWithChildren) {
  const [draft, setDraft] = useState(initial);
  const value = useMemo(
    () => ({
      draft,
      update: (values: Partial<OnboardingDraft>) =>
        setDraft((current) => ({ ...current, ...values })),
    }),
    [draft],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useOnboarding() {
  const value = useContext(Context);
  if (!value) throw new Error("useOnboarding must be used within OnboardingProvider");
  return value;
}
