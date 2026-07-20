import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/seeker-login")({
  component: () => <Navigate to="/login" replace />,
});
