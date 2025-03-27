'use client';

import Link from 'next/link';
import '@ant-design/v5-patch-for-react-19';

export default function LandingPage() {
  return (
    <div>
      <nav className="nav">
        <div>
          <a href="/about">About</a>
          <a href="/login">Sign In</a>
          <a href="/signup">Sign Up</a>
        </div>
      </nav>
      
      <div className='content'>
      <section
    className="hero"
    style={{
      background: 'linear-gradient(to right,rgb(78, 169, 255),rgb(81, 210, 145))',
      padding: '4rem 2rem',
    }}
  >
      <h1 className="hero-title">Welcome to Spark!Bytes</h1>
      <p className="hero-subtitle">Your one-stop portal for events, dashboards, and more.</p>
      </section>
      </div>
    </div>
  );
}
