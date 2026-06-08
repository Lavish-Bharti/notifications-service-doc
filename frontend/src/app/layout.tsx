import type { Metadata } from "next";
import { ThemeProvider } from "../components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Notifications Microservice API Portal | evaluation-service",
  description: "Enterprise developer documentation, interactive API playground, routing rules, and status monitoring dashboard for the Notifications Microservice.",
  keywords: ["API Docs", "Developer Portal", "Notifications", "Microservices", "REST API", "Playground"],
  authors: [{ name: "Enterprise DevOps Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased font-sans selection:bg-primary selection:text-primary-foreground min-h-screen flex flex-col">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
