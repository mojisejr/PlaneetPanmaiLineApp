import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Planeet Panmai Line App",
  description: "Premium Member Calculator for Durian Plants",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  )
}
