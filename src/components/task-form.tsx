import { useMutation } from "convex/react";
import { useCallback, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import AppButton from "@/components/ui/app-button";
import { api } from "@/convex/_generated/api";

export default function TaskForm() {
  const [task, setTask] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createTask = useMutation(api.tasks.create);

  const addTask = useCallback(async () => {
    if (!task.length) {
      setError("please enter something first");
      return;
    }

    setError(null);

    setIsSubmitting(true);

    try {
      await createTask({ text: task });
      setTask("");
    } catch (_e) {
      setError("something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }, [task, createTask]);

  return (
    <View style={styles.form}>
      <View style={styles.mainRow}>
        <TextInput
          placeholder="Enter task here"
          style={styles.input}
          enterKeyHint="done"
          value={task}
          onChangeText={setTask}
          onSubmitEditing={addTask}
        />
        <AppButton onPress={addTask} disabled={isSubmitting}>
          Add
        </AppButton>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : <View style={styles.errorSpacer} />}
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 2,
  },
  mainRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    alignSelf: "stretch",
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
  },
  errorText: {
    marginHorizontal: 10,
    fontSize: 10,
    color: "#ff0000",
  },
  errorSpacer: {
    height: 10,
  },
});
