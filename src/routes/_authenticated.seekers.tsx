import { createFileRoute } from "@tanstack/react-router";
import { UserRound } from "lucide-react";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/_authenticated/seekers")({
  component: () => (
    <ComingSoon
      title="Seekers"
      description="People booking healing sessions and experiences."
      icon={<UserRound className="h-5 w-5" />}
    />
  ),
});
