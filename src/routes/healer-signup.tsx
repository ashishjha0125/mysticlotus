import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Sparkles, Loader2, CheckCircle2, ShieldCheck, HeartPulse, Award, Users } from "lucide-react";
import { motion } from "framer-motion";
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

const schema = z
  .object({
    name: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().trim().email("Enter a valid practitioner email"),
    phone: z.string().min(6, "Enter a valid phone number"),
    role: z.enum(["healer", "coach", "therapist"]),
    primaryModality: z.string().min(2, "Enter your primary practice modality"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the practitioner code of ethics & terms",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export const Route = createFileRoute("/healer-signup")({
  component: HealerSignupPage,
});

function HealerSignupPage() {
  const navigate = useNavigate();
  const { login, refresh } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "healer",
      primaryModality: "Pranic Healing",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
  });

  const selectedRole = form.watch("role");

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      if (SUPABASE_ENABLED) {
        // 1. Sign up user via Supabase Auth
        const { data: authData, error: authErr } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              name: values.name,
              role: values.role,
            },
          },
        });

        if (authErr) throw new Error(authErr.message);

        const userId = authData.user?.id;
        if (userId) {
          // 2. Insert into public.users table
          const { error: userError } = await supabase.from("users").upsert({
            id: userId,
            name: values.name.trim(),
            email: values.email.trim().toLowerCase(),
            phone: values.phone.trim() || null,
            role: values.role,
            roles: [values.role],
            status: "active",
          });
          if (userError && !userError.message.includes("duplicate")) {
            console.error("User profile creation error:", userError);
          }

          // 3. Insert into public.healers table
          const modalityName =
            values.role === "therapist"
              ? "Therapy & Counselling"
              : values.role === "coach"
              ? "Holistic Coaching"
              : values.primaryModality.trim() || "Pranic Healing";

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

        // 4. Log in immediately
        try {
          await login(values.email, values.password, true);
        } catch (e) {
          // If email confirmation required or auto-login failed, refresh session
          await refresh();
        }
      } else {
        // Fallback for non-supabase demo mode
        await new Promise((r) => setTimeout(r, 1000));
      }

      toast.success("Practitioner Account Created Successfully! 🌿", {
        description: `Welcome to HealConnect, ${values.name}! Redirecting to your dashboard...`,
      });

      navigate({ to: "/healer/dashboard", replace: true });
    } catch (err: any) {
      toast.error("Sign up failed", {
        description: err?.message || "Please check your details and try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#f2f5f3] px-4 py-12">
      {/* Background teal holistic gradients */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#1f5c5c]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 h-[500px] w-[500px] rounded-full bg-emerald-600/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-xl rounded-3xl bg-white p-8 sm:p-10 shadow-xl border border-gray-100/80 my-auto"
      >
        {/* Header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[#1f5c5c] to-[#347676] text-white shadow-lg shadow-[#1f5c5c]/20">
            <Sparkles className="h-8 w-8" />
          </div>
          <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-gray-900">
            Join HealConnect as a Practitioner
          </h1>
          <p className="mt-1.5 text-sm text-gray-500 max-w-md">
            Set up your professional profile on Mystic Lotus, offer sessions, and manage appointments.
          </p>
        </div>

        {/* Role Selector */}
        <div className="mb-6">
          <Label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 block text-center">
            Step 1: Select Your Primary Practice Role
          </Label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "healer", label: "Healer", icon: HeartPulse, desc: "Energy & Pranic" },
              { id: "coach", label: "Coach", icon: Award, desc: "Life & Wellness" },
              { id: "therapist", label: "Therapist", icon: Users, desc: "Counselling & Mind" },
            ].map((r) => {
              const active = selectedRole === r.id;
              const Icon = r.icon;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => form.setValue("role", r.id as any)}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition-all ${
                    active
                      ? "border-[#1f5c5c] bg-[#e6f4f1] text-[#1f5c5c] shadow-sm font-bold"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Icon className={`h-5 w-5 mb-1 ${active ? "text-[#1f5c5c]" : "text-gray-400"}`} />
                  <span className="text-xs font-semibold">{r.label}</span>
                  <span className="text-[10px] opacity-70 mt-0.5">{r.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-gray-700">Full Name *</Label>
              <Input
                placeholder="e.g. Maya Lin"
                className="rounded-xl border-gray-200"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-gray-700">Email Address *</Label>
              <Input
                type="email"
                placeholder="maya@healing.com"
                className="rounded-xl border-gray-200"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-gray-700">Phone Number *</Label>
              <Input
                placeholder="+1 555 019 2834"
                className="rounded-xl border-gray-200"
                {...form.register("phone")}
              />
              {form.formState.errors.phone && (
                <p className="text-xs text-red-500">{form.formState.errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-gray-700">Primary Modality / Specialty *</Label>
              <Input
                placeholder="e.g. Pranic Healing, Sound Bath"
                className="rounded-xl border-gray-200"
                {...form.register("primaryModality")}
              />
              {form.formState.errors.primaryModality && (
                <p className="text-xs text-red-500">{form.formState.errors.primaryModality.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-gray-700">Create Password *</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="rounded-xl border-gray-200 pr-10"
                  {...form.register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-xs text-red-500">{form.formState.errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-gray-700">Confirm Password *</Label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="rounded-xl border-gray-200"
                {...form.register("confirmPassword")}
              />
              {form.formState.errors.confirmPassword && (
                <p className="text-xs text-red-500">{form.formState.errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {/* Terms checkbox */}
          <div className="pt-2">
            <label className="flex cursor-pointer items-start gap-2.5 text-xs text-gray-600">
              <Checkbox
                className="mt-0.5 rounded border-gray-300 text-[#1f5c5c]"
                checked={form.watch("agreeTerms")}
                onCheckedChange={(v) => form.setValue("agreeTerms", Boolean(v))}
              />
              <span className="leading-relaxed">
                I confirm that my certifications and credentials are valid and agree to the{" "}
                <a href="#" className="font-semibold text-[#1f5c5c] hover:underline">
                  Practitioner Code of Ethics
                </a>{" "}
                and{" "}
                <a href="#" className="font-semibold text-[#1f5c5c] hover:underline">
                  Terms of Service
                </a>
                .
              </span>
            </label>
            {form.formState.errors.agreeTerms && (
              <p className="text-xs text-red-500 mt-1">{form.formState.errors.agreeTerms.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="mt-4 w-full h-12 rounded-full bg-[#1f5c5c] hover:bg-[#154646] text-white font-semibold shadow-lg shadow-[#1f5c5c]/20 transition-all text-sm"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up Practitioner Account...
              </>
            ) : (
              <>
                <ShieldCheck className="mr-2 h-5 w-5" />
                Create Account & Access Dashboard
              </>
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">Already registered?</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Sign in redirect */}
        <div className="text-center text-sm text-gray-600">
          Already have a practitioner account?{" "}
          <Link to="/login" className="font-bold text-[#1f5c5c] hover:underline">
            Sign in to HealConnect
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
