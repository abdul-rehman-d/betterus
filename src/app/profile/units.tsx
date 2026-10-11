import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import AppButton from "@/components/ui/app-button";
import AppScreen from "@/components/ui/app-screen";
import AppText from "@/components/ui/app-text";
import InfoCallout from "@/components/ui/info-callout";
import PageHeader from "@/components/ui/page-header";
import SegmentedControl from "@/components/ui/segmented-control";
import { ContentLoading, InlineError } from "@/components/ui/states";
import { api } from "@/convex/_generated/api";
import type { MeasurementUnit, WeightUnit } from "@/lib/constants";
import { useSession } from "@/providers/session-provider";
export default function EditUnits() {
  const { userId } = useSession();
  const user = useQuery(api.users.get, userId ? { userId } : "skip");
  if (!userId || !user)
    return (
      <AppScreen>
        <PageHeader title="Edit units" />
        <ContentLoading label="Loading unit preferences" variant="form" />
      </AppScreen>
    );
  return (
    <UnitsForm
      userId={userId}
      weightUnit={user.weightUnit}
      measurementUnit={user.measurementUnit}
    />
  );
}
function UnitsForm({
  userId,
  weightUnit,
  measurementUnit,
}: {
  userId: NonNullable<ReturnType<typeof useSession>["userId"]>;
  weightUnit: WeightUnit;
  measurementUnit: MeasurementUnit;
}) {
  const update = useMutation(api.users.updateUnits);
  const [error, setError] = useState<string | null>(null);
  const form = useForm({
    defaultValues: { weightUnit, measurementUnit },
    onSubmit: async ({ value }) => {
      setError(null);
      try {
        await update({ userId, ...value });
        router.back();
      } catch {
        setError("Could not update units.");
      }
    },
  });
  return (
    <AppScreen>
      <PageHeader title="Edit units" />
      <form.Field name="weightUnit">
        {(field) => (
          <View className="gap-3">
            <AppText variant="subtitle">Weight</AppText>
            <SegmentedControl<WeightUnit>
              value={field.state.value}
              onChange={field.handleChange}
              options={[
                { label: "Kilograms", value: "kg" },
                { label: "Pounds", value: "lb" },
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
                { label: "Centimeters", value: "cm" },
                { label: "Inches", value: "in" },
              ]}
            />
          </View>
        )}
      </form.Field>
      <InfoCallout icon="history">
        Existing records stay in their original units and are converted only for display.
      </InfoCallout>
      <InlineError message={error} />
      <AppButton requiresNetwork label="Save units" onPress={() => void form.handleSubmit()} />
    </AppScreen>
  );
}
