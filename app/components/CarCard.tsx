'use client';

import { MapPin } from 'lucide-react';
import { Car } from '@/services/api';
import Image from 'next/image';

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  const formatPrice = (price: string) => {
    const priceNum = parseFloat(price);
    if (priceNum >= 100000) {
      return `₹${(priceNum / 100000).toFixed(2)} L`;
    }
    return `₹${priceNum.toLocaleString('en-IN')}`;
  };

  const formatKm = (km: string) => {
    return parseFloat(km).toLocaleString('en-IN');
  };

  return (
    <div className="bg-white h-full w-full rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-video bg-gray-100">
        {car.images ? (
          <Image
            width={100}
            height={100}
            src={car.images}
            alt={`${car.make} ${car.model}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-gray-900">
          {car.year} {car.make} {car.model}
        </h3>
        <p className="text-sm text-gray-600">
          {formatKm(car.mileage)} Km | {car.fuel_type} | {car.transmission}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-gray-900">{formatPrice(car.price)}</span>
        </div>
        {car.emi && (
          <p className="text-sm text-gray-600">EMI at ₹{parseFloat(car.emi).toLocaleString('en-IN')}</p>
        )}
        <div className="pt-2 space-y-1">
          <p className="text-sm font-medium text-green-600">{car.seller_name}</p>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="w-3 h-3" />
            <span>{car.city_name || car.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

