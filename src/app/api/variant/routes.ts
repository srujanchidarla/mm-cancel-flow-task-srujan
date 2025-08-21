import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()
    
    if (!userId || typeof userId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      )
    }

    // Generate deterministic variant using cryptographic hash
    const hash = createHash('sha256')
      .update(userId + 'downsell_salt_2024')
      .digest('hex')
    
    // Use first 8 characters of hex as number
    const numericHash = parseInt(hash.substr(0, 8), 16)
    const variant = numericHash % 2 === 0 ? 'A' : 'B'

    return NextResponse.json({ variant })

  } catch (error) {
    console.error('Variant API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}