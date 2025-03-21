"use client";

import { Layout } from 'antd';
import CustomHeader from './header';

// Destructure Content and Footer components from antd Layout
const { Content, Footer } = Layout;

const LayoutComponent = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout className="layout" style={{ minHeight: "100vh" }}>
      {/* Include the custom header component */}
      <CustomHeader />
      {/* Apply padding and margin to the content area */}
        <Content style={{ padding: "0 50px", marginTop: 16 }}>
          <div
            className="site-layout-content"
            style={{ padding: 16, minHeight: 380, height: "100%" }}
          >
            {/* Render the children components passed to LayoutComponent */}
            {children}
          </div>
        </Content>
        {/* Center align the footer text */}
        <Footer style={{ textAlign: "center" }}>
          {/* Footer content */}
          Spark!Bytes ©2025 Created by Team Ditto!
        </Footer>
    </Layout>
  );
};

export default LayoutComponent;