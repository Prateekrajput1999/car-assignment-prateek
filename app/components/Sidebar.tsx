'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { useFilters } from '@/app/hooks/useFilters';
import DualRangeSlider from './DualRangeSlider';
import MakeModelFilter from './MakeModelFilter';

const PRICE_MIN = 90000;
const PRICE_MAX = 3600000;
const YEAR_MIN = 2010;
const YEAR_MAX = 2025;

export default function Sidebar() {
  const { getFilters, setSearchParams } = useFilters();
  const filters = getFilters();

  const priceMin = filters.priceMin;
  const priceMax = filters.priceMax;

  const isCheckedPrice = (label: string) => {
    if (label === 'Under 3 Lakh') {
      return priceMax <= 300000;
    }
    if (label === '3-5 Lakh') {
      return priceMin === 300000 && priceMax === 500000;
    }
    if (label === '5-7 Lakh') {
      return priceMin === 500000 && priceMax === 700000;
    }

    if (label === '7-10 Lakh') {
      return priceMin === 700000 && priceMax === 1000000;
    }

    if (label === 'Above 10 Lakh') {
      return priceMin === 1000000;
    }

    return false;
  }

  const [expandedSections, setExpandedSections] = useState({
    price: true,
    makeModel: false,
    year: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const priceCategories = [
    { label: 'Under 3 Lakh', min: 0, max: 300000 },
    { label: '3-5 Lakh', min: 300000, max: 500000 },
    { label: '5-7 Lakh', min: 500000, max: 700000 },
    { label: '7-10 Lakh', min: 700000, max: 1000000 },
    { label: 'Above 10 Lakh', min: 1000000, max: Infinity },
  ];

  const handlePriceCategoryClick = (min: number, max: number) => {
    setSearchParams({
      priceMin: min,
      priceMax: max === Infinity ? PRICE_MAX : max,
    });
  };

  return (
    <div className="w-96 bg-white border-r border-gray-200 p-4 space-y-4 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="border border-gray-200 rounded-lg p-4">
        <div
          className="flex items-center justify-between cursor-pointer mb-3"
          onClick={() => toggleSection('price')}
        >
          <h3 className="font-semibold text-gray-800">Price Range</h3>
          {expandedSections.price ? (
            <Minus className="w-4 h-4 text-gray-600" />
          ) : (
            <Plus className="w-4 h-4 text-gray-600" />
          )}
        </div>
        {expandedSections.price && (
          <div className="space-y-4">
            <DualRangeSlider
              rangeMin={PRICE_MIN}
              rangeMax={PRICE_MAX}
              min={filters.priceMin}
              max={filters.priceMax}
              step={50000}
              onChange={(min, max) => {
                setSearchParams({
                  priceMin: min,
                  priceMax: max,
                });
              }}
              formatValue={(value) => `₹ ${value.toLocaleString('en-IN')}`}
            />
            <div className="space-y-2">
              {priceCategories.map((category) => (
                <label
                  key={category.label}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="price"
                    className="w-4 h-4 text-green-600"
                    checked={isCheckedPrice(category.label)}
                    onChange={() => handlePriceCategoryClick(category.min, category.max)}
                  />
                  <span className="text-sm text-gray-700">{category.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <div
          className="flex items-center justify-between cursor-pointer mb-3"
          onClick={() => toggleSection('makeModel')}
        >
          <h3 className="font-semibold text-gray-800">Make + Model</h3>
          {expandedSections.makeModel ? (
            <Minus className="w-4 h-4 text-gray-600" />
          ) : (
            <Plus className="w-4 h-4 text-gray-600" />
          )}
        </div>
        {expandedSections.makeModel && (
          <div className="mt-3">
            <MakeModelFilter />
          </div>
        )}
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <div
          className="flex items-center justify-between cursor-pointer mb-3"
          onClick={() => toggleSection('year')}
        >
          <h3 className="font-semibold text-gray-800">Make Year</h3>
          {expandedSections.year ? (
            <Minus className="w-4 h-4 text-gray-600" />
          ) : (
            <Plus className="w-4 h-4 text-gray-600" />
          )}
        </div>
        {expandedSections.year && (
          <DualRangeSlider
            rangeMin={YEAR_MIN}
            rangeMax={YEAR_MAX}
            min={filters.yearMin}
            max={filters.yearMax}
            step={1}
            onChange={(min, max) => {
              setSearchParams({
                yearMin: min,
                yearMax: max,
              });
            }}
          />
        )}
      </div>
    </div>
  );
}

