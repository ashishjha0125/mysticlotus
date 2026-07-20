import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, ArrowRight, ArrowLeft, Camera, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/lib/auth-context";
import { HealersService } from "@/services/healers.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/healer/onboarding")({
  component: HealerOnboardingPage,
});

const STEPS = [
  { id: "personal", title: "Personal Details" },
  { id: "practice", title: "Practice Details" },
  { id: "logistics", title: "Logistics & Fees" },
  { id: "credentials", title: "Credentials" },
];

function HealerOnboardingPage() {
  const { admin } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [currentStep, setCurrentStep] = useState(0);

  const healerQ = useQuery({
    queryKey: ["healers", admin?.id],
    queryFn: () => HealersService.get(admin!.id),
    enabled: !!admin?.id,
  });

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      mainPhotoUrl: "",
      bio: "",
      city: "",
      state: "",
      primaryModality: "",
      experienceSummary: "",
      healingTool: "",
      specialties: "",
      practicingSince: "",
      feeCurrency: "INR",
      feeRange: "",
      daysAndTimeOfService: "",
      communicationModes: "",
      certifications: "",
      reference: "",
      linkedinLink: "",
    },
  });

  useEffect(() => {
    if (healerQ.data) {
      const h = healerQ.data;
      form.reset({
        firstName: h.firstName || h.name.split(" ")[0] || "",
        lastName: h.lastName || h.name.split(" ").slice(1).join(" ") || "",
        email: h.email || "",
        phone: h.phone || "",
        mainPhotoUrl: h.mainPhotoUrl || h.avatarUrl || "",
        bio: h.bio || "",
        city: h.city || "",
        state: h.state || "",
        primaryModality: h.primaryModality || "",
        experienceSummary: h.experienceSummary || "",
        healingTool: h.healingTool || "",
        specialties: (h.specialties || []).join(", "),
        practicingSince: h.practicingSince || "",
        feeCurrency: h.feeCurrency || "INR",
        feeRange: h.feeRange || "",
        daysAndTimeOfService: h.daysAndTimeOfService || "",
        communicationModes: (h.communicationModes || []).join(", "),
        certifications: h.certifications || "",
        reference: h.reference || "",
        linkedinLink: h.linkedinLink || "",
      });
    }
  }, [healerQ.data, form]);

  const updateMutation = useMutation({
    mutationFn: async (values: any) => {
      const patch = {
        firstName: values.firstName,
        lastName: values.lastName,
        mainPhotoUrl: values.mainPhotoUrl,
        bio: values.bio,
        city: values.city,
        state: values.state,
        primaryModality: values.primaryModality,
        experienceSummary: values.experienceSummary,
        healingTool: values.healingTool,
        specialties: values.specialties.split(",").map((s: string) => s.trim()).filter(Boolean),
        practicingSince: values.practicingSince,
        feeCurrency: values.feeCurrency,
        feeRange: values.feeRange,
        daysAndTimeOfService: values.daysAndTimeOfService,
        communicationModes: values.communicationModes.split(",").map((s: string) => s.trim()).filter(Boolean),
        certifications: values.certifications,
        reference: values.reference,
        linkedinLink: values.linkedinLink,
      };
      return HealersService.update(admin!.id, patch);
    },
    onSuccess: () => {
      toast.success("Profile submitted successfully!");
      qc.invalidateQueries({ queryKey: ["healers", admin?.id] });
      navigate({ to: "/healer/dashboard" });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to save profile");
    },
  });

  const onSubmit = (values: any) => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(c => c + 1);
    } else {
      updateMutation.mutate(values);
    }
  };

  const currentPhoto = form.watch("mainPhotoUrl");

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Left Banner */}
      <div className="hidden lg:flex flex-col w-[45%] relative bg-primary/10 overflow-hidden">
        {/* Placeholder for real image */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=1470&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="mt-auto p-12 relative z-10 text-white">
          <h1 className="font-display text-4xl font-bold mb-4">Join Our Community of Healers</h1>
          <p className="text-lg text-white/90">
            Share your gifts with a world seeking authentic, holistic wellness. Your journey begins here.
          </p>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-8 overflow-y-auto">
        <div className="w-full max-w-xl">
          {/* Header */}
          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold text-foreground">Welcome, Healer</h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Please provide your personal and professional details to begin the onboarding process.
              <br/>
              <span className="italic text-xs mt-1 block">Note: All healer profiles are subject to review and admin approval prior to activation.</span>
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">
              <span>Step {currentStep + 1} of {STEPS.length}</span>
              <span>{STEPS[currentStep].title}</span>
            </div>
            <div className="flex h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-500 ease-out"
                style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-card border border-border shadow-soft rounded-3xl p-6 sm:p-8">
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-5"
                >
                  
                  {/* STEP 1: Personal */}
                  {currentStep === 0 && (
                    <>
                      <div className="flex items-center gap-6 mb-2">
                        <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center border-2 border-border overflow-hidden shrink-0">
                          {currentPhoto ? (
                            <img src={currentPhoto} alt="Profile" className="h-full w-full object-cover" />
                          ) : (
                            <Camera className="h-8 w-8 text-muted-foreground/50" />
                          )}
                        </div>
                        <div className="flex-1">
                          <Label className="mb-1.5 block">Profile Photo URL</Label>
                          <Input placeholder="https://..." {...form.register("mainPhotoUrl")} />
                          <p className="text-[10px] text-muted-foreground mt-1">Provide a link to a professional, welcoming photo.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="mb-1.5 block">First Name</Label>
                          <Input placeholder="e.g. Maya" {...form.register("firstName")} />
                        </div>
                        <div>
                          <Label className="mb-1.5 block">Last Name</Label>
                          <Input placeholder="e.g. Lin" {...form.register("lastName")} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="mb-1.5 block">City</Label>
                          <Input placeholder="e.g. Mumbai" {...form.register("city")} />
                        </div>
                        <div>
                          <Label className="mb-1.5 block">State</Label>
                          <Input placeholder="e.g. Maharashtra" {...form.register("state")} />
                        </div>
                      </div>

                      <div>
                        <Label className="mb-1.5 block">Professional Bio</Label>
                        <Textarea 
                          placeholder="Share your journey, philosophy, and approach to healing..."
                          rows={4}
                          {...form.register("bio")} 
                        />
                      </div>
                    </>
                  )}

                  {/* STEP 2: Practice */}
                  {currentStep === 1 && (
                    <>
                      <div>
                        <Label className="mb-1.5 block">Primary Modality</Label>
                        <Input placeholder="e.g. Pranic Healing, Reiki..." {...form.register("primaryModality")} />
                      </div>
                      
                      <div>
                        <Label className="mb-1.5 block">Specialties (comma separated)</Label>
                        <Input placeholder="e.g. Emotional healing, Stress relief..." {...form.register("specialties")} />
                      </div>

                      <div>
                        <Label className="mb-1.5 block">Healing Tools Used</Label>
                        <Input placeholder="e.g. Crystals, Sound bowls..." {...form.register("healingTool")} />
                      </div>

                      <div>
                        <Label className="mb-1.5 block">Practicing Since (Year)</Label>
                        <Input placeholder="e.g. 2015" {...form.register("practicingSince")} />
                      </div>

                      <div>
                        <Label className="mb-1.5 block">Experience Summary</Label>
                        <Textarea 
                          placeholder="Briefly describe your track record and special achievements..."
                          rows={3}
                          {...form.register("experienceSummary")} 
                        />
                      </div>
                    </>
                  )}

                  {/* STEP 3: Logistics */}
                  {currentStep === 2 && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="mb-1.5 block">Fee Currency</Label>
                          <Select 
                            value={form.watch("feeCurrency")} 
                            onValueChange={(v) => form.setValue("feeCurrency", v)}
                          >
                            <SelectTrigger><SelectValue/></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="INR">INR (₹)</SelectItem>
                              <SelectItem value="USD">USD ($)</SelectItem>
                              <SelectItem value="EUR">EUR (€)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="mb-1.5 block">Typical Fee Range</Label>
                          <Input placeholder="e.g. 1500 - 3000" {...form.register("feeRange")} />
                        </div>
                      </div>

                      <div>
                        <Label className="mb-1.5 block">Communication Modes (comma separated)</Label>
                        <Input placeholder="e.g. Video call, In-person, Phone" {...form.register("communicationModes")} />
                      </div>

                      <div>
                        <Label className="mb-1.5 block">Days and Times of Service</Label>
                        <Textarea 
                          placeholder="e.g. Mon-Fri: 10am to 6pm, Sat: 10am to 2pm"
                          rows={3}
                          {...form.register("daysAndTimeOfService")} 
                        />
                      </div>
                    </>
                  )}

                  {/* STEP 4: Credentials */}
                  {currentStep === 3 && (
                    <>
                      <div>
                        <Label className="mb-1.5 block">Certifications & Qualifications</Label>
                        <Textarea 
                          placeholder="List your relevant certifications..."
                          rows={3}
                          {...form.register("certifications")} 
                        />
                      </div>

                      <div>
                        <Label className="mb-1.5 block">References (Optional)</Label>
                        <Input placeholder="Name or organization that can verify you" {...form.register("reference")} />
                      </div>

                      <div>
                        <Label className="mb-1.5 block">LinkedIn Profile (Optional)</Label>
                        <Input placeholder="https://linkedin.com/in/..." {...form.register("linkedinLink")} />
                      </div>
                    </>
                  )}

                </motion.div>
              </AnimatePresence>

              {/* Footer Actions */}
              <div className="mt-4 flex items-center justify-between">
                {currentStep > 0 ? (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => setCurrentStep(c => c - 1)}
                    className="text-muted-foreground"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                  </Button>
                ) : (
                  <div/>
                )}
                
                <Button 
                  type="submit" 
                  disabled={updateMutation.isPending}
                  className="rounded-xl px-6 bg-primary hover:bg-primary/90"
                >
                  {updateMutation.isPending ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin"/> Saving...</>
                  ) : currentStep === STEPS.length - 1 ? (
                    <><ShieldCheck className="h-4 w-4 mr-2"/> Submit Profile</>
                  ) : (
                    <>Continue <ArrowRight className="h-4 w-4 ml-2"/></>
                  )}
                </Button>
              </div>

            </form>
          </div>

          <div className="mt-8 text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" /> Your data is secure and encrypted.
          </div>
        </div>
      </div>
    </div>
  );
}
