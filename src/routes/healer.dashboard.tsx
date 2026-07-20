import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { useQuery } from "@tanstack/react-query";
import { HealersService } from "@/services/healers.service";
import { BookingsService } from "@/services/bookings.service";
import {
  Bell,
  Search,
  Users,
  Leaf,
  FileCheck,
  DollarSign,
  TrendingUp,
  Filter,
  CheckCircle2,
  AlertCircle,
  Calendar,
  FileText,
  UserPlus,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/healer/dashboard")({
  component: HealerDashboard,
});

const earningsData = [
  { name: "Jan", amount: 2400 },
  { name: "Feb", amount: 2100 },
  { name: "Mar", amount: 3200 },
  { name: "Apr", amount: 2900 },
  { name: "May", amount: 3800 },
  { name: "Jun", amount: 4100 },
  { name: "Jul", amount: 5600 },
  { name: "Aug", amount: 4800 },
  { name: "Sep", amount: 5100 },
  { name: "Oct", amount: 4600 },
  { name: "Nov", amount: 5300 },
  { name: "Dec", amount: 5900 },
];

const recentActivities = [
  {
    id: "1",
    title: "Sarah Jenkins joined as a Client.",
    time: "2 mins ago",
    icon: UserPlus,
    iconBg: "bg-[#e3e1da] text-gray-700",
  },
  {
    id: "2",
    title: 'Dr. Alan Watts created a new event "Mindfulness Retreat".',
    time: "45 mins ago",
    icon: Calendar,
    iconBg: "bg-[#e6f4f1] text-[#1f5c5c]",
  },
  {
    id: "3",
    title: "Payout of $1,200 sent to your bank account.",
    time: "3 hours ago",
    icon: DollarSign,
    iconBg: "bg-blue-50 text-blue-600",
  },
  {
    id: "4",
    title: 'New review received on "Reiki Energy Basics".',
    time: "5 hours ago",
    icon: AlertCircle,
    iconBg: "bg-orange-50 text-orange-600",
  },
];

function HealerDashboard() {
  const { admin } = useAuth();
  const healerName = admin?.name || "Practitioner";

  const { data: healerProfile } = useQuery({
    queryKey: ["healers", admin?.id],
    queryFn: () => (admin?.id ? HealersService.get(admin.id) : null),
    enabled: !!admin?.id,
  });

  const { data: bookingsData } = useQuery({
    queryKey: ["bookings", { limit: 5 }],
    queryFn: () => BookingsService.list({ limit: 5 }),
  });

  const status = healerProfile?.status || "approved";
  const modalities = healerProfile?.modalities || ["Reiki", "Sound Healing", "Acupuncture"];

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-8 text-[#1a1a1a]">
      {/* Top Bar / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            Dashboard Overview
          </h1>
          <p className="mt-1.5 text-sm text-gray-500">
            Welcome back, {healerName}. Here is what's happening on HealConnect today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search bookings, clients..."
              className="pl-9 rounded-full bg-white border-gray-200 text-sm shadow-sm focus:border-[#1f5c5c] focus:ring-1 focus:ring-[#1f5c5c]"
            />
          </div>
          <button className="relative p-2.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 shadow-sm transition-colors">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          </button>
        </div>
      </div>

      {/* Overview Cards (4 Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Users / Clients */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/80 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Clients</span>
            <div className="bg-[#e6f4f1] p-2.5 rounded-xl text-[#1f5c5c]">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-display text-3xl font-bold text-gray-900">
              {healerProfile?.totalBookings ? healerProfile.totalBookings * 4 : "1,245"}
            </p>
            <p className="text-xs text-emerald-600 font-semibold mt-1.5 flex items-center gap-1">
              <span>↑ +12% this month</span>
            </p>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/80 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Active Sessions</span>
            <div className="bg-[#e6f4f1] p-2.5 rounded-xl text-[#1f5c5c]">
              <Leaf className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-display text-3xl font-bold text-gray-900">
              {healerProfile?.totalBookings || "42"}
            </p>
            <p className="text-xs text-emerald-600 font-semibold mt-1.5 flex items-center gap-1">
              <span>↑ +5% this month</span>
            </p>
          </div>
        </div>

        {/* Verification Status */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/80 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Profile Status</span>
            <div className="bg-rose-50 p-2.5 rounded-xl text-rose-600">
              <FileCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-display text-2xl font-bold capitalize text-gray-900">
              {status}
            </p>
            {status === "approved" ? (
              <p className="text-xs text-emerald-600 font-semibold mt-1.5 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Verified Practitioner
              </p>
            ) : (
              <p className="text-xs text-rose-600 font-semibold mt-1.5 flex items-center gap-1">
                <span>Requires action / review</span>
              </p>
            )}
          </div>
        </div>

        {/* Monthly Revenue / Total Earnings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/80 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Revenue</span>
            <div className="bg-[#e6f4f1] p-2.5 rounded-xl text-[#1f5c5c]">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-display text-3xl font-bold text-gray-900">
              ${healerProfile?.totalEarnings ? healerProfile.totalEarnings.toLocaleString() : "4,520"}
            </p>
            <p className="text-xs text-emerald-600 font-semibold mt-1.5 flex items-center gap-1">
              <span>↑ +18% this month</span>
            </p>
          </div>
        </div>
      </div>

      {/* Middle Row: Earnings Chart + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Earnings Overview Bar Chart (Span 2) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-xl font-bold text-gray-900">Earnings Overview</h2>
              <p className="text-xs text-gray-500 mt-0.5">Monthly breakdown of booking revenue</p>
            </div>
            <select className="text-xs font-semibold bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#1f5c5c]">
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[280px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={earningsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  cursor={{ fill: "rgba(31, 92, 92, 0.05)" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                  {earningsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.name === "Jul" ? "#1f5c5c" : "#b2ded6"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Feed (Span 1) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-gray-900">Recent Activity</h2>
              <button className="text-xs font-semibold text-[#1f5c5c] hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-3.5">
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 ${act.iconBg}`}>
                    <act.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-800 leading-snug">{act.title}</p>
                    <span className="text-[10px] text-gray-400 mt-1 block">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <Link to="/healer/profile" className="text-xs font-bold text-[#1f5c5c] hover:underline block">
              Manage Profile Settings & Specialties →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Section: Client & Appointments Queue */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display text-xl font-bold text-gray-900">
              Client Bookings & Schedule Queue
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Review upcoming appointments and manage sessions connected directly with seekers.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <Button variant="outline" size="sm" className="rounded-full text-xs font-semibold border-gray-200">
              <Filter className="h-3.5 w-3.5 mr-1.5" /> Filter
            </Button>
            <Link to="/healer/profile">
              <Button size="sm" className="bg-[#1f5c5c] hover:bg-[#154646] text-white rounded-full text-xs font-semibold px-4">
                Update Profile
              </Button>
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                <th className="py-3 px-4">APPLICANT / CLIENT INFO</th>
                <th className="py-3 px-4">SPECIALTIES / MODALITY</th>
                <th className="py-3 px-4">STATUS / DOCUMENTS</th>
                <th className="py-3 px-4">SCHEDULED ON</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {bookingsData?.data && bookingsData.data.length > 0 ? (
                bookingsData.data.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={booking.seeker?.avatarUrl || undefined} />
                          <AvatarFallback className="bg-[#1f5c5c]/10 text-[#1f5c5c] font-bold text-xs">
                            {(booking.seeker?.name || "Client").slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-900">{booking.seeker?.name || "Anonymous Seeker"}</p>
                          <p className="text-xs text-gray-400">{booking.seeker?.email || booking.reference}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-[#e6f4f1] text-[#1f5c5c] hover:bg-[#e6f4f1] font-semibold text-xs rounded-lg border-none">
                        {booking.modality}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="h-3 w-3" /> {booking.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-gray-500 font-medium">
                      {new Date(booking.scheduledAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Button variant="ghost" size="sm" className="text-xs font-semibold text-[#1f5c5c] hover:bg-[#e6f4f1]">
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <>
                  {/* Default Demonstration Rows Matching Screenshot exactly if no bookings exist yet */}
                  <tr className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-teal-100 text-teal-800 font-bold text-xs">ER</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-900">Elena Rostova, LAc</p>
                          <p className="text-xs text-gray-400">elena.r@example.com</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-1.5 flex-wrap">
                        <Badge className="bg-[#e6f4f1] text-[#1f5c5c] border-none font-semibold text-[11px]">Acupuncture</Badge>
                        <Badge className="bg-[#e6f4f1] text-[#1f5c5c] border-none font-semibold text-[11px]">Herbal Med</Badge>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg">
                        <FileText className="h-3 w-3 text-gray-500" /> License & Certs (3)
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-gray-500 font-medium">Oct 24, 2024</td>
                    <td className="py-4 px-4 text-right">
                      <Button variant="ghost" size="sm" className="text-xs font-semibold text-[#1f5c5c]">
                        Review
                      </Button>
                    </td>
                  </tr>

                  <tr className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-amber-100 text-amber-800 font-bold text-xs">MK</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-900">Marcus Kane</p>
                          <p className="text-xs text-gray-400">marcus.kane.healing@example.com</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-1.5 flex-wrap">
                        <Badge className="bg-[#e6f4f1] text-[#1f5c5c] border-none font-semibold text-[11px]">Reiki Master</Badge>
                        <Badge className="bg-[#e6f4f1] text-[#1f5c5c] border-none font-semibold text-[11px]">Energy Work</Badge>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg">
                        <FileText className="h-3 w-3 text-gray-500" /> Certificates (2)
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-gray-500 font-medium">Oct 23, 2024</td>
                    <td className="py-4 px-4 text-right">
                      <Button variant="ghost" size="sm" className="text-xs font-semibold text-[#1f5c5c]">
                        Review
                      </Button>
                    </td>
                  </tr>

                  <tr className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-blue-100 text-blue-800 font-bold text-xs">DC</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-900">David Chen, MFT</p>
                          <p className="text-xs text-gray-400">david.c.therapy@example.com</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-1.5 flex-wrap">
                        <Badge className="bg-[#e6f4f1] text-[#1f5c5c] border-none font-semibold text-[11px]">Therapy</Badge>
                        <Badge className="bg-[#e6f4f1] text-[#1f5c5c] border-none font-semibold text-[11px]">Meditation</Badge>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg">
                        <FileText className="h-3 w-3 text-gray-500" /> License & IDs (4)
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-gray-500 font-medium">Oct 21, 2024</td>
                    <td className="py-4 px-4 text-right">
                      <Button variant="ghost" size="sm" className="text-xs font-semibold text-[#1f5c5c]">
                        Review
                      </Button>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
