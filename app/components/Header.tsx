"use client";

import { useSelector, useDispatch } from "react-redux";
import { MapPin, ChevronDown } from "lucide-react";
import { RootState, AppDispatch } from "@/store/index";
import { useFilters } from "@/app/hooks/useFilters";
import { useEffect } from "react";
import { resetPriceYearRanges } from "@/store/slices/carsSlice";

interface HeaderProps {
  onCityClick?: () => void;
}

export default function Header({ onCityClick }: HeaderProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { cities } = useSelector((state: RootState) => state.cities);
  const { getFilters } = useFilters();
  const { cityId } = getFilters();

  const selectedCity = cityId
    ? cities.find((city) => city.city_id === cityId) || null
    : null;

  useEffect(() => {
    dispatch(resetPriceYearRanges());
  }, [selectedCity?.city_id, dispatch])

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-green-600">nxcar</div>
          </div>

          <div className="flex-1 flex items-center justify-center mx-2">
            <button
              onClick={onCityClick}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-sm sm:text-base"
            >
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-medium truncate max-w-[120px] sm:max-w-none">
                {selectedCity?.city_name || "Select City"}
              </span>
              <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
