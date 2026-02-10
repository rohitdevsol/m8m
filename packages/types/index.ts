import { z } from "zod";

export const AVAILABLE_GEMINI_MODELS = [
  "gemini-flash-latest",
  "gemini-pro-latest",
  "gemini-2.5-flash",
  "gemma-3-12b-it",
] as const;

export const AVAILABLE_OPENAI_MODELS = [
  "openai/gpt-4o",
  "openai/chatgpt-4o-latest",
  "openai/gpt-4o-mini",
  "openai/gpt-4.1",
  "openai/gpt-4.1-mini",
  "openai/gpt-3.5-turbo",
] as const;

export const httpSchema = z.object({
  name: z
    .string("Name is required")
    .min(2, "Name must be at least 2 characters long")
    .regex(
      /^[A-Za-z_$][A-Za-z0-9_$]*$/,
      "Name must start with a letter, underscore or dollar sign and can only contain letters, numbers, underscores or dollar signs",
    ),
  endpoint: z.string("Endpoint is required").url({
    message: "Please enter a valid URL",
  }),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  body: z.string().optional(),
});

export const geminiSchema = z.object({
  name: z
    .string("Name is required")
    .min(2, "Name must be at least 2 characters long")
    .regex(
      /^[A-Za-z_$][A-Za-z0-9_$]*$/,
      "Name must start with a letter, underscore or dollar sign and can only contain letters, numbers, underscores or dollar signs",
    ),
  credentialId: z.string("Credential is required"),
  model: z.enum(AVAILABLE_GEMINI_MODELS),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().min(1, "User prompt is required"),
});

export const openaiSchema = z.object({
  name: z
    .string("Name is required")
    .min(2, "Name must be at least 2 characters long")
    .regex(
      /^[A-Za-z_$][A-Za-z0-9_$]*$/,
      "Name must start with a letter, underscore or dollar sign and can only contain letters, numbers, underscores or dollar signs",
    ),
  credentialId: z.string("Credential is required"),
  model: z.enum(AVAILABLE_OPENAI_MODELS),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().min(1, "User prompt is required"),
});

export const discordSchema = z.object({
  name: z
    .string("Name is required")
    .min(2, "Name must be at least 2 characters long")
    .regex(
      /^[A-Za-z_$][A-Za-z0-9_$]*$/,
      "Name must start with a letter, underscore or dollar sign and can only contain letters, numbers, underscores or dollar signs",
    ),
  webhookUrl: z
    .string("Webhook URL is required")
    .min(1, "Minimum length should be one"),
  content: z
    .string("Content is required")
    .min(1, "Minimum length should be one")
    .max(2000, "Discord messages can not exceed 2000 characters"),
  username: z
    .string("Username is required")
    .min(1, "Minimum length should be one")
    .optional(),
});

export type DiscordNodeConfig = z.infer<typeof discordSchema>;
export type GeminiNodeConfig = z.infer<typeof geminiSchema>;
export type OpenaiNodeConfig = z.infer<typeof openaiSchema>;

export type HttpNodeConfig = z.infer<typeof httpSchema>;
