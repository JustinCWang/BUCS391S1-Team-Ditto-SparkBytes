'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';

const Notification = () => {
  const { currentNotification, removeNotification } = useNotifications();

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <AnimatePresence>
        {currentNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`p-4 rounded-lg shadow-lg max-w-sm ${
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
  );
};

export default Notification;