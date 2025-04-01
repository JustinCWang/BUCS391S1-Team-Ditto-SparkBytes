'use client'
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { EventCardProps } from '@/types/supabase';
import EventCard from '@/component/eventCard';
import EventFilter, { FilterState } from '@/component/EventFilter';
import CreateEventForm from '@/component/CreateEventForm';
import { Loader } from 'lucide-react';

const ITEMS_PER_PAGE = 9; // Number of events per page

// Add this type near the top of the file
type FoodInfo = {
  food_id?: string;
  food_category?: string | null;
  name?: string | null;
  allergens?: string | null;
};

const Events = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [events, setEvents] = useState<EventCardProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
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

  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      // First create a query for counting
      let countQuery = supabase
        .from('Events')
        .select('*', { count: 'exact' });

      // Add search filter to count query if search query exists
      if (searchQuery) {
        countQuery = countQuery.ilike('name', `%${searchQuery}%`);
      }

      // Add date filters
      if (activeFilters.date === 'today') {
        const today = new Date().toISOString().split('T')[0];
        countQuery = countQuery.eq('date', today);
      } else if (activeFilters.date === 'this_week') {
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() + (6 - today.getDay()));
        
        countQuery = countQuery
          .gte('date', weekStart.toISOString().split('T')[0])
          .lte('date', weekEnd.toISOString().split('T')[0]);
      }

      // Add location filter
      if (activeFilters.location) {
        countQuery = countQuery.eq('building', activeFilters.location);
      }

      // Get total count
      const { count, error: countError } = await countQuery;
      
      if (countError) throw countError;

      if (count) {
        setTotalPages(Math.ceil(count / ITEMS_PER_PAGE));
      }

      // Basic event info query
      let dataQuery = supabase
        .from('Events')
        .select(`
          event_id,
          food_id,
          name, 
          date, 
          start_time, 
          end_time, 
          location, 
          description, 
          building
        `);

      // Add search filter if exists
      if (searchQuery) {
        dataQuery = dataQuery.ilike('name', `%${searchQuery}%`);
      }

      // Add date filters
      if (activeFilters.date === 'today') {
        const today = new Date().toISOString().split('T')[0];
        dataQuery = dataQuery.eq('date', today);
      } else if (activeFilters.date === 'this_week') {
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() + (6 - today.getDay()));
        
        dataQuery = dataQuery
          .gte('date', weekStart.toISOString().split('T')[0])
          .lte('date', weekEnd.toISOString().split('T')[0]);
      }

      // Add location filter
      if (activeFilters.location) {
        dataQuery = dataQuery.eq('building', activeFilters.location);
      }

      // Fetch paginated events
      const { data: eventData, error: eventError } = await dataQuery
        .order('date', { ascending: false })
        .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);

      if (eventError) {
        console.error('Event fetch error:', eventError);
        return;
      }

      if (!eventData || eventData.length === 0) {
        setEvents([]);
        setIsLoading(false);
        return;
      }

      // Get valid food IDs
      const validFoodIds = eventData
        .filter(event => event.food_id)
        .map(event => event.food_id);

      // Food info query
      const { data: foodData, error: foodError } = await supabase
        .from('Food')
        .select(`
          food_id,
          food_category,
          name,
          allergens
        `)
        .in('food_id', validFoodIds);

      if (foodError) {
        console.error('Food fetch error:', foodError);
      }

      // Get likes count using group by
      const { data: likesData, error: likesError } = await supabase
        .from('Event_Likes')
        .select('event_id, user_id.count()', { count: 'exact' })
        .in('event_id', eventData.map(event => event.event_id));

      if (likesError) {
        console.error('Likes fetch error:', likesError);
      }

      // Convert likes data to a lookup object
      const likeCounts = likesData ? likesData.reduce((acc, like) => {
        acc[like.event_id] = like.count;
        return acc;
      }, {} as Record<string, number>) : {};

      // Combine all the data
      let filteredData = eventData.map(event => {
        const foodInfo = (foodData?.find(f => f.food_id === event.food_id) || {}) as FoodInfo;
        return {
          ...event,
          food_category: foodInfo.food_category || undefined,
          food_name: foodInfo.name || undefined,
          allergens: foodInfo.allergens || undefined,
          like_count: likeCounts[event.event_id] || 0
        };
      });

      // Filter by allergens
      const activeAllergens = Object.entries(activeFilters.allergies)
        .filter(([, isExcluded]) => isExcluded)
        .map(([allergen]) => allergen.toLowerCase());

      if (activeAllergens.length > 0) {
        filteredData = filteredData.filter(event => {
          if (!event.allergens) return true;
          const eventAllergens = event.allergens.toLowerCase().split(',').map(a => a.trim());
          return !activeAllergens.some(allergen => eventAllergens.includes(allergen));
        });
      }

      setEvents(filteredData);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, activeFilters]);

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [router, user]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className='my-6'>
      <div className='w-full max-w-6xl mx-auto'>
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h1 className='text-text-primary font-bold font-montserrat text-2xl lg:text-3xl'>
              Events with Free Food
            </h1>
            <p className='text-text-primary font-inter text-xs lg:text-base'>
              Browse upcoming events at Boston University offering free food and snacks.
            </p>
          </div>
        </div>

        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4'>
          {/* Search Input */}
          <div className='w-full md:max-w-2xl'>
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={handleSearch}
              className='w-full font-inter border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:border-text-primary'
            />
          </div>

          {/* Buttons */}
          <div className='w-full flex flex-col sm:flex-row gap-4'>
            <button
              onClick={() => setIsFilterOpen(true)}
              className='bg-white text-brand-primary font-poppins font-black py-3 px-5 rounded-md border border-brand-primary duration-300 ease-in hover:bg-brand-primary hover:text-white flex items-center justify-center w-full'
            >
              Filter Events
            </button>
            <button
              onClick={() => setIsCreateEventOpen(true)}
              className='bg-brand-primary text-white font-poppins font-black py-3 px-5 rounded-md duration-300 ease-in hover:bg-hover-primary flex items-center justify-center w-full'
            >
              Post an Event
            </button>
          </div>
        </div>


        {/* Filter Modal */}
        <EventFilter
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApply={(filters) => {
            setActiveFilters(filters);
            setCurrentPage(1);
            setIsFilterOpen(false);
          }}
        />

        {/* Create Event Modal */}
        <CreateEventForm
          isOpen={isCreateEventOpen}
          onClose={() => setIsCreateEventOpen(false)}
          onSuccess={() => {
            // Refresh the events list
            setCurrentPage(1);
            fetchEvents();
          }}
        />

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="animate-spin text-brand-primary" size={40} style={{ animationDuration: '3s' }} />
          </div>
        ) : (
          <>
            {/* Events Grid */}
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {events.map((event, index) => (
                <EventCard 
                  key={event.event_id || index}
                  {...event}
                  onEventUpdated={fetchEvents}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-row justify-center items-center gap-4 mt-8">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-5 py-2 font-poppins font-bold text-sm rounded-md border border-brand-primary 
                          text-brand-primary hover:bg-brand-primary hover:text-white 
                          disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>

              <span className="font-poppins text-sm sm:text-base text-text-primary">
                Page {currentPage} of {totalPages}
              </span>

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-5 py-2 font-poppins font-bold text-sm rounded-md border border-brand-primary 
                          text-brand-primary hover:bg-brand-primary hover:text-white 
                          disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Events;