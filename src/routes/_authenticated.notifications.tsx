import { createFileRoute } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/_authenticated/notifications")({
  component: () => (
    <ComingSoon
      title="Notifications"
      description="Email, in-app, and push notification center."
      icon={<Bell className="h-5 w-5" />}
    />
  ),
});
