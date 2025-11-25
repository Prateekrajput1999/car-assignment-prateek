import { AppDispatch } from "@/store";
import { fetchCars } from "@/store/slices/carsSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useFilters } from "./useFilters";
import type {
  FilterRange,
  FilterMultiselect,
  FilterCity,
} from "@/services/api";

const useGetCars = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { getFilters } = useFilters();
  const filters = getFilters();

  const makesJSON = JSON.stringify(filters.makes);
  const modelsJSON = JSON.stringify(filters.models);

  useEffect(() => {
    const makesArray = JSON.parse(makesJSON);
    const modelsArray = JSON.parse(modelsJSON);
    const cityId = filters.cityId;

    const fltr: (FilterRange | FilterMultiselect | FilterCity)[] = [
      {
        type: "range" as const,
        name: "year" as const,
        selected_min: filters.yearMin,
        selected_max: filters.yearMax,
        min: filters.yearMin,
        max: filters.yearMax,
      },
      {
        type: "range" as const,
        name: "price" as const,
        selected_min: filters.priceMin,
        selected_max: filters.priceMax,
        min: filters.priceMin,
        max: filters.priceMax,
      },
      {
        type: "multiselect" as const,
        name: "make" as const,
        options: makesArray,
      },
      {
        type: "multiselect" as const,
        name: "model" as const,
        options: modelsArray,
      },
    ];

    if (cityId !== null) {
      fltr.push({ city_id: cityId });
    }

    const payload = {
      page: 1,
      fltr,
      sort: filters.sortBy ? `${filters.sortOrder}` : null,
      sort_by: filters.sortBy,
    };

    dispatch(fetchCars(payload));
  }, [
    dispatch,
    filters.priceMin,
    filters.priceMax,
    filters.yearMin,
    filters.yearMax,
    makesJSON,
    modelsJSON,
    filters.cityId,
    filters.sortBy,
    filters.sortOrder,
  ]);
};

export default useGetCars;
