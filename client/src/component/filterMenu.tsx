import React from 'react';
import { Menu, Checkbox } from 'antd';

// Define the FilterMenu component
const FilterMenu: React.FC = () => {
  return (
    <Menu>
      <Menu.ItemGroup title="Location/Proximity">
        <Menu.Item>
          <Checkbox>Nearby</Checkbox>
        </Menu.Item>
        <Menu.Item>
          <Checkbox>Campus Area</Checkbox>
        </Menu.Item>
        <Menu.Item>
          <Checkbox>Neighborhood</Checkbox>
        </Menu.Item>
      </Menu.ItemGroup>
      <Menu.Divider />
      <Menu.ItemGroup title="Date & Time">
        <Menu.Item>
          <Checkbox>Upcoming</Checkbox>
        </Menu.Item>
        <Menu.Item>
          <Checkbox>Happening Soon</Checkbox>
        </Menu.Item>
        <Menu.Item>
          <Checkbox>Within a Week</Checkbox>
        </Menu.Item>
      </Menu.ItemGroup>
      <Menu.Divider />
      <Menu.ItemGroup title="Event Type">
        <Menu.Item>
          <Checkbox>Club Meetings</Checkbox>
        </Menu.Item>
        <Menu.Item>
          <Checkbox>Sports Events</Checkbox>
        </Menu.Item>
        <Menu.Item>
          <Checkbox>Conferences</Checkbox>
        </Menu.Item>
        <Menu.Item>
          <Checkbox>Parties</Checkbox>
        </Menu.Item>
      </Menu.ItemGroup>
      <Menu.Divider />
      <Menu.ItemGroup title="Cuisine/Food Category">
        <Menu.Item>
          <Checkbox>Italian</Checkbox>
        </Menu.Item>
        <Menu.Item>
          <Checkbox>Mexican</Checkbox>
        </Menu.Item>
        <Menu.Item>
          <Checkbox>Asian</Checkbox>
        </Menu.Item>
        <Menu.Item>
          <Checkbox>Fast Food</Checkbox>
        </Menu.Item>
        <Menu.Item>
          <Checkbox>Desserts</Checkbox>
        </Menu.Item>
      </Menu.ItemGroup>
      <Menu.Divider />
      <Menu.ItemGroup title="Dietary Preferences/Restrictions">
        <Menu.Item>
          <Checkbox>Vegetarian</Checkbox>
        </Menu.Item>
        <Menu.Item>
          <Checkbox>Vegan</Checkbox>
        </Menu.Item>
        <Menu.Item>
          <Checkbox>Gluten-Free</Checkbox>
        </Menu.Item>
        <Menu.Item>
          <Checkbox>Halal</Checkbox>
        </Menu.Item>
        <Menu.Item>
          <Checkbox>Kosher</Checkbox>
        </Menu.Item>
      </Menu.ItemGroup>
      <Menu.Divider />
      <Menu.ItemGroup title="Estimated Leftover Quantity">
        <Menu.Item>
          <Checkbox>High</Checkbox>
        </Menu.Item>
        <Menu.Item>
          <Checkbox>Medium</Checkbox>
        </Menu.Item>
        <Menu.Item>
          <Checkbox>Low</Checkbox>
        </Menu.Item>
      </Menu.ItemGroup>
      <Menu.Divider />
      <Menu.ItemGroup title="Food Condition">
        <Menu.Item>
          <Checkbox>Hot</Checkbox>
        </Menu.Item>
        <Menu.Item>
          <Checkbox>Cold</Checkbox>
        </Menu.Item>
      </Menu.ItemGroup>
      <Menu.Divider />
      <Menu.ItemGroup title="Organizer or Campus Group">
        <Menu.Item>
          <Checkbox>Group 1</Checkbox>
        </Menu.Item>
        <Menu.Item>
          <Checkbox>Group 2</Checkbox>
        </Menu.Item>
        <Menu.Item>
          <Checkbox>Group 3</Checkbox>
        </Menu.Item>
      </Menu.ItemGroup>
      <Menu.Divider />
      <Menu.ItemGroup title="User Ratings/Reviews">
        <Menu.Item>
          <Checkbox>High Rating</Checkbox>
        </Menu.Item>
        <Menu.Item>
          <Checkbox>Medium Rating</Checkbox>
        </Menu.Item>
        <Menu.Item>
          <Checkbox>Low Rating</Checkbox>
        </Menu.Item>
      </Menu.ItemGroup>
    </Menu>
  );
};

export default FilterMenu;