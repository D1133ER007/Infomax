import { useCallback } from "react";
import { supabase } from "@/lib/supabase";

export interface DashboardMetrics {
  totalStudents: number;
  activeEnrollments: number;
  upcomingAppointments: number;
  recentPayments: number;
}

export function useDashboard() {
  const getDashboardMetrics = useCallback(async (): Promise<{
    data: DashboardMetrics | null;
    error: any;
  }> => {
    try {
      // Get total students count
      const { count: totalStudents, error: studentsError } = await supabase
        .from("students")
        .select("*", { count: "exact", head: true });

      if (studentsError) throw studentsError;

      // Get active enrollments count
      const { count: activeEnrollments, error: enrollmentsError } =
        await supabase
          .from("enrollments")
          .select("*", { count: "exact", head: true })
          .eq("status", "active");

      if (enrollmentsError) throw enrollmentsError;

      // Get upcoming appointments count
      const today = new Date().toISOString().split("T")[0];
      const { count: upcomingAppointments, error: appointmentsError } =
        await supabase
          .from("appointments")
          .select("*", { count: "exact", head: true })
          .gte("appointment_date", today)
          .eq("status", "scheduled");

      if (appointmentsError) throw appointmentsError;

      // Get recent payments sum
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split("T")[0];

      const { data: paymentsData, error: paymentsError } = await supabase
        .from("payments")
        .select("amount")
        .gte("payment_date", thirtyDaysAgoStr);

      if (paymentsError) throw paymentsError;

      const recentPayments = paymentsData.reduce(
        (sum, payment) => sum + Number(payment.amount),
        0,
      );

      return {
        data: {
          totalStudents: totalStudents || 0,
          activeEnrollments: activeEnrollments || 0,
          upcomingAppointments: upcomingAppointments || 0,
          recentPayments,
        },
        error: null,
      };
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
      return { data: null, error };
    }
  }, []);

  return {
    getDashboardMetrics,
  };
}
