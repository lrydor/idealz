import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { supabase } from "../../supabaseClient";

const defaultContextValue = {
  user: null,
  role: null,
  profile: null,
  loading: true,
  refresh: async () => {},
  signOut: async () => {},
};

const AuthContext = createContext(defaultContextValue);

const createEmptyState = (loading = false) => ({
  user: null,
  role: null,
  profile: null,
  loading,
});

export function AuthProvider({ children }) {
  const [state, setState] = useState(() => createEmptyState(true));
  const isMountedRef = useRef(false);

  const refresh = useCallback(async () => {
    if (!isMountedRef.current) return;

    setState((prev) => ({ ...prev, loading: true }));

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      const user = session?.user ?? null;

      if (!user) {
        if (!isMountedRef.current) return;
        setState(createEmptyState(false));
        return;
      }

      const defaultRole = user.user_metadata?.role ?? "customer";
      const defaultProfile = {
        id: user.id,
        email: user.email ?? "",
        role: defaultRole,
        first_name: user.user_metadata?.first_name ?? "",
        last_name: user.user_metadata?.last_name ?? "",
      };

      const {
        data: existingProfile,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select("id, email, role, first_name, last_name")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError && profileError.code !== "PGRST116") {
        console.warn("Error loading profile:", profileError.message);
      }

      let profileData = existingProfile ?? null;

      if (!profileData) {
        const {
          data: insertedProfile,
          error: insertError,
        } = await supabase
          .from("profiles")
          .upsert(defaultProfile)
          .select("id, email, role, first_name, last_name")
          .single();

        if (insertError) {
          console.warn("Error creating profile:", insertError.message);
        } else {
          profileData = insertedProfile;
        }
      }

      const mergedProfile = {
        ...defaultProfile,
        ...(profileData ?? {}),
      };

      if (!isMountedRef.current) return;

      setState({
        user,
        role: mergedProfile.role ?? defaultRole,
        profile: mergedProfile,
        loading: false,
      });
    } catch (err) {
      console.error("Error loading auth state:", err);
      if (!isMountedRef.current) return;
      setState(createEmptyState(false));
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    if (!isMountedRef.current) return;
    setState(createEmptyState(false));
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    refresh();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!isMountedRef.current) return;
        if (!session?.user) {
          setState(createEmptyState(false));
          return;
        }
        refresh();
      }
    );

    return () => {
      isMountedRef.current = false;
      listener?.subscription?.unsubscribe();
    };
  }, [refresh]);

  const value = useMemo(
    () => ({
      ...state,
      refresh,
      signOut: handleSignOut,
    }),
    [state, refresh, handleSignOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
