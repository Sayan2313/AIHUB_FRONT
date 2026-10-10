import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/custom-ui/Navbar";
import Background from "@/components/custom-ui/Background";
import {ReactNode} from "react";
import { AuthProvider } from "@/context/AuthContext";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AIHUB",
  description: "Created by AIHUB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
    <body className="min-h-dvh flex flex-col text-white">
        <AuthProvider>
          <Background />
          <Navbar />
          <main className="flex-1 min-h-0">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html >
  );
}
