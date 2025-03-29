'use client';

import React from 'react';
import CustomHeader from './header';
import FooterSection from '@/component/footer';

const LayoutComponent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='min-h-screen flex flex-col'>
      <CustomHeader />

      <main className='flex-grow mx-4'>
        {children}
      </main>

      <FooterSection />
    </div>
  );
};

export default LayoutComponent;
