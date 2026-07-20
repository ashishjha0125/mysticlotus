import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/healer-signup")({
  component: () => <Navigate to="/signup" replace />,
});
