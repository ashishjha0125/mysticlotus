import { createFileRoute } from "@tanstack/react-router";
import { Gift } from "lucide-react";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/_authenticated/offers")({
  component: () => (
    <ComingSoon
      title="Offers"
      description="Coupons, promotions, and seasonal offers."
      icon={<Gift className="h-5 w-5" />}
    />
  ),
});
