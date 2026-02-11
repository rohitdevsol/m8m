import { telegramSchema } from "@repo/types";
import type { Node } from "@repo/database";
import { resolveTemplate } from "../utils/template";

type TelegramHandlerProps = {
  node: Node;
  inputs: Record<string, any>;
};

type TelegramSuccess = {
  ok: true;
  result: {
    message_id: number;
    date: number;
    text: string;
    chat: {
      id: number | string;
    };
  };
};

type TelegramError = {
  ok: false;
  description?: string;
};

type TelegramResponse = TelegramSuccess | TelegramError;

function escapeMarkdownV2(text: string) {
  return text.replace(
    /([_*$begin:math:display$$end:math:display$()~`>#+\-=|{}.!\\'])/g,
    "\\$1",
  );
}

export async function telegramHandler({ node, inputs }: TelegramHandlerProps) {
  const config = telegramSchema.parse(node.data);

  const { botToken, chatId, content, parseMode } = config;

  const resolvedText = resolveTemplate(content, inputs);

  if (!resolvedText || typeof resolvedText !== "string") {
    throw new Error("Telegram message resolved to empty text");
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  let finalText = resolvedText;

  if (parseMode === "MarkdownV2") {
    finalText = escapeMarkdownV2(resolvedText);
  }

  console.log("PARSE MODE:", parseMode);
  console.log("RAW:", resolvedText);
  console.log("FINAL:", finalText);

  const payload: any = {
    chat_id: chatId,
    text: finalText,
  };

  if (parseMode) {
    payload.parse_mode = parseMode;
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await res.json()) as TelegramResponse;

  if (!res.ok || !data.ok) {
    throw new Error(
      "description" in data && data.description
        ? data.description
        : "Telegram API error",
    );
  }

  return {
    messageId: data.result.message_id,
    chatId: data.result.chat.id,
    date: data.result.date,
    text: data.result.text,
  };
}
