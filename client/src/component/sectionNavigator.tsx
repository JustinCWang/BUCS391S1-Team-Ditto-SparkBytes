'use client'

import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { userRole } from '@/lib/user';

const SectionNavigator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { user } = useAuth();
  const [role, setRole] = useState<string>("");
  
  // Fetch user role on component mount
  useEffect(() => {
    const fetchRole = async () => {
      if (user) {
        const { data, error } = await userRole(user.id);
        if (error) {
          console.error("Error fetching role:", error.message);
        } else {
          setRole(data.role);
        }
      }
    };
    
    if (user) {
      fetchRole();
    }
  }, [user]);

  // Define sections based on user role
  const getAvailableSections = () => {
    const baseSections = [
      { id: 'upcoming', label: 'Upcoming Events' },
      { id: 'liked', label: 'Your Liked Events' },
    ];
    
    // Only add My Events section if user is admin
    if (role === 'admin') {
      baseSections.push({ id: 'my', label: 'My Events' });
    }
    
    return baseSections;
  };

  const sections = getAvailableSections();

  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-50">
      <div className="relative">
        {/* Toggle button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-center w-8 h-12 rounded-r-lg shadow-lg border transition-all duration-300 ${
            isDark
              ? 'bg-[#222224] text-white border-gray-700 hover:bg-[#2e2e30]'
              : 'bg-white text-black border-gray-200 hover:bg-gray-50'
          }`}
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>

        {/* Navigation panel */}
        <div 
          className={`absolute left-0 top-0 rounded-r-lg shadow-lg border transition-all duration-300 transform ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          } ${isDark ? 'bg-[#222224] border-gray-700' : 'bg-white border-gray-200'}`}          
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
                className={`w-full px-4 py-2 text-left font-poppins text-sm rounded-md transition-colors ${
                  isDark ? 'text-white hover:bg-[#2e2e30]' : 'text-text-primary hover:bg-gray-50'
                }`}
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