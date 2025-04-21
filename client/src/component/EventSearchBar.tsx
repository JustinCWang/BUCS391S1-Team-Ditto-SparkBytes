'use client';

import { useTheme } from '@/context/ThemeContext';

interface EventSearchBarProps {
  searchQuery: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EventSearchBar: React.FC<EventSearchBarProps> = ({ searchQuery, onChange }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <input
      type="text"
      placeholder="Search events..."
      value={searchQuery}
      onChange={onChange}
      className={`w-full font-inter px-4 py-3 rounded-md border focus:outline-none focus:border-text-primary ${
        isDark
          ? 'bg-[#1e1e1e] text-white placeholder-gray-500 border-gray-600'
          : 'bg-white text-black placeholder-gray-400 border-gray-300'
      }`}
    />
  );
};

export default EventSearchBar;