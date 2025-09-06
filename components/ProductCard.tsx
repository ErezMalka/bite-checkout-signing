'use client'

import { useState } from 'react'
import Card from './ui/Card'
import Button from './ui/Button'
import { formatPrice } from '@/lib/utils/format'

interface ProductCardProps {
  product: {
    id: string
    name: string
    description: string | null
    base_price: number
    sku?: string | null
    images?: Array<{
      id: string
      url: string | null
      is_primary: boolean
      sort_order: number
    }>
  }
  onAddToCart?: (productId: string, quantity: number) => void
  showActions?: boolean
}

/**
 * Product card component for displaying products in grid
 */
export default function ProductCard({ 
  product, 
  onAddToCart,
  showActions = true 
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  
  const primaryImage = product.images?.find(img => img.is_primary)
  const hasImages = product.images && product.images.length > 0

  const handleAddToCart = async () => {
    if (!onAddToCart) return
    
    setIsAdding(true)
    try {
      await onAddToCart(product.id, quantity)
      setQuantity(1) // Reset quantity after adding
      
      // Show success feedback
      const button = document.getElementById(`add-btn-${product.id}`)
      if (button) {
        button.textContent = '✓ נוסף'
        setTimeout(() => {
          button.textContent = 'הוסף לסל'
        }, 2000)
      }
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <Card hover className="flex flex-col h-full p-0">
      {/* Image Section */}
      <div className="relative aspect-square bg-gray-100">
        {primaryImage?.url ? (
          <img
            src={primaryImage.url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg 
              className="w-16 h-16" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
          </div>
        )}
        
        {/* Image count badge */}
        {hasImages && product.images!.length > 1 && (
          <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
            {product.images!.length} תמונות
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 p-4 flex flex-col" dir="rtl">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          {product.sku && (
            <p className="text-xs text-gray-500 mb-1">
              מק"ט: {product.sku}
            </p>
          )}
          
          {product.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>

        <div className="mt-auto space-y-3">
          <div className="text-xl font-bold text-blue-600">
            {formatPrice(product.base_price)}
          </div>

          {/* Actions */}
          {showActions && onAddToCart && (
            <div className="flex items-center gap-2">
              <div className="flex items-center border rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2 py-1 hover:bg-gray-100"
                  disabled={isAdding}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 text-center border-x py-1"
                  disabled={isAdding}
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2 py-1 hover:bg-gray-100"
                  disabled={isAdding}
                >
                  +
                </button>
              </div>
              
              <Button
                id={`add-btn-${product.id}`}
                onClick={handleAddToCart}
                size="sm"
                className="flex-1"
                loading={isAdding}
              >
                הוסף לסל
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
