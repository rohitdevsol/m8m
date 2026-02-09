import "dotenv/config";
import type { Node } from "@repo/database";
import { GoogleGenAI } from "@google/genai";
import { geminiSchema } from "@repo/types";
import { resolveTemplate } from "../utils/template";

type geminiHandlerInput = {
  node: Partial<Node>;
  inputs: Record<string, any>;
  credentials: any[];
};
export const geminiHandler = async ({
  node,
  inputs,
  credentials,
}: geminiHandlerInput) => {
  const parsed = geminiSchema.parse(node.data);
  const { model, userPrompt, systemPrompt } = parsed;

  const resolvedPrompt = resolveTemplate(userPrompt, inputs) as string;
  const resolvedSystemPrompt = resolveTemplate(systemPrompt, inputs) as string;

  console.log("[resolvedPrompt]", resolvedPrompt);
  console.log("[resolvedSystemPrompt]", resolvedSystemPrompt);
  const defaultSystemPrompt = `You are a helpful assistant. You answer as concisely as possible.`;
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const response = await ai.models.generateContent({
    model: model,
    contents: [
      {
        text: resolvedPrompt,
      },
    ],
    config: {
      systemInstruction:
        resolvedSystemPrompt.length < 1
          ? resolvedSystemPrompt
          : defaultSystemPrompt,
    },
  });
  console.log("[Response]", response?.text);
  return response?.text || "";
};
