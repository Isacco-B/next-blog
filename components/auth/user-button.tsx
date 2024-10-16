"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutButton } from "./logout-button";
import { ExitIcon } from "@radix-ui/react-icons";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Settings } from "lucide-react";

export function UserButton() {
  const user = useCurrentUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Settings className="w-6 h-6" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="flex flex-col space-y-2 p-4 w-[300px]"
        align="end"
      >
        <h2 className="text-xl font-semibold">Hi {user?.name}</h2>
        <p className="text-normal text-muted-foreground">{user?.email}</p>
        <hr />
        <LogoutButton>
          <DropdownMenuItem className="flex items-center rounded-md hover:bg-slate-100">
            <ExitIcon className="w-4 h-4 mr-4" />
            Sign out
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
