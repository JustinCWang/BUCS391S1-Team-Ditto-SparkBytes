'use client'
import React from 'react';
import { Typography, Divider } from 'antd';

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
      
      {/* Paragraphs for each team member */}
      <Paragraph>
        <strong>Member 1:</strong> Temporary text for member 1.
      </Paragraph>
      <Paragraph>
        <strong>Member 2:</strong> Temporary text for member 2.
      </Paragraph>
      <Paragraph>
        <strong>Member 3:</strong> Temporary text for member 3.
      </Paragraph>
      <Paragraph>
        <strong>Member 4:</strong> Temporary text for member 4.
      </Paragraph>
    </div>
  );
};

export default About;