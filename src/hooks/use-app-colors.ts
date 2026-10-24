import { darkColors, lightColors } from "@/lib/constants";
import { useTheme } from "@/providers/theme-provider";

/** Resolve the semantic palette from the device appearance setting. */
export default function useAppColors() {
  return useTheme().isDark ? darkColors : lightColors;
}
