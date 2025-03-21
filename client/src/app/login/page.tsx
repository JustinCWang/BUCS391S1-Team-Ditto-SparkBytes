'use client'
import React, {useState, useEffect} from 'react';
import { Form, Input, Button, Checkbox, Card, message } from 'antd';
import { useRouter } from 'next/navigation';

import { Login } from '../../lib/auth'
import { useAuth } from '@/context/AuthContext';

// Define the LoginPage component as a React Functional Component
const LoginPage = () => {
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
      const { data, error } = await Login(values);
      
      if (error) {
        message.error(error.message);
        return;
      }
      
      message.success('Successfully logged in!');
      // Redirect or update state as needed
      router.push('/dashboard');
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
              Login
            </Button>
          </Form.Item>
        </Form>
        {/* Link to navigate to the signup page */}
        <div style={{ textAlign: 'center' }}>
          <a onClick={() => router.push('./signup')}>Don&apos;t have an account? Sign Up</a>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;