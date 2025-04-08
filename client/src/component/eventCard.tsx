import { EventCardProps } from "@/types/supabase";
import { MapPin, UtensilsCrossed, Heart } from "lucide-react";
import { useState } from "react";
import EditEventForm from "./EditEventForm";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

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

  return (
    <>
      <div className="border-2 border-text-primary rounded-lg px-4 py-2 shadow-lg">
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
                onClick={async () => {
                  await handleToggleLike();
                  // Refresh parent component data after toggling like
                  onEventUpdated?.();
                }}
                color={liked ? "red" : "black"}
                className="cursor-pointer"
              />
              <p className="ml-1">{likeCount} Students Liked</p>
            </div>
            <button
              onClick={() => setIsEditOpen(true)}
              className="bg-white 
                text-brand-primary 
                font-poppins font-black 
                py-1.5 px-5 
                rounded-md border border-brand-primary
                duration-300 ease-in hover:bg-brand-primary hover:text-white 
                flex items-center justify-center"
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* Edit event modal form */}
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
    </>
  );
}

export default EventCard;
