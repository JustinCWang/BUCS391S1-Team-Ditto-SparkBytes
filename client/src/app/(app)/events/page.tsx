'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { EventCardProps } from '@/types/supabase';
import EventCard from '@/component/eventCard';
import EventFilter, { FilterState } from '@/component/EventFilter';
import CreateEventForm from '@/component/CreateEventForm';

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

  const fetchEvents = async () => {
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
  };

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [router, user]);

  useEffect(() => {
    fetchEvents();
  }, [currentPage, searchQuery, activeFilters]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className='my-6 px-4'>
      <div className='w-full max-w-6xl mx-auto'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-text-primary font-bold font-montserrat text-xl lg:text-3xl'>
            All Events
          </h1>
          <div className='flex gap-4'>
            <button
              onClick={() => setIsFilterOpen(true)}
              className='px-4 py-2 border border-red-400 text-red-400 rounded-md hover:bg-red-50'
            >
              Filter Events
            </button>
            <button
              onClick={() => setIsCreateEventOpen(true)}
              className='px-4 py-2 bg-red-400 text-white rounded-md hover:bg-red-500'
            >
              Post an Event
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className='mb-8'>
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={handleSearch}
            className='w-full max-w-md px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
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
          <div>Loading...</div>
        ) : (
          <>
            {/* Events Grid */}
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {events.map((event, index) => (
                <EventCard 
                key={index}
                name={event.name}
                date={event.date}
                start_time={event.start_time}
                end_time={event.end_time}
                location={event.location}
                description={event.description}
                building={event.building}
                food_category={event.food_category}
                food_name={event.food_name}
                allergens={event.allergens}
                like_count={event.like_count}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className='flex justify-center gap-2 mt-8'>
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className='px-4 py-2 border rounded-md disabled:opacity-50'
              >
                Previous
              </button>
              <span className='px-4 py-2'>
                Page {currentPage} of {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className='px-4 py-2 border rounded-md disabled:opacity-50'
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