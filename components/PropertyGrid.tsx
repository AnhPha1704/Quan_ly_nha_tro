'use client'

import React from 'react'
import PropertyCard from './PropertyCard'

interface PropertyGridProps {
  properties: any[]
  loading: boolean
}

export default function PropertyGrid({ properties, loading }: PropertyGridProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-white/50 animate-pulse h-[220px] rounded-[32px]"></div>
        ))}
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-20 px-10">
        <div className="text-6xl mb-6 grayscale opacity-50">🏠</div>
        <h3 className="text-2xl font-black text-dark mb-2">Không tìm thấy yêu cầu</h3>
        <p className="text-slate-500">Hãy thử mở rộng bán kính tìm kiếm hoặc thay đổi khu vực bạn nhé.</p>
        <button className="mt-8 px-8 py-3 bg-dark text-white rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95">
          Gửi yêu cầu tìm phòng
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex justify-between items-end mb-2 px-1">
        <div>
          <h2 className="text-xl font-black text-dark tracking-tight">Khu vực Hồ Chí Minh</h2>
          <div className="flex items-center gap-2 mt-1">
             <div className="w-1.5 h-1.5 rounded-full bg-primary" />
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Đang hiển thị {properties.length} kết quả</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-6">
        {properties.map((p: any) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </div>
  )
}
