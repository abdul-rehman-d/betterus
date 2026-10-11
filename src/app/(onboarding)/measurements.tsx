import { useForm } from "@tanstack/react-form";
import { useMutation } from "convex/react";
import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import ProgressHeader from "@/components/onboarding/progress-header";
import SelectionCard from "@/components/onboarding/selection-card";
import AppButton from "@/components/ui/app-button";
import AppScreen from "@/components/ui/app-screen";
import AppText from "@/components/ui/app-text";
import { InlineError } from "@/components/ui/states";
import { api } from "@/convex/_generated/api";
import { measurements, type MeasurementKey } from "@/lib/constants";
import { useOnboarding } from "@/providers/onboarding-provider";
import { useSession } from "@/providers/session-provider";

export default function MeasurementsStep() {
  const { draft, update } = useOnboarding();
  const session = useSession();
  const createUser = useMutation(api.users.create);
  const [error, setError] = useState<string | null>(null);
  const form = useForm({
    defaultValues: { selected: draft.measurementPreferences },
    onSubmit: async ({ value }) => {
      setError(null);
      update({ measurementPreferences: value.selected });
      try {
        const userId = await createUser({
          ...draft,
          measurementPreferences: value.selected,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
        });
        await session.setUserId(userId);
        router.replace("/(tabs)");
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : "Could not create your profile.");
      }
    },
  });
  return (
    <AppScreen>
      <ProgressHeader step={4} />
      <View className="gap-2">
        <AppText className="font-body-semibold uppercase text-berry">Your journey</AppText>
        <AppText variant="display">What do you want to track?</AppText>
        <AppText>
          Select at least one measurement. You can change this anytime from Profile.
        </AppText>
      </View>
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
                const selected = field.state.value.includes(key);
                return (
                  <View key={key} className="w-[48%]">
                    <SelectionCard
                      label={label}
                      selected={selected}
                      onPress={() =>
                        field.handleChange(
                          selected
                            ? field.state.value.filter((item) => item !== key)
                            : [...field.state.value, key as MeasurementKey],
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
      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, submitting]) => (
          <AppButton
            requiresNetwork
            label="Finish"
            icon="arrow-right"
            loading={submitting}
            disabled={!canSubmit}
            onPress={() => void form.handleSubmit()}
          />
        )}
      </form.Subscribe>
    </AppScreen>
  );
}
