import { useCallback } from "react";
import { supabase } from "@/lib/supabase";

export interface Student {
  id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  grade: string;
  date_of_birth?: string;
  contact_no?: string;
  guardian_name?: string;
  guardian_contact?: string;
  address?: string;
  notes?: string;
  enrollment_date: string;
  status: "active" | "inactive";
  created_at: string;
}

export function useStudents() {
  const getStudents = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      console.error("Error fetching students:", error);
      return { data: [], error };
    }
  }, []);

  const getStudent = useCallback(async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching student:", error);
      return { data: null, error };
    }
  }, []);

  const createStudent = useCallback(
    async (student: Omit<Student, "id" | "created_at">) => {
      try {
        const { data, error } = await supabase
          .from("students")
          .insert([student])
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error("Error creating student:", error);
        return { data: null, error };
      }
    },
    [],
  );

  const updateStudent = useCallback(
    async (id: string, updates: Partial<Student>) => {
      try {
        const { data, error } = await supabase
          .from("students")
          .update(updates)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error("Error updating student:", error);
        return { data: null, error };
      }
    },
    [],
  );

  const deleteStudent = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from("students").delete().eq("id", id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error("Error deleting student:", error);
      return { error };
    }
  }, []);

  return {
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
  };
}
