import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "./supabase";

export type Admin = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  role?: string;
};

type AuthState = {
  admin: Admin | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

const SUPABASE_ENABLED =
  !!import.meta.env.VITE_SUPABASE_URL &&
  !!import.meta.env.VITE_SUPABASE_ANON_KEY;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Supabase Auth path ─────────────────────────────────────────────────────
  const refreshSupabase = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setAdmin(null);
        setLoading(false);
        return;
      }

      // Fetch admin profile from our users table
      const { data: profile } = await supabase
        .from("users")
        .select("id, name, email, role, avatar_url")
        .eq("email", session.user.email)
        .single();

      if (profile) {
        setAdmin({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          avatarUrl: profile.avatar_url,
          role: profile.role,
        });
      } else {
        // Fallback: build admin from Supabase auth user but default to seeker
        setAdmin({
          id: session.user.id,
          name: session.user.email?.split("@")[0] ?? "User",
          email: session.user.email ?? "",
          avatarUrl: null,
          role: "seeker",
        });
      }
    } catch {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const loginSupabase = useCallback(
    async (email: string, password: string, _remember: boolean) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw new Error(error.message);
      await refreshSupabase();
    },
    [refreshSupabase],
  );

  const logoutSupabase = useCallback(async () => {
    await supabase.auth.signOut();
    setAdmin(null);
  }, []);

  // ── Unified hooks ─────────────────────────────────────────────────────────
  const refresh = refreshSupabase;
  const login   = loginSupabase;
  const logout  = logoutSupabase;

  useEffect(() => {
    void refresh();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      void refreshSupabase();
    });
    return () => listener.subscription.unsubscribe();
  }, [refresh, refreshSupabase]);

  return (
    <AuthContext.Provider
      value={{
        admin,
        loading,
        isAuthenticated: !!admin,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
