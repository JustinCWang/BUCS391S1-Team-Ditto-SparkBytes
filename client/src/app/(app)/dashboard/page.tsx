'use client'
import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase }  from '@/lib/supabase';

const Dashboard: React.FC = () => {

  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
      if (!user) {
        router.push('/');
      }
  }, [router, user]);

  return (
    <div>
      
    </div>
  );
};

export default Dashboard;