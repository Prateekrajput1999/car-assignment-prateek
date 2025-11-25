'use client';

import { useState, useEffect, useRef } from 'react';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';

interface DualRangeSliderProps {
  rangeMin: number;
  rangeMax: number;
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
  formatValue?: (value: number) => string;
  step?: number;
}

export default function DualRangeSlider({
  rangeMin,
  rangeMax,
  min,
  max,
  onChange,
  formatValue = (value) => value.toString(),
  step = 1,
}: DualRangeSliderProps) {
  const [localValues, setLocalValues] = useState<[number, number]>([min, max]);
  const isDraggingRef = useRef(false);
  const initialValuesRef = useRef<[number, number]>([min, max]);

  useEffect(() => {
    if (!isDraggingRef.current) {
      setLocalValues([min, max]);
      initialValuesRef.current = [min, max];
    }
  }, [min, max]);

  const handleInput = (value: [number, number]) => {
    setLocalValues(value);
    isDraggingRef.current = true;
  };

  const handleDragEnd = () => {
    isDraggingRef.current = false;
    if (
      localValues[0] !== initialValuesRef.current[0] ||
      localValues[1] !== initialValuesRef.current[1]
    ) {
      onChange(localValues[0], localValues[1]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>{formatValue(localValues[0])}</span>
        <span>{formatValue(localValues[1])}</span>
      </div>
      <RangeSlider
        min={rangeMin}
        max={rangeMax}
        step={step}
        value={localValues}
        onInput={handleInput}
        onThumbDragEnd={handleDragEnd}
        onRangeDragEnd={handleDragEnd}
        className="range-slider"
      />
    </div>
  );
}
