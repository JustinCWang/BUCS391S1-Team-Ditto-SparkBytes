'use client'

import { Loader } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext'; // make sure you have this
import React from 'react';

export default function ThemedLoader() {
  const { isDark } = useTheme(); // or however you're getting the dark mode state

  return (
    <div className={`w-full flex justify-center items-center h-[50vh]`}>
      <Loader
        className={`animate-spin ${
          isDark ? 'text-white' : 'text-brand-primary'
        }`}
        size={40}
        style={{ animationDuration: '3s' }}
      />
    </div>
  );
}
