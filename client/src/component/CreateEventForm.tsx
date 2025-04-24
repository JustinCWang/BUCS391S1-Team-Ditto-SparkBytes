'use client';
 
import { useTheme } from '@/context/ThemeContext';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { X } from "lucide-react";

import { motion, AnimatePresence } from 'motion/react';

interface CreateEventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface EventFormData {
  name: string;
  description: string;
  date: Date | null;
  start_time: string;
  end_time: string;
  location: string;
  building: string;
  food_name: string;
  allergens: string[];
  quantity: number;
}

const CreateEventForm: React.FC<CreateEventFormProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const inputStyle = `
   w-full font-inter px-4 py-2 mt-2 rounded-md 
   focus:outline-none focus:border-text-primary 
   border ${isDark ? 'border-gray-600' : 'border-gray-300'} 
   ${isDark ? 'text-white bg-[#1e1e1e] placeholder-gray-500' : 'text-black bg-white placeholder-gray-400'}
 `;
 
  const formStyle = `${isDark ? 'text-white' : 'text-black'} font-bold font-montserrat text-base`;

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

  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    description: '',
    date: null,
    start_time: '',
    end_time: '',
    location: '',
    building: '',
    food_name: '',
    allergens: [],
    quantity: 0,
  });

  const allergenOptions = [
    'Dairy',
    'Tree Nuts',
    'Pescatarian',
    'Gluten-Free',
    'Shellfish',
    'Soy',
    'Vegan',
    'Kosher',
    'Eggs',
    'Peanuts',
    'Vegetarian',
    'Halal'
  ];

  const LOCATION_OPTIONS = [
    'ENG',
    'SAR',
    'STH',
    'FLR',
    'COM',
    'GSU',
    'MUG',
    'CAS',
    'MET',
    'KHC',
    'AGG',
    'CDS'
  ];

  const handleAllergenChange = (allergen: string) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter(a => a !== allergen)
        : [...prev.allergens, allergen]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Check if building code is valid
    if (!LOCATION_OPTIONS.includes(formData.building)) {
      return; // Prevent submission if building code is invalid
    }

    try {
      // First, create the food entry
      const { data: foodData, error: foodError } = await supabase
        .from('Food')
        .insert([{
          name: formData.food_name,
          allergens: formData.allergens.join(', '),
          status: 'available',
          quantity: formData.quantity
        }])
        .select()
        .single();

      if (foodError) throw foodError;

      // Then create the event with the food_id
      const { error: eventError } = await supabase
        .from('Events')
        .insert([{
          name: formData.name,
          description: formData.description,
          date: formData.date?.toISOString().split('T')[0],
          start_time: formData.start_time,
          end_time: formData.end_time,
          location: formData.location,
          building: formData.building,
          food_id: foodData.food_id,
          organizer_id: user.id
        }]);

      if (eventError) throw eventError;

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error creating event:', error);
      // You might want to show an error message to the user here
    }
  };

  if (!isOpen) return null;

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
            className={`relative rounded-lg shadow-lg w-full max-w-xl mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto p-6 transition-colors duration-300 ${
              isDark ? 'bg-[#222224] text-white' : 'bg-white text-black'
            }`}            
          >
            <div>
              <h2 className="text-text-primary font-bold font-montserrat text-2xl lg:text-3xl">Post an Event</h2>
              <p className="text-text-primary font-inter text-xs lg:text-base mb-6">Share details about your event with leftover food.</p>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-text-primary hover:text-brand-primary"
            >
              <X size={24} />
            </button>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Title */}
              <div>
                <label className={formStyle}>Title</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={inputStyle}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className={formStyle}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={inputStyle}
                  rows={3}
                  required
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 gap-4">
                <div className='flex flex-col'>
                  <label className={formStyle}>Date</label>
                  <DatePicker
                    selected={formData.date}
                    onChange={(date: Date | null) => setFormData({ ...formData, date: date })}
                    className={inputStyle}
                    placeholderText="Select a Date"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className={formStyle}>Time</label>
                  <div className="flex flex-col sm:flex-row dark:text-white items-start sm:items-center gap-2">
                    <input
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                      className={inputStyle}
                      required
                    />
                    <span>To</span>
                    <input
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                      className={inputStyle}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className={formStyle}>Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className={inputStyle}
                  placeholder="e.g., CDS 201"
                  required
                />
              </div>

              {/* Building Code */}
              <div>
                <label className={formStyle}>Building Code</label>
                <input
                  type="text"
                  value={formData.building}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    setFormData({ ...formData, building: value });
                  }}
                  className={`${inputStyle} ${formData.building && !LOCATION_OPTIONS.includes(formData.building) ? 'border-red-500' : ''}`}
                  placeholder="e.g., CAS"
                  maxLength={3}
                  required
                />
                {formData.building && !LOCATION_OPTIONS.includes(formData.building) && (
                  <p className="text-red-500 text-sm mt-1">Please enter a valid building code (e.g., CAS, ENG, GSU)</p>
                )}
              </div>

              {/* Food Available */}
              <div>
                <label className={formStyle}>Food Available</label>
                <input
                  type="text"
                  value={formData.food_name}
                  onChange={(e) => setFormData({ ...formData, food_name: e.target.value })}
                  className={inputStyle}
                  placeholder="e.g., Pizza and Salad"
                  required
                />
              </div>

              {/* Food Quantity */}
              <div>
                <label className={formStyle}>Food Quantity</label>
                <input
                  type="number"
                  value={formData.quantity || ''}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                  className={inputStyle}
                  placeholder="e.g., 10"
                  min="1"
                  required
                />
              </div>

              {/* Allergies */}
              <div>
                <label className={formStyle}>Include Dietary Restrictions</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {allergenOptions.map((allergen) => (
                    <label key={allergen} className="flex items-center font-poppins text-text-primary">
                      <input
                        type="checkbox"
                        checked={formData.allergens.includes(allergen)}
                        onChange={() => handleAllergenChange(allergen)}
                        className="mr-2"
                      />
                      {allergen}
                    </label>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-translucent
                    text-brand-primary 
                    font-poppins font-black 
                    py-1.5 px-5 
                    rounded-md border border-brand-primary
                    duration-300 ease-in hover:bg-brand-primary hover:text-white 
                    flex items-center justify-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!LOCATION_OPTIONS.includes(formData.building)}
                  className={`font-poppins font-black 
                    py-1.5 px-5 
                    rounded-md 
                    duration-300 ease-in 
                    flex items-center justify-center
                    ${!LOCATION_OPTIONS.includes(formData.building) 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-brand-primary text-white hover:bg-hover-primary'}`}
                >
                  Post Event
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateEventForm; 