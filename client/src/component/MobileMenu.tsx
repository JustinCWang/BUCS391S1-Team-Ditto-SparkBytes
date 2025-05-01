'use client';

import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Bell, CalendarClock, CircleUser, House, LayoutDashboard, MapPinCheck } from 'lucide-react';
import Image from 'next/image';

/**
 * Props for the MobileMenu component
 * 
 * @param onClose - function to close the mobile menu
 * @param onLogout - function to trigger user logout
 * @param onResetNotifications - resets notification state (optional logic)
 * @param avatarUrl - URL of the user's avatar (if set)
 * @param role - current user role (e.g., 'admin' to show admin tab)
 */
interface MobileMenuProps {
  onClose: () => void;
  onLogout: () => void;
  onResetNotifications: () => void;
  avatarUrl?: string | null;
  role: string;
}

/**
 * THIS NAVIGATION IS USED FOR THE MAIN APPLICATION
 * Responsive mobile navigation component with theme-aware styling,
 * animated slide-in effect, user role-based routes, and logout/reset actions.
 */
const MobileMenu: React.FC<MobileMenuProps> = ({
  onClose,
  onLogout,
  onResetNotifications,
  avatarUrl,
  role
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

      {/* Menu content container */}
      <div className="flex flex-col items-center justify-center gap-4">

          {/* Home */}
          <Link
            href="/dashboard"
            onClick={onClose}
            className="text-xl font-poppins font-semibold flex justify-center items-center"
          >
            <House className="mr-1" />
            Home
          </Link>

          {/* Events */}
          <Link
            href="/events"
            onClick={onClose}
            className="text-xl font-poppins font-semibold flex justify-center items-center"
          >
            <CalendarClock className="mr-1" />
            Events
          </Link>

          {/* Map */}
          <Link href="/map" 
            onClick={onClose}
            className="text-xl font-poppins font-semibold flex justify-center items-center"
          >
            <MapPinCheck className="mr-1"/>
            Map
          </Link>

          {/* Admin (conditional on role) */}
          {role === 'admin' && 
            <Link href="/admin" 
              onClick={onClose}
              className="text-xl font-poppins font-semibold flex justify-center items-center"
            >
              <LayoutDashboard className="mr-1"/>
              Admin
            </Link>
          }

          {/* Notifications reset */}
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

          {/* Profile (shows avatar if available) */}
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
        
        {/* Logout */}
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
