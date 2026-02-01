// src/config/node-components.ts
import { InitialNode } from "@/components/initial-node";
import { NodeType } from "@/config/node-types";
import { NodeTypes } from "@xyflow/react";

/**
 * I am not importing the NodeType from @repo/database here because
 * I don't want to import it in the client.
 * This is a workaround for now.
 * (I am facing weird errors related to fs when importing from. @repo/database
 * as we will import the nodeComponents in editor.tsx (which is a client component))
 */

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;
