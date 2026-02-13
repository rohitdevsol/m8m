export const NodeType = {
  INITIAL: "INITIAL",
  MANUAL_TRIGGER: "MANUAL_TRIGGER",
  HTTP_REQUEST: "HTTP_REQUEST",
  GOOGLE_FORM_TRIGGER: "GOOGLE_FORM_TRIGGER",
  STRIPE_TRIGGER: "STRIPE_TRIGGER",
  GEMINI: "GEMINI",
  OPENAI: "OPENAI",
  ANTHROPIC: "ANTHROPIC",
  DISCORD: "DISCORD",
  SLACK: "SLACK",
  TELEGRAM: "TELEGRAM",
  GROK: "GROK",
} as const;

export const CredentialType = {
  OPENAI: "OPENAI",
  GEMINI: "GEMINI",
  ANTHROPIC: "ANTHROPIC",
  GROK: "GROK",
} as const;

export const ExecutionStatus = {
  PENDING: "PENDING",
  RUNNING: "RUNNING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
} as const;

export type ExecutionStatus =
  (typeof ExecutionStatus)[keyof typeof ExecutionStatus];

export type NodeType = (typeof NodeType)[keyof typeof NodeType];

export type CredentialType =
  (typeof CredentialType)[keyof typeof CredentialType];
