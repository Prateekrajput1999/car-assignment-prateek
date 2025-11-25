import { configureStore } from '@reduxjs/toolkit';
import citiesReducer from './slices/citiesSlice';
import carsReducer from './slices/carsSlice';

export const store = configureStore({
  reducer: {
    cities: citiesReducer,
    cars: carsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

