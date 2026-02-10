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
import { AVAILABLE_OPENAI_MODELS, openaiSchema } from "@repo/types";
import { useEffect } from "react";
import z from "zod";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

export type OpenAIFormRequestValues = z.infer<typeof openaiSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof openaiSchema>) => void;
  defaultValues?: Partial<OpenAIFormRequestValues>;
}

export const OpenAIDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
}: Props) => {
  const form = useForm<z.infer<typeof openaiSchema>>({
    resolver: zodResolver(openaiSchema),
    defaultValues: {
      name: defaultValues?.name,
      model: defaultValues?.model || AVAILABLE_OPENAI_MODELS[0],
      systemPrompt: defaultValues?.systemPrompt || "",
      userPrompt: defaultValues?.userPrompt || "",
    },
  });

  const watchVariableName = form.watch("name");

  const handleSubmit = (values: z.infer<typeof openaiSchema>) => {
    onSubmit(values);
    onOpenChange(false);
  };

  useEffect(() => {
    if (open) {
      form.reset({
        name: defaultValues?.name,
        model: defaultValues?.model || AVAILABLE_OPENAI_MODELS[0],
        systemPrompt: defaultValues?.systemPrompt || "",
        userPrompt: defaultValues?.userPrompt || "",
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
          <DialogTitle>OpenAI Configuration</DialogTitle>
          <DialogDescription>
            Configure the AI model and prompts for this node.
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
                    <Input placeholder="summarizePosts" {...field} />
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
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent accessKey="">
                      {AVAILABLE_OPENAI_MODELS.map((model) => (
                        <SelectItem key={model} value={model}>
                          <Image
                            src={"/openai.svg"}
                            alt="openai-logo"
                            height={15}
                            width={15}
                          />
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  <FormDescription>
                    The OpenAI Model to use for the request.
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="systemPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System Prompt(Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-20 font-mono text-sm"
                      placeholder={"You are a helpful assistant."}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Sets the behaviour of the assistant. Use {"{{variables}}"}{" "}
                    to use values.
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-20 font-mono text-sm"
                      placeholder={"Summarize this text : {{variables}}"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    The prompt to send to the AI. Use {"{{variables}}"} to use
                    values.
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
