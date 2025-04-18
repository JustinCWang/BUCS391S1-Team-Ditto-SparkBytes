'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logout } from "@/lib/auth";
import { motion, AnimatePresence } from "motion/react";
import MobileMenu from '@/component/MobileMenu';
import LogoSwitcher from '@/component/LogoSwitcher';

const CustomHeader = () => {
  const router = useRouter();
  const [openMenu, setMenu] = useState(false);

  const handleLogout = async () => {
    const { error } = await Logout();
    if (!error) {
      router.push("/");
    }
  };

  useEffect(() => {
    document.body.style.overflow = openMenu ? "hidden" : "auto";
  }, [openMenu]);

  return (
    <nav className="w-full px-4 py-4 border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="text-sm sm:text-3xl font-poppins font-semibold text-text-primary mr-4 z-20"
        >
        <LogoSwitcher />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center justify-center gap-6 text-text-primary font-poppins font-semibold">
          <Link href="/dashboard">Home</Link>
          <Link href="/events">Events</Link>
          <Link href="/profile">Profile</Link>
        </div>

        {/* Desktop Logout Button */}
        <div className="hidden md:flex">
          <button
            onClick={handleLogout}
            className="bg-brand-primary text-white font-poppins font-black py-1.5 px-5 rounded-md duration-300 ease-in hover:bg-hover-primary"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Icon */}
        <button
          onClick={() => setMenu(!openMenu)}
          className="z-[999] flex flex-col h-8 w-8 justify-center items-center relative overflow-hidden md:hidden"
          aria-label="Toggle menu"
        >
          <span className={`h-0.5 w-6 rounded-full bg-brand-primary transition ease transform duration-300 ${openMenu ? "rotate-45 translate-y-2.5" : ""}`}></span>
          <span className={`h-0.5 w-6 my-2 rounded-full bg-brand-primary transition ease transform duration-300 ${openMenu ? "opacity-0" : "opacity-100"}`}></span>
          <span className={`h-0.5 w-6 rounded-full bg-brand-primary transition ease transform duration-300 ${openMenu ? "-rotate-45 -translate-y-2.5" : ""}`}></span>
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
      {openMenu && (
        <MobileMenu onClose={() => setMenu(false)} onLogout={handleLogout} />
        )}
      </AnimatePresence>
    </nav>
  );
};

export default CustomHeader;

