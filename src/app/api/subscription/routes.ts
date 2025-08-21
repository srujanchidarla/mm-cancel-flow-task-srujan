import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Mock subscription data
    const subscription = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      user_id: '550e8400-e29b-41d4-a716-446655440001',
      monthly_price: 2500, // $25.00 in cents
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    return NextResponse.json({ subscription })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}