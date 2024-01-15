import type { Metadata } from "next";
import "./globals.css";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/dropzone/styles.css";

import {
  ColorSchemeScript,
  DirectionProvider,
  MantineProvider,
} from "@mantine/core";
import NotificationRegister from "@/bin/components/layout/NotificationRegister";
import localFont from "next/font/local";
import ChatClient from "@/bin/components/layout/ChatClient";
import Providers from "@/bin/components/layout/Providers";
export const metadata: Metadata = {
  title: "خدمات پرستاری سالکود",
  description: "خدمات پرستاری سالکود، ارائه دهنده خدمات پرستاری در منزل",
};

const font = localFont({
  src: [
    {
      path: "./fonts/iranyekanwebregular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/iranyekanwebbold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/iranyekanwebmedium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/iranyekanwebextrabold.woff",
      weight: "300",
      style: "normal",
    },
  ],
  variable: "--font-iranyekan",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <ColorSchemeScript />
      </head>
      <body
        style={{
          backgroundColor: "var(--mantine-color-gray-1)",
        }}
      >
        <Providers>
          <DirectionProvider>
            <MantineProvider
              theme={{
                fontFamily: font.style.fontFamily,
              }}
            >
              <NotificationRegister />
              <ChatClient />
              {children}
            </MantineProvider>
          </DirectionProvider>
        </Providers>
      </body>
    </html>
  );
}
