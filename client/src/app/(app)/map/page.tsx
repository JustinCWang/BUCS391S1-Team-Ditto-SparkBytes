'use client';
import React from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { CustomMarker } from '@/component/custom-advanced-marker/custom-advanced-marker';

const API_KEY = process.env.NEXT_PUBLIC_MAPS_API_KEY!;

const STATIC_LISTINGS = [
    {
      id: '1',
      position: { lat: 42.349895, lng: -71.103235 },
      code: 'CDS',
      title: 'BU CDS',
      images: [
        '/images/CDS.jpeg',
      ],
      description: `The Duan Family Center for Computing & Data Sciences (CDS), opened in 2019 at 8 St. Mary’s Street, is a state-of-the-art 12‑story vertical campus designed by Goettsch Partners to foster collaboration among CDS, Mathematics & Statistics, Computer Science, and the Hariri Institute for Computing & Data Sciences. Its transparent façade and spacious “CDS public square” on the lower levels create an open environment with classrooms, research labs, and technology incubators that connect faculty, students, and industry partners seamlessly.`,
    },
    {
      id: '2',
      position: { lat: 42.348579, lng: -71.102979 },
      code: 'ENG',
      title: 'BU ENG',
      images: [
        '/images/ENG.jpg',
      ],
      description: `The College of Engineering building at 110–112 Cummington Mall, originally constructed as a stable and garage by Henry C. Turner in 1900, now houses BU’s departments of Mechanical, Electrical & Computer, Materials Science & Engineering, and Systems Engineering. With modern lab spaces, classrooms, and the adjacent Engineering Product Innovation Center, ENG serves as the hub for convergent research in robotics, biomedical devices, and sustainable solutions at Boston University.`,
    },
    {
      id: '3',
      position: { lat: 42.3496964, lng: -71.1022403 },
      code: 'SAR',
      title: 'BU SAR',
      images: [
        '/images/SAR.jpg',
      ],
      description: `Boston University’s Sargent College of Health & Rehabilitation Sciences, located at 635 Commonwealth Avenue, was established in 1881 and offers programs in Physical Therapy, Occupational Therapy, Speech, Language & Hearing Sciences, and Nutrition. The building features LEED‑certified study spaces like the George K. Makechnie Study Center, on‑site clinical education centers, and an array of research labs that support over $14 million in annual rehabilitation science research funding.`,
    },
    {
      id: '4',
      position: { lat: 42.35094, lng: -71.108032 },
      code: 'MUG',
      title: 'BU MUG',
      images: [
        '/images/MUG.png',
      ],
      description: `Mugar Memorial Library, opened in 1966 and designed by Josep Lluís Sert, is BU’s primary humanities and social sciences library on the Charles River Campus, housing the majority of the university’s print collections and the Howard Gotlieb Archival Research Center. It offers diverse study environments—from the Martin Luther King Jr. Reading Room to the PAL Study Lounge—alongside services such as circulation, interlibrary loan, and digital media support for students and faculty.`,
    },
    {
      id: '5',
      position: { lat: 42.35039311294029, lng: -71.1072550752862 },
      code: 'STH',
      title: 'BU STH',
      images: [
        '/images/STH.jpg',
      ],
      description: `Boston University School of Theology, the oldest theological seminary of American Methodism, was founded in 1839 and has occupied its Gothic Revival building at 745 Commonwealth Avenue since 1950. The seminary offers M.Div., MTS, MSM, STM, D.Min., and Ph.D. programs, and houses centers like the Anna Howard Shaw Center and the Tom Porter Religion & Conflict Transformation Program within its historic lecture halls.`,
    },
    {
      id: '6',
      position: { lat: 42.348934, lng: -71.102438 },
      code: 'COM',
      title: 'BU COM',
      images: [
        '/images/COM.jpg',
      ],
      description: `The College of Communication building at 640 Commonwealth Avenue serves COM’s programs in Journalism, Film & Television, Advertising & Public Relations, Emerging Media, and Media Science, featuring state‑of‑the‑art editing suites, news studios, and collaborative classrooms. Its central lawn—adorned with Adirondack chairs and a Starbucks corner—encourages community interaction, while interior spaces host student media outlets, guest lectures, and hands‑on learning labs.`,
    },
    {
      id: '7',
      position: { lat: 42.350254, lng: -71.105461 },
      code: 'CAS',
      title: 'BU CAS',
      images: [
        '/images/CAS.jpg',
      ],
      description: `Boston University College of Arts & Sciences (CAS), located between 685–725 Commonwealth Avenue, is BU’s largest school with over 8,000 undergraduates, 2,000 graduate students, and more than 100 majors and interdisciplinary programs. Founded in 1873 as the College of Liberal Arts, CAS features a blend of historic and modern facilities that support extensive research centers, experiential learning, and interdisciplinary scholarship across the humanities, sciences, and social sciences.`,
    },
    {
      id: '8',
      position: { lat: 42.3501678, lng: -71.1117286 },
      code: 'FLR',
      title: 'BU FLR',
      images: [
        '/images/FLR.jpg',
      ],
      description: `The Fuller Building at 808 Commonwealth Avenue, designed by Albert Kahn in 1927 and acquired by BU in 1979, houses Metropolitan College’s Food & Wine programs with dedicated spaces like FLR 124 Demonstration Kitchen and FLR 131 Recipe Library. These AV‑equipped culinary labs and meeting rooms support hands‑on instruction, public tastings, and events for chefs, students, and the community.`,
    },
    {
      id: '9',
      position: { lat:42.351502, lng: -71.12104 },
      code: 'MET',
      title: 'BU MET',
      images: [
        '/images/MET.png',
      ],
      description: `The Metcalf Center for Science and Engineering (MET), opened in 1983 at 590–596 Commonwealth Avenue, was named for Arthur G.B. Metcalf to house CAS departments of Biology, Chemistry, and Physics in a modern atrium built from three repurposed industrial buildings. Its laboratories, classrooms, and offices support interdisciplinary research in biomedical science, environmental studies, and computational methods.`,
    },
    {
      id: '10',
      position: { lat:42.35022796439926, lng: -71.09701219319157 },
      code: 'KHC',
      title: 'BU KHC',
      images: [
        '/images/KHC.jpg',
      ],
      description: `Kilachand Honors College, BU’s honors program since 2010 and renamed in 2013 after Rajen Kilachand, occupies Kilachand Hall at 91 Bay State Road—a former Sheraton Hotel dating to 1923. The nine‑story residence offers suite‑style living with private baths, a ninth‑floor study lounge with Charles River views, and an integrated living‑learning community that blends rigorous academics with co‑curricular events.`,
    },
    {
      id: '11',
      position: { lat: 42.352112693238475, lng: -71.11770604382687 },
      code: 'AGG',
      title: 'BU AGG',
      images: [
        '/images/AGG.jpg',
      ],
      description: `Agganis Arena, opened in 2005 at 925 Commonwealth Avenue as part of the John Hancock Student Village, is a 290,000 sq ft multipurpose arena seating 6,150 for ice hockey and expandable to over 7,000 for concerts and events. Named after BU athlete Harry Agganis, the venue hosts Terrier hockey, major concerts, graduation ceremonies, and the annual CRASH-B World Indoor Rowing Championship with premium club amenities and advanced AV systems.`,
    },
    {
      id: '12',
      position: { lat: 42.35086706434192, lng: -71.10894760380761 },
      code: 'GSU',
      title: 'BU GSU',
      images: [
        '/images/GSU.jpg',
      ],
      description: `The George Sherman Union (GSU), a Brutalist student center designed by Josep Lluís Sert and opened in 1963 at 775 Commonwealth Avenue, is the hub of BU student life with a nine‑station food court, Metcalf Ballroom, multiple auditoriums, and study lounges. After a 2020 renovation, GSU now features updated dining options, improved wireless connectivity, and sustainable upgrades—serving as the prime venue for cultural, social, and recreational programs.`,
    },
  ];
  

export default function MapPage() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <APIProvider apiKey={API_KEY} libraries={['marker']}>
        <Map
          mapId="mapId"
          defaultZoom={16.4}
          defaultCenter={{ lat: 42.35098018973441,  lng: -71.1079882208585 }}
          disableDefaultUI
          style={{ width: '100%', height: '100%' }}
        >
          {STATIC_LISTINGS.map(listing => (
            <CustomMarker key={listing.id} listing={listing} />
          ))}
        </Map>
      </APIProvider>
    </div>
  );
}
