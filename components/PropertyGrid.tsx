'use client'

import { useEffect, useState } from 'react'
import PropertyCard from './PropertyCard'

export default function PropertyGrid({ query }: { query: string }) {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/properties?q=${query}`)
        const data = await res.json()
        setProperties(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to fetch properties:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [query])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="bg-slate-50 animate-pulse h-96 rounded-3xl"></div>
        ))}
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🏠</div>
        <h3 className="text-2xl font-bold text-slate-900">Không tìm thấy kết quả</h3>
        <p className="text-slate-500">Hãy thử tìm kiếm với từ khóa khác nhé.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900">
          Kết quả tìm kiếm ({properties.length})
        </h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50">Lọc giá</button>
          <button className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50">Loại hình</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((p: any) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </div>
  )
}
