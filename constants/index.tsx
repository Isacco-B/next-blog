import {
  Images,
  UsersRound,
  MessagesSquare,
  LayoutDashboard,
  NotebookText,
} from "lucide-react";


export const dashboardLinks = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "Posts",
    href: "/dashboard/posts",
    icon: (
      <NotebookText className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "Media",
    href: "/dashboard/media",
    icon: (
      <Images className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "Comments",
    href: "/dashboard/comments",
    icon: (
      <MessagesSquare className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "Users",
    href: "/dashboard/users",
    icon: (
      <UsersRound className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
];
