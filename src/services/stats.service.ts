import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";

const SUPABASE_ENABLED =
  !!import.meta.env.VITE_SUPABASE_URL &&
  !!import.meta.env.VITE_SUPABASE_ANON_KEY;

export type Overview = {
  totalUsers: number;
  totalHealers: number;
  totalSeekers: number;
  pendingVerifications: number;
  activeBookings: number;
  todaysSessions: number;
  monthlyRevenue: number;
  totalEvents: number;
  totalProducts: number;
  totalReviews: number;
};

export type SeriesPoint = { date: string; value: number };
export type ModalityStat = { name: string; count: number };
export type HealerStat = { id: string; name: string; bookings: number; rating: number };
export type Activity = { id: string; type: string; message: string; at: string };

export const StatsService = {
  overview: async (): Promise<Overview> => {
    if (!SUPABASE_ENABLED) {
      return api.get<Overview>("/admin/stats/overview").then((r) => r.data);
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const endOfToday   = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();

    const [
      { count: totalUsers },
      { count: totalHealers },
      { count: totalSeekers },
      { count: pendingVerifications },
      { count: activeBookings },
      { count: todaysSessions },
      { data: revenueData },
    ] = await Promise.all([
      supabase.from("users").select("*", { count: "exact", head: true }),
      supabase.from("users").select("*", { count: "exact", head: true }).eq("role", "healer"),
      supabase.from("users").select("*", { count: "exact", head: true }).eq("role", "seeker"),
      supabase.from("healers").select("*", { count: "exact", head: true }).eq("documents_verified", false),
      supabase.from("bookings").select("*", { count: "exact", head: true }).in("status", ["pending", "confirmed"]),
      supabase.from("bookings").select("*", { count: "exact", head: true })
        .gte("scheduled_at", startOfToday)
        .lt("scheduled_at", endOfToday)
        .neq("status", "cancelled"),
      supabase.from("bookings").select("amount").eq("payment_status", "paid").gte("created_at", startOfMonth),
    ]);

    const monthlyRevenue = (revenueData ?? []).reduce((s, r) => s + (r.amount ?? 0), 0);

    return {
      totalUsers:           totalUsers         ?? 0,
      totalHealers:         totalHealers       ?? 0,
      totalSeekers:         totalSeekers       ?? 0,
      pendingVerifications: pendingVerifications ?? 0,
      activeBookings:       activeBookings     ?? 0,
      todaysSessions:       todaysSessions     ?? 0,
      monthlyRevenue,
      totalEvents:   0,
      totalProducts: 0,
      totalReviews:  0,
    };
  },

  revenue: async (range = "30d"): Promise<SeriesPoint[]> => {
    if (!SUPABASE_ENABLED) {
      return api
        .get<{ date: string; revenue: number }[]>("/admin/stats/revenue", { params: { range } })
        .then((r) => r.data.map((d) => ({ date: d.date, value: d.revenue })));
    }

    const days = range === "7d" ? 7 : 30;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const { data, error } = await supabase
      .from("bookings")
      .select("created_at, amount")
      .eq("payment_status", "paid")
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: true });

    if (error) throw error;

    // Group by date
    const map: Record<string, number> = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      map[d.toLocaleDateString("en-US", { month: "short", day: "numeric" })] = 0;
    }
    for (const row of data ?? []) {
      const label = new Date(row.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (label in map) map[label] += row.amount ?? 0;
    }

    return Object.entries(map).map(([date, value]) => ({ date, value }));
  },

  users: async (range = "30d"): Promise<SeriesPoint[]> => {
    if (!SUPABASE_ENABLED) {
      return api
        .get<{ date: string; users: number }[]>("/admin/stats/users", { params: { range } })
        .then((r) => r.data.map((d) => ({ date: d.date, value: d.users })));
    }

    const days = range === "7d" ? 7 : 30;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const { data, error } = await supabase
      .from("users")
      .select("created_at")
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: true });

    if (error) throw error;

    const map: Record<string, number> = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      map[d.toLocaleDateString("en-US", { month: "short", day: "numeric" })] = 0;
    }
    for (const row of data ?? []) {
      const label = new Date(row.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (label in map) map[label]++;
    }

    // Make cumulative
    let running = 0;
    return Object.entries(map).map(([date, value]) => {
      running += value;
      return { date, value: running };
    });
  },

  bookings: async (range = "30d"): Promise<SeriesPoint[]> => {
    if (!SUPABASE_ENABLED) {
      return api
        .get<{ date: string; count: number }[]>("/admin/stats/bookings", { params: { range } })
        .then((r) => r.data.map((d) => ({ date: d.date, value: d.count })));
    }

    const days = range === "7d" ? 7 : 30;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const { data, error } = await supabase
      .from("bookings")
      .select("created_at")
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: true });

    if (error) throw error;

    const map: Record<string, number> = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      map[d.toLocaleDateString("en-US", { month: "short", day: "numeric" })] = 0;
    }
    for (const row of data ?? []) {
      const label = new Date(row.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (label in map) map[label]++;
    }

    return Object.entries(map).map(([date, value]) => ({ date, value }));
  },

  registrations: async (range = "12m"): Promise<SeriesPoint[]> => {
    if (!SUPABASE_ENABLED) {
      return api
        .get<{ date: string; count: number }[]>("/admin/stats/users", { params: { range, group: "month" } })
        .then((r) => r.data.map((d) => ({ date: d.date, value: d.count })));
    }

    const months = range === "12m" ? 12 : 6;
    const since = new Date();
    since.setMonth(since.getMonth() - months);

    const { data, error } = await supabase
      .from("users")
      .select("created_at")
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: true });

    if (error) throw error;

    const map: Record<string, number> = {};
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      map[d.toLocaleDateString("en-US", { month: "short" })] = 0;
    }
    for (const row of data ?? []) {
      const label = new Date(row.created_at).toLocaleDateString("en-US", { month: "short" });
      if (label in map) map[label]++;
    }

    return Object.entries(map).map(([date, value]) => ({ date, value }));
  },

  topModalities: async (): Promise<ModalityStat[]> => {
    if (!SUPABASE_ENABLED) {
      return api.get<ModalityStat[]>("/admin/stats/modalities/top").then((r) => r.data);
    }

    const { data, error } = await supabase
      .from("bookings")
      .select("modality")
      .neq("status", "cancelled");

    if (error) throw error;

    const counts: Record<string, number> = {};
    for (const row of data ?? []) {
      counts[row.modality] = (counts[row.modality] ?? 0) + 1;
    }

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  },

  topHealers: async (): Promise<HealerStat[]> => {
    if (!SUPABASE_ENABLED) {
      return api.get<HealerStat[]>("/admin/stats/healers/top").then((r) => r.data);
    }

    const { data, error } = await supabase
      .from("healers")
      .select("id, total_bookings, rating, users(name)")
      .eq("status", "approved")
      .order("total_bookings", { ascending: false })
      .limit(5);

    if (error) throw error;

    return (data ?? []).map((h: any) => ({
      id: h.id,
      name: h.users?.name ?? "Unknown",
      bookings: h.total_bookings ?? 0,
      rating: h.rating ?? 0,
    }));
  },

  recentActivities: async (): Promise<Activity[]> => {
    if (!SUPABASE_ENABLED) {
      return api.get<Activity[]>("/admin/activities/recent").then((r) => r.data);
    }

    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;

    return (data ?? []).map((a: any) => ({
      id: a.id,
      type: a.type,
      message: a.message,
      at: a.created_at,
    }));
  },
};
