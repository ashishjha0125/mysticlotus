import { createFileRoute } from "@tanstack/react-router";
import { FileBarChart2 } from "lucide-react";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/_authenticated/reports")({
  component: () => (
    <ComingSoon
      title="Reports"
      description="Exportable business reports and audits."
      icon={<FileBarChart2 className="h-5 w-5" />}
    />
  ),
});
