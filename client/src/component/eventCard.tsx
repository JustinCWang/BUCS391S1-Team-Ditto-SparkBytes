import { EventCardProps } from "@/types/supabase"
import { MapPin, UtensilsCrossed, Heart, Share2 } from "lucide-react"
import { useState } from "react"
import EditEventForm from "./EditEventForm"

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
  // Like info
  like_count = 0, // Default value if not provided
  onEventUpdated,
}: EventCardProps & { onEventUpdated?: () => void }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const eventLink = `http://localhost:3000/events/${event_id}`

  const shareEmail = () => {
    const subject = encodeURIComponent("Check out this event!");
    const body = encodeURIComponent(`Hungry? Thought you’d like this event: ${eventLink}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const shareSMS = () => {
    const message = encodeURIComponent(`Looking for something to eat? Check out this event: ${eventLink}`);
    window.location.href = `sms:?&body=${message}`;
  };

  return(
    <>
      <div className="border-2 border-text-primary rounded-lg px-4 py-2 shadow-lg">
        {/** Container for the actual image and text */}
        <div className="flex flex-col">
          {/** Container for the heading */}
          <div className="text-text-primary mb-4">
            <h2 className="text-xl font-montserrat font-bold my-2">{name}</h2>
            <p className="font-inter text-sm">{date + " • " +  start_time + " - " + end_time}</p>
          </div>
          {/** Container for the text with icons */}
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
          {/** Like and learn more */}
          <div className="flex justify-between items-center mt-4 mb-2">
            <div className="flex text-text-primary font-inter">
              <Heart />
              <p className="ml-1">{like_count} Students Liked</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsShareOpen(true)}
                className="text-brand-primary border border-brand-primary px-3 py-1.5 rounded-md hover:bg-brand-primary hover:text-white transition"
              >
                <Share2 className="w-4 h-4" />
              </button>
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
    </div>

      {/* Share Modal */}
      {isShareOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-72 space-y-4 text-center">
              <h2 className="text-lg font-semibold text-text-primary">Share this Event</h2>
              <button onClick={shareEmail} className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">Share via Email</button>
              <button onClick={shareSMS} className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">Share via SMS</button>
              <button onClick={() => setIsShareOpen(false)} className="text-gray-500 hover:underline">Cancel</button>
            </div>
          </div>
        )}

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
      />
    </>
  )
}

export default EventCard