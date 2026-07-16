import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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

const schema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().trim().email("Enter a valid email"),
    password: z.string().min(6, "At least 6 characters"),
    confirmPassword: z.string(),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export const Route = createFileRoute("/seeker-signup")({
  component: SeekerSignupPage,
});

function SeekerSignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      // Seeker signup logic — placeholder for now
      await new Promise((r) => setTimeout(r, 1200));
      toast.success("Account created successfully! 🌸", {
        description: "Welcome to Mystic Lotus & Dragonflies.",
      });
      // In a real app, redirect to seeker dashboard or onboarding
      navigate({ to: "/", replace: true });
    } catch {
      toast.error("Sign up failed", {
        description: "Please check your details and try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background px-4 py-10">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
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
              <Sparkles className="h-7 w-7" />
            </div>
            <div className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-warning text-[10px]">
              ✨
            </div>
          </div>
          <h1 className="mt-5 font-display text-2xl font-semibold tracking-tight text-foreground">
            Join Mystic Lotus
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Start your journey to holistic wellness
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="seeker-name">Full Name</Label>
            <Input
              id="seeker-name"
              type="text"
              autoComplete="name"
              placeholder="Jane Doe"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

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
            <Label htmlFor="seeker-password">Password</Label>
            <div className="relative">
              <Input
                id="seeker-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
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

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="seeker-confirm-password">Confirm Password</Label>
            <Input
              id="seeker-confirm-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              {...form.register("confirmPassword")}
            />
            {form.formState.errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="mt-2 flex flex-col gap-1.5">
            <label className="flex cursor-pointer items-start gap-2 text-sm text-muted-foreground">
              <Checkbox
                className="mt-0.5"
                checked={form.watch("agreeTerms")}
                onCheckedChange={(v) => form.setValue("agreeTerms", Boolean(v))}
              />
              <span>
                I agree to the{" "}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>
            {form.formState.errors.agreeTerms && (
              <p className="text-xs text-destructive">
                {form.formState.errors.agreeTerms.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="mt-2 h-11 rounded-xl bg-gradient-to-r from-secondary to-primary text-sm font-semibold text-white hover:opacity-90"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account…
              </>
            ) : (
              <>
                <Heart className="mr-2 h-4 w-4" />
                Create Seeker Account
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

        {/* Login prompt */}
        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/seeker-login"
            className="font-semibold text-primary hover:underline"
          >
            Sign in
          </Link>
        </div>

      </motion.div>
    </div>
  );
}
