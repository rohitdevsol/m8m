export const NodeType = {
  INITIAL: "INITIAL",
} as const;

export type NodeType = (typeof NodeType)[keyof typeof NodeType];
