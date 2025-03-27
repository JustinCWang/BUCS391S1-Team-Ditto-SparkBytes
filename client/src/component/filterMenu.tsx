import React from 'react';
import { Menu, Checkbox } from 'antd';

// Define the FilterMenu component
const FilterMenu: React.FC = () => {
  const menuItems = [
    {
      key: 'location',
      label: 'Location/Proximity',
      children: [
        { key: 'nearby', label: <Checkbox>Nearby</Checkbox> },
        { key: 'campus', label: <Checkbox>Campus Area</Checkbox> },
        { key: 'neighborhood', label: <Checkbox>Neighborhood</Checkbox> },
      ],
    },
    {
      key: 'date',
      label: 'Date & Time',
      children: [
        { key: 'upcoming', label: <Checkbox>Upcoming</Checkbox> },
        { key: 'soon', label: <Checkbox>Happening Soon</Checkbox> },
        { key: 'week', label: <Checkbox>Within a Week</Checkbox> },
      ],
    },
    {
      key: 'eventType',
      label: 'Event Type',
      children: [
        { key: 'club', label: <Checkbox>Club Meetings</Checkbox> },
        { key: 'sports', label: <Checkbox>Sports Events</Checkbox> },
        { key: 'conferences', label: <Checkbox>Conferences</Checkbox> },
        { key: 'parties', label: <Checkbox>Parties</Checkbox> },
      ],
    },
    {
      key: 'cuisine',
      label: 'Cuisine/Food Category',
      children: [
        { key: 'italian', label: <Checkbox>Italian</Checkbox> },
        { key: 'mexican', label: <Checkbox>Mexican</Checkbox> },
        { key: 'asian', label: <Checkbox>Asian</Checkbox> },
        { key: 'fastFood', label: <Checkbox>Fast Food</Checkbox> },
        { key: 'desserts', label: <Checkbox>Desserts</Checkbox> },
      ],
    },
    {
      key: 'dietary',
      label: 'Dietary Preferences/Restrictions',
      children: [
        { key: 'vegetarian', label: <Checkbox>Vegetarian</Checkbox> },
        { key: 'vegan', label: <Checkbox>Vegan</Checkbox> },
        { key: 'glutenFree', label: <Checkbox>Gluten-Free</Checkbox> },
        { key: 'halal', label: <Checkbox>Halal</Checkbox> },
        { key: 'kosher', label: <Checkbox>Kosher</Checkbox> },
      ],
    },
    {
      key: 'quantity',
      label: 'Estimated Leftover Quantity',
      children: [
        { key: 'high', label: <Checkbox>High</Checkbox> },
        { key: 'medium', label: <Checkbox>Medium</Checkbox> },
        { key: 'low', label: <Checkbox>Low</Checkbox> },
      ],
    },
    {
      key: 'condition',
      label: 'Food Condition',
      children: [
        { key: 'hot', label: <Checkbox>Hot</Checkbox> },
        { key: 'cold', label: <Checkbox>Cold</Checkbox> },
      ],
    },
    {
      key: 'organizer',
      label: 'Organizer or Campus Group',
      children: [
        { key: 'group1', label: <Checkbox>Group 1</Checkbox> },
        { key: 'group2', label: <Checkbox>Group 2</Checkbox> },
        { key: 'group3', label: <Checkbox>Group 3</Checkbox> },
      ],
    },
    {
      key: 'ratings',
      label: 'User Ratings/Reviews',
      children: [
        { key: 'highRating', label: <Checkbox>High Rating</Checkbox> },
        { key: 'mediumRating', label: <Checkbox>Medium Rating</Checkbox> },
        { key: 'lowRating', label: <Checkbox>Low Rating</Checkbox> },
      ],
    },
  ];

  return <Menu items={menuItems} />;
};

export default FilterMenu;