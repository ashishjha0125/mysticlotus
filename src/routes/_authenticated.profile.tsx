import { createFileRoute } from "@tanstack/react-router";
import { UserCog } from "lucide-react";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/_authenticated/profile")({
  component: () => (
    <ComingSoon
      title="Profile"
      description="Your admin profile and preferences."
      icon={<UserCog className="h-5 w-5" />}
    />
  ),
});
