import type { RefAttributes } from "react";
import { Pressable, type PressableProps, StyleSheet, Text, type View } from "react-native";

type AppButtonProps = PressableProps & RefAttributes<View> & { children: string };

export default function AppButton({ children, ...props }: AppButtonProps) {
  return (
    <Pressable style={styles.button} {...props}>
      <Text style={styles.buttonText}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#000",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buttonText: {
    color: "#fff",
  },
});
