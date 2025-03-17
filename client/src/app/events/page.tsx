'use client'
import React from 'react';
import { Input, Select, Row, Col } from 'antd';

const { Search } = Input;
const { Option } = Select;

const Events = () => {
  return (
    // Main container for the Events page content with padding
    <div className="site-layout-content" style={{ padding: '24px 0' }}>
      {/* Page title */}
      <h1 className="text-2xl font-bold">Events</h1>
      {/* Description paragraph */}
      <p>Welcome to the Events page of Spark!Bytes. Here you can find more information about food events.</p>
      
      {/* Row container with gutter spacing for search and filter components */}
      <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
        {/* Column for the search input, spans 24 columns on extra small screens and 16 on small screens */}
        <Col xs={24} sm={16}>
          {/* Search input with placeholder text and enter button */}
          <Search placeholder="Search events" enterButton />
        </Col>
        {/* Column for the select dropdown, spans 24 columns on extra small screens and 8 on small screens */}
        <Col xs={24} sm={8}>
          {/* Select dropdown with default value "All" and full width */}
          <Select defaultValue="All" style={{ width: '100%' }}>
            {/* Option for "All" events */}
            <Option value="all">All</Option>
            {/* Option for events happening "Today" */}
            <Option value="today">Today</Option>
            {/* Option for events happening "This Week" */}
            <Option value="this_week">This Week</Option>
            {/* Option for events happening "This Month" */}
            <Option value="this_month">This Month</Option>
          </Select>
        </Col>
      </Row>
    </div>
  );
};

export default Events;