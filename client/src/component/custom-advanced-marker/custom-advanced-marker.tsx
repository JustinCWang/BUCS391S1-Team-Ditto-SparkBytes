// app/map/custom-advanced-marker/custom-advanced-marker.tsx
'use client';

import React, { useState } from 'react';
import { AdvancedMarker } from '@vis.gl/react-google-maps';
import Link from 'next/link';         
import './map.css';

interface Listing {
  id: string;
  position: { lat: number; lng: number; };
  title: string;
  images: string[];
  description: string;
  code: string;
}

export function CustomMarker({ listing }: { listing: Listing }) {
  const [isActive, setActive] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setActive(a => !a);
  };

  return (
    <AdvancedMarker position={listing.position}>
      <div
        className="custom-marker-container"
        style={{ zIndex: isActive ? 999 : undefined }}
        onClick={handleClick}
      >
        {isActive ? (
          <div className="marker-popup-card">
            <div className="popup-images">
              {listing.images.map((src, i) => (
                <img key={i} src={src} alt={`${listing.title}-${i}`} />
              ))}
            </div>
            <div className="popup-content">
              <h3>{listing.title}</h3>
              <p>{listing.description}</p>
              <p className="popup-link">
                <Link href={`/events?location=${listing.code}`}>
                  Click to view the corresponding event
                </Link>
              </p>
            </div>
          </div>
        ) : (
          <img
            src="https://maps.google.com/mapfiles/ms/icons/red-dot.png"
            alt={listing.title}
            className="marker-default-icon"
          />
        )}
      </div>
    </AdvancedMarker>
  );
}
