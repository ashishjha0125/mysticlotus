import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/seeker-signup")({
  component: () => <Navigate to="/signup" replace />,
});
