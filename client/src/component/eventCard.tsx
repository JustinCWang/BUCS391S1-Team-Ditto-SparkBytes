import { EventCardProps } from "@/types/supabase"
import { MapPin, UtensilsCrossed, Heart } from "lucide-react"
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