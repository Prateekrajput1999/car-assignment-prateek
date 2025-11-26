"use client";

import { X, Search } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/index";
import { useFilters } from "@/app/hooks/useFilters";
import { City } from "@/services/api";

interface CityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CityModal({ isOpen, onClose }: CityModalProps) {
  const { cities } = useSelector((state: RootState) => state.cities);
  const [searchQuery, setSearchQuery] = useState("");
  const { setSearchParams } = useFilters();

  if (!isOpen) return null;

  const filteredCities = cities.filter((city) =>
    city.city_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCitySelect = (city: City) => {
    // cityId is stored in URL params
    setSearchParams({
      cityId: city.city_id,
    });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            Choose any city where you would like to see cars
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 cursor-pointer hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Enter City"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredCities.map((city) => (
            <button
              key={city.city_id}
              onClick={() => handleCitySelect(city)}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-green-600 hover:shadow-md transition-all"
            >
              <div className="w-full h-24 bg-gray-200 rounded mb-2 flex items-center justify-center">
                <span className="text-gray-400 text-sm">
                  {city.city_name.charAt(0)}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {city.city_name}
              </span>
            </button>
          ))}
        </div>

        {filteredCities.length === 0 && (
          <div className="text-center py-8 text-gray-500">No cities found</div>
        )}
      </div>
    </div>
  );
}
