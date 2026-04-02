'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Sidebar from '@/components/Sidebar'
import PropertyGrid from '@/components/PropertyGrid'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'

import PropertyDetailSkeleton from '@/components/PropertyDetailSkeleton'

const MapComponent = dynamic(() => import('@/components/MapComponent'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-100 animate-pulse rounded-l-[40px]" />
})

const PropertyDetail = dynamic(() => import('@/components/PropertyDetail'), {
  ssr: false,
  loading: () => <PropertyDetailSkeleton />
})

export default function Home() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isLocatingGps, setIsLocatingGps] = useState(true) 
  const [searchQuery, setSearchQuery] = useState('')
  const [userLocation, setUserLocation] = useState<[number, number]>([16.0471, 108.2062]) 
  const [searchLocation, setSearchLocation] = useState<[number, number]>([16.0471, 108.2062]) 
  const [currentLocationName, setCurrentLocationName] = useState('Đà Nẵng') // Real-time location name
  const [radius, setRadius] = useState(5) 
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null)

  // 1. Get User Location First
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const coords: [number, number] = [position.coords.latitude, position.coords.longitude]
        setUserLocation(coords)
        setSearchLocation(coords)
        setIsLocatingGps(false)
      }, (error) => {
        console.warn("Geolocation Error:", error.message)
        setIsLocatingGps(false)
      })
    } else {
      setIsLocatingGps(false)
    }
  }, [])

  // 1.5. Reverse Geocoding for display name
  useEffect(() => {
     const fetchAddress = async () => {
       try {
         const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${searchLocation[0]}&lon=${searchLocation[1]}`)
         const data = await response.json()
         if (data && data.address) {
           const addr = data.address
           const name = addr.suburb || addr.town || addr.city || addr.quarter || addr.suburb || addr.village || 'Khu vực tìm kiếm'
           setCurrentLocationName(name)
         }
       } catch (err) {
         console.warn("Reverse Geocoding Failed:", err)
       }
     }
     
     if (!isLocatingGps) {
       fetchAddress()
     }
  }, [searchLocation, isLocatingGps])

  // 2. Fetch Properties only after GPS is handled
  useEffect(() => {
    if (isLocatingGps) return 

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
        setTimeout(() => setLoading(false), 500) // Added a tiny extra delay for smoothness
      }
    }

    fetchProperties()
  }, [searchLocation, radius, searchQuery, isLocatingGps])

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
                locationName={currentLocationName}
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
