import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
import Navbar from "@/components/layout/navbar";
import { ThemeProvider } from "@/lib/providers/theme-provider";
import { Container } from "@/components/layout/container";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "EKTA ADMIN",
  description: "ADMIN SITE FOR EKTA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <Container>{children}</Container>
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
