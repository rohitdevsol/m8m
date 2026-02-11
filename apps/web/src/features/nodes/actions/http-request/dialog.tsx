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
import { httpSchema } from "@repo/types";
import { useEffect } from "react";
import z from "zod";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export type HttpRequestFormValues = z.infer<typeof httpSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof httpSchema>) => void;
  defaultValues?: Partial<HttpRequestFormValues>;
}

export const HttpRequestDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
}: Props) => {
  const form = useForm<z.infer<typeof httpSchema>>({
    resolver: zodResolver(httpSchema),
    defaultValues: {
      name: defaultValues?.name,
      endpoint: defaultValues?.endpoint,
      method: defaultValues?.method || "GET",
      body: defaultValues?.body,
    },
  });

  const watchVariableName = form.watch("name");
  const watchMethod = form.watch("method");
  const showBodyField = ["POST", "PUT", "PATCH"].includes(watchMethod);

  const handleSubmit = (values: z.infer<typeof httpSchema>) => {
    onSubmit(values);
    onOpenChange(false);
  };

  useEffect(() => {
    if (open) {
      form.reset({
        name: defaultValues?.name,
        endpoint: defaultValues?.endpoint,
        method: defaultValues?.method || "GET",
        body: defaultValues?.body,
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
          <DialogTitle>Http Request</DialogTitle>
          <DialogDescription>
            Configure the settings for the HTTP request node.
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
                    <Input placeholder="myApiCall" {...field} />
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
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  <FormDescription>
                    The HTTP method to use for the request.
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endpoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endpoint URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://api.example.com/users/{{httpResponse.data.id}}"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Static URL or use {"{{variables}}"} for simple values or{" "}
                    {"{{json variable}}"} to stringify objects
                  </FormDescription>
                </FormItem>
              )}
            />

            {showBodyField && (
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Request Body</FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-30 font-mono text-sm"
                        placeholder={
                          "{\n" +
                          '  "userId": "{{httpResponse.data.id}}",\n' +
                          '  "name": "{{httpResponse.data.name}}",\n' +
                          '  "items": "{{httpResponse.data.items}}"\n' +
                          "}"
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      JSON with template variables. Use {"{{variables}}"}
                      for simple values or {"{{json variable}}"} to stringify
                      objects
                    </FormDescription>
                  </FormItem>
                )}
              />
            )}
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
