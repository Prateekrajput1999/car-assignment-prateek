import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';

interface FilterValues {
  priceMin: number;
  priceMax: number;
  yearMin: number;
  yearMax: number;
  makes: string[];
  models: string[];
  cityId: string | null;
  sortBy: string | null;
  sortOrder: 'asc' | 'desc' | null;
  page: number;
}

const DEFAULT_VALUES: FilterValues = {
  priceMin: 90000,
  priceMax: 3600000,
  yearMin: 2010,
  yearMax: 2025,
  makes: [],
  models: [],
  cityId: null,
  sortBy: null,
  sortOrder: null,
  page: 1,
};

export const useFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const setSearchParams = useCallback(
    (updates: Partial<Record<keyof FilterValues, string | number | string[] | null>>) => {
      const params = new URLSearchParams(searchParams.toString());
      
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || (Array.isArray(value) && value.length === 0)) {
          params.delete(key);
        } else if (Array.isArray(value)) {
          params.set(key, value.join(','));
        } else {
          params.set(key, String(value));
        }
      });

      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  const getFilters = useCallback((): FilterValues => {
    const priceMin = parseInt(searchParams.get('priceMin') || String(DEFAULT_VALUES.priceMin), 10);
    const priceMax = parseInt(searchParams.get('priceMax') || String(DEFAULT_VALUES.priceMax), 10);
    const yearMin = parseInt(searchParams.get('yearMin') || String(DEFAULT_VALUES.yearMin), 10);
    const yearMax = parseInt(searchParams.get('yearMax') || String(DEFAULT_VALUES.yearMax), 10);
    const makes = searchParams.get('makes')?.split(',').filter(Boolean) || DEFAULT_VALUES.makes;
    const models = searchParams.get('models')?.split(',').filter(Boolean) || DEFAULT_VALUES.models;
    const cityId = searchParams.get('cityId') || DEFAULT_VALUES.cityId;
    const sortBy = searchParams.get('sortBy') || DEFAULT_VALUES.sortBy;
    const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || DEFAULT_VALUES.sortOrder;
    const page = parseInt(searchParams.get('page') || String(DEFAULT_VALUES.page), 10);

    return {
      priceMin,
      priceMax,
      yearMin,
      yearMax,
      makes,
      models,
      cityId,
      sortBy,
      sortOrder,
      page,
    };
  }, [searchParams]);

  return { searchParams, setSearchParams, getFilters };
};

