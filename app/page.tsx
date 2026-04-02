'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Sidebar from '@/components/Sidebar'
import PropertyGrid from '@/components/PropertyGrid'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'

// Import Map component dynamically to avoid SSR errors with Leaflet
const MapComponent = dynamic(() => import('@/components/MapComponent'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-100 animate-pulse rounded-l-[40px]" />
})

const PropertyDetail = dynamic(() => import('@/components/PropertyDetail'), {
  ssr: false
})

export default function Home() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [userLocation, setUserLocation] = useState<[number, number]>([16.0471, 108.2062]) // Actual GPS
  const [searchLocation, setSearchLocation] = useState<[number, number]>([16.0471, 108.2062]) // Search focal point
  const [radius, setRadius] = useState(5) // Default 5km
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null)

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
            onSelect={(p) => setSelectedProperty(p)}
          />
        </div>

        {/* Floating List Card */}
        <div className={`absolute top-6 left-6 bottom-6 transition-all duration-500 ease-in-out z-10 flex floating-card overflow-hidden ${selectedProperty ? 'w-[950px]' : 'w-[400px]'}`}>
          
          {/* Master View (List) */}
          <div className="w-[400px] flex-shrink-0 flex flex-col transition-all duration-500 bg-white border-r border-slate-50">
            {/* Header Inside Card */}
            <header className="p-6 pb-5 bg-white/90 backdrop-blur-xl z-20 border-b border-slate-50 sticky top-0">
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

              <div className="flex gap-2 mt-4 overflow-x-auto pb-1 no-scrollbar">
                 <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-dark text-primary rounded-full text-[10px] font-black uppercase tracking-widest cursor-pointer shadow-lg">
                   Gần tôi
                 </div>
                 <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest cursor-pointer hover:border-slate-300 transition-colors">
                   Giá rẻ
                 </div>
                 <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest cursor-pointer hover:border-slate-300 transition-colors">
                   Phòng mới
                 </div>
              </div>
            </header>

            {/* Scrollable list */}
            <div className="flex-grow overflow-y-auto no-scrollbar">
              <PropertyGrid 
                properties={properties} 
                loading={loading} 
                onSelect={(p) => setSelectedProperty(p)}
                selectedId={selectedProperty?.id}
                isCompact={true}
              />
            </div>
          </div>

          {/* Detail View */}
          {selectedProperty && (
            <div className="flex-grow h-full bg-white overflow-hidden">
               <PropertyDetail 
                property={selectedProperty} 
                onClose={() => setSelectedProperty(null)} 
               />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
