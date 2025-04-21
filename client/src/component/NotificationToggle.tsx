'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Loader } from 'lucide-react';

const NotificationToggle = () => {
  const { user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotificationPreference = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('Users')
          .select('notifications')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setNotificationsEnabled(data?.notifications ?? true);
      } catch (error) {
        console.error('Error fetching notification preference:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotificationPreference();
  }, [user]);

  const handleToggle = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('Users')
        .update({ notifications: !notificationsEnabled })
        .eq('user_id', user.id);

      if (error) throw error;
      setNotificationsEnabled(!notificationsEnabled);
    } catch (error) {
      console.error('Error updating notification preference:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader className="animate-spin" size={20} />;
  }

  return (
    <button
      onClick={handleToggle}
      className={`w-12 h-6 rounded-full transition-colors duration-200 ${
        notificationsEnabled ? 'bg-brand-primary' : 'bg-gray-300'
      }`}
    >
      <div
        className={`w-5 h-5 rounded-full bg-white transform transition-transform duration-200 ${
          notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

export default NotificationToggle;