'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState<any>(null)

  useEffect(() => {
    if (params.id) {
      loadProduct()
    }
  }, [params.id])

  async function loadProduct() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.id)
        .single()
      
      if (error) throw error
      
      if (data) {
        setProduct({
          ...data,
          base_price: data.base_price / 100, // Convert from agorot
        })
      }
    } catch (error) {
      console.error('Error loading product:', error)
      alert('שגיאה בטעינת המוצר')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('products')
        .update({
          name: product.name,
          sku: product.sku,
          description: product.description,
          base_price: Math.round(product.base_price * 100), // Convert to agorot
          is_active: product.is_active,
        })
        .eq('id', params.id)

      if (error) throw error
      
      alert('המוצר עודכן בהצלחה!')
      router.push('/admin/products')
    } catch (err) {
      console.error('Error:', err)
      alert('שגיאה בעדכון המוצר')
    } finally {
      setLoading(false)
    }
  }

  if (!product) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl" dir="rtl">
      <h1 className="text-3xl font-bold mb-6">עריכת מוצר</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">פרטי מוצר</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                שם המוצר *
              </label>
              <input
                type="text"
                value={product.name}
                onChange={(e) => setProduct({...product, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                מק"ט (SKU)
              </label>
              <input
                type="text"
                value={product.sku || ''}
                onChange={(e) => setProduct({...product, sku: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                תיאור
              </label>
              <textarea
                value={product.description || ''}
                onChange={(e) => setProduct({...product, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                מחיר (₪) *
              </label>
              <input
                type="number"
                step="0.01"
                value={product.base_price}
                onChange={(e) => setProduct({...product, base_price: parseFloat(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={product.is_active}
                onChange={(e) => setProduct({...product, is_active: e.target.checked})}
                className="ml-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                מוצר פעיל
              </label>
            </div>
            
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'שומר...' : 'שמור'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300"
              >
                ביטול
              </button>
            </div>
          </form>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">תמונות מוצר</h2>
            <p className="text-gray-500 text-sm">
              העלאת תמונות תהיה זמינה בקרוב
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">תוכניות תשלום</h2>
            <p className="text-gray-500 text-sm">
              ניהול תוכניות תשלום יהיה זמין בקרוב
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
