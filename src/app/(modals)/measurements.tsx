import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import AppButton from "@/components/ui/app-button";
import AppScreen from "@/components/ui/app-screen";
import AppText from "@/components/ui/app-text";
import AppTextInput from "@/components/ui/app-text-input";
import PageHeader from "@/components/ui/page-header";
import SegmentedControl from "@/components/ui/segmented-control";
import { InlineError, LoadingState } from "@/components/ui/states";
import { api } from "@/convex/_generated/api";
import { measurementLabel, type MeasurementKey, type MeasurementUnit } from "@/lib/constants";
import { formatDate, isSunday } from "@/lib/dates";
import { useSession } from "@/providers/session-provider";

export default function MeasurementsModal() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const { userId } = useSession();
  const user = useQuery(api.users.get, userId ? { userId } : "skip");
  const record = useQuery(api.dailyRecords.getByDate, userId && date ? { userId, date } : "skip");
  if (!userId || !date || !user || record === undefined) return <LoadingState />;
  if (!isSunday(date))
    return (
      <AppScreen>
        <PageHeader close title="Measurements" />
        <AppText variant="subtitle">Choose a Sunday to log measurements.</AppText>
      </AppScreen>
    );
  const values = Object.fromEntries(
    user.measurementPreferences.map((key) => [
      key,
      record?.measurements.find((item) => item.key === key)?.value.toString() ?? "",
    ]),
  ) as Record<MeasurementKey, string>;
  return (
    <MeasurementsForm
      userId={userId}
      date={date}
      values={values}
      unit={user.measurementUnit}
      keys={user.measurementPreferences}
    />
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
    <AppScreen>
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
