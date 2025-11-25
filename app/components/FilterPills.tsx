'use client';

import { X } from 'lucide-react';
import { useFilters } from '@/app/hooks/useFilters';

const PRICE_MIN = 90000;
const PRICE_MAX = 3600000;
const YEAR_MIN = 2010;
const YEAR_MAX = 2025;

export default function FilterPills() {
  const { getFilters, setSearchParams } = useFilters();
  const filters = getFilters();

  const isPriceDefault =
    filters.priceMin === PRICE_MIN && filters.priceMax === PRICE_MAX;
  const isYearDefault =
    filters.yearMin === YEAR_MIN && filters.yearMax === YEAR_MAX;
  const hasMakes = filters.makes.length > 0;
  const hasModels = filters.models.length > 0;
  const hasSort = filters.sortBy !== null;

  const hasActiveFilters =
    !isPriceDefault || !isYearDefault || hasMakes || hasModels || hasSort;

  if (!hasActiveFilters) {
    return null;
  }

  const formatPrice = (price: number) => {
    const lakhs = Math.round(price / 100000);
    return `${lakhs} L`;
  };

  const handleRemovePrice = () => {
    setSearchParams({
      priceMin: PRICE_MIN,
      priceMax: PRICE_MAX,
    });
  };

  const handleRemoveYear = () => {
    setSearchParams({
      yearMin: YEAR_MIN,
      yearMax: YEAR_MAX,
    });
  };

  const handleRemoveMake = (make: string) => {
    setSearchParams({
      makes: filters.makes.filter((m) => m !== make),
    });
  };

  const handleRemoveModel = (model: string) => {
    setSearchParams({
      models: filters.models.filter((m) => m !== model),
    });
  };

  const handleRemoveSort = () => {
    setSearchParams({
      sortBy: null,
      sortOrder: null,
    });
  };

  const getSortLabel = () => {
    if (!filters.sortBy) return '';
    const labels: Record<string, string> = {
      price: 'Price',
      km_driven: 'Mileage',
      year: "Car's Age",
    };
    const order = filters.sortOrder === 'asc' ? 'Low to High' : 'High to Low';
    return `${labels[filters.sortBy]} - ${order}`;
  };

  const handleClearAll = () => {
    setSearchParams({
      priceMin: PRICE_MIN,
      priceMax: PRICE_MAX,
      yearMin: YEAR_MIN,
      yearMax: YEAR_MAX,
      makes: [],
      models: [],
      sortBy: null,
      sortOrder: null,
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <button
        onClick={handleClearAll}
        className="cursor-pointer px-4 py-1.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
      >
        Clear All
      </button>

      {!isPriceDefault && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700">
          <span>
            {formatPrice(filters.priceMin)} - {formatPrice(filters.priceMax)}
          </span>
          <button
            onClick={handleRemovePrice}
            className="cursor-pointer ml-0.5 hover:text-gray-900 transition-colors"
            aria-label="Remove price filter"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {!isYearDefault && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700">
          <span>
            {filters.yearMin} - {filters.yearMax}
          </span>
          <button
            onClick={handleRemoveYear}
            className="ml-0.5 hover:text-gray-900 transition-colors"
            aria-label="Remove year filter"
          >
            <X className="cursor-pointer w-4 h-4" />
          </button>
        </div>
      )}

      {filters.makes.map((make) => (
        <div
          key={`make-${make}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700"
        >
          <span>{make}</span>
          <button
            onClick={() => handleRemoveMake(make)}
            className="cursor-pointer ml-0.5 hover:text-gray-900 transition-colors"
            aria-label={`Remove ${make} filter`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}

      {filters.models.map((model) => (
        <div
          key={`model-${model}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700"
        >
          <span>{model}</span>
          <button
            onClick={() => handleRemoveModel(model)}
            className="cursor-pointer ml-0.5 hover:text-gray-900 transition-colors"
            aria-label={`Remove ${model} filter`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}

      {hasSort && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700">
          <span>Sort: {getSortLabel()}</span>
          <button
            onClick={handleRemoveSort}
            className="cursor-pointer ml-0.5 hover:text-gray-900 transition-colors"
            aria-label="Remove sort filter"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

