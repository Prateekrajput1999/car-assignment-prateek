import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCarsList, Car, CarsListPayload } from "@/services/api";

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
};

export const fetchCars = createAsyncThunk(
  "cars/fetchCars",
  async (payload: CarsListPayload, { rejectWithValue }) => {
    try {
      console.log("payload json stringify", JSON.stringify(payload || {}));
      const response = await getCarsList(payload);
      console.log("response222", response);
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
  reducers: {},
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

export default carsSlice.reducer;
