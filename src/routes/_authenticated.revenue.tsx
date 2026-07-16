import { createFileRoute } from "@tanstack/react-router";
import { DollarSign } from "lucide-react";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/_authenticated/revenue")({
  component: () => (
    <ComingSoon
      title="Revenue"
      description="Daily, monthly, annual revenue plus commission."
      icon={<DollarSign className="h-5 w-5" />}
    />
  ),
});
