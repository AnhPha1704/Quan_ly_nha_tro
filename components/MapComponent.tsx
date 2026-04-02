'use client'

import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from 'react-leaflet'
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

// Custom User Location Icon (Pulsating Blue Dot)
const userLocationIcon = L.divIcon({
  className: 'user-location-marker',
  html: '<div class="user-location-pulse"></div><div class="user-location-dot"></div>',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
})

// Function to create Price Tag Marker for properties
const createPriceIcon = (price: number) => {
  const formattedPrice = new Intl.NumberFormat('vi-VN', { 
    notation: 'compact',
    maximumFractionDigits: 1 
  }).format(price).replace('TR', 'tr')

  return L.divIcon({
    className: 'price-marker-wrapped',
    html: `<div class="price-marker">${formattedPrice}</div>`,
    iconSize: [60, 30],
    iconAnchor: [30, 15],
  })
}

interface Property {
  id: string
  title: string
  latitude: number
  longitude: number
  price: number
}

function MapController({ center }: { center: [number, number] }) {
  const map = useMap()
  const isAutoCenterBlocked = React.useRef(false)

  useEffect(() => {
    // Ngắt tự động centering nếu người dùng đã tương tác với bản đồ
    const blockAutoCenter = () => {
      isAutoCenterBlocked.current = true
    }

    map.on('dragstart', blockAutoCenter)
    map.on('zoomstart', blockAutoCenter)

    return () => {
      map.off('dragstart', blockAutoCenter)
      map.off('zoomstart', blockAutoCenter)
    }
  }, [map])

  useEffect(() => {
    // Nếu tọa độ khác với mặc định (Việt Nam Center), thực hiện bay tới vị trí người dùng
    if (!isAutoCenterBlocked.current && center[0] !== 16.0471) {
      setTimeout(() => {
        map.flyTo(center, 13, {
          duration: 1.5,
          easeLinearity: 0.5
        })
        isAutoCenterBlocked.current = true
      }, 1000)
    }
  }, [center, map])

  return null
}

function CustomZoomControls({ onLocate }: { onLocate?: (lat: number, lng: number) => void }) {
  const map = useMap()
  const [isLocating, setIsLocating] = useState(false)

  const handleLocate = () => {
    if ("geolocation" in navigator) {
      setIsLocating(true)
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords
        
        // Cập nhật tâm điểm tìm kiếm ở component cha
        if (onLocate) {
          onLocate(latitude, longitude)
        }

        map.stop() // Dừng mọi hiệu ứng cũ
        setTimeout(() => {
          map.flyTo([latitude, longitude], 15, {
            animate: true,
            duration: 1.5
          })
          setIsLocating(false)
        }, 100)
      }, (error) => {
        console.warn("Locate error:", error.message)
        setIsLocating(false)
      }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      })
    }
  }

  return (
    <div className="absolute bottom-10 right-10 z-[1000] flex flex-col gap-3">
      <button
        onClick={handleLocate}
        disabled={isLocating}
        className={`w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-dark shadow-xl border border-slate-100 hover:bg-primary hover:text-dark transition-all active:scale-90 group ${isLocating ? 'animate-pulse' : ''}`}
        title="Vị trí của tôi"
      >
        {isLocating ? (
          <div className="w-5 h-5 border-2 border-dark/20 border-t-dark rounded-full animate-spin" />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
        )}
      </button>

      <div className="flex flex-col gap-1 bg-white rounded-2xl p-1 shadow-xl border border-slate-100 overflow-hidden">
        <button
          onClick={() => map.zoomIn()}
          className="w-10 h-10 bg-white hover:bg-slate-50 rounded-xl flex items-center justify-center text-dark transition-all active:scale-90 font-black text-lg"
          title="Phóng to"
        >
          +
        </button>
        <div className="h-[1px] bg-slate-100 mx-2" />
        <button
          onClick={() => map.zoomOut()}
          className="w-10 h-10 bg-white hover:bg-slate-50 rounded-xl flex items-center justify-center text-dark transition-all active:scale-90 font-black text-lg"
          title="Thu nhỏ"
        >
          −
        </button>
      </div>
    </div>
  )
}

function MapEvents({ setIsMoving, onMapClick }: { setIsMoving: (moving: boolean) => void, onMapClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    movestart: () => setIsMoving(true),
    moveend: () => setIsMoving(false),
    click: (e) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng)
      }
    }
  })
  return null
}

export default function MapComponent({
  properties,
  userLocation,
  searchLocation,
  radius = 5000,
  onMapClick
}: {
  properties: Property[],
  userLocation: [number, number],
  searchLocation: [number, number],
  radius?: number,
  onMapClick?: (lat: number, lng: number) => void
}) {
  const [mounted, setMounted] = useState(false)
  const [isMoving, setIsMoving] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="w-full h-full bg-slate-100 animate-pulse" />

  return (
    <div className="w-full h-full relative overflow-hidden shadow-inner">
      <MapContainer
        center={userLocation}
        zoom={6}
        scrollWheelZoom={true}
        zoomControl={false}
        className="w-full h-full z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <MapController center={searchLocation} />
        <CustomZoomControls onLocate={onMapClick} />
        <MapEvents setIsMoving={setIsMoving} onMapClick={onMapClick} />

        {/* User Location Marker & Search Circle */}
        {!isMoving && (
          <Circle
            center={searchLocation}
            radius={radius}
            pathOptions={{ fillColor: '#c3f832', color: '#c3f832', fillOpacity: 0.1, weight: 1 }}
          />
        )}
        <Marker 
          position={userLocation} 
          icon={userLocationIcon}
          eventHandlers={{
            click: (e) => {
              if (onMapClick) {
                onMapClick(userLocation[0], userLocation[1])
              }
              // Prevent the map click event from firing too
              L.DomEvent.stopPropagation(e)
            }
          }}
        >
          <Popup>Vị trí của bạn (Nhấn để tìm quanh đây)</Popup>
        </Marker>

        {/* Property Markers */}
        {properties.map((property) => (
          property.latitude && property.longitude && (
            <Marker 
              key={property.id} 
              position={[property.latitude, property.longitude]}
              icon={createPriceIcon(property.price)}
            >
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
