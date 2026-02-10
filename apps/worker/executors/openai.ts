import "dotenv/config";
import { prisma, type Node } from "@repo/database";
import { openaiSchema } from "@repo/types";
import { resolveTemplate } from "../utils/template";
import OpenAI from "openai";

type openAIHandlerProps = {
  node: Partial<Node>;
  inputs: Record<string, any>;
  userId: string;
};

export const openAIHandler = async ({
  node,
  inputs,
  userId,
}: openAIHandlerProps) => {
  const parsed = openaiSchema.parse(node.data);
  const { model, userPrompt, credentialId, systemPrompt } = parsed;

  const credential = await prisma.credential.findFirstOrThrow({
    where: {
      id: credentialId,
      userId: userId,
      type: "OPENAI",
    },
  });
  const resolvedPrompt = resolveTemplate(userPrompt, inputs) as string;
  const resolvedSystemPrompt = resolveTemplate(systemPrompt, inputs) as string;

  console.log("[resolvedPrompt]", resolvedPrompt);
  console.log("[resolvedSystemPrompt]", resolvedSystemPrompt);
  const defaultSystemPrompt = `You are a helpful assistant. You answer as concisely as possible.`;

  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: credential.value,
    //   defaultHeaders: {
    //     "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
    //     "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
    //   },
  });
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
