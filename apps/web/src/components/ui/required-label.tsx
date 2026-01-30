import { FormLabel } from "@/components/ui/form";

export function RequiredLabel({ children }: { children: React.ReactNode }) {
  return (
    <FormLabel>
      {children}
      <span className=" text-red-500">*</span>
    </FormLabel>
  );
}
