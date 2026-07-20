import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BookingsService } from "@/services/bookings.service";
import { Calendar, Users, Filter, CheckCircle2, Clock, XCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Route = createFileRoute("/healer/bookings")({
  component: HealerBookingsPage,
});

function HealerBookingsPage() {
  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ["bookings", { limit: 50 }],
    queryFn: () => BookingsService.list({ limit: 50 }),
  });

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-8 text-[#1a1a1a]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-gray-900">
            Bookings & Client Schedule
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your appointments, session statuses, and client notes in real-time.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search clients, reference..."
              className="pl-9 rounded-full bg-white border-gray-200 text-sm shadow-sm"
            />
          </div>
          <Button variant="outline" className="rounded-full text-xs font-semibold">
            <Filter className="h-3.5 w-3.5 mr-1.5" /> Filter Status
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                <th className="py-3 px-4">CLIENT NAME & CONTACT</th>
                <th className="py-3 px-4">MODALITY</th>
                <th className="py-3 px-4">SCHEDULED DATE & TIME</th>
                <th className="py-3 px-4">DURATION</th>
                <th className="py-3 px-4">FEE / AMOUNT</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {bookingsData?.data && bookingsData.data.length > 0 ? (
                bookingsData.data.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={b.seeker?.avatarUrl || undefined} />
                          <AvatarFallback className="bg-[#1f5c5c]/10 text-[#1f5c5c] font-bold text-xs">
                            {(b.seeker?.name || "Client").slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-900">{b.seeker?.name || "Seeker Client"}</p>
                          <p className="text-xs text-gray-400">{b.seeker?.email || b.reference}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-[#e6f4f1] text-[#1f5c5c] font-semibold text-xs border-none">
                        {b.modality}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 font-medium text-gray-700">
                      {new Date(b.scheduledAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-4 px-4 text-gray-600">{b.durationMinutes} mins</td>
                    <td className="py-4 px-4 font-bold text-gray-900">${b.amount}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" /> {b.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Button variant="ghost" size="sm" className="text-xs font-bold text-[#1f5c5c]">
                        Manage Session
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                    <p className="font-semibold text-gray-700">No appointments recorded yet</p>
                    <p className="text-xs text-gray-400 mt-1">New client sessions booked from your public directory profile will appear here.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
