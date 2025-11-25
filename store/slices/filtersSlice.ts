import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FiltersState {
  priceRange: {
    min: number;
    max: number;
    selectedMin: number;
    selectedMax: number;
  };
  yearRange: {
    min: number;
    max: number;
    selectedMin: number;
    selectedMax: number;
  };
  makes: string[];
  models: string[];
  cityId: string | null;
}

const initialState: FiltersState = {
  priceRange: {
    min: 90000,
    max: 3600000,
    selectedMin: 90000,
    selectedMax: 3600000,
  },
  yearRange: {
    min: 2010,
    max: 2025,
    selectedMin: 2010,
    selectedMax: 2025,
  },
  makes: [],
  models: [],
  cityId: null,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setPriceRange: (state, action: PayloadAction<{ min: number; max: number }>) => {
      state.priceRange.selectedMin = action.payload.min;
      state.priceRange.selectedMax = action.payload.max;
    },
    setYearRange: (state, action: PayloadAction<{ min: number; max: number }>) => {
      state.yearRange.selectedMin = action.payload.min;
      state.yearRange.selectedMax = action.payload.max;
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
    resetFilters: (state) => {
      state.priceRange.selectedMin = state.priceRange.min;
      state.priceRange.selectedMax = state.priceRange.max;
      state.yearRange.selectedMin = state.yearRange.min;
      state.yearRange.selectedMax = state.yearRange.max;
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
  resetFilters,
} = filtersSlice.actions;
export default filtersSlice.reducer;

