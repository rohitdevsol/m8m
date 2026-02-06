import { z } from "zod";

export const httpSchema = z.object({
  endpoint: z.string().url({
    message: "Please enter a valid URL",
  }),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  body: z.string().optional(),
});

export type HttpNodeConfig = z.infer<typeof httpSchema>;
