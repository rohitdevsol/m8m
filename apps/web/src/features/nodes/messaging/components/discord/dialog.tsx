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
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { discordSchema } from "@repo/types";
import { useEffect } from "react";
import z from "zod";

export type DiscordFormValues = z.infer<typeof discordSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof discordSchema>) => void;
  defaultValues?: Partial<DiscordFormValues>;
}

export const DiscordDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
}: Props) => {
  const form = useForm<z.infer<typeof discordSchema>>({
    resolver: zodResolver(discordSchema),
    defaultValues: {
      name: defaultValues?.name,
      username: defaultValues?.username,
      content: defaultValues?.content,
      webhookUrl: defaultValues?.webhookUrl,
    },
  });

  const watchVariableName = form.watch("name");

  const handleSubmit = (values: z.infer<typeof discordSchema>) => {
    onSubmit(values);
    onOpenChange(false);
  };

  useEffect(() => {
    if (open) {
      form.reset({
        name: defaultValues?.name,
        webhookUrl: defaultValues?.webhookUrl,
        content: defaultValues?.content,
        username: defaultValues?.username,
      });
    }
  }, [open, defaultValues, form]);

  if (!open) {
    return null;
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Discord Configuration</DialogTitle>
          <DialogDescription>
            Configure the Discord webhook settings for this node.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 mt-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variable Name</FormLabel>
                  <FormControl>
                    <Input placeholder="myDiscord" {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    {` Use this name to reference the result in other nodes`}
                    <br />
                    {watchVariableName &&
                      `{{${watchVariableName}.<any_valid_field>}}`}
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              name="webhookUrl"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Webhook URL</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="https://discord.com/api/webhooks/..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Get this from Discord: Channel Settings → Integrations →
                    Webhooks
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Content</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-30 font-mono text-sm"
                      placeholder={"Summary: {{variables}}"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    The message to send. Use {"{{variables}}"} to use values.
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bot Username(Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Workflow Bot" {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Override the webhook's default username
                  </FormDescription>
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4 flex">
              <Button className="w-full" type="submit">
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
