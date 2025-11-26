import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface FilterValues {
  priceMin: number | null;
  priceMax: number | null;
  yearMin: number | null;
  yearMax: number | null;
  makes: string[];
  models: string[];
  cityId: string | null;
  sortBy: string | null;
  sortOrder: 'asc' | 'desc' | null;
  page: number;
}

const DEFAULT_VALUES = {
  cityId: null,
  sortBy: null,
  sortOrder: null as 'asc' | 'desc' | null,
  page: 1,
};

export const useFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  // Get filter values from apiFilters
  const apiFilters = useSelector((state: RootState) => state.cars.apiFilters);
  const makes = useSelector((state: RootState) => state.cars.makes);
  const models = useSelector((state: RootState) => state.cars.models);

  const setSearchParams = useCallback(
    (updates: Partial<Record<'cityId' | 'sortBy' | 'sortOrder', string | null>>) => {
      const params = new URLSearchParams(searchParams.toString());
      
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  const getFilters = useCallback((): FilterValues => {
    // Only get cityId and sort from URL params
    const cityId = searchParams.get('cityId') || DEFAULT_VALUES.cityId;
    const sortBy = searchParams.get('sortBy') || DEFAULT_VALUES.sortBy;
    const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || DEFAULT_VALUES.sortOrder;
    const page = parseInt(searchParams.get('page') || String(DEFAULT_VALUES.page), 10);

    // Get everything else from apiFilters
    const priceFilter = apiFilters.find((f) => f.name === "price");
    const yearFilter = apiFilters.find((f) => f.name === "year");

    return {
      priceMin: priceFilter ? parseInt(priceFilter.selected_min, 10) : null,
      priceMax: priceFilter ? parseInt(priceFilter.selected_max, 10) : null,
      yearMin: yearFilter ? parseInt(yearFilter.selected_min, 10) : null,
      yearMax: yearFilter ? parseInt(yearFilter.selected_max, 10) : null,
      makes,
      models,
      cityId,
      sortBy,
      sortOrder,
      page,
    };
  }, [searchParams, apiFilters, makes, models]);

  return { searchParams, setSearchParams, getFilters };
};

