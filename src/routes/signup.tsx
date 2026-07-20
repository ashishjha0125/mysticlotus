import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Leaf, Loader2, Heart, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const SUPABASE_ENABLED =
  !!import.meta.env.VITE_SUPABASE_URL &&
  !!import.meta.env.VITE_SUPABASE_ANON_KEY;

type AccountType = "seeker" | "healer";

const seekerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms",
  }),
});

const healerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().min(6, "Enter a valid phone number"),
  password: z.string().min(6, "At least 6 characters"),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms",
  }),
});

type SeekerFormValues = z.infer<typeof seekerSchema>;
type HealerFormValues = z.infer<typeof healerSchema>;

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const { login, refresh } = useAuth();
  const [accountType, setAccountType] = useState<AccountType>("seeker");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const seekerForm = useForm<SeekerFormValues>({
    resolver: zodResolver(seekerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      agreeTerms: false,
    },
  });

  const healerForm = useForm<HealerFormValues>({
    resolver: zodResolver(healerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      agreeTerms: false,
    },
  });

  const handleSwitchType = (type: AccountType) => {
    setAccountType(type);
  };

  const onSeekerSubmit = async (values: SeekerFormValues) => {
    setSubmitting(true);
    try {
      if (SUPABASE_ENABLED) {
        const { data: authData, error: authErr } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: { name: values.name, role: "seeker" },
          },
        });
        if (authErr) throw new Error(authErr.message);

        const userId = authData.user?.id;
        if (userId) {
          const { error: userError } = await supabase.from("users").upsert({
            id: userId,
            name: values.name.trim(),
            email: values.email.trim().toLowerCase(),
            role: "seeker",
            roles: ["seeker"],
            status: "active",
          });
          if (userError && !userError.message.includes("duplicate")) {
            console.error("User profile creation error:", userError);
          }
        }

        try {
          await login(values.email, values.password, true);
        } catch (loginErr: any) {
          console.error("Auto-login failed:", loginErr);
          toast.warning("Account created, but auto-login failed. Please sign in manually or verify your email if required.", { duration: 5000 });
          await refresh();
          navigate({ to: "/login", replace: true });
          return;
        }
      } else {
        await new Promise((r) => setTimeout(r, 1200));
        const mockUser = {
          id: "mock-new-seeker",
          name: values.name,
          email: values.email,
          role: "seeker",
          roles: ["seeker"],
        };
        localStorage.setItem("mock_admin", JSON.stringify(mockUser));
        await refresh();
      }

      toast.success("Account created successfully! 🌸", {
        description: "Welcome to Mystic Lotus & Dragonflies.",
      });
      navigate({ to: "/", replace: true });
    } catch (err: any) {
      toast.error("Sign up failed", {
        description: err?.message || "Please check your details and try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const onHealerSubmit = async (values: HealerFormValues) => {
    setSubmitting(true);
    try {
      if (SUPABASE_ENABLED) {
        const { data: authData, error: authErr } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: { name: values.name, role: "healer" },
          },
        });
        if (authErr) throw new Error(authErr.message);

        const userId = authData.user?.id;
        if (userId) {
          const { error: userError } = await supabase.from("users").upsert({
            id: userId,
            name: values.name.trim(),
            email: values.email.trim().toLowerCase(),
            phone: values.phone.trim() || null,
            role: "healer",
            roles: ["healer"],
            status: "active",
          });
          if (userError && !userError.message.includes("duplicate")) {
            console.error("User profile creation error:", userError);
          }

          const modalityName = "Pranic Healing";
          const { error: healerError } = await supabase.from("healers").upsert({
            id: userId,
            status: "approved",
            modalities: [modalityName],
            primary_modality: modalityName,
            documents_verified: false,
          });
          if (healerError && !healerError.message.includes("duplicate")) {
            console.error("Healer table creation error:", healerError);
          }
        }

        try {
          await login(values.email, values.password, true);
        } catch (loginErr: any) {
          console.error("Auto-login failed:", loginErr);
          toast.warning("Account created, but auto-login failed. Please sign in manually or verify your email if required.", { duration: 5000 });
          await refresh();
          navigate({ to: "/login", replace: true });
          return;
        }
      } else {
        await new Promise((r) => setTimeout(r, 1200));
        const mockHealer = {
          id: "mock-new-healer",
          name: values.name,
          email: values.email,
          role: "healer",
          roles: ["healer"],
        };
        localStorage.setItem("mock_admin", JSON.stringify(mockHealer));
        await refresh();
      }

      toast.success("Practitioner Account Created! 🌿", {
        description: `Welcome, ${values.name}! Redirecting to onboarding...`,
      });
      navigate({ to: "/healer/onboarding", replace: true });
    } catch (err: any) {
      toast.error("Sign up failed", {
        description: err?.message || "Please check your details and try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background px-4 py-10">
      {/* ambient glows */}
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
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="relative">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-secondary to-primary text-white shadow-soft">
              <Sparkles className="h-7 w-7" />
            </div>
          </div>
          <h1 className="mt-5 font-display text-2xl font-semibold tracking-tight text-foreground">
            Create Account
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Join Mystic Lotus & Dragonflies
          </p>
        </div>

        {/* Account Type Toggle */}
        <div className="mb-6">
          <div className="flex rounded-2xl border border-border/60 bg-muted/40 p-1">
            <button
              type="button"
              onClick={() => handleSwitchType("seeker")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-300 ${
                accountType === "seeker"
                  ? "bg-background text-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Heart className={`h-4 w-4 ${accountType === "seeker" ? "text-primary" : ""}`} />
              Seeker
            </button>
            <button
              type="button"
              onClick={() => handleSwitchType("healer")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-300 ${
                accountType === "healer"
                  ? "bg-background text-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className={`h-4 w-4 ${accountType === "healer" ? "text-primary" : ""}`} />
              Healer
            </button>
          </div>
        </div>

        {/* Forms */}
        <AnimatePresence mode="wait">
          {accountType === "seeker" ? (
            <motion.form
              key="seeker-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
              onSubmit={seekerForm.handleSubmit(onSeekerSubmit)}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="seeker-name">Full Name</Label>
                <Input
                  id="seeker-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Jane Doe"
                  {...seekerForm.register("name")}
                />
                {seekerForm.formState.errors.name && (
                  <p className="text-xs text-destructive">
                    {seekerForm.formState.errors.name.message}
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
                  {...seekerForm.register("email")}
                />
                {seekerForm.formState.errors.email && (
                  <p className="text-xs text-destructive">
                    {seekerForm.formState.errors.email.message}
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
                    {...seekerForm.register("password")}
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
                {seekerForm.formState.errors.password && (
                  <p className="text-xs text-destructive">
                    {seekerForm.formState.errors.password.message}
                  </p>
                )}
              </div>



              <div className="mt-1 flex flex-col gap-1.5">
                <label className="flex cursor-pointer items-start gap-2 text-sm text-muted-foreground">
                  <Checkbox
                    className="mt-0.5"
                    checked={seekerForm.watch("agreeTerms")}
                    onCheckedChange={(v) => seekerForm.setValue("agreeTerms", Boolean(v))}
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
                {seekerForm.formState.errors.agreeTerms && (
                  <p className="text-xs text-destructive">
                    {seekerForm.formState.errors.agreeTerms.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="mt-2 h-11 rounded-xl text-sm"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account…
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </motion.form>
          ) : (
            <motion.form
              key="healer-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              onSubmit={healerForm.handleSubmit(onHealerSubmit)}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="healer-name">Full Name</Label>
                <Input
                  id="healer-name"
                  type="text"
                  autoComplete="name"
                  placeholder="e.g. Maya Lin"
                  {...healerForm.register("name")}
                />
                {healerForm.formState.errors.name && (
                  <p className="text-xs text-destructive">
                    {healerForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="healer-email">Email</Label>
                <Input
                  id="healer-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@email.com"
                  {...healerForm.register("email")}
                />
                {healerForm.formState.errors.email && (
                  <p className="text-xs text-destructive">
                    {healerForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="healer-phone">Phone Number</Label>
                <Input
                  id="healer-phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+91 98765 43210"
                  {...healerForm.register("phone")}
                />
                {healerForm.formState.errors.phone && (
                  <p className="text-xs text-destructive">
                    {healerForm.formState.errors.phone.message}
                  </p>
                )}
              </div>




              <div className="flex flex-col gap-1.5">
                <Label htmlFor="healer-password">Password</Label>
                <div className="relative">
                  <Input
                    id="healer-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    {...healerForm.register("password")}
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
                {healerForm.formState.errors.password && (
                  <p className="text-xs text-destructive">
                    {healerForm.formState.errors.password.message}
                  </p>
                )}
              </div>



              <div className="mt-1 flex flex-col gap-1.5">
                <label className="flex cursor-pointer items-start gap-2 text-sm text-muted-foreground">
                  <Checkbox
                    className="mt-0.5"
                    checked={healerForm.watch("agreeTerms")}
                    onCheckedChange={(v) => healerForm.setValue("agreeTerms", Boolean(v))}
                  />
                  <span>
                    I agree to the{" "}
                    <a href="#" className="text-primary hover:underline">
                      Practitioner Code of Ethics
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-primary hover:underline">
                      Terms of Service
                    </a>
                  </span>
                </label>
                {healerForm.formState.errors.agreeTerms && (
                  <p className="text-xs text-destructive">
                    {healerForm.formState.errors.agreeTerms.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="mt-2 h-11 rounded-xl text-sm"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account…
                  </>
                ) : (
                  "Sign Up as Healer"
                )}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>

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
            to="/login"
            search={{}}
            className="font-semibold text-primary hover:underline"
          >
            Sign In
          </Link>
        </div>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          Your journey is protected & private.
        </p>
      </motion.div>
    </div>
  );
}
