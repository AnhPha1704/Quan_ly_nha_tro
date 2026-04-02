'use client'

import React from 'react'
import PropertyCard from './PropertyCard'

interface PropertyGridProps {
  properties: any[]
  loading: boolean
  locationName?: string
  onSelect?: (property: any) => void
  selectedId?: string
  isCompact?: boolean
}

export default function PropertyGrid({ properties, loading, locationName, onSelect, selectedId, isCompact }: PropertyGridProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center gap-3 mb-6 px-2">
          <h2 className={`${isCompact ? 'text-lg' : 'text-2xl'} font-black text-slate-500 tracking-tighter italic`}>
            Đang tải <span className="text-primary">...</span>
          </h2>
          <div className="w-4 h-4 border-2 border-slate-200 border-t-primary rounded-full animate-spin" />
        </div>

        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-3xl p-4 border border-slate-50 flex gap-6 items-center overflow-hidden">
            {/* Image Placeholder with Shimmer */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-slate-100 rounded-2xl shimmer" />

            {/* Content Placeholder */}
            <div className="flex-grow flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className="h-5 bg-slate-100 rounded-lg w-2/3 shimmer" />
                <div className="h-5 bg-slate-100 rounded-lg w-12 shimmer" />
              </div>
              <div className="h-8 bg-slate-50 rounded-full w-32 border border-slate-100/50 shimmer" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`flex flex-col ${isCompact ? 'gap-4 p-4' : 'gap-8 p-6'}`}>
      <div className="flex justify-between items-end mb-2 px-2">
        <div className="space-y-1">
          <h2 className={`${isCompact ? 'text-lg' : 'text-2xl'} font-black text-dark tracking-tighter italic`}>
            {locationName || 'Khu vực tìm kiếm'} <span className="text-primary">.</span>
          </h2>
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 w-fit rounded-full border border-slate-100 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{properties.length} phòng khả dụng</span>
          </div>
        </div>
        {!isCompact && (
          <div className="hidden sm:block">
            <button className="text-[10px] font-bold text-slate-400 hover:text-dark transition-colors uppercase tracking-widest underline underline-offset-4 decoration-primary decoration-2">Xem tất cả</button>
          </div>
        )}
      </div>

      <div className={`flex flex-col ${isCompact ? 'gap-4' : 'gap-6'}`}>
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            isCompact={isCompact}
            isSelected={selectedId === property.id}
            onClick={() => onSelect?.(property)}
          />
        ))}
        {properties.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-300">
            <div className="w-20 h-20 mb-4 bg-slate-50 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <p className="font-bold text-sm uppercase tracking-widest">Không có kết quả</p>
          </div>
        )}
      </div>
    </div>
  )
}
