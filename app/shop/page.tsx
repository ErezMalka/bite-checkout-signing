'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Product {
  id: string
  name: string
  description: string | null
  base_price: number
  is_active: boolean
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
      
      if (error) throw error
      if (data) setProducts(data)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  function addToCart(product: Product) {
    setCart(prev => [...prev, {
      productId: product.id,
      productName: product.name,
      quantity: 1,
      basePrice: product.base_price,
      paymentMethod: 'full',
      installments: 1,
    }])
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-4">טוען מוצרים...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">חנות</h1>
      
      {cart.length > 0 && (
        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">🛒 סל קניות ({cart.length} פריטים)</h2>
          <button 
            onClick={() => window.location.href = '/checkout'}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            המשך לתשלום
          </button>
        </div>
      )}
      
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">אין מוצרים זמינים כרגע</p>
          <a href="/admin/products/new" className="text-blue-600 hover:underline mt-4 inline-block">
            הוסף מוצר ראשון
          </a>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="aspect-square bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-6xl">📦</span>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                {product.description && (
                  <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-blue-600">
                    ₪{(product.base_price / 100).toFixed(2)}
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                  >
                    הוסף לסל
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
