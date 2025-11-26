import { AppDispatch, RootState } from "@/store";
import { fetchCars } from "@/store/slices/carsSlice";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFilters } from "./useFilters";
import type {
  FilterRange,
  FilterMultiselect,
  FilterCity,
} from "@/services/api";

const useGetCars = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { getFilters } = useFilters();
  const sortFilters = getFilters(); // Only cityId and sort from URL

  // Get filter values from apiFilters
  const apiFilters = useSelector((state: RootState) => state.cars.apiFilters);
  const makes = useSelector((state: RootState) => state.cars.makes);
  const models = useSelector((state: RootState) => state.cars.models);

  const priceFilter = useMemo(
    () => apiFilters.find((f) => f.name === "price"),
    [apiFilters]
  );
  const yearFilter = useMemo(
    () => apiFilters.find((f) => f.name === "year"),
    [apiFilters]
  );

  const makesJSON = JSON.stringify(makes);
  const modelsJSON = JSON.stringify(models);

  useEffect(() => {
    const makesArray = JSON.parse(makesJSON);
    const modelsArray = JSON.parse(modelsJSON);
    const cityId = sortFilters.cityId; // Get from URL params

    // Use selected_min/selected_max from apiFilters
    const priceSelectedMin = priceFilter ? parseInt(priceFilter.selected_min, 10) : null;
    const priceSelectedMax = priceFilter ? parseInt(priceFilter.selected_max, 10) : null;
    const yearSelectedMin = yearFilter ? parseInt(yearFilter.selected_min, 10) : null;
    const yearSelectedMax = yearFilter ? parseInt(yearFilter.selected_max, 10) : null;

    const priceMin = priceFilter ? parseInt(priceFilter.min, 10) : null;
    const priceMax = priceFilter ? parseInt(priceFilter.max, 10) : null;
    const yearMin = yearFilter ? parseInt(yearFilter.min, 10) : null;
    const yearMax = yearFilter ? parseInt(yearFilter.max, 10) : null;

    const fltr: (FilterRange | FilterMultiselect | FilterCity)[] = [];

    // Only include year filter if selected values are not null and min/max are not null
    if (yearSelectedMin !== null && yearSelectedMax !== null && yearMin !== null && yearMax !== null) {
      fltr.push({
        type: "range" as const,
        name: "year" as const,
        selected_min: yearSelectedMin,
        selected_max: yearSelectedMax,
        min: yearSelectedMin,
        max: yearSelectedMax,
      });
    }

    // Only include price filter if selected values are not null and min/max are not null
    if (priceSelectedMin !== null && priceSelectedMax !== null && priceMin !== null && priceMax !== null) {
      fltr.push({
        type: "range" as const,
        name: "price" as const,
        selected_min: priceSelectedMin,
        selected_max: priceSelectedMax,
        min: priceSelectedMin,
        max: priceSelectedMax,
      });
    }

    // Always include make and model filters (even if empty)
    fltr.push(
      {
        type: "multiselect" as const,
        name: "make" as const,
        options: makesArray,
      },
      {
        type: "multiselect" as const,
        name: "model" as const,
        options: modelsArray,
      }
    );

    if (cityId !== null) {
      fltr.push({ city_id: cityId });
    }

    const payload = {
      page: 1,
      fltr,
      sort: sortFilters.sortBy ? `${sortFilters.sortOrder}` : null,
      sort_by: sortFilters.sortBy,
    };

    dispatch(fetchCars(payload));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    priceFilter?.selected_min,
    priceFilter?.selected_max,
    yearFilter?.selected_min,
    yearFilter?.selected_max,
    priceFilter?.min,
    priceFilter?.max,
    yearFilter?.min,
    yearFilter?.max,
    makesJSON,
    modelsJSON,
    sortFilters.cityId,
    sortFilters.sortBy,
    sortFilters.sortOrder,
  ]);
};

export default useGetCars;
