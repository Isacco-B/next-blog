import React from "react";
import { Toaster } from "@/components/ui/toaster";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen min-w-full bg-background max-h-screen">
      <main className="flex w-full flex-grow h-full items-center justify-center p-4">
        {children}
        <Toaster />
      </main>
    </div>
  );
}
