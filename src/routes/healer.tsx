import { createFileRoute, Navigate, Outlet, useRouter } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { HealerSidebar } from "@/components/healer/HealerSidebar";
import { Loader2 } from "lucide-react";
import { hasPractitionerRole } from "@/services/users.service";
import { useQuery } from "@tanstack/react-query";
import { HealersService } from "@/services/healers.service";

export const Route = createFileRoute("/healer")({
  component: HealerLayout,
});

function HealerLayout() {
  const { admin, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  
  const healerQ = useQuery({
    queryKey: ["healers", admin?.id],
    queryFn: () => HealersService.get(admin!.id),
    enabled: !!admin?.id && hasPractitionerRole(admin?.roles || admin?.role),
  });

  if (loading || (healerQ.isLoading && healerQ.fetchStatus !== "idle")) {
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

  // Onboarding enforcement
  const isCurrentlyOnboarding = router.state.location.pathname.includes("/healer/onboarding");
  const isOnboarded = healerQ.data && !!healerQ.data.bio;

  if (!isOnboarded && !isCurrentlyOnboarding) {
    return <Navigate to="/healer/onboarding" replace />;
  }
  
  // If they are on the onboarding page but already onboarded, send them to dashboard
  if (isOnboarded && isCurrentlyOnboarding) {
    return <Navigate to="/healer/dashboard" replace />;
  }

  // Hide sidebar on the onboarding page
  const showSidebar = !isCurrentlyOnboarding;

  return (
    <div className="flex min-h-screen w-full bg-[#f9f9fa]">
      {showSidebar && <HealerSidebar />}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
