"use client";
import { ModeToggle } from "@/components/mode-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import Link from "next/link";
import { useSuspenseExecution } from "../hooks/use-executions";

export const ExecutionBreadCrumbs = ({
  executionId,
}: {
  executionId: string;
}) => {
  const { data: execution } = useSuspenseExecution(executionId);
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/executions" prefetch>
              Executions
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem className="cursor-pointer hover:text-foreground transition-colors">
          {execution.workflow.name || ""}
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export function ExecutionHeader({ executionId }: { executionId: string }) {
  return (
    <header className="flex items-center justify-between h-14 shrink-0  gap-2 border-b  bg-background px-4">
      <div className="flex gap-3 items-center">
        <SidebarTrigger />
        <ExecutionBreadCrumbs executionId={executionId} />
      </div>
      <ModeToggle />
    </header>
  );
}
