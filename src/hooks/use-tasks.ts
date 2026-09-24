import { useQuery } from "convex/react";
import { useMemo } from "react";
import { api } from "@/convex/_generated/api";

export default function useTasks() {
  const raw = useQuery(api.tasks.get);

  const isLoading = useMemo(() => raw === undefined, [raw]);
  const isEmpty = useMemo(() => raw !== undefined && raw.length === 0, [raw]);

  return {
    data: raw === undefined ? [] : raw,
    isLoading,
    isEmpty,
  };
}
