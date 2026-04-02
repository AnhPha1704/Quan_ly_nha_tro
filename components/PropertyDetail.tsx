'use client'

import React from 'react'
import { 
  XMarkIcon, 
  MapPinIcon, 
  HomeIcon, 
  UserIcon, 
  ChatBubbleBottomCenterTextIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  CameraIcon
} from '@heroicons/react/24/outline'

interface Property {
  id: string
  title: string
  description: string
  address: string
  price: number
  type: string
  images: { url: string }[]
  landlord: {
    name: string
    email: string
  }
}

interface PropertyDetailProps {
  property: Property
  onClose: () => void
}

export default function PropertyDetail({ property, onClose }: PropertyDetailProps) {
  const formattedPrice = new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(property.price)

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-100 overflow-hidden">
      {/* Header with close button */}
      <div className="p-6 flex items-center justify-between border-b border-slate-50 bg-white/50 backdrop-blur-md sticky top-0 z-30">
        <h2 className="text-xl font-black text-dark tracking-tighter italic">Chi tiết phòng <span className="text-primary">.</span></h2>
        <button 
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-dark hover:text-white transition-all transform active:scale-90"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto no-scrollbar pb-10">
        {/* Image Gallery */}
        <div className="px-6 mt-6">
          <div className="relative group rounded-3xl overflow-hidden aspect-[16/10] bg-slate-100 shadow-2xl">
            <img 
              src={property.images[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000'} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              alt={property.title}
            />
            <div className="absolute bottom-6 left-6 flex gap-2">
               <div className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-dark shadow-lg">
                 <CameraIcon className="h-4 w-4 text-primary" />
                 {property.images.length} Ảnh
               </div>
               <div className="px-4 py-2 bg-dark/95 backdrop-blur-md rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary shadow-lg border border-white/10">
                 {property.type === 'ROOM' ? 'Phòng trọ' : 'Nhà nguyên căn'}
               </div>
            </div>
          </div>
        </div>

        {/* Info Content */}
        <div className="px-8 mt-10">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-black text-dark tracking-tighter leading-none flex-1 pr-6 italic">{property.title}</h1>
            <div className="text-right">
              <span className="text-2xl font-black text-primary block leading-none mb-1">{formattedPrice}</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">Mỗi tháng</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-500 mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
            <MapPinIcon className="h-5 w-5 text-primary" />
            <span className="text-sm font-bold">{property.address}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10">
             <div className="p-6 bg-slate-50 rounded-2xl flex items-center gap-4 border border-slate-100/30">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                   <HomeIcon className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Diện tích</span>
                   <span className="text-lg font-black text-dark">25 m²</span>
                </div>
             </div>
             <div className="p-6 bg-slate-50 rounded-2xl flex items-center gap-4 border border-slate-100/30">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm">
                   <UserIcon className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Người ở</span>
                   <span className="text-lg font-black text-dark">2 - 3</span>
                </div>
             </div>
          </div>

          {/* Description */}
          <div className="mb-10">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
               <div className="w-1 h-3 bg-primary rounded-full" />
               Mô tả chi tiết
            </h3>
            <p className="text-slate-600 leading-relaxed font-medium text-lg italic">
              {property.description}
            </p>
          </div>

          {/* Amenities (Placeholder for now) */}
          <div className="mb-10">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
               <div className="w-1 h-3 bg-primary rounded-full" />
               Tiện ích nổi bật
            </h3>
            <div className="flex flex-wrap gap-3">
               {['Điều hòa', 'Wifi miễn phí', 'Máy giặt', 'Bình nóng lạnh', 'Bãi đỗ xe', 'An ninh 24/7'].map((tag) => (
                 <div key={tag} className="px-4 py-2 bg-white border border-slate-100 rounded-2xl text-xs font-bold text-slate-500 flex items-center gap-2 hover:border-primary/30 transition-colors">
                   <CheckBadgeIcon className="h-4 w-4 text-primary" />
                   {tag}
                 </div>
               ))}
            </div>
          </div>

          {/* Landlord Contact */}
          <div className="p-8 bg-dark rounded-3xl text-white relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px]" />
             <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-white/10 p-1 border border-white/20 mb-4">
                  <img 
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${property.landlord.name}`} 
                    className="w-full h-full rounded-full" 
                    alt={property.landlord.name} 
                  />
                </div>
                <h4 className="text-xl font-black tracking-tight mb-1">{property.landlord.name}</h4>
                <div className="flex items-center gap-2 text-white/50 text-[10px] font-black uppercase tracking-widest mb-6">
                   <ShieldCheckIcon className="h-4 w-4 text-primary" />
                   Chủ nhà đã xác minh
                </div>
                
                <div className="flex gap-3 w-full">
                   <button className="flex-1 flex items-center justify-center gap-3 py-4 bg-primary text-dark rounded-3xl font-black text-sm hover:scale-[1.02] transition-transform active:scale-95 shadow-lg shadow-primary/20">
                      <ChatBubbleBottomCenterTextIcon className="h-5 w-5" />
                      NHẮN TIN NGAY
                   </button>
                   <button className="w-14 h-14 flex items-center justify-center bg-white/10 rounded-3xl hover:bg-white/20 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                      </svg>
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
