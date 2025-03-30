import { EventProps } from "@/types/supabase"
import { MapPin, UtensilsCrossed, Heart } from "lucide-react"

function EventCard ({
  name,
  date,
  start_time,
  end_time,
  location,
  description, // Add in additional pop up when event is clicked on
  food_type,
  building,
}:EventProps) {
  return(
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
            <p className="ml-1">Pizza</p>
          </div>
          <p>Food Type: {food_type}</p>
        </div>
        {/** Like and learn more */}
        <div className="flex justify-between items-center mt-4 mb-2">
          <div className="flex text-text-primary font-inter">
            <Heart />
            <p className="ml-1">300 Students Liked</p>
          </div>
          <button className="bg-white 
        text-brand-primary 
          font-poppins font-black 
          py-1.5 px-5 
          rounded-md border border-brand-primary
          duration-300 ease-in hover:bg-brand-primary hover:text-white 
          flex items-center justify-center">
            Edit
          </button>
        </div>
      </div>
    </div>
  )
}

export default EventCard