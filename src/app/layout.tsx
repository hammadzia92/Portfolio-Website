import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-heading-loaded",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-body-loaded",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-loaded",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hammad Zia — The Design File",
  description:
    "You just opened a designer's working file. Hammad Zia is a 21-year-old Product Designer from Kolkata who builds products people remember.",
  keywords: [
    "Hammad Zia",
    "Product Designer",
    "UX Designer",
    "UI Designer",
    "Kolkata",
    "Interactive Portfolio",
    "Design File",
    "The Design File",
  ],
  authors: [{ name: "Hammad Zia" }],
  creator: "Hammad Zia",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hammadzia.design",
    title: "Hammad Zia — The Design File",
    description: "You just opened a designer's working file.",
    siteName: "Hammad Zia",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hammad Zia — The Design File",
    description: "You just opened a designer's working file.",
    creator: "@hammadziadesign",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${jetbrainsMono.variable} ${plusJakartaSans.variable} dark`}
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#0a0a0a" />
      </head>
      <body suppressHydrationWarning className="bg-background text-foreground antialiased min-h-screen flex flex-col font-body selection:bg-accent selection:text-black">
        {children}
      </body>
    </html>
  );
}
