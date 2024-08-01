"use client"
import { useEffect } from 'react';

import { Inter } from "next/font/google";
import "./globals.css";
import CookieConsent from "@/components/CookieConsent"
const inter = Inter({ subsets: ["latin"] });
import { SessionProvider } from "next-auth/react";


export default function RootLayout({ children }) {


  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (consent === 'accepted') {
      // Load Google Analytics script
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=G-NWQ7T2RJBK`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        window.dataLayer = window.dataLayer || [];
        function gtag() {
          window.dataLayer.push(arguments);
        }
        gtag('js', new Date());
        gtag('config', 'G-NWQ7T2RJBK');
      };
    }
  }, []);
  return (
    <html lang="en">

      <SessionProvider>
      <body className={inter.className}>{children}
      
        <CookieConsent/>
      </body>
        </SessionProvider>



    </html>
  );
}
