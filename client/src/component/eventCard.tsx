import { EventCardProps } from "@/types/supabase";
import { MapPin, UtensilsCrossed, Heart, Share2 } from "lucide-react"
import { useState, useEffect } from "react";
import EditEventForm from "./EditEventForm";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "motion/react";
import DetailedEventCard from "./detailedEventCard";
import Share from './shareOption';


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
  // Like info with default values
  like_count = 0, // Default value is 0
  isLiked = false, // Default value is false
  onEventUpdated, // Callback to update parent component data
}: EventCardProps & {
  isLiked?: boolean;
  onEventUpdated?: () => void;
}) {
  // State to control whether the edit modal is open
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isDetailedViewOpen, setIsDetailedViewOpen] = useState(false);

  // Temp Link
  const eventLink = `http://localhost:3000/events/${event_id}`

  const shareEmail = () => {
    const subject = encodeURIComponent("Check out this event!");
    const body = encodeURIComponent(`Hungry? Thought you'd like this event: ${eventLink}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const shareSMS = () => {
    const message = encodeURIComponent(`Looking for something to eat? Check out this event: ${eventLink}`);
    window.location.href = `sms:?&body=${message}`;
  };

  // Local states for like status and like count
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(like_count);

  // Retrieve current user from authentication context
  const { user } = useAuth();

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
    <>
      <div 
        className="border-2 border-text-primary rounded-lg px-4 py-2 shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
        onClick={() => setIsDetailedViewOpen(true)}
      >
        {/* Container for the event details */}
        <div className="flex flex-col">
          {/* Header section with event name and time */}
          <div className="text-text-primary mb-4">
            <h2 className="text-xl font-montserrat font-bold my-2">{name}</h2>
            <p className="font-inter text-sm">
              {date + " • " + start_time + " - " + end_time}
            </p>
          </div>
          {/* Section displaying location and food information with icons */}
          <div className="text-text-primary font-inter">
            <div className="flex mb-2">
              <MapPin />
              <p className="ml-1">{building} | {location}</p>
            </div>
            <div className="flex mb-2">
              <UtensilsCrossed />
              <p className="ml-1">{food_name}</p>
            </div>
            <p>Allergens: {allergens}</p>
          </div>
          {/* Section for like functionality and edit button */}
          <div className="flex justify-between items-center mt-4 mb-2">
            <div className="flex text-text-primary font-inter">
              <Heart
                onClick={async (e) => {
                  e.stopPropagation(); // Prevent event card click when clicking heart
                  await handleToggleLike();
                  // Refresh parent component data after toggling like
                  onEventUpdated?.();
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
                className="bg-white 
                dark:bg-transparent
                text-brand-primary 
                font-poppins font-black 
                py-1.5 px-2.5
                rounded-md border border-brand-primary
                duration-300 ease-in hover:bg-brand-primary hover:text-white 
                flex items-center justify-center"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent event card click when clicking edit
                  setIsEditOpen(true);
                }}
                className="bg-white 
                dark:bg-transparent
                text-brand-primary 
                font-poppins font-black 
                py-1.5 px-3 
                rounded-md border border-brand-primary
                duration-300 ease-in hover:bg-brand-primary hover:text-white 
                flex items-center justify-center"
              >
                Edit
              </button>
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
        }}
        onSuccess={() => {
          setIsEditOpen(false);
          // Refresh parent component data after successful edit
          onEventUpdated?.();
        }}
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
        onEventUpdated={onEventUpdated}
      />
    </>
  );
}

export default EventCard;

