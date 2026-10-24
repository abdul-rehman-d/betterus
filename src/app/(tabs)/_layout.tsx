import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as Haptics from "expo-haptics";
import { Tabs } from "expo-router";
import { type ColorValue, Pressable, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";
import useAppColors from "@/hooks/use-app-colors";
import { shadows } from "@/lib/constants";
export default function TabsLayout() {
  const palette = useAppColors();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.berry,
        tabBarInactiveTintColor: palette.muted,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: palette.backgroundDeep,
          borderTopColor: palette.outlineSoft,
          borderTopWidth: 1,
          height: 72,
          paddingTop: 7,
          paddingBottom: 7,
          marginHorizontal: 16,
          marginBottom: 10,
          borderRadius: 26,
          ...shadows.floating,
        },
        tabBarLabelStyle: { fontFamily: "PlusJakartaSans_600SemiBold", fontSize: 11 },
        tabBarItemStyle: { borderRadius: 20 },
        tabBarButton: ({ ref: _ref, ...props }) => (
          <Pressable {...props} android_ripple={{ color: "transparent" }} />
        ),
      }}
      screenListeners={{ tabPress: () => void Haptics.selectionAsync() }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="calendar-today"
              color={color}
              focused={focused}
              palette={palette.petalSoft}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="chart-line"
              color={color}
              focused={focused}
              palette={palette.petalSoft}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="account-circle-outline"
              color={color}
              focused={focused}
              palette={palette.petalSoft}
            />
          ),
        }}
      />
    </Tabs>
  );
}

function TabIcon({
  name,
  color,
  focused,
  palette,
}: {
  name: "calendar-today" | "chart-line" | "account-circle-outline";
  color: ColorValue;
  focused: boolean;
  palette: string;
}) {
  const style = useAnimatedStyle(
    () => ({
      transform: [{ scale: withSpring(focused ? 1.08 : 1, { damping: 17, stiffness: 300 }) }],
      backgroundColor: focused ? palette : "transparent",
    }),
    [focused, palette],
  );
  return (
    <Animated.View style={[styles.icon, style]}>
      <MaterialCommunityIcons name={name} color={color} size={22} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  icon: { width: 38, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center" },
});
