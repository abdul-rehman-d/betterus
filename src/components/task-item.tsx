import { useMutation } from "convex/react";
import { useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";

type TaskItemProps = {
  task: Doc<"tasks">;
};

export default function TaskItem({ task }: TaskItemProps) {
  const updateTask = useMutation(api.tasks.update);
  const removeTask = useMutation(api.tasks.remove);

  const onUpdateTask = useCallback(async () => {
    try {
      await updateTask({ id: task._id, is_completed: !task.is_completed });
    } catch (_e) {
    } finally {
    }
  }, [task, updateTask]);

  const onRemoveTask = useCallback(async () => {
    try {
      await removeTask({ id: task._id });
    } catch (_e) {
    } finally {
    }
  }, [task._id, removeTask]);

  return (
    <View style={styles.container}>
      <Pressable onPress={onUpdateTask}>
        <Text>{task.is_completed ? "✅" : "⬜"}</Text>
      </Pressable>
      <Text style={styles.text}>{task.text}</Text>
      <Pressable onPress={onRemoveTask}>
        <Text>{"🗑️"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  text: {
    flex: 1,
  },
});
