import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "convex/react";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import AppBottomSheet from "@/components/ui/app-bottom-sheet";
import AppButton from "@/components/ui/app-button";
import AppScreen from "@/components/ui/app-screen";
import AppText from "@/components/ui/app-text";
import AppTextInput from "@/components/ui/app-text-input";
import PageHeader from "@/components/ui/page-header";
import SegmentedControl from "@/components/ui/segmented-control";
import { ContentLoading, InlineError } from "@/components/ui/states";
import { api } from "@/convex/_generated/api";
import { type MeasurementKey, type MeasurementUnit, measurementLabel } from "@/lib/constants";
import { formatDate, isSunday } from "@/lib/dates";
import { formatBodyMetric } from "@/lib/numbers";
import { useSession } from "@/providers/session-provider";

export default function MeasurementsModal() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const { userId } = useSession();
  const user = useQuery(api.users.get, userId ? { userId } : "skip");
  const record = useQuery(api.dailyRecords.getByDate, userId && date ? { userId, date } : "skip");
  if (!date) return <Redirect href="/(tabs)" />;
  if (!userId || !date || !user || record === undefined)
    return (
      <AppBottomSheet snapPoints={["50%", "72%"]}>
        <AppScreen inSheet>
          <PageHeader close title="Measurements" />
          <ContentLoading label="Loading measurements" variant="form" />
        </AppScreen>
      </AppBottomSheet>
    );
  if (!isSunday(date))
    return (
      <AppBottomSheet snapPoints={["42%"]}>
        <AppScreen inSheet>
          <PageHeader close title="Measurements" />
          <AppText variant="subtitle">Choose a Sunday to log measurements.</AppText>
        </AppScreen>
      </AppBottomSheet>
    );
  const values = Object.fromEntries(
    user.measurementPreferences.map((key) => {
      const value = record?.measurements.find((item) => item.key === key)?.value;
      return [key, value === undefined ? "" : formatBodyMetric(value)];
    }),
  ) as Record<MeasurementKey, string>;
  return (
    <AppBottomSheet snapPoints={["92%"]} enablePanDownToClose={false}>
      <MeasurementsForm
        userId={userId}
        date={date}
        values={values}
        unit={user.measurementUnit}
        keys={user.measurementPreferences}
      />
    </AppBottomSheet>
  );
}
function MeasurementsForm({
  userId,
  date,
  values,
  unit,
  keys,
}: {
  userId: NonNullable<ReturnType<typeof useSession>["userId"]>;
  date: string;
  values: Record<MeasurementKey, string>;
  unit: MeasurementUnit;
  keys: MeasurementKey[];
}) {
  const save = useMutation(api.dailyRecords.setMeasurements);
  const [error, setError] = useState<string | null>(null);
  const form = useForm({
    defaultValues: { values, unit },
    onSubmit: async ({ value }) => {
      setError(null);
      const measurements = keys.flatMap((key) => {
        const raw = value.values[key]?.trim();
        return raw ? [{ key, value: Number(raw), unit: value.unit }] : [];
      });
      try {
        await save({ userId, date, measurements });
        router.back();
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : "Could not save measurements.");
      }
    },
  });
  return (
    <AppScreen inSheet>
      <PageHeader close title="Sunday measurements" />
      <AppText>{formatDate(date)}</AppText>
      <form.Field name="unit">
        {(field) => (
          <SegmentedControl<MeasurementUnit>
            value={field.state.value}
            onChange={field.handleChange}
            options={[
              { label: "Centimeters", value: "cm" },
              { label: "Inches", value: "in" },
            ]}
          />
        )}
      </form.Field>
      <form.Field name="values">
        {(field) => (
          <View className="gap-4">
            {keys.map((key) => {
              const raw = field.state.value[key];
              const invalid = Boolean(raw) && (!Number.isFinite(Number(raw)) || Number(raw) <= 0);
              return (
                <AppTextInput
                  key={key}
                  inSheet
                  keyboardType="decimal-pad"
                  label={measurementLabel(key)}
                  suffix={form.getFieldValue("unit")}
                  value={raw}
                  onChangeText={(next) => field.handleChange({ ...field.state.value, [key]: next })}
                  error={invalid ? "Enter a number greater than zero or leave blank." : undefined}
                />
              );
            })}
          </View>
        )}
      </form.Field>
      <AppText variant="caption">
        Leave any field blank to clear it. Partial entries are welcome.
      </AppText>
      <InlineError message={error} />
      <AppButton
        requiresNetwork
        label="Save measurements"
        onPress={() => void form.handleSubmit()}
      />
    </AppScreen>
  );
}
