import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/client";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="p-0 m-0 overflow-hidden box-border">
        <TRPCReactProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <NuqsAdapter>{children}</NuqsAdapter>
          </ThemeProvider>
          <Toaster richColors />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
