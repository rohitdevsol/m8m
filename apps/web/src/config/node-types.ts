export const NodeType = {
  INITIAL: "INITIAL",
  MANUAL_TRIGGER: "MANUAL_TRIGGER",
  HTTP_REQUEST: "HTTP_REQUEST",
} as const;

export type NodeType = (typeof NodeType)[keyof typeof NodeType];
