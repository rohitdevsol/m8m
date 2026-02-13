"use client";

import { CredentialType } from "@/config/node-types";
import { useRouter } from "next/navigation";
import {
  useCreateCredential,
  useUpdateCredential,
} from "../hooks/use-credentials";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Image from "next/image";
import z from "zod";
import Link from "next/link";

interface CredentialFormProps {
  initialData?: {
    id?: string;
    name?: string;
    type?: CredentialType;
    value?: string;
  };
}

const formSchema = z.object({
  name: z.string("Name is required").min(1, "Mimimum length should be 1"),
  type: z.enum(CredentialType, "Please select a valid option"),
  value: z.string("API key is required").min(1, "Mimimum length should be 1"),
});

type FormValues = z.infer<typeof formSchema>;

const credentialTypeOptions = [
  {
    value: CredentialType.OPENAI,
    label: "OpenAI",
    logo: "/openai.svg",
  },
  // {
  //   value: CredentialType.ANTHROPIC,
  //   label: "Anthropic",
  //   logo: "/anthropic.svg",
  // },
  {
    value: CredentialType.GEMINI,
    label: "Gemini",
    logo: "/gemini.svg",
  },
  {
    value: CredentialType.GROK,
    label: "Grok",
    logo: "/grok.svg",
  },
];

export const CredentialForm = ({ initialData }: CredentialFormProps) => {
  const router = useRouter();
  const createCredential = useCreateCredential();
  const updateCredential = useUpdateCredential();

  const isEdit = !!initialData?.id;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {},
  });

  const handleSubmit = async (values: FormValues) => {
    if (isEdit && initialData?.id) {
      await updateCredential.mutateAsync(
        {
          id: initialData.id,
          ...values,
        },
        {
          onSuccess: () => {
            router.push("/credentials");
          },
          onError: (error) => {
            toast.error(error.message);
          },
        },
      );
    } else {
      await createCredential.mutateAsync(values, {
        onSuccess: () => {
          router.push("/credentials");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      });
    }
  };
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>
          {isEdit ? "Edit Credential" : "Create Credential"} Credential
        </CardTitle>
        <CardDescription>
          {isEdit
            ? "Update your API key or crendential details"
            : "Add a new API key or credential to your account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Any name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="type"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {credentialTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <Image
                              src={option.logo}
                              alt={option.label}
                              width={16}
                              height={16}
                            />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="value"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="sk-...." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button className="" type="button" variant="outline" asChild>
                <Link href="/credentials" prefetch>
                  Cancel
                </Link>
              </Button>
              <Button
                className=""
                type="submit"
                disabled={
                  createCredential.isPending || updateCredential.isPending
                }
              >
                {isEdit ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
