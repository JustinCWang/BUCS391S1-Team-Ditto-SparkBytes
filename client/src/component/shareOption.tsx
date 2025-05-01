'use client';

import { motion } from 'motion/react';
import { useTheme } from '@/context/ThemeContext';

/**
 * Props for ShareModal
 * @param eventLink - The link to the event that will be shared
 * @param onClose - Function to close the modal
 */
interface ShareModalProps {
  eventLink: string;
  onClose: () => void;
}

/**
 * A modal that allows users to share an event via email or SMS.
 * Displays themed styling (light/dark) and uses browser `mailto:` and `sms:` protocols.
 */
const ShareModal: React.FC<ShareModalProps> = ({ eventLink, onClose }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Opens the user's email client with a pre-filled message
  const shareEmail = () => {
    const subject = encodeURIComponent("Check out this event!");
    const body = encodeURIComponent(`Hungry? Thought you'd like this event: ${eventLink}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  // Opens the user's SMS app with a pre-filled message (mobile only)
  const shareSMS = () => {
    const message = encodeURIComponent(`Looking for something to eat? Check out this event: ${eventLink}`);
    window.location.href = `sms:?&body=${message}`;
  };

  return (
    <motion.div
      key="share-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{
          type: "spring",
          bounce: 0,
          duration: 0.4,
        }}
        className={`p-6 rounded-xl shadow-xl w-72 space-y-4 text-center transition-colors duration-300 ${
          isDark ? 'bg-[#222224] text-white' : 'bg-white text-black'
        }`}
      >

        {/* Modal Header */}
        <h2 className="text-xl font-montserrat font-bold">Share this Event</h2>

         {/* Share via Email */}
        <button
          onClick={shareEmail}
          className="w-full font-poppins font-black bg-blue-500 text-white py-2 rounded-md duration-300 ease-in hover:bg-blue-600"
        >
          Share via Email
        </button>

        {/* Share via SMS */}
        <button
          onClick={shareSMS}
          className="w-full font-poppins font-black bg-green-500 text-white py-2 rounded-md duration-300 ease-in hover:bg-green-600"
        >
          Share via SMS
        </button>

        {/* Cancel Button */}
        <button
          onClick={onClose}
          className="font-poppins font-black hover:underline"
        >
          Cancel
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ShareModal;