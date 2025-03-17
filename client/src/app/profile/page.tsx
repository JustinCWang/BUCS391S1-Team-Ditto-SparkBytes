'use client'
import React from 'react';
import { Typography, Table, Descriptions } from 'antd';

const { Title } = Typography;

const Profile = () => {
  // User information object
  const userInfo = {
    username: 'john_doe',
    email: 'john_doe@bu.edu',
    uid: '123456789',
  };

  // Statistics data array
  const statisticsData = [
    {
      key: '1',
      statistic: 'Events Visited',
      value: '15',
    },
    {
      key: '2',
      statistic: 'Food Waste Saved',
      value: '10 kg',
    },
    {
      key: '3',
      statistic: 'Amount Walked',
      value: '20 km',
    },
  ];

  // Columns configuration for the statistics table
  const columns = [
    {
      title: 'Statistic',
      dataIndex: 'statistic',
      key: 'statistic',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
  ];

  return (
    <div className="site-layout-content" style={{ padding: '24px 0' }}>
      {/* Profile title */}
      <Title level={2} className="text-2xl font-bold">Profile</Title>
      <p>Welcome to the Profile page of Spark!Bytes. Here you can find more information about your profile.</p>

      {/* User information section */}
      <Descriptions title="User Info" bordered>
        <Descriptions.Item label="Username">{userInfo.username}</Descriptions.Item>
        <Descriptions.Item label="BU Email">{userInfo.email}</Descriptions.Item>
        <Descriptions.Item label="UID">{userInfo.uid}</Descriptions.Item>
      </Descriptions>

      {/* Statistics section */}
      <Title level={3} style={{ marginTop: '20px' }}>Statistics</Title>
      <Table dataSource={statisticsData} columns={columns} pagination={false} />

      {/* Preferences section */}
      <Title level={3} style={{ marginTop: '20px' }}>Preferences</Title>
      <p>Preferences content goes here...</p>

      {/* Personal information section */}
      <Title level={3} style={{ marginTop: '20px' }}>Personal Information</Title>
      <p>Personal information content goes here...</p>
    </div>
  );
};

export default Profile;