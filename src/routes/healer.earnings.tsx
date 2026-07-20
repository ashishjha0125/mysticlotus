import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { HealersService } from "@/services/healers.service";
import { useAuth } from "@/lib/auth-context";
import { Wallet, DollarSign, ArrowUpRight, Download, Calendar, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/healer/earnings")({
  component: HealerEarningsPage,
});

function HealerEarningsPage() {
  const { admin } = useAuth();
  const { data: profile } = useQuery({
    queryKey: ["healers", admin?.id],
    queryFn: () => (admin?.id ? HealersService.get(admin.id) : null),
    enabled: !!admin?.id,
  });

  const totalEarnings = profile?.totalEarnings || 45200;

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-8 text-[#1a1a1a]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-gray-900">
            Earnings & Payouts
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor session revenue, payout statuses, and bank transfer history.
          </p>
        </div>
        <Button className="bg-[#1f5c5c] hover:bg-[#154646] text-white rounded-full px-6 font-semibold shadow-sm">
          <Download className="h-4 w-4 mr-2" /> Request Statement
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 rounded-2xl shadow-sm border border-gray-100/80 bg-white flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Available Balance</span>
            <div className="bg-[#e6f4f1] p-2.5 rounded-xl text-[#1f5c5c]">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-display text-3xl font-bold text-gray-900">${(totalEarnings * 0.25).toLocaleString()}</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1">Ready for next payout cycle</p>
          </div>
        </Card>

        <Card className="p-6 rounded-2xl shadow-sm border border-gray-100/80 bg-white flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total All-Time Earnings</span>
            <div className="bg-[#e6f4f1] p-2.5 rounded-xl text-[#1f5c5c]">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-display text-3xl font-bold text-gray-900">${totalEarnings.toLocaleString()}</p>
            <p className="text-xs text-gray-500 font-medium mt-1">Gross revenue from completed sessions</p>
          </div>
        </Card>

        <Card className="p-6 rounded-2xl shadow-sm border border-gray-100/80 bg-white flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Completed Sessions</span>
            <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-display text-3xl font-bold text-gray-900">{profile?.totalBookings || 342}</p>
            <p className="text-xs text-blue-600 font-semibold mt-1">100% verified appointments</p>
          </div>
        </Card>
      </div>

      <Card className="p-6 rounded-2xl shadow-sm border border-gray-100/80 bg-white">
        <h3 className="font-display text-lg font-bold text-gray-900 mb-4">Recent Payout Transactions</h3>
        <div className="divide-y divide-gray-100 text-sm">
          {[
            { id: "p1", date: "Jul 15, 2026", amount: "$1,450.00", status: "Paid to Bank Account (•••• 4291)" },
            { id: "p2", date: "Jul 01, 2026", amount: "$2,100.00", status: "Paid to Bank Account (•••• 4291)" },
            { id: "p3", date: "Jun 15, 2026", amount: "$1,890.00", status: "Paid to Bank Account (•••• 4291)" },
          ].map((tx) => (
            <div key={tx.id} className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{tx.amount}</p>
                  <p className="text-xs text-gray-400">{tx.status}</p>
                </div>
              </div>
              <span className="text-xs font-medium text-gray-500">{tx.date}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
