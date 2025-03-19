'use client'
import React from 'react';
import { Input, Row, Col, Dropdown, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import FilterMenu from '../../component/filterMenu';

const { Search } = Input;

// Define the Events component
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
          {/* Dropdown for additional filters */}
          <Dropdown overlay={<FilterMenu />} trigger={['click']}>
            <Button style={{ width: '100%' }}>
              Filters <DownOutlined />
            </Button>
          </Dropdown>
        </Col>
      </Row>
    </div>
  );
};

export default Events;