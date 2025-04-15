import { useCallback } from "react";
import { supabase } from "@/lib/supabase";

export interface Course {
  id: string;
  course_code: string;
  title: string;
  description?: string;
  duration?: string;
  fee: number;
  status: "active" | "inactive";
  created_at: string;
}

export function useCourses() {
  const getCourses = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching courses:", error);
      return { data: null, error };
    }
  }, []);

  const getCourse = useCallback(async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching course:", error);
      return { data: null, error };
    }
  }, []);

  const createCourse = useCallback(
    async (course: Omit<Course, "id" | "created_at">) => {
      try {
        const { data, error } = await supabase
          .from("courses")
          .insert([course])
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error("Error creating course:", error);
        return { data: null, error };
      }
    },
    [],
  );

  const updateCourse = useCallback(
    async (id: string, updates: Partial<Course>) => {
      try {
        const { data, error } = await supabase
          .from("courses")
          .update(updates)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error("Error updating course:", error);
        return { data: null, error };
      }
    },
    [],
  );

  const deleteCourse = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from("courses").delete().eq("id", id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error("Error deleting course:", error);
      return { error };
    }
  }, []);

  return {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
  };
}
