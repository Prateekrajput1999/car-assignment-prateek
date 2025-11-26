import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FiltersState {
  priceRange: {
    min: number | null;
    max: number | null;
    selectedMin: number | null;
    selectedMax: number | null;
  };
  yearRange: {
    min: number | null;
    max: number | null;
    selectedMin: number | null;
    selectedMax: number | null;
  };
  makes: string[];
  models: string[];
  cityId: string | null;
}

const initialState: FiltersState = {
  priceRange: {
    min: null,
    max: null,
    selectedMin: null,
    selectedMax: null,
  },
  yearRange: {
    min: null,
    max: null,
    selectedMin: null,
    selectedMax: null,
  },
  makes: [],
  models: [],
  cityId: null,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setPriceRange: (state, action: PayloadAction<{ selectedMin: number | null; selectedMax: number | null }>) => {
      state.priceRange.selectedMin = action.payload.selectedMin;
      state.priceRange.selectedMax = action.payload.selectedMax;
    },
    setYearRange: (state, action: PayloadAction<{ selectedMin: number | null; selectedMax: number | null }>) => {
      state.yearRange.selectedMin = action.payload.selectedMin;
      state.yearRange.selectedMax = action.payload.selectedMax;
    },
    setMakes: (state, action: PayloadAction<string[]>) => {
      state.makes = action.payload;
      state.models = [];
    },
    setModels: (state, action: PayloadAction<string[]>) => {
      state.models = action.payload;
    },
    setCityId: (state, action: PayloadAction<string | null>) => {
      state.cityId = action.payload;
    },
    syncPriceFilter: (state, action: PayloadAction<{ min: string; max: string }>) => {
      // Only sync the bounds (min/max), not selected values
      // Selected values should only come from user interactions
      state.priceRange.min = parseInt(action.payload.min, 10);
      state.priceRange.max = parseInt(action.payload.max, 10);
    },
    syncYearFilter: (state, action: PayloadAction<{ min: string; max: string }>) => {
      // Only sync the bounds (min/max), not selected values
      // Selected values should only come from user interactions
      state.yearRange.min = parseInt(action.payload.min, 10);
      state.yearRange.max = parseInt(action.payload.max, 10);
    },
    resetFilters: (state) => {
      state.priceRange.selectedMin = null;
      state.priceRange.selectedMax = null;
      state.yearRange.selectedMin = null;
      state.yearRange.selectedMax = null;
      state.makes = [];
      state.models = [];
    },
  },
});

export const {
  setPriceRange,
  setYearRange,
  setMakes,
  setModels,
  setCityId,
  syncPriceFilter,
  syncYearFilter,
  resetFilters,
} = filtersSlice.actions;
export default filtersSlice.reducer;

