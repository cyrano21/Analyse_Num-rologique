import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React from 'react';
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Analyse Numérologique et Astrologique',
  description: 'Découvrez votre profil numérologique et astrologique personnalisé',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-gray-100`}>{children}</body>
    </html>
  )
}
