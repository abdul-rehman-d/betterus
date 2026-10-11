import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useBottomSheetModal } from "@gorhom/bottom-sheet";
import { useQuery } from "convex/react";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import AppBottomSheet from "@/components/ui/app-bottom-sheet";
import AppButton from "@/components/ui/app-button";
import AppScreen from "@/components/ui/app-screen";
import AppText from "@/components/ui/app-text";
import PageHeader from "@/components/ui/page-header";
import PressableScale from "@/components/ui/pressable-scale";
import { api } from "@/convex/_generated/api";
import { colors } from "@/lib/constants";
import { calendarGrid, fromIsoDate, toIsoDate } from "@/lib/dates";
import { useSession } from "@/providers/session-provider";

export default function DateModal() {
  const params = useLocalSearchParams<{ date: string }>();
  const today = toIsoDate(new Date());
  const [month, setMonth] = useState(`${(params.date || today).slice(0, 7)}-01`);
  const selectedDateRef = useRef<string | null>(null);
  const { dismiss } = useBottomSheetModal();
  const { userId } = useSession();
  const grid = useMemo(() => calendarGrid(month), [month]);
  const handleDismiss = useCallback(() => {
    const date = selectedDateRef.current;
    if (date) {
      router.dismissTo({ pathname: "/(tabs)", params: { date } });
      return;
    }
    router.back();
  }, []);
  const records = useQuery(
    api.dailyRecords.listRange,
    userId
      ? { userId, startDate: grid[0].date, endDate: grid[41].date > today ? today : grid[41].date }
      : "skip",
  );
  if (!params.date) return <Redirect href="/(tabs)" />;
  const dataDates = new Set(records?.map((item) => item.date));
  const shiftMonth = (amount: number) => {
    const date = fromIsoDate(month);
    date.setMonth(date.getMonth() + amount);
    setMonth(toIsoDate(new Date(date.getFullYear(), date.getMonth(), 1, 12)));
  };
  const select = (date: string) => {
    selectedDateRef.current = date;
    dismiss();
  };
  return (
    <AppBottomSheet snapPoints={["78%", "94%"]} onDismiss={handleDismiss}>
      <AppScreen inSheet>
        <PageHeader close title="Change date" />
        <View className="flex-row items-center justify-between rounded-3xl bg-white p-2">
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
        <View className="flex-row px-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <AppText key={day} variant="caption" className="w-[14.28%] text-center">
              {day[0]}
            </AppText>
          ))}
        </View>
        <View className="flex-row flex-wrap rounded-3xl border border-outline-soft bg-white p-2">
          {grid.map(({ date, inMonth }) => {
            const selected = date === params.date;
            const disabled = date > today;
            return (
              <PressableScale
                key={date}
                accessibilityLabel={date}
                disabled={disabled}
                className="h-12 w-[14.28%] items-center justify-center"
                haptic="selection"
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
              </PressableScale>
            );
          })}
        </View>
        <AppButton label="Today" icon="calendar-today" onPress={() => select(today)} />
        <View className="flex-row items-center gap-2">
          <MaterialCommunityIcons name="circle-small" size={22} color={colors.berry} />
          <AppText variant="caption">Dots mark dates with saved data.</AppText>
        </View>
      </AppScreen>
    </AppBottomSheet>
  );
}
