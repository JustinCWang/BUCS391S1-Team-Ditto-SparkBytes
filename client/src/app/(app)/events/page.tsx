'use client'

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { EventCardProps } from '@/types/supabase';
import EventCard from '@/component/eventCard';
import EventFilter, { FilterState } from '@/component/EventFilter';
import CreateEventForm from '@/component/CreateEventForm';
import { Loader } from 'lucide-react';
import EventSearchBar from '@/component/EventSearchBar';

const ITEMS_PER_PAGE = 9; // Number of events per page

import { useTheme } from '@/context/ThemeContext';
import { userRole } from "@/lib/user";

// Type definition for food-related data
type FoodInfo = {
  food_id?: string;
  food_category?: string | null;
  name?: string | null;
  allergens?: string | null;
  quantity?: number | null;
};

// Create a client component that uses useSearchParams
function EventsContent() {
  const searchParams = useSearchParams();
  const initialLocation = (searchParams.get('location') ?? '') as FilterState['location'];
  
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [role, setRole] = useState<string>("");
  const [events, setEvents] = useState<EventCardProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    date: 'any',
    location: initialLocation,
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

  // Fetch events from the database with filtering, pagination, and like count
  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);

      // Build the main query to fetch event data
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
          building,
          organizer_id
        `);

      if (searchQuery) {
        dataQuery = dataQuery.ilike('name', `%${searchQuery}%`);
      }

      // Filter by date
      if (filters.date === 'today') {
        const today = new Date().toISOString().split('T')[0];
        dataQuery = dataQuery.eq('date', today);
      } else if (filters.date === 'this_week') {
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() + (6 - today.getDay()));
        dataQuery = dataQuery
          .gte('date', weekStart.toISOString().split('T')[0])
          .lte('date', weekEnd.toISOString().split('T')[0]);
      }

      // Filter by location (building)
      if (filters.location) {
        dataQuery = dataQuery.eq('building', filters.location);
      }

      // Fetch all events that match the date and location filters
      const { data: eventData, error: eventError } = await dataQuery
        .order('date', { ascending: false });
      if (eventError) {
        console.error('Event fetch error:', eventError);
        return;
      }
      if (!eventData || eventData.length === 0) {
        setEvents([]);
        setIsLoading(false);
        return;
      }

      // Extract valid food IDs from events
      const validFoodIds = eventData
        .filter(event => event.food_id)
        .map(event => event.food_id);

      // Fetch food information based on valid food IDs
      const { data: foodData, error: foodError } = await supabase
        .from('Food')
        .select(`
          food_id,
          food_category,
          name,
          allergens,
          quantity
        `)
        .in('food_id', validFoodIds);
      if (foodError) {
        console.error('Food fetch error:', foodError);
      }

      // Fetch like counts for each event (grouped by event_id)
      const { data: likesData, error: likesError } = await supabase
        .from('Event_Likes')
        .select('event_id, user_id.count()', { count: 'exact' })
        .in('event_id', eventData.map(event => event.event_id));
      if (likesError) {
        console.error('Likes fetch error:', likesError);
      }
      // Convert likes data to a lookup object: { event_id: count }
      const likeCounts = likesData
        ? likesData.reduce((acc, like) => {
            acc[like.event_id] = like.count;
            return acc;
          }, {} as Record<string, number>)
        : {};

      // Fetch the list of events that the current user has liked
      let likedEventIds: string[] = [];
      if (user) {
        const eventIds = eventData.map(event => event.event_id);
        const { data: userLikesData, error: userLikesError } = await supabase
          .from('Event_Likes')
          .select('event_id')
          .eq('user_id', user.id)
          .in('event_id', eventIds);
        if (userLikesError) {
          console.error('User likes fetch error:', userLikesError);
        }
        likedEventIds = userLikesData?.map(item => item.event_id) || [];
      }

      // Combine event, food, and like data; add an isLiked field for each event
      const combinedData = eventData.map(event => {
        const foodInfo = (foodData?.find(f => f.food_id === event.food_id) || {}) as FoodInfo;
        return {
          ...event,
          food_category: foodInfo.food_category || undefined,
          food_name: foodInfo.name || undefined,
          allergens: foodInfo.allergens || undefined,
          quantity: foodInfo.quantity || 1,
          like_count: likeCounts[event.event_id] || 0,
          isLiked: likedEventIds.includes(event.event_id),
        };
      });

      // Apply allergy filters
      const filteredData = combinedData.filter(event => {
        if (!event.allergens) return true; // If no allergens listed, show the event
        
        const eventAllergens = event.allergens.split(',').map(a => a.trim().toLowerCase());
        
        // Check if any of the selected allergies are in the event's allergens
        const selectedAllergies = Object.entries(filters.allergies)
          .filter(([, isSelected]) => isSelected)
          .map(([allergy]) => {
            const allergyKey = allergy.toLowerCase();
            // Special case for gluten-free
            if (allergyKey === 'glutenfree') {
              return 'gluten-free';
            }
            return allergyKey;
          });
        
        // Only show events that don't contain any of the selected allergies
        return !selectedAllergies.some(allergy => 
          eventAllergens.some(eventAllergen => 
            eventAllergen.includes(allergy)
          )
        );
      });

      // Update total pages based on filtered data
      setTotalPages(Math.ceil(filteredData.length / ITEMS_PER_PAGE));

      // Apply pagination to the filtered data
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      setEvents(paginatedData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }, [currentPage, searchQuery, filters, user]);

  useEffect(() => {
    const fetchRole = async () => {
      if (user) {
        const { data, error } = await userRole(user.id);
        if (error) {
          console.error("Error fetching role:", error.message);
        } else {
          setRole(data.role)
        }
      }
    };

    if (!authLoading && user) {
      fetchRole();
    }
  }, [user, authLoading]);

  // Fetch events when dependencies change
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Add useEffect for handling scroll on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Handle search input change and reset to first page when searching
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Only redirect if auth is not loading and user is not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  // Show loading state while authentication is being determined
  if (authLoading) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <Loader className="animate-spin text-brand-primary" size={40} style={{ animationDuration: '3s' }} />
      </div>
    );
  }

  // If not loading and still in the component, user is authenticated
  return (
    <div className="my-6">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header section with title and description */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-text-primary font-bold font-montserrat text-2xl lg:text-3xl">
              Events with Free Food
            </h1>
            <p className="text-text-primary font-inter text-xs lg:text-base">
              Browse upcoming events at Boston University offering free food and snacks.
            </p>
          </div>
        </div>

        {/* Search bar and buttons section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          {/* Search input field */}
          <div className="w-full md:max-w-2xl">
            <EventSearchBar
              searchQuery={searchQuery}
              onChange={handleSearch}
            />
          </div>

          {/* Buttons for filtering and creating events */}
          <div className="w-full flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setIsFilterOpen(true)}
              className={`${isDark ? 'bg-[#222224]' : 'bg-white'}
                text-brand-primary font-poppins 
                font-black py-3 px-5 rounded-md border 
                border-brand-primary duration-300 ease-in 
                hover:text-white hover:bg-brand-primary
                flex items-center justify-center w-full`}
            >
              Filter Events
            </button>
            <button
              onClick={() => setIsCreateEventOpen(true)}
              className={`bg-brand-primary text-white font-poppins font-black py-3 px-5 rounded-md duration-300 ease-in hover:bg-hover-primary flex items-center justify-center w-full ${role === "admin" ? "block" : "hidden"}`}
            >
              Post an Event
            </button>
          </div>
        </div>

        {/* Event Filter Modal */}
        <EventFilter
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApply={(filters) => {
            setFilters(filters);
            setCurrentPage(1);
            setIsFilterOpen(false);
          }}
        />

        {/* Create Event Modal */}
        <CreateEventForm
          isOpen={isCreateEventOpen}
          onClose={() => setIsCreateEventOpen(false)}
          onSuccess={() => {
            setCurrentPage(1);
            fetchEvents();
          }}
        />

        {isLoading ? (
          // Display loader while fetching events
          <div className="w-full flex justify-center items-center h-[50vh]">
            <Loader className="animate-spin text-brand-primary" size={40} style={{ animationDuration: '3s' }} />
          </div>
        ) : (
          <>
            {events.length > 0 ? (
              <>
                {/* Grid display for event cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {events.map((event, index) => (
                    <EventCard
                      key={event.event_id || index}
                      {...event}
                      onEventUpdated={fetchEvents}
                    />
                  ))}
                </div>

                {/* Pagination controls - only show if there are pages */}
                {totalPages > 0 && (
                  <div className="flex flex-row justify-center items-center gap-4 mt-8">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-5 py-2 font-poppins font-bold text-sm rounded-md border border-brand-primary 
                              text-brand-primary hover:bg-brand-primary hover:text-white 
                              disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full flex justify-center items-center h-[30vh]">
                <p className="text-lg text-gray-500 font-inter">
                  Uh oh, it seems there are no events matching your search criteria.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Main Page component that wraps the content in a Suspense boundary
export default function Events() {
  return (
    <Suspense fallback={
      <div className="w-full flex justify-center items-center h-screen">
        <Loader className="animate-spin text-brand-primary" size={40} style={{ animationDuration: '3s' }} />
      </div>
    }>
      <EventsContent />
    </Suspense>
  );
}
