import { useForm } from "@tanstack/react-form";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import AppButton from "@/components/ui/app-button";
import AppScreen from "@/components/ui/app-screen";
import AppText from "@/components/ui/app-text";
import AppTextInput from "@/components/ui/app-text-input";
import ProgressHeader from "@/components/onboarding/progress-header";
import { api } from "@/convex/_generated/api";
import { useOnboarding } from "@/providers/onboarding-provider";

export default function UsernameScreen() {
  const { draft, update } = useOnboarding();
  const [usernameValue, setUsernameValue] = useState(draft.username);
  const [debounced, setDebounced] = useState(draft.username);
  const availability = useQuery(
    api.users.checkUsernameAvailability,
    debounced ? { username: debounced } : "skip",
  );
  const form = useForm({
    defaultValues: { username: draft.username },
    onSubmit: ({ value }) => {
      update({ username: value.username.trim().toLowerCase() });
      router.push("/(onboarding)/profile");
    },
  });
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(usernameValue.trim().toLowerCase()), 350);
    return () => clearTimeout(timer);
  }, [usernameValue]);
  return (
    <AppScreen>
      <ProgressHeader step={1} />
      <View className="gap-2">
        <AppText className="font-body-semibold uppercase text-berry">Get started</AppText>
        <AppText variant="display">Choose your username</AppText>
        <AppText>
          Pick a unique handle for your personal tracking log. Usernames are permanent once set.
        </AppText>
      </View>
      <form.Field
        name="username"
        validators={{
          onChange: ({ value }) =>
            /^[a-z0-9_]{3,20}$/.test(value.trim().toLowerCase())
              ? undefined
              : "Use 3–20 lowercase letters, numbers, or underscores.",
        }}
      >
        {(field) => {
          const valid = field.state.meta.isValid;
          const helper = !valid
            ? undefined
            : availability === undefined
              ? "Checking availability…"
              : availability.available
                ? "Available"
                : "That username is taken.";
          return (
            <AppTextInput
              autoCapitalize="none"
              autoCorrect={false}
              label="Handle"
              placeholder="your_handle"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChangeText={(value) => {
                const normalized = value.toLowerCase();
                field.handleChange(normalized);
                setUsernameValue(normalized);
              }}
              error={
                !valid
                  ? field.state.meta.errors.join(", ")
                  : availability && !availability.available
                    ? "That username is taken."
                    : undefined
              }
              helper={helper}
            />
          );
        }}
      </form.Field>
      <AppText className="rounded-3xl bg-petal-soft p-5">
        Your username becomes your fixed BetterUs handle. No email or password is needed for this
        device profile.
      </AppText>
      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, submitting]) => (
          <AppButton
            label="Continue"
            icon="arrow-right"
            loading={submitting}
            disabled={!canSubmit || !availability?.available}
            onPress={() => void form.handleSubmit()}
          />
        )}
      </form.Subscribe>
    </AppScreen>
  );
}
