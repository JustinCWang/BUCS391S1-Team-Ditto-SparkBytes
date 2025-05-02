import { EventCardProps } from "@/types/supabase";
import { MapPin, UtensilsCrossed, Heart, Share2, Package, AlertTriangle, Bell } from "lucide-react"
import { useState, useEffect } from "react";
import EditEventForm from "./EditEventForm";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { AnimatePresence } from "motion/react";
import DetailedEventCard from "./detailedEventCard";
import { useTheme } from '@/context/ThemeContext';


import { isEventCurrentlyHappening } from '@/lib/utils';
import Share from './shareOption';

/**
 * Displays a compact card with summary of an event.
 * Supports:
 * - Liking/unliking the event
 * - Opening a detailed modal
 * - Editing (if the current user is the organizer)
 * - Sharing via modal
 */
function EventCard({
  // Event basic info
  event_id,
  name,
  date,
  start_time,
  end_time,
  location,
  building,
  description,
  // Food info
  food_id,
  food_name,
  allergens,
  quantity,
  // Like info with default values
  like_count = 0, // Default value is 0
  isLiked = false, // Default value is false
  onEventUpdated, // Callback to update parent component data
  organizer_id,
}: EventCardProps & {
  isLiked?: boolean;
  onEventUpdated?: () => void;
}) {
  // State to control whether the edit modal is open
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isDetailedViewOpen, setIsDetailedViewOpen] = useState(false);

  // Temp Link
  const eventLink = `https://bucs-391-s1-team-ditto-spark-bytes-lake.vercel.app/events?name=${encodeURIComponent(name)}`

  // Local states for like status and like count
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(like_count);

  // Retrieve current user from authentication context
  const { user } = useAuth();

  // Dark Mode
  const { theme } = useTheme();


  // Check if current user is the organizer of the event
  const isEventOrganizer = user?.id === organizer_id;

  // Handler for toggling the like status when the heart icon is clicked
  const handleToggleLike = async () => {
    if (!user) {
      // If user is not logged in, prompt or redirect to login
      console.log("Please log in to like an event.");
      return;
    }

    try {
      if (!liked) {
        // If currently not liked, insert a like record into the database
        const { } = await supabase
          .from("Event_Likes")
          .insert({ user_id: user.id, event_id });

        // Update local state: mark as liked and increment the like count
        setLiked(true);
        setLikeCount((prev) => prev + 1);
      } else {
        // If currently liked, remove the like record (delete the record)
        const { } = await supabase
          .from("Event_Likes")
          .delete()
          .match({ user_id: user.id, event_id });

        // Update local state: mark as not liked and decrement the like count
        setLiked(false);
        setLikeCount((prev) => prev - 1);
      }
    } catch (err) {
      console.error("Unexpected error toggling like:", err);
    }
  };

  // Prevents the user from scrolling
  useEffect(() => {
    if (isShareOpen) {
      // Disable scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scroll
      document.body.style.overflow = '';
    }
  
    // Clean up when modal unmounts
    return () => {
      document.body.style.overflow = '';
    };
  }, [isShareOpen]);

  return (
    <div
      className={`relative rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300`}
    >      

      {isEventCurrentlyHappening(date, start_time, end_time) && (
        <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 shadow-lg">
          <Bell className="w-4 h-4" />
        </div>
      )}
      
      <div 
        className={`border-2 rounded-lg px-4 py-2 shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300 
          ${
            theme === 'dark'
              ? 'bg-[#222224] text-white border-white'
              : 'bg-white text-text-primary border-text-primary'
          } border`}
        onClick={() => setIsDetailedViewOpen(true)}
      >
        {/* Container for the event details */}
        <div className="flex flex-col">
          {/* Header section with event name and time */}
          <div className={`${theme === 'dark' ? 'text-white' : 'text-text-primary'} mb-4`}>
            <h2 className="text-xl font-montserrat font-bold my-2 truncate">{name}</h2>
            <p className="font-inter text-sm">
              {date + " • " + start_time + " - " + end_time}
            </p>
          </div>
          {/* Section displaying location and food information with icons */}
          <div className={`${theme === 'dark' ? 'text-white' : 'text-text-primary'} font-inter`}>
          <div className="flex mb-2">
              <MapPin className="flex-shrink-0" />
              <p className="ml-1 truncate">{building} | {location}</p>
            </div>
            <div className="flex mb-2">
              <UtensilsCrossed className="flex-shrink-0" />
              <p className="ml-1 truncate">{food_name}</p>
            </div>
            <div className="flex mb-2">
              <Package className="flex-shrink-0" />
              <p className="ml-1 truncate">Quantity: {quantity}</p>
            </div>
            <div className="flex mb-2">
              <AlertTriangle className="flex-shrink-0" />
              <p className="ml-1 truncate">Allergens: {allergens}</p>
            </div>
          </div>
          {/* Section for like functionality and edit button */}
          <div className="flex justify-between items-center mt-4 mb-2">
            <div className="flex text-text-primary font-inter">
              <Heart
                onClick={async (e) => {
                  e.stopPropagation(); // Prevent event card click when clicking heart
                  await handleToggleLike();
                }}
                fill={liked ? "red" : "white"}
                color={liked ? "red" : "black"}
                className="cursor-pointer duration-300 ease-in hover:scale-105"
              />
              <p className="ml-1">{likeCount} Students Liked</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation(); // Prevent event card click when clicking share
                  setIsShareOpen(true);
                }}
                className="
                bg-transparent
                text-brand-primary 
                font-poppins font-black 
                py-1.5 px-2.5
                rounded-md border border-brand-primary
                duration-300 ease-in hover:bg-brand-primary hover:text-white 
                flex items-center justify-center"
              >
                <Share2 className="w-4 h-6" />
              </button>
              {isEventOrganizer && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent event card click when clicking edit
                    setIsEditOpen(true);
                  }}
                  className="
                  bg-transparent
                  text-brand-primary 
                  font-poppins font-black 
                  py-1.5 px-3 
                  rounded-md border border-brand-primary
                  duration-300 ease-in hover:bg-brand-primary hover:text-white 
                  flex items-center justify-center"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Share modal */}
      <AnimatePresence>
        {isShareOpen && (
           <Share
           eventLink={eventLink}
           onClose={() => setIsShareOpen(false)}
         />
        )}
      </AnimatePresence>

      {/* Edit event modal */}
      <EditEventForm
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        eventData={{
          event_id,
          name,
          date,
          start_time,
          end_time,
          location,
          building,
          description,
          food_id,
          food_name,
          allergens,
          quantity,
        }}
        onSuccess={() => {
          setIsEditOpen(false);
          // Refresh parent component data after successful edit
          onEventUpdated?.();
        }}
        onEventUpdated={onEventUpdated}
      />

      {/* Detailed view modal */}
      <DetailedEventCard
        isOpen={isDetailedViewOpen}
        onClose={() => setIsDetailedViewOpen(false)}
        event_id={event_id}
        name={name}
        date={date}
        start_time={start_time}
        end_time={end_time}
        location={location}
        building={building}
        description={description}
        food_id={food_id}
        food_name={food_name}
        allergens={allergens}
        like_count={likeCount}
        isLiked={liked}
        organizer_id={organizer_id}
        quantity={quantity}
        onEventUpdated={onEventUpdated}
      />
    </div>
  );
}

export default EventCard;

