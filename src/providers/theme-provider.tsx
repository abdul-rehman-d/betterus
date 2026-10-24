import * as SecureStore from "expo-secure-store";
import { vars } from "nativewind";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme, View } from "react-native";
import { darkColors, lightColors } from "@/lib/constants";

export type ThemeMode = "system" | "light" | "dark";
type ThemeContextValue = { mode: ThemeMode; isDark: boolean; setMode: (mode: ThemeMode) => void };
const STORAGE_KEY = "betteryou.theme-mode.v1";
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>("system");
  useEffect(() => {
    void SecureStore.getItemAsync(STORAGE_KEY).then((value) => {
      if (value === "system" || value === "light" || value === "dark") setModeState(value);
    });
  }, []);
  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      isDark: mode === "dark" || (mode === "system" && systemScheme === "dark"),
      setMode: (nextMode) => {
        setModeState(nextMode);
        void SecureStore.setItemAsync(STORAGE_KEY, nextMode);
      },
    }),
    [mode, systemScheme],
  );
  const palette = value.isDark ? darkColors : lightColors;
  const tokenVariables = {
    "--app-background": palette.background,
    "--app-background-deep": palette.backgroundDeep,
    "--app-berry": palette.berry,
    "--app-berry-dark": palette.berryDark,
    "--app-berry-light": palette.berryLight,
    "--app-petal": palette.petal,
    "--app-petal-soft": palette.petalSoft,
    "--app-plum": palette.plum,
    "--app-muted": palette.muted,
    "--app-muted-light": palette.mutedLight,
    "--app-outline": palette.outline,
    "--app-outline-soft": palette.outlineSoft,
    "--app-success": palette.success,
    "--app-success-soft": palette.successSoft,
    "--app-danger": palette.danger,
    "--app-danger-soft": palette.dangerSoft,
    "--app-gold": palette.gold,
    "--app-gold-soft": palette.goldSoft,
    "--app-surface": palette.white,
  };
  return (
    <ThemeContext.Provider value={value}>
      <View className="flex-1" style={vars(tokenVariables)}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used within ThemeProvider");
  return value;
}
