import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";

const SUPABASE_ENABLED =
  !!import.meta.env.VITE_SUPABASE_URL &&
  !!import.meta.env.VITE_SUPABASE_ANON_KEY;

export type UserRole = "seeker" | "healer" | "admin" | "coach" | "therapist";

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin - site admin",
  seeker: "Seeker",
  healer: "Healer",
  coach: "Coach",
  therapist: "Therapist / Counsellor / Psychiatrist / Psychologist",
};

export const PRACTITIONER_ROLES: UserRole[] = ["healer", "coach", "therapist"];

export function hasPractitionerRole(roles?: string[] | string): boolean {
  if (!roles) return false;
  const arr = Array.isArray(roles) ? roles : [roles];
  return arr.some((r) => PRACTITIONER_ROLES.includes(r as UserRole));
}

export type UserStatus = "active" | "blocked" | "suspended" | "pending";

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  roles: UserRole[];
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
  const rolesArr: UserRole[] = Array.isArray(row.roles) && row.roles.length > 0
    ? row.roles
    : [row.role ?? "seeker"];

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone ?? undefined,
    role: rolesArr[0],
    roles: rolesArr,
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
    password?: string;
    role?: UserRole;
    roles?: UserRole[];
    status?: UserStatus;
    avatarUrl?: string | null;
  }): Promise<User> => {
    if (!SUPABASE_ENABLED) {
      return api
        .post<User>("/admin/users", payload)
        .then((r) => r.data);
    }

    const assignedRoles: UserRole[] = payload.roles && payload.roles.length > 0
      ? payload.roles
      : [payload.role ?? "seeker"];
    const primaryRole = assignedRoles[0];

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
          data: { name: payload.name, role: primaryRole },
        },
      });
      if (authErr) {
        throw new Error(`Failed to register login account: ${authErr.message}`);
      }
      if (authData?.user?.id) {
        authUserId = authData.user.id;
      }
    }

    const insertObj: any = {
      name: payload.name,
      email: payload.email,
      phone: payload.phone || null,
      role: primaryRole,
      roles: assignedRoles,
      status: payload.status ?? "active",
      avatar_url: payload.avatarUrl || null,
    };
    if (authUserId) {
      insertObj.id = authUserId;
    }

    const { data, error } = await supabase
      .from("users")
      .insert(insertObj)
      .select()
      .single();

    if (error) throw error;

    if (hasPractitionerRole(assignedRoles)) {
      await supabase.from("healers").upsert({
        id: data.id,
        status: payload.status === "active" ? "approved" : "pending",
        modalities: assignedRoles
          .filter((r) => PRACTITIONER_ROLES.includes(r))
          .map((r) => (r === "therapist" ? "Therapy & Counselling" : ROLE_LABELS[r].split("/")[0].trim())),
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
      query = query.or(`role.eq.${params.role},roles.cs.{${params.role}}`);
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
    if (patch.roles && patch.roles.length > 0) {
      dbPatch.roles = patch.roles;
      dbPatch.role = patch.roles[0];
    } else if (patch.role) {
      dbPatch.role = patch.role;
      dbPatch.roles = [patch.role];
    }
    if (patch.avatarUrl)     dbPatch.avatar_url     = patch.avatarUrl;
    if (patch.lastActiveAt)  dbPatch.last_active_at = patch.lastActiveAt;

    const { data, error } = await supabase
      .from("users")
      .update(dbPatch)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    const updatedUser = rowToUser(data);
    if (hasPractitionerRole(updatedUser.roles)) {
      await supabase.from("healers").upsert({
        id: id,
        status: updatedUser.status === "active" ? "approved" : "pending",
      }, { onConflict: "id", ignoreDuplicates: true });
    }

    return updatedUser;
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
