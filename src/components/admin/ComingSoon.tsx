import { type ReactNode } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/States";
import { Sparkles } from "lucide-react";

export function ComingSoon({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={title} description={description} />
      <EmptyState
        icon={icon ?? <Sparkles className="h-5 w-5" />}
        title="Coming in the next phase"
        description="This module is wired into navigation and ready to be built out. It will connect to your Express API using the same axios service layer as Users, Healers, and Bookings."
      />
    </div>
  );
}
