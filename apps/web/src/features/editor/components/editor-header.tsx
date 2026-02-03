"use client";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SaveIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbEllipsis,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  useSuspenseWorkflow,
  useUpdateWorkflow,
  useUpdateWorkflowName,
} from "@/features/workflows/hooks/use-workflows";
import { useAtomValue } from "jotai";
import { editorAtom } from "../store/atoms";

export const EditorSaveButton = ({ workflowId }: { workflowId: string }) => {
  const editor = useAtomValue(editorAtom);

  const saveWorkflow = useUpdateWorkflow();

  const handleSave = () => {
    if (!editor) {
      return;
    }
    const nodes = editor.getNodes();
    const edges = editor.getEdges();
    saveWorkflow.mutate({ id: workflowId, nodes, edges });
  };
  return (
    <div className="ml-auto">
      <Button
        size={"sm"}
        onClick={handleSave}
        disabled={saveWorkflow.isPending}
      >
        <SaveIcon className="size-4" />
        Save
      </Button>
    </div>
  );
};

export const EditorNameInput = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow } = useSuspenseWorkflow(workflowId);
  const updateWorkflow = useUpdateWorkflowName();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(workflow.name);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (workflow.name) {
      setName(workflow.name);
    }
  }, [workflow.name]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (name === workflow.name || name === "") {
      setName(workflow.name);
      setIsEditing(false);
      return;
    }

    try {
      await updateWorkflow.mutate({ id: workflow.id, name });
    } catch (error) {
      setName(workflow.name); //reset the name
    } finally {
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setName(workflow.name);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      //   <BreadcrumbItem className="cursor-pointer hover:text-foreground transition-colors">
      <Input
        disabled={updateWorkflow.isPending}
        ref={inputRef}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="h-7 w-auto min-w-25 px-2"
      />
      //   </BreadcrumbItem>
    );
  }
  return (
    <BreadcrumbItem
      onClick={() => setIsEditing(true)}
      className="cursor-pointer hover:text-foreground transition-colors"
    >
      {name || ""}
    </BreadcrumbItem>
  );
};
export const EditorBreadcrumbs = ({ workflowId }: { workflowId: string }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/workflows" prefetch>
              Workflows
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <EditorNameInput workflowId={workflowId} />
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export function EditorHeader({ workflowId }: { workflowId: string }) {
  return (
    <header className="flex items-center h-14 shrink-0  gap-2 border-b  bg-background px-4">
      <SidebarTrigger />
      <EditorBreadcrumbs workflowId={workflowId} />
      <EditorSaveButton workflowId={workflowId} />

      <ModeToggle />
    </header>
  );
}
