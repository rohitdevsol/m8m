import { InitialNode } from "@/components/initial-node";
import { NodeType } from "@/config/node-types";
import { GeminiNode } from "@/features/nodes/actions/gemini/node";
import { HttpRequestNode } from "@/features/nodes/actions/http-request/node";
import { OpenAINode } from "@/features/nodes/actions/openai/node";
import { DiscordNode } from "@/features/nodes/messaging/components/discord/node";
import { SlackNode } from "@/features/nodes/messaging/components/slack/node";
import { TelegramNode } from "@/features/nodes/messaging/components/telegram/node";
import { GoogleFormTriggerNode } from "@/features/nodes/triggers/components/google-form-trigger/node";
import { ManualTriggerNode } from "@/features/nodes/triggers/components/manual-trigger/node";
import { StripeTriggerNode } from "@/features/nodes/triggers/components/stripe-trigger/node";

import { NodeTypes } from "@xyflow/react";

/**
 * I am not importing the NodeType from @repo/database here because
 * I don't want to import it in the client.
 * This is a workaround for now.
 * (I am facing weird errors related to fs when importing from. @repo/database
 * as we will import the nodeComponents in editor.tsx (which is a client component))
 */

export const nodeComponents: NodeTypes = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
  [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTriggerNode,
  [NodeType.STRIPE_TRIGGER]: StripeTriggerNode,
  [NodeType.GEMINI]: GeminiNode,
  [NodeType.OPENAI]: OpenAINode,
  [NodeType.DISCORD]: DiscordNode,
  [NodeType.SLACK]: SlackNode,
  [NodeType.TELEGRAM]: TelegramNode,
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;
