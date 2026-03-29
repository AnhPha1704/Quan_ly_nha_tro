'use client'

import React from 'react'
import { MapPinIcon, HomeIcon, UserIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline'

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

export default function PropertyCard({ property }: { property: Property }) {
  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(property.price)

  return (
    <div className="group bg-white rounded-[32px] p-4 card-shadow hover:shadow-2xl transition-all duration-500 border border-slate-50 flex gap-5 cursor-pointer relative overflow-hidden h-[220px]">
      <div className="w-40 h-full relative flex-shrink-0 overflow-hidden rounded-[24px]">
        <img
          src={property.images[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000'}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-dark/90 backdrop-blur-md rounded-full text-[10px] font-black text-primary uppercase">
            {property.type === 'ROOM' ? 'Phòng trọ' : 'Nhà nguyên căn'}
          </span>
        </div>
      </div>

      <div className="flex-grow flex flex-col justify-between py-1 pr-1">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-lg font-black text-dark leading-tight line-clamp-1 group-hover:text-primary transition-colors">
              {property.title}
            </h3>
            <span className="text-xs font-bold text-slate-400">#{property.id.slice(-4).toUpperCase()}</span>
          </div>
          
          <p className="text-slate-500 text-xs mb-3 flex items-center gap-1">
            <MapPinIcon className="h-3 w-3 text-slate-400" />
            <span className="line-clamp-1">{property.address}</span>
          </p>

          <div className="flex gap-4 mb-3">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Diện tích</span>
              <span className="text-sm font-black text-dark">25m²</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Người ở</span>
              <span className="text-sm font-black text-dark">2-3</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden">
               <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${property.landlord.name}`} alt={property.landlord.name} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-bold">Chủ nhà</span>
              <span className="text-xs font-black text-dark">{property.landlord.name}</span>
            </div>
          </div>
          <div className="flex gap-1">
            <button className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-primary-dark hover:text-dark transition-all duration-300">
              <ChatBubbleBottomCenterTextIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Price Badge */}
      <div className="absolute top-0 right-0 p-4">
        <div className="text-right">
          <div className="text-xl font-black text-dark">{formattedPrice}</div>
          <div className="text-[10px] font-bold text-slate-400 mt-[-4px]">mỗi tháng</div>
        </div>
      </div>
    </div>
  )
}
