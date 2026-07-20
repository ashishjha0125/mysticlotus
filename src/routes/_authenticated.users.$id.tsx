import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/admin/PageHeader";
import { LoadingState, ErrorState } from "@/components/admin/States";
import { UsersService, type User, type UserRole, ROLE_LABELS } from "@/services/users.service";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/users/$id")({
  component: UserDetailPage,
});

const ALL_ROLES: { id: UserRole; label: string }[] = [
  { id: "admin", label: "Admin - site admin" },
  { id: "seeker", label: "Seeker" },
  { id: "healer", label: "Healer" },
  { id: "coach", label: "Coach" },
  { id: "therapist", label: "Therapist / Counsellor / Psychiatrist / Psychologist" },
];

type FormValues = { name: string; email: string; phone?: string; role: User["role"]; roles: UserRole[]; status: User["status"] };

function UserDetailPage() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const navigate = useNavigate();

  const query = useQuery({ queryKey: ["users", id], queryFn: () => UsersService.get(id) });
  const form = useForm<FormValues>();

  useEffect(() => {
    if (query.data) {
      form.reset({
        name: query.data.name,
        email: query.data.email,
        phone: query.data.phone ?? "",
        role: query.data.role,
        roles: query.data.roles && query.data.roles.length > 0 ? query.data.roles : [query.data.role],
        status: query.data.status,
      });
    }
  }, [query.data, form]);

  const update = useMutation({
    mutationFn: (patch: FormValues) => UsersService.update(id, patch),
    onSuccess: () => {
      toast.success("User updated");
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => toast.error("Failed to update user"),
  });

  if (query.isLoading) return <LoadingState />;
  if (query.isError) return <ErrorState error={query.error} onRetry={() => query.refetch()} />;
  const u = query.data!;

  const currentRoles = form.watch("roles") || [form.watch("role") || "seeker"];
  const toggleRole = (r: UserRole) => {
    const prev = currentRoles;
    let updated: UserRole[];
    if (prev.includes(r)) {
      if (prev.length === 1) return;
      updated = prev.filter((item) => item !== r);
    } else {
      updated = [...prev, r];
    }
    form.setValue("roles", updated, { shouldDirty: true });
    form.setValue("role", updated[0], { shouldDirty: true });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <button
          onClick={() => navigate({ to: "/users" })}
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to users
        </button>
        <PageHeader title={u.name} description={u.email} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card className="glass shadow-soft rounded-2xl p-6 text-center">
          <Avatar className="mx-auto h-20 w-20">
            <AvatarImage src={u.avatarUrl ?? undefined} />
            <AvatarFallback className="bg-primary/10 text-primary text-lg">
              {u.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h3 className="mt-3 text-base font-semibold">{u.name}</h3>
          <p className="text-xs text-muted-foreground">{u.email}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {(u.roles && u.roles.length > 0 ? u.roles : [u.role]).map((r) => (
              <Badge key={r} variant="outline" className="text-xs font-medium">
                {ROLE_LABELS[r] ?? r}
              </Badge>
            ))}
            <Badge variant="outline" className="capitalize bg-muted/50">{u.status}</Badge>
          </div>
          <div className="mt-5 space-y-2 text-left text-xs text-muted-foreground">
            <div className="flex justify-between"><span>Phone</span><span className="text-foreground">{u.phone ?? "—"}</span></div>
            <div className="flex justify-between"><span>Joined</span><span className="text-foreground">{formatDate(u.createdAt)}</span></div>
            <div className="flex justify-between"><span>Last active</span><span className="text-foreground">{u.lastActiveAt ? formatDate(u.lastActiveAt) : "—"}</span></div>
          </div>
        </Card>

        <Card className="glass shadow-soft rounded-2xl p-6">
          <h3 className="text-base font-semibold">Edit profile</h3>
          <form
            className="mt-4 grid gap-4 sm:grid-cols-2"
            onSubmit={form.handleSubmit((v) => update.mutate(v))}
          >
            <div className="flex flex-col gap-1.5">
              <Label>Name</Label>
              <Input {...form.register("name", { required: true })} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Email</Label>
              <Input type="email" {...form.register("email", { required: true })} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Phone</Label>
              <Input {...form.register("phone")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Status</Label>
              <Select
                value={form.watch("status")}
                onValueChange={(v) => form.setValue("status", v as User["status"])}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2 flex flex-col gap-2">
              <Label>Assigned Roles (Select one or more)</Label>
              <div className="flex flex-wrap gap-2 border rounded-xl p-3 bg-muted/20">
                {ALL_ROLES.map((r) => {
                  const active = currentRoles.includes(r.id);
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => toggleRole(r.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        active
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-background border border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center text-[10px] ${active ? "border-primary-foreground bg-primary-foreground text-primary font-bold" : "border-muted-foreground"}`}>
                        {active ? "✓" : ""}
                      </span>
                      {r.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="sm:col-span-2 flex justify-end">
              <Button type="submit" disabled={update.isPending}>
                <Save className="mr-2 h-4 w-4" />
                {update.isPending ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      <div className="text-center">
        <Link to="/bookings" className="text-xs text-muted-foreground hover:text-foreground">
          View this user's bookings →
        </Link>
      </div>
    </div>
  );
}
