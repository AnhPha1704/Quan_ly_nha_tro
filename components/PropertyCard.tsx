'use client'

import React from 'react'
import { MapPinIcon } from '@heroicons/react/24/outline'

interface Property {
  id: string
  title: string
  description: string
  address: string
  price: number
  type: string
  images: { url: string }[]
  landlord: { name: string }
}

interface PropertyCardProps {
  property: Property
  isCompact?: boolean
  isSelected?: boolean
  onClick?: () => void
}

export default function PropertyCard({ property, isCompact, isSelected, onClick }: PropertyCardProps) {
  const formattedPrice = new Intl.NumberFormat('vi-VN', { 
    notation: 'compact',
    maximumFractionDigits: 1 
  }).format(property.price).replace('TR', 'tr')

  return (
    <div 
      onClick={onClick}
      className={`group bg-white rounded-3xl p-4 transition-shadow border cursor-pointer relative flex gap-6 items-center
        ${isSelected ? 'border-primary bg-primary/5 shadow-xl ring-2 ring-primary/20' : 'border-transparent hover:bg-slate-50'}`}
    >
      {/* Image Section - Reduced border radius */}
      <div className="w-24 h-24 sm:w-28 sm:h-28 relative flex-shrink-0 overflow-hidden rounded-2xl bg-slate-100">
        <img
          src={property.images[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000'}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      {/* Content Section - Minimalist */}
      <div className="flex-grow flex flex-col min-w-0">
        <div className="flex justify-between items-start gap-4 mb-3">
          <h3 className="text-lg font-black text-dark leading-tight line-clamp-2 flex-1 min-w-0 group-hover:text-primary transition-colors">
            {property.title}
          </h3>
          <div className="text-right flex-shrink-0">
            <span className="text-lg font-black text-dark block leading-none">{formattedPrice}</span>
          </div>
        </div>
        
        {/* Address Pill - Simplified address without City */}
        <div className="flex items-center gap-1.5 text-[#5c728d] font-bold bg-[#f4f8fb] w-fit px-4 py-2 rounded-full border border-slate-100/50">
          <MapPinIcon className="h-3.5 w-3.5 text-[#a0aec0]" />
          <span className="text-[11px] truncate max-w-[180px]">
            {property.address.split(',').slice(0, -1).join(',')}
          </span>
        </div>
      </div>
    </div>
  )
}
