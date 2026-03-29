'use client'

import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gradient">
              TroVN
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className="px-3 py-2 rounded-md font-medium text-slate-800 hover:text-primary transition-colors">
                Trang chủ
              </Link>
              <Link href="/find" className="px-3 py-2 rounded-md font-medium text-slate-800 hover:text-primary transition-colors">
                Tìm trọ
              </Link>
              <Link href="/lands" className="px-3 py-2 rounded-md font-medium text-slate-800 hover:text-primary transition-colors">
                Chủ nhà
              </Link>
              <button className="bg-primary text-white px-5 py-2 rounded-full font-medium hover:bg-primary-hover shadow-lg shadow-indigo-200 transition-all active:scale-95">
                Đăng tin
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
