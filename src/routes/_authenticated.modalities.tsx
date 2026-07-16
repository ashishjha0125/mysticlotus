import { createFileRoute } from "@tanstack/react-router";
import { Flame } from "lucide-react";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/_authenticated/modalities")({
  component: () => (
    <ComingSoon
      title="Modalities"
      description="Reiki, Breathwork, Meditation, Sound Healing, and more."
      icon={<Flame className="h-5 w-5" />}
    />
  ),
});
