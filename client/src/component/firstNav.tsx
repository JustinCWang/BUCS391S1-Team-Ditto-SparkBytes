'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import SecondaryButton from "./secondaryButton";
import MainButton from "./primaryButton";

import { motion, AnimatePresence } from "motion/react";

function FirstNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Prevent background scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  return (
    <nav className="w-full px-4 py-4 border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
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
        <div className="hidden md:flex items-center justify-center gap-2 lg:gap-4">
          <Link
            href="/about"
            className="text-text-primary font-poppins font-semibold"
          >
            About
          </Link>
          <SecondaryButton
            linkTo="/login"
            text="Log In"
            styling="text-xs lg:text-base"
          />
          <MainButton
            linkTo="/signup"
            text="Sign Up"
            styling="text-xs lg:text-base"
          />
        </div>

        {/* Mobile Menu Icon */}
        <button 
          onClick={() => setMenuOpen(!menuOpen)} 
          className="z-[999] flex flex-col h-8 w-8 justify-center items-center relative overflow-hidden md:hidden"
          aria-label="Toggle menu"
        >
          <span className={`h-0.5 w-6 rounded-full bg-black transition ease transform duration-300 ${menuOpen ? "rotate-45 translate-y-2.5" : ""}`}></span>
          <span className={`h-0.5 w-6 my-2 rounded-full bg-black transition ease transform duration-300 ${menuOpen ? "opacity-0" : "opacity-100"}`}></span>
          <span className={`h-0.5 w-6 rounded-full bg-black transition ease transform duration-300 ${menuOpen ? "-rotate-45 -translate-y-2.5" : ""}`}></span>
        </button>
      </div>

      {/* Fullscreen Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
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
            <motion.div
              className="flex flex-col items-center justify-center gap-4"
            >
              <Link
                href="/about"
                className="text-xl font-poppins font-semibold text-text-primary"
                onClick={() => setMenuOpen(false)}
              >
                About
              </Link>

              <SecondaryButton
                linkTo="/login"
                text="Log In"
                styling="text-base"
              />
              <MainButton
                linkTo="/signup"
                text="Sign Up"
                styling="text-base"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default FirstNav;