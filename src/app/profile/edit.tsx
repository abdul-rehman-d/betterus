import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import SelectionCard from "@/components/onboarding/selection-card";
import AppButton from "@/components/ui/app-button";
import AppScreen from "@/components/ui/app-screen";
import AppTextInput from "@/components/ui/app-text-input";
import PageHeader from "@/components/ui/page-header";
import { ContentLoading, InlineError } from "@/components/ui/states";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { genders } from "@/lib/constants";
import { useSession } from "@/providers/session-provider";
export default function EditProfile() {
  const { userId } = useSession();
  const user = useQuery(api.users.get, userId ? { userId } : "skip");
  if (!userId || !user)
    return (
      <AppScreen>
        <PageHeader title="Edit profile" />
        <ContentLoading label="Loading profile settings" variant="form" />
      </AppScreen>
    );
  return <EditForm userId={userId} name={user.name} gender={user.gender} />;
}
function EditForm({
  userId,
  name,
  gender,
}: {
  userId: NonNullable<ReturnType<typeof useSession>["userId"]>;
  name: string;
  gender: Doc<"users">["gender"];
}) {
  const update = useMutation(api.users.updateProfile);
  const [error, setError] = useState<string | null>(null);
  const form = useForm({
    defaultValues: { name, gender },
    onSubmit: async ({ value }) => {
      setError(null);
      try {
        await update({ userId, ...value });
        router.back();
      } catch {
        setError("Could not update your profile.");
      }
    },
  });
  return (
    <AppScreen>
      <PageHeader title="Edit profile" />
      <form.Field
        name="name"
        validators={{ onChange: ({ value }) => (value.trim() ? undefined : "Name is required.") }}
      >
        {(field) => (
          <AppTextInput
            label="Name"
            value={field.state.value}
            onChangeText={field.handleChange}
            error={!field.state.meta.isValid ? field.state.meta.errors.join(", ") : undefined}
          />
        )}
      </form.Field>
      <form.Field name="gender">
        {(field) => (
          <View className="gap-3">
            {genders.map((item) => (
              <SelectionCard
                key={item.value}
                label={item.label}
                icon={item.icon}
                selected={field.state.value === item.value}
                onPress={() => field.handleChange(item.value)}
              />
            ))}
          </View>
        )}
      </form.Field>
      <InlineError message={error} />
      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(loading) => (
          <AppButton
            requiresNetwork
            label="Save changes"
            loading={loading}
            onPress={() => void form.handleSubmit()}
          />
        )}
      </form.Subscribe>
    </AppScreen>
  );
}
