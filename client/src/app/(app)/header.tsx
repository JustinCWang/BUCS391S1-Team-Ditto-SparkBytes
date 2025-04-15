'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logout } from "@/lib/auth";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

const CustomHeader = () => {
  const router = useRouter();
  const { avatarUrl } = useAuth();
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
          <Image
            src="/images/Spark.png"
            alt="SparkBytes Logo"
            width={150}
            height={0}
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center justify-center gap-6 text-text-primary font-poppins font-semibold">
          <Link href="/dashboard">Home</Link>
          <Link href="/events">Events</Link>
          <Link href="/profile">Profile</Link>
        </div>

        {/* Desktop Avatar and Logout Button */}
        <div className="hidden md:flex items-center gap-4">
          {avatarUrl && (
            <div className="w-10 h-10">
              <Image
                src={avatarUrl}
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
          )}
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
              <Link href="/dashboard" onClick={() => setMenu(false)} className="text-xl font-poppins font-semibold text-text-primary">
                Home
              </Link>
              <Link href="/events" onClick={() => setMenu(false)} className="text-xl font-poppins font-semibold text-text-primary">
                Events
              </Link>
              <Link href="/profile" onClick={() => setMenu(false)} className="text-xl font-poppins font-semibold text-text-primary">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-brand-primary text-white font-poppins font-black py-2 px-6 rounded-md hover:bg-hover-primary"
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
