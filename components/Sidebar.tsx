'use client'

import React from 'react'
import Link from 'next/link'
import { 
  HomeIcon, 
  MapIcon, 
  UserGroupIcon, 
  ViewColumnsIcon, 
  Cog6ToothIcon
} from '@heroicons/react/24/outline'

const menuItems = [
  { icon: HomeIcon, label: 'Trang chủ', href: '/' },
  { icon: MapIcon, label: 'Khám phá', href: '/' },
  { icon: ViewColumnsIcon, label: 'Lưới', href: '/' },
  { icon: UserGroupIcon, label: 'Chủ nhà', href: '/' },
  { icon: Cog6ToothIcon, label: 'Cài đặt', href: '/' },
]

export default function Sidebar() {
  return (
    <aside className="w-20 lg:w-20 bg-white border-r border-slate-100 flex flex-col items-center py-8 gap-8 h-full">
      <div className="w-12 h-12 bg-dark rounded-2xl flex items-center justify-center text-primary shadow-lg shadow-lime-100/50 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 12h3v8h14v-8h3L12 2z"/>
        </svg>
      </div>

      <nav className="flex-grow flex flex-col gap-6 w-full px-2">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="group relative flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 hover:bg-slate-50 text-slate-400 hover:text-dark"
          >
            <item.icon className="h-6 w-6" />
            <span className="absolute left-20 bg-dark text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-slate-100 p-0.5 border border-slate-200 overflow-hidden cursor-pointer hover:scale-110 transition-transform">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
            alt="User avatar" 
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>
    </aside>
  )
}
