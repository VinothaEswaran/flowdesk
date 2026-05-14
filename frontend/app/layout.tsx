import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne", weight: ["400", "500", "700"] });
const dm = DM_Sans({ subsets: ["latin"], variable: "--font-dm" });

export const metadata: Metadata = {
  title: "FlowDesk — Smart Workspace for Freelancers",
  description: "AI-powered project & client management SaaS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${dm.variable} font-dm bg-fd-bg text-fd-text`}>
        <Toaster position="top-right" toastOptions={{ style: { background: "#1a1a24", color: "#f0f0f8", border: "1px solid #2a2a38" } }} />
        {children}
      </body>
    </html>
  );
}
