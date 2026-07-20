import { Link, useLocation } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard,
  UserCheck,
  Users,
  Wallet,
  CalendarDays,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Overview", href: "/healer/dashboard", icon: LayoutDashboard },
  { name: "Healer Profile", href: "/healer/profile", icon: UserCheck },
  { name: "Bookings / Clients", href: "/healer/bookings", icon: Users },
  { name: "Earnings", href: "/healer/earnings", icon: Wallet },
  { name: "Events & Workshops", href: "/healer/events", icon: CalendarDays },
  { name: "Settings", href: "/healer/settings", icon: Settings },
];

export function HealerSidebar() {
  const { logout, admin } = useAuth();
  const location = useLocation();

  return (
    <div className="flex h-screen w-64 flex-col border-r border-border/60 bg-[#f2f5f3] text-[#1a1a1a] shadow-sm flex-shrink-0">
      {/* Logo */}
      <div className="flex h-20 items-center px-8 border-b border-border/40">
        <h1 className="font-display text-2xl font-bold tracking-tight text-[#1f5c5c]">
          HealConnect
        </h1>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.href ||
            (item.href !== "/healer/dashboard" && location.pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                isActive
                  ? "bg-[#1f5c5c] text-white shadow-md shadow-[#1f5c5c]/20"
                  : "text-gray-600 hover:bg-white/80 hover:text-[#1f5c5c] hover:shadow-sm"
              )}
            >
              <item.icon className={cn("h-4 w-4", isActive ? "text-white" : "text-gray-500")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Practitioner Mini Badge & Logout */}
      <div className="border-t border-border/40 p-4 space-y-3 bg-white/50">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="h-9 w-9 rounded-full bg-[#1f5c5c]/10 text-[#1f5c5c] flex items-center justify-center font-bold text-xs">
            {(admin?.name || "Healer").slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-gray-900">{admin?.name || "Practitioner"}</p>
            <p className="truncate text-[10px] uppercase tracking-wider font-semibold text-[#1f5c5c]">
              {admin?.role || "healer"}
            </p>
          </div>
        </div>
        <button
          onClick={() => logout()}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
