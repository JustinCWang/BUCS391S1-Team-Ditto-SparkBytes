import React from 'react';

interface FilterProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
}

export interface FilterState {
  date: 'any' | 'today' | 'this_week';
  location: 'ENG' | 'SAR' | 'STH' | 'FLR' | 'COM' | 'GSU' | 'MUG' | 'CAS' | 'MET' | 'KHC' | 'AGG' | '';
  allergies: {
    dairy: boolean;
    treeNuts: boolean;
    pescatarian: boolean;
    glutenFree: boolean;
    shellfish: boolean;
    soy: boolean;
    vegan: boolean;
    kosher: boolean;
    eggs: boolean;
    peanuts: boolean;
    vegetarian: boolean;
    halal: boolean;
  };
}

const LOCATION_OPTIONS = [
  { value: 'ENG', label: 'ENG - Engineering' },
  { value: 'SAR', label: 'SAR - Sargent College' },
  { value: 'STH', label: 'STH - School of Theology' },
  { value: 'FLR', label: 'FLR - Fuller Building' },
  { value: 'COM', label: 'COM - College of Communication' },
  { value: 'GSU', label: 'GSU - George Sherman Union' },
  { value: 'MUG', label: 'MUG - Mugar Library' },
  { value: 'CAS', label: 'CAS - College of Arts & Sciences' },
  { value: 'MET', label: 'MET - Metropolitan College' },
  { value: 'KHC', label: 'KHC - Kilachand Honors College' },
  { value: 'AGG', label: 'AGG - Agganis Arena' }
];

const EventFilter: React.FC<FilterProps> = ({ isOpen, onClose, onApply }) => {
  const [filters, setFilters] = React.useState<FilterState>({
    date: 'any',
    location: '',
    allergies: {
      dairy: false,
      treeNuts: false,
      pescatarian: false,
      glutenFree: false,
      shellfish: false,
      soy: false,
      vegan: false,
      kosher: false,
      eggs: false,
      peanuts: false,
      vegetarian: false,
      halal: false,
    },
  });

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[400px] max-w-[90%]">
        <h2 className="text-2xl font-bold mb-4">Filter Events</h2>
        <p className="text-sm text-gray-600 mb-4">
          Set filters to find events that match your preferences.
        </p>

        {/* Date Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Date</h3>
          <div className="space-y-2">
            {[
              { value: 'any', label: 'Any date' },
              { value: 'today', label: 'Today' },
              { value: 'this_week', label: 'This week' },
            ].map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name="date"
                  value={option.value}
                  checked={filters.date === option.value}
                  onChange={(e) =>
                    setFilters({ ...filters, date: e.target.value as FilterState['date'] })
                  }
                  className="mr-2"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        {/* Location Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Location</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            <label className="flex items-center">
              <input
                type="radio"
                name="location"
                value=""
                checked={filters.location === ''}
                onChange={(e) =>
                  setFilters({ ...filters, location: e.target.value as FilterState['location'] })
                }
                className="mr-2"
              />
              Any Location
            </label>
            {LOCATION_OPTIONS.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name="location"
                  value={option.value}
                  checked={filters.location === option.value}
                  onChange={(e) =>
                    setFilters({ ...filters, location: e.target.value as FilterState['location'] })
                  }
                  className="mr-2"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        {/* Allergies Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Exclude Allergies</h3>
          <p className="text-sm text-gray-600 mb-2">
            Events containing these allergens will be hidden.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(filters.allergies).map(([key, value]) => (
              <label key={key} className="flex items-center">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      allergies: {
                        ...filters.allergies,
                        [key]: e.target.checked,
                      },
                    })
                  }
                  className="mr-2"
                />
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
              </label>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-red-400 text-white rounded-md hover:bg-red-500"
          >
            Apply filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventFilter; 