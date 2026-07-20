import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Save,
  User,
  CheckCircle2,
  FileText,
  Upload,
  Video,
  ShieldCheck,
  MapPin,
  Calendar,
  Sparkles,
  Award,
  Link as LinkIcon,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/lib/auth-context";
import { HealersService, type Healer } from "@/services/healers.service";
import { UsersService } from "@/services/users.service";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingState, ErrorState } from "@/components/admin/States";

export const Route = createFileRoute("/healer/profile")({
  component: HealerProfilePage,
});

type HealerFormValues = {
  firstName: string;
  lastName: string;
  orgName: string;
  dob: string;
  gender: string;
  bio: string;
  mainPhotoUrl: string;
  videoUrl: string;
  languages: string;
  address: string;
  state: string;
  city: string;
  area: string;
  pinCode: string;
  primaryModality: string;
  practicingSince: string;
  secondaryModalities: string;
  secondaryModalitiesText: string;
  experienceSummary: string;
  healingTool: string;
  specialties: string;
  feeCurrency: string;
  feeLimit: number;
  feeRange: string;
  statusFee: string;
  communicationModes: string;
  daysAndTimeOfService: string;
  reference: string;
  certifications: string;
  awards: string;
  facebookLink: string;
  twitterLink: string;
  linkedinLink: string;
  instagramLink: string;
  pinterestLink: string;
  googleLink: string;
};

