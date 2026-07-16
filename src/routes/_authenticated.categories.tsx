import { createFileRoute } from "@tanstack/react-router";
import { Tags } from "lucide-react";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/_authenticated/categories")({
  component: () => (
    <ComingSoon
      title="Categories"
      description="Organize offerings into browseable categories."
      icon={<Tags className="h-5 w-5" />}
    />
  ),
});
