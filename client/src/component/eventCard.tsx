import React from 'react';
import { Card } from 'antd';

interface EventCardProps {
  title: string;
  description: string;
  time: string;
  location: string;
  food: string;
}

const EventCard: React.FC<EventCardProps> = ({ title, description, time, location, food }) => {
  return (
    <Card title={title} hoverable>
      <p><strong>Description:</strong> {description}</p>
      <p><strong>Time:</strong> {time}</p>
      <p><strong>Location:</strong> {location}</p>
      <p><strong>Food:</strong> {food}</p>
    </Card>
  );
};

export default EventCard;