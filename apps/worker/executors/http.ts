import { httpSchema } from "@repo/types";
import { resolveTemplate } from "../utils/template";
import type { Node, Prisma } from "@repo/database";

type HttpHandlerInput = {
  node: Partial<Node>;
  inputs: Record<string, any>;
};

export async function httpHandler({ node, inputs }: HttpHandlerInput) {
  const parsed = httpSchema.parse(node.data);
  const { endpoint, method, body } = parsed;

  const url = resolveTemplate(endpoint, inputs);
  let resolvedBody: any = undefined;

  if (body) {
    const parsed = JSON.parse(body);
    const resolved = resolveTemplate(parsed, inputs);
    resolvedBody = JSON.stringify(resolved);
  }

  console.log("[resolvedBody]", resolvedBody);

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: method === "GET" || method === "DELETE" ? undefined : resolvedBody,
  });

  if (!res.ok) {
    throw new Error(`HTTP failed: ${res.status}`);
  }

  return (await res.json()) as Prisma.JsonValue;
}
