import { useCallback } from "react";
import { supabase } from "@/lib/supabase";

export interface Profile {
  id: string;
  email: string | null;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
}

export function useProfile() {
  const getProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        // If the profile doesn't exist, create it
        if (error.code === "PGRST116") {
          const { data: userData } = await supabase.auth.getUser();
          if (userData?.user) {
            const { data: newProfile, error: insertError } = await supabase
              .from("profiles")
              .insert([
                {
                  id: userId,
                  email: userData.user.email,
                  username: userData.user.user_metadata?.username || null,
                  avatar_url: null,
                  created_at: new Date().toISOString(),
                },
              ])
              .select()
              .single();

            if (insertError) throw insertError;
            return { data: newProfile, error: null };
          }
        }
        // Return a default profile even if there's an error
        return {
          data: {
            id: userId,
            email: null,
            username: null,
            avatar_url: null,
            created_at: new Date().toISOString(),
          },
          error: null,
        };
      }
      return { data, error: null };
    } catch (error) {
      console.error("Error loading profile:", error);
      // Return a default profile on error
      return {
        data: {
          id: userId,
          email: null,
          username: null,
          avatar_url: null,
          created_at: new Date().toISOString(),
        },
        error: null,
      };
    }
  }, []);

  const updateProfile = useCallback(
    async (userId: string, updates: Partial<Profile>) => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .update(updates)
          .eq("id", userId)
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error("Error updating profile:", error);
        return { data: null, error };
      }
    },
    [],
  );

  return {
    getProfile,
    updateProfile,
  };
}
