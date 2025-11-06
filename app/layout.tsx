import type { Metadata } from "next";
import { Figtree, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { NextIntlClientProvider } from "next-intl";
import { Toaster } from "@/components/ui/sonner";
import { getLocale, getMessages } from "next-intl/server";

const figTree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"]
})

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://www.daisyapp.fr/"),
  title: {
    default: "Daisy",
    template: "%s | Daisy"
  },
  description: "Daisy Workshop Management",
  openGraph: {
    type: "website",
    url: "https://www.daisyapp.fr/",
    siteName: "Daisy",
    title: "Daisy",
    description: "Daisy Workshop Management",
    images: [{ url: "/daisy.webp" }]
  },
  robots: {
    index: true,
    follow: true
  },
  icons: { icon: "/daisy.webp" }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locales = await getLocale()
  const messages = await getMessages()
  return (
    <html lang="en">
      <body
        className={`${figTree.variable} ${poppins.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locales} messages={messages}>
          <main className="flex flex-col min-h-screen">
            {children}
            <Navbar />
            <Toaster position="top-center" />
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
