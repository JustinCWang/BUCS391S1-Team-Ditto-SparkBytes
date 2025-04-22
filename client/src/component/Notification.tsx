'use client';

import React, {useEffect} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';
import { useTheme } from '@/context/ThemeContext'; 

const Notification = () => {
  const { currentNotification, removeNotification } = useNotifications();
  const { theme } = useTheme(); 
  const isDark = theme === 'dark';

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

  useEffect(() => {
    if(currentNotification) {
      setTimeout(() => removeNotification(currentNotification.id), 5000)
    }
  }, [currentNotification])

  return (
<<<<<<< HEAD
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <AnimatePresence>
        {currentNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={getNotificationClasses()}
          >
            <div className="flex justify-between items-start">
              <p className="text-sm whitespace-pre-line">{currentNotification.message}</p>
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
=======
    <div className="fixed top-4 left-0 w-full z-[999]">
      <div className="flex justify-center">
        <AnimatePresence>
          {currentNotification && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={`p-4 rounded-lg shadow-lg max-w-sm w-full mx-4 ${
                currentNotification.type === 'info' ? 'bg-white border border-black' :
                currentNotification.type === 'warning' ? 'bg-yellow-100 border border-yellow-500' :
                currentNotification.type === 'success' ? 'bg-green-100 border border-green-500' :
                'bg-red-100 border border-red-500'
              }`}
            >
              <div className="flex justify-between items-start">
                <p className="text-sm whitespace-pre-line">{currentNotification.message}</p>
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
>>>>>>> 875ff45 (Fix notification on mobile)
    </div>
  );
};

export default Notification; 