'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import SearchHero from '@/components/SearchHero'
import PropertyGrid from '@/components/PropertyGrid'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      
      <SearchHero onSearch={(q) => setSearchQuery(q)} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <PropertyGrid query={searchQuery} />
      </section>

      <footer className="bg-slate-900 py-12 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400">
          <p>© 2026 TroVN - Nền tảng tìm kiếm và quản lý nhà trọ tiên phong.</p>
        </div>
      </footer>
    </main>
  )
}
