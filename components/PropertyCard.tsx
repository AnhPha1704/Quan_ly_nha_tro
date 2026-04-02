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

      {/* Content Section - Flexible container */}
      <div className="flex-grow flex flex-col gap-3 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-black text-dark text-lg leading-tight tracking-tighter truncate italic">
            {property.title}
          </h3>
          <div className="flex flex-col items-end flex-shrink-0">
            <span className="text-sm font-black text-dark leading-none">
              {property.price / 1000000} Tr
            </span>
          </div>
        </div>
        
        {/* Address Pill - Simplified address with Max Width Constraint */}
        <div className="flex items-center gap-1.5 text-[#5c728d] font-bold bg-[#f4f8fb] w-fit max-w-full px-3 py-1.5 rounded-full border border-slate-100/50">
          <MapPinIcon className="h-3 w-3 text-[#a0aec0] flex-shrink-0" />
          <span className="text-[10px] truncate">
            {property.address.split(',').length > 1 
              ? property.address.split(',').slice(0, -1).join(',') 
              : property.address}
          </span>
        </div>
      </div>
    </div>
  )
}
