import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TroVN - Tìm phòng trọ quanh bạn",
  description: "Ứng dụng tìm kiếm phòng trọ thông minh.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
