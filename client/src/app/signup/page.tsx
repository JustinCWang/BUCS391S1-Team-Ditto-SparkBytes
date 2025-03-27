'use client'
import React, {useState, useEffect} from 'react';
import { Form, Input, Button, Checkbox, Card, message } from 'antd';
import '@ant-design/v5-patch-for-react-19';
import { useRouter } from 'next/navigation';

import { Register } from '../../lib/auth'
import { useAuth } from '@/context/AuthContext';

// Define the LoginPage component as a React Functional Component
const SignUpPage= () => {
  // Use the useRouter hook from Next.js for navigation
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { user, userSession} = useAuth();

  useEffect(() => {
    console.log(user);
      if (user) {
        router.push('/dashboard');
      }
  }, [user]);

  // Function to handle form submission
  const onFinish = async (values: { email: string, password: string }) => {
    try {
      setLoading(true);
      const { data, error } = await Register(values);
      
      if (error) {
        message.error(error.message);
        return;
      }
      
      message.success('Successfully signed up!');

    } catch (error) {
      console.error('Login error:', error);
      message.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Container div to center the login card
    <div
      style={{
        display: 'flex',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f2f5'
      }}
    >
      {/* Ant Design Card component to hold the login form */}
      <Card style={{ width: 300 }}>
        {/* Ant Design Form component for the login form */}
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          {/* Form item for the email input */}
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            {/* Ant Design Input component for the email */}
            <Input placeholder="Email" />
          </Form.Item>

          {/* Form item for the password input */}
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            {/* Ant Design Input.Password component for the password */}
            <Input.Password placeholder="Password" />
          </Form.Item>

          {/* Form item for the submit button */}
          <Form.Item>
            {/* Ant Design Button component for form submission */}
            <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading}>
              Sign Up
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SignUpPage;