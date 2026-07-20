import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";
import { createClient } from "@supabase/supabase-js";
import type { Paginated } from "./users.service";

const SUPABASE_ENABLED =
  !!import.meta.env.VITE_SUPABASE_URL &&
  !!import.meta.env.VITE_SUPABASE_ANON_KEY;

export type HealerStatus = "pending" | "approved" | "rejected" | "suspended";

export type Healer = {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  status: HealerStatus;
  modalities: string[];
  documentsVerified: boolean;
  rating?: number;
  totalBookings?: number;
  totalEarnings?: number;
  avatarUrl?: string | null;
  mainPhotoUrl?: string | null;
  videoUrl?: string | null;
  bio?: string;
  orgName?: string;
  dob?: string;
  gender?: string;
  languages?: string[];
  address?: string;
  state?: string;
  city?: string;
  area?: string;
  pinCode?: string;
  primaryModality?: string;
  practicingSince?: string;
  secondaryModalities?: string[];
  secondaryModalitiesText?: string;
  experienceSummary?: string;
  healingTool?: string;
  specialties?: string[];
  feeCurrency?: string;
  feeLimit?: number;
  feeRange?: string;
  statusFee?: string;
  communicationModes?: string[];
  daysAndTimeOfService?: string;
  reference?: string;
  certifications?: string;
  awards?: string;
  facebookLink?: string;
  twitterLink?: string;
  linkedinLink?: string;
  instagramLink?: string;
  pinterestLink?: string;
  googleLink?: string;
  statusRemark?: string;
  createdAt: string;
};

export type HealerDocument = {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedAt: string;
};

export type HealerEarnings = {
  total: number;
  pending: number;
  paid: number;
  currency: string;
  history: { date: string; amount: number }[];
};

function rowToHealer(row: any): Healer {
  const fullName = row.users?.name ?? row.name ?? "";
  const parts = fullName.split(" ");
  const inferredFirst = row.first_name ?? parts[0] ?? "";
  const inferredLast = row.last_name ?? (parts.length > 1 ? parts.slice(1).join(" ") : "");
  const photo = row.main_photo_url ?? row.photo_url ?? row.users?.avatar_url ?? row.avatar_url ?? null;

  return {
    id: row.id,
    name: fullName,
    firstName: inferredFirst,
    lastName: inferredLast,
    email: row.users?.email ?? row.email ?? "",
    phone: row.users?.phone ?? row.phone ?? undefined,
    status: row.status,
    modalities: row.modalities ?? [],
    documentsVerified: row.documents_verified ?? false,
    rating: row.rating ?? undefined,
    totalBookings: row.total_bookings ?? 0,
    totalEarnings: row.total_earnings ?? 0,
    avatarUrl: photo,
    mainPhotoUrl: photo,
    videoUrl: row.video_url ?? null,
    bio: row.bio ?? row.about_me ?? undefined,
    orgName: row.org_name ?? undefined,
    dob: row.dob ?? undefined,
    gender: row.gender ?? undefined,
    languages: row.languages ?? ["Hindi", "English"],
    address: row.address ?? undefined,
    state: row.state ?? undefined,
    city: row.city ?? undefined,
    area: row.area ?? undefined,
    pinCode: row.pin_code ?? undefined,
    primaryModality: row.primary_modality ?? (row.modalities?.[0] ?? "Pranic Healing"),
    practicingSince: row.practicing_since ?? "2015",
    secondaryModalities: row.secondary_modalities ?? (row.modalities?.slice(1) ?? []),
    secondaryModalitiesText: row.secondary_modalities_text ?? undefined,
    experienceSummary: row.experience_summary ?? row.bio ?? undefined,
    healingTool: row.healing_tool ?? undefined,
    specialties: row.specialties ?? ["Emotional", "Physical", "Spiritual"],
    feeCurrency: row.fee_currency ?? "INR",
    feeLimit: row.fee_limit ?? 2500,
    feeRange: row.fee_range ?? undefined,
    statusFee: row.status_fee ?? undefined,
    communicationModes: row.communication_modes ?? ["email", "on call", "in person"],
    daysAndTimeOfService: row.days_and_time_of_service ?? "Sunday to Friday : 9 AM to 6 PM",
    reference: row.reference ?? undefined,
    certifications: row.certifications ?? undefined,
    awards: row.awards ?? undefined,
    facebookLink: row.facebook_link ?? undefined,
    twitterLink: row.twitter_link ?? undefined,
    linkedinLink: row.linkedin_link ?? undefined,
    instagramLink: row.instagram_link ?? undefined,
    pinterestLink: row.pinterest_link ?? undefined,
    googleLink: row.google_link ?? undefined,
    statusRemark: row.status_remark ?? undefined,
    createdAt: row.users?.created_at ?? row.created_at ?? "",
  };
}

