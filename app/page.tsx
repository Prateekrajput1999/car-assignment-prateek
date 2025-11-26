"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown } from "lucide-react";
import { AppDispatch, RootState } from "@/store/index";
import { fetchCities } from "@/store/slices/citiesSlice";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import CarGrid from "./components/CarGrid";
import SortModal from "./components/SortModal";
import CityModal from "./components/CityModal";
import useGetCars from "./hooks/useGetCars";
import { useFilters } from "./hooks/useFilters";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const [sortModalOpen, setSortModalOpen] = useState(false);
  const [cityModalOpen, setCityModalOpen] = useState(false);

  const { cities } = useSelector((state: RootState) => state.cities);
  const { total } = useSelector((state: RootState) => state.cars);
  const { getFilters } = useFilters();
  const { sortBy, sortOrder, cityId } = getFilters(); // cityId comes from URL params

  useEffect(() => {
    dispatch(fetchCities());
  }, [dispatch]);

  const selectedCity = cityId
    ? cities.find((city) => city.city_id === cityId) || null
    : null;

  useGetCars();

  const getSortLabel = () => {
    if (!sortBy) return "None";
    const labels: Record<string, string> = {
      price: "Price",
      km_driven: "Mileage",
      year: "Car's Age",
    };
    const order = sortOrder === "asc" ? "Low to High" : "High to Low";
    return `${labels[sortBy]} - ${order}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onCityClick={() => setCityModalOpen(true)} />
      <div className="flex flex-col lg:flex-row">
        <aside className="hidden lg:block">
          <Sidebar />
        </aside>
        <main className="flex-1 p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {total} Used cars in {selectedCity?.city_name || "your city"}
            </h1>
            <button
              onClick={() => setSortModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 whitespace-nowrap"
            >
              <span>Sort By: {getSortLabel()}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <CarGrid />
        </main>
      </div>

      <SortModal
        isOpen={sortModalOpen}
        onClose={() => setSortModalOpen(false)}
      />
      <CityModal
        isOpen={cityModalOpen}
        onClose={() => setCityModalOpen(false)}
      />
    </div>
  );
}
