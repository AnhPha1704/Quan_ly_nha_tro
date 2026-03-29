'use client'

import { useState } from 'react'

export default function SearchHero({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">
          Tìm kiếm <span className="text-gradient">không gian sống</span> <br /> lý tưởng của bạn
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
          Hệ thống tra cứu phòng trọ và nhà nguyên căn hiện đại nhất, giúp bạn tìm được nơi ở ưng ý chỉ trong vài cú click.
        </p>

        <form onSubmit={handleSearch} className="max-w-3xl mx-auto glass p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2">
          <div className="flex-grow flex items-center px-4 py-2 gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Nhập địa điểm, tên đường hoặc loại phòng..."
              className="w-full bg-transparent border-none focus:ring-0 text-slate-800 placeholder-slate-400 text-lg"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-hover shadow-lg transition-all active:scale-95 text-lg">
            Tìm kiếm ngay
          </button>
        </form>

        <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm font-medium text-slate-500">
          <span>Xu hướng:</span>
          <button className="px-3 py-1 bg-white rounded-full border border-slate-200 hover:border-primary hover:text-primary transition-all">Quận 1</button>
          <button className="px-3 py-1 bg-white rounded-full border border-slate-200 hover:border-primary hover:text-primary transition-all">Thủ Đức</button>
          <button className="px-3 py-1 bg-white rounded-full border border-slate-200 hover:border-primary hover:text-primary transition-all">Phòng sinh viên</button>
          <button className="px-3 py-1 bg-white rounded-full border border-slate-200 hover:border-primary hover:text-primary transition-all">Nhà nguyên căn</button>
        </div>
      </div>
    </div>
  )
}
