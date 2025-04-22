'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';
import { useTheme } from '@/context/ThemeContext';


const Notification = () => {
  const { currentNotification, removeNotification } = useNotifications();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <AnimatePresence>
        {currentNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`p-4 rounded-lg shadow-lg max-w-sm transition-colors duration-300 ${
            currentNotification.type === 'info'
              ? isDark
                ? 'bg-[#2a2a2c] border border-white text-white'
                : 'bg-white border border-black text-black'
              : currentNotification.type === 'warning'
              ? isDark
                ? 'bg-yellow-900 border border-yellow-400 text-yellow-100'
                : 'bg-yellow-100 border border-yellow-500 text-yellow-800'
              : currentNotification.type === 'success'
              ? isDark
                ? 'bg-green-900 border border-green-400 text-green-100'
                : 'bg-green-100 border border-green-500 text-green-800'
              : isDark
              ? 'bg-red-900 border border-red-400 text-red-100'
              : 'bg-red-100 border border-red-500 text-red-800'
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
  );
};

export default Notification;