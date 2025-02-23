import { useCallback } from "react";
import { supabase } from "@/lib/supabase";

export interface Enquiry {
  id: string;
  enquiry_id: string;
  registered_id: string;
  enquiry_date: string;
  start_date: string;
  full_name: string;
  date_of_birth: string;
  contact_no: string;
  email: string;
  academic_qualification: string;
  technical_qualification: string;
  occupation: string;
  guardian_name: string;
  guardian_occupation: string;
  guardian_contact: string;
  temporary_address: string;
  permanent_address: string;
  enrolled_course: string;
  time_preferred: string;
  scheme_name: string;
  course_fee: number;
  net_course_fee: number;
  scheme_offered: boolean;
  discount_given: string;
  created_at: string;
}

export function useEnquiries() {
  const createEnquiry = useCallback(
    async (data: Omit<Enquiry, "id" | "created_at">) => {
      try {
        const { data: newEnquiry, error } = await supabase
          .from("enquiries")
          .insert([data])
          .select()
          .single();

        if (error) throw error;
        return { data: newEnquiry, error: null };
      } catch (error) {
        console.error("Error creating enquiry:", error);
        return { data: null, error };
      }
    },
    [],
  );

  const getEnquiries = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("enquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching enquiries:", error);
      return { data: null, error };
    }
  }, []);

  const getEnquiry = useCallback(async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("enquiries")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching enquiry:", error);
      return { data: null, error };
    }
  }, []);

  return {
    createEnquiry,
    getEnquiries,
    getEnquiry,
  };
}
