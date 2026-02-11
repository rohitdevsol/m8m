import "dotenv/config";
import { prisma, type Node } from "@repo/database";
import { GoogleGenAI } from "@google/genai";
import { geminiSchema } from "@repo/types";
import { resolveTemplate } from "../utils/template";
import { decrypt } from "@repo/common";

type geminiHandlerInput = {
  node: Partial<Node>;
  inputs: Record<string, any>;
  userId: string;
};
export const geminiHandler = async ({
  node,
  inputs,
  userId,
}: geminiHandlerInput) => {
  const parsed = geminiSchema.parse(node.data);
  const { model, userPrompt, credentialId, systemPrompt } = parsed;

  //finding out the credentials

  let credential = await prisma.credential.findFirstOrThrow({
    where: {
      id: credentialId,
      userId: userId,
      type: "GEMINI",
    },
  });

  const resolvedPrompt = resolveTemplate(userPrompt, inputs) as string;
  const resolvedSystemPrompt = resolveTemplate(systemPrompt, inputs) as string;

  console.log("[resolvedPrompt]", resolvedPrompt);
  console.log("[resolvedSystemPrompt]", resolvedSystemPrompt);
  const defaultSystemPrompt = `You are a helpful assistant. You answer as concisely as possible.`;
  const ai = new GoogleGenAI({
    apiKey: decrypt(credential.value),
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
