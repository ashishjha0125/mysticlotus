import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Ban, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

import { PageHeader } from "@/components/admin/PageHeader";
import { LoadingState, ErrorState } from "@/components/admin/States";
import { BookingsService } from "@/services/bookings.service";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency, formatDateTime } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/bookings/$id")({
  component: BookingDetailPage,
});

function BookingDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [refundOpen, setRefundOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const query = useQuery({ queryKey: ["bookings", id], queryFn: () => BookingsService.get(id) });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["bookings"] });
  };

  const cancel = useMutation({
    mutationFn: (reason: string) => BookingsService.cancel(id, reason),
    onSuccess: () => { toast.success("Booking cancelled"); invalidate(); setCancelOpen(false); setCancelReason(""); },
    onError: () => toast.error("Failed to cancel"),
  });

  const refund = useMutation({
    mutationFn: () => BookingsService.refund(id),
    onSuccess: () => { toast.success("Refund issued"); invalidate(); setRefundOpen(false); },
    onError: () => toast.error("Failed to refund"),
  });

  if (query.isLoading) return <LoadingState />;
  if (query.isError) return <ErrorState error={query.error} onRetry={() => query.refetch()} />;
  const b = query.data!;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <button
          onClick={() => navigate({ to: "/bookings" })}
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to bookings
        </button>
        <PageHeader
          title={`Booking ${b.reference}`}
          description={`${b.modality} · ${formatDateTime(b.scheduledAt)}`}
          action={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setCancelOpen(true)}>
                <Ban className="mr-1.5 h-4 w-4" /> Cancel
              </Button>
              <Button variant="outline" size="sm" onClick={() => setRefundOpen(true)}>
                <RefreshCcw className="mr-1.5 h-4 w-4" /> Refund
              </Button>
            </div>
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="glass shadow-soft rounded-2xl p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Seeker</h3>
          <p className="mt-3 text-base font-semibold">{b.seeker.name}</p>
          <p className="text-sm text-muted-foreground">{b.seeker.email}</p>
        </Card>
        <Card className="glass shadow-soft rounded-2xl p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Healer</h3>
          <p className="mt-3 text-base font-semibold">{b.healer.name}</p>
          <p className="text-sm text-muted-foreground">{b.modality} · {b.durationMinutes} min</p>
        </Card>
        <Card className="glass shadow-soft rounded-2xl p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Amount</h3>
          <p className="mt-3 text-2xl font-semibold">{formatCurrency(b.amount, b.currency)}</p>
          <div className="mt-2 flex gap-2">
            <Badge variant="outline" className="capitalize">{b.status}</Badge>
            <Badge variant="outline" className="capitalize">{b.paymentStatus}</Badge>
          </div>
        </Card>
      </div>

      {b.notes && (
        <Card className="glass shadow-soft rounded-2xl p-6">
          <h3 className="text-base font-semibold">Notes</h3>
          <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{b.notes}</p>
        </Card>
      )}

      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Cancel booking</DialogTitle></DialogHeader>
          <Textarea rows={4} value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="Reason (optional)" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelOpen(false)}>Back</Button>
            <Button variant="destructive" disabled={cancel.isPending} onClick={() => cancel.mutate(cancelReason)}>Cancel booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={refundOpen} onOpenChange={setRefundOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Issue refund?</AlertDialogTitle>
            <AlertDialogDescription>
              This will refund {formatCurrency(b.amount, b.currency)} back to the seeker's original payment method.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => refund.mutate()}>Refund</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
