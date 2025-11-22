import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import ClientProviders from "@/components/ClientProvider";
import { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Afdable Classes - Student Portal",
  description: "Access your courses, join live classes, and manage your learning journey",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
