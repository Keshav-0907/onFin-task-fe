import { useEffect, useState } from 'react'

export interface Area {
  id: string
  name: string
  pinCode: string
  isServed: boolean
  totalOrders: number
  avgOrderValue: number
  uniqueCustomers: number
  avgDeliveryTime: number
  deliveryDelay: number
  activeFrom: string
  [key: string]: string | number | boolean
}

export default function useServedAreas() {
  const [areas, setAreas] = useState<Area[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/areas/served')
        if (!res.ok) throw new Error('Failed to fetch served areas')

        const data = await res.json()
        setAreas(data)
      } catch (err) {
        setError('Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchAreas()
  }, [])

  return { areas, loading, error }
}
