'use client'
import { Typography, Row, Col, Divider } from "antd";
import EventCard from '../component/eventCard';

const Home: React.FC = () => (
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
        />
      </Col>
    </Row>
    {/* Divider line */}
    <Divider />
    {/* Secondary title with bold font */}
    <Typography.Title level={1} style={{ fontWeight: 'bold' }}>Free Food Near You!</Typography.Title>
  </div>
);

export default Home;