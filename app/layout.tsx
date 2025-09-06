import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bite Checkout & Signing',
  description: 'E-commerce platform with payment plans and digital signing',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <nav className="bg-blue-600 text-white p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <a href="/" className="text-xl font-bold">Bite Checkout</a>
            <div className="space-x-reverse space-x-4">
              <a href="/shop" className="hover:text-blue-200">חנות</a>
              <a href="/admin/products" className="hover:text-blue-200">ניהול</a>
            </div>
          </div>
        </nav>
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  )
}
