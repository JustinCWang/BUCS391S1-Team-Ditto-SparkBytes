// // app/map/custom-advanced-marker/custom-advanced-marker.tsx
// 'use client';

// import React, { useState } from 'react';
// import { AdvancedMarker } from '@vis.gl/react-google-maps';
// import Link from 'next/link';         
// import './map.css';

// interface Listing {
//   id: string;
//   position: { lat: number; lng: number; };
//   title: string;
//   images: string[];
//   description: string;
//   code: string;
// }

// export function CustomMarker({ listing }: { listing: Listing }) {
//   const [isActive, setActive] = useState(false);

//   const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
//     e.stopPropagation();
//     setActive(a => !a);
//   };

//   return (
//     <AdvancedMarker position={listing.position}>
//       <div
//         className="custom-marker-container"
//         style={{ zIndex: isActive ? 999 : undefined }}
//         onClick={handleClick}
//       >
//         {isActive ? (
//           <div className="marker-popup-card">
//             <div className="popup-images">
//               {listing.images.map((src, i) => (
//                 <img key={i} src={src} alt={`${listing.title}-${i}`} />
//               ))}
//             </div>
//             <div className="popup-content">
//               <h3>{listing.title}</h3>
//               <p>{listing.description}</p>
//               <p className="popup-link">
//                 <Link href={`/events?location=${listing.code}`}>
//                   Click to view the corresponding events
//                 </Link>
//               </p>
//             </div>
//           </div>
//         ) : (
//           <img
//             src="https://maps.google.com/mapfiles/ms/icons/red-dot.png"
//             alt={listing.title}
//             className="marker-default-icon"
//           />
//         )}
//       </div>
//     </AdvancedMarker>
//   );
// }

'use client';

import React, { useState } from 'react';
import {
  AdvancedMarker,
  InfoWindow
} from '@vis.gl/react-google-maps';
import Link from 'next/link';
import './map.css';

interface Listing {
  id: string;
  code: string;                      // building code, e.g. "ENG"
  position: { lat: number; lng: number; };
  title: string;
  images: string[];
  description: string;
}

export function CustomMarker({ listing }: { listing: Listing }) {
  const [isActive, setActive] = useState(false);

  return (
    <>
      {/* 1) The marker itself */}
      <AdvancedMarker position={listing.position}>
        <div
          className="custom-marker-container"
          onClick={(e) => {
            e.stopPropagation();         // prevent map click
            setActive(true);
          }}
        >
          <img
            src="https://maps.google.com/mapfiles/ms/icons/red-dot.png"
            alt={listing.title}
            className="marker-default-icon"
          />
        </div>
      </AdvancedMarker>

      {/* 2) The InfoWindow popup */}
      {isActive && (
        <InfoWindow
          position={listing.position}
          onCloseClick={() => setActive(false)}
        >
          <div className="marker-popup-card">
            <div className="popup-images">
              {listing.images.map((src, i) => (
                <img key={i} src={src} alt={`${listing.title} ${i+1}`} />
              ))}
            </div>
            <div className="popup-content">
              <h3>{listing.title}</h3>
              <p>{listing.description}</p>
              <p className="popup-link">
                <Link href={`/events?location=${listing.code}`}>
                  Click to view the corresponding events
                </Link>
              </p>
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
}// app/map/custom-advanced-marker/custom-advanced-marker.tsx


// 'use client';

// import React, { useState } from 'react';
// import {
//   AdvancedMarker,
//   InfoWindow
// } from '@vis.gl/react-google-maps';
// import Link from 'next/link';
// import './map.css';

// interface Listing {
//   id: string;
//   code: string;
//   position: { lat: number; lng: number; };
//   title: string;
//   images: string[];
//   description: string;
// }

// export function CustomMarker({ listing }: { listing: Listing }) {
//   const [isActive, setActive] = useState(false);

//   return (
//     <>
//       {/* Marker 本体 */}
//       <AdvancedMarker position={listing.position}>
//         <div
//           className="custom-marker-container"
//           onClick={e => {
//             e.stopPropagation();
//             setActive(true);
//           }}
//         >
//           <img
//             src="https://maps.google.com/mapfiles/ms/icons/red-dot.png"
//             alt={listing.title}
//             className="marker-default-icon"
//           />
//         </div>
//       </AdvancedMarker>

//       {/* InfoWindow 弹窗 */}
//       {isActive && (
//         <InfoWindow
//           position={listing.position}
//           onCloseClick={() => setActive(false)}
//           closeBoxURL=""              /* 直接作为 prop 传，不要用 options */
//           pixelOffset={{ height: -30 }} 
//         >
//           <div className="marker-popup-card">
//             <div className="popup-images">
//               {listing.images.map((src, i) => (
//                 <img key={i} src={src} alt={`${listing.title}-${i}`} />
//               ))}
//             </div>
//             <div className="popup-content">
//               <h3>{listing.title}</h3>
//               <p>{listing.description}</p>
//               <p className="popup-link">
//                 <Link href={`/events?location=${listing.code}`}>
//                   Click to view the corresponding events
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </InfoWindow>
//       )}
//     </>
//   );
// }
