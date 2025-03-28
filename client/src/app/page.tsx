'use client';

import { Button, } from 'antd';
import Link from 'next/link';

export default function LandingPage() {
  return (

    <main className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="w-full flex items-center justify-between px-8 py-4 border-b border-gray-200">
        <div className="text-2xl font-bold">
          Spark!Bytes
        </div>
        <div className="flex items-center space-x-4">
          {/* 这里可以用 Link 组件，也可以用 antd 的 Menu */}
          <Link href="/about" className="text-gray-700 hover:text-gray-900">
            About
          </Link>
          <Link href="/login" className="text-white hover:text-gray-900">
            Sign In
          </Link>
          <Link href="/signup">
            <Button type="primary" className="font-semibold">
              Sign Up
            </Button>
          </Link>
        </div>
      </nav>

      {/* 下面的内容就是页面的主体内容 */}
      <HeaderSection />
      <SectionOne />
      <SectionTwo />
      <SectionThree />
      <FooterSection />
    </main>
  );
}

// 下面我们把其他 Section 拆成组件
function HeaderSection() {
  return (
    <header
      className="
        flex flex-col items-center justify-center
        text-center
        bg-gradient-to-r from-blue-400 to-green-400
        px-4 py-20
      "
    >
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
        Free Food. No Strings Attached.
      </h1>
      <p className="text-lg md:text-xl text-white max-w-2xl mb-6">
        Spark Bytes helps BU students find free food on campus. 
        Food on demand at no (extra) cost to you.
      </p>
      <Link href="/join">
        <Button type="default" className="bg-white text-gray-800 font-semibold hover:bg-gray-100">
          Join Now
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
        {/* 这里可以放三步流程，比如“Post Events”、“Browse & Find”、“Reduce Waste” */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Post Events</h3>
          <p className="text-gray-700">
            BU community members can share upcoming events with free food.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Browse & Find</h3>
          <p className="text-gray-700">
            Easily discover events and free food spots around campus.
          </p>
        </div>
        <div>
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
        <Link href="/about">
          <Button type="primary" className="font-semibold">
            Learn More
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
      {/* 这里可以放一些统计数字 */}
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
    <footer className="border-t border-gray-200 px-4 py-4 text-center text-sm text-gray-600">
      Made With Love By Team Ditto
    </footer>
  );
}