import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/_authenticated/settings")({
  component: () => (
    <ComingSoon
      title="Settings"
      description="Platform name, logo, payments, email, commission, booking rules."
      icon={<Settings className="h-5 w-5" />}
    />
  ),
});
