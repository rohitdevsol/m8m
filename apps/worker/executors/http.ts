import { httpSchema, type HttpNodeConfig } from "@repo/types";
import { resolveTemplate } from "../utils/template";

type HttpHandlerInput = {
  node: {
    id: string;
    data: HttpNodeConfig;
  };
  inputs: Record<string, any>;
  credentials: any[];
};

export async function httpHandler({ node, inputs }: HttpHandlerInput) {
  const parsed = httpSchema.parse(node.data);

  const { endpoint, method, body } = parsed;

  const url = resolveTemplate(endpoint, inputs);

  const resolvedBody = body ? resolveTemplate(body, inputs) : undefined;
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

  return await res.json();
}
