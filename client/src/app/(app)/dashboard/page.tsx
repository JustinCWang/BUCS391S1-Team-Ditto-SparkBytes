'use client'

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { EventCardProps } from '@/types/supabase';
import EventCard from '@/component/eventCard';
import SecondaryButton from '@/component/secondaryButton';
import { Loader } from 'lucide-react';
import SectionNavigator from '@/component/sectionNavigator';
import { userRole } from "@/lib/user"; // Import the userRole function

// Type definition for food-related data
type FoodInfo = {
  food_id?: string;
  food_category?: string | null;
  name?: string | null;
  allergens?: string | null;
  quantity?: number | null;
};

// Utility function to get current date in Boston time zone
const getCurrentDateInBostonTZ = () => {
  const bostonTime = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
  return new Date(bostonTime).toISOString().split('T')[0];
};

const Dashboard = () => {
  const router = useRouter();
  const { user } = useAuth();

  // Core state for role and data collections
  const [role, setRole] = useState<string>(""); // Add role state
  const [upcomingEvents, setUpcomingEvents] = useState<EventCardProps[]>([]);
  const [likedEvents, setLikedEvents] = useState<EventCardProps[]>([]);
  const [myEvents, setMyEvents] = useState<EventCardProps[]>([]);

  // Loading and pagination states
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingLiked, setIsLoadingLiked] = useState(true);
  const [isLoadingMyEvents, setIsLoadingMyEvents] = useState(true);
  const [currentLikedPage, setCurrentLikedPage] = useState(1);
  const [totalLikedPages, setTotalLikedPages] = useState(0);
  const [currentMyEventsPage, setCurrentMyEventsPage] = useState(1);
  const [totalMyEventsPages, setTotalMyEventsPages] = useState(0);
  const LIKED_ITEMS_PER_PAGE = 6; // Number of events per page for liked events
  const MY_EVENTS_ITEMS_PER_PAGE = 6; // Number of events per page for my events

  // Fetch the user's role once authenticated
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

    if (!user) {
      router.push('/');
    } else {
      fetchRole();
    }
  }, [user, router]);

  // Fetch the 3 closest upcoming events
  const fetchUpcomingEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      // Get current date in Boston time zone
      const currentDate = getCurrentDateInBostonTZ();

      // Build the main query to fetch event data
      const dataQuery = supabase
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
        `)
        .gte('date', currentDate) // Use the Boston-adjusted date
        .order('date', { ascending: true }) // Order by date, closest first
        .limit(3); // Only get the 3 closest events

      // Fetch all events
      const { data: eventData, error: eventError } = await dataQuery;
      if (eventError) {
        console.error('Event fetch error:', eventError);
        return;
      }
      if (!eventData || eventData.length === 0) {
        setUpcomingEvents([]);
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

      setUpcomingEvents(combinedData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }, [user]);

  // Fetch liked events
  const fetchLikedEvents = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoadingLiked(true);

      // Get all events that the user has liked
      const { data: likedEventIds, error: likedEventsError } = await supabase
        .from('Event_Likes')
        .select('event_id')
        .eq('user_id', user.id);

      if (likedEventsError) {
        console.error('Error fetching liked events:', likedEventsError);
        setIsLoadingLiked(false);
        return;
      }

      if (!likedEventIds || likedEventIds.length === 0) {
        setLikedEvents([]);
        setIsLoadingLiked(false);
        return;
      }

      // Get the actual event data for the liked events
      const { data: likedEventsData, error: eventsError } = await supabase
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
        `)
        .in('event_id', likedEventIds.map(item => item.event_id))
        .order('date', { ascending: false }); // Original ordering

      if (eventsError) {
        console.error('Error fetching event details:', eventsError);
        setIsLoadingLiked(false);
        return;
      }

      if (!likedEventsData || likedEventsData.length === 0) {
        setLikedEvents([]);
        setIsLoadingLiked(false);
        return;
      }

      // Extract event data and get food information
      const eventIds = likedEventsData.map(event => event.event_id);
      const foodIds = likedEventsData
        .filter(event => event.food_id)
        .map(event => event.food_id);

      // Get food information for liked events
      let foodData: FoodInfo[] = [];
      if (foodIds.length > 0) {
        const { data: foodInfo, error: foodError } = await supabase
          .from('Food')
          .select('food_id, food_category, name, allergens, quantity')
          .in('food_id', foodIds);

        if (!foodError) {
          foodData = foodInfo || [];
        }
      }

      // Get like counts for liked events
      const { data: likesData } = await supabase
        .from('Event_Likes')
        .select('event_id, user_id.count()', { count: 'exact' })
        .in('event_id', eventIds);

      const likeCounts = likesData
        ? likesData.reduce((acc, like) => {
            acc[like.event_id] = like.count;
            return acc;
          }, {} as Record<string, number>)
        : {};

      // Combine all data
      const combinedData: EventCardProps[] = likedEventsData.map(event => {
        const foodInfo = foodData.find(f => f.food_id === event.food_id) || {} as FoodInfo;
        return {
          event_id: event.event_id,
          name: event.name,
          date: event.date,
          start_time: event.start_time,
          end_time: event.end_time,
          location: event.location,
          description: event.description,
          building: event.building || undefined,
          food_id: event.food_id || undefined,
          food_name: foodInfo.name || undefined,
          allergens: foodInfo.allergens || undefined,
          quantity: foodInfo.quantity || 1,
          like_count: likeCounts[event.event_id] || 0,
          isLiked: true,
          organizer_id: event.organizer_id
        };
      });

      // Update total pages based on data
      setTotalLikedPages(Math.ceil(combinedData.length / LIKED_ITEMS_PER_PAGE));

      // Apply pagination to the data
      const startIndex = (currentLikedPage - 1) * LIKED_ITEMS_PER_PAGE;
      const endIndex = startIndex + LIKED_ITEMS_PER_PAGE;
      const paginatedData = combinedData.slice(startIndex, endIndex);

      setLikedEvents(paginatedData);
      setIsLoadingLiked(false);
    } catch (error) {
      console.error('Error in fetchLikedEvents:', error);
      setIsLoadingLiked(false);
    }
  }, [user, currentLikedPage]);

  // Fetch my events
  const fetchMyEvents = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoadingMyEvents(true);

      // Get events created by the current user
      const { data: myEventsData, error: myEventsError } = await supabase
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
        `)
        .eq('organizer_id', user.id)
        .order('date', { ascending: false }); // Original ordering

      if (myEventsError) {
        console.error('Error fetching my events:', myEventsError);
        setIsLoadingMyEvents(false);
        return;
      }

      if (!myEventsData || myEventsData.length === 0) {
        setMyEvents([]);
        setIsLoadingMyEvents(false);
        return;
      }

      // Extract event data and get food information
      const eventIds = myEventsData.map(event => event.event_id);
      const foodIds = myEventsData
        .filter(event => event.food_id)
        .map(event => event.food_id);

      // Get food information for my events
      let foodData: FoodInfo[] = [];
      if (foodIds.length > 0) {
        const { data: foodInfo, error: foodError } = await supabase
          .from('Food')
          .select('food_id, food_category, name, allergens, quantity')
          .in('food_id', foodIds);

        if (!foodError) {
          foodData = foodInfo || [];
        }
      }

      // Get like counts for my events
      const { data: likesData } = await supabase
        .from('Event_Likes')
        .select('event_id, user_id.count()', { count: 'exact' })
        .in('event_id', eventIds);

      const likeCounts = likesData
        ? likesData.reduce((acc, like) => {
            acc[like.event_id] = like.count;
            return acc;
          }, {} as Record<string, number>)
        : {};

      // Get which of my events the user has liked
      let likedEventIds: string[] = [];
      if (user) {
        const { data: userLikesData } = await supabase
          .from('Event_Likes')
          .select('event_id')
          .eq('user_id', user.id)
          .in('event_id', eventIds);

        likedEventIds = userLikesData?.map(item => item.event_id) || [];
      }

      // Combine all data
      const combinedData: EventCardProps[] = myEventsData.map(event => {
        const foodInfo = foodData.find(f => f.food_id === event.food_id) || {} as FoodInfo;
        return {
          event_id: event.event_id,
          name: event.name,
          date: event.date,
          start_time: event.start_time,
          end_time: event.end_time,
          location: event.location,
          description: event.description,
          building: event.building || undefined,
          food_id: event.food_id || undefined,
          food_name: foodInfo.name || undefined,
          allergens: foodInfo.allergens || undefined,
          quantity: foodInfo.quantity || 1,
          like_count: likeCounts[event.event_id] || 0,
          isLiked: likedEventIds.includes(event.event_id),
          organizer_id: event.organizer_id
        };
      });

      // Update total pages based on data
      setTotalMyEventsPages(Math.ceil(combinedData.length / MY_EVENTS_ITEMS_PER_PAGE));

      // Apply pagination to the data
      const startIndex = (currentMyEventsPage - 1) * MY_EVENTS_ITEMS_PER_PAGE;
      const endIndex = startIndex + MY_EVENTS_ITEMS_PER_PAGE;
      const paginatedData = combinedData.slice(startIndex, endIndex);

      setMyEvents(paginatedData);
      setIsLoadingMyEvents(false);
    } catch (error) {
      console.error('Error in fetchMyEvents:', error);
      setIsLoadingMyEvents(false);
    }
  }, [user, currentMyEventsPage]);

  // Fetch events when dependencies change
  useEffect(() => {
    fetchUpcomingEvents();
    fetchLikedEvents();
    // Only fetch my events if user is an admin
    if (role === 'admin') {
      fetchMyEvents();
    }
  }, [fetchUpcomingEvents, fetchLikedEvents, fetchMyEvents, role]);

  return (
    <div className="my-6">
      <SectionNavigator />
      <div className="w-full max-w-6xl mx-auto">
        {/* Header section */}
        <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-text-primary font-bold font-montserrat text-2xl lg:text-3xl">
              Upcoming Events
            </h1>
            <p className="text-text-primary font-inter text-xs lg:text-base">
              Get some free food!
            </p>
          </div>
          <div className="w-full lg:w-auto">
            <SecondaryButton 
              text="View All" 
              linkTo="/events" 
              styling="py-3 w-full sm:w-auto" 
            />
          </div>
        </div>

        {/* Update the Upcoming Events section */}
        {isLoading ? (
          // Display loader while fetching events
          <div className="w-full flex justify-center items-center h-[50vh]">
            <Loader className="animate-spin text-brand-primary" size={40} style={{ animationDuration: '3s' }} />
          </div>
        ) : (
          <>
            {upcomingEvents.length > 0 ? (
              <>
                {/* Grid display for event cards */}
                <div id="upcoming" className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                  {upcomingEvents.map((event, index) => (
                    <EventCard
                      key={event.event_id || index}
                      {...event}
                      onEventUpdated={fetchUpcomingEvents}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="w-full flex justify-center items-center h-[30vh]">
                <p className="text-lg text-gray-500 font-inter">
                  Uh oh, it seems there are no upcoming events right now.
                </p>
              </div>
            )}
          </>
        )}

        {/* Liked Events section */}
        <div id="liked" className="mt-16">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-text-primary font-bold font-montserrat text-2xl lg:text-3xl">
                Your Liked Events
              </h1>
              <p className="text-text-primary font-inter text-xs lg:text-base">
                Events you&apos;ve shown interest in
              </p>
            </div>
          </div>

          {/* Update the Liked Events section */}
          {isLoadingLiked ? (
            // Display loader while fetching events
            <div className="w-full flex justify-center items-center h-[50vh]">
              <Loader className="animate-spin text-brand-primary" size={40} style={{ animationDuration: '3s' }} />
            </div>
          ) : (
            <>
              {likedEvents.length > 0 ? (
                <>
                  {/* Grid display for event cards */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                    {likedEvents.map((event, index) => (
                      <EventCard
                        key={event.event_id || index}
                        {...event}
                        onEventUpdated={fetchLikedEvents}
                      />
                    ))}
                  </div>

                  {/* Pagination controls - only show if there are pages */}
                  {totalLikedPages > 0 && (
                    <div className="flex flex-row justify-center items-center gap-4 mt-8">
                      <button
                        onClick={() => setCurrentLikedPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentLikedPage === 1}
                        className="px-5 py-2 font-poppins font-bold text-sm rounded-md border border-brand-primary 
                                  text-brand-primary hover:bg-brand-primary hover:text-white 
                                  disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        Previous
                      </button>

                      <span className="font-poppins text-sm sm:text-base text-text-primary">
                        Page {currentLikedPage} of {totalLikedPages}
                      </span>

                      <button
                        onClick={() => setCurrentLikedPage((prev) => Math.min(prev + 1, totalLikedPages))}
                        disabled={currentLikedPage === totalLikedPages}
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
                    Uh oh, it seems you haven&apos;t liked any events yet.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* My Events section - only show for admins */}
        {role === 'admin' && (
          <div id="my" className="mt-16">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-text-primary font-bold font-montserrat text-2xl lg:text-3xl">
                  My Events
                </h1>
                <p className="text-text-primary font-inter text-xs lg:text-base">
                  Events you&apos;ve created
                </p>
              </div>
            </div>

            {/* Update the My Events section */}
            {isLoadingMyEvents ? (
              <div className="w-full flex justify-center items-center h-[50vh]">
                <Loader className="animate-spin text-brand-primary" size={40} style={{ animationDuration: '3s' }} />
              </div>
            ) : (
              <>
                {myEvents.length > 0 ? (
                  <>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                      {myEvents.map((event, index) => (
                        <EventCard
                          key={event.event_id || index}
                          {...event}
                          onEventUpdated={fetchMyEvents}
                        />
                      ))}
                    </div>

                    {/* Pagination controls - only show if there are pages */}
                    {totalMyEventsPages > 0 && (
                      <div className="flex flex-row justify-center items-center gap-4 mt-8">
                        <button
                          onClick={() => setCurrentMyEventsPage((prev) => Math.max(prev - 1, 1))}
                          disabled={currentMyEventsPage === 1}
                          className="px-5 py-2 font-poppins font-bold text-sm rounded-md border border-brand-primary 
                                    text-brand-primary hover:bg-brand-primary hover:text-white 
                                    disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          Previous
                        </button>

                        <span className="font-poppins text-sm sm:text-base text-text-primary">
                          Page {currentMyEventsPage} of {totalMyEventsPages}
                        </span>

                        <button
                          onClick={() => setCurrentMyEventsPage((prev) => Math.min(prev + 1, totalMyEventsPages))}
                          disabled={currentMyEventsPage === totalMyEventsPages}
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
                      Uh oh, it seems you haven&apos;t created any events yet.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
