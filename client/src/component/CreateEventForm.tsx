import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


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
}

const CreateEventForm: React.FC<CreateEventFormProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  
  const inputStyle = "w-full font-inter border border-gray-300 px-4 py-2 mt-2 rounded-md focus:outline-none focus:border-text-primary";
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

    try {
      // First, create the food entry
      const { data: foodData, error: foodError } = await supabase
        .from('Food')
        .insert([{
          name: formData.food_name,
          allergens: formData.allergens.join(', '),
          status: 'available'
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto p-6">

        <div>
          <h2 className="text-text-primary font-bold font-montserrat text-2xl lg:text-3xl">Post an Event</h2>
          <p className="text-text-primary font-inter text-xs lg:text-base mb-6">Share details about your event with leftover food.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 ">
          
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
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
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
              onChange={(e) => setFormData({ ...formData, building: e.target.value.toUpperCase() })}
              className={inputStyle}
              placeholder="e.g., CAS"
              maxLength={3}
              required
            />
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
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-white 
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
              className="bg-brand-primary 
                text-white font-poppins font-black 
                py-1.5 px-5 
                rounded-md 
                duration-300 ease-in hover:bg-hover-primary 
                flex items-center justify-center"
            >
              Post Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventForm; 