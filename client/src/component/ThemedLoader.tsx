'use client'

import { Loader } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import React from 'react';

export default function ThemedLoader() {
  const { theme } = useTheme();

  return (
    <div className="w-full flex justify-center items-center h-[50vh]">
      <Loader
        className={`animate-spin ${
          theme === 'dark' ? 'text-white' : 'text-brand-primary'
        }`}
        size={40}
        style={{ animationDuration: '3s' }}
      />
    </div>
  );
}
