import { z } from "zod";

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

export type HttpNodeConfig = z.infer<typeof httpSchema>;
