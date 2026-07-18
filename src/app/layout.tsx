import type { Metadata } from "next";
import { Alegreya, Encode_Sans } from "next/font/google";
import "./globals.css";

const alegreya = Alegreya({
  variable: "--font-heading",
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700", "800"],
});

const encodeSans = Encode_Sans({
  variable: "--font-body",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Thư viện sách khảo cứu văn hoá",
  description: "Thư viện lưu trữ và tra cứu các đầu sách khảo cứu văn hoá.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${alegreya.variable} ${encodeSans.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
