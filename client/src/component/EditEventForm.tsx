import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { EventCardProps } from '@/types/supabase';

interface EditEventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  eventData: EventCardProps;
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
}

const EditEventForm: React.FC<EditEventFormProps> = ({ isOpen, onClose, onSuccess, eventData }) => {
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

  // Initialize form data when the component receives event data
  useEffect(() => {
    if (eventData) {
      setFormData({
        name: eventData.name || '',
        description: eventData.description || '',
        date: eventData.date ? new Date(eventData.date) : null,
        start_time: eventData.start_time || '',
        end_time: eventData.end_time || '',
        location: eventData.location || '',
        building: eventData.building || '',
        food_name: eventData.food_name || '',
        allergens: eventData.allergens ? eventData.allergens.split(',').map(a => a.trim()) : [],
        event_id: eventData.event_id,
        food_id: eventData.food_id
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
    if (!user || !formData.event_id || !formData.food_id) return;

    try {
      // Update the food entry
      const { error: foodError } = await supabase
        .from('Food')
        .update({
          name: formData.food_name,
          allergens: formData.allergens.join(', '),
        })
        .eq('food_id', formData.food_id);

      if (foodError) throw foodError;

      // Update the event
      const { error: eventError } = await supabase
        .from('Events')
        .update({
          name: formData.name,
          description: formData.description,
          date: formData.date?.toISOString().split('T')[0],
          start_time: formData.start_time,
          end_time: formData.end_time,
          location: formData.location,
          building: formData.building,
        })
        .eq('event_id', formData.event_id);

      if (eventError) throw eventError;

      onSuccess?.();
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[500px] max-w-[90%] max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-2">Edit Event</h2>
        <p className="text-gray-600 mb-6">Update your event details.</p>

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
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete Event
              </button>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-red-400 text-white rounded-md hover:bg-red-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventForm; 