import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import { View } from "react-native";
import AppButton from "@/components/ui/app-button";
import AppCard from "@/components/ui/app-card";
import AppScreen from "@/components/ui/app-screen";
import AppText from "@/components/ui/app-text";
import { LoadingState } from "@/components/ui/states";
import { api } from "@/convex/_generated/api";
import { colors, genders, measurementLabel } from "@/lib/constants";
import { initials } from "@/lib/dates";
import { useSession } from "@/providers/session-provider";

export default function Profile() {
  const { userId } = useSession();
  const user = useQuery(api.users.get, userId ? { userId } : "skip");
  if (!user) return <LoadingState />;
  const gender = genders.find((item) => item.value === user.gender)?.label;
  return (
    <AppScreen bottomInset={false}>
      <AppText variant="display">Profile</AppText>
      <AppCard className="gap-5">
        <View className="flex-row items-center gap-4">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-petal">
            <AppText variant="title">{initials(user.name)}</AppText>
          </View>
          <View className="flex-1">
            <AppText variant="title">@{user.username}</AppText>
            <AppText>{user.name}</AppText>
            <AppText>{gender}</AppText>
          </View>
        </View>
        <AppButton
          label="Edit profile"
          icon="chevron-right"
          variant="secondary"
          onPress={() => router.push("/profile/edit")}
        />
      </AppCard>
      <AppText variant="label" className="uppercase text-muted">
        Preferences
      </AppText>
      <AppCard className="gap-4">
        <View className="flex-row items-center gap-4">
          <MaterialCommunityIcons name="scale-bathroom" size={30} color={colors.berry} />
          <View className="flex-1">
            <AppText variant="subtitle">Units</AppText>
            <AppText>
              {user.weightUnit} · {user.measurementUnit}
            </AppText>
          </View>
        </View>
        <AppButton
          label="Edit units"
          icon="chevron-right"
          variant="secondary"
          onPress={() => router.push("/profile/units")}
        />
      </AppCard>
      <AppCard className="gap-4">
        <View className="flex-row items-center gap-4">
          <MaterialCommunityIcons name="tape-measure" size={30} color={colors.berry} />
          <View className="flex-1">
            <AppText variant="subtitle">Tracked measurements</AppText>
            <AppText>{user.measurementPreferences.length} selected</AppText>
          </View>
        </View>
        <View className="flex-row flex-wrap gap-2">
          {user.measurementPreferences.map((key) => (
            <AppText
              key={key}
              variant="label"
              className="rounded-full bg-petal-soft px-3 py-2 text-berry"
            >
              {measurementLabel(key)}
            </AppText>
          ))}
        </View>
        <AppButton
          label="Edit measurements"
          icon="chevron-right"
          variant="secondary"
          onPress={() => router.push("/profile/measurements")}
        />
      </AppCard>
    </AppScreen>
  );
}
