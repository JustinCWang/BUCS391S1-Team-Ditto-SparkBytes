'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logout } from "@/lib/auth";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

import { CircleUser, House, CalendarClock, Bell, MapPinCheck } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";


const CustomHeader = () => {
  const router = useRouter();
  const { avatarUrl } = useAuth();
  const { clearShownEvents } = useNotifications();
  const [openMenu, setMenu] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    const { error } = await Logout();
    if (!error) {
      router.push("/");
    }
  };

  const handleResetNotifications = () => {
    localStorage.removeItem('shownEventIds');
    clearShownEvents();
    console.log('[Notification] Reset notification history - users will receive notifications again');
  };

  useEffect(() => {
    document.body.style.overflow = openMenu ? "hidden" : "auto";
  }, [openMenu]);

  return (
    <nav className="w-full px-4 py-4 border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex justify-center items-center gap-6">
          <Link
            href="/dashboard"
            className="text-sm sm:text-3xl font-poppins font-semibold text-text-primary mr-4 z-20"
          >
            <Image
              src="/images/Spark.png"
              alt="SparkBytes Logo"
              width={150}
              height={0}
            />
          </Link>

          <div className="hidden md:flex items-center justify-center gap-8 text-text-primary font-poppins font-semibold">
            <div className="flex justify-center items-center">
              <House className="mr-1"/>
              <Link href="/dashboard">Home</Link>
            </div>
            <div className="flex justify-center items-center">
              <CalendarClock className="mr-1"/>
              <Link href="/events">Events</Link>
            </div>
            <div className="flex justify-center items-center">
              <MapPinCheck className="mr-1"/>
              <Link href="/map">Map</Link>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4 relative">
          {/* New reset notifications button */}
          <button
            onClick={handleResetNotifications}
            className="text-text-primary hover:text-brand-primary transition-colors duration-300 flex items-center justify-center"
            title="Reset notifications for your liked events"
          >
            <Bell size={24} />
          </button>
          
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-12 h-12 flex items-center justify-center rounded-full overflow-hidden"
          >
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="User Avatar"
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            ) : (
              <CircleUser className="w-full h-full" />
            )}
          </button>

          <div
            className={`absolute right-0 top-14 bg-white shadow-lg rounded-lg p-2 z-30 w-40 transition-all duration-300 ease-in-out transform ${
              dropdownOpen
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
            }`}
          >
            <div className="flex justify-center items-center duration-300 ease-in-out hover:bg-gray-100 rounded-lg p-2">
              <CircleUser className="w-5 h-5 mr-1"/>
              <Link href="/profile" onClick={() => setDropdownOpen(false)} className="font-poppins font-semibold text-text-primary">
                Profile
              </Link>
            </div>
            <div className="flex justify-center mt-2">
              <button
                onClick={() => {
                  handleLogout();
                  setDropdownOpen(false);
                }}
                className="bg-brand-primary 
              text-white font-poppins font-black 
                py-1.5 px-5 
                rounded-md 
                duration-300 ease-in hover:bg-hover-primary 
                flex items-center justify-center"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Icon */}
        <button
          onClick={() => setMenu(!openMenu)}
          className="z-[999] flex flex-col h-8 w-8 justify-center items-center relative overflow-hidden md:hidden"
          aria-label="Toggle menu"
        >
          <span className={`h-0.5 w-6 rounded-full bg-black transition ease transform duration-300 ${openMenu ? "rotate-45 translate-y-2.5" : ""}`}></span>
          <span className={`h-0.5 w-6 my-2 rounded-full bg-black transition ease transform duration-300 ${openMenu ? "opacity-0" : "opacity-100"}`}></span>
          <span className={`h-0.5 w-6 rounded-full bg-black transition ease transform duration-300 ${openMenu ? "-rotate-45 -translate-y-2.5" : ""}`}></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {openMenu && (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{
              ease: "easeInOut",
              duration: 0.4,
            }}
            className="fixed inset-0 z-10 bg-white pt-20 px-4"
          >
            <motion.div className="flex flex-col items-center justify-center gap-4">
              <div className="flex justify-center items-center">
                <House className="mr-1"/>
                <Link href="/dashboard" onClick={() => setMenu(false)} className="text-xl font-poppins font-semibold text-text-primary">
                  Home
                </Link>
              </div>
              <div className="flex justify-center items-center">
                <CalendarClock className="mr-1"/>
                <Link href="/events" onClick={() => setMenu(false)} className="text-xl font-poppins font-semibold text-text-primary">
                  Events
                </Link>
              </div>
              
              {/* Add reset notifications button to mobile menu */}
              <div className="flex justify-center items-center">
                <Bell className="mr-1"/>
                <button 
                  onClick={() => {
                    handleResetNotifications();
                    setMenu(false);
                  }}
                  className="text-xl font-poppins font-semibold text-text-primary"
                >
                  Reset Notifications
                </button>
              </div>
              
              <div className="flex justify-center items-center">
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
                      <CircleUser className="w-full h-full"/>
                    </div>
                  </Link>
                )}
                <Link href="/profile" onClick={() => setMenu(false)} className="text-xl font-poppins font-semibold text-text-primary">
                  Profile
                </Link>
              </div>
              <button
                onClick={handleLogout}
                className="bg-brand-primary 
              text-white font-poppins font-black 
                py-1.5 px-5 
                rounded-md 
                duration-300 ease-in hover:bg-hover-primary 
                flex items-center justify-center"
              >
                Logout
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default CustomHeader;
