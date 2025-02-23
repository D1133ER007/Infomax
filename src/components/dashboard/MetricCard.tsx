import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ElementType;
  trend?: number;
  className?: string;
}

const MetricCard = ({
  title = "Total Students",
  value = "0",
  icon: Icon,
  trend = 0,
  className,
}: MetricCardProps) => {
  return (
    <Card
      className={cn(
        "p-6 bg-background hover:shadow-lg transition-shadow",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
          {trend !== 0 && (
            <p
              className={cn(
                "text-sm mt-2",
                trend > 0 ? "text-green-600" : "text-red-600",
              )}
            >
              {trend > 0 ? "+" : ""}
              {trend}% from last month
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-primary/10 rounded-full">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        )}
      </div>
    </Card>
  );
};

export default MetricCard;
