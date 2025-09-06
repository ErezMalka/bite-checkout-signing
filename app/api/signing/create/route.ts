import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer, order } = body

    // Validate input
    if (!customer?.name || !customer?.email) {
      return NextResponse.json(
        { error: 'Missing customer information' },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()

    // Create order draft
    const { data, error } = await supabase
      .from('order_drafts')
      .insert({
        customer_name: customer.name,
        customer_phone: customer.phone || null,
        customer_email: customer.email,
        currency: order.currency || 'ILS',
        payload: order,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    // Mock signing URL (in production, integrate with real signing service)
    const sign_url = `https://sign.local/agr_${data.id}`

    // Update with sign URL
    const { error: updateError } = await supabase
      .from('order_drafts')
      .update({ 
        sign_url, 
        status: 'sent' 
      })
      .eq('id', data.id)

    if (updateError) {
      console.error('Update error:', updateError)
    }

    return NextResponse.json({
      success: true,
      order_id: data.id,
      sign_url,
      message: 'Order created successfully'
    })
    
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Signing API endpoint',
    method: 'Use POST to create a new signing request'
  })
}
