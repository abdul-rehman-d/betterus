import { useQuery } from "convex/react";
import { Redirect } from "expo-router";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { useSession } from "@/providers/session-provider";
import { LoadingState } from "@/components/ui/states";

export default function Index() {
  const session = useSession();
  const user = useQuery(api.users.get, session.userId ? { userId: session.userId } : "skip");
  useEffect(() => {
    if (!session.loading && session.userId && user === null) void session.clearUserId();
  }, [session, user]);
  if (session.loading || (session.userId && user === undefined))
    return <LoadingState label="Opening BetterYou…" />;
  if (!session.userId || user === null) return <Redirect href="/(onboarding)/username" />;
  return <Redirect href="/(tabs)" />;
}
