'use client';

import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { AppDispatch, RootState } from '@/store';
import { setMakes, setModels } from '@/store/slices/carsSlice';

interface Model {
  model_id: string;
  model: string;
  count: string;
}

interface Make {
  make: string;
  make_id: string;
  count: number;
  models: Model[];
}

export default function MakeModelFilter() {
  const dispatch = useDispatch<AppDispatch>();
  const makes = useSelector((state: RootState) => state.cars.makes);
  const models = useSelector((state: RootState) => state.cars.models);
  const carList = useSelector((state: RootState) => state.cars.makeModelList) as Make[];

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMakes, setExpandedMakes] = useState<Set<string>>(new Set());

  const filteredCarList = useMemo(() => {
    if (!searchQuery.trim()) {
      return carList;
    }

    const query = searchQuery.toLowerCase();
    return carList
      .map((make) => {
        const makeMatches = make.make.toLowerCase().includes(query);
        const matchingModels = make.models.filter((model) =>
          model.model.toLowerCase().includes(query)
        );

        if (makeMatches) {
          return { ...make, models: make.models };
        } else if (matchingModels.length > 0) {
          return { ...make, models: matchingModels };
        }
        return null;
      })
      .filter((make): make is Make => make !== null);
  }, [searchQuery, carList]);

  const toggleMake = (make: string) => {
    setExpandedMakes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(make)) {
        newSet.delete(make);
      } else {
        newSet.add(make);
      }
      return newSet;
    });
  };

  const handleMakeCheckboxChange = (make: string, checked: boolean) => {
    if (checked) {
      dispatch(setMakes([...makes, make]));
    } else {
      dispatch(setMakes(makes.filter((m) => m !== make)));
      // Also remove models that belong to this make
      const makeData = carList.find((m) => m.make === make);
      if (makeData) {
        const modelsToKeep = models.filter((model) =>
          !makeData.models.some((m) => m.model === model)
        );
        dispatch(setModels(modelsToKeep));
      }
    }
  };

  const handleModelCheckboxChange = (model: string, checked: boolean) => {
    if (checked) {
      dispatch(setModels([...models, model]));
    } else {
      dispatch(setModels(models.filter((m) => m !== model)));
    }
  };

  const isMakeChecked = (make: string) => {
    return makes.includes(make);
  };

  const isModelChecked = (model: string) => {
    return models.includes(model);
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          type="text"
          placeholder="Search your model"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">All Brands</h4>
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {filteredCarList.length === 0 ? (
            <div className="text-sm text-gray-500 py-4 text-center">
              Loading brands...
            </div>
          ) : (
            filteredCarList.map((make) => {
            const isExpanded = expandedMakes.has(make.make);
            const isChecked = isMakeChecked(make.make);

            return (
              <div key={make.make_id}>
                <div className="flex items-center gap-2 py-1.5 hover:bg-gray-50 rounded px-1">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) =>
                      handleMakeCheckboxChange(make.make, e.target.checked)
                    }
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span
                    className="flex-1 text-sm text-gray-700 cursor-pointer"
                    onClick={() => toggleMake(make.make)}
                  >
                    {make.make}
                  </span>
                  <button
                    onClick={() => toggleMake(make.make)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>

                {isExpanded && (
                  <div className="ml-6 space-y-1 mt-1">
                    {make.models.map((model) => {
                      const modelChecked = isModelChecked(model.model);
                      return (
                        <label
                          key={model.model_id}
                          className="flex items-center gap-2 py-1.5 hover:bg-gray-50 rounded px-1 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={modelChecked}
                            onChange={(e) =>
                              handleModelCheckboxChange(
                                model.model,
                                e.target.checked
                              )
                            }
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          />
                          <span className="text-sm text-gray-700">
                            {model.model}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }))}
        </div>
      </div>
    </div>
  );
}

