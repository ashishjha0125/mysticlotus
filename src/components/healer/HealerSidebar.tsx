import { Link, useLocation } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard,
  User,
  Calendar,
  Wallet,
  CalendarDays,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/healer/dashboard", icon: LayoutDashboard },
  { name: "My Profile", href: "/healer/dashboard", icon: User },
  { name: "My Schedule", href: "/healer/dashboard", icon: Calendar },
  { name: "Earnings", href: "/healer/dashboard", icon: Wallet },
  { name: "Events/Courses", href: "/healer/dashboard", icon: CalendarDays },
];

export function HealerSidebar() {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <div className="flex h-screen w-64 flex-col border-r border-border/50 bg-[#fbfbfb]">
      {/* Logo */}
      <div className="flex h-20 items-center px-8">
        <h1 className="font-display text-xl font-bold text-[#1f5c5c]">
          HealConnect
        </h1>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href || (location.pathname.startsWith(item.href) && item.href !== '/healer');
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#347676] text-white shadow-sm"
                  : "text-muted-foreground hover:bg-[#347676]/10 hover:text-[#347676]"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Footer (Sign Out) */}
      <div className="border-t border-border/50 p-4">
        <button
          onClick={() => logout()}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
