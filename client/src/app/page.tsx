'use client'
import { Typography, Row, Col, Divider } from "antd";
import EventCard from '../component/eventCard';

const Home: React.FC = () => (
  <div style={{ textAlign: 'center', marginTop: '20px' }}>
    <Typography.Title level={1} style={{ fontWeight: 'bold' }}>Spark!Bytes</Typography.Title>
    {/* Add your image or other content here */}

    <Typography.Paragraph>
      This is text
    </Typography.Paragraph>

    <Row gutter={[16, 16]} justify="center">
      <Col xs={24} sm={12} md={8}>
        <EventCard 
          title="Event 1" 
          description="Description for Event 1" 
          time="10:00 AM" 
          location="Location 1" 
          food="Food 1" 
        />
      </Col>
      <Col xs={24} sm={12} md={8}>
        <EventCard 
          title="Event 2" 
          description="Description for Event 2" 
          time="11:00 AM" 
          location="Location 2" 
          food="Food 2" 
        />
      </Col>
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
    <Divider />
    <Typography.Title level={1} style={{ fontWeight: 'bold' }}>Free Food Near You!</Typography.Title>
  </div>
);

export default Home;