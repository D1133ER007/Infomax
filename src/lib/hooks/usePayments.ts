import { useCallback } from "react";
import { supabase } from "@/lib/supabase";

export interface Payment {
  id: string;
  enrollment_id: string;
  amount: number;
  payment_date: string;
  payment_method?: string;
  transaction_id?: string;
  notes?: string;
  created_at: string;
}

export function usePayments() {
  const getPayments = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("payments")
        .select(
          `
          *,
          enrollments:enrollment_id(*)
        `,
        )
        .order("payment_date", { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching payments:", error);
      return { data: null, error };
    }
  }, []);

  const getRecentPayments = useCallback(async (limit = 10) => {
    try {
      const { data, error } = await supabase
        .from("payments")
        .select(
          `
          *,
          enrollments:enrollment_id(*, students:student_id(*))
        `,
        )
        .order("payment_date", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching recent payments:", error);
      return { data: null, error };
    }
  }, []);

  const getPayment = useCallback(async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("payments")
        .select(
          `
          *,
          enrollments:enrollment_id(*)
        `,
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching payment:", error);
      return { data: null, error };
    }
  }, []);

  const getEnrollmentPayments = useCallback(async (enrollmentId: string) => {
    try {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("enrollment_id", enrollmentId)
        .order("payment_date", { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching enrollment payments:", error);
      return { data: null, error };
    }
  }, []);

  const createPayment = useCallback(
    async (payment: Omit<Payment, "id" | "created_at">) => {
      try {
        const { data, error } = await supabase
          .from("payments")
          .insert([payment])
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error("Error creating payment:", error);
        return { data: null, error };
      }
    },
    [],
  );

  const updatePayment = useCallback(
    async (id: string, updates: Partial<Payment>) => {
      try {
        const { data, error } = await supabase
          .from("payments")
          .update(updates)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error("Error updating payment:", error);
        return { data: null, error };
      }
    },
    [],
  );

  const deletePayment = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from("payments").delete().eq("id", id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error("Error deleting payment:", error);
      return { error };
    }
  }, []);

  return {
    getPayments,
    getRecentPayments,
    getPayment,
    getEnrollmentPayments,
    createPayment,
    updatePayment,
    deletePayment,
  };
}
