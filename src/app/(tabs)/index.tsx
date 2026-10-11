import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, View } from "react-native";
import AppButton from "@/components/ui/app-button";
import AppCard from "@/components/ui/app-card";
import AppScreen from "@/components/ui/app-screen";
import AppText from "@/components/ui/app-text";
import { LoadingState } from "@/components/ui/states";
import { api } from "@/convex/_generated/api";
import { colors } from "@/lib/constants";
import { addDays, formatDate, isSunday, toIsoDate, weekAround } from "@/lib/dates";
import { useSession } from "@/providers/session-provider";

export default function Home() {
  const { userId } = useSession();
  const params = useLocalSearchParams<{ date?: string }>();
  const today = toIsoDate(new Date());
  const selectedDate = params.date && params.date <= today ? params.date : today;
  const user = useQuery(api.users.get, userId ? { userId } : "skip");
  const record = useQuery(
    api.dailyRecords.getByDate,
    userId ? { userId, date: selectedDate } : "skip",
  );
  const week = weekAround(selectedDate);
  const weekData = useQuery(
    api.dailyRecords.listRange,
    userId ? { userId, startDate: week[0], endDate: week[6] > today ? today : week[6] } : "skip",
  );
  if (!userId || user === undefined || record === undefined || weekData === undefined)
    return <LoadingState />;
  const dataDates = new Set(weekData.map((item) => item.date));
  const navigateDate = (date: string) => router.setParams({ date });
  return (
    <AppScreen bottomInset={false}>
      <View className="gap-1">
        <AppText variant="display">BetterUs</AppText>
        <AppText>Your body log, one honest entry at a time.</AppText>
      </View>
      <AppCard className="gap-4">
        <View className="flex-row items-center justify-between">
          <AppButton
            iconOnly
            icon="chevron-left"
            label="Previous day"
            variant="secondary"
            onPress={() => navigateDate(addDays(selectedDate, -1))}
          />
          <View className="items-center">
            <AppText className="uppercase text-berry">
              {selectedDate === today ? "Today" : fromRelative(selectedDate)}
            </AppText>
            <AppText variant="subtitle">
              {formatDate(selectedDate, { day: "numeric", month: "long", year: "numeric" })}
            </AppText>
          </View>
          <AppButton
            iconOnly
            icon="chevron-right"
            label="Next day"
            variant="secondary"
            disabled={selectedDate >= today}
            onPress={() => navigateDate(addDays(selectedDate, 1))}
          />
        </View>
        <View className="flex-row justify-between">
          {week.map((date) => {
            const active = date === selectedDate;
            const disabled = date > today;
            const day = new Date(`${date}T12:00:00`);
            return (
              <Pressable
                key={date}
                disabled={disabled}
                className={`min-h-[62px] min-w-[40px] items-center justify-center rounded-2xl ${active ? "bg-berry" : ""} ${disabled ? "opacity-30" : ""}`}
                onPress={() => navigateDate(date)}
              >
                <AppText variant="caption" className={active ? "text-white" : ""}>
                  {day.toLocaleDateString(undefined, { weekday: "narrow" })}
                </AppText>
                <AppText variant="label" className={active ? "text-white" : ""}>
                  {day.getDate()}
                </AppText>
                <View
                  className={`mt-1 h-1.5 w-1.5 rounded-full ${dataDates.has(date) ? (active ? "bg-white" : "bg-berry") : "bg-transparent"}`}
                />
              </Pressable>
            );
          })}
        </View>
        <AppButton
          label="Change date"
          variant="ghost"
          icon="calendar-month-outline"
          onPress={() =>
            router.push({ pathname: "/(modals)/date", params: { date: selectedDate } })
          }
        />
      </AppCard>
      <View className="flex-row items-center justify-between">
        <AppText variant="subtitle">Daily log</AppText>
        <AppText>{formatDate(selectedDate, { weekday: "long" })}</AppText>
      </View>
      <AppCard className="gap-4">
        <View className="flex-row items-center gap-4">
          <View className="h-16 w-16 items-center justify-center rounded-3xl bg-petal">
            <MaterialCommunityIcons name="scale-bathroom" size={30} color={colors.berry} />
          </View>
          <View className="flex-1">
            <AppText variant="label">Weight</AppText>
            {record?.weight ? (
              <View className="flex-row items-end gap-1">
                <AppText variant="metric">{record.weight.value}</AppText>
                <AppText className="mb-1">{record.weight.unit}</AppText>
              </View>
            ) : (
              <AppText>No weight logged</AppText>
            )}
          </View>
        </View>
        <AppButton
          label={record?.weight ? "Edit weight" : "Add weight"}
          icon="chevron-right"
          onPress={() =>
            router.push({ pathname: "/(modals)/weight", params: { date: selectedDate } })
          }
        />
      </AppCard>
      {isSunday(selectedDate) ? (
        <AppCard className="gap-4 bg-petal-soft">
          <View className="flex-row items-center gap-4">
            <MaterialCommunityIcons name="tape-measure" size={32} color={colors.berry} />
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
            icon="chevron-right"
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
