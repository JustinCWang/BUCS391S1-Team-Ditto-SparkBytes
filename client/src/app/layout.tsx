"use client";
import React from "react";
import { Layout } from "antd";
import CustomHeader from "./header";

const { Content, Footer } = Layout;

const LayoutComponent = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <title>Spark!Bytes</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <Layout className="layout" style={{ minHeight: "100vh" }}>
          <CustomHeader />
          <Content style={{ padding: "0 50px", marginTop: 16 }}>
            <div
              className="site-layout-content"
              style={{ padding: 16, minHeight: 380, height: "100%" }}
            >
              {children}
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Spark!Bytes ©2025 Created by Team Ditto!
          </Footer>
        </Layout>
      </body>
    </html>
  );
};

export default LayoutComponent;