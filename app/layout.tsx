import React from 'react';
import SupabaseProvider from './supabase-provider';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import { PropsWithChildren } from 'react';
import 'styles/main.css';
import AuthProvider from './auth-provider';

const meta = {
  title: 'Eden',
  description: 'Eden AI',
  cardImage: '/og.png',
  robots: 'follow, index',
  favicon: '/favicon.ico',
  url: 'https://eden-ai.vercel.app',
  type: 'website'
};

export const metadata = {
  title: meta.title,
  description: meta.description,
  cardImage: meta.cardImage,
  robots: meta.robots,
  favicon: meta.favicon,
  url: meta.url,
  type: meta.type,
  openGraph: {
    url: meta.url,
    title: meta.title,
    description: meta.description,
    cardImage: meta.cardImage,
    type: meta.type,
    site_name: meta.title
  },
  twitter: {
    card: 'summary_large_image',
    site: '@vercel',
    title: meta.title,
    description: meta.description,
    cardImage: meta.cardImage
  }
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className="bg-black loading">
        <AuthProvider>
          <SupabaseProvider>
            {React.isValidElement(children) &&
            children.props?.childProp?.segment === 'test' ? (
              <main
                id="skip"
                className="min-h-[100dvh] md:min-h-[100dvh] bg-[#D9D9D9]"
              >
                {children}
              </main>
            ) : (
              <>
                {/* @ts-expect-error */}
                <Navbar />
                <main
                  id="skip"
                  className="min-h-[calc(100dvh-4rem)] md:min-h-[calc(100dvh-5rem)]"
                >
                  {children}
                </main>
                <Footer />
              </>
            )}
          </SupabaseProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
