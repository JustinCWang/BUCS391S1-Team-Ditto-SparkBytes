"use client";
import React from "react";
import { Layout } from "antd";
import CustomHeader from "./header";

// Destructure Content and Footer components from antd Layout
const { Content, Footer } = Layout;

const LayoutComponent = ({ children }: { children: React.ReactNode }) => {
  return (
    // Set the language of the document to English
    <html lang="en">
      <head>
        {/* Set the title of the document */}
        <title>Spark!Bytes</title>
        {/* Set the character encoding for the document */}
        <meta charSet="UTF-8" />
        {/* Set the viewport to make the website responsive */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        {/* Apply layout class and set minimum height to 100vh */}
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
      </body>
    </html>
  );
};

export default LayoutComponent;