import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/topbar";
import { Toaster } from "@/components/ui/toaster";
import { ParticleBackground } from "@/components/ui/particle-background";
import { AuthGuard } from "@/components/auth/auth-guard";
import { ThreatSimulator } from "@/components/simulation/threat-simulator";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "NETWATCH | Threat Intelligence",
  description: "Advanced OSINT and Threat Intelligence Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground overflow-hidden`}>
        <AuthGuard>
          <ThreatSimulator />
          <div className="flex h-screen w-full">
            <Sidebar />
            <div className="flex flex-1 flex-col pl-64">
              <TopBar />
              <main className="flex-1 overflow-y-auto p-6 relative">
                <ParticleBackground />
                <div className="scanline" />
                <div className="relative z-10">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </AuthGuard>
        <Toaster />
      </body>
    </html>
  );
}
