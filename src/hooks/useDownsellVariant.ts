import { useState, useEffect } from 'react'
import { DownsellOffer } from '@/types/cancellation'

export const useDownsellVariant = (userId: string | null) => {
  const [variant, setVariant] = useState<'A' | 'B' | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const getVariant = async () => {
      try {
        const response = await fetch('/api/variant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        })

        if (!response.ok) {
          throw new Error('Failed to get variant')
        }

        const data = await response.json()
        setVariant(data.variant)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get variant')
      } finally {
        setLoading(false)
      }
    }

    getVariant()
  }, [userId])

  const getOffer = (originalAmount: number): DownsellOffer | null => {
    if (!variant) return null

    const discount = variant === 'B' ? 1000 : 0 // $10 off for variant B
    const discountedPrice = Math.max(0, originalAmount - discount)

    return {
      variant,
      originalPrice: originalAmount,
      discountedPrice,
      discount,
    }
  }

  return { variant, loading, error, getOffer }
}