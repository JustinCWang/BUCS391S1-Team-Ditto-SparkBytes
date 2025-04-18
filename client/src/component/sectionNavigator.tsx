'use client'

import { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const SectionNavigator = () => {
  const [isOpen, setIsOpen] = useState(false);

  const sections = [
    { id: 'upcoming', label: 'Upcoming Events' },
    { id: 'liked', label: 'Your Liked Events' },
    { id: 'my', label: 'My Events' }
  ];

  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-50">
      <div className="relative">
        {/* Toggle button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-8 h-12 bg-white rounded-r-lg shadow-lg border border-gray-200
                     hover:bg-gray-50 transition-all duration-300"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>

        {/* Navigation panel */}
        <div 
          className={`absolute left-0 top-0 bg-white rounded-r-lg shadow-lg border border-gray-200
                     transition-all duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="w-48 p-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  if (section.id === 'upcoming') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    const element = document.getElementById(section.id);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors
                           font-poppins text-sm text-text-primary rounded-md"
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionNavigator; 