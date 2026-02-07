import { z } from "zod";

export const httpSchema = z.object({
  name: z
    .string("Name is required")
    .min(2, "Name must be at least 2 characters long"),
  endpoint: z.string("Endpoint is required").url({
    message: "Please enter a valid URL",
  }),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  body: z.string().optional(),
});

export type HttpNodeConfig = z.infer<typeof httpSchema>;
