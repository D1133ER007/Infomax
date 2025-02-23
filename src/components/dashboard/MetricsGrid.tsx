import React from "react";
import { Users, GraduationCap, Calendar, Wallet } from "lucide-react";
import MetricCard from "./MetricCard";

interface MetricsGridProps {
  metrics?: {
    totalStudents: number;
    activeEnrollments: number;
    upcomingAppointments: number;
    recentPayments: number;
  };
}

export default function MetricsGrid({
  metrics = {
    totalStudents: 1250,
    activeEnrollments: 856,
    upcomingAppointments: 28,
    recentPayments: 15600,
  },
}: MetricsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-background">
      <MetricCard
        title="Total Students"
        value={metrics.totalStudents}
        icon={Users}
        trend={12}
      />
      <MetricCard
        title="Active Enrollments"
        value={metrics.activeEnrollments}
        icon={GraduationCap}
        trend={5}
      />
      <MetricCard
        title="Upcoming Appointments"
        value={metrics.upcomingAppointments}
        icon={Calendar}
        trend={-2}
      />
      <MetricCard
        title="Recent Payments"
        value={`$${metrics.recentPayments.toLocaleString()}`}
        icon={Wallet}
        trend={8}
      />
    </div>
  );
}
