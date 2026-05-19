import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "danger" | "muted";

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-accent-muted text-accent",
  success: "bg-emerald-500/15 text-emerald-400",
  danger: "bg-red-500/15 text-red-400",
  muted: "bg-zinc-800 text-zinc-400",
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
