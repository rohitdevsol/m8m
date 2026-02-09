import { z } from "zod";

export const AVAILABLE_MODELS = [
  "gemini-flash-latest",
  "gemini-pro-latest",
  "gemini-2.5-flash",
  "gemma-3-12b-it",
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
  model: z.enum(AVAILABLE_MODELS),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().min(1, "User prompt is required"),
});

export type GeminiNodeConfig = z.infer<typeof geminiSchema>;

export type HttpNodeConfig = z.infer<typeof httpSchema>;
