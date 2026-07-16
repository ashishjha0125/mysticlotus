import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Heart, Leaf, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
  remember: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export const Route = createFileRoute("/seeker-login")({
  component: SeekerLoginPage,
});

function SeekerLoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", remember: true },
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      // Seeker login logic — placeholder for now
      await new Promise((r) => setTimeout(r, 1200));
      toast.success("Welcome back! 🌸", {
        description: "Redirecting to your dashboard...",
      });
      // In a real app, redirect to seeker dashboard
      navigate({ to: "/", replace: true });
    } catch {
      toast.error("Sign in failed", {
        description: "Please check your credentials and try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background px-4 py-10">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-warning/5 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="glass shadow-elevated relative w-full max-w-md rounded-3xl p-8"
      >
        {/* Header */}
        <div className="mb-7 flex flex-col items-center text-center">
          <div className="relative">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-secondary to-primary text-white shadow-soft">
              <Heart className="h-7 w-7" />
            </div>
            <div className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-warning text-[10px]">
              ✨
            </div>
          </div>
          <h1 className="mt-5 font-display text-2xl font-semibold tracking-tight text-foreground">
            Welcome Back, Seeker
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Continue your journey to wellness & healing
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="seeker-email">Email</Label>
            <Input
              id="seeker-email"
              type="email"
              autoComplete="email"
              placeholder="your@email.com"
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
              <Label htmlFor="seeker-password">Password</Label>
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="seeker-password"
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
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
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

          <Button
            type="submit"
            disabled={submitting}
            className="mt-2 h-11 rounded-xl bg-gradient-to-r from-secondary to-primary text-sm font-semibold text-white hover:opacity-90"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in…
              </>
            ) : (
              <>
                <Heart className="mr-2 h-4 w-4" />
                Sign In as Seeker
              </>
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border/60" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border/60" />
        </div>

        {/* Sign up prompt */}
        <div className="rounded-2xl border border-border/60 bg-muted/30 p-4 text-center">
          <p className="text-sm text-muted-foreground">
            New to Mystic Lotus?{" "}
            <Link
              to="/seeker-signup"
              className="font-semibold text-primary hover:underline"
            >
              Create your account
            </Link>
          </p>
        </div>

        {/* Admin/Healer login link */}
        <div className="mt-5 flex items-center justify-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Are you a Healer or Admin?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary hover:underline"
            >
              Login here
            </Link>
          </span>
        </div>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          Your healing journey is protected & private.
        </p>
      </motion.div>
    </div>
  );
}
