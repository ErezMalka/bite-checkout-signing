'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Button from './ui/Button'
import Input from './ui/Input'
import Select from './ui/Select'
import Card from './ui/Card'
import { formatPrice, calculateWithSurcharge, getDefaultPaymentPlans } from '@/lib/utils/format'
import { isValidEmail, isValidPhone } from '@/lib/utils/validation'

interface CartItem {
  productId: string
  productName: string
  quantity: number
  basePrice: number
  paymentMethod: 'full' | 'installments'
  installments: number
  paymentPlans?: Record<number, number>
}

interface CheckoutProps {
  cartItems: CartItem[]
  onCartUpdate?: (items: CartItem[]) => void
}

/**
 * Checkout component with payment calculations
 */
export default function Checkout({ cartItems: initialItems, onCartUpdate }: CheckoutProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialItems)
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    loadPaymentPlans()
  }, [])

  /**
   * Load payment plans for all products
   */
  const loadPaymentPlans = async () => {
    const productIds = cartItems.map(item => item.productId)
    
    const { data: plans } = await supabase
      .from('product_payment_plans')
      .select('*')
      .in('product_id', productIds)

    if (plans) {
      const plansByProduct = plans.reduce((acc, plan) => {
        if (!acc[plan.product_id]) acc[plan.product_id] = {}
        acc[plan.product_id][plan.installments] = plan.surcharge_pct
        return acc
      }, {} as Record<string, Record<number, number>>)

      setCartItems(prev => prev.map(item => ({
        ...item,
        paymentPlans: plansByProduct[item.productId] || getDefaultPaymentPlans()
      })))
    }
  }

  /**
   * Validate form
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!customerInfo.name.trim()) {
      newErrors.name = 'שם מלא הוא שדה חובה'
    }
    
    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'טלפון הוא שדה חובה'
    } else if (!isValidPhone(customerInfo.phone)) {
      newErrors.phone = 'מספר טלפון לא תקין'
    }
    
    if (!customerInfo.email.trim()) {
      newErrors.email = 'אימייל הוא שדה חובה'
    } else if (!isValidEmail(customerInfo.email)) {
      newErrors.email = 'כתובת אימייל לא תקינה'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Calculate line totals
   */
  const computeLineTotals = (item: CartItem) => {
    const plans = item.paymentPlans || getDefaultPaymentPlans()
    const surchargePercent = item.paymentMethod === 'full' ? 0 : (plans[item.installments] || 0)
    
    const subtotal = item.basePrice * item.quantity
    const surcharge = Math.round(subtotal * surchargePercent)
    const total = subtotal + surcharge
    const monthlyPayment = item.paymentMethod === 'installments' ? Math.round(total / item.installments) : 0

    return {
      subtotal,
      surcharge,
      surchargePercent,
      total,
      monthlyPayment,
      installments: item.paymentMethod === 'installments' ? item.installments : 0
    }
  }

  /**
   * Calculate order totals
   */
  const calculateTotals = () => {
    let subtotal = 0
    let totalSurcharge = 0
    let grandTotal = 0
    let maxMonthlyPayment = 0

    cartItems.forEach(item => {
      const lineTotals = computeLineTotals(item)
      subtotal += lineTotals.subtotal
      totalSurcharge += lineTotals.surcharge
      grandTotal += lineTotals.total
      if (lineTotals.monthlyPayment > maxMonthlyPayment) {
        maxMonthlyPayment = lineTotals.monthlyPayment
      }
    })

    return {
      subtotal,
      totalSurcharge,
      grandTotal,
      maxMonthlyPayment
    }
  }

  /**
   * Update cart item
   */
  const updateCartItem = (index: number, updates: Partial<CartItem>) => {
    const newItems = [...cartItems]
    newItems[index] = { ...newItems[index], ...updates }
    setCartItems(newItems)
    onCartUpdate?.(newItems)
  }

  /**
   * Remove cart item
   */
  const removeCartItem = (index: number) => {
    const newItems = cartItems.filter((_, i) => i !== index)
    setCartItems(newItems)
    onCartUpdate?.(newItems)
  }

  /**
   * Submit order
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    setSuccess(null)

    try {
      // Prepare order data
      const orderLines = cartItems.map(item => {
        const totals = computeLineTotals(item)
        return {
          product_id: item.productId,
          product_name: item.productName,
          quantity: item.quantity,
          unit_price: item.basePrice,
          payment_method: item.paymentMethod,
          installments: totals.installments,
          surcharge_pct: totals.surchargePercent,
          subtotal: totals.subtotal,
          surcharge: totals.surcharge,
          total: totals.total,
          monthly_payment: totals.monthlyPayment
        }
      })

      const totals = calculateTotals()
      
      const orderData = {
        customer: customerInfo,
        order: {
          currency: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || 'ILS',
          lines: orderLines,
          totals: {
            subtotal: totals.subtotal,
            surcharge: totals.totalSurcharge,
            grand_total: totals.grandTotal,
            max_monthly_payment: totals.maxMonthlyPayment
          }
        }
      }

      // Send to API
      const response = await fetch('/api/signing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const result = await response.json()
      
      setSuccess(`הזמנה נוצרה בהצלחה! קישור לחתימה: ${result.sign_url}`)
      
      // Clear cart after success
      setTimeout(() => {
        setCartItems([])
        onCartUpdate?.([])
      }, 3000)
      
    } catch (err) {
      console.error('Submit error:', err)
      setErrors({ submit: 'שגיאה ביצירת ההזמנה. אנא נסה שוב.' })
    } finally {
      setLoading(false)
    }
  }

  const totals = calculateTotals()

  if (cartItems.length === 0) {
    return (
      <Card className="text-center py-12">
        <p className="text-gray-500 mb-4">הסל ריק</p>
        <a href="/shop" className="text-blue-600 hover:underline">
          חזור לחנות
        </a>
      </Card>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-4" dir="rtl">
      <h1 className="text-2xl font-bold mb-6">סל קניות ותשלום</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item, index) => {
            const lineTotals = computeLineTotals(item)
            const plans = item.paymentPlans || getDefaultPaymentPlans()
            
            return (
              <Card key={index}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold">{item.productName}</h3>
                    <p className="text-gray-600">
                      {formatPrice(item.basePrice)} × {item.quantity}
                    </p>
                  </div>
                  <button
                    onClick={() => removeCartItem(index)}
                    className="text-red-600 hover:text-red-700 text-xl"
                    title="הסר מהסל"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium mb-1">כמות</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateCartItem(index, { 
                        quantity: Math.max(1, parseInt(e.target.value) || 1) 
                      })}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-medium mb-1">אופן תשלום</label>
                    <select
                      value={item.paymentMethod}
                      onChange={(e) => updateCartItem(index, { 
                        paymentMethod: e.target.value as 'full' | 'installments',
                        installments: e.target.value === 'full' ? 1 : item.installments || 3
                      })}
                      className="w-full px-3 py-2 border rounded"
                    >
                      <option value="full">מלא</option>
                      <option value="installments">תשלומים</option>
                    </select>
                  </div>

                  {/* Installments */}
                  {item.paymentMethod === 'installments' && (
                    <div>
                      <label className="block text-sm font-medium mb-1">מספר תשלומים</label>
                      <select
                        value={item.installments}
                        onChange={(e) => updateCartItem(index, { 
                          installments: parseInt(e.target.value) 
                        })}
                        className="w-full px-3 py-2 border rounded"
                      >
                        {Object.entries(plans)
                          .filter(([num]) => num !== '1')
                          .map(([num, surcharge]) => (
                            <option key={num} value={num}>
                              {num} תשלומים ({(surcharge * 100).toFixed(1)}% עמלה)
                            </option>
                          ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Line Totals */}
                <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-2 text-sm">
                  <div>ביניים:</div>
                  <div className="text-left">{formatPrice(lineTotals.subtotal)}</div>
                  
                  {lineTotals.surcharge > 0 && (
                    <>
                      <div>עמלת תשלומים ({(lineTotals.surchargePercent * 100).toFixed(1)}%):</div>
                      <div className="text-left">{formatPrice(lineTotals.surcharge)}</div>
                    </>
                  )}
                  
                  <div className="font-semibold">סה"כ:</div>
                  <div className="text-left font-semibold">{formatPrice(lineTotals.total)}</div>
                  
                  {lineTotals.monthlyPayment > 0 && (
                    <>
                      <div className="text-blue-600">תשלום חודשי:</div>
                      <div className="text-left text-blue-600 font-semibold">
                        {formatPrice(lineTotals.monthlyPayment)}
                      </div>
                    </>
                  )}
                </div>
              </Card>
            )
          })}
        </div>

        {/* Summary & Customer Info */}
        <div className="space-y-4">
          {/* Order Summary */}
          <Card className="bg-gray-50">
            <h2 className="font-semibold mb-4">סיכום הזמנה</h2>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>סכום ביניים:</span>
                <span>{formatPrice(totals.subtotal)}</span>
              </div>
              
              {totals.totalSurcharge > 0 && (
                <div className="flex justify-between">
                  <span>עמלות תשלומים:</span>
                  <span>{formatPrice(totals.totalSurcharge)}</span>
                </div>
              )}
              
              <div className="pt-2 border-t font-semibold">
                <div className="flex justify-between">
                  <span>סה"כ לתשלום:</span>
                  <span className="text-lg">{formatPrice(totals.grandTotal)}</span>
                </div>
              </div>
              
              {totals.maxMonthlyPayment > 0 && (
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-blue-600">
                    <span>תשלום חודשי מקסימלי:</span>
                    <span className="font-semibold">{formatPrice(totals.maxMonthlyPayment)}</span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Customer Form */}
          <Card>
            <h2 className="font-semibold mb-4">פרטי לקוח</h2>
            
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                label="שם מלא"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                error={errors.name}
                required
              />
              
              <Input
                label="טלפון"
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                error={errors.phone}
                required
              />
              
              <Input
                label="אימייל"
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                error={errors.email}
                required
              />

              {errors.submit && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                  {errors.submit}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded text-sm">
                  {success}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                loading={loading}
                disabled={cartItems.length === 0}
              >
                המשך לחתימה
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
