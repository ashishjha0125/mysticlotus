import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Save,
  ShieldCheck,
  Upload,
  User,
  Video,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/admin/PageHeader";
import { LoadingState, ErrorState } from "@/components/admin/States";
import { HealersService, type Healer, type HealerStatus } from "@/services/healers.service";
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
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/healers/$id")({
  component: HealerDetailPage,
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
  status: HealerStatus;
  statusRemark: string;
};

function HealerDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [goBackAfterUpdate, setGoBackAfterUpdate] = useState(false);

  const healerQ = useQuery({ queryKey: ["healers", id], queryFn: () => HealersService.get(id) });
  const docsQ = useQuery({ queryKey: ["healers", id, "docs"], queryFn: () => HealersService.documents(id) });

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
        status: h.status,
        statusRemark: h.statusRemark ?? "",
      });
    }
  }, [healerQ.data, form]);

  const updateMutation = useMutation({
    mutationFn: async (values: HealerFormValues) => {
      const patch: Partial<Healer> = {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        name: `${values.firstName.trim()} ${values.lastName.trim()}`.trim(),
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
        status: values.status,
        statusRemark: values.statusRemark,
      };
      return HealersService.update(id, patch);
    },
    onSuccess: () => {
      toast.success("Healer profile updated successfully");
      qc.invalidateQueries({ queryKey: ["healers"] });
      if (goBackAfterUpdate) {
        navigate({ to: "/healers" });
      }
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update healer profile");
    },
  });

  const verifyDocsMutation = useMutation({
    mutationFn: () => HealersService.verifyDocuments(id),
    onSuccess: () => {
      toast.success("Documents verified");
      qc.invalidateQueries({ queryKey: ["healers"] });
    },
  });

  if (healerQ.isLoading) return <LoadingState />;
  if (healerQ.isError) return <ErrorState error={healerQ.error} onRetry={() => healerQ.refetch()} />;
  const h = healerQ.data!;
  const currentPhoto = form.watch("mainPhotoUrl") || h.mainPhotoUrl || h.avatarUrl;

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div>
        <button
          onClick={() => navigate({ to: "/healers" })}
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to healers
        </button>
        <PageHeader
          title={`moderation_healer: ${h.name}`}
          description={`Joined on ${formatDate(h.createdAt)} · ${h.email}`}
          action={
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => verifyDocsMutation.mutate()}
                disabled={verifyDocsMutation.isPending || h.documentsVerified}
              >
                <ShieldCheck className="mr-1.5 h-4 w-4 text-success" />
                {h.documentsVerified ? "Docs Verified" : "Verify Docs"}
              </Button>
            </div>
          }
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        {/* Left Card: Main Photo & Summary */}
        <div className="flex flex-col gap-6">
          <Card className="glass shadow-soft rounded-2xl p-6 text-center">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Main Photo Dashboard Preview
            </h3>
            <div className="relative mx-auto mb-4 h-48 w-48 overflow-hidden rounded-2xl border-2 border-primary/20 bg-muted shadow-md">
              {currentPhoto ? (
                <img src={currentPhoto} alt={h.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-primary/10 text-primary">
                  <User className="h-14 w-14 opacity-60" />
                  <span className="text-xs font-medium">No photo set</span>
                </div>
              )}
            </div>
            <div className="mb-4 flex flex-col gap-1 text-left">
              <Label className="text-xs text-muted-foreground">Quick Photo URL</Label>
              <Input
                placeholder="https://example.com/photo.jpg"
                value={form.watch("mainPhotoUrl") || ""}
                onChange={(e) => form.setValue("mainPhotoUrl", e.target.value)}
                className="text-xs"
              />
            </div>
            <h2 className="text-lg font-bold">{h.name}</h2>
            <p className="text-xs text-muted-foreground">{h.email}</p>
            {h.phone && <p className="mt-1 text-xs font-medium text-foreground">{h.phone}</p>}

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Badge variant="outline" className="capitalize">
                {form.watch("status") || h.status}
              </Badge>
              {h.documentsVerified && (
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                  Verified
                </Badge>
              )}
            </div>
          </Card>

          {/* Uploaded Documents */}
          <Card className="glass shadow-soft rounded-2xl p-6">
            <h3 className="text-base font-semibold">Uploaded Documents</h3>
            {docsQ.isLoading ? (
              <div className="mt-3"><LoadingState /></div>
            ) : (docsQ.data ?? []).length === 0 ? (
              <p className="mt-3 text-xs text-muted-foreground">No verification documents uploaded yet.</p>
            ) : (
              <ul className="mt-3 divide-y divide-border/70 text-xs">
                {docsQ.data!.map((d) => (
                  <li key={d.id} className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="h-4 w-4 text-primary shrink-0" />
                      <a href={d.url} target="_blank" rel="noreferrer" className="font-medium hover:underline truncate">
                        {d.name}
                      </a>
                    </div>
                    <span className="text-[10px] text-muted-foreground uppercase">{d.type}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        {/* Right Card: Comprehensive Moderation Form */}
        <Card className="glass shadow-soft rounded-2xl p-6">
          <form
            onSubmit={form.handleSubmit((values) => {
              setGoBackAfterUpdate(false);
              updateMutation.mutate(values);
            })}
            className="flex flex-col gap-6"
          >
            {/* Section 1: Basic Information */}
            <div className="space-y-4">
              <h3 className="border-b border-border/70 pb-2 font-display text-base font-semibold text-primary">
                Personal & Organization Details
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label>First name :</Label>
                  <Input {...form.register("firstName")} placeholder="e.g. Maya" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Last name :</Label>
                  <Input {...form.register("lastName")} placeholder="e.g. Lin" />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label>Org name :</Label>
                  <Input {...form.register("orgName")} placeholder="e.g. MYSTIC LOTUS" />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label>About me :</Label>
                  <Textarea
                    {...form.register("bio")}
                    rows={4}
                    placeholder="Brief background and intro..."
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>DOB :</Label>
                  <Input {...form.register("dob")} placeholder="e.g. 23/05/1978 or YYYY-MM-DD" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Gender :</Label>
                  <Select
                    value={form.watch("gender")}
                    onValueChange={(v) => form.setValue("gender", v)}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
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

            {/* Section 2: Media & Languages */}
            <div className="space-y-4">
              <h3 className="border-b border-border/70 pb-2 font-display text-base font-semibold text-primary">
                Media & Languages
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label>Main photo : (URL visible on Healers Dashboard)</Label>
                  <Input {...form.register("mainPhotoUrl")} placeholder="https://.../photo.jpg" />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label>Video : (Introduction video URL or embed)</Label>
                  <Input {...form.register("videoUrl")} placeholder="https://youtube.com/..." />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label>Languages : (Comma-separated)</Label>
                  <Input {...form.register("languages")} placeholder="Hindi, Odia, Punjabi, English" />
                </div>
              </div>
            </div>

            {/* Section 3: Location */}
            <div className="space-y-4">
              <h3 className="border-b border-border/70 pb-2 font-display text-base font-semibold text-primary">
                Location & Address
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label>Location / Address :</Label>
                  <Textarea {...form.register("address")} rows={2} placeholder="Full clinic or residence address..." />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>State :</Label>
                  <Input {...form.register("state")} placeholder="e.g. Maharashtra" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>City :</Label>
                  <Input {...form.register("city")} placeholder="e.g. Mumbai" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Area :</Label>
                  <Input {...form.register("area")} placeholder="e.g. Goregaon" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Pin code :</Label>
                  <Input {...form.register("pinCode")} placeholder="e.g. 400063" />
                </div>
              </div>
            </div>

            {/* Section 4: Modalities & Experience */}
            <div className="space-y-4">
              <h3 className="border-b border-border/70 pb-2 font-display text-base font-semibold text-primary">
                Modalities & Practice Summary
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label>Primary modality :</Label>
                  <Input {...form.register("primaryModality")} placeholder="e.g. Pranic Healing" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Practicing since : (Year)</Label>
                  <Input {...form.register("practicingSince")} placeholder="e.g. 2007" />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label>Secondary modalities : (Comma-separated)</Label>
                  <Input {...form.register("secondaryModalities")} placeholder="Distance Healing, Crystal Healing, Meditation, Chakra Healing" />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label>Secondary modalities text or unlisted :</Label>
                  <Input {...form.register("secondaryModalitiesText")} placeholder="Any special modalities not in list..." />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label>Healer profile summary / Experience :</Label>
                  <Textarea {...form.register("experienceSummary")} rows={4} placeholder="Detailed description of healing philosophy and track record..." />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label>Healing tool :</Label>
                  <Input {...form.register("healingTool")} placeholder="Crystals, Sound Bowls, Wand..." />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label>Specialise : (Comma-separated)</Label>
                  <Input {...form.register("specialties")} placeholder="Emotional, Physical, Spiritual, Mental" />
                </div>
              </div>
            </div>

            {/* Section 5: Pricing & Availability */}
            <div className="space-y-4">
              <h3 className="border-b border-border/70 pb-2 font-display text-base font-semibold text-primary">
                Fees & Schedule
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label>Fee currency :</Label>
                  <Input {...form.register("feeCurrency")} placeholder="INR" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Fee limit :</Label>
                  <Input type="number" {...form.register("feeLimit")} placeholder="2500" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Fee range :</Label>
                  <Input {...form.register("feeRange")} placeholder="1000 - 2500" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Status fee :</Label>
                  <Input {...form.register("statusFee")} placeholder="0" />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label>Communication mode : (Comma-separated)</Label>
                  <Input {...form.register("communicationModes")} placeholder="email, on call, in person, video call" />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label>Days and time of service :</Label>
                  <Textarea {...form.register("daysAndTimeOfService")} rows={3} placeholder="Sunday to Friday : 9 AM to 6 PM..." />
                </div>
              </div>
            </div>

            {/* Section 6: Credentials & Social Links */}
            <div className="space-y-4">
              <h3 className="border-b border-border/70 pb-2 font-display text-base font-semibold text-primary">
                Credentials & Social Links
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label>Reference :</Label>
                  <Input {...form.register("reference")} placeholder="Referred by..." />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label>Certifications :</Label>
                  <Textarea {...form.register("certifications")} rows={3} placeholder="Certified Pranic Healer, Yoga Teacher..." />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label>Awards :</Label>
                  <Textarea {...form.register("awards")} rows={2} placeholder="Any recognitions or awards received..." />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Facebook link :</Label>
                  <Input {...form.register("facebookLink")} placeholder="https://facebook.com/..." />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Twitter link :</Label>
                  <Input {...form.register("twitterLink")} placeholder="https://twitter.com/..." />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>LinkedIn link :</Label>
                  <Input {...form.register("linkedinLink")} placeholder="https://linkedin.com/in/..." />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Instagram link :</Label>
                  <Input {...form.register("instagramLink")} placeholder="https://instagram.com/..." />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Pinterest link :</Label>
                  <Input {...form.register("pinterestLink")} placeholder="https://pinterest.com/..." />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Google / Website link :</Label>
                  <Input {...form.register("googleLink")} placeholder="https://..." />
                </div>
              </div>
            </div>

            {/* Section 7: Account Moderation Control */}
            <div className="space-y-4 rounded-2xl border border-warning/30 bg-warning/5 p-4">
              <h3 className="font-display text-base font-semibold text-foreground">
                Account Moderation Control
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label>Account status :</Label>
                  <Select
                    value={form.watch("status")}
                    onValueChange={(v) => form.setValue("status", v as HealerStatus)}
                  >
                    <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">under moderation (pending)</SelectItem>
                      <SelectItem value="approved">approved</SelectItem>
                      <SelectItem value="rejected">rejected</SelectItem>
                      <SelectItem value="suspended">suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label>Account status remark :</Label>
                  <Textarea
                    {...form.register("statusRemark")}
                    rows={2}
                    placeholder="Internal moderation notes or rejection explanation..."
                    className="bg-background"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions Footer */}
            <div className="mt-4 flex flex-wrap items-center justify-start gap-3 border-t border-border/70 pt-5">
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                className="bg-primary hover:bg-primary/90 px-6 font-semibold"
              >
                <Save className="mr-2 h-4 w-4" />
                {updateMutation.isPending && !goBackAfterUpdate ? "Updating…" : "Update changes"}
              </Button>

              <Button
                type="button"
                variant="secondary"
                disabled={updateMutation.isPending}
                onClick={() => {
                  setGoBackAfterUpdate(true);
                  form.handleSubmit((values) => updateMutation.mutate(values))();
                }}
                className="px-5 font-semibold"
              >
                {updateMutation.isPending && goBackAfterUpdate ? "Saving…" : "Update and go back to list"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate({ to: "/healers" })}
                className="px-5 text-muted-foreground hover:text-foreground"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
