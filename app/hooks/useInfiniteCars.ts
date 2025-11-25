"use client";

import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { fetchCars } from "@/store/slices/carsSlice";
import { useFilters } from "@/app/hooks/useFilters";
import type {
  FilterRange,
  FilterMultiselect,
  FilterCity,
} from "@/services/api";

export function useInfiniteCars() {
  const dispatch = useDispatch<AppDispatch>();
  const { getFilters } = useFilters();

  const { hasMore, loadingMore, loading, currentPage, lastPage } = useSelector(
    (state: RootState) => state.cars
  );

  const buildFilters = useCallback(() => {
    const filters = getFilters();

    const fltr: (FilterRange | FilterMultiselect | FilterCity)[] = [
      {
        type: "range",
        name: "year",
        selected_min: filters.yearMin,
        selected_max: filters.yearMax,
        min: filters.yearMin,
        max: filters.yearMax,
      },
      {
        type: "range",
        name: "price",
        selected_min: filters.priceMin,
        selected_max: filters.priceMax,
        min: filters.priceMin,
        max: filters.priceMax,
      },
      {
        type: "multiselect",
        name: "make",
        options: filters.makes,
      },
      {
        type: "multiselect",
        name: "model",
        options: filters.models,
      },
    ];

    if (filters.cityId) fltr.push({ city_id: filters.cityId });

    return {
      page: currentPage + 1,
      fltr,
      sort: filters.sortBy ? filters.sortOrder : null,
      sort_by: filters.sortBy,
    };
  }, [getFilters, currentPage]);

  const triggerLoadMore = useCallback(() => {
    if (!hasMore || loadingMore || loading) return;
    if (currentPage >= lastPage) return;

    dispatch(fetchCars(buildFilters()));
  }, [
    hasMore,
    loadingMore,
    loading,
    currentPage,
    lastPage,
    dispatch,
    buildFilters,
  ]);

  return { loadingMore, triggerLoadMore };
}
