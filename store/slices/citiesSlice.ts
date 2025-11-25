import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCities, City } from '@/services/api';

interface CitiesState {
  cities: City[];
  loading: boolean;
  error: string | null;
}

const initialState: CitiesState = {
  cities: [],
  loading: false,
  error: null,
};

export const fetchCities = createAsyncThunk(
  'cities/fetchCities',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCities();
      if(response.status !== "success") {
        return rejectWithValue("Failed to fetch cities");
      }

      console.log("response333", response.data);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unexpected error occurred while fetching cities');
    }
  }
);

const citiesSlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.cities = action.payload;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' 
          ? action.payload 
          : action.error.message || 'Failed to fetch cities';
        state.cities = [];
      });
  },
});
export default citiesSlice.reducer;

