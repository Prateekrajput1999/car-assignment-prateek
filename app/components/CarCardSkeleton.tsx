'use client';

export default function CarCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="relative aspect-video bg-gray-200 animate-pulse"></div>

      <div className="p-4 space-y-2">
        <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4"></div>
        
        <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
        
        <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3"></div>
        
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
        
        <div className="pt-2 space-y-1">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

