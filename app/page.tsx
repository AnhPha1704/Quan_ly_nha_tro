'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Sidebar from '@/components/Sidebar'
import PropertyGrid from '@/components/PropertyGrid'
import { MagnifyingGlassIcon, MapPinIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'

// Import Map component dynamically to avoid SSR errors with Leaflet
const MapComponent = dynamic(() => import('@/components/MapComponent'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-100 animate-pulse rounded-l-[40px]" />
})

export default function Home() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [userLocation, setUserLocation] = useState<[number, number]>([16.0471, 108.2062]) // Actual GPS
  const [searchLocation, setSearchLocation] = useState<[number, number]>([16.0471, 108.2062]) // Search focal point
  const [radius, setRadius] = useState(5) // Default 5km

  // Get User Location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const coords: [number, number] = [position.coords.latitude, position.coords.longitude]
        setUserLocation(coords)
        setSearchLocation(coords) // Sync search with real location on load
      }, (error) => {
        let message = "Không thể lấy vị trí mặc dù trình duyệt hỗ trợ."
        if (error.code === error.PERMISSION_DENIED) message = "Bạn đã chặn quyền truy cập vị trí."
        if (error.code === error.POSITION_UNAVAILABLE) message = "Thông tin vị trí không khả dụng."
        if (error.code === error.TIMEOUT) message = "Yêu cầu lấy vị trí hết thời gian chờ."
        console.warn("Geolocation Warning:", message)
        // Dùng vị trí mặc định (Đà Nẵng) nếu lỗi
      })
    }
  }, [])

  // Fetch Properties based on search location and radius
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true)
      try {
        const url = `/api/properties?lat=${searchLocation[0]}&lng=${searchLocation[1]}&radius=${radius}&q=${searchQuery}`
        const res = await fetch(url)
        const data = await res.json()
        setProperties(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to fetch properties:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [searchLocation, radius, searchQuery])

  return (
    <main className="main-layout font-sans">
      <Sidebar />

      <div className="flex-grow relative overflow-hidden">
        {/* Map Background */}
        <div className="absolute inset-0 z-0">
          <MapComponent 
            properties={properties} 
            userLocation={userLocation} 
            searchLocation={searchLocation}
            radius={radius * 1000} 
            onMapClick={(lat, lng) => setSearchLocation([lat, lng])}
          />
        </div>

        {/* Floating List Card */}
        <div className="absolute top-6 left-6 bottom-6 w-[440px] z-10 flex flex-col floating-card overflow-hidden">
          {/* Header Inside Card */}
          <header className="p-6 pb-2 bg-white/80 backdrop-blur-md z-20">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-black text-dark tracking-tighter italic">TroVN <span className="text-primary">.</span></h1>
            </div>

            <div className="relative group">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Tìm khu vực, tên phòng..." 
                className="w-full h-12 pl-12 pr-4 bg-slate-50 border-2 border-transparent focus:border-primary/20 rounded-2xl outline-none font-bold text-dark placeholder:text-slate-300 transition-all text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2 mt-4 overflow-x-auto pb-2 no-scrollbar">
               <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-dark text-primary rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer shadow-lg">
                 Gần tôi
               </div>
               <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:border-slate-300 transition-colors">
                 Giá rẻ
               </div>
               <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:border-slate-300 transition-colors">
                 Phòng mới
               </div>
               <button className="ml-auto w-8 h-8 flex-shrink-0 bg-white border border-slate-100 rounded-lg flex items-center justify-center text-slate-400 hover:text-dark">
                 <AdjustmentsHorizontalIcon className="h-4 w-4" />
               </button>
            </div>
          </header>

          {/* Scrollable list */}
          <div className="flex-grow overflow-y-auto no-scrollbar bg-white">
            <PropertyGrid properties={properties} loading={loading} />
          </div>
        </div>
      </div>
    </main>
  )
}
