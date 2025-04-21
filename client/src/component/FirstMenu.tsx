'use client';

import { useTheme } from '@/context/ThemeContext';
import { motion } from 'motion/react';
import Link from 'next/link';
import SecondaryButton from './secondaryButton';
import MainButton from './primaryButton';

interface FirstMenuProps {
  onClose: () => void;
}

const FirstMenu: React.FC<FirstMenuProps> = ({ onClose }) => {
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
      <motion.div className="flex flex-col items-center justify-center gap-4">
        <Link
          href="/about"
          className="text-xl font-poppins font-semibold"
          onClick={onClose}
        >
          About
        </Link>

        <SecondaryButton linkTo="/login" text="Log In" styling="text-base" />
        <MainButton linkTo="/signup" text="Sign Up" styling="text-base" />
      </motion.div>
    </motion.div>
  );
};

export default FirstMenu;