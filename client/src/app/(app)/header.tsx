'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Logout } from "@/lib/auth";
import { AnimatePresence } from "motion/react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { CircleUser, House, CalendarClock, Bell, MapPinCheck, ChevronDown, ChevronUp, LayoutDashboard } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import { useTheme } from '@/context/ThemeContext';
import { userRole } from "@/lib/user";

import MobileMenu from '@/component/MobileMenu';
import LogoSwitcher from '@/component/LogoSwitcher';


const CustomHeader = () => {
  const router = useRouter();
  const { avatarUrl, user } = useAuth();
  const { clearShownEvents } = useNotifications();
  const [openMenu, setMenu] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [role, setRole] = useState<string>("");

  // Logout handler
  const handleLogout = async () => {
    const { error } = await Logout();
    if (!error) {
      router.push("/");
    }
  };

  // Reset notifications (also clears localStorage)
  const handleResetNotifications = () => {
    localStorage.removeItem('shownEventIds');
    clearShownEvents();
    console.log('[Notification] Reset notification history - users will receive notifications again');
  };

  const pathname = usePathname();

  // Fetch user role once user is available or pathname changes
  useEffect(() => {
    const fetchRole = async () => {
      if (user) {
        const { data, error } = await userRole(user.id);
        if (!error) setRole(data.role);
        else console.error("Role fetch error:", error.message);
      }
    };

    fetchRole();
  }, [user, pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = openMenu ? "hidden" : "auto";
  }, [openMenu]);

  return (
    <nav className="w-full px-4 py-4 border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex justify-center items-center gap-6">

          {/* Logo & Desktop Nav Links */}
          <Link
            href="/dashboard"
            className="text-sm sm:text-3xl font-poppins font-semibold text-text-primary mr-4 z-20"
          >
          <LogoSwitcher />
          </Link>

          <div className="hidden md:flex items-center justify-center gap-8 text-text-primary font-poppins font-semibold">
              <Link href="/dashboard" className="flex justify-center items-center">
                <House className="mr-1"/>
                Home
              </Link>
              <Link href="/events" className="flex justify-center items-center">
                <CalendarClock className="mr-1"/>
                Events
              </Link>
              <Link href="/map" className="flex justify-center items-center">
                <MapPinCheck className="mr-1"/>
                Map
              </Link>
              {role === 'admin' && 
                <Link href="/admin" className="flex justify-center items-center">
                  <LayoutDashboard className="mr-1"/>
                  Admin
                </Link>
              }
          </div>
        </div>

        {/* User Dropdown + Notification (Desktop Only) */}
        <div className="hidden md:flex items-center gap-4 relative">
          {/* New reset notifications button */}
          <button
            onClick={handleResetNotifications}
            className="text-text-primary hover:text-brand-primary transition-colors duration-300 flex items-center justify-center cursor-pointer"
            title="Reset notifications for your liked events"
          >
            <Bell size={24} />
          </button>

          {/* Divider */}
          <div className="h-full bg-gray-300 w-0.5 py-6"></div>
          
          {/* Avatar + Dropdown */}
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`flex justify-center items-center transition-colors duration-300`}
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-full overflow-hidden">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              ) : (
                <CircleUser className={`w-full h-full ${isDark ? 'text-white' : 'text-text-primary'}`} />
              )}
            </div>
            {dropdownOpen ? <ChevronUp className={`${isDark ? 'text-white' : 'text-text-primary'}`}/> : <ChevronDown className={`${isDark ? 'text-white' : 'text-text-primary'}`}/>}
          </button>

          {/* Dropdown Menu */}
          <div
            className={`absolute right-0 top-16 border-text-primary border-1 shadow-lg rounded-lg p-2 z-30 w-40 transition-all duration-300 ease-in-out transform ${
              dropdownOpen
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
            } ${isDark ? 'bg-[#222224] text-white' : 'bg-white text-black'}`}
          >
            <div
              className={`flex justify-center items-center duration-300 ease-in-out rounded-lg p-2 ${
                isDark ? 'hover:bg-[#2e2e30]' : 'hover:bg-gray-100'
              }`}
            >
              <CircleUser className="w-5 h-5 mr-1" />
              <Link
                href="/profile"
                onClick={() => setDropdownOpen(false)}
                className={`font-poppins font-semibold ${
                  isDark ? 'text-white' : 'text-text-primary'
                }`}
              >
                Profile
              </Link>
            </div>
            <div className="flex justify-center mt-2 mb-2">
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

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenu(!openMenu)}
          className="z-[70] flex flex-col h-8 w-8 justify-center items-center relative overflow-hidden md:hidden"
          aria-label="Toggle menu"
        >
          <span className={`h-0.5 w-6 rounded-full bg-brand-primary transition ease transform duration-300 ${openMenu ? "rotate-45 translate-y-2.5" : ""}`}></span>
          <span className={`h-0.5 w-6 my-2 rounded-full bg-brand-primary transition ease transform duration-300 ${openMenu ? "opacity-0" : "opacity-100"}`}></span>
          <span className={`h-0.5 w-6 rounded-full bg-brand-primary transition ease transform duration-300 ${openMenu ? "-rotate-45 -translate-y-2.5" : ""}`}></span>
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {openMenu && (
          <MobileMenu
            onClose={() => setMenu(false)}
            onLogout={handleLogout}
            onResetNotifications={handleResetNotifications}
            avatarUrl={avatarUrl}
            role={role}
          />
        )}
      </AnimatePresence>
    </nav>
  );
};

export default CustomHeader;
