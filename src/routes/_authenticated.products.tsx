import { createFileRoute } from "@tanstack/react-router";
import { Package } from "lucide-react";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/_authenticated/products")({
  component: () => (
    <ComingSoon
      title="Products"
      description="Wellness products, crystals, oils, books, tools."
      icon={<Package className="h-5 w-5" />}
    />
  ),
});
