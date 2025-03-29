'use client';

import React from 'react';
import CustomHeader from './header';
import FooterSection from '@/component/footer';

const LayoutComponent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header at the top */}
      <CustomHeader />

      {/* Main content area */}
      <main className="flex-grow px-4 lg:px-12 py-4">
        {children}
      </main>

      {/* Footer at the bottom */}
      <FooterSection />
    </div>
  );
};

export default LayoutComponent;
