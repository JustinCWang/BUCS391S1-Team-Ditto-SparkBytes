import React from 'react';
import { Card, Avatar, Typography } from 'antd';

const { Text, Paragraph } = Typography;

// Define an interface to specify the types of props that the AboutMe component will accept
interface AboutMeProps {
  name: string;        // The name of the group member
  bio: string;         // The bio of the group member
  imageUrl: string;    // The URL of the group member's image
}

// Define a functional React component named AboutMe that accepts props of type AboutMeProps
const AboutMe: React.FC<AboutMeProps> = ({ name, bio, imageUrl }) => {
  return (
    <Card style={{ width: 300, textAlign: 'center', margin: '20px auto' }}>
      {/* Avatar component to display the group member's image */}
      <Avatar src={imageUrl} size={100} style={{ marginBottom: '20px' }} />
      {/* Text component to display the group member's name */}
      <Text strong>{name}</Text>
      {/* Paragraph component to display the group member's bio */}
      <Paragraph>{bio}</Paragraph>
    </Card>
  );
};

export default AboutMe;