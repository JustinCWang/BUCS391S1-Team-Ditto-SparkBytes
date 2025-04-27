'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { usePathname } from 'next/navigation';
import { getCurrentDateInBostonTZ } from '@/lib/utils';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: Date;
  eventId?: string;
}

interface NotificationContextType {
  currentNotification: Notification | null;
  addNotification: (message: string, type: Notification['type'], eventId?: string) => void;
  removeNotification: (id: string) => void;
  clearShownEvents: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
  const [notificationQueue, setNotificationQueue] = useState<Notification[]>([]);
  const [shownEventIds, setShownEventIds] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('shownEventIds');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    }
    return new Set();
  });
  const { user, userSession } = useAuth();
  const pathname = usePathname();

  // Update localStorage whenever shownEventIds changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('shownEventIds', JSON.stringify([...shownEventIds]));
    }
  }, [shownEventIds]);

  const addNotification = useCallback(async (message: string, type: Notification['type'], eventId?: string) => {
    if (!userSession || pathname === '/') {
      console.log('[Notification] Skipping notification - user not logged in or on landing page');
      return;
    }

    // Check user's notification preference
    try {
      const { data, error } = await supabase
        .from('Users')
        .select('notifications')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        console.error('Error checking notification preference:', error);
        return;
      }

      if (!data?.notifications) {
        console.log('[Notification] Skipping notification - notifications disabled by user');
        return;
      }
    } catch (error) {
      console.error('Error checking notification preference:', error);
      return;
    }

    // If this is an event notification and we've already shown it, skip
    if (eventId && shownEventIds.has(eventId)) {
      console.log(`[Notification] Skipping notification - already shown for event ${eventId}`);
      return;
    }

    console.log(`[Notification] Adding notification to queue: ${message}`);
    const newNotification: Notification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date(),
      eventId,
    };

    // If this is an event notification, mark it as shown
    if (eventId) {
      setShownEventIds(prev => new Set(prev).add(eventId));
    }

    // Add to queue
    setNotificationQueue(prev => [...prev, newNotification]);
  }, [userSession, pathname, shownEventIds, user?.id]);

  const removeNotification = useCallback((id: string) => {
    console.log(`[Notification] Removing notification with ID: ${id}`);
    
    // If the removed notification is the current one, show the next one from the queue
    if (currentNotification?.id === id) {
      setCurrentNotification(null);
      // Show next notification from queue after a short delay
      setTimeout(() => {
        setNotificationQueue(prev => {
          const nextNotification = prev[0];
          if (nextNotification) {
            setCurrentNotification(nextNotification);
            return prev.slice(1);
          }
          return prev;
        });
      }, 300); // Small delay for smooth transition
    }
  }, [currentNotification]);

  // Show next notification from queue when current notification is null
  useEffect(() => {
    if (!currentNotification && notificationQueue.length > 0) {
      const nextNotification = notificationQueue[0];
      setCurrentNotification(nextNotification);
      setNotificationQueue(prev => prev.slice(1));
    }
  }, [currentNotification, notificationQueue]);

  // Check for events in current hour
  useEffect(() => {
    // Don't check for events if user is not logged in or on landing page
    if (!user || !userSession || pathname === '/') {
      console.log('[Notification] Skipping event check - user not logged in or on landing page');
      return;
    }

    const checkEventsInCurrentHour = async () => {
      try {
        const now = new Date();
        console.log(`[Notification] Checking events at ${now.toLocaleTimeString()}`);
        
        // Get user's liked events
        const { data: likedEvents, error: likedError } = await supabase
          .from('Event_Likes')
          .select('event_id')
          .eq('user_id', user.id);

        if (likedError) throw likedError;

        if (!likedEvents?.length) {
          console.log('[Notification] No liked events found');
          return;
        }

        console.log(`[Notification] Found ${likedEvents.length} liked events`);

        // Get event details for liked events
        const eventIds = likedEvents.map(like => like.event_id);
        const { data: events, error: eventsError } = await supabase
          .from('Events')
          .select('*, Food(*)')
          .in('event_id', eventIds);

        if (eventsError) throw eventsError;

        // Check each event's start time
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        // Get today's date in YYYY-MM-DD format using Boston time zone
        const currentDate = getCurrentDateInBostonTZ();

        console.log(`[Notification] Current time: ${currentHour}:${currentMinute}, Date: ${currentDate}`);

        events?.forEach(event => {
          const [eventHour, eventMinute] = event.start_time.split(':').map(Number);
          const [endHour, endMinute] = event.end_time.split(':').map(Number);
          // The event.date should already be in YYYY-MM-DD format from the database
          const eventDate = event.date;
          
          console.log(`[Notification] Checking event: ${event.name}`);
          console.log(`[Notification] Event time: ${eventHour}:${eventMinute} - ${endHour}:${endMinute}, Date: ${eventDate}`);
          
          // Check if event is today
          if (eventDate === currentDate) {
            // Convert current time to minutes since midnight for easier comparison
            const currentTimeInMinutes = currentHour * 60 + currentMinute;
            const eventStartInMinutes = eventHour * 60 + eventMinute;
            const eventEndInMinutes = endHour * 60 + endMinute;

            // Check if current time is within event duration
            const isDuringEvent = currentTimeInMinutes >= eventStartInMinutes && 
                                currentTimeInMinutes <= (eventEndInMinutes - 5); // Stop 5 minutes before end
            
            if (isDuringEvent) {
              console.log(`[Notification] Event match found: ${event.name}`);
              
              // Format the time nicely
              const formattedStartTime = new Date(`2000-01-01T${event.start_time}`).toLocaleTimeString([], { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
              });

              const formattedEndTime = new Date(`2000-01-01T${event.end_time}`).toLocaleTimeString([], { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
              });

              // Create a sophisticated notification message
              const notificationMessage = `🎉 ${event.name} is happening right now! 🎉\n` +
                `🏢 Building: ${event.building}\n` +
                `🕒 Time: ${formattedStartTime} - ${formattedEndTime}\n` +
                `🍽️ Food: ${event.Food?.name || 'Various options available'}`;

              addNotification(
                notificationMessage,
                'info',
                event.event_id // Pass the event ID to track shown notifications
              );
            } else {
              console.log(`[Notification] No match for event: ${event.name} (Current time: ${currentTimeInMinutes}, Event time: ${eventStartInMinutes}-${eventEndInMinutes})`);
            }
          } else {
            console.log(`[Notification] Event date doesn't match: ${event.name}`);
          }
        });
      } catch (error) {
        console.error('[Notification] Error checking events:', error);
      }
    };

    // Check every minute
    checkEventsInCurrentHour();
    const interval = setInterval(checkEventsInCurrentHour, 60 * 1000);

    return () => clearInterval(interval);
  }, [user, userSession, addNotification, pathname]);

  const clearShownEvents = useCallback(() => {
    setShownEventIds(new Set());
  }, []);

  return (
    <NotificationContext.Provider value={{ currentNotification, addNotification, removeNotification, clearShownEvents }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};