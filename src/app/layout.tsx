import "@/styles/globals.css";
import type { Metadata, Viewport } from "next";
import { inter, jakarta, jetbrains } from "@/lib/fonts";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "IngatWaktu — Ingat Aku, Ingat Waktu",
  description:
    "Aplikasi jadwal dan manajemen waktu harian dengan desain premium. Atur prioritas, waktu, dan fokus dalam satu tempat.",
  keywords: ["schedule", "time management", "productivity", "planner", "calendar"],
  authors: [{ name: "IngatWaktu" }],
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0A1628",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${inter.variable} ${jakarta.variable} ${jetbrains.variable}`}
    >
      <body className="font-sans antialiased">
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}