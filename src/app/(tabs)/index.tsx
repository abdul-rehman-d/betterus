import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import AppButton from "@/components/ui/app-button";
import AppCard from "@/components/ui/app-card";
import AppScreen from "@/components/ui/app-screen";
import AppText from "@/components/ui/app-text";
import PressableScale from "@/components/ui/pressable-scale";
import { ContentLoading } from "@/components/ui/states";
import { api } from "@/convex/_generated/api";
import { colors } from "@/lib/constants";
import { formatDate, isSunday, toIsoDate } from "@/lib/dates";
import { formatBodyMetric } from "@/lib/numbers";
import { useSession } from "@/providers/session-provider";

export default function Home() {
  const { userId } = useSession();
  const params = useLocalSearchParams<{ date?: string }>();
  const today = toIsoDate(new Date());
  const selectedDate = params.date && params.date <= today ? params.date : today;
  const record = useQuery(
    api.dailyRecords.getByDate,
    userId ? { userId, date: selectedDate } : "skip",
  );
  const loading = !userId || record === undefined;

  return (
    <AppScreen bottomInset={false}>
      <View className="gap-2">
        <View className="flex-row items-center gap-2">
          <View className="h-7 w-7 items-center justify-center rounded-full bg-petal-soft">
            <MaterialCommunityIcons name="heart-pulse" size={15} color={colors.berry} />
          </View>
          <AppText variant="label" className="uppercase tracking-[1.5px] text-berry">
            Daily wellness
          </AppText>
        </View>
        <AppText variant="display">BetterYou</AppText>
        <AppText className="max-w-[310px]">Your body log, one honest entry at a time.</AppText>
      </View>
      <PressableScale
        className="flex-row items-center rounded-3xl border border-white bg-white px-5 py-4"
        haptic="selection"
        onPress={() => router.push({ pathname: "/(modals)/date", params: { date: selectedDate } })}
      >
        <View className="mr-4 h-12 w-12 items-center justify-center rounded-2xl bg-petal-soft">
          <MaterialCommunityIcons name="calendar-blank-outline" size={23} color={colors.berry} />
        </View>
        <View className="flex-1">
          <AppText variant="caption" className="uppercase tracking-[1.2px] text-berry">
            {selectedDate === today ? "Today" : fromRelative(selectedDate)}
          </AppText>
          <AppText variant="subtitle">
            {formatDate(selectedDate, { day: "numeric", month: "long", year: "numeric" })}
          </AppText>
        </View>
        <MaterialCommunityIcons name="chevron-down" size={22} color={colors.muted} />
      </PressableScale>
      <View className="flex-row items-center justify-between">
        <AppText variant="title">Daily log</AppText>
        <View className="rounded-full bg-petal-soft px-3 py-1.5">
          <AppText variant="caption" className="font-body-semibold text-berry">
            {formatDate(selectedDate, { weekday: "long" })}
          </AppText>
        </View>
      </View>
      {loading ? <ContentLoading label="Loading daily log" /> : null}
      {!loading ? (
        <AppCard flush className="overflow-hidden">
          <LinearGradient colors={["#FFFFFF", "#FFF3F7"]} style={{ gap: 20, padding: 20 }}>
            <View className="flex-row items-center gap-4">
              <View className="h-16 w-16 items-center justify-center rounded-[22px] bg-petal-soft">
                <MaterialCommunityIcons name="scale-bathroom" size={30} color={colors.berry} />
              </View>
              <View className="flex-1">
                <AppText variant="label">Weight</AppText>
                {record?.weight ? (
                  <View className="flex-row items-end gap-1">
                    <AppText variant="metric">{formatBodyMetric(record.weight.value)}</AppText>
                    <AppText className="mb-1">{record.weight.unit}</AppText>
                  </View>
                ) : (
                  <AppText className="mt-1">No weight logged yet</AppText>
                )}
              </View>
            </View>
            <AppButton
              label={record?.weight ? "Edit weight" : "Add weight"}
              icon={record?.weight ? "pencil-outline" : "plus"}
              onPress={() =>
                router.push({ pathname: "/(modals)/weight", params: { date: selectedDate } })
              }
            />
          </LinearGradient>
        </AppCard>
      ) : null}
      {!loading && isSunday(selectedDate) ? (
        <AppCard className="gap-5 border-petal bg-petal-soft">
          <View className="flex-row items-center gap-4">
            <View className="h-14 w-14 items-center justify-center rounded-[20px] bg-white">
              <MaterialCommunityIcons name="tape-measure" size={29} color={colors.berry} />
            </View>
            <View className="flex-1">
              <AppText variant="subtitle">Sunday measurements</AppText>
              <AppText>
                {record?.measurements.length
                  ? `${record.measurements.length} values logged`
                  : "Your weekly body check-in"}
              </AppText>
            </View>
          </View>
          <AppButton
            label={record?.measurements.length ? "Edit measurements" : "Add measurements"}
            icon={record?.measurements.length ? "pencil-outline" : "plus"}
            onPress={() =>
              router.push({ pathname: "/(modals)/measurements", params: { date: selectedDate } })
            }
          />
        </AppCard>
      ) : null}
    </AppScreen>
  );
}
function fromRelative(date: string) {
  return date === toIsoDate(new Date(Date.now() - 86400000)) ? "Yesterday" : "Selected";
}
