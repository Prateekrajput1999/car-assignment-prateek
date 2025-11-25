"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/index";
import { VirtuosoGrid, VirtuosoGridProps } from "react-virtuoso";
import { forwardRef, useCallback } from "react";
import CarCard from "./CarCard";
import CarCardSkeleton from "./CarCardSkeleton";
import { useInfiniteCars } from "../hooks/useInfiniteCars";
import { Car } from "@/services/api";

const GAP_SIZE = 16;

const ListComponent = forwardRef<
  HTMLDivElement,
  { style?: React.CSSProperties; children?: React.ReactNode }
>(({ style, children, ...props }, ref) => (
  <div
    ref={ref}
    {...props}
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: `${GAP_SIZE}px`,
      ...style,
    }}
  >
    {children}
  </div>
));


ListComponent.displayName = "ListComponent";

const ItemComponent = forwardRef<
  HTMLDivElement,
  { children?: React.ReactNode; style?: React.CSSProperties }
>(({ children, style, ...props }, ref) => (
  <div
    ref={ref}
    {...props}
    style={{
      boxSizing: "border-box",
      ...style,
    }}
  >
    {children}
  </div>
));

ItemComponent.displayName = "ItemComponent";

const gridComponents: VirtuosoGridProps<undefined, undefined>["components"] = {
  List: ListComponent,
  Item: ItemComponent,
};

export default function CarGrid() {
  const { cars, loading, loadingMore, error, hasMore } = useSelector(
    (state: RootState) => state.cars
  );
  const { triggerLoadMore } = useInfiniteCars();

  const itemContent = useCallback(
    (index: number) => {
      const car: Car = cars[index];
      return <CarCard car={car} />;
    },
    [cars]
  );

  const handleEndReached = useCallback(() => {
    if (hasMore && !loadingMore && !loading) {
      triggerLoadMore();
    }
  }, [hasMore, loadingMore, loading, triggerLoadMore]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <CarCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error && cars.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">No cars found</div>
      </div>
    );
  }

  return (
    <>
      <VirtuosoGrid
        useWindowScroll
        totalCount={cars.length}
        components={gridComponents}
        itemContent={itemContent}
        endReached={handleEndReached}
      />
      {loadingMore && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mt-6">
          {Array.from({ length: 10 }).map((_, index) => (
            <CarCardSkeleton key={`loading-${index}`} />
          ))}
        </div>
      )}
    </>
  );
}
