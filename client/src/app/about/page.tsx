'use client'
import React from 'react';
import { Typography, Divider, Row, Col } from 'antd';
import AboutMe from '../../component/aboutMe';

// Destructure Title and Paragraph components from Typography
const { Title, Paragraph } = Typography;

// Define the About component
const About = () => {
  return (
    // Main container div with padding
    <div className="site-layout-content" style={{ padding: '24px 0' }}>
      {/* Title for the About section */}
      <Title level={2} className="text-2xl font-bold">About Spark!Bytes</Title>
      
      {/* Paragraph describing the Spark Bytes application */}
      <Paragraph>
        Spark Bytes is a web application for Boston University (BU) to post events that
        provide foods or snacks. The aim is to reduce food waste resulting from
        over-purchasing for events and at the same time, help BU constituencies access
        free food. Teams of 4-5 CS391 S1 students will develop a working web application
        system that enables Spark!Bytes. That is Students or faculty at BU can use the app to see what places on campus have free food left over from events and they can then go and get free food. Thus, reducing food waste on campus and helping out both students and faculty get a free meal.
      </Paragraph>
      
      {/* Divider line */}
      <Divider />

      {/* Title for the Meet the Team section */}
      <Title level={2} className="text-2xl font-bold">Meet the Team</Title>
      
      {/* Row container with gutter spacing and centered content */}
      <Row gutter={[16, 16]} justify="center">
        {/* Column for each team member */}
        <Col xs={24} sm={12} md={8}>
          <AboutMe 
            name="Member 1" 
            bio="This is the bio of Member 1." 
            imageUrl="https://via.placeholder.com/100" 
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <AboutMe 
            name="Member 2" 
            bio="This is the bio of Member 2." 
            imageUrl="https://via.placeholder.com/100" 
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <AboutMe 
            name="Member 3" 
            bio="This is the bio of Member 3." 
            imageUrl="https://via.placeholder.com/100" 
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <AboutMe 
            name="Member 4" 
            bio="This is the bio of Member 4." 
            imageUrl="https://via.placeholder.com/100" 
          />
        </Col>
      </Row>
    </div>
  );
};

export default About;