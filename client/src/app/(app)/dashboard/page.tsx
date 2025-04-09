'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { EventCardProps } from '@/types/supabase';

import SecondaryButton from '@/component/secondaryButton';
import EventCard from '@/component/eventCard';
import { Loader } from 'lucide-react';

// Type definition for food-related data
type FoodInfo = {
  food_id?: string;
  food_category?: string | null;
  name?: string | null;
  allergens?: string | null;
};

const Dashboard: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [events, setEvents] = useState<EventCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the user is logged in; if not, redirect to the homepage
  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [router, user]);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setIsLoading(true);

        // Query basic event information from the "Events" table
        const { data: eventData, error: eventError } = await supabase
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
          `)
          .order('date', { ascending: false })
          .limit(3);

        if (eventError) {
          setIsLoading(false);
          console.error('Event fetch error:', eventError);
          return;
        }

        if (!eventData || eventData.length === 0) {
          setIsLoading(false);
          console.log('No events found');
          setEvents([]);
          return;
        }

        // Retrieve all valid food IDs from the events data
        const validFoodIds = eventData
          .filter(event => event.food_id)
          .map(event => event.food_id);

        if (validFoodIds.length === 0) {
          setIsLoading(false);
          console.log('No valid food IDs found');
          setEvents(eventData);
          return;
        }

        // Query food information from the "Food" table based on valid food IDs
        const { data: foodData, error: foodError } = await supabase
          .from('Food')
          .select(`
            food_id,
            food_category,
            name,
            allergens
          `)
          .in('food_id', validFoodIds);

        console.log(foodData);

        if (foodError) {
          setIsLoading(false);
          console.error('Food fetch error:', foodError);
          setEvents(eventData);
          return;
        }

        // Query like counts for all events (grouped by event_id)
        const { data: likesData, error: likesError } = await supabase
          .from('Event_Likes')
          .select('event_id, user_id.count()', { count: 'exact' })
          .in('event_id', eventData.map(event => event.event_id));

        console.log('Event IDs being queried:', eventData.map(event => event.event_id));

        if (likesError) {
          console.error('Likes fetch error:', likesError);
          console.error('Full error details:', JSON.stringify(likesError, null, 2));
        }

        // Convert like data into a lookup object keyed by event_id
        const likeCounts = likesData
          ? likesData.reduce((acc, like) => {
              console.log('Like object:', like);
              acc[like.event_id] = like.count;
              return acc;
            }, {} as Record<string, number>)
          : {};

        console.log('Final like counts:', likeCounts);

        // Get a list of events liked by the current user
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

        // Combine event, food, and like data, and add an "isLiked" field for each event
        const combinedData = eventData.map(event => {
          const foodInfo = (foodData?.find(f => f.food_id === event.food_id) || {}) as FoodInfo;
          return {
            ...event,
            food_category: foodInfo.food_category || undefined,
            food_name: foodInfo.name || undefined,
            allergens: foodInfo.allergens || undefined,
            like_count: likeCounts[event.event_id] || 0,
            isLiked: likedEventIds.includes(event.event_id),
          };
        });

        setIsLoading(false);
        setEvents(combinedData);
      } catch (error) {
        setIsLoading(false);
        console.error('Unexpected error:', error);
        console.log('Full error object:', JSON.stringify(error, null, 2));
      }
    };

    fetchEventData();
  }, [user]);

  return (
    <div className="my-6">
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

      {/* Display events or a loader if data is still being fetched */}
      {isLoading ? (
        <div className="w-full flex justify-center items-center h-[50vh]">
          <Loader className="animate-spin text-brand-primary" size={32} style={{ animationDuration: '3s' }} />
        </div>
      ) : (
        <div className="w-full max-w-6xl mx-auto grid mt-8 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <EventCard 
              key={index}
              event_id={event.event_id}
              name={event.name}
              date={event.date}
              start_time={event.start_time}
              end_time={event.end_time}
              location={event.location}
              description={event.description}
              building={event.building}
              food_name={event.food_name}
              allergens={event.allergens}
              like_count={event.like_count}
              isLiked={event.isLiked} // Pass whether the event is liked
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
