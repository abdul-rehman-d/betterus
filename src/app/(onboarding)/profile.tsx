import { useForm } from "@tanstack/react-form";
import { router } from "expo-router";
import { View } from "react-native";
import ProgressHeader from "@/components/onboarding/progress-header";
import SelectionCard from "@/components/onboarding/selection-card";
import StepIntro from "@/components/onboarding/step-intro";
import AppButton from "@/components/ui/app-button";
import AppScreen from "@/components/ui/app-screen";
import AppText from "@/components/ui/app-text";
import AppTextInput from "@/components/ui/app-text-input";
import { type Gender, genders } from "@/lib/constants";
import { useOnboarding } from "@/providers/onboarding-provider";

export default function ProfileStep() {
  const { draft, update } = useOnboarding();
  const form = useForm({
    defaultValues: { name: draft.name, gender: draft.gender },
    onSubmit: ({ value }) => {
      update(value);
      router.push("/(onboarding)/units");
    },
  });
  return (
    <AppScreen>
      <ProgressHeader step={2} />
      <StepIntro
        eyebrow="About you"
        icon="account-outline"
        title="Tell us about you"
        body="Add your name and select your gender."
      />
      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) =>
            value.trim().length >= 1 && value.trim().length <= 50
              ? undefined
              : "Enter a name between 1 and 50 characters.",
        }}
      >
        {(field) => (
          <AppTextInput
            label="Name"
            placeholder="Your name"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChangeText={field.handleChange}
            error={!field.state.meta.isValid ? field.state.meta.errors.join(", ") : undefined}
          />
        )}
      </form.Field>
      <form.Field name="gender">
        {(field) => (
          <View className="gap-3">
            <AppText variant="label">Gender</AppText>
            <View className="flex-row flex-wrap gap-3">
              {genders.map((item) => (
                <View key={item.value} className="w-[48%]">
                  <SelectionCard
                    label={item.label}
                    icon={item.icon}
                    selected={field.state.value === item.value}
                    onPress={() => field.handleChange(item.value as Gender)}
                  />
                </View>
              ))}
            </View>
          </View>
        )}
      </form.Field>
      <AppButton label="Continue" icon="arrow-right" onPress={() => void form.handleSubmit()} />
    </AppScreen>
  );
}
