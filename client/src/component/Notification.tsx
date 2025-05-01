'use client';

import React, {useEffect} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';
import { useTheme } from '@/context/ThemeContext'; 

/**
 * Displays animated toast-style alerts for the user.
 * Messages auto-dismiss after 5 seconds or can be dismissed manually.
 * Supports theming and alert types (info, success, warning, error).
 */
const Notification = () => {
  const { currentNotification, removeNotification } = useNotifications();
  const { theme } = useTheme(); 
  const isDark = theme === 'dark';

  // Returns appropriate styles based on notification type and current theme.
  const getNotificationClasses = () => {
    const base = 'p-4 rounded-lg shadow-lg max-w-sm border';

    if (!currentNotification) return base;

    const type = currentNotification.type;

    if (type === 'info') {
      return isDark
        ? `${base} bg-[#2a2a2c] border-white text-white`
        : `${base} bg-white border-black text-black`;
    }

    if (type === 'warning') {
      return isDark
        ? `${base} bg-yellow-900 border-yellow-400 text-yellow-100`
        : `${base} bg-yellow-100 border-yellow-500 text-yellow-800`;
    }

    if (type === 'success') {
      return isDark
        ? `${base} bg-green-900 border-green-400 text-green-100`
        : `${base} bg-green-100 border-green-500 text-green-800`;
    }

    // error
    return isDark
      ? `${base} bg-red-900 border-red-400 text-red-100`
      : `${base} bg-red-100 border-red-500 text-red-800`;
  };

  // Auto-dismiss the notification after 5 seconds
  useEffect(() => {
    if(currentNotification) {
      setTimeout(() => removeNotification(currentNotification.id), 5000)
    }
  }, [currentNotification])

  return (
    <div className="fixed top-4 left-0 w-full z-[999]">
      <div className="flex justify-center">
      <AnimatePresence>
        {currentNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={getNotificationClasses()}
          >
            <div className="flex justify-between items-start">

              {/* Notification message */}
              <p className="text-sm whitespace-pre-line">{currentNotification.message}</p>

              {/* Close button */}
              <button
                onClick={() => removeNotification(currentNotification.id)}
                className="ml-4 text-gray-500 hover:text-gray-700"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};

export default Notification; 