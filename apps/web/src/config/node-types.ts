export const NodeType = {
  INITIAL: "INITIAL",
  MANUAL_TRIGGER: "MANUAL_TRIGGER",
  HTTP_REQUEST: "HTTP_REQUEST",
} as const;

export const CredentialType = {
  OPEN_API: "OPEN_API",
  GEMINI: "GEMINI",
  ANTHROPIC: "ANTHROPIC",
};

export type NodeType = (typeof NodeType)[keyof typeof NodeType];
export type CredentialType =
  (typeof CredentialType)[keyof typeof CredentialType];
