import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { View } from "react-native";
import AppButton from "@/components/ui/app-button";
import AppCard from "@/components/ui/app-card";
import AppScreen from "@/components/ui/app-screen";
import AppText from "@/components/ui/app-text";
import { ContentLoading } from "@/components/ui/states";
import { api } from "@/convex/_generated/api";
import { colors, genders, measurementLabel } from "@/lib/constants";
import { initials } from "@/lib/dates";
import { useSession } from "@/providers/session-provider";

export default function Profile() {
  const { clearUserId, userId } = useSession();
  const user = useQuery(api.users.get, userId ? { userId } : "skip");
  const gender = user ? genders.find((item) => item.value === user.gender)?.label : undefined;
  return (
    <AppScreen bottomInset={false}>
      <View className="gap-2">
        <AppText variant="label" className="uppercase tracking-[1.5px] text-berry">
          Your space
        </AppText>
        <AppText variant="display">Profile</AppText>
      </View>
      {!user ? <ContentLoading label="Loading profile" variant="profile" /> : null}
      {user ? (
        <View className="gap-6">
          <AppCard flush className="overflow-hidden">
            <LinearGradient colors={["#FFFFFF", "#FFF0F5"]} style={{ gap: 20, padding: 20 }}>
              <View className="flex-row items-center gap-4">
                <LinearGradient
                  colors={[colors.berryLight, colors.berryDark]}
                  style={{
                    height: 80,
                    width: 80,
                    borderRadius: 40,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AppText variant="title" className="text-white">
                    {initials(user.name)}
                  </AppText>
                </LinearGradient>
                <View className="absolute left-[72px] top-[60px] h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-success">
                  <MaterialCommunityIcons name="check" size={13} color={colors.white} />
                </View>
                <View className="flex-1">
                  <AppText variant="title">@{user.username}</AppText>
                  <AppText>{gender ? `${user.name} · ${gender}` : user.name}</AppText>
                </View>
              </View>
              <AppButton
                label="Edit profile"
                icon="pencil-outline"
                variant="secondary"
                onPress={() => router.push("/profile/edit")}
              />
            </LinearGradient>
          </AppCard>
          <AppText variant="label" className="uppercase text-muted">
            Preferences
          </AppText>
          <AppCard className="gap-4">
            <View className="flex-row items-center gap-4">
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-petal-soft">
                <MaterialCommunityIcons name="scale-bathroom" size={25} color={colors.berry} />
              </View>
              <View className="flex-1">
                <AppText variant="subtitle">Units</AppText>
                <AppText>
                  {user.weightUnit} · {user.measurementUnit}
                </AppText>
              </View>
            </View>
            <AppButton
              label="Edit units"
              icon="pencil-outline"
              variant="ghost"
              onPress={() => router.push("/profile/units")}
            />
          </AppCard>
          <AppCard className="gap-4">
            <View className="flex-row items-center gap-4">
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-petal-soft">
                <MaterialCommunityIcons name="tape-measure" size={25} color={colors.berry} />
              </View>
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
              icon="pencil-outline"
              variant="ghost"
              onPress={() => router.push("/profile/measurements")}
            />
          </AppCard>
          {__DEV__ ? (
            <AppButton
              label="Clear storage"
              icon="delete-outline"
              variant="destructive"
              onPress={() => void clearUserId()}
            />
          ) : null}
        </View>
      ) : null}
    </AppScreen>
  );
}
