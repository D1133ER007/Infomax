import { useCallback } from "react";
import { supabase } from "@/lib/supabase";

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  enrollment_date: string;
  fee_paid: number;
  payment_status: "paid" | "partial" | "pending";
  status: "active" | "completed" | "dropped";
  created_at: string;
}

export function useEnrollments() {
  const getEnrollments = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("enrollments")
        .select(
          `
          *,
          students:student_id(*),
          courses:course_id(*)
        `,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      return { data: null, error };
    }
  }, []);

  const getEnrollment = useCallback(async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("enrollments")
        .select(
          `
          *,
          students:student_id(*),
          courses:course_id(*)
        `,
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching enrollment:", error);
      return { data: null, error };
    }
  }, []);

  const getStudentEnrollments = useCallback(async (studentId: string) => {
    try {
      const { data, error } = await supabase
        .from("enrollments")
        .select(
          `
          *,
          courses:course_id(*)
        `,
        )
        .eq("student_id", studentId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching student enrollments:", error);
      return { data: null, error };
    }
  }, []);

  const createEnrollment = useCallback(
    async (enrollment: Omit<Enrollment, "id" | "created_at">) => {
      try {
        const { data, error } = await supabase
          .from("enrollments")
          .insert([enrollment])
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error("Error creating enrollment:", error);
        return { data: null, error };
      }
    },
    [],
  );

  const updateEnrollment = useCallback(
    async (id: string, updates: Partial<Enrollment>) => {
      try {
        const { data, error } = await supabase
          .from("enrollments")
          .update(updates)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error("Error updating enrollment:", error);
        return { data: null, error };
      }
    },
    [],
  );

  const deleteEnrollment = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from("enrollments")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error("Error deleting enrollment:", error);
      return { error };
    }
  }, []);

  return {
    getEnrollments,
    getEnrollment,
    getStudentEnrollments,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment,
  };
}
