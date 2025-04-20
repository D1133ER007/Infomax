import { useCallback } from "react";
import { supabase } from "@/lib/supabase";

export interface Appointment {
  id: string;
  student_id: string;
  title: string;
  description?: string | null;
  appointment_date: string;
  appointment_time: string;
  status: "scheduled" | "completed" | "cancelled";
  created_at: string;
  students?: {
    first_name: string;
    last_name: string;
  };
}

export function useAppointments() {
  const getAppointments = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select(
          `
          *,
          students:student_id(*)
        `,
        )
        .order("appointment_date", { ascending: true });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return { data: [], error };
    }
  }, []);

  const getUpcomingAppointments = useCallback(async () => {
    const today = new Date().toISOString().split("T")[0];
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select(
          `
          *,
          students:student_id(*)
        `,
        )
        .gte("appointment_date", today)
        .eq("status", "scheduled")
        .order("appointment_date", { ascending: true });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      console.error("Error fetching upcoming appointments:", error);
      return { data: [], error };
    }
  }, []);

  const getAppointment = useCallback(async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select(
          `
          *,
          students:student_id(*)
        `,
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching appointment:", error);
      return { data: null, error };
    }
  }, []);

  const createAppointment = useCallback(
    async (appointment: Omit<Appointment, "id" | "created_at">) => {
      try {
        const { data, error } = await supabase
          .from("appointments")
          .insert([appointment])
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error("Error creating appointment:", error);
        return { data: null, error };
      }
    },
    [],
  );

  const updateAppointment = useCallback(
    async (id: string, updates: Partial<Appointment>) => {
      try {
        const { data, error } = await supabase
          .from("appointments")
          .update(updates)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error("Error updating appointment:", error);
        return { data: null, error };
      }
    },
    [],
  );

  const deleteAppointment = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from("appointments")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error("Error deleting appointment:", error);
      return { error };
    }
  }, []);

  return {
    getAppointments,
    getUpcomingAppointments,
    getAppointment,
    createAppointment,
    updateAppointment,
    deleteAppointment,
  };
}
