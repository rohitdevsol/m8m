"use client";

import { createId } from "@paralleldrive/cuid2";
import { useReactFlow } from "@xyflow/react";
import { GlobeIcon, MousePointerIcon } from "lucide-react";
import { useCallback } from "react";

import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NodeType } from "@/config/node-types";
import { Separator } from "@/components/ui/separator";

export type NodeTypeOption = {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }> | string; //component or image
};

const triggerNodes: NodeTypeOption[] = [
  {
    type: NodeType.MANUAL_TRIGGER,
    label: "Trigger manual",
    description:
      "Runs the flow on clicking a button. Good for getting started quickly",
    icon: MousePointerIcon,
  },
  {
    type: NodeType.GOOGLE_FORM_TRIGGER,
    label: "Google Form",
    description: "Runs the flow when a Google Form is submitted",
    icon: "/googleform.svg",
  },
  {
    type: NodeType.STRIPE_TRIGGER,
    label: "Stripe",
    description: "Runs the flow when a Stripe event is captured",
    icon: "/stripe.svg",
  },
];

const executionNodes: NodeTypeOption[] = [
  {
    type: NodeType.HTTP_REQUEST,
    label: "HTTP Request",
    description: "Makes an HTTP request",
    icon: GlobeIcon,
  },
  {
    type: NodeType.GEMINI,
    label: "Gemini",
    description: "Uses Google Gemini to generate text",
    icon: "/gemini-color.svg",
  },
  {
    type: NodeType.OPENAI,
    label: "OpenAI",
    description: "Uses OpenAI to generate text",
    icon: "/openai.svg",
  },
  {
    type: NodeType.DISCORD,
    label: "Discord",
    description: "Sends a message to a Discord channel",
    icon: "/discord.svg",
  },
  // {
  //   type: NodeType.SLACK,
  //   label: "Slack",
  //   description: "Sends a message to a Slack channel",
  //   icon: "/slack.svg",
  // },
];

interface NodeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function NodeSelector({
  open,
  onOpenChange,
  children,
}: NodeSelectorProps) {
  //get current state of the editor
  const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();

  const handleNodeSelect = useCallback(
    (selection: NodeTypeOption) => {
      if (selection.type === NodeType.MANUAL_TRIGGER) {
        //check if no other manual trigger is there
        const nodes = getNodes();
        const hasManualTrigger = nodes.some(
          (node) => node.type === NodeType.MANUAL_TRIGGER,
        );
        if (hasManualTrigger) {
          toast.error("Only one manual trigger allowed per workflow");
          return;
        }
      }

      setNodes((nodes) => {
        const hasInitialTrigger = nodes.some(
          (node) => node.type === NodeType.INITIAL,
        );

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        // need to place node wherever I am on screen right now
        const flowPosition = screenToFlowPosition({
          x: centerX + (Math.random() - 0.5) * 200,
          y: centerY + (Math.random() - 0.5) * 200,
        });

        const newNode = {
          id: createId(),
          data: {},
          type: selection.type,
          position: flowPosition,
        };

        if (hasInitialTrigger) {
          return [newNode];
        }

        return [...nodes, newNode];
      });
      onOpenChange(false);
    },
    [setNodes, getNodes, onOpenChange, screenToFlowPosition],
  );
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>What triggers this workflow?</SheetTitle>
          <SheetDescription>
            A trigger is a step that starts your workflow.
          </SheetDescription>
        </SheetHeader>
        <div>
          {triggerNodes.map((nodeType) => {
            const Icon = nodeType.icon;

            return (
              <div
                key={nodeType.type}
                className="w-full justify-start h-auto py-5 px-4 rounded-none
                 cursor-pointer border-l-2 border-transparent hover:border-l-primary
                 hover:bg-primary/10"
                onClick={() => handleNodeSelect(nodeType)}
              >
                <div className="flex items-center gap-6 w-full overflow-hidden">
                  {typeof Icon === "string" ? (
                    <img
                      src={Icon}
                      alt={nodeType.label}
                      className="size-5 object-contain rounded-sm"
                    />
                  ) : (
                    <Icon className="size-5" />
                  )}

                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium text-sm">
                      {nodeType.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {nodeType.description}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Separator />
        {/* Execution nodes */}

        <div>
          {executionNodes.map((nodeType) => {
            const Icon = nodeType.icon;

            return (
              <div
                key={nodeType.type}
                className="w-full justify-start h-auto py-5 px-4 rounded-none
                 cursor-pointer border-l-2 border-transparent hover:border-l-primary
                 hover:bg-primary/10"
                onClick={() => handleNodeSelect(nodeType)}
              >
                <div className="flex items-center gap-6 w-full overflow-hidden">
                  {typeof Icon === "string" ? (
                    <img
                      src={Icon}
                      alt={nodeType.label}
                      className="size-5 object-contain rounded-sm"
                    />
                  ) : (
                    <Icon className="size-5" />
                  )}

                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium text-sm">
                      {nodeType.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {nodeType.description}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
