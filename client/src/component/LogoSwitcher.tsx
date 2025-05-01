'use client';
import { useTheme } from '@/context/ThemeContext';
import Image from 'next/image';

/**
 * Dynamically switches between light and dark logos
 * based on the current theme context ('light' or 'dark').
 * Uses Next.js Image optimization with responsive layout.
 */
export default function LogoSwitcher() {
  const { theme } = useTheme();

  return (
    <div className="relative w-[150px] h-[40px]">
      <Image
        src={theme === 'dark' ? '/images/dark-logo.png' : '/images/Spark.png'}
        alt="Logo"
        fill
        className="object-contain"
      />
    </div>
  );
}