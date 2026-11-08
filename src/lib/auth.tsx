import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getBrowserClient } from "@/lib/browser-client";
import { afterPageLoad } from "@/lib/deferred-work";

type AuthCtx = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>({ user: null, session: null, loading: true, signOut: async () => {} });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let disposed = false;
    let unsubscribe: (() => void) | undefined;
    const cancel = afterPageLoad(() => {
      void getBrowserClient().then(async (supabase) => {
        if (disposed) return;
        let revision = 0;
        // Subscribe before reading the session; a later auth event wins.
        const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
          revision += 1;
          if (!disposed) { setSession(next); setLoading(false); }
        });
        unsubscribe = () => sub.subscription.unsubscribe();
        const baseline = revision;
        const { data } = await supabase.auth.getSession();
        if (!disposed) {
          if (revision === baseline) setSession(data.session);
          setLoading(false);
        }
      }).catch(() => { if (!disposed) setLoading(false); });
    });
    return () => { disposed = true; cancel(); unsubscribe?.(); };
  }, []);

  const signOut = async () => {
    const supabase = await getBrowserClient();
    await supabase.auth.signOut();
  };

  return (
    <Ctx.Provider value={{ user: session?.user ?? null, session, loading, signOut }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => useContext(Ctx);
