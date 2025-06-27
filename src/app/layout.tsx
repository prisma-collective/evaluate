import type { Metadata } from "next";
import { Space_Grotesk } from 'next/font/google';
import "./styles/globals.css";
import Navbar from "@/components/Navbar";

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Prisma Evaluation",
  description: "Evaluate Prisma Events",
  openGraph: {
    type: "website",
    title: "Prisma Evaluation",
    description: "Explore a case-study of an action-learning journey.",
    images: [
      {
        url: "https://evaluate.prisma.events/og_image.png",
        width: 1504,
        height: 787,
        alt: "Prisma Events Evaluation Preview",
      },
    ],
    url: "https://evaluate.prisma.events",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prisma Events Registration",
    description: "Register for Prisma Events",
    images: ["https://evaluate.prisma.events/sm_banner.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="64x64" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${spaceGrotesk.className}`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