function rowToDocument(row: any): HealerDocument {
  return {
    id: row.id,
    name: row.name,
    url: row.url,
    type: row.type,
    uploadedAt: row.uploaded_at,
  };
}

export const HealersService = {
  create: async (payload: {
    name: string;
    email: string;
    phone?: string;
    password?: string;
    primaryModality?: string;
  }): Promise<Healer> => {
    if (!SUPABASE_ENABLED) {
      return api.post<Healer>("/admin/healers", payload).then((r) => r.data);
    }

    let authUserId: string | undefined = undefined;
    if (payload.password) {
      const tempClient = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY,
        { auth: { persistSession: false, autoRefreshToken: false } }
      );
      const { data: authData, error: authErr } = await tempClient.auth.signUp({
        email: payload.email,
        password: payload.password,
        options: {
          data: { name: payload.name, role: "healer" },
        },
      });
      if (authErr) {
        throw new Error(`Failed to register login account: ${authErr.message}`);
      }
      if (authData?.user?.id) {
        authUserId = authData.user.id;
      }
    }

    const insertUserObj: any = {
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone?.trim() || null,
      role: "healer",
      roles: ["healer"],
      status: "active",
    };
    if (authUserId) {
      insertUserObj.id = authUserId;
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert(insertUserObj)
      .select()
      .single();

    if (userError) throw userError;

    const { data: healerData, error: healerError } = await supabase
      .from("healers")
      .insert({
        id: userData.id,
        status: "approved",
        modalities: [payload.primaryModality?.trim() || "Pranic Healing"],
        primary_modality: payload.primaryModality?.trim() || "Pranic Healing",
        documents_verified: false,
      })
      .select("*, users(*)")
      .single();

    if (healerError) throw healerError;
    return rowToHealer(healerData);
  },

  list: async (
    params: {
      search?: string;
      status?: HealerStatus | "all";
      page?: number;
      limit?: number;
    } = {},
  ): Promise<Paginated<Healer>> => {
    if (!SUPABASE_ENABLED) {
      return api
        .get<Paginated<Healer>>("/admin/healers", { params })
        .then((r) => r.data);
    }

    const page  = params.page  ?? 1;
    const limit = params.limit ?? 20;
    const from  = (page - 1) * limit;
    const to    = from + limit - 1;

    let query = supabase
      .from("healers")
      .select("*, users!inner(*)", { count: "exact" });

    if (params.status && params.status !== "all") {
      query = query.eq("status", params.status);
    }
    if (params.search) {
      const qs = params.search.trim();
      query = query.or(
        `users.name.ilike.%${qs}%,users.email.ilike.%${qs}%,primary_modality.ilike.%${qs}%,bio.ilike.%${qs}%,experience_summary.ilike.%${qs}%,healing_tool.ilike.%${qs}%`
      );
    }

    query = query.order("created_at", { referencedTable: "users", ascending: false }).range(from, to);

    const { data, count, error } = await query;
    if (error) throw error;

    return {
      data: (data ?? []).map(rowToHealer),
      total: count ?? 0,
      page,
      limit,
    };
  },

  get: async (id: string): Promise<Healer> => {
    if (!SUPABASE_ENABLED) {
      return api.get<Healer>(`/admin/healers/${id}`).then((r) => r.data);
    }

    const { data, error } = await supabase
      .from("healers")
      .select("*, users(*)")
      .eq("id", id)
      .single();

    if (error) throw error;
    return rowToHealer(data);
  },

  update: async (id: string, patch: Partial<Healer>): Promise<Healer> => {
    if (!SUPABASE_ENABLED) {
      return api.patch<Healer>(`/admin/healers/${id}`, patch).then((r) => r.data);
    }

    const healerUpdate: Record<string, any> = {};
    if (patch.bio !== undefined) healerUpdate.bio = patch.bio;
    if (patch.modalities !== undefined) healerUpdate.modalities = patch.modalities;
    if (patch.status !== undefined) healerUpdate.status = patch.status;
    if (patch.mainPhotoUrl !== undefined) {
      healerUpdate.main_photo_url = patch.mainPhotoUrl;
    }
    if (patch.avatarUrl !== undefined) {
      healerUpdate.main_photo_url = patch.avatarUrl;
    }
    if (patch.firstName !== undefined) healerUpdate.first_name = patch.firstName;
    if (patch.lastName !== undefined) healerUpdate.last_name = patch.lastName;
    if (patch.orgName !== undefined) healerUpdate.org_name = patch.orgName;
    if (patch.dob !== undefined) healerUpdate.dob = patch.dob;
    if (patch.gender !== undefined) healerUpdate.gender = patch.gender;
    if (patch.videoUrl !== undefined) healerUpdate.video_url = patch.videoUrl;
    if (patch.languages !== undefined) healerUpdate.languages = patch.languages;
    if (patch.address !== undefined) healerUpdate.address = patch.address;
    if (patch.state !== undefined) healerUpdate.state = patch.state;
    if (patch.city !== undefined) healerUpdate.city = patch.city;
    if (patch.area !== undefined) healerUpdate.area = patch.area;
    if (patch.pinCode !== undefined) healerUpdate.pin_code = patch.pinCode;
    if (patch.primaryModality !== undefined) healerUpdate.primary_modality = patch.primaryModality;
    if (patch.practicingSince !== undefined) healerUpdate.practicing_since = patch.practicingSince;
    if (patch.secondaryModalities !== undefined) healerUpdate.secondary_modalities = patch.secondaryModalities;
    if (patch.secondaryModalitiesText !== undefined) healerUpdate.secondary_modalities_text = patch.secondaryModalitiesText;
    if (patch.experienceSummary !== undefined) healerUpdate.experience_summary = patch.experienceSummary;
    if (patch.healingTool !== undefined) healerUpdate.healing_tool = patch.healingTool;
    if (patch.specialties !== undefined) healerUpdate.specialties = patch.specialties;
    if (patch.feeCurrency !== undefined) healerUpdate.fee_currency = patch.feeCurrency;
    if (patch.feeLimit !== undefined) healerUpdate.fee_limit = patch.feeLimit;
    if (patch.feeRange !== undefined) healerUpdate.fee_range = patch.feeRange;
    if (patch.statusFee !== undefined) healerUpdate.status_fee = patch.statusFee;
    if (patch.communicationModes !== undefined) healerUpdate.communication_modes = patch.communicationModes;
    if (patch.daysAndTimeOfService !== undefined) healerUpdate.days_and_time_of_service = patch.daysAndTimeOfService;
    if (patch.reference !== undefined) healerUpdate.reference = patch.reference;
    if (patch.certifications !== undefined) healerUpdate.certifications = patch.certifications;
    if (patch.awards !== undefined) healerUpdate.awards = patch.awards;
    if (patch.facebookLink !== undefined) healerUpdate.facebook_link = patch.facebookLink;
    if (patch.twitterLink !== undefined) healerUpdate.twitter_link = patch.twitterLink;
    if (patch.linkedinLink !== undefined) healerUpdate.linkedin_link = patch.linkedinLink;
    if (patch.instagramLink !== undefined) healerUpdate.instagram_link = patch.instagramLink;
    if (patch.pinterestLink !== undefined) healerUpdate.pinterest_link = patch.pinterestLink;
    if (patch.googleLink !== undefined) healerUpdate.google_link = patch.googleLink;
    if (patch.statusRemark !== undefined) healerUpdate.status_remark = patch.statusRemark;

    if (patch.name || patch.firstName || patch.lastName || patch.mainPhotoUrl !== undefined || patch.avatarUrl !== undefined) {
      const userPatch: Record<string, any> = {};
      if (patch.name) userPatch.name = patch.name;
      else if (patch.firstName || patch.lastName) {
        userPatch.name = `${patch.firstName ?? ""} ${patch.lastName ?? ""}`.trim();
      }
      if (patch.mainPhotoUrl !== undefined) userPatch.avatar_url = patch.mainPhotoUrl;
      else if (patch.avatarUrl !== undefined) userPatch.avatar_url = patch.avatarUrl;

      await supabase.from("users").update(userPatch).eq("id", id);
    }

    const { data, error } = await supabase
      .from("healers")
      .update(healerUpdate)
      .eq("id", id)
      .select("*, users(*)")
      .single();

    if (error) {
      console.error("Healer update warning, trying fallback core update:", error);
      const corePatch: Record<string, any> = {};
      if (patch.bio !== undefined) corePatch.bio = patch.bio;
      if (patch.modalities !== undefined) corePatch.modalities = patch.modalities;
      if (patch.status !== undefined) corePatch.status = patch.status;
      const { data: fallbackData, error: fallbackError } = await supabase
        .from("healers")
        .update(corePatch)
        .eq("id", id)
        .select("*, users(*)")
        .single();
      if (fallbackError) throw fallbackError;
      return rowToHealer(fallbackData);
    }

    return rowToHealer(data);
  },

  documents: async (id: string): Promise<HealerDocument[]> => {
    if (!SUPABASE_ENABLED) {
      return api
        .get<HealerDocument[]>(`/admin/healers/${id}/documents`)
        .then((r) => r.data);
    }

    const { data, error } = await supabase
      .from("healer_documents")
      .select("*")
      .eq("healer_id", id)
      .order("uploaded_at", { ascending: false });

    if (error) throw error;
    return (data ?? []).map(rowToDocument);
  },

  earnings: async (id: string): Promise<HealerEarnings> => {
    if (!SUPABASE_ENABLED) {
      return api
        .get<HealerEarnings>(`/admin/healers/${id}/earnings`)
        .then((r) => r.data);
    }

    const { data: rows, error } = await supabase
      .from("healer_earnings")
      .select("*")
      .eq("healer_id", id)
      .order("date", { ascending: false });

    if (error) throw error;

    const total   = (rows ?? []).reduce((s, r) => s + r.amount, 0);
    const pending = (rows ?? []).filter((r) => r.status === "pending").reduce((s, r) => s + r.amount, 0);
    const paid    = (rows ?? []).filter((r) => r.status === "paid").reduce((s, r) => s + r.amount, 0);
    const currency = rows?.[0]?.currency ?? "USD";

    return {
      total,
      pending,
      paid,
      currency,
      history: (rows ?? []).map((r) => ({ date: r.date, amount: r.amount })),
    };
  },

  // ── Status mutations ──────────────────────────────────────────────────────

  _updateStatus: async (id: string, status: HealerStatus): Promise<Healer> => {
    const { data, error } = await supabase
      .from("healers")
      .update({ status })
      .eq("id", id)
      .select("*, users(*)")
      .single();

    if (error) throw error;
    return rowToHealer(data);
  },

  approve: async (id: string): Promise<Healer> => {
    if (!SUPABASE_ENABLED) {
      return api.post(`/admin/healers/${id}/approve`).then((r) => r.data);
    }
    return HealersService._updateStatus(id, "approved");
  },

  reject: async (id: string, reason: string): Promise<Healer> => {
    if (!SUPABASE_ENABLED) {
      return api
        .post(`/admin/healers/${id}/reject`, { reason })
        .then((r) => r.data);
    }
    // Store the rejection reason by logging an activity via RPC or just update status
    const healer = await HealersService._updateStatus(id, "rejected");
    // Optionally record reason in activities
    await supabase.from("activities").insert({
      type: "healer_rejected",
      message: `Healer ${healer.name} rejected: ${reason}`,
    });
    return healer;
  },

  verifyDocuments: async (id: string): Promise<Healer> => {
    if (!SUPABASE_ENABLED) {
      return api
        .post(`/admin/healers/${id}/verify-documents`)
        .then((r) => r.data);
    }

    const { data, error } = await supabase
      .from("healers")
      .update({ documents_verified: true })
      .eq("id", id)
      .select("*, users(*)")
      .single();

    if (error) throw error;
    return rowToHealer(data);
  },

  suspend: async (id: string): Promise<Healer> => {
    if (!SUPABASE_ENABLED) {
      return api.post(`/admin/healers/${id}/suspend`).then((r) => r.data);
    }
    return HealersService._updateStatus(id, "suspended");
  },
};
