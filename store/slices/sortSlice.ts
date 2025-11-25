import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SortState {
  sortBy: string | null;
  sortOrder: 'asc' | 'desc' | null;
}

const initialState: SortState = {
  sortBy: null,
  sortOrder: null,
};

const sortSlice = createSlice({
  name: 'sort',
  initialState,
  reducers: {
    setSort: (state, action: PayloadAction<{ sortBy: string; sortOrder: 'asc' | 'desc' }>) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
    clearSort: (state) => {
      state.sortBy = null;
      state.sortOrder = null;
    },
  },
});

export const { setSort, clearSort } = sortSlice.actions;
export default sortSlice.reducer;

