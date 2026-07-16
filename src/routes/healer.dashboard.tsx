import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { 
  TrendingUp, 
  Calendar, 
  CalendarCheck, 
  Video,
  Plus
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/healer/dashboard")({
  component: HealerDashboard,
});

const earningsData = [
  { name: "Week 1", amount: 1500 },
  { name: "Week 2", amount: 2300 },
  { name: "Week 3", amount: 3400 },
  { name: "Week 4", amount: 4250 },
];

function HealerDashboard() {
  const { admin } = useAuth();
  
  // Use admin name or fallback
  const healerName = admin?.name || "Dr. Silva";

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-[#1a1a1a]">
          Welcome back, {healerName}
        </h1>
        <p className="mt-2 text-[#666666]">
          Here's what's happening with your practice today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Earnings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium text-gray-600">Total Earnings</h3>
            <div className="bg-[#e6f4f1] p-2 rounded-full">
              <TrendingUp className="h-4 w-4 text-[#2c6e6e]" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-display text-3xl font-semibold text-gray-900">$4,250</p>
            <p className="text-xs text-[#2c6e6e] font-medium mt-1">+12% from last month</p>
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium text-gray-600">Upcoming Sessions</h3>
            <div className="bg-blue-50 p-2 rounded-full">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-display text-3xl font-semibold text-gray-900">8</p>
            <p className="text-xs text-gray-500 mt-1">Next session in 2 hours</p>
          </div>
        </div>

        {/* Active Events */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium text-gray-600">Active Events</h3>
            <div className="bg-orange-50 p-2 rounded-full">
              <CalendarCheck className="h-4 w-4 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-display text-3xl font-semibold text-gray-900">2</p>
            <p className="text-xs text-gray-500 mt-1">1 course, 1 workshop</p>
          </div>
        </div>
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Sessions List */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-semibold text-gray-900">Upcoming Sessions</h2>
            <button className="text-sm font-medium text-[#2c6e6e] hover:underline">View Schedule</button>
          </div>
          <div className="space-y-4">
            {/* Session 1 */}
            <div className="flex items-center justify-between p-4 bg-[#f6f6f6] rounded-xl">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-[#e3e1da] flex items-center justify-center font-semibold text-gray-700">
                  SJ
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Sarah Jenkins</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Reiki Healing • 60 min</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Today, 2:00 PM</p>
                <p className="text-xs text-[#2c6e6e] font-medium mt-0.5">Confirmed</p>
              </div>
            </div>

            {/* Session 2 */}
            <div className="flex items-center justify-between p-4 bg-[#f6f6f6] rounded-xl">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-[#526376] flex items-center justify-center font-semibold text-white">
                  MR
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Michael Reed</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Acupuncture • 45 min</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Today, 4:30 PM</p>
                <p className="text-xs text-[#2c6e6e] font-medium mt-0.5">Confirmed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Earnings Trend */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-display text-xl font-semibold text-gray-900 mb-6">Earnings Trend</h2>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={earningsData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar 
                  dataKey="amount" 
                  radius={[4, 4, 0, 0]}
                >
                  {
                    earningsData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === earningsData.length - 1 ? '#1f5c5c' : '#b2ded6'} 
                      />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Profile Section */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
        {/* Subtle gradient background for this card to match design */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#f0faf8] rounded-full blur-3xl opacity-50 -mr-20 -mt-20 pointer-events-none" />
        
        <h2 className="font-display text-xl font-semibold text-gray-900">Manage Profile</h2>
        <p className="text-sm text-gray-500 mt-1 mb-6">Keep your information up to date to attract more seekers.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea 
                className="w-full h-32 rounded-xl border border-gray-200 bg-[#f9f9fa] p-4 text-sm focus:border-[#2c6e6e] focus:outline-none focus:ring-1 focus:ring-[#2c6e6e] resize-none"
                placeholder="Tell seekers about your practice..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Modalities</label>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#e6f4f1] px-3 py-1 text-xs font-medium text-[#2c6e6e]">
                  Reiki
                  <button className="ml-1 text-[#2c6e6e] hover:text-[#1f5c5c]">×</button>
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#e6f4f1] px-3 py-1 text-xs font-medium text-[#2c6e6e]">
                  Acupuncture
                  <button className="ml-1 text-[#2c6e6e] hover:text-[#1f5c5c]">×</button>
                </span>
                <button className="inline-flex items-center gap-1 rounded-full border border-dashed border-gray-300 px-3 py-1 text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                  <Plus className="h-3 w-3" />
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col h-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">Intro Video</label>
            <div className="flex-1 rounded-xl border-2 border-dashed border-gray-200 bg-[#f9f9fa] flex flex-col items-center justify-center text-center p-6 hover:bg-gray-50 transition-colors cursor-pointer min-h-[160px]">
              <Video className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-600">Upload new video</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button className="bg-[#1f5c5c] text-white hover:bg-[#154646] rounded-full px-6 py-2">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
