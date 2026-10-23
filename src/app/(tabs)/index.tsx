import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import AppButton from "@/components/ui/app-button";
import AppCard from "@/components/ui/app-card";
import AppScreen from "@/components/ui/app-screen";
import AppText from "@/components/ui/app-text";
import PressableScale from "@/components/ui/pressable-scale";
import { ContentLoading } from "@/components/ui/states";
import { api } from "@/convex/_generated/api";
import { colors, measurementLabel } from "@/lib/constants";
import { addDays, formatDate, sundayOfWeek, toIsoDate } from "@/lib/dates";
import { formatBodyMetric } from "@/lib/numbers";
import { useSession } from "@/providers/session-provider";

export default function Home() {
  const { userId } = useSession();
  const params = useLocalSearchParams<{ date?: string }>();
  const today = toIsoDate(new Date());
  const selectedDate = params.date && params.date <= today ? params.date : today;
  const measurementDate = sundayOfWeek(selectedDate);
  const moveDay = (amount: number) => {
    const nextDate = amount > 0 && selectedDate >= today ? today : addDays(selectedDate, amount);
    router.setParams({ date: nextDate });
  };
  const swipe = Gesture.Pan()
    .activeOffsetX([-18, 18])
    .failOffsetY([-12, 12])
    .runOnJS(true)
    .onEnd((event) => {
      if (Math.abs(event.translationX) < 56 && Math.abs(event.velocityX) < 500) return;
      moveDay(event.translationX < 0 ? -1 : 1);
    });
  const record = useQuery(
    api.dailyRecords.getByDate,
    userId ? { userId, date: selectedDate } : "skip",
  );
  const weeklyRecord = useQuery(
    api.dailyRecords.getByDate,
    userId ? { userId, date: measurementDate } : "skip",
  );
  const loading =
    !userId || record === undefined || (record !== null && record.date !== selectedDate);
  const weeklyLoading =
    !userId ||
    weeklyRecord === undefined ||
    (weeklyRecord !== null && weeklyRecord.date !== measurementDate);

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
        <AppText variant="display">BetterUs</AppText>
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
      <GestureDetector gesture={swipe}>
        <View
          accessibilityRole="adjustable"
          accessibilityLabel={`Daily log for ${formatDate(selectedDate)}`}
          accessibilityActions={[
            { name: "decrement", label: "Previous day" },
            { name: "increment", label: "Next day" },
          ]}
          onAccessibilityAction={(event) =>
            moveDay(event.nativeEvent.actionName === "decrement" ? -1 : 1)
          }
        >
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
          {!loading && weeklyLoading ? (
            <ContentLoading label="Loading weekly measurements" />
          ) : null}
          {!loading && !weeklyLoading ? (
            <AppCard className="gap-5 border-petal bg-petal-soft">
              <View className="flex-row items-center gap-4">
                <View className="h-14 w-14 items-center justify-center rounded-[20px] bg-white">
                  <MaterialCommunityIcons name="tape-measure" size={29} color={colors.berry} />
                </View>
                <View className="flex-1">
                  <AppText variant="subtitle">
                    {weeklyRecord?.measurements.length ? "Last recorded" : "Weekly measurements"}
                  </AppText>
                  <AppText>
                    {weeklyRecord?.measurements.length
                      ? formatDate(measurementDate, {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : `For the week of ${formatDate(measurementDate, { day: "numeric", month: "long" })}`}
                  </AppText>
                </View>
              </View>
              {weeklyRecord?.measurements.length ? (
                <View className="gap-1 rounded-2xl bg-white/80 p-4">
                  {weeklyRecord.measurements.map((measurement) => (
                    <View key={measurement.key} className="flex-row items-center justify-between">
                      <AppText>{measurementLabel(measurement.key)}</AppText>
                      <AppText variant="label">
                        {formatBodyMetric(measurement.value)} {measurement.unit}
                      </AppText>
                    </View>
                  ))}
                </View>
              ) : null}
              <AppButton
                label={weeklyRecord?.measurements.length ? "Edit measurements" : "Add measurements"}
                icon={weeklyRecord?.measurements.length ? "pencil-outline" : "plus"}
                onPress={() =>
                  router.push({
                    pathname: "/(modals)/measurements",
                    params: { date: measurementDate },
                  })
                }
              />
            </AppCard>
          ) : null}
        </View>
      </GestureDetector>
    </AppScreen>
  );
}
function fromRelative(date: string) {
  return date === addDays(toIsoDate(new Date()), -1) ? "Yesterday" : "Selected";
}
