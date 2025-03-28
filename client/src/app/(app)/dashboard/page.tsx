'use client'
import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Divider, Modal } from 'antd';
import EventCard from '../../../component/eventCard';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase }  from '@/lib/supabase';

const Dashboard: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false); // State to manage modal visibility
  interface Event {
    title: string;
    description: string;
    time: string;
    location: string;
    food: string;
  }

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null); // State to store selected event details

  const router = useRouter();
  const { user} = useAuth();

  useEffect(() => {
    console.log(user);
      if (!user) {
        router.push('/');
      }
  }, [router, user]);

  // Function to handle card click and show modal
  const showModal = (event: Event) => {
    setSelectedEvent(event);
    setIsModalVisible(true);
  };

  // Function to handle modal close
  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Test Supabase connection
  console.log(supabase)

  return (
    // Main container div with centered text and margin at the top
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      {/* Main title with bold font */}
      <Typography.Title level={1} style={{ fontWeight: 'bold' }}>Spark!Bytes</Typography.Title>
      {/* Add your image or other content here */}

      {/* Paragraph with some text */}
      <Typography.Paragraph>
        This is text
      </Typography.Paragraph>

      {/* Row container with gutter spacing and centered content */}
      <Row gutter={[16, 16]} justify="center">
        {/* Column for the first event card */}
        <Col xs={24} sm={12} md={8}>
          <EventCard 
            title="Event 1" 
            description="Description for Event 1" 
            time="10:00 AM" 
            location="Location 1" 
            food="Food 1" 
            onClick={() => showModal({ title: "Event 1", description: "Description for Event 1", time: "10:00 AM", location: "Location 1", food: "Food 1" })}
          />
        </Col>
        {/* Column for the second event card */}
        <Col xs={24} sm={12} md={8}>
          <EventCard 
            title="Event 2" 
            description="Description for Event 2" 
            time="11:00 AM" 
            location="Location 2" 
            food="Food 2" 
            onClick={() => showModal({ title: "Event 2", description: "Description for Event 2", time: "11:00 AM", location: "Location 2", food: "Food 2" })}
          />
        </Col>
        {/* Column for the third event card */}
        <Col xs={24} sm={12} md={8}>
          <EventCard 
            title="Event 3" 
            description="Description for Event 3" 
            time="12:00 PM" 
            location="Location 3" 
            food="Food 3" 
            onClick={() => showModal({ title: "Event 3", description: "Description for Event 3", time: "12:00 PM", location: "Location 3", food: "Food 3" })}
          />
        </Col>
      </Row>
      {/* Divider line */}
      <Divider />
      {/* Secondary title with bold font */}
      <Typography.Title level={1} style={{ fontWeight: 'bold' }}>Free Food Near You!</Typography.Title>

      {/* Modal to display detailed event information */}
      <Modal title={selectedEvent?.title} open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <p><strong>Description:</strong> {selectedEvent?.description}</p>
        <p><strong>Time:</strong> {selectedEvent?.time}</p>
        <p><strong>Location:</strong> {selectedEvent?.location}</p>
        <p><strong>Food:</strong> {selectedEvent?.food}</p>
      </Modal>
    </div>
  );
};

export default Dashboard;