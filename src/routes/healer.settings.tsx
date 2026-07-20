import { createFileRoute } from "@tanstack/react-router";
import { Shield, Bell, Lock, Key, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/healer/settings")({
  component: HealerSettingsPage,
});

function HealerSettingsPage() {
  return (
    <div className="p-8 lg:p-10 max-w-5xl mx-auto space-y-8 text-[#1a1a1a]">
      <div className="border-b border-gray-100 pb-6">
        <h1 className="font-display text-3xl font-bold tracking-tight text-gray-900">
          Account & Security Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your login credentials, email notifications, and practice preferences.
        </p>
      </div>

      <div className="space-y-6">
        <Card className="p-6 rounded-2xl shadow-sm border border-gray-100/80 bg-white space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Lock className="h-5 w-5 text-[#1f5c5c]" />
            <h3 className="font-display text-lg font-bold text-gray-900">Change Password</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 max-w-2xl">
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-bold text-gray-700">Current Password</Label>
              <Input type="password" placeholder="••••••••••••" className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-gray-700">New Password</Label>
              <Input type="password" placeholder="••••••••••••" className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-gray-700">Confirm New Password</Label>
              <Input type="password" placeholder="••••••••••••" className="rounded-xl" />
            </div>
            <div className="pt-2 sm:col-span-2">
              <Button
                onClick={() => toast.success("Password updated securely")}
                className="bg-[#1f5c5c] hover:bg-[#154646] text-white rounded-full px-6 font-semibold"
              >
                Update Password
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-2xl shadow-sm border border-gray-100/80 bg-white space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Bell className="h-5 w-5 text-[#1f5c5c]" />
            <h3 className="font-display text-lg font-bold text-gray-900">Notification Preferences</h3>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-sm font-medium text-gray-800 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-[#1f5c5c] focus:ring-[#1f5c5c] h-4 w-4" />
              <span>Email me immediately when a new seeker books a session</span>
            </label>
            <label className="flex items-center gap-3 text-sm font-medium text-gray-800 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-[#1f5c5c] focus:ring-[#1f5c5c] h-4 w-4" />
              <span>Send SMS / WhatsApp reminders 2 hours prior to upcoming sessions</span>
            </label>
            <label className="flex items-center gap-3 text-sm font-medium text-gray-800 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-[#1f5c5c] focus:ring-[#1f5c5c] h-4 w-4" />
              <span>Receive weekly earnings statements and platform update newsletters</span>
            </label>
          </div>
        </Card>
      </div>
    </div>
  );
}
