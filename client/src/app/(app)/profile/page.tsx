'use client'
import { useEffect, useState } from 'react';
import { Typography, Table, Descriptions } from 'antd';
import { supabase } from '@/lib/supabase';

const { Title } = Typography;

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const Profile = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: ''
  });

  useEffect(() => {
    if (!user) {
      router.push('/');
    } else {
      // Fetch user info from Supabase
      const fetchUserInfo = async () => {
        try {
          const { data, error } = await supabase
            .from('Users')
            .select('bu_email, first_name, last_name')
            .eq('first_name', 'justin') // Filter where first_name is 'justin'
            .single();

          if (error) {
            console.error('Error fetching user info:', error);
          } else if (data) {
            setUserInfo({
              username: `${data.first_name} ${data.last_name}`,
              email: data.bu_email,
            });
          }
        } catch (err) {
          console.error('Unexpected error:', err);
        }
      };

      fetchUserInfo();
    }
  }, [router, user]);

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