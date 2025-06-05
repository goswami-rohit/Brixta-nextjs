import type { Metadata } from "next";
import Head from 'next/head';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BRIXTA By MyCoco",
  description: "BRIXTA By MyCoco is here! Regular Price Updates! Cement|TMT Bars| and More!",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    siteName: "Brixta By Mycoco",
    type: "website",
    description: "Brixta is your own easy & handy price tracker for TMT Bars and Cement.Stay upto date with Brixta's latest prices and make informed decisions when buying TMT and Cement!",
    url: "https://mycoco.site/",
    images: [
      {
        url: "https://mycoco.site/brixta_img.webp",
        width: 1200, // Add recommended dimensions
        height: 630,
        alt: "Brixta Preview Image", // Add alt text for accessibility
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <Head>
         <meta property="og:site_name" content="Brixta by Mycoco" />
         <meta property="og:type" content="website" />
         <meta
          property="og:description"
          content="Brixta is your own easy & handy price tracker for TMT Bars and Cement.
          Stay upto date with Brixta's latest prices and make informed decisions when buying TMT and Cement!"
        />
         <meta property="og:url" content="https://mycoco.site/" />
         <meta property="og:image" content="/brixta_img.webp" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased
          min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-600 to-blue-900 
          text-white flex flex-wrap`
        }
      >
        <Header/>
        <main className="flex-1 w-full px-4 sm:px-6 py-12 sm:py-20">
        {children}
        </main>
        <Footer/>
      </body>
    </html>
  );
}
