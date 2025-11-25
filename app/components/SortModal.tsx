'use client';

import { X } from 'lucide-react';
import { useFilters } from '@/app/hooks/useFilters';

interface SortModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SortModal({ isOpen, onClose }: SortModalProps) {
  const { getFilters, setSearchParams } = useFilters();
  const { sortBy, sortOrder } = getFilters();

  if (!isOpen) return null;

  const handleSort = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSearchParams({
      sortBy: newSortBy,
      sortOrder: newSortOrder,
    });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Choose</h2>
          <button onClick={onClose} className="text-gray-500 cursor-pointer hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Price</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="price"
                  checked={sortBy === 'price' && sortOrder === 'asc'}
                  onChange={() => handleSort('price', 'asc')}
                  className="w-4 h-4 text-green-600"
                />
                <span className="text-gray-700">Low To High</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="price"
                  checked={sortBy === 'price' && sortOrder === 'desc'}
                  onChange={() => handleSort('price', 'desc')}
                  className="w-4 h-4 text-green-600"
                />
                <span className="text-gray-700">High To Low</span>
              </label>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3">KM Driven</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="km"
                  checked={sortBy === 'km_driven' && sortOrder === 'asc'}
                  onChange={() => handleSort('km_driven', 'asc')}
                  className="w-4 h-4 text-green-600"
                />
                <span className="text-gray-700">Low To High</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="km"
                  checked={sortBy === 'km_driven' && sortOrder === 'desc'}
                  onChange={() => handleSort('km_driven', 'desc')}
                  className="w-4 h-4 text-green-600"
                />
                <span className="text-gray-700">High To Low</span>
              </label>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Car&apos;s Age</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="age"
                  checked={sortBy === 'year' && sortOrder === 'desc'}
                  onChange={() => handleSort('year', 'desc')}
                  className="w-4 h-4 text-green-600"
                />
                <span className="text-gray-700">New To Old</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="age"
                  checked={sortBy === 'year' && sortOrder === 'asc'}
                  onChange={() => handleSort('year', 'asc')}
                  className="w-4 h-4 text-green-600"
                />
                <span className="text-gray-700">Old To New</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

