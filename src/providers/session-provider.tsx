import * as SecureStore from "expo-secure-store";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Id } from "@/convex/_generated/dataModel";

const SESSION_KEY = "betterus.user-id.v1";

export async function clearStoredSession() {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}
type Session = {
  loading: boolean;
  userId: Id<"users"> | null;
  setUserId: (id: Id<"users">) => Promise<void>;
  clearUserId: () => Promise<void>;
};
const SessionContext = createContext<Session | null>(null);

export function SessionProvider({
  children,
  onReady,
}: PropsWithChildren<{ onReady?: () => void }>) {
  const [loading, setLoading] = useState(true);
  const [userId, setCurrentUserId] = useState<Id<"users"> | null>(null);
  useEffect(() => {
    void SecureStore.getItemAsync(SESSION_KEY)
      .then((value) => {
        setCurrentUserId(value as Id<"users"> | null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);
  useEffect(() => {
    if (!loading) onReady?.();
  }, [loading, onReady]);
  const value = useMemo<Session>(
    () => ({
      loading,
      userId,
      setUserId: async (id) => {
        await SecureStore.setItemAsync(SESSION_KEY, id);
        setCurrentUserId(id);
      },
      clearUserId: async () => {
        await clearStoredSession();
        setCurrentUserId(null);
      },
    }),
    [loading, userId],
  );
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error("useSession must be used within SessionProvider");
  return value;
}
