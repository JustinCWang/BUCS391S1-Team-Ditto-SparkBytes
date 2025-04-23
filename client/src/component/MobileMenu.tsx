'use client';

import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Bell, CalendarClock, CircleUser, House } from 'lucide-react';
import Image from 'next/image';

interface MobileMenuProps {
  onClose: () => void;
  onLogout: () => void;
  onResetNotifications: () => void;
  avatarUrl?: string | null;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  onClose,
  onLogout,
  onResetNotifications,
  avatarUrl,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.div
      key="mobile-nav"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.98 }}
      transition={{ ease: 'easeInOut', duration: 0.4 }}
      className={`fixed inset-0 z-10 pt-20 px-4 transition-colors duration-300 ${
        isDark ? 'bg-[#222224] text-white' : 'bg-white text-text-primary'
      }`}
    >
      <div className="flex flex-col items-center justify-center gap-4">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="text-xl font-poppins font-semibold flex justify-center items-center"
          >
            <House className="mr-1" />
            Home
          </Link>

          <Link
            href="/events"
            onClick={onClose}
            className="text-xl font-poppins font-semibold flex justify-center items-center"
          >
            <CalendarClock className="mr-1" />
            Events
          </Link>

          <button
            onClick={() => {
              onResetNotifications();
              onClose();
            }}
            className="text-xl font-poppins font-semibold flex justify-center items-center"
          >
            <Bell className="mr-1" />
            Notifications
          </button>

          <Link
            href="/profile"
            onClick={onClose}
            className="text-xl font-poppins font-semibold flex justify-center items-center"
          >
            {avatarUrl ? (
              <Link href="/profile">
                <div className="w-7 h-7 rounded-full overflow-hidden border mr-1">
                  <Image
                    src={avatarUrl}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>
              </Link>
            ) : (
              <Link href="/profile">
                <div className="w-7 h-7 flex justify-center items-center rounded-full overflow-hidden mr-1">
                  <CircleUser className="w-full h-full" />
                </div>
              </Link>
            )}
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
