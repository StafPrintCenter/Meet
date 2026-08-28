import * as React from "react";
import { PageHeader, PageFooter } from "@/components/site";
import { cn } from "@/lib/utils";

interface MeetShellProps {
  children: React.ReactNode;
  headerContent?: React.ReactNode;
  className?: string;
  mainClassName?: string;
}

export function MeetShell({
  children,
  headerContent,
  className,
  mainClassName,
}: MeetShellProps) {
  return (
    <div className={cn("flex min-h-screen flex-col bg-background font-sans text-foreground", className)}>
      <PageHeader>{headerContent}</PageHeader>

      <main className={cn("relative flex-1", mainClassName)}>
        {children}
      </main>

      <PageFooter />
    </div>
  );
}