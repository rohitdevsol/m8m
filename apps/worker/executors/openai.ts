import "dotenv/config";
import type { Node } from "@repo/database";
import { geminiSchema } from "@repo/types";
import { resolveTemplate } from "../utils/template";
import OpenAI from "openai";

type openAIHandlerProps = {
  node: Partial<Node>;
  inputs: Record<string, any>;
  credentials: any[];
};

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPEN_ROUTER_API_KEY,
  //   defaultHeaders: {
  //     "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
  //     "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
  //   },
});

export const openAIHandler = async ({
  node,
  inputs,
  credentials,
}: openAIHandlerProps) => {
  const parsed = geminiSchema.parse(node.data);
  const { model, userPrompt, systemPrompt } = parsed;

  const resolvedPrompt = resolveTemplate(userPrompt, inputs) as string;
  const resolvedSystemPrompt = resolveTemplate(systemPrompt, inputs) as string;

  console.log("[resolvedPrompt]", resolvedPrompt);
  console.log("[resolvedSystemPrompt]", resolvedSystemPrompt);
  const defaultSystemPrompt = `You are a helpful assistant. You answer as concisely as possible.`;

  const completion = await openai.chat.completions.create({
    model: model,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: resolvedPrompt,
          },
        ],
      },
      {
        role: "system",
        content:
          resolvedSystemPrompt.length < 1
            ? resolvedSystemPrompt
            : defaultSystemPrompt,
      },
    ],
  });

  return completion?.choices[0]!.message?.content;
};
