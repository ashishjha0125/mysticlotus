import { createFileRoute, Link, Outlet, useChildMatches, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, MoreHorizontal, Pause, Search, ShieldCheck, Sparkles, UserPlus, XCircle } from "lucide-react";

import { PageHeader } from "@/components/admin/PageHeader";
import { LoadingState, ErrorState, EmptyState } from "@/components/admin/States";
import { HealersService, type HealerStatus } from "@/services/healers.service";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDate, formatNumber } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/healers")({
  component: HealersPage,
});

const statusStyles: Record<HealerStatus, string> = {
  approved: "bg-success/10 text-success border-success/20",
  pending: "bg-warning/10 text-warning-foreground border-warning/30",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
  suspended: "bg-muted text-muted-foreground border-border",
};

function AddHealerDialog() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [primaryModality, setPrimaryModality] = useState("Pranic Healing");

  const createMutation = useMutation({
    mutationFn: () =>
      HealersService.create({
        name,
        email,
        phone: phone || undefined,
        primaryModality: primaryModality || "Pranic Healing",
      }),
    onSuccess: (newHealer) => {
      toast.success("Healer created successfully");
      qc.invalidateQueries({ queryKey: ["healers"] });
      setOpen(false);
      setName("");
      setEmail("");
      setPhone("");
      setPrimaryModality("Pranic Healing");
      navigate({ to: "/healers/$id", params: { id: newHealer.id } });
    },
    onError: (err: any) => toast.error(err?.message || "Failed to create healer"),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
          <UserPlus className="mr-1.5 h-4 w-4" />
          Add Healer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Healer</DialogTitle>
          <DialogDescription>
            Create a basic healer profile. You will be redirected to the full moderation profile form to add rich details immediately after creation.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim() || !email.trim()) return;
            createMutation.mutate();
          }}
          className="flex flex-col gap-4 py-2"
        >
          <div className="flex flex-col gap-1.5">
            <Label>Full Name *</Label>
            <Input required placeholder="e.g. Maya Lin" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Email *</Label>
            <Input required type="email" placeholder="e.g. maya@healing.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Phone</Label>
            <Input placeholder="e.g. +1 555 019 2834" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Primary Modality</Label>
            <Input placeholder="e.g. Pranic Healing, Sound Therapy" value={primaryModality} onChange={(e) => setPrimaryModality(e.target.value)} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createMutation.isPending || !name.trim() || !email.trim()}>
              {createMutation.isPending ? "Creating..." : "Create & Add Details"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function HealersPage() {
  const childMatches = useChildMatches();
  const qc = useQueryClient();
  const [tab, setTab] = useState<HealerStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const query = useQuery({
    queryKey: ["healers", { status: tab, search, page, limit }],
    queryFn: () =>
      HealersService.list({
        status: tab,
        search: search || undefined,
        page,
        limit,
      }),
    placeholderData: (prev) => prev,
  });

  const approve = useMutation({
    mutationFn: (id: string) => HealersService.approve(id),
    onSuccess: () => {
      toast.success("Healer approved");
      qc.invalidateQueries({ queryKey: ["healers"] });
    },
    onError: () => toast.error("Failed to approve"),
  });

  const verify = useMutation({
    mutationFn: (id: string) => HealersService.verifyDocuments(id),
    onSuccess: () => {
      toast.success("Documents marked verified");
      qc.invalidateQueries({ queryKey: ["healers"] });
    },
    onError: () => toast.error("Failed to verify documents"),
  });

  const suspend = useMutation({
    mutationFn: (id: string) => HealersService.suspend(id),
    onSuccess: () => {
      toast.success("Healer suspended");
      qc.invalidateQueries({ queryKey: ["healers"] });
    },
    onError: () => toast.error("Failed to suspend"),
  });

  const reject = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      HealersService.reject(id, reason),
    onSuccess: () => {
      toast.success("Application rejected");
      qc.invalidateQueries({ queryKey: ["healers"] });
      setRejectId(null);
      setRejectReason("");
    },
    onError: () => toast.error("Failed to reject"),
  });

  if (childMatches.length > 0) {
    return <Outlet />;
  }

  const total = query.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Healers"
        description="Approve applications, verify documents, and manage practitioners."
        action={<AddHealerDialog />}
      />

      <Card className="glass shadow-soft rounded-2xl p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Tabs value={tab} onValueChange={(v) => { setPage(1); setTab(v as HealerStatus | "all"); }}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="suspended">Suspended</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search healers"
              value={search}
              onChange={(e) => { setPage(1); setSearch(e.target.value); }}
              className="pl-9"
            />
          </div>
        </div>
      </Card>

      <Card className="glass shadow-soft overflow-hidden rounded-2xl">
        {query.isLoading ? (
          <LoadingState />
        ) : query.isError ? (
          <ErrorState error={query.error} onRetry={() => query.refetch()} />
        ) : (query.data?.data ?? []).length === 0 ? (
          <EmptyState
            title="No healers found"
            description="No healers match these filters yet."
            icon={<Sparkles className="h-5 w-5" />}
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[84px]">Main Photo</TableHead>
                  <TableHead>Healer</TableHead>
                  <TableHead>Modalities</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Docs</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {query.data!.data.map((h) => (
                  <TableRow key={h.id}>
                    <TableCell>
                      {h.mainPhotoUrl || h.avatarUrl ? (
                        <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-border/80 bg-muted/30 shadow-sm transition-transform hover:scale-110">
                          <img
                            src={h.mainPhotoUrl || h.avatarUrl || ""}
                            alt={h.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/60 bg-primary/10 text-primary font-semibold text-xs">
                          {h.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="min-w-0">
                        <Link
                          to="/healers/$id"
                          params={{ id: h.id }}
                          className="block truncate text-sm font-semibold hover:underline text-foreground"
                        >
                          {h.name}
                        </Link>
                        <p className="truncate text-xs text-muted-foreground">{h.email}</p>
                        {h.phone && <p className="truncate text-[11px] text-muted-foreground mt-0.5">{h.phone}</p>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {(h.modalities ?? []).slice(0, 2).map((m) => (
                          <Badge key={m} variant="outline" className="text-[10px]">{m}</Badge>
                        ))}
                        {(h.modalities?.length ?? 0) > 2 && (
                          <Badge variant="outline" className="text-[10px]">
                            +{(h.modalities?.length ?? 0) - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`capitalize ${statusStyles[h.status]}`}>
                        {h.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {h.documentsVerified ? (
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">{formatNumber(h.totalBookings ?? 0)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(h.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                          <DropdownMenuItem asChild>
                            <Link to="/healers/$id" params={{ id: h.id }}>View / Edit Profile</Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onSelect={() => approve.mutate(h.id)}>
                            <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => verify.mutate(h.id)}>
                            <ShieldCheck className="mr-2 h-4 w-4" /> Verify documents
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => suspend.mutate(h.id)}>
                            <Pause className="mr-2 h-4 w-4" /> Suspend
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onSelect={() => setRejectId(h.id)}
                          >
                            <XCircle className="mr-2 h-4 w-4" /> Reject application
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between border-t border-border/70 px-4 py-3 text-sm text-muted-foreground">
              <span>Page {page} of {totalPages} · {total.toLocaleString()} healers</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Button>
                <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
              </div>
            </div>
          </>
        )}
      </Card>

      <Dialog open={!!rejectId} onOpenChange={(v) => !v && setRejectId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject healer application</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Reason (shared with the healer)</label>
            <Textarea
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Documentation could not be verified…"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectId(null)}>Cancel</Button>
            <Button
              variant="destructive"
              disabled={!rejectReason.trim() || reject.isPending}
              onClick={() => rejectId && reject.mutate({ id: rejectId, reason: rejectReason.trim() })}
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
