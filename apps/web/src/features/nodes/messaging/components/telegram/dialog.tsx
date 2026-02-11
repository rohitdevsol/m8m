"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { telegramSchema } from "@repo/types";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import z from "zod";

export type TelegramFormValues = z.infer<typeof telegramSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: TelegramFormValues) => void;
  defaultValues?: Partial<TelegramFormValues>;
}

export const TelegramDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
}: Props) => {
  const form = useForm<TelegramFormValues>({
    resolver: zodResolver(telegramSchema),

    defaultValues: {
      name: defaultValues?.name,
      botToken: defaultValues?.botToken,
      chatId: defaultValues?.chatId,
      content: defaultValues?.content,
      parseMode: defaultValues?.parseMode,
    },
  });

  const watchName = form.watch("name");

  const handleSubmit = (values: TelegramFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
    }
  }, [open, defaultValues, form]);

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] hide-scrollbar">
        <DialogHeader>
          <DialogTitle>Telegram Configuration</DialogTitle>

          <DialogDescription>
            Send messages using Telegram Bot API
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-120px)] hide-scrollbar ">
          {/* Setup Instructions */}
          <div className="rounded-md bg-muted p-3 text-sm space-y-1">
            <p className="font-medium">Setup Instructions:</p>

            <ol className="list-decimal ml-4 space-y-1 text-muted-foreground">
              <li>Create bot via @BotFather</li>
              <li>Copy Bot Token</li>
              <li>Add bot to channel / DM</li>
              <li>Send a message</li>
              <li>Get chatId from getUpdates</li>
            </ol>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-5 mt-4"
            >
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variable Name</FormLabel>

                    <FormControl>
                      <Input placeholder="myTelegram" {...field} />
                    </FormControl>

                    <FormMessage />

                    <FormDescription>
                      Used in other nodes
                      <br />
                      {watchName &&
                        `{{${watchName}.messageId}} , {{${watchName}.date}}`}
                    </FormDescription>
                  </FormItem>
                )}
              />

              {/* Bot Token */}
              <FormField
                control={form.control}
                name="botToken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bot Token</FormLabel>

                    <FormControl>
                      <Input
                        type="password"
                        placeholder="123456:ABC-DEF..."
                        {...field}
                      />
                    </FormControl>

                    <FormDescription>From @BotFather</FormDescription>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Chat ID */}
              <FormField
                control={form.control}
                name="chatId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chat ID</FormLabel>

                    <FormControl>
                      <Input placeholder="-100xxxxxxxxxx" {...field} />
                    </FormControl>

                    <FormDescription>User ID or Channel ID</FormDescription>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Message */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>

                    <FormControl>
                      <Textarea
                        className="min-h-28 font-mono text-sm"
                        placeholder="Status: {{status}}"
                        {...field}
                      />
                    </FormControl>

                    <FormDescription>
                      Supports templates: {"{{variable}}"}
                    </FormDescription>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Parse Mode */}
              <FormField
                control={form.control}
                name="parseMode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parse Mode (Optional)</FormLabel>

                    <FormControl>
                      <Input placeholder="HTML or MarkdownV2" {...field} />
                    </FormControl>

                    <FormDescription>For formatting</FormDescription>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button className="w-full" type="submit">
                  Save
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
