'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { EventCardProps } from '@/types/supabase';
import { X } from "lucide-react";

import { useTheme } from '@/context/ThemeContext';

import { motion, AnimatePresence } from 'motion/react';

interface EditEventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  eventData: EventCardProps;
  onEventUpdated?: () => void;
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
  event_id?: string;
  food_id?: string;
  quantity: number;
}

const EditEventForm: React.FC<EditEventFormProps> = ({ isOpen, onClose, onSuccess, eventData, onEventUpdated }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const inputStyle = `w-full font-inter px-4 py-2 mt-2 rounded-md 
  focus:outline-none focus:border-text-primary 
  border ${isDark ? 'border-gray-600' : 'border-gray-300'} 
  ${isDark ? 'text-white bg-[#1e1e1e] placeholder-gray-500' : 'text-black bg-white placeholder-gray-400'}
 `;

  const formStyle =`${isDark ? 'text-white' : 'text-black'} font-bold font-montserrat text-base`;

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
    quantity: 1,
  });

  // Initialize form data when the component receives event data
  useEffect(() => {
    if (eventData) {
      // Create a date object that preserves the local date
      const eventDate = eventData.date ? new Date(eventData.date + 'T00:00:00') : null;
      
      // Split allergens and trim each one, then filter out any empty strings
      const initialAllergens = eventData.allergens 
        ? eventData.allergens.split(',').map(a => a.trim()).filter(a => a !== '')
        : [];
      
      setFormData({
        name: eventData.name || '',
        description: eventData.description || '',
        date: eventDate,
        start_time: eventData.start_time || '',
        end_time: eventData.end_time || '',
        location: eventData.location || '',
        building: eventData.building || '',
        food_name: eventData.food_name || '',
        allergens: initialAllergens,
        event_id: eventData.event_id,
        food_id: eventData.food_id,
        quantity: eventData.quantity || 1,
      });
    }
  }, [eventData]);

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
    setFormData(prev => {
      const newAllergens = prev.allergens.includes(allergen)
        ? prev.allergens.filter(a => a !== allergen)
        : [...prev.allergens, allergen];
      
      return {
        ...prev,
        allergens: newAllergens
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.event_id || !formData.food_id) return;
    
    // Check if building code is valid
    if (!LOCATION_OPTIONS.includes(formData.building)) {
      return; // Prevent submission if building code is invalid
    }

    try {
      console.log('Current allergens:', formData.allergens);
      
      // Update the food entry
      const { error: foodError } = await supabase
        .from('Food')
        .update({
          name: formData.food_name,
          allergens: formData.allergens.length > 0 ? formData.allergens.join(', ') : '',
          quantity: formData.quantity
        })
        .eq('food_id', formData.food_id);

      if (foodError) {
        console.error('Food update error:', foodError);
        throw foodError;
      }

      // Update the event
      const { error: eventError } = await supabase
        .from('Events')
        .update({
          name: formData.name,
          description: formData.description,
          date: formData.date ? formData.date.toLocaleDateString('en-CA') : null,
          start_time: formData.start_time,
          end_time: formData.end_time,
          location: formData.location,
          building: formData.building,
        })
        .eq('event_id', formData.event_id);

      if (eventError) {
        console.error('Event update error:', eventError);
        throw eventError;
      }

      console.log('Update successful');
      onSuccess?.();
      onEventUpdated?.();
      onClose();
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleDelete = async () => {
    if (!user || !formData.event_id || !formData.food_id) return;

    try {
      // Delete the food entry first (due to foreign key constraint)
      const { error: foodError } = await supabase
        .from('Food')
        .delete()
        .eq('food_id', formData.food_id);

      if (foodError) throw foodError;

      // Delete the event
      const { error: eventError } = await supabase
        .from('Events')
        .delete()
        .eq('event_id', formData.event_id);

      if (eventError) throw eventError;

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error deleting event:', error);
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
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
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
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-text-primary hover:text-brand-primary"
            >
              <X size={24} />
            </button>

            <div>
              <h2 className="text-text-primary font-bold font-montserrat text-2xl lg:text-3xl">Editing &quot;{eventData.name}&quot;</h2>
              <p className="text-text-primary font-inter text-xs lg:text-base mb-6">Update your event details.</p>
            </div>

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
                  <div className="dark:text-white flex flex-col sm:flex-row items-start sm:items-center gap-2">
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
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                  className={inputStyle}
                  placeholder="e.g., 10"
                  min="1"
                  required
                />
              </div>

              {/* Allergies */}
              <div>
                <label className={formStyle}>Allergies</label>
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
              <div className="flex flex-col sm:flex-row pt-4 w-full items-center justify-center gap-4 sm:gap-8">
                {/* Cancel + Delete */}
                <div className="flex flex-col sm:flex-row gap-2 w-full items-center justify-center">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full bg-translucent text-brand-primary font-poppins font-black py-1.5 px-5 
                              rounded-md border border-brand-primary duration-300 ease-in 
                              hover:bg-brand-primary hover:text-white flex items-center justify-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="w-full bg-translucent text-brand-primary font-poppins font-black py-1.5 px-5 
                              rounded-md border border-brand-primary duration-300 ease-in 
                              hover:bg-brand-primary hover:text-white flex items-center justify-center"
                  >
                    Delete Event
                  </button>
                </div>

                {/* Save Button */}
                <button
                  type="submit"
                  disabled={!LOCATION_OPTIONS.includes(formData.building)}
                  className={`w-full sm:w-[50%] font-poppins font-black py-1.5 px-5 
                            rounded-md duration-300 ease-in flex items-center justify-center
                            ${!LOCATION_OPTIONS.includes(formData.building) 
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                              : 'bg-brand-primary text-white hover:bg-hover-primary'}`}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditEventForm; 