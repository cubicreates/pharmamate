import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import PharmaClientWrapper from "@/components/PharmaClientWrapper";
import DevToolbar from "@/components/DevToolbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PharmaMate - Professional Pharmacist Portal",
  description: "MediAssist Professional Healthcare Product",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem('theme');
                var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
                if (theme === 'dark' || (!theme && supportDarkMode)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            })();
          `
        }} />
      </head>
      <body className={inter.className}>
        <PharmaClientWrapper>
          {children}
          <DevToolbar />
        </PharmaClientWrapper>
      </body>
    </html>
  );
}
