import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/_authenticated/reviews")({
  component: () => (
    <ComingSoon
      title="Reviews"
      description="Moderate reviews across healers and products."
      icon={<Star className="h-5 w-5" />}
    />
  ),
});
