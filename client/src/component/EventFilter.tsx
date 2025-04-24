'use client';

import React, {useEffect} from 'react';
import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';

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
    'gluten-free': boolean;
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
  { value: 'AGG', label: 'AGG - Agganis Arena' },
  { value: 'CDS', label: 'CDS - Computing & Data Sciences' }
];

const EventFilter: React.FC<FilterProps> = ({ isOpen, onClose, onApply }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const formStyle = "text-text-primary font-bold font-montserrat text-base"

  // Prevents the user from scrolling
  useEffect(() => {
    if (isOpen) {
      // Disable scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scroll
      document.body.style.overflow = '';
    }
  
    // Clean up when modal unmounts
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const [filters, setFilters] = React.useState<FilterState>({
    date: 'any',
    location: '',
    allergies: {
      dairy: false,
      treeNuts: false,
      pescatarian: false,
      'gluten-free': false,
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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{
              type: "spring",
              bounce: 0,
              duration: 0.4,
            }}
            className={`rounded-lg shadow-lg w-full max-w-xl mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto p-6 transition-colors duration-300 ${
              isDark ? 'bg-[#222224] text-white' : 'bg-white text-black'
            }`}          
          >
            <h2 className="text-text-primary font-bold font-montserrat text-2xl lg:text-3xl">Filter Events</h2>
            <p className="text-text-primary font-inter text-xs lg:text-base mb-6">
              Set filters to find events that match your preferences.
            </p>

            {/* Date Section */}
            <div className="mb-6">
              <h3 className={formStyle}>Date</h3>
              <div className="space-y-2">
                {[
                  { value: 'any', label: 'Any date' },
                  { value: 'today', label: 'Today' },
                  { value: 'this_week', label: 'This week' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center font-poppins text-text-primary">
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
              <h3 className={formStyle}>Location</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                <label className="flex items-center font-poppins text-text-primary">
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
                  <label key={option.value} className="flex items-center font-poppins text-text-primary">
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
              <h3 className={formStyle}>Exclude Dietary Restrictions</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(filters.allergies).map(([key, value]) => (
                  <label key={key} className="flex items-center font-poppins text-text-primary">
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
              <div className="flex justify-end gap-4 pt-4">
                <button
                  onClick={onClose}
                  className="text-brand-primary 
                    font-poppins font-black 
                    py-1.5 px-5 
                    rounded-md border border-brand-primary
                    duration-300 ease-in hover:bg-brand-primary hover:text-white 
                    flex items-center justify-center text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  className="bg-brand-primary 
                    text-white font-poppins font-black 
                    py-1.5 px-5 
                    rounded-md 
                    duration-300 ease-in hover:bg-hover-primary 
                    flex items-center justify-center text-sm sm:text-base"
                >
                  Apply Filters
                </button>
              </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EventFilter; 