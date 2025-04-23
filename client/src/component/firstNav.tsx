'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import SecondaryButton from "./secondaryButton";
import MainButton from "./primaryButton";
import LogoSwitcher from "./LogoSwitcher";
import FirstMenu from './FirstMenu'; 

import { AnimatePresence } from "motion/react";

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
          <LogoSwitcher/>
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
          <span className={`h-0.5 w-6 rounded-full bg-brand-primary transition ease transform duration-300 ${menuOpen ? "rotate-45 translate-y-2.5" : ""}`}></span>
          <span className={`h-0.5 w-6 my-2 rounded-full bg-brand-primary transition ease transform duration-300 ${menuOpen ? "opacity-0" : "opacity-100"}`}></span>
          <span className={`h-0.5 w-6 rounded-full bg-brand-primary transition ease transform duration-300 ${menuOpen ? "-rotate-45 -translate-y-2.5" : ""}`}></span>
        </button>
      </div>

      {/* Fullscreen Mobile Menu */}
      <AnimatePresence>
      {menuOpen && (
         <FirstMenu onClose={() => setMenuOpen(false)} />
       )}
      </AnimatePresence>
    </nav>
  );
}

export default FirstNav;