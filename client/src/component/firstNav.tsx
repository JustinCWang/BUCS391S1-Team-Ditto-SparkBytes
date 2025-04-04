'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import SecondaryButton from "./secondaryButton";
import MainButton from "./primaryButton";

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
          className="text-sm sm:text-3xl font-poppins font-semibold text-text-primary mr-4"
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
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Fullscreen Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center gap-4 px-4 animate-fade-in">
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-4 right-4"
            aria-label="Close menu"
          >
            <X size={28} />
          </button>

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
        </div>
      )}
    </nav>
  );
}

export default FirstNav;