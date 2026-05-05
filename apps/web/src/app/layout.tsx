import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/client";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Provider } from "jotai";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "m8m | Open Source Workflow Automation",
  description: "Connect APIs, AI models, and services into powerful pipelines with a visual builder. No code. No limits.",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="p-0 m-0 ">
        <TRPCReactProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" >
            <NuqsAdapter>
              <Provider>
                {children}
                <Toaster richColors />
              </Provider>
            </NuqsAdapter>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
