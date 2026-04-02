'use client'

import React from 'react'

export default function PropertyDetailSkeleton() {
  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-100 overflow-hidden animate-pulse">
      {/* Header Skeleton */}
      <div className="p-6 flex items-center justify-between border-b border-slate-50 bg-white sticky top-0 z-30">
        <div className="h-6 bg-slate-100 rounded-lg w-1/3 shimmer" />
        <div className="w-10 h-10 rounded-full bg-slate-50 shimmer" />
      </div>

      <div className="flex-grow overflow-y-auto no-scrollbar pb-10">
        {/* Image Gallery Skeleton */}
        <div className="px-6 mt-6">
          <div className="rounded-3xl aspect-[16/10] bg-slate-100 shadow-sm shimmer" />
        </div>

        {/* Info Content Skeleton */}
        <div className="px-8 mt-10">
          <div className="flex justify-between items-start mb-6">
            <div className="h-8 bg-slate-100 rounded-lg w-1/2 shimmer" />
            <div className="text-right flex flex-col items-end gap-2 text-slate-100">
              <div className="h-6 bg-slate-100 rounded-lg w-24 shimmer" />
              <div className="h-3 bg-slate-50 rounded-lg w-16 shimmer" />
            </div>
          </div>

          <div className="h-12 bg-slate-50 rounded-2xl border border-slate-100/50 mb-8 w-full shimmer" />

          <div className="grid grid-cols-2 gap-4 mb-10 text-slate-100">
             <div className="p-6 bg-slate-50 rounded-2xl flex items-center gap-4 border border-slate-100/30 shimmer">
                <div className="w-12 h-12 bg-white/50 rounded-2xl shadow-sm" />
                <div className="flex flex-col gap-2 flex-grow">
                   <div className="h-2 bg-white/50 rounded w-1/2" />
                   <div className="h-4 bg-white/50 rounded w-3/4" />
                </div>
             </div>
             <div className="p-6 bg-slate-50 rounded-2xl flex items-center gap-4 border border-slate-100/30 shimmer">
                <div className="w-12 h-12 bg-white/50 rounded-2xl shadow-sm" />
                <div className="flex flex-col gap-2 flex-grow">
                   <div className="h-2 bg-white/50 rounded w-1/2" />
                   <div className="h-4 bg-white/50 rounded w-3/4" />
                </div>
             </div>
          </div>

          {/* Description Skeleton */}
          <div className="mb-10 flex flex-col gap-3">
             <div className="h-3 bg-slate-100 rounded w-1/4 mb-2 shimmer" />
             <div className="h-4 bg-slate-50 rounded w-full shimmer" />
             <div className="h-4 bg-slate-50 rounded w-full shimmer" />
             <div className="h-4 bg-slate-50 rounded w-2/3 shimmer" />
          </div>

          {/* Contact Skeleton */}
          <div className="p-8 bg-slate-100 rounded-3xl relative overflow-hidden h-48 flex flex-col items-center justify-center gap-4 shimmer">
             <div className="w-16 h-16 rounded-full bg-white/50" />
             <div className="h-4 bg-white/50 rounded w-1/3" />
             <div className="h-12 bg-white/50 rounded-2xl w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
