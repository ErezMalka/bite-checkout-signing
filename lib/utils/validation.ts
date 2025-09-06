/**
 * Validation utilities for forms and data
 */

/**
 * Validate email format
 * @param email - Email address to validate
 * @returns True if valid email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate Israeli phone number
 * @param phone - Phone number to validate
 * @returns True if valid Israeli phone format
 */
export function isValidPhone(phone: string): boolean {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '')
  
  // Check for valid Israeli phone formats
  // Mobile: 05X-XXXXXXX (10 digits starting with 05)
  // Landline: 0X-XXXXXXX (9-10 digits starting with 02, 03, 04, 08, 09)
  const mobileRegex = /^05[0-9]{8}$/
  const landlineRegex = /^0[2-4,8-9][0-9]{7,8}$/
  
  return mobileRegex.test(cleaned) || landlineRegex.test(cleaned)
}

/**
 * Format phone number for display
 * @param phone - Phone number to format
 * @returns Formatted phone number
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 10 && cleaned.startsWith('05')) {
    // Mobile: 05X-XXX-XXXX
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  } else if (cleaned.length === 9 && cleaned.startsWith('0')) {
    // Landline: 0X-XXX-XXXX
    return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 5)}-${cleaned.slice(5)}`
  }
  
  return phone
}

/**
 * Validate price input
 * @param price - Price value to validate
 * @returns True if valid price (positive number)
 */
export function isValidPrice(price: number | string): boolean {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return !isNaN(numPrice) && numPrice >= 0
}

/**
 * Validate SKU format
 * @param sku - SKU to validate
 * @returns True if valid SKU (alphanumeric with optional dashes)
 */
export function isValidSKU(sku: string): boolean {
  const skuRegex = /^[A-Za-z0-9-]+$/
  return skuRegex.test(sku)
}

/**
 * Sanitize text input
 * @param text - Text to sanitize
 * @returns Sanitized text
 */
export function sanitizeText(text: string): string {
  return text
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
}

/**
 * Validate required fields
 * @param data - Object with fields to validate
 * @param requiredFields - Array of required field names
 * @returns Object with validation results
 */
export function validateRequiredFields(
  data: Record<string, any>,
  requiredFields: string[]
): { isValid: boolean; missingFields: string[] } {
  const missingFields = requiredFields.filter(field => !data[field])
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  }
}
