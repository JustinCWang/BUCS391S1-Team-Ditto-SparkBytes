'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { EventProps } from '@/types/supabase';
import EventCard from '@/component/eventCard';

const ITEMS_PER_PAGE = 9; // Number of events per page

const Events = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [events, setEvents] = useState<EventProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');


  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [router, user]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Create base query
        let query = supabase
          .from('Events')
          .select(`
            name, 
            date, 
            start_time, 
            end_time, 
            location, 
            description, 
            building,
            Food (
              food_category,
              name,
              allergens
            )
          `);

        // Add search filter if search query exists
        if (searchQuery) {
          query = query.ilike('name', `%${searchQuery}%`);
        }

        // Get total count with search filter
        const { count } = await query.select('*', { count: 'exact', head: true });

        if (count) {
          setTotalPages(Math.ceil(count / ITEMS_PER_PAGE));
        }

        // Fetch paginated and filtered events
        const { data, error } = await query
          .order('date', { ascending: false })
          .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);

        if (error) throw error;
        
        if (data) {
          const transformedData = data.map(event => ({
            ...event,
            food_category: event.Food?.food_category,
            food_name: event.Food?.name,
            allergens: event.Food?.allergens
          }));          
          setEvents(transformedData);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [currentPage, searchQuery]); // Add searchQuery as dependency

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className='my-6 px-4'>
      <div className='w-full max-w-6xl mx-auto'>
        <h1 className='text-text-primary font-bold font-montserrat text-xl lg:text-3xl mb-8'>
          All Events
        </h1>

        {/* Search Bar TODO: Add Design based on Figma */}
        <div className='mb-8'>
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={handleSearch}
            className='w-full max-w-md px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

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