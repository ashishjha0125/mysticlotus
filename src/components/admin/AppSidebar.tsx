import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Sparkles,
  UserRound,
  CalendarCheck,
  CalendarDays,
  Package,
  Tags,
  Flame,
  Gift,
  Star,
  DollarSign,
  Bell,
  FileBarChart2,
  Settings,
  UserCog,
  LogOut,
  Leaf,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth-context";
import { useNavigate } from "@tanstack/react-router";

const overview = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
];

const community = [
  { title: "Users", url: "/users", icon: Users },
  { title: "Healers", url: "/healers", icon: Sparkles },
  { title: "Seekers", url: "/seekers", icon: UserRound },
];

const commerce = [
  { title: "Bookings", url: "/bookings", icon: CalendarCheck },
  { title: "Events", url: "/events", icon: CalendarDays },
  { title: "Products", url: "/products", icon: Package },
  { title: "Categories", url: "/categories", icon: Tags },
  { title: "Modalities", url: "/modalities", icon: Flame },
  { title: "Offers", url: "/offers", icon: Gift },
  { title: "Reviews", url: "/reviews", icon: Star },
];

const insights = [
  { title: "Revenue", url: "/revenue", icon: DollarSign },
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Reports", url: "/reports", icon: FileBarChart2 },
];

const system = [
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Profile", url: "/profile", icon: UserCog },
];

function Group({
  label,
  items,
  currentPath,
}: {
  label: string;
  items: { title: string; url: string; icon: React.ComponentType<{ className?: string }> }[];
  currentPath: string;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[0.7rem] tracking-wider uppercase text-muted-foreground/70">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const active = currentPath === item.url || currentPath.startsWith(item.url + "/");
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                  <Link
                    to={item.url}
                    className="flex items-center gap-3 rounded-md"
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const currentPath = useRouterState({ select: (r) => r.location.pathname });
  const { logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate({ to: "/login", replace: true });
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="px-3 py-4">
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft">
            <Leaf className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="truncate font-display text-[1.05rem] font-semibold">
                Mystic Lotus
              </span>
              <span className="truncate text-[0.7rem] text-muted-foreground">
                & Dragonflies · Admin
              </span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-1">
        <Group label="Overview" items={overview} currentPath={currentPath} />
        <Group label="Community" items={community} currentPath={currentPath} />
        <Group label="Marketplace" items={commerce} currentPath={currentPath} />
        <Group label="Insights" items={insights} currentPath={currentPath} />
        <Group label="System" items={system} currentPath={currentPath} />
      </SidebarContent>

      <SidebarFooter className="px-2 pb-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={onLogout} tooltip="Log out">
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
