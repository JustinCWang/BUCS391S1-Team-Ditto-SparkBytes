'use client'
import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { EventProps } from '@/types/supabase';

import SecondaryButton from '@/component/secondaryButton';
import EventCard from '@/component/eventCard';

const Dashboard: React.FC = () => {

  const router = useRouter();
  const { user } = useAuth();
  const [events, setEvents] = useState<EventProps[]>([]);

  useEffect(() => {
      if (!user) {
        router.push('/');
      }
  }, [router, user]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
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
          `)
          .order('date', { ascending: false })
          .limit(3);

        if (error) throw error
        
        if (data) {
          const transformedData = data.map(event => {
            return {
              ...event,
              food_category: event.Food?.food_category,
              food_name: event.Food?.name,
              allergens: event.Food?.allergens
            };
          });          
          setEvents(transformedData);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className='my-6'>
      
      {/** Header */}
      <div className='w-full max-w-6xl mx-auto flex justify-between items-center'>
        <div>
          <h1 className='text-text-primary font-bold font-montserrat text-xl lg:text-3xl'>Upcoming Events</h1>
          <p className='text-text-primary font-inter text-sm lg:text-base'>Get some free food!</p>
        </div>
          <SecondaryButton text='View All' linkTo='/events' styling='text-xs sm:text-lg'/>
      </div>

      {/** 3 Events */}
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
          />
        ))}
      </div>

    </div>
  );
};

export default Dashboard;