'use client';

import { Button, ConfigProvider, Card } from 'antd';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token
          colorPrimary: '#E65E5E',
          borderRadius: 10,
        },
      }}
    >
      <main className="flex flex-col min-h-screen">
        {/* Navigation */}
        <nav className="w-full flex items-center justify-between px-8 py-4 border-b border-gray-200">
          <div className="text-2xl font-bold text-gray-700">
            Spark!Bytes
          </div>
          <div className="flex items-center space-x-4">
            {/* Here you can use the Link component or antd's Menu */}
            <Link href="/about" className="text-gray-700 font-semibold">
              About
            </Link>
            <Link href="/login" className="text-red-500 font-semibold">
              Sign In
            </Link>
            <Link href="/signup">
              <Button type="primary" className="text-white bg-red-500 font-semibold">
                Sign Up
              </Button>
            </Link>
          </div>
        </nav>

        {/* The following content is the main content of the page */}
        <HeaderSection />
        <SectionOne />
        <SectionTwo />
        <SectionThree />
        <FooterSection />
      </main>
    </ConfigProvider>
  );
}

// Below we split other sections into components
function HeaderSection() {
  return (
    <header
      className="
        relative        /* Allow child elements to be positioned absolutely */
        flex flex-col items-center justify-center
        text-center
        px-4 py-20
        overflow-hidden /* Prevent scrollbars when circles overflow the boundaries */
      "
    >
      {/* Pink circle at the top left */}
      <div
        className="
          absolute
          top-[-80px]     /* Adjust based on actual effect */
          left-[-80px]
          w-[200px]       /* Diameter of the circle */
          h-[200px]
          bg-pink-200
          rounded-full
          opacity-50
          blur-2xl        /* Gives a soft shadow effect to the circle */
          pointer-events-none /* Prevents interference with mouse interactions */
        "
      />

      {/* Pink circle at the top right or bottom right */}
      <div
        className="
          absolute
          top-[50px]      /* Adjust position as needed */
          right-[-100px]
          w-[300px]
          h-[300px]
          bg-pink-300
          rounded-full
          opacity-40
          blur-3xl
          pointer-events-none
        "
      />

      <h1 className="text-[#E65E5E] font-bold text-4xl md:text-5xl mb-4">
        Free Food.
      </h1>
      <h1 className="text-[#E65E5E] font-bold text-4xl md:text-5xl mb-4">
        No Strings Attached.
      </h1>
      <p className="text-lg text-gray-700 md:text-xl max-w-2xl mb-6">
        College is expensive—your next meal doesn&apos;t have to be. Spark Bytes helps BU students
        find free food on campus in seconds so you never miss out.
      </p>
      <Link href="/join">
        <Button type="primary" size="large">
          Sign Up Now!
        </Button>
      </Link>
    </header>
  );
}

function SectionOne() {
  return (
    <section className="px-4 py-16 max-w-5xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-8">How Spark Bytes Works</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {/* Here you can put a three-step process, for example: "Post Events", "Browse & Find", "Reduce Waste" */}

        <div className="border border-black rounded-lg py-6 border-1">
          <h3 className="text-xl font-semibold mb-2">Post Events</h3>
          <p className="text-gray-700">
            BU community members can share upcoming events with free food.
          </p>
        </div>

        <div className="border border-black rounded-lg py-6 border-1">
          <h3 className="text-xl font-semibold mb-2">Browse & Find</h3>
          <p className="text-gray-700">
            Easily discover events and free food spots around campus.
          </p>
        </div>

        <div className="border border-black rounded-lg py-6 border-1">
          <h3 className="text-xl font-semibold mb-2">Reduce Waste</h3>
          <p className="text-gray-700">
            Enjoy free meals while helping reduce food waste on campus.
          </p>
        </div>
      </div>
    </section>
  );
}

function SectionTwo() {
  return (
    <section className="bg-gray-50 px-4 py-16">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Our Mission</h2>
        <p className="text-gray-700 mb-8">
          Spark Bytes aims to create a more sustainable campus by reducing food
          waste from events while helping students access free meals.
        </p>
        <Link href="/about" className="p-5">
          <Button value="large" className="font-semibold" danger>
            Learn More
          </Button>
        </Link>
        <Link href="/join">
          <Button type="primary" value="large" className="font-semibold">
            Join Now
          </Button>
        </Link>
      </div>
    </section>
  );
}

function SectionThree() {
  return (
    <section className="px-4 py-16 max-w-5xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-8">Our Impact</h2>
      {/* Here you can include some statistics */}
      <div className="flex flex-col md:flex-row md:justify-center gap-8">
        <div>
          <p className="text-4xl font-bold">500+</p>
          <p className="text-gray-700">Events Shared</p>
        </div>
        <div>
          <p className="text-4xl font-bold">100+</p>
          <p className="text-gray-700">BU Students</p>
        </div>
        <div>
          <p className="text-4xl font-bold">500 lb</p>
          <p className="text-gray-700">Food Waste Prevented</p>
        </div>
      </div>
    </section>
  );
}

function FooterSection() {
  return (
    <footer className="border-t border-gray-200 px-4 py-4 text-center text-base text-gray-600">
      Made With Love By Team Ditto
    </footer>
  );
}
