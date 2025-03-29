'use client'
import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase }  from '@/lib/supabase';

import SecondaryButton from '@/component/secondaryButton';
import EventCard from '@/component/eventCard';

const Dashboard: React.FC = () => {

  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
      if (!user) {
        router.push('/');
      }
  }, [router, user]);

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
        <EventCard 
          name='Computer Science Department Seminar'
          date='Tuesday, April 1, 2025'
          start_time='12:00 PM'
          end_time='1:30 PM'
          location='CDS 201'
          description='Join us for a talk on the latest advancements in AI and machine learning.'
        />
        <EventCard 
          name='Computer Science Department Seminar'
          date='Tuesday, April 1, 2025'
          start_time='12:00 PM'
          end_time='1:30 PM'
          location='CDS 201'
          description='Join us for a talk on the latest advancements in AI and machine learning.'
        />
        <EventCard 
          name='Computer Science Department Seminar'
          date='Tuesday, April 1, 2025'
          start_time='12:00 PM'
          end_time='1:30 PM'
          location='CDS 201'
          description='Join us for a talk on the latest advancements in AI and machine learning.'
        />
      </div>

    </div>
  );
};

export default Dashboard;