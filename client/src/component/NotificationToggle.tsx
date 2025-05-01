'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { Loader, Trash2 } from 'lucide-react';


/**
 * Allows users to toggle event notifications on/off and clear shown notifications.
 * Syncs the setting with the Supabase `Users` table and handles local state/UI.
 */
const NotificationToggle = () => {
  const { user } = useAuth();
  const { clearShownEvents } = useNotifications();

  // Whether notifications are enabled (synced with DB)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Loading state for fetch and update operations
  const [loading, setLoading] = useState(true);


  /**
   * On component mount or when `user` changes,
   * fetch the user's current notification preference from Supabase.
   */
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

  /**
   * Toggle notificationsEnabled state and update Supabase
   */
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

  /**
   * Clears localStorage and resets shown notification events
   */
  const clearNotificationHistory = () => {
    localStorage.removeItem('shownEventIds');
    clearShownEvents();
    console.log('[Notification] Cleared notification history');
  };

  // Show a spinner while loading user preference
  if (loading) {
    return <Loader className="animate-spin" size={20} />;
  }

  return (
    <div className="flex items-center gap-4">

      {/* Toggle button */}
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

      {/* Clear local notification history button (for testing/dev) */}
      <button
        onClick={clearNotificationHistory}
        className="text-red-500 hover:text-red-700 transition-colors"
        title="Clear notification history (for testing)"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default NotificationToggle; 