import { createFileRoute, Link, Navigate, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Leaf, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/auth-context";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
  remember: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({
    expired: s.expired === "1" || s.expired === 1 ? ("1" as const) : undefined,
    redirect: typeof s.redirect === "string" ? s.redirect : (undefined as string | undefined),
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login, isAuthenticated, loading, admin } = useAuth();
  const navigate = useNavigate();
  const search = useSearch({ from: "/login" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", remember: true },
  });

  useEffect(() => {
    if (search.expired === "1") {
      toast.warning("Session expired", { description: "Please sign in again." });
    }
  }, [search.expired]);

  if (!loading && isAuthenticated) {
    const defaultRoute = admin?.role === "healer" ? "/healer/dashboard" : "/dashboard";
    return <Navigate to={search.redirect ?? defaultRoute} replace />;
  }

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      await login(values.email, values.password, values.remember ?? false);
      toast.success("Welcome back");
      // Navigation is handled by the isAuthenticated check above
    } catch (err) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? String(err.response.data.message)
          : axios.isAxiosError(err) && err.code === "ERR_NETWORK"
            ? "Can't reach the API. Check that VITE_API_URL points to your Express server and CORS allows this origin."
            : "Invalid credentials";
      toast.error("Sign in failed", { description: message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background px-4 py-10">
      {/* ambient glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-secondary/25 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="glass shadow-elevated relative w-full max-w-md rounded-3xl p-8"
      >
        <div className="mb-7 flex flex-col items-center text-center">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
            <Leaf className="h-6 w-6" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight">
            Mystic Lotus & Dragonflies
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Healer & Admin sign in
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="healer@mysticlotus.com"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-xs text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                {...form.register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {form.formState.errors.password && (
              <p className="text-xs text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
            <Checkbox
              checked={form.watch("remember")}
              onCheckedChange={(v) => form.setValue("remember", Boolean(v))}
            />
            Remember me on this device
          </label>

          <Button type="submit" disabled={submitting} className="mt-2 h-11 rounded-xl text-sm">
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <div className="mt-5 text-center text-xs text-muted-foreground">
          Are you a seeker?{" "}
          <Link to="/seeker-login" className="font-semibold text-primary hover:underline">
            Seeker Sign In
          </Link>
        </div>

        {!import.meta.env.VITE_API_URL && (
          <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground mb-1.5 flex items-center gap-1.5 text-primary">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              Running in Mock Mode
            </p>
            <p className="mb-2 leading-relaxed">
              No backend API URL detected. The app is running in offline preview mode with client-side mock data. Use these credentials to sign in:
            </p>
            <div className="grid grid-cols-2 gap-2 bg-background/50 p-2.5 rounded-xl border border-border">
              <div className="col-span-2 text-primary font-semibold border-b border-border/50 pb-1 mb-1">Admin</div>
              <div>
                <span className="block font-medium text-foreground">Email:</span>
                <code className="text-primary font-mono text-xs">admin@mysticlotus.com</code>
              </div>
              <div>
                <span className="block font-medium text-foreground">Password:</span>
                <code className="text-primary font-mono text-xs">admin123</code>
              </div>
              <div className="col-span-2 text-primary font-semibold border-b border-border/50 pb-1 mb-1 mt-2">Healer</div>
              <div>
                <span className="block font-medium text-foreground">Email:</span>
                <code className="text-primary font-mono text-xs">aria.thorne@healing.com</code>
              </div>
              <div>
                <span className="block font-medium text-foreground">Password:</span>
                <code className="text-primary font-mono text-xs">healer123</code>
              </div>
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Protected area. All activity is logged.
        </p>
      </motion.div>
    </div>
  );
}
