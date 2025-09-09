import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PennyPerfect - Price Ending Optimization',
  description: 'Auto-test price endings with switchback experiments on Shopify stores',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
