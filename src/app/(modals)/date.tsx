import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import AppButton from "@/components/ui/app-button";
import AppScreen from "@/components/ui/app-screen";
import AppText from "@/components/ui/app-text";
import PageHeader from "@/components/ui/page-header";
import { api } from "@/convex/_generated/api";
import { colors } from "@/lib/constants";
import { calendarGrid, fromIsoDate, toIsoDate } from "@/lib/dates";
import { useSession } from "@/providers/session-provider";

export default function DateModal() {
  const params = useLocalSearchParams<{ date: string }>();
  const today = toIsoDate(new Date());
  const [month, setMonth] = useState(`${(params.date || today).slice(0, 7)}-01`);
  const { userId } = useSession();
  const grid = useMemo(() => calendarGrid(month), [month]);
  const records = useQuery(
    api.dailyRecords.listRange,
    userId
      ? { userId, startDate: grid[0].date, endDate: grid[41].date > today ? today : grid[41].date }
      : "skip",
  );
  const dataDates = new Set(records?.map((item) => item.date));
  const shiftMonth = (amount: number) => {
    const date = fromIsoDate(month);
    date.setMonth(date.getMonth() + amount);
    setMonth(toIsoDate(new Date(date.getFullYear(), date.getMonth(), 1, 12)));
  };
  const select = (date: string) => router.replace({ pathname: "/(tabs)", params: { date } });
  return (
    <AppScreen>
      <PageHeader close title="Change date" />
      <View className="flex-row items-center justify-between">
        <AppButton
          iconOnly
          icon="chevron-left"
          label="Previous month"
          variant="secondary"
          onPress={() => shiftMonth(-1)}
        />
        <AppText variant="subtitle">
          {fromIsoDate(month).toLocaleDateString(undefined, { month: "long", year: "numeric" })}
        </AppText>
        <AppButton
          iconOnly
          icon="chevron-right"
          label="Next month"
          variant="secondary"
          disabled={month.slice(0, 7) >= today.slice(0, 7)}
          onPress={() => shiftMonth(1)}
        />
      </View>
      <View className="flex-row">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <AppText key={day} variant="caption" className="w-[14.28%] text-center">
            {day[0]}
          </AppText>
        ))}
      </View>
      <View className="flex-row flex-wrap">
        {grid.map(({ date, inMonth }) => {
          const selected = date === params.date;
          const disabled = date > today;
          return (
            <Pressable
              key={date}
              accessibilityLabel={date}
              disabled={disabled}
              className="h-12 w-[14.28%] items-center justify-center"
              onPress={() => select(date)}
            >
              <View
                className={`h-10 w-10 items-center justify-center rounded-full ${selected ? "bg-berry" : ""} ${!inMonth || disabled ? "opacity-30" : ""}`}
              >
                <AppText variant="label" className={selected ? "text-white" : ""}>
                  {fromIsoDate(date).getDate()}
                </AppText>
                {dataDates.has(date) ? (
                  <View
                    className={`absolute bottom-1 h-1 w-1 rounded-full ${selected ? "bg-white" : "bg-berry"}`}
                  />
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>
      <AppButton label="Today" icon="calendar-today" onPress={() => select(today)} />
      <View className="flex-row items-center gap-2">
        <MaterialCommunityIcons name="circle-small" size={22} color={colors.berry} />
        <AppText variant="caption">Dots mark dates with saved data.</AppText>
      </View>
    </AppScreen>
  );
}
