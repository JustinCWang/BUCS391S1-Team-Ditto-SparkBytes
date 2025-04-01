'use client'
import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { EventCardProps } from '@/types/supabase';

import SecondaryButton from '@/component/secondaryButton';
import EventCard from '@/component/eventCard';
import { Loader } from 'lucide-react';

// Add this type near the top of the file
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

  useEffect(() => {
      if (!user) {
        router.push('/');
      }
  }, [router, user]);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setIsLoading(true);
        // Basic event info query
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

        // Get valid food IDs
        const validFoodIds = eventData
          .filter(event => event.food_id)
          .map(event => event.food_id);

        if (validFoodIds.length === 0) {
          setIsLoading(false);
          console.log('No valid food IDs found');
          setEvents(eventData);
          return;
        }

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

        console.log(foodData);

        if (foodError) {
          setIsLoading(false);
          console.error('Food fetch error:', foodError);
          setEvents(eventData);
          return;
        }

        // Get likes count using group by
        const { data: likesData, error: likesError } = await supabase
          .from('Event_Likes')
          .select('event_id, user_id.count()', { count: 'exact' })
          .in('event_id', eventData.map(event => event.event_id));

        console.log('Event IDs being queried:', eventData.map(event => event.event_id));

        if (likesError) {
          console.error('Likes fetch error:', likesError);
          console.error('Full error details:', JSON.stringify(likesError, null, 2));
        }

        // Test if we can get any data from Event_Likes
        const { data: testData, error: testError } = await supabase
          .from('Event_Likes')
          .select('*');

        console.log('Test query of Event_Likes:', testData);
        if (testError) {
          console.error('Test query error:', testError);
        }

        console.log('Likes data:', likesData);

        // Convert likes data to a lookup object
        const likeCounts = likesData ? likesData.reduce((acc, like) => {
          console.log('Like object:', like);
          acc[like.event_id] = like.count;
          return acc;
        }, {} as Record<string, number>) : {};

        console.log('Final like counts:', likeCounts);

        // Combine all the data
        const combinedData = eventData.map(event => {
          const foodInfo = (foodData?.find(f => f.food_id === event.food_id) || {}) as FoodInfo;
          return {
            ...event,
            food_category: foodInfo.food_category || undefined,
            food_name: foodInfo.name || undefined,
            allergens: foodInfo.allergens || undefined,
            like_count: likeCounts[event.event_id] || 0
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
  }, []);

  return (
    <div className='my-6'>
      
      {/** Header */}
      <div className='w-full max-w-6xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4'>
        <div>
          <h1 className='text-text-primary font-bold font-montserrat text-2xl lg:text-3xl'>Upcoming Events</h1>
          <p className='text-text-primary font-inter text-xs lg:text-base'>Get some free food!</p>
        </div>

        <div className='w-full lg:w-auto'>
          <SecondaryButton 
            text='View All' 
            linkTo='/events' 
            styling='py-3 w-full sm:w-auto' 
          />
        </div>
      </div>

      {/** 3 Events */}
      {isLoading ? (
        <div className="w-full flex justify-center items-center" style={{ height: '50vh' }}>
          <Loader className="animate-spin text-brand-primary" size={32} style={{ animationDuration: '3s' }} />
        </div>
      ) : (
        <div className='w-full max-w-6xl mx-auto grid mt-8 lg:grid-cols-3 gap-8'>
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
      )}

    </div>
  );
};

export default Dashboard;