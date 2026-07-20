import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { HealerSidebar } from "@/components/healer/HealerSidebar";
import { Loader2 } from "lucide-react";
import { hasPractitionerRole } from "@/services/users.service";

export const Route = createFileRoute("/healer")({
  component: HealerLayout,
});

function HealerLayout() {
  const { admin, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f9f9fa] text-muted-foreground">
        <div className="flex items-center gap-2 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isPractitionerOrAdmin =
    admin?.role === "admin" ||
    hasPractitionerRole(admin?.roles || admin?.role);

  if (!isPractitionerOrAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen w-full bg-[#f9f9fa]">
      <HealerSidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
