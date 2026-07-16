import { createFileRoute, Link, Outlet, useChildMatches } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CalendarCheck, Search } from "lucide-react";

import { PageHeader } from "@/components/admin/PageHeader";
import { LoadingState, ErrorState, EmptyState } from "@/components/admin/States";
import { BookingsService, type BookingStatus } from "@/services/bookings.service";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatDateTime } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/bookings")({
  component: BookingsPage,
});

const statusStyles: Record<BookingStatus, string> = {
  pending: "bg-warning/10 text-warning-foreground border-warning/30",
  confirmed: "bg-primary/10 text-primary border-primary/20",
  completed: "bg-success/10 text-success border-success/20",
  cancelled: "bg-muted text-muted-foreground border-border",
  refunded: "bg-destructive/10 text-destructive border-destructive/20",
};

function BookingsPage() {
  const childMatches = useChildMatches();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<BookingStatus | "all">("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  const query = useQuery({
    queryKey: ["bookings", { search, status, from, to, page }],
    queryFn: () =>
      BookingsService.list({
        search: search || undefined,
        status,
        from: from || undefined,
        to: to || undefined,
        page,
        limit,
      }),
    placeholderData: (prev) => prev,
  });

  if (childMatches.length > 0) {
    return <Outlet />;
  }

  const total = query.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Bookings"
        description="All healing sessions, workshops, and retreats booked on the platform."
      />

      <Card className="glass shadow-soft rounded-2xl p-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search reference, seeker or healer"
              value={search}
              onChange={(e) => { setPage(1); setSearch(e.target.value); }}
              className="pl-9"
            />
          </div>
          <Select value={status} onValueChange={(v) => { setPage(1); setStatus(v as BookingStatus | "all"); }}>
            <SelectTrigger className="w-full sm:w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
          <Input type="date" value={from} onChange={(e) => { setPage(1); setFrom(e.target.value); }} className="sm:w-[160px]" />
          <Input type="date" value={to} onChange={(e) => { setPage(1); setTo(e.target.value); }} className="sm:w-[160px]" />
        </div>
      </Card>

      <Card className="glass shadow-soft overflow-hidden rounded-2xl">
        {query.isLoading ? (
          <LoadingState />
        ) : query.isError ? (
          <ErrorState error={query.error} onRetry={() => query.refetch()} />
        ) : (query.data?.data ?? []).length === 0 ? (
          <EmptyState title="No bookings match" icon={<CalendarCheck className="h-5 w-5" />} />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Seeker</TableHead>
                  <TableHead>Healer</TableHead>
                  <TableHead>Modality</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {query.data!.data.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>
                      <Link
                        to="/bookings/$id"
                        params={{ id: b.id }}
                        className="font-mono text-xs font-medium hover:underline"
                      >
                        {b.reference}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{b.seeker.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{b.seeker.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{b.healer.name}</TableCell>
                    <TableCell><Badge variant="outline">{b.modality}</Badge></TableCell>
                    <TableCell className="text-sm">{formatDateTime(b.scheduledAt)}</TableCell>
                    <TableCell className="text-sm font-medium">
                      {formatCurrency(b.amount, b.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`capitalize ${statusStyles[b.status]}`}>
                        {b.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{b.paymentStatus}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between border-t border-border/70 px-4 py-3 text-sm text-muted-foreground">
              <span>Page {page} of {totalPages} · {total.toLocaleString()} bookings</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Button>
                <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
