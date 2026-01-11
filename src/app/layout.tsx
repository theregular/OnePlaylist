import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { Navbar } from "~/components/Navbar";
import { ThemeToggle } from "~/components/ThemeToggle";

export const metadata: Metadata = {
  title: "OnePlaylist",
  description: "Playlist manager",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <ThemeToggle />
        <TRPCReactProvider>
          {/* <Navbar /> */}
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
