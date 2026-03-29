'use client'

import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})
L.Marker.prototype.options.icon = DefaultIcon

interface Property {
  id: string
  title: string
  latitude: number
  longitude: number
  price: number
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo(center, 13)
  }, [center, map])
  return null
}

export default function MapComponent({ 
  properties, 
  userLocation,
  radius = 5000 
}: { 
  properties: Property[], 
  userLocation: [number, number],
  radius?: number
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="w-full h-full bg-slate-100 animate-pulse" />

  return (
    <div className="w-full h-full relative overflow-hidden shadow-inner">
      <MapContainer 
        center={userLocation} 
        zoom={13} 
        scrollWheelZoom={true}
        className="w-full h-full z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        <MapUpdater center={userLocation} />

        {/* User Location Marker & Search Circle */}
        <Circle 
          center={userLocation} 
          radius={radius} 
          pathOptions={{ fillColor: '#c3f832', color: '#c3f832', fillOpacity: 0.1, weight: 1 }} 
        />
        <Marker position={userLocation}>
          <Popup>Vị trí của bạn</Popup>
        </Marker>

        {/* Property Markers */}
        {properties.map((property) => (
          property.latitude && property.longitude && (
            <Marker key={property.id} position={[property.latitude, property.longitude]}>
              <Popup>
                <div className="p-1">
                  <h4 className="font-bold text-dark mb-1">{property.title}</h4>
                  <p className="text-primary-dark font-black">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(property.price)}
                  </p>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>

      {/* Floating Info Overlay */}
      <div className="absolute bottom-10 left-10 z-20 glass p-4 rounded-3xl min-w-[200px] border-white/30 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
          <span className="text-xs font-bold text-dark uppercase tracking-wider">Đang xem khu vực</span>
        </div>
        <p className="text-sm text-slate-500">Hiển thị {properties.length} phòng trọ lân cận</p>
      </div>
    </div>
  )
}
