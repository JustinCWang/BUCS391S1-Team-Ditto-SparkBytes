import React, { useState } from 'react';
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[500px] max-w-[90%] max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-2">Post an Event</h2>
        <p className="text-gray-600 mb-6">Share details about your event with leftover food.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block font-medium mb-1">Title</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border rounded-md"
              rows={3}
              required
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Date</label>
              <DatePicker
                selected={formData.date}
                onChange={(date: Date | null) => setFormData({ ...formData, date: date })}
                className="w-full p-2 border rounded-md"
                placeholderText="Select a Date"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block font-medium">Time</label>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  className="flex-1 p-2 border rounded-md"
                  required
                />
                <span>To</span>
                <input
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  className="flex-1 p-2 border rounded-md"
                  required
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block font-medium mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full p-2 border rounded-md"
              placeholder="e.g., CDS 201"
              required
            />
          </div>

          {/* Building Code */}
          <div>
            <label className="block font-medium mb-1">Building Code</label>
            <input
              type="text"
              value={formData.building}
              onChange={(e) => setFormData({ ...formData, building: e.target.value.toUpperCase() })}
              className="w-full p-2 border rounded-md"
              placeholder="e.g., CAS"
              maxLength={3}
              required
            />
          </div>

          {/* Food Available */}
          <div>
            <label className="block font-medium mb-1">Food Available</label>
            <input
              type="text"
              value={formData.food_name}
              onChange={(e) => setFormData({ ...formData, food_name: e.target.value })}
              className="w-full p-2 border rounded-md"
              placeholder="e.g., Pizza and Salad"
              required
            />
          </div>

          {/* Allergies */}
          <div>
            <label className="block font-medium mb-2">Allergies</label>
            <div className="grid grid-cols-2 gap-2">
              {allergenOptions.map((allergen) => (
                <label key={allergen} className="flex items-center">
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
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-400 text-white rounded-md hover:bg-red-500"
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