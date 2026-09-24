import { useCallback } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import TaskForm from "@/components/task-form";
import TaskItem from "@/components/task-item";
import type { Doc } from "@/convex/_generated/dataModel";
import useTasks from "@/hooks/use-tasks";

export default function Index() {
  const { isLoading, data } = useTasks();

  const renderItemFn = useCallback(({ item }: { item: Doc<"tasks"> }) => {
    return <TaskItem task={item} />;
  }, []);

  const keyExtractorFn = useCallback((item: Doc<"tasks">, _index: number) => {
    return item._id;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Tasks</Text>

      <TaskForm />

      <FlatList
        data={data}
        renderItem={renderItemFn}
        keyExtractor={keyExtractorFn}
        ListEmptyComponent={
          <View style={styles.centeredView}>
            {isLoading ? <ActivityIndicator /> : <Text>No tasks added yet.</Text>}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 64,
    paddingHorizontal: 24,
    gap: 8,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 20,
    fontWeight: 700,
  },
  form: {
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
});
