import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/_authenticated/events")({
  component: () => (
    <ComingSoon
      title="Events"
      description="Workshops, retreats, and healing events."
      icon={<CalendarDays className="h-5 w-5" />}
    />
  ),
});
