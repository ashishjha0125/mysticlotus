import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";

const SUPABASE_ENABLED =
  !!import.meta.env.VITE_SUPABASE_URL &&
  !!import.meta.env.VITE_SUPABASE_ANON_KEY;

export type UserStatus = "active" | "blocked" | "suspended" | "pending";

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "seeker" | "healer" | "admin";
  status: UserStatus;
  avatarUrl?: string | null;
  createdAt: string;
  lastActiveAt?: string | null;
};

export type UsersQuery = {
  search?: string;
  status?: UserStatus | "all";
  role?: string | "all";
  page?: number;
  limit?: number;
};

export type Paginated<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};

function rowToUser(row: any): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone ?? undefined,
    role: row.role,
    status: row.status,
    avatarUrl: row.avatar_url ?? null,
    createdAt: row.created_at,
    lastActiveAt: row.last_active_at ?? null,
  };
}

export const UsersService = {
  create: async (payload: {
    name: string;
    email: string;
    phone?: string;
    role: "seeker" | "healer" | "admin";
    status?: UserStatus;
    avatarUrl?: string | null;
  }): Promise<User> => {
    if (!SUPABASE_ENABLED) {
      return api
        .post<User>("/admin/users", payload)
        .then((r) => r.data);
    }

    const { data, error } = await supabase
      .from("users")
      .insert({
        name: payload.name,
        email: payload.email,
        phone: payload.phone || null,
        role: payload.role,
        status: payload.status ?? "active",
        avatar_url: payload.avatarUrl || null,
      })
      .select()
      .single();

    if (error) throw error;

    if (payload.role === "healer") {
      await supabase.from("healers").upsert({
        id: data.id,
        status: payload.status === "active" ? "approved" : "pending",
        modalities: [],
        documents_verified: false,
      });
    }

    return rowToUser(data);
  },

  list: async (params: UsersQuery = {}): Promise<Paginated<User>> => {
    if (!SUPABASE_ENABLED) {
      return api
        .get<Paginated<User>>("/admin/users", { params })
        .then((r) => r.data);
    }

    const page  = params.page  ?? 1;
    const limit = params.limit ?? 20;
    const from  = (page - 1) * limit;
    const to    = from + limit - 1;

    let query = supabase.from("users").select("*", { count: "exact" });

    if (params.search) {
      query = query.or(
        `name.ilike.%${params.search}%,email.ilike.%${params.search}%`,
      );
    }
    if (params.status && params.status !== "all") {
      query = query.eq("status", params.status);
    }
    if (params.role && params.role !== "all") {
      query = query.eq("role", params.role);
    }

    query = query.order("created_at", { ascending: false }).range(from, to);

    const { data, count, error } = await query;
    if (error) throw error;

    return {
      data: (data ?? []).map(rowToUser),
      total: count ?? 0,
      page,
      limit,
    };
  },

  get: async (id: string): Promise<User> => {
    if (!SUPABASE_ENABLED) {
      return api.get<User>(`/admin/users/${id}`).then((r) => r.data);
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return rowToUser(data);
  },

  update: async (id: string, patch: Partial<User>): Promise<User> => {
    if (!SUPABASE_ENABLED) {
      return api
        .patch<User>(`/admin/users/${id}`, patch)
        .then((r) => r.data);
    }

    const dbPatch: Record<string, unknown> = {};
    if (patch.name)          dbPatch.name           = patch.name;
    if (patch.email)         dbPatch.email          = patch.email;
    if (patch.phone)         dbPatch.phone          = patch.phone;
    if (patch.status)        dbPatch.status         = patch.status;
    if (patch.role)          dbPatch.role           = patch.role;
    if (patch.avatarUrl)     dbPatch.avatar_url     = patch.avatarUrl;
    if (patch.lastActiveAt)  dbPatch.last_active_at = patch.lastActiveAt;

    const { data, error } = await supabase
      .from("users")
      .update(dbPatch)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return rowToUser(data);
  },

  block: async (id: string): Promise<User> => {
    if (!SUPABASE_ENABLED) {
      return api.post(`/admin/users/${id}/block`).then((r) => r.data);
    }

    const { data, error } = await supabase
      .from("users")
      .update({ status: "blocked" })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return rowToUser(data);
  },

  suspend: async (id: string): Promise<User> => {
    if (!SUPABASE_ENABLED) {
      return api.post(`/admin/users/${id}/suspend`).then((r) => r.data);
    }

    const { data, error } = await supabase
      .from("users")
      .update({ status: "suspended" })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return rowToUser(data);
  },

  remove: async (id: string): Promise<void> => {
    if (!SUPABASE_ENABLED) {
      return api.delete(`/admin/users/${id}`).then(() => undefined);
    }

    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) throw error;
  },
};
