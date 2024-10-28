import type { Metadata } from "next";
import { Space_Grotesk } from 'next/font/google';
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Prisma Events Evaluation",
  description: "Evaluate Prisma Events",
  openGraph: {
    type: "website",
    title: "Prisma Events Evaluation",
    description: "Evaluate Prisma Events",
    images: [
      {
        url: "https://evaluate.prisma.events/sm_banner.png",
        width: 1504,
        height: 787,
        alt: "Prisma Events Registration Preview",
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
        {children}
      </body>
    </html>
  );
}
