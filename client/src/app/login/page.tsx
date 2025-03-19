'use client'
import React from 'react';
import { Form, Input, Button, Checkbox, Card } from 'antd';
import { useRouter } from 'next/navigation';

// Define the LoginPage component as a React Functional Component
const LoginPage: React.FC = () => {
  // Use the useRouter hook from Next.js for navigation
  const router = useRouter();

  // Function to handle form submission
  const onFinish = (values: { username: string; password: string; remember: boolean }) => {
    console.log('Received values of form: ', values);
    // You can handle authentication here
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
          {/* Form item for the username input */}
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            {/* Ant Design Input component for the username */}
            <Input placeholder="Username" />
          </Form.Item>

          {/* Form item for the password input */}
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            {/* Ant Design Input.Password component for the password */}
            <Input.Password placeholder="Password" />
          </Form.Item>

          {/* Form item for the remember me checkbox */}
          <Form.Item name="remember" valuePropName="checked">
            {/* Ant Design Checkbox component */}
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          {/* Form item for the submit button */}
          <Form.Item>
            {/* Ant Design Button component for form submission */}
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Log in
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