import { createFileRoute, redirect } from "@tanstack/react-router";
import { requirePortalRoles } from "@/lib/permissions";

export const Route = createFileRoute("/_authenticated/portal/people")({
  beforeLoad: async () => {
    await requirePortalRoles(["admin", "headteacher"]);
    throw redirect({ to: "/portal/staff" });
  },
  component: () => null,
});
