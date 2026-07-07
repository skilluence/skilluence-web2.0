import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import PageTransition from "@/components/ui/PageTransition";
import ConditionalHeader from "@/components/ConditionalHeader";

export const metadata: Metadata = {
  title: "H1B Sponsored IT Roles 2026 | Skilluence",
  description:
    "Skilluence provides direct-hire US tech job placement, resume optimization, interview coaching, and career support for OPT, STEM OPT, and H-1 candidates.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ConditionalHeader />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
