'use client';

import { useTheme } from '@/context/ThemeContext';
import { motion } from 'motion/react';
import Link from 'next/link';

interface MobileMenuProps {
  onClose: () => void;
  onLogout: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ onClose, onLogout }) => {
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <motion.div
      key="mobile-nav"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.98 }}
      transition={{
        ease: "easeInOut",
        duration: 0.4,
      }}
      className={`fixed inset-0 z-10 pt-20 px-4 transition-colors duration-300 ${
        isDark ? 'bg-[#222224] text-white' : 'bg-white text-black'
      }`}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <Link href="/dashboard" onClick={onClose} className={`text-xl font-poppins font-semibold`}>
          Home
        </Link>
        <Link href="/events" onClick={onClose} className={`text-xl font-poppins font-semibold`}>
          Events
        </Link>
        <Link href="/profile" onClick={onClose} className={`text-xl font-poppins font-semibold`}>
          Profile
        </Link>
        <button
          onClick={onLogout}
          className="bg-brand-primary text-white font-poppins font-black py-2 px-6 rounded-md hover:bg-hover-primary"
        >
          Logout
        </button>
      </div>
    </motion.div>
  );
};

export default MobileMenu;
