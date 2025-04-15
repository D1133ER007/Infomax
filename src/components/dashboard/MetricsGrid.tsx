import React, { useEffect, useState } from "react";
import { Users, GraduationCap, Calendar, CreditCard } from "lucide-react";
import { useDashboard, DashboardMetrics } from "@/lib/hooks/useDashboard";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: number;
  className?: string;
}

function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  className,
}: MetricCardProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="p-2 rounded-full bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      <div className="mt-3">
        <div className="text-3xl font-bold">{value}</div>
        {trend !== undefined && (
          <p
            className={`text-xs mt-1 ${trend >= 0 ? "text-green-500" : "text-red-500"}`}
          >
            {trend >= 0 ? "+" : ""}
            {trend}% from last month
          </p>
        )}
      </div>
    </div>
  );
}

export default function MetricsGrid({
  metrics: initialMetrics,
}: {
  metrics?: DashboardMetrics;
}) {
  const [metrics, setMetrics] = useState<DashboardMetrics>(
    initialMetrics || {
      totalStudents: 0,
      activeEnrollments: 0,
      upcomingAppointments: 0,
      recentPayments: 0,
    },
  );
  const [loading, setLoading] = useState(!initialMetrics);
  const { getDashboardMetrics } = useDashboard();

  useEffect(() => {
    if (!initialMetrics) {
      const fetchMetrics = async () => {
        setLoading(true);
        const { data } = await getDashboardMetrics();
        if (data) {
          setMetrics(data);
        }
        setLoading(false);
      };

      fetchMetrics();
    }
  }, [getDashboardMetrics, initialMetrics]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-background">
      <MetricCard
        title="Total Students"
        value={loading ? "..." : metrics.totalStudents}
        icon={Users}
        trend={12}
      />
      <MetricCard
        title="Active Enrollments"
        value={loading ? "..." : metrics.activeEnrollments}
        icon={GraduationCap}
        trend={5}
      />
      <MetricCard
        title="Upcoming Appointments"
        value={loading ? "..." : metrics.upcomingAppointments}
        icon={Calendar}
        trend={-2}
      />
      <MetricCard
        title="Recent Payments"
        value={loading ? "..." : `$${metrics.recentPayments.toLocaleString()}`}
        icon={CreditCard}
        trend={8}
      />
    </div>
  );
}
