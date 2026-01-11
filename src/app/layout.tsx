import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { ThemeToggle } from "~/components/ThemeToggle";
import { Toaster } from "~/components/ui/sonner";
import { Navbar } from "~/components/Navbar";
import { getSession } from "~/server/better-auth/server";

export const metadata: Metadata = {
  title: "OnePlaylist",
  description: "Playlist manager",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();

  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <ThemeToggle />
        <TRPCReactProvider>
          <Navbar
            user={
              session?.user
                ? {
                    id: session.user.id,
                    name: session.user.name,
                    email: session.user.email,
                    image: session.user.image,
                  }
                : null
            }
          />
          {children}
        </TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
