import axios from 'axios';

const api = axios.create({
  baseURL: 'https://crm-dev.nxcar.in/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface City {
  city_id: string;
  city_image: string;
  city_name: string;
  city_order: string;
  created_date: string;
  district_name: string;
  for_sell_form: string;
  group_cities: string | null;
  is_active: string;
  state_id: string;
  v_cnt: string;
}

export interface Car {
  vehicle_id: string;
  vehicle_no: string | null;
  variant_id: string;
  variant: string;
  fuel_type: string;
  transmission: string;
  color: string;
  seats: string;
  year: string;
  mileage: string;
  vehicletype_id: string;
  ownership: string;
  price: string;
  emi: string;
  loan_amount: string;
  loan_tenure: string;
  location: string;
  rto_location: string;
  hidden_number_plate: string;
  status: string;
  expected_selling_price: string;
  car_additional_fuel: string;
  is_active: string;
  weight: string;
  seller_name: string;
  seller_address: string;
  created_date: string;
  updated_date: string;
  created_by: string;
  updated_by: string;
  updated_by_employee: string | null;
  add_to_carscope: string;
  make_id: string;
  model_id: string;
  make: string;
  model: string;
  is_luxury: string | null;
  state_id: string;
  city_id: string;
  city_name: string;
  seller_fullname: string;
  is_shortlisted: string;
  images: string | null;
}

export interface CarsListResponse {
  allcars: Car[];
  pagination: {
    total: number;
    current_page: number;
    per_page: number;
    total_pages: number;
  };
}

export interface FilterRange {
  type: 'range';
  name: 'year' | 'price';
  selected_min: number;
  selected_max: number;
  min: number;
  max: number;
}

export interface FilterCity {
  city_id: string | undefined;
}

export interface FilterMultiselect {
  type: 'multiselect';
  name: 'make' | 'model';
  options: string[];
}

export interface CarsListPayload {
  page: number;
  fltr: (FilterRange | FilterMultiselect | FilterCity)[];
  sort?: string | null;
  sort_by?: string | null;
}

export const getCities = async (): Promise<{status: string, data: City[]}> => {
  try {
    const response = await api.get('/test-avail-cities');
    console.log("response211", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          `Failed to fetch cities: ${error.response.status} ${error.response.statusText}`
        );
      } else if (error.request) {
        throw new Error('Network error: Unable to reach the server. Please check your internet connection.');
      } else {
        throw new Error(`Request error: ${error.message}`);
      }
    }
    throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred while fetching cities');
  }
};

export const getCarsList = async (payload: CarsListPayload): Promise<CarsListResponse> => {
  const response = await api.post<CarsListResponse>('/test-cars-list', payload);
  return response.data;
};

