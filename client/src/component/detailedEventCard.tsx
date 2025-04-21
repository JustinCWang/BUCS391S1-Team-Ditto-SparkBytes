import { EventCardProps } from "@/types/supabase";
import { MapPin, UtensilsCrossed, Heart, Share2, X, Package, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react";
import EditEventForm from "./EditEventForm";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "motion/react";

interface DetailedEventCardProps extends EventCardProps {
  isOpen: boolean;
  onClose: () => void;
  onEventUpdated?: () => void;
}

function DetailedEventCard({
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
  like_count = 0,
  isLiked = false,
  onEventUpdated,
  // Modal props
  isOpen,
  onClose,
  organizer_id,
}: DetailedEventCardProps) {
  // State to control whether the edit modal is open
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Temp Link
  const eventLink = `http://localhost:3000/events/${event_id}`;

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

  // Check if current user is the organizer of the event
  const isEventOrganizer = user?.id === organizer_id;

  // Handler for toggling the like status when the heart icon is clicked
  const handleToggleLike = async () => {
    if (!user) {
      console.log("Please log in to like an event.");
      return;
    }

    try {
      if (!liked) {
        const { } = await supabase
          .from("Event_Likes")
          .insert({ user_id: user.id, event_id });

        setLiked(true);
        setLikeCount((prev) => prev + 1);
      } else {
        const { } = await supabase
          .from("Event_Likes")
          .delete()
          .match({ user_id: user.id, event_id });

        setLiked(false);
        setLikeCount((prev) => prev - 1);
      }
    } catch (err) {
      console.error("Unexpected error toggling like:", err);
    }
  };

  // Handle modal close
  const handleClose = () => {
    onClose();
  };

  // Prevents the user from scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{
              type: "spring",
              bounce: 0,
              duration: 0.4,
            }}
            className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto p-6 relative"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-text-primary hover:text-brand-primary"
            >
              <X size={24} />
            </button>

            {/* Event details */}
            <div className="space-y-6">
              {/* Header section */}
              <div>
                <h2 className="text-2xl font-montserrat font-bold text-text-primary">{name}</h2>
                <p className="font-inter text-text-primary mt-2">
                  {date} • {start_time} - {end_time}
                </p>
              </div>

              {/* Location and food section */}
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="mt-1 mr-2 text-text-primary" />
                  <div>
                    <p className="font-inter text-text-primary font-bold">Location</p>
                    <p className="font-inter text-text-primary">{building} | {location}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <UtensilsCrossed className="mt-1 mr-2 text-text-primary" />
                  <div>
                    <p className="font-inter text-text-primary font-bold">Food Available</p>
                    <p className="font-inter text-text-primary">{food_name}</p>
                    <div className="flex items-center mt-1">
                      <Package className="mr-2 text-text-primary" />
                      <p className="font-inter text-text-primary">Quantity: {quantity || 1}</p>
                    </div>
                    <div className="flex items-center mt-1">
                      <AlertTriangle className="mr-2 text-text-primary" />
                      <p className="font-inter text-text-primary">Allergens: {allergens}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description section */}
              <div>
                <h3 className="font-montserrat font-bold text-text-primary text-lg mb-2">Description</h3>
                <p className="font-inter text-text-primary whitespace-pre-wrap">{description}</p>
              </div>

              {/* Action buttons */}
              <div className="flex justify-between items-center pt-4">
                <div className="flex items-center text-text-primary font-inter">
                  <Heart
                    onClick={async () => {
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
                    onClick={() => setIsShareOpen(true)}
                    className="bg-white 
                      text-brand-primary 
                      font-poppins font-black 
                      py-1.5 px-2.5
                      rounded-md border border-brand-primary
                      duration-300 ease-in hover:bg-brand-primary hover:text-white 
                      flex items-center justify-center"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  {isEventOrganizer && (
                    <button
                      onClick={() => setIsEditOpen(true)}
                      className="bg-white 
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

            {/* Share modal */}
            <AnimatePresence>
              {isShareOpen && (
                <motion.div
                  key="share-modal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                >
                  <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 40, opacity: 0 }}
                    transition={{
                      type: "spring",
                      bounce: 0,
                      duration: 0.4,
                    }}
                    className="bg-white p-6 rounded-xl shadow-xl w-72 space-y-4 text-center"
                  >
                    <h2 className="text-xl font-montserrat font-bold text-text-primary">Share this Event</h2>
                    <button onClick={shareEmail} className="w-full font-poppins font-black bg-blue-500 text-white py-2 rounded-md duration-300 ease-in hover:bg-blue-600">
                      Share via Email
                    </button>
                    <button onClick={shareSMS} className="w-full font-poppins font-black bg-green-500 text-white py-2 rounded-md duration-300 ease-in hover:bg-green-600">
                      Share via SMS
                    </button>
                    <button onClick={() => setIsShareOpen(false)} className="text-gray-500 font-poppins font-black hover:underline">
                      Cancel
                    </button>
                  </motion.div>
                </motion.div>
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
                onEventUpdated?.();
              }}
              onEventUpdated={onEventUpdated}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default DetailedEventCard; 