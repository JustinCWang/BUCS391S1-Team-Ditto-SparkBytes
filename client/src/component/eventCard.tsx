import React from 'react';
import { Card } from 'antd';

// Define an interface to specify the types of props that the EventCard component will accept
interface EventCardProps {
    title: string;        // The title of the event
    description: string;  // A brief description of the event
    time: string;         // The time when the event will take place
    location: string;     // The location where the event will be held
    food: string;         // Information about the food available at the event
  }
  
  // Define a functional React component named EventCard that accepts props of type EventCardProps
  const EventCard: React.FC<EventCardProps> = ({ title, description, time, location, food }) => {
    return (
      // Render a Card component with a title and hoverable effect
      <Card title={title} hoverable>
        {/* Render a paragraph displaying the event description */}
        <p><strong>Description:</strong> {description}</p>
        {/* Render a paragraph displaying the event time */}
        <p><strong>Time:</strong> {time}</p>
        {/* Render a paragraph displaying the event location */}
        <p><strong>Location:</strong> {location}</p>
        {/* Render a paragraph displaying information about the food */}
        <p><strong>Food:</strong> {food}</p>
      </Card>
    );
  };

export default EventCard;