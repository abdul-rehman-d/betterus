import { useConvex } from "convex/react";
import { useEffect, useState } from "react";
import type { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import type { WeightUnit } from "@/lib/constants";
import type { WeightReading } from "@/lib/weight-weekly-average";

const PAGE_SIZE = 370;
const EARLIEST_SUPPORTED_DATE = "0100-01-01";

type State =
  | { key: string; status: "loading" }
  | { key: string; status: "error"; message: string }
  | { key: string; status: "ready"; readings: WeightReading[] };

function nextDateUtc(date: string) {
  const next = new Date(`${date}T00:00:00.000Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  return next.toISOString().slice(0, 10);
}

/** Fetch every bounded page from the supported start date through today. */
export function useAllTimeWeightReadings(
  userId: Id<"users"> | null,
  endDate: string,
  displayUnit: WeightUnit | null,
  enabled: boolean,
) {
  const convex = useConvex();
  const [attempt, setAttempt] = useState(0);
  const key = `${userId ?? "no-user"}:${endDate}:${displayUnit ?? "no-unit"}`;
  const [state, setState] = useState<State>({ key: "", status: "loading" });

  useEffect(() => {
    void attempt;
    if (!enabled) {
      setState({ key, status: "ready", readings: [] });
      return;
    }
    if (!userId || !displayUnit) {
      setState({ key, status: "ready", readings: [] });
      return;
    }

    let active = true;
    setState({ key, status: "loading" });
    void (async () => {
      try {
        const records: WeightReading[] = [];
        let startDate = EARLIEST_SUPPORTED_DATE;
        while (startDate <= endDate) {
          const batch = await convex.query(api.dailyRecords.listProgress, {
            userId,
            startDate,
            endDate,
          });
          if (!active) return;
          for (const record of batch) {
            if (record.weight) {
              records.push({
                date: record.date,
                value: record.weight.value,
                unit: record.weight.unit,
              });
            }
          }
          if (batch.length < PAGE_SIZE) break;

          const lastDate = batch.at(-1)?.date;
          if (!lastDate || lastDate < startDate) {
            throw new Error("Progress history returned an invalid page.");
          }
          if (lastDate >= endDate) break;
          startDate = nextDateUtc(lastDate);
        }
        if (active) setState({ key, status: "ready", readings: records });
      } catch {
        if (active) {
          setState({ key, status: "error", message: "Could not load your full weight history." });
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [attempt, convex, displayUnit, enabled, endDate, key, userId]);

  const currentState: State = !enabled
    ? { key, status: "ready", readings: [] }
    : state.key === key
      ? state
      : { key, status: "loading" };
  return {
    ...currentState,
    retry: () => setAttempt((current) => current + 1),
  };
}
