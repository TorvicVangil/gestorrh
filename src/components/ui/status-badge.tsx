import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-secondary text-secondary-foreground",
        success: "bg-accent/10 text-accent",
        warning: "bg-warning/10 text-warning",
        danger: "bg-destructive/10 text-destructive",
        info: "bg-info/10 text-info",
        primary: "bg-primary/10 text-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}

export function StatusBadge({ children, variant, dot = true, className }: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ variant }), className)}>
      {dot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full", {
            "bg-secondary-foreground": variant === "default",
            "bg-accent": variant === "success",
            "bg-warning": variant === "warning",
            "bg-destructive": variant === "danger",
            "bg-info": variant === "info",
            "bg-primary": variant === "primary",
          })}
        />
      )}
      {children}
    </span>
  );
}
