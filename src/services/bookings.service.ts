import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";
import type { Paginated } from "./users.service";

const SUPABASE_ENABLED =
  !!import.meta.env.VITE_SUPABASE_URL &&
  !!import.meta.env.VITE_SUPABASE_ANON_KEY;

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "refunded";
export type PaymentStatus = "unpaid" | "paid" | "refunded" | "failed";

export type Booking = {
  id: string;
  reference: string;
  seeker: { id: string; name: string; email: string };
  healer: { id: string; name: string };
  modality: string;
  scheduledAt: string;
  durationMinutes: number;
  amount: number;
  currency: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  notes?: string;
};

function rowToBooking(row: any): Booking {
  return {
    id: row.id,
    reference: row.reference,
    seeker: {
      id: row.seeker_id ?? row.seeker?.id ?? "",
      name: row.seekers?.name  ?? row.seeker?.name  ?? "Unknown",
      email: row.seekers?.email ?? row.seeker?.email ?? "",
    },
    healer: {
      id: row.healer_id ?? row.healer?.id ?? "",
      name: row.healers?.users?.name ?? row.healer?.name ?? "Unknown",
    },
    modality: row.modality,
    scheduledAt: row.scheduled_at,
    durationMinutes: row.duration_minutes,
    amount: row.amount,
    currency: row.currency ?? "USD",
    status: row.status,
    paymentStatus: row.payment_status,
    createdAt: row.created_at,
    notes: row.notes ?? undefined,
  };
}

export const BookingsService = {
  list: async (
    params: {
      search?: string;
      status?: BookingStatus | "all";
      from?: string;
      to?: string;
      page?: number;
      limit?: number;
    } = {},
  ): Promise<Paginated<Booking>> => {
    if (!SUPABASE_ENABLED) {
      return api
        .get<Paginated<Booking>>("/admin/bookings", { params })
        .then((r) => r.data);
    }

    const page  = params.page  ?? 1;
    const limit = params.limit ?? 20;
    const from  = (page - 1) * limit;
    const to    = from + limit - 1;

    let query = supabase
      .from("bookings")
      .select(
        `*,
        seekers:users!bookings_seeker_id_fkey(id, name, email),
        healers!bookings_healer_id_fkey(id, users(name))`,
        { count: "exact" },
      );

    if (params.status && params.status !== "all") {
      query = query.eq("status", params.status);
    }
    if (params.search) {
      query = query.or(
        `reference.ilike.%${params.search}%,modality.ilike.%${params.search}%`,
      );
    }
    if (params.from) {
      query = query.gte("scheduled_at", params.from);
    }
    if (params.to) {
      query = query.lte("scheduled_at", params.to);
    }

    query = query.order("created_at", { ascending: false }).range(from, to);

    const { data, count, error } = await query;
    if (error) throw error;

    return {
      data: (data ?? []).map(rowToBooking),
      total: count ?? 0,
      page,
      limit,
    };
  },

  get: async (id: string): Promise<Booking> => {
    if (!SUPABASE_ENABLED) {
      return api.get<Booking>(`/admin/bookings/${id}`).then((r) => r.data);
    }

    const { data, error } = await supabase
      .from("bookings")
      .select(
        `*,
        seekers:users!bookings_seeker_id_fkey(id, name, email),
        healers!bookings_healer_id_fkey(id, users(name))`,
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    return rowToBooking(data);
  },

  cancel: async (id: string, reason?: string): Promise<Booking> => {
    if (!SUPABASE_ENABLED) {
      return api
        .post(`/admin/bookings/${id}/cancel`, { reason })
        .then((r) => r.data);
    }

    const { data, error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", id)
      .select(
        `*,
        seekers:users!bookings_seeker_id_fkey(id, name, email),
        healers!bookings_healer_id_fkey(id, users(name))`,
      )
      .single();

    if (error) throw error;

    if (reason) {
      await supabase.from("activities").insert({
        type: "booking_cancelled",
        message: `Booking ${data.reference} cancelled: ${reason}`,
      });
    }

    return rowToBooking(data);
  },

  refund: async (id: string): Promise<Booking> => {
    if (!SUPABASE_ENABLED) {
      return api.post(`/admin/bookings/${id}/refund`).then((r) => r.data);
    }

    const { data, error } = await supabase
      .from("bookings")
      .update({ status: "refunded", payment_status: "refunded" })
      .eq("id", id)
      .select(
        `*,
        seekers:users!bookings_seeker_id_fkey(id, name, email),
        healers!bookings_healer_id_fkey(id, users(name))`,
      )
      .single();

    if (error) throw error;

    await supabase.from("activities").insert({
      type: "booking_refunded",
      message: `Booking ${data.reference} refunded`,
    });

    return rowToBooking(data);
  },
};
