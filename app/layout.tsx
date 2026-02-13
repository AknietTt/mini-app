import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google";
import "./globals.css"

const _geist = Inter({ subsets: ["latin"] });
const _geistMono = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "Механик - Путевой лист",
  description: "Telegram Mini App для механиков",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#f5f5f0",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className="font-sans antialiased tg-mini-app">{children}</body>
    </html>
  )
}
