'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div>
      <nav>
        <div>
          <Link href="/about">About</Link>
          <Link href="/login">Sign In</Link>
          <Link href="/signup">Sign Up</Link>
        </div>
      </nav>
      <h1>Welcome to Spark!Bytes</h1>
      <p>Your one-stop portal for events, dashboards, and more.</p>
    </div>
  );
}
