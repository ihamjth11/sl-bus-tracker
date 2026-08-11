import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import './Explore.css';

const icon = (children) => (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {children}
  </svg>
);

const IconBack = icon(
  <path d="M15 5L8 12L15 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
);

const IconSun = icon(
  <>
    <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
    <path d="M12 2.5V4.5M12 19.5V21.5M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M2.5 12H4.5M19.5 12H21.5M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </>
);

const IconMoon = icon(
  <path d="M20.5 14.2C19.3 14.7 18 15 16.6 15C11.3 15 7 10.7 7 5.4C7 4 7.3 2.7 7.8 1.5C4.4 2.9 2 6.2 2 10.1C2 15.3 6.2 19.5 11.4 19.5C15.3 19.5 18.6 17.1 20 13.7C20.2 13.9 20.4 14.1 20.5 14.2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
);

const IconBus = icon(
  <>
    <path d="M4 16V6.6C4 5.2 5.2 4.3 7 4.1C9 3.9 15 3.9 17 4.1C18.8 4.3 20 5.2 20 6.6V16C20 16.7 19.4 17.3 18.7 17.3H18.3C17.6 17.3 17 17.9 17 18.6V19C17 19.4 16.7 19.7 16.3 19.7H14.7C14.3 19.7 14 19.4 14 19V18.6C14 17.9 13.4 17.3 12.7 17.3H11.3C10.6 17.3 10 17.9 10 18.6V19C10 19.4 9.7 19.7 9.3 19.7H7.7C7.3 19.7 7 19.4 7 19V18.6C7 17.9 6.4 17.3 5.7 17.3H5.3C4.6 17.3 4 16.7 4 16Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M4 10.5H20" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="7.5" cy="14" r="0.9" fill="currentColor" />
    <circle cx="16.5" cy="14" r="0.9" fill="currentColor" />
  </>
);

const IconBed = icon(
  <>
    <path d="M3 18V6M3 13H21V18M3 13V10C3 9 3.9 8 5 8H11C12.1 8 13 9 13 10V13M15 8H19C20.1 8 21 9 21 10V13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="7" cy="10.5" r="1.3" stroke="currentColor" strokeWidth="1.4" />
  </>
);

const IconTicketExternal = icon(
  <>
    <path d="M14 4H19C19.6 4 20 4.4 20 5V10M20 5L11 14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17 13V18C17 19.1 16.1 20 15 20H6C4.9 20 4 19.1 4 18V9C4 7.9 4.9 7 6 7H11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </>
);

