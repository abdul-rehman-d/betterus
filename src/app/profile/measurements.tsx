import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import SelectionCard from "@/components/onboarding/selection-card";
import AppButton from "@/components/ui/app-button";
import AppScreen from "@/components/ui/app-screen";
import AppText from "@/components/ui/app-text";
import PageHeader from "@/components/ui/page-header";
import { ContentLoading, InlineError } from "@/components/ui/states";
import { api } from "@/convex/_generated/api";
import { type MeasurementKey, measurements } from "@/lib/constants";
import { useSession } from "@/providers/session-provider";
export default function EditMeasurements() {
  const { userId } = useSession();
  const user = useQuery(api.users.get, userId ? { userId } : "skip");
  if (!userId || !user)
    return (
      <AppScreen>
        <PageHeader title="Tracked measurements" />
        <ContentLoading label="Loading measurement preferences" variant="form" />
      </AppScreen>
    );
  return <MeasurementForm userId={userId} selected={user.measurementPreferences} />;
}
function MeasurementForm({
  userId,
  selected,
}: {
  userId: NonNullable<ReturnType<typeof useSession>["userId"]>;
  selected: MeasurementKey[];
}) {
  const update = useMutation(api.users.updateMeasurementPreferences);
  const [error, setError] = useState<string | null>(null);
  const form = useForm({
    defaultValues: { selected },
    onSubmit: async ({ value }) => {
      setError(null);
      try {
        await update({ userId, measurementPreferences: value.selected });
        router.back();
      } catch {
        setError("Could not update your measurements.");
      }
    },
  });
  return (
    <AppScreen>
      <PageHeader title="Tracked measurements" />
      <form.Field
        name="selected"
        validators={{
          onChange: ({ value }) => (value.length ? undefined : "Choose at least one measurement."),
        }}
      >
        {(field) => (
          <View className="gap-3">
            <AppText variant="label">{field.state.value.length} selected</AppText>
            <View className="flex-row flex-wrap gap-3">
              {measurements.map(([key, label]) => {
                const active = field.state.value.includes(key);
                return (
                  <View key={key} className="w-[48%]">
                    <SelectionCard
                      label={label}
                      selected={active}
                      onPress={() =>
                        field.handleChange(
                          active
                            ? field.state.value.filter((item) => item !== key)
                            : [...field.state.value, key],
                        )
                      }
                    />
                  </View>
                );
              })}
            </View>
            {!field.state.meta.isValid ? (
              <AppText className="text-danger">{field.state.meta.errors.join(", ")}</AppText>
            ) : null}
          </View>
        )}
      </form.Field>
      <InlineError message={error} />
      <AppButton
        requiresNetwork
        label="Save measurements"
        onPress={() => void form.handleSubmit()}
      />
    </AppScreen>
  );
}
