"use client";

import { UserRole } from "@prisma/client";
import { FormError } from "./form-error";
import { useCurrentRole } from "@/hooks/use-current-role";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles: UserRole;
}

export function RoleGate({ children, allowedRoles }: RoleGateProps) {
  const role = useCurrentRole();

  if (!allowedRoles.includes(role as UserRole)) {
    return (
      <FormError message="You do not have permission to view this content!" />
    );
  }

  return <>{children}</>;
}
