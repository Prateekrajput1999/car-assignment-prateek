'use client';

import { useState, useMemo } from 'react';
import { Minus, Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { setPriceRange, setYearRange } from '@/store/slices/carsSlice';
import DualRangeSlider from './DualRangeSlider';
import MakeModelFilter from './MakeModelFilter';

export default function Sidebar() {
  const dispatch = useDispatch<AppDispatch>();
  const apiFilters = useSelector((state: RootState) => state.cars.apiFilters);
  const minPrice = useSelector((state: RootState) => state.cars.minPrice);
  const maxPrice = useSelector((state: RootState) => state.cars.maxPrice);
  const minYear = useSelector((state: RootState) => state.cars.minYear);
  const maxYear = useSelector((state: RootState) => state.cars.maxYear);

  // Get price and year filters from apiFilters
  const priceFilter = useMemo(() => apiFilters.find((f) => f.name === "price"), [apiFilters]);
  const yearFilter = useMemo(() => apiFilters.find((f) => f.name === "year"), [apiFilters]);

  // Use min/max as defaults when selected values are null
  const priceMin = priceFilter ? (parseInt(priceFilter.selected_min, 10) || minPrice || 0) : (minPrice || 0);
  const priceMax = priceFilter ? (parseInt(priceFilter.selected_max, 10) || maxPrice || 0) : (maxPrice || 0);
  const yearMin = yearFilter ? (parseInt(yearFilter.selected_min, 10) || minYear || 0) : (minYear || 0);
  const yearMax = yearFilter ? (parseInt(yearFilter.selected_max, 10) || maxYear || 0) : (maxYear || 0);

  // Use max allowed range from CarState
  const priceRangeMin = minPrice;
  const priceRangeMax = maxPrice;
  const yearRangeMin = minYear;
  const yearRangeMax = maxYear;

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
    dispatch(setPriceRange({
      selectedMin: min,
      selectedMax: max === Infinity ? (priceRangeMax ?? 0) : max,
    }));
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
        {expandedSections.price && priceRangeMin !== null && priceRangeMax !== null && (
          <div className="space-y-4">
            <DualRangeSlider
              rangeMin={priceRangeMin}
              rangeMax={priceRangeMax}
              min={priceMin}
              max={priceMax}
              step={50000}
              onChange={(min, max) => {
                dispatch(setPriceRange({ selectedMin: min, selectedMax: max }));
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
        {expandedSections.year && yearRangeMin !== null && yearRangeMax !== null && (
          <DualRangeSlider
            rangeMin={yearRangeMin}
            rangeMax={yearRangeMax}
            min={yearMin}
            max={yearMax}
            step={1}
            onChange={(min, max) => {
              dispatch(setYearRange({ selectedMin: min, selectedMax: max }));
            }}
          />
        )}
      </div>
    </div>
  );
}

