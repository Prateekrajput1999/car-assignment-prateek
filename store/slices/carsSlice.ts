import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getCarsList, Car, CarsListPayload, Make } from "@/services/api";

interface FilterGroup {
  displayName: string;
  name: string;
  min: number;
  max: number | null;
  count: number;
}

interface Filter {
  displayName: string;
  name: string;
  type: string;
  selected_min: string;
  selected_max: string;
  min: string;
  max: string;
  count: string;
  groups?: FilterGroup[];
}

interface CarsState {
  cars: Car[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  lastPage: number;
  perPage: number;
  hasMore: boolean;
  makeModelList: Make[];
  apiFilters: Filter[];
  makes: string[];
  models: string[];
  cityId: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  minYear: number | null;
  maxYear: number | null;
}

const initialState: CarsState = {
  cars: [],
  loading: false,
  loadingMore: false,
  error: null,
  total: 0,
  currentPage: 1,
  lastPage: 1,
  perPage: 12,
  hasMore: true,
  makeModelList: [],
  apiFilters: [],
  makes: [],
  models: [],
  cityId: null,
  minPrice: null,
  maxPrice: null,
  minYear: null,
  maxYear: null,
};

export const fetchCars = createAsyncThunk(
  "cars/fetchCars",
  async (payload: CarsListPayload, { rejectWithValue }) => {
    try {
      const response = await getCarsList(payload);
      if (
        !Array.isArray(response?.allcars) ||
        response?.allcars?.length === 0
      ) {
        return rejectWithValue("No cars found");
      }
      return { response, payload };
    } catch {
      return rejectWithValue("Failed to fetch cars");
    }
  }
);

const carsSlice = createSlice({
  name: "cars",
  initialState,
  reducers: {
    setPriceRange: (state, action: PayloadAction<{ selectedMin: number | null; selectedMax: number | null }>) => {
      const priceFilter = state.apiFilters.find((f) => f.name === "price");
      if (priceFilter) {
        priceFilter.selected_min = action.payload.selectedMin !== null ? String(action.payload.selectedMin) : priceFilter.min;
        priceFilter.selected_max = action.payload.selectedMax !== null ? String(action.payload.selectedMax) : priceFilter.max;
      }
    },
    setYearRange: (state, action: PayloadAction<{ selectedMin: number | null; selectedMax: number | null }>) => {
      const yearFilter = state.apiFilters.find((f) => f.name === "year");
      if (yearFilter) {
        yearFilter.selected_min = action.payload.selectedMin !== null ? String(action.payload.selectedMin) : yearFilter.min;
        yearFilter.selected_max = action.payload.selectedMax !== null ? String(action.payload.selectedMax) : yearFilter.max;
      }
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
      const priceFilter = state.apiFilters.find((f) => f.name === "price");
      if (priceFilter) {
        priceFilter.selected_min = priceFilter.min;
        priceFilter.selected_max = priceFilter.max;
      }
      const yearFilter = state.apiFilters.find((f) => f.name === "year");
      if (yearFilter) {
        yearFilter.selected_min = yearFilter.min;
        yearFilter.selected_max = yearFilter.max;
      }
      state.makes = [];
      state.models = [];
    },
    resetPriceYearRanges: (state) => {
      state.minPrice = null;
      state.maxPrice = null;
      state.minYear = null;
      state.maxYear = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state, action) => {
        const isFirstPage = action.meta.arg.page === 1;
        if (isFirstPage) {
          state.loading = true;
          state.cars = [];
        } else {
          state.loadingMore = true;
        }
        state.error = null;
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        const isFirstPage = action.meta.arg.page === 1;
        if (isFirstPage) {
          state.loading = false;
          state.cars = action.payload.response.allcars;
        } else {
          state.loadingMore = false;
          state.cars = [...state.cars, ...action.payload.response.allcars];
        }
        state.total = action.payload.response.pagination.total;
        state.currentPage = action.payload.response.pagination.current_page;
        state.lastPage = action.payload.response.pagination.total_pages;
        state.perPage = action.payload.response.pagination.per_page;
        state.hasMore =
          action.payload.response.pagination.current_page <
          action.payload.response.pagination.total_pages;

        if (action.payload.response.filters && Array.isArray(action.payload.response.filters)) {
          // Set apiFilters array
          state.apiFilters = action.payload.response.filters as Filter[];
          
          // Set min/max values only on first load (when they are null)
          if (state.minPrice === null || state.maxPrice === null) {
            const priceFilter = action.payload.response.filters.find((f) => f.name === "price") as Filter | undefined;
            if (priceFilter && priceFilter.min && priceFilter.max) {
              const min = parseInt(priceFilter.min, 10);
              const max = parseInt(priceFilter.max, 10);
              if (!isNaN(min)) state.minPrice = min;
              if (!isNaN(max)) state.maxPrice = max;
            }
          }

          if (state.minYear === null || state.maxYear === null) {
            const yearFilter = action.payload.response.filters.find((f) => f.name === "year") as Filter | undefined;
            if (yearFilter && yearFilter.min && yearFilter.max) {
              const min = parseInt(yearFilter.min, 10);
              const max = parseInt(yearFilter.max, 10);
              if (!isNaN(min)) state.minYear = min;
              if (!isNaN(max)) state.maxYear = max;
            }
          }

          // Extract makeModelList from make filter
          const makeFilter = action.payload.response.filters.find(
            (filter) => filter.name === "make"
          );
          if (makeFilter && makeFilter.options && Array.isArray(makeFilter.options)) {
            if (isFirstPage || state.makeModelList.length === 0) {
              state.makeModelList = makeFilter.options;
            }
          }
        }
      })
      .addCase(fetchCars.rejected, (state, action) => {
        const isFirstPage = action.meta.arg?.page === 1;
        if (isFirstPage) {
          state.loading = false;
        } else {
          state.loadingMore = false;
        }
        state.error = (action.payload as string) || "Failed to fetch cars";
      });
  },
});

export const {
  setPriceRange,
  setYearRange,
  setMakes,
  setModels,
  setCityId,
  resetFilters,
  resetPriceYearRanges,
} = carsSlice.actions;

export default carsSlice.reducer;
