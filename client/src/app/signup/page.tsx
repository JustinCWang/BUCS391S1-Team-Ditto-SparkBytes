'use client'
import React from 'react';
import { Form, Input, Button, Card } from 'antd';
import { useRouter } from 'next/navigation';

// Define the SignupPage component as a React Functional Component
const SignupPage: React.FC = () => {
  // Use the useRouter hook from Next.js for navigation
  const router = useRouter();

  // Function to handle form submission
  const onFinish = (values: { username: string; password: string; confirmPassword: string }) => {
    console.log('Received values of form: ', values);
    // You can handle registration here
  };

  // Return the JSX to render the signup page
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f2f5'
      }}
    >
      {/* Card component to contain the form */}
      <Card style={{ width: 300 }}>
        {/* Form component with name "signup" and onFinish handler */}
        <Form
          name="signup"
          onFinish={onFinish}
        >
          {/* Form item for username input with validation rule */}
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          {/* Form item for password input with validation rule */}
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          {/* Form item for confirm password input with validation rule */}
          <Form.Item
            name="confirmPassword"
            rules={[{ required: true, message: 'Please confirm your Password!' }]}
          >
            <Input.Password placeholder="Confirm Password" />
          </Form.Item>

          {/* Form item for submit button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Sign Up
            </Button>
          </Form.Item>
        </Form>
        {/* Link to navigate to login page */}
        <div style={{ textAlign: 'center' }}>
          <a onClick={() => router.push('/login')}>Already have an account? Log In</a>
        </div>
      </Card>
    </div>
  );
};

export default SignupPage;