import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  variant?: "default" | "primary" | "accent" | "warning";
  className?: string;
}

const variantStyles = {
  default: {
    bg: "bg-card",
    icon: "bg-secondary text-secondary-foreground",
  },
  primary: {
    bg: "bg-card",
    icon: "bg-primary/10 text-primary",
  },
  accent: {
    bg: "bg-card",
    icon: "bg-accent/10 text-accent",
  },
  warning: {
    bg: "bg-card",
    icon: "bg-warning/10 text-warning",
  },
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "rounded-xl p-5 shadow-card border border-border/50 transition-all duration-300 hover:shadow-lg animate-fade-in",
        styles.bg,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={cn(
                  "text-xs font-medium",
                  trend.positive ? "text-accent" : "text-destructive"
                )}
              >
                {trend.positive ? "+" : ""}{trend.value}%
              </span>
              <span className="text-xs text-muted-foreground">vs mês anterior</span>
            </div>
          )}
        </div>
        <div className={cn("w-11 h-11 rounded-lg flex items-center justify-center shrink-0", styles.icon)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