const CATEGORIES = [
  {
    id: 'ancient',
    label: 'Ancient Cities',
    accent: '#c2740a',
    places: [
      { name: 'Sigiriya', district: 'Matale', blurb: 'A 180m granite rock fortress with 5th-century frescoes and gardens at its base — a UNESCO World Heritage Site and one of the most photographed sights in the country.' },
      { name: 'Anuradhapura', district: 'Anuradhapura', blurb: "Sri Lanka's first ancient capital, with 2,000+ year old dagobas (stupas), the sacred Sri Maha Bodhi tree, and sprawling monastery ruins." },
      { name: 'Polonnaruwa', district: 'Polonnaruwa', blurb: 'The compact, well-preserved second ancient capital — easy to explore by bicycle in a day, with the famous Gal Vihara rock-cut Buddha statues.' },
      { name: 'Dambulla', district: 'Matale', blurb: 'Cave temple complex carved into a rock face, with over 150 Buddha statues and painted ceilings dating back more than 2,000 years.' },
    ],
  },
  {
    id: 'hills',
    label: 'Hill Country',
    accent: '#0f9d78',
    places: [
      { name: 'Kandy', district: 'Kandy', blurb: 'The cultural capital — home to the Temple of the Sacred Tooth Relic, a scenic lake, and the gateway to the hill country train line.' },
      { name: 'Ella', district: 'Badulla', blurb: 'Laid-back hill town famous for the Nine Arch Bridge, Little Adam\'s Peak, and tea-country views — a backpacker favorite.' },
      { name: 'Nuwara Eliya', district: 'Nuwara Eliya', blurb: '"Little England" — cool climate, rolling tea plantations, colonial-era buildings, and Sri Lanka\'s highest peaks nearby.' },
      { name: 'Haputale', district: 'Badulla', blurb: 'A quieter alternative to Ella, with dramatic escarpment views over the southern plains, especially at sunrise from Lipton\'s Seat.' },
    ],
  },
  {
    id: 'beaches',
    label: 'Beaches',
    accent: '#2b7fd1',
    places: [
      { name: 'Mirissa', district: 'Matara', blurb: 'Crescent-shaped beach known for whale watching (blue whales, Nov-Apr) and a lively beachfront strip of cafes.' },
      { name: 'Unawatuna', district: 'Galle', blurb: 'A sheltered, calm bay close to Galle Fort — popular for swimming, snorkeling, and easy beach access.' },
      { name: 'Arugam Bay', district: 'Ampara', blurb: "The east coast's premier surf town, with a laid-back backpacker scene and consistent right-hand point breaks." },
      { name: 'Trincomalee', district: 'Trincomalee', blurb: 'Deep natural harbour with Nilaveli and Uppuveli beaches nearby — clear water, snorkeling, and Pigeon Island National Park.' },
    ],
  },
  {
    id: 'wildlife',
    label: 'Wildlife',
    accent: '#a4460f',
    places: [
      { name: 'Yala National Park', district: 'Hambantota', blurb: 'One of the best places in the world to spot wild leopards, alongside elephants, sloth bears, and abundant birdlife.' },
      { name: 'Udawalawe', district: 'Ratnapura', blurb: "Reliable elephant sightings in open grassland — often easier viewing than Yala's denser jungle terrain." },
      { name: 'Minneriya', district: 'Polonnaruwa', blurb: 'Famous for "the Gathering" — hundreds of wild elephants congregating around the reservoir in the dry season (Jul-Oct).' },
      { name: 'Sinharaja Forest Reserve', district: 'Ratnapura', blurb: "Sri Lanka's last major rainforest, a UNESCO biosphere reserve rich in endemic birds and plant species." },
    ],
  },
];

export default function Explore() {
  const [theme, setTheme] = useState(() => localStorage.getItem('sl-bus-theme') || 'dark');
  const [activeCategory, setActiveCategory] = useState('ancient');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('sl-bus-theme', next);
  };

  const current = CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <div className="app explore-page">
      <div className="header">
        <Link to="/" className="back-link">
          <IconBack className="icon" />
          <span>Lankora</span>
        </Link>
        <div className="header-actions">
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? <IconSun className="icon" /> : <IconMoon className="icon" />}
          </button>
        </div>
      </div>

      <div className="hero">
        <h2>Explore <span>Sri Lanka</span></h2>
        <p>Discover where to go — then find the bus to get there.</p>
      </div>

      <div className="category-tabs">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            className={`category-tab ${activeCategory === c.id ? 'active' : ''}`}
            style={activeCategory === c.id ? { '--tab-accent': c.accent } : undefined}
            onClick={() => setActiveCategory(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="place-grid">
        {current.places.map((place, i) => (
          <div className="place-card" key={i} style={{ '--place-accent': current.accent }}>
            <div className="place-card-top">
              <span className="place-district">{place.district} District</span>
            </div>
            <h3 className="place-name">{place.name}</h3>
            <p className="place-blurb">{place.blurb}</p>
            <Link to={`/?to=${encodeURIComponent(place.name)}`} className="place-bus-btn">
              <IconBus className="icon-xs" /> Find Bus Here
            </Link>
          </div>
        ))}
      </div>

      <div className="booking-section">
        <p className="quick-title">Planning your trip</p>
        <div className="booking-cards">
          <a href="https://1315.lk" target="_blank" rel="noopener noreferrer" className="booking-card">
            <IconTicketExternal className="icon" />
            <div>
              <strong>Reserve intercity bus seats</strong>
              <small>Official SLTB booking — 1315.lk</small>
            </div>
          </a>
          <div className="booking-card disabled">
            <IconBed className="icon" />
            <div>
              <strong>Hotels & villas</strong>
              <small>Coming soon</small>
            </div>
          </div>
        </div>
      </div>

      <p className="explore-footer">Part of <Link to="/">Lankora</Link> — bus routes, fares, and timings across all 25 districts.</p>
    </div>
  );
}