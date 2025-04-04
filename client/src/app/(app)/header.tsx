'use client';

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logout } from "@/lib/auth";
import { Menu, X } from "lucide-react";

import Image from "next/image";

const CustomHeader = () => {
  const router = useRouter();
  const [openMenu, setMenu] = useState(false);

  const handleLogout = async () => {
    const { error } = await Logout();
    if (!error) {
      router.push("/");
    }
  };

  return (
    <nav className="w-full px-4 py-4 border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between relative">
        <div className="flex-1">
          <Link
            href="/dashboard"
            className="text-xl font-poppins font-semibold text-text-primary"
          >
            <Image
              src="/images/Spark.png"
              alt="SparkBytes Logo"
              width={150}
              height={0}
            />
          </Link>
        </div>

        <div className="hidden md:flex flex-1 justify-center gap-8 text-text-primary font-poppins font-semibold">
          <Link href="/dashboard">Home</Link>
          <Link href="/events">Events</Link>
          <Link href="/profile">Profile</Link>
        </div>

        <div className="hidden md:flex flex-1 justify-end">
          <button
            onClick={handleLogout}
            className="bg-brand-primary text-white font-poppins font-black 
              py-1.5 px-5 rounded-md duration-300 ease-in hover:bg-hover-primary flex items-center justify-center"
          >
            Logout
          </button>
        </div>

        <div className="md:hidden">
          <button onClick={() => setMenu(!openMenu)}>
            {openMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {openMenu && (
          <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center gap-8">
            <div className="absolute top-4 right-6">
              <button onClick={() => setMenu(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col items-center justify-center gap-8 text-text-primary font-poppins font-semibold"> 
              <Link href="/dashboard" onClick={() => setMenu(false)}>Home</Link>
              <Link href="/events" onClick={() => setMenu(false)}>Events</Link>
              <Link href="/profile" onClick={() => setMenu(false)}>Profile</Link>
            </div>
            <button
              onClick={handleLogout}
              className="bg-brand-primary text-white font-poppins font-black 
              py-1.5 px-5 rounded-md duration-300 ease-in hover:bg-hover-primary"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default CustomHeader;

