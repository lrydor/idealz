import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

const AuthContext = createContext({
  user: null,
  role: null,
  profile: null,
  loading: true,
});

export function AuthProvider({ children }) {
  const [state, setState] = useState({
    user: null,
    role: null,
    profile: null,
    loading: true,
  });

  useEffect(() => {
    async function load() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setState({
            user: null,
            role: null,
            profile: null,
            loading: false,
          });
          return;
        }

        const defaultRole = user?.user_metadata?.role ?? "customer";
        const defaultProfile = {
          id: user.id,
          email: user.email,
          role: defaultRole,
          first_name: user.user_metadata?.first_name ?? "",
          last_name: user.user_metadata?.last_name ?? "",
        };

        let profileResponse = await supabase
          .from("profiles")
          .select("role, first_name")
          .eq("id", user.id)
          .single();

        if (profileResponse.error) {
          if (profileResponse.error.code === "PGRST116") {
            const { data: insertedProfile, error: insertError } = await supabase
              .from("profiles")
              .upsert(defaultProfile)
              .select("role, first_name")
              .single();

            if (insertError) {
              console.warn("Error creating profile:", insertError.message);
            } else {
              profileResponse = { data: insertedProfile };
            }
          } else {
            console.warn("Error loading profile:", profileResponse.error.message);
          }
        }

        setState({
          user,
          role:
            profileResponse.data?.role ??
            user?.user_metadata?.role ??
            "customer",
          profile: profileResponse.data ?? null,
          loading: false,
        });
      } catch (err) {
        console.error("Error loading auth state:", err);
        setState({
          user: null,
          role: null,
          profile: null,
          loading: false,
        });
      }
    }
    load();

    const { data: listener } = supabase.auth.onAuthStateChange(() => load());
    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
