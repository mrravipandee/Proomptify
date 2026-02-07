import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: {
    default: "Proomptify - Premium AI Prompts for Instagram, YouTube, LinkedIn & More",
    template: "%s | Proomptify"
  },
  description: "Discover 1000+ professional AI prompts for content creators, marketers, and professionals. Create viral Instagram Reels, YouTube scripts, LinkedIn posts, AI art with Midjourney, and more. Copy, customize, and create in minutes.",
  keywords: [
    "AI prompts",
    "ChatGPT prompts",
    "Instagram prompts",
    "YouTube prompts",
    "LinkedIn prompts",
    "Midjourney prompts",
    "DALL-E prompts",
    "content creation",
    "social media prompts",
    "AI content generator",
    "viral content prompts",
    "TikTok prompts",
    "Twitter prompts",
    "resume prompts",
    "bio generator",
    "SEO prompts"
  ],
  authors: [{ name: "Proomptify" }],
  creator: "Proomptify",
  publisher: "Proomptify",
  metadataBase: new URL('https://proomptify.shop'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://proomptify.shop',
    siteName: 'Proomptify',
    title: 'Proomptify - Premium AI Prompts for Content Creators',
    description: 'Discover 1000+ professional AI prompts for Instagram, YouTube, LinkedIn, AI art, and more. Create viral content in minutes with our proven prompt library.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Proomptify - AI Prompts Library',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Proomptify - Premium AI Prompts for Content Creators',
    description: 'Discover 1000+ professional AI prompts for Instagram, YouTube, LinkedIn, AI art, and more. Create viral content in minutes.',
    images: ['/twitter-image.png'],
    creator: '@proomptify',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Proomptify',
    description: 'Premium AI Prompts for Content Creators, Marketers, and Professionals',
    url: 'https://proomptify.shop',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://proomptify.shop/prompts?search={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Proomptify',
      logo: {
        '@type': 'ImageObject',
        url: 'https://proomptify.shop/logo.png'
      }
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} bg-gradient-to-b from-gray-950 to-[#050520] min-h-screen text-white`}>
        <AuthProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
