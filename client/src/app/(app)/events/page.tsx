'use client'
import {useEffect} from 'react';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const Events = () => {

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

export default Events;