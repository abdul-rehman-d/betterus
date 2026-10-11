import { useForm } from "@tanstack/react-form";
import { router } from "expo-router";
import { View } from "react-native";
import ProgressHeader from "@/components/onboarding/progress-header";
import StepIntro from "@/components/onboarding/step-intro";
import AppButton from "@/components/ui/app-button";
import AppScreen from "@/components/ui/app-screen";
import AppText from "@/components/ui/app-text";
import InfoCallout from "@/components/ui/info-callout";
import SegmentedControl from "@/components/ui/segmented-control";
import type { MeasurementUnit, WeightUnit } from "@/lib/constants";
import { useOnboarding } from "@/providers/onboarding-provider";

export default function UnitsStep() {
  const { draft, update } = useOnboarding();
  const form = useForm({
    defaultValues: { weightUnit: draft.weightUnit, measurementUnit: draft.measurementUnit },
    onSubmit: ({ value }) => {
      update(value);
      router.push("/(onboarding)/measurements");
    },
  });
  return (
    <AppScreen>
      <ProgressHeader step={3} />
      <StepIntro
        eyebrow="Preferences"
        icon="tune-variant"
        title="Choose your units"
        body="Select how weight and body measurements are displayed."
      />
      <form.Field name="weightUnit">
        {(field) => (
          <View className="gap-3">
            <AppText variant="subtitle">Weight</AppText>
            <SegmentedControl<WeightUnit>
              value={field.state.value}
              onChange={field.handleChange}
              options={[
                { label: "Kilograms (kg)", value: "kg" },
                { label: "Pounds (lb)", value: "lb" },
              ]}
            />
          </View>
        )}
      </form.Field>
      <form.Field name="measurementUnit">
        {(field) => (
          <View className="gap-3">
            <AppText variant="subtitle">Measurements</AppText>
            <SegmentedControl<MeasurementUnit>
              value={field.state.value}
              onChange={field.handleChange}
              options={[
                { label: "Centimeters (cm)", value: "cm" },
                { label: "Inches (in)", value: "in" },
              ]}
            />
          </View>
        )}
      </form.Field>
      <InfoCallout icon="history">
        Changing preferences later only changes how values are displayed. Your historical entries
        keep their original precision.
      </InfoCallout>
      <AppButton label="Continue" icon="arrow-right" onPress={() => void form.handleSubmit()} />
    </AppScreen>
  );
}
