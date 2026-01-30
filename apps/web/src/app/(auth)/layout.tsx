import AuthLayout from "@/features/auth/components/auth-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthLayout>{children}</AuthLayout>;
    </>
  );
}
