/**
 * Format price from agorot (cents) to ILS
 * @param agorot - Price in agorot (1/100 of a shekel)
 * @returns Formatted price string in ILS
 */
export function formatPrice(agorot: number): string {
  const shekels = agorot / 100
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(shekels)
}

/**
 * Calculate price with surcharge
 * @param price - Base price in agorot
 * @param surchargePercent - Surcharge as decimal (e.g., 0.08 for 8%)
 * @returns Total price with surcharge in agorot
 */
export function calculateWithSurcharge(price: number, surchargePercent: number): number {
  return Math.round(price * (1 + surchargePercent))
}

/**
 * Get default payment plans with surcharge percentages
 * @returns Object with installment counts as keys and surcharge percentages as values
 */
export function getDefaultPaymentPlans() {
  return {
    1: 0.000,   // No surcharge for full payment
    3: 0.020,   // 2% surcharge for 3 installments
    6: 0.040,   // 4% surcharge for 6 installments
    12: 0.080,  // 8% surcharge for 12 installments
  }
}

/**
 * Calculate monthly payment
 * @param totalPrice - Total price in agorot
 * @param installments - Number of installments
 * @returns Monthly payment amount in agorot
 */
export function calculateMonthlyPayment(totalPrice: number, installments: number): number {
  if (installments <= 0) return totalPrice
  return Math.round(totalPrice / installments)
}

/**
 * Format date to Hebrew locale
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj)
}

/**
 * Format date and time to Hebrew locale
 * @param date - Date string or Date object
 * @returns Formatted date and time string
 */
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj)
}