function HealerProfilePage() {
  const { admin } = useAuth();
  const qc = useQueryClient();
  const healerId = admin?.id;

  const healerQ = useQuery({
    queryKey: ["healers", healerId],
    queryFn: () => (healerId ? HealersService.get(healerId) : null),
    enabled: !!healerId,
  });

  const docsQ = useQuery({
    queryKey: ["healers", healerId, "docs"],
    queryFn: () => (healerId ? HealersService.documents(healerId) : []),
    enabled: !!healerId,
  });

  const form = useForm<HealerFormValues>();

  useEffect(() => {
    if (healerQ.data) {
      const h = healerQ.data;
      form.reset({
        firstName: h.firstName ?? h.name.split(" ")[0] ?? "",
        lastName: h.lastName ?? (h.name.split(" ").slice(1).join(" ") || ""),
        orgName: h.orgName ?? "MYSTIC LOTUS",
        dob: h.dob ?? "",
        gender: h.gender ?? "Female",
        bio: h.bio ?? "",
        mainPhotoUrl: h.mainPhotoUrl ?? h.avatarUrl ?? "",
        videoUrl: h.videoUrl ?? "",
        languages: (h.languages ?? ["Hindi", "English"]).join(", "),
        address: h.address ?? "",
        state: h.state ?? "Maharashtra",
        city: h.city ?? "Mumbai",
        area: h.area ?? "Goregaon",
        pinCode: h.pinCode ?? "400063",
        primaryModality: h.primaryModality ?? (h.modalities?.[0] ?? "Pranic Healing"),
        practicingSince: h.practicingSince ?? "2007",
        secondaryModalities: (h.secondaryModalities ?? (h.modalities?.slice(1) ?? [])).join(", "),
        secondaryModalitiesText: h.secondaryModalitiesText ?? "",
        experienceSummary: h.experienceSummary ?? h.bio ?? "",
        healingTool: h.healingTool ?? "",
        specialties: (h.specialties ?? ["Emotional", "Physical", "Spiritual"]).join(", "),
        feeCurrency: h.feeCurrency ?? "INR",
        feeLimit: h.feeLimit ?? 2500,
        feeRange: h.feeRange ?? "1000 - 2500",
        statusFee: h.statusFee ?? "0",
        communicationModes: (h.communicationModes ?? ["email", "on call", "in person"]).join(", "),
        daysAndTimeOfService: h.daysAndTimeOfService ?? "Sunday to Friday : 9 AM to 6 PM",
        reference: h.reference ?? "",
        certifications: h.certifications ?? "",
        awards: h.awards ?? "",
        facebookLink: h.facebookLink ?? "",
        twitterLink: h.twitterLink ?? "",
        linkedinLink: h.linkedinLink ?? "",
        instagramLink: h.instagramLink ?? "",
        pinterestLink: h.pinterestLink ?? "",
        googleLink: h.googleLink ?? "",
      });
    }
  }, [healerQ.data, form]);

  const updateMutation = useMutation({
    mutationFn: async (values: HealerFormValues) => {
      if (!healerId) throw new Error("No healer ID");
      const fullName = `${values.firstName.trim()} ${values.lastName.trim()}`.trim() || admin?.name || "Practitioner";

      const patch: Partial<Healer> = {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        name: fullName,
        orgName: values.orgName,
        dob: values.dob,
        gender: values.gender,
        bio: values.bio,
        mainPhotoUrl: values.mainPhotoUrl || null,
        avatarUrl: values.mainPhotoUrl || null,
        videoUrl: values.videoUrl || null,
        languages: values.languages.split(",").map((s) => s.trim()).filter(Boolean),
        address: values.address,
        state: values.state,
        city: values.city,
        area: values.area,
        pinCode: values.pinCode,
        primaryModality: values.primaryModality,
        practicingSince: values.practicingSince,
        secondaryModalities: values.secondaryModalities.split(",").map((s) => s.trim()).filter(Boolean),
        modalities: [
          values.primaryModality.trim(),
          ...values.secondaryModalities.split(",").map((s) => s.trim()).filter(Boolean),
        ].filter(Boolean),
        secondaryModalitiesText: values.secondaryModalitiesText,
        experienceSummary: values.experienceSummary,
        healingTool: values.healingTool,
        specialties: values.specialties.split(",").map((s) => s.trim()).filter(Boolean),
        feeCurrency: values.feeCurrency,
        feeLimit: Number(values.feeLimit) || 0,
        feeRange: values.feeRange,
        statusFee: values.statusFee,
        communicationModes: values.communicationModes.split(",").map((s) => s.trim()).filter(Boolean),
        daysAndTimeOfService: values.daysAndTimeOfService,
        reference: values.reference,
        certifications: values.certifications,
        awards: values.awards,
        facebookLink: values.facebookLink,
        twitterLink: values.twitterLink,
        linkedinLink: values.linkedinLink,
        instagramLink: values.instagramLink,
        pinterestLink: values.pinterestLink,
        googleLink: values.googleLink,
      };

      // Also update users table name/avatar so site & admin sync seamlessly
      await UsersService.update(healerId, {
        name: fullName,
        avatarUrl: values.mainPhotoUrl || undefined,
      });

      return HealersService.update(healerId, patch);
    },
    onSuccess: () => {
      toast.success("Your practitioner profile has been updated & synced across the site!");
      qc.invalidateQueries({ queryKey: ["healers"] });
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update profile");
    },
  });

  if (healerQ.isLoading) return <div className="p-10"><LoadingState /></div>;
  if (healerQ.isError) return <div className="p-10"><ErrorState error={healerQ.error} onRetry={() => healerQ.refetch()} /></div>;

  const h = healerQ.data || ({
    name: admin?.name || "Practitioner",
    email: admin?.email || "",
    status: "approved",
    documentsVerified: false,
  } as Healer);

  const currentPhoto = form.watch("mainPhotoUrl") || h.mainPhotoUrl || h.avatarUrl;

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-8 text-[#1a1a1a]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-3xl font-bold tracking-tight text-gray-900">
              My Practitioner Profile
            </h1>
            <Badge className="bg-[#e6f4f1] text-[#1f5c5c] hover:bg-[#e6f4f1] uppercase text-[11px] font-bold px-2.5 py-0.5">
              Live on Site
            </Badge>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Make edits below. Any changes are synced immediately with the Admin Dashboard and Public Directory.
          </p>
        </div>
        <Button
          onClick={form.handleSubmit((values) => updateMutation.mutate(values))}
          disabled={updateMutation.isPending}
          className="bg-[#1f5c5c] hover:bg-[#154646] text-white rounded-full px-6 font-semibold shadow-md shadow-[#1f5c5c]/15 self-start sm:self-auto"
        >
          <Save className="mr-2 h-4 w-4" />
          {updateMutation.isPending ? "Saving Profile..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid gap-8 xl:grid-cols-[360px_1fr]">
        {/* Left Side: Live Preview Card & Documents */}
        <div className="space-y-6">
          <Card className="rounded-2xl p-6 shadow-sm border border-gray-100/80 text-center bg-white relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-[#1f5c5c] to-[#347676]" />
            <div className="relative mx-auto mt-6 mb-4 h-36 w-36 overflow-hidden rounded-full border-4 border-white shadow-lg bg-gray-100">
              {currentPhoto ? (
                <img src={currentPhoto} alt={h.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-[#e6f4f1] text-[#1f5c5c]">
                  <User className="h-14 w-14 opacity-60" />
                </div>
              )}
            </div>
            <h2 className="font-display text-xl font-bold text-gray-900">{h.name}</h2>
            <p className="text-xs text-gray-500 mt-0.5">{h.email}</p>
            {h.phone && <p className="text-xs font-medium text-gray-700 mt-1">{h.phone}</p>}

            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2 text-left">
              <Label className="text-xs font-semibold text-gray-600">Photo / Avatar URL</Label>
              <Input
                placeholder="https://example.com/photo.jpg"
                value={form.watch("mainPhotoUrl") || ""}
                onChange={(e) => form.setValue("mainPhotoUrl", e.target.value)}
                className="text-xs rounded-xl border-gray-200"
              />
            </div>

            <div className="mt-5 flex items-center justify-center gap-2">
              <Badge variant="outline" className="capitalize text-xs font-semibold px-3 py-1">
                Status: {h.status}
              </Badge>
              {h.documentsVerified && (
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold px-3 py-1">
                  <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Verified
                </Badge>
              )}
            </div>
          </Card>

          {/* Uploaded Documents Box */}
          <Card className="rounded-2xl p-6 shadow-sm border border-gray-100/80 bg-white">
            <h3 className="font-display text-base font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#1f5c5c]" /> My Verification Documents
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Documents submitted here are reviewed by Site Admins.
            </p>

            {docsQ.isLoading ? (
              <div className="mt-4"><LoadingState /></div>
            ) : (docsQ.data ?? []).length === 0 ? (
              <div className="mt-4 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-600">No documents uploaded yet</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Please contact admin or upload via support</p>
              </div>
            ) : (
              <ul className="mt-4 divide-y divide-gray-100 text-xs">
                {docsQ.data!.map((d) => (
                  <li key={d.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2.5 truncate">
                      <FileText className="h-4 w-4 text-[#1f5c5c] shrink-0" />
                      <a href={d.url} target="_blank" rel="noreferrer" className="font-semibold text-gray-800 hover:text-[#1f5c5c] hover:underline truncate">
                        {d.name}
                      </a>
                    </div>
                    <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded uppercase font-bold text-gray-600">{d.type}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        {/* Right Side: Comprehensive Form Sections */}
        <Card className="rounded-2xl p-8 shadow-sm border border-gray-100/80 bg-white">
          <form
            onSubmit={form.handleSubmit((values) => updateMutation.mutate(values))}
            className="space-y-8"
          >
            {/* Section 1: Basic & Personal Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <User className="h-5 w-5 text-[#1f5c5c]" />
                <h3 className="font-display text-lg font-bold text-gray-900">Personal & Practice Details</h3>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-700">First Name</Label>
                  <Input {...form.register("firstName")} placeholder="e.g. Maya" className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-700">Last Name</Label>
                  <Input {...form.register("lastName")} placeholder="e.g. Lin" className="rounded-xl" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-bold text-gray-700">Organization / Clinic Name</Label>
                  <Input {...form.register("orgName")} placeholder="e.g. Mystic Lotus Holistic Center" className="rounded-xl" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-bold text-gray-700">About Me / Bio</Label>
                  <Textarea
                    {...form.register("bio")}
                    rows={4}
                    placeholder="Tell seekers about your background, healing journey, and approach..."
                    className="rounded-xl resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-700">Date of Birth</Label>
                  <Input {...form.register("dob")} placeholder="e.g. YYYY-MM-DD or 23/05/1980" className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-700">Gender</Label>
                  <Select
                    value={form.watch("gender")}
                    onValueChange={(v) => form.setValue("gender", v)}
                  >
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                      <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Section 2: Modalities & Specialties */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <Sparkles className="h-5 w-5 text-[#1f5c5c]" />
                <h3 className="font-display text-lg font-bold text-gray-900">Modalities & Specialties</h3>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-700">Primary Modality</Label>
                  <Input {...form.register("primaryModality")} placeholder="e.g. Pranic Healing" className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-700">Practicing Since (Year)</Label>
                  <Input {...form.register("practicingSince")} placeholder="e.g. 2012" className="rounded-xl" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-bold text-gray-700">Secondary Modalities (Comma-separated)</Label>
                  <Input {...form.register("secondaryModalities")} placeholder="Reiki, Sound Therapy, Crystal Healing, Chakra Balancing" className="rounded-xl" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-bold text-gray-700">Languages Spoken (Comma-separated)</Label>
                  <Input {...form.register("languages")} placeholder="Hindi, English, Marathi, Gujarati" className="rounded-xl" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-bold text-gray-700">Specialties (Comma-separated)</Label>
                  <Input {...form.register("specialties")} placeholder="Emotional Healing, Physical Pain Relief, Spiritual Awakening, Stress Reduction" className="rounded-xl" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-bold text-gray-700">Experience Summary & Methodology</Label>
                  <Textarea {...form.register("experienceSummary")} rows={4} placeholder="Describe your methodology, client successes, and philosophy..." className="rounded-xl resize-none" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-bold text-gray-700">Primary Healing Tools Used</Label>
                  <Input {...form.register("healingTool")} placeholder="e.g. Quartz Crystals, Tibetan Singing Bowls, pendulum..." className="rounded-xl" />
                </div>
              </div>
            </div>

            {/* Section 3: Location & Contact */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <MapPin className="h-5 w-5 text-[#1f5c5c]" />
                <h3 className="font-display text-lg font-bold text-gray-900">Clinic Location & Address</h3>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-bold text-gray-700">Full Address</Label>
                  <Textarea {...form.register("address")} rows={2} placeholder="Street address, suite/apartment number..." className="rounded-xl resize-none" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-700">City</Label>
                  <Input {...form.register("city")} placeholder="e.g. Mumbai" className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-700">Area / Neighborhood</Label>
                  <Input {...form.register("area")} placeholder="e.g. Bandra West" className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-700">State / Province</Label>
                  <Input {...form.register("state")} placeholder="e.g. Maharashtra" className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-700">Pin Code / Postal Code</Label>
                  <Input {...form.register("pinCode")} placeholder="e.g. 400050" className="rounded-xl" />
                </div>
              </div>
            </div>

            {/* Section 4: Fees & Schedule */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <Calendar className="h-5 w-5 text-[#1f5c5c]" />
                <h3 className="font-display text-lg font-bold text-gray-900">Fees & Availability Schedule</h3>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-700">Currency</Label>
                  <Input {...form.register("feeCurrency")} placeholder="INR or USD" className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-700">Fee Range Display</Label>
                  <Input {...form.register("feeRange")} placeholder="e.g. 1500 - 3000" className="rounded-xl" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-bold text-gray-700">Communication Modes Supported (Comma-separated)</Label>
                  <Input {...form.register("communicationModes")} placeholder="Video Call, On Call, In Person, Email" className="rounded-xl" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-bold text-gray-700">Days and Hours of Service</Label>
                  <Textarea {...form.register("daysAndTimeOfService")} rows={2} placeholder="e.g. Monday to Saturday : 10:00 AM to 7:00 PM" className="rounded-xl resize-none" />
                </div>
              </div>
            </div>

            {/* Section 5: Credentials & Social Links */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <Award className="h-5 w-5 text-[#1f5c5c]" />
                <h3 className="font-display text-lg font-bold text-gray-900">Certifications & Social Links</h3>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-bold text-gray-700">Certifications & Degrees</Label>
                  <Textarea {...form.register("certifications")} rows={2} placeholder="e.g. Certified Reiki Master (2015), Diploma in Sound Therapy..." className="rounded-xl resize-none" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-bold text-gray-700">Awards & Recognitions</Label>
                  <Textarea {...form.register("awards")} rows={2} placeholder="Any holistic wellness recognitions or awards..." className="rounded-xl resize-none" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-700">Intro Video URL (YouTube/Vimeo)</Label>
                  <Input {...form.register("videoUrl")} placeholder="https://youtube.com/..." className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-700">Website / Google Link</Label>
                  <Input {...form.register("googleLink")} placeholder="https://..." className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-700">Instagram URL</Label>
                  <Input {...form.register("instagramLink")} placeholder="https://instagram.com/..." className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-700">LinkedIn URL</Label>
                  <Input {...form.register("linkedinLink")} placeholder="https://linkedin.com/in/..." className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-700">Facebook URL</Label>
                  <Input {...form.register("facebookLink")} placeholder="https://facebook.com/..." className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-700">Twitter / X URL</Label>
                  <Input {...form.register("twitterLink")} placeholder="https://twitter.com/..." className="rounded-xl" />
                </div>
              </div>
            </div>

            {/* Submit Footer */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                className="bg-[#1f5c5c] hover:bg-[#154646] text-white rounded-full px-8 py-3 font-semibold shadow-md shadow-[#1f5c5c]/20"
              >
                <Save className="mr-2 h-4 w-4" />
                {updateMutation.isPending ? "Saving Profile..." : "Save Profile & Sync"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
