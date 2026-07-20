import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Plus, MapPin, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/healer/events")({
  component: HealerEventsPage,
});

function HealerEventsPage() {
  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-8 text-[#1a1a1a]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-gray-900">
            Events & Workshops
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and host group meditations, training courses, and holistic workshops.
          </p>
        </div>
        <Button className="bg-[#1f5c5c] hover:bg-[#154646] text-white rounded-full px-6 font-semibold shadow-sm">
          <Plus className="h-4 w-4 mr-2" /> Create New Event
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 rounded-2xl shadow-sm border border-gray-100/80 bg-white flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between">
              <Badge className="bg-[#e6f4f1] text-[#1f5c5c] font-bold text-xs uppercase">Workshop</Badge>
              <span className="text-xs font-semibold text-emerald-600">Upcoming · 18 Registered</span>
            </div>
            <h3 className="font-display text-xl font-bold text-gray-900 mt-3">
              Chakra Balancing & Sound Bath Immersion
            </h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              A deep healing session using Tibetan singing bowls and guided pranic breathwork to align the 7 major chakras.
            </p>
          </div>
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-gray-600">
            <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-[#1f5c5c]" /> Aug 12, 2026</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-[#1f5c5c]" /> 2 Hours</span>
            <span className="font-bold text-gray-900">$45 / person</span>
          </div>
        </Card>

        <Card className="p-6 rounded-2xl shadow-sm border border-gray-100/80 bg-white flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between">
              <Badge className="bg-amber-50 text-amber-700 font-bold text-xs uppercase">Certification Course</Badge>
              <span className="text-xs font-semibold text-emerald-600">Registration Open · 8 Registered</span>
            </div>
            <h3 className="font-display text-xl font-bold text-gray-900 mt-3">
              Reiki Level I Practitioner Training
            </h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Comprehensive 2-day certification training including attunements, self-healing techniques, and hands-on practice.
            </p>
          </div>
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-gray-600">
            <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-[#1f5c5c]" /> Sep 05-06, 2026</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-[#1f5c5c]" /> 2 Days</span>
            <span className="font-bold text-gray-900">$250 / person</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
