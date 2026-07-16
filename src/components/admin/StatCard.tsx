import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type StatCardProps = {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  delta?: { value: number; positive?: boolean } | null;
  loading?: boolean;
  className?: string;
};

export function StatCard({
  label,
  value,
  hint,
  icon,
  delta,
  loading,
  className,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Card
        className={cn(
          "glass shadow-soft relative overflow-hidden rounded-2xl p-5",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
            <div className="mt-2 text-2xl font-semibold tracking-tight">
              {loading ? (
                <span className="inline-block h-7 w-24 animate-pulse rounded bg-muted" />
              ) : (
                value
              )}
            </div>
            {(hint || delta) && (
              <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                {delta && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 font-medium",
                      delta.positive
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive",
                    )}
                  >
                    {delta.positive ? "▲" : "▼"} {Math.abs(delta.value)}%
                  </span>
                )}
                {hint}
              </div>
            )}
          </div>
          {icon && (
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              {icon}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
