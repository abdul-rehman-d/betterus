import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "convex/react";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import AppButton from "@/components/ui/app-button";
import AppBottomSheet from "@/components/ui/app-bottom-sheet";
import AppScreen from "@/components/ui/app-screen";
import AppText from "@/components/ui/app-text";
import AppTextInput from "@/components/ui/app-text-input";
import PageHeader from "@/components/ui/page-header";
import SegmentedControl from "@/components/ui/segmented-control";
import { InlineError, LoadingState } from "@/components/ui/states";
import { api } from "@/convex/_generated/api";
import type { WeightUnit } from "@/lib/constants";
import { formatDate } from "@/lib/dates";
import { formatBodyMetric } from "@/lib/numbers";
import { useSession } from "@/providers/session-provider";

export default function WeightModal() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const { userId } = useSession();
  const user = useQuery(api.users.get, userId ? { userId } : "skip");
  const record = useQuery(api.dailyRecords.getByDate, userId && date ? { userId, date } : "skip");
  if (!date) return <Redirect href="/(tabs)" />;
  if (!userId || !date || !user || record === undefined)
    return (
      <AppBottomSheet snapPoints={["50%", "72%"]}>
        <LoadingState />
      </AppBottomSheet>
    );
  return (
    <AppBottomSheet snapPoints={["62%", "90%"]}>
      <WeightForm
        userId={userId}
        date={date}
        value={record?.weight?.value}
        unit={user.weightUnit}
        hasWeight={Boolean(record?.weight)}
      />
    </AppBottomSheet>
  );
}
function WeightForm({
  userId,
  date,
  value,
  unit,
  hasWeight,
}: {
  userId: NonNullable<ReturnType<typeof useSession>["userId"]>;
  date: string;
  value?: number;
  unit: WeightUnit;
  hasWeight: boolean;
}) {
  const save = useMutation(api.dailyRecords.setWeight);
  const remove = useMutation(api.dailyRecords.removeWeight);
  const [error, setError] = useState<string | null>(null);
  const form = useForm({
    defaultValues: { value: value === undefined ? "" : formatBodyMetric(value), unit },
    onSubmit: async ({ value: next }) => {
      setError(null);
      try {
        await save({ userId, date, value: Number(next.value), unit: next.unit });
        router.back();
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : "Could not save weight.");
      }
    },
  });
  const removeWeight = async () => {
    setError(null);
    try {
      await remove({ userId, date });
      router.back();
    } catch {
      setError("Could not remove weight.");
    }
  };
  return (
    <AppScreen inSheet>
      <PageHeader close title={hasWeight ? "Edit weight" : "Add weight"} />
      <AppText>{formatDate(date)}</AppText>
      <form.Field
        name="value"
        validators={{
          onChange: ({ value: input }) =>
            Number.isFinite(Number(input)) && Number(input) > 0
              ? undefined
              : "Enter a number greater than zero.",
        }}
      >
        {(field) => (
          <AppTextInput
            autoFocus
            inSheet
            keyboardType="decimal-pad"
            label="Weight"
            suffix={form.getFieldValue("unit")}
            value={field.state.value}
            onChangeText={field.handleChange}
            error={!field.state.meta.isValid ? field.state.meta.errors.join(", ") : undefined}
          />
        )}
      </form.Field>
      <form.Field name="unit">
        {(field) => (
          <SegmentedControl<WeightUnit>
            value={field.state.value}
            onChange={field.handleChange}
            options={[
              { label: "Kilograms", value: "kg" },
              { label: "Pounds", value: "lb" },
            ]}
          />
        )}
      </form.Field>
      <InlineError message={error} />
      <AppButton requiresNetwork label="Save weight" onPress={() => void form.handleSubmit()} />
      {hasWeight ? (
        <AppButton
          requiresNetwork
          label="Remove weight"
          variant="destructive"
          onPress={() => void removeWeight()}
        />
      ) : null}
    </AppScreen>
  );
}
