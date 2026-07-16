import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Users as UsersIcon,
  Sparkles,
  UserRound,
  ShieldCheck,
  CalendarCheck,
  Clock,
  DollarSign,
  CalendarDays,
  Package,
  Star,
  Activity as ActivityIcon,
} from "lucide-react";

import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { ChartCard } from "@/components/admin/ChartCard";
import { LoadingState, ErrorState, EmptyState } from "@/components/admin/States";
import { StatsService } from "@/services/stats.service";
import { formatCurrency, formatDate, formatNumber, relativeTime } from "@/lib/format";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function DashboardPage() {
  const overviewQ = useQuery({ queryKey: ["stats", "overview"], queryFn: StatsService.overview });
  const revenueQ = useQuery({ queryKey: ["stats", "revenue"], queryFn: () => StatsService.revenue() });
  const usersQ = useQuery({ queryKey: ["stats", "users"], queryFn: () => StatsService.users() });
  const bookingsQ = useQuery({ queryKey: ["stats", "bookings"], queryFn: () => StatsService.bookings() });
  const regsQ = useQuery({ queryKey: ["stats", "regs"], queryFn: () => StatsService.registrations() });
  const modQ = useQuery({ queryKey: ["stats", "modalities"], queryFn: StatsService.topModalities });
  const healersQ = useQuery({ queryKey: ["stats", "top-healers"], queryFn: StatsService.topHealers });
  const actsQ = useQuery({ queryKey: ["activities"], queryFn: StatsService.recentActivities });

  const o = overviewQ.data;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="Real-time overview of the Mystic Lotus & Dragonflies marketplace."
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        <StatCard label="Total users" value={o ? formatNumber(o.totalUsers) : "—"} loading={overviewQ.isLoading} icon={<UsersIcon className="h-5 w-5" />} />
        <StatCard label="Healers" value={o ? formatNumber(o.totalHealers) : "—"} loading={overviewQ.isLoading} icon={<Sparkles className="h-5 w-5" />} />
        <StatCard label="Seekers" value={o ? formatNumber(o.totalSeekers) : "—"} loading={overviewQ.isLoading} icon={<UserRound className="h-5 w-5" />} />
        <StatCard label="Pending verifications" value={o ? formatNumber(o.pendingVerifications) : "—"} loading={overviewQ.isLoading} icon={<ShieldCheck className="h-5 w-5" />} />
        <StatCard label="Active bookings" value={o ? formatNumber(o.activeBookings) : "—"} loading={overviewQ.isLoading} icon={<CalendarCheck className="h-5 w-5" />} />
        <StatCard label="Today's sessions" value={o ? formatNumber(o.todaysSessions) : "—"} loading={overviewQ.isLoading} icon={<Clock className="h-5 w-5" />} />
        <StatCard label="Monthly revenue" value={o ? formatCurrency(o.monthlyRevenue) : "—"} loading={overviewQ.isLoading} icon={<DollarSign className="h-5 w-5" />} />
        <StatCard label="Events" value={o ? formatNumber(o.totalEvents) : "—"} loading={overviewQ.isLoading} icon={<CalendarDays className="h-5 w-5" />} />
        <StatCard label="Products" value={o ? formatNumber(o.totalProducts) : "—"} loading={overviewQ.isLoading} icon={<Package className="h-5 w-5" />} />
        <StatCard label="Reviews" value={o ? formatNumber(o.totalReviews) : "—"} loading={overviewQ.isLoading} icon={<Star className="h-5 w-5" />} />
      </div>

      {overviewQ.isError && <ErrorState error={overviewQ.error} onRetry={() => overviewQ.refetch()} />}

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Revenue growth" description="Last 30 days" className="lg:col-span-2">
          <div className="h-64">
            {revenueQ.isLoading ? (
              <LoadingState />
            ) : revenueQ.isError ? (
              <ErrorState error={revenueQ.error} onRetry={() => revenueQ.refetch()} />
            ) : (revenueQ.data ?? []).length === 0 ? (
              <EmptyState title="No revenue yet" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueQ.data}>
                  <defs>
                    <linearGradient id="grad-rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.55} />
                      <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--popover)" }} />
                  <Area type="monotone" dataKey="value" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#grad-rev)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartCard>

        <ChartCard title="Top modalities" description="Most booked">
          <div className="h-64">
            {modQ.isLoading ? (
              <LoadingState />
            ) : modQ.isError ? (
              <ErrorState error={modQ.error} onRetry={() => modQ.refetch()} />
            ) : (modQ.data ?? []).length === 0 ? (
              <EmptyState title="No modalities yet" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--popover)" }} />
                  <Pie data={modQ.data} dataKey="count" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={2}>
                    {(modQ.data ?? []).map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="User growth" description="Cumulative">
          <div className="h-56">
            {usersQ.isLoading ? (
              <LoadingState />
            ) : usersQ.isError ? (
              <ErrorState error={usersQ.error} onRetry={() => usersQ.refetch()} />
            ) : (usersQ.data ?? []).length === 0 ? (
              <EmptyState title="No user data yet" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={usersQ.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--popover)" }} />
                  <Line type="monotone" dataKey="value" stroke="var(--chart-2)" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartCard>

        <ChartCard title="Bookings" description="Daily volume">
          <div className="h-56">
            {bookingsQ.isLoading ? (
              <LoadingState />
            ) : bookingsQ.isError ? (
              <ErrorState error={bookingsQ.error} onRetry={() => bookingsQ.refetch()} />
            ) : (bookingsQ.data ?? []).length === 0 ? (
              <EmptyState title="No bookings yet" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingsQ.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--popover)" }} />
                  <Bar dataKey="value" fill="var(--chart-3)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartCard>
      </div>

      {/* Charts row 3 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Monthly registrations" description="Last 12 months" className="lg:col-span-2">
          <div className="h-56">
            {regsQ.isLoading ? (
              <LoadingState />
            ) : regsQ.isError ? (
              <ErrorState error={regsQ.error} onRetry={() => regsQ.refetch()} />
            ) : (regsQ.data ?? []).length === 0 ? (
              <EmptyState title="No registrations yet" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regsQ.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--popover)" }} />
                  <Bar dataKey="value" fill="var(--chart-4)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartCard>

        <ChartCard title="Popular healers" description="By bookings">
          <div className="flex flex-col gap-3">
            {healersQ.isLoading ? (
              <LoadingState />
            ) : healersQ.isError ? (
              <ErrorState error={healersQ.error} onRetry={() => healersQ.refetch()} />
            ) : (healersQ.data ?? []).length === 0 ? (
              <EmptyState title="No healers yet" />
            ) : (
              (healersQ.data ?? []).slice(0, 5).map((h) => (
                <div key={h.id} className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {h.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{h.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatNumber(h.bookings)} bookings · ★ {h.rating.toFixed(1)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ChartCard>
      </div>

      {/* Recent activity */}
      <ChartCard title="Recent activity">
        {actsQ.isLoading ? (
          <LoadingState />
        ) : actsQ.isError ? (
          <ErrorState error={actsQ.error} onRetry={() => actsQ.refetch()} />
        ) : (actsQ.data ?? []).length === 0 ? (
          <EmptyState
            title="No recent activity"
            description="New registrations, bookings, payments, and reviews will appear here as they happen."
            icon={<ActivityIcon className="h-5 w-5" />}
          />
        ) : (
          <ul className="divide-y divide-border/70">
            {actsQ.data!.map((a) => (
              <li key={a.id} className="flex items-start gap-3 py-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{a.message}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {a.type} · {relativeTime(a.at)} · {formatDate(a.at)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </ChartCard>
    </div>
  );
}
