import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import './Home.css';
import Navbar from './Navbar';
import NavMoreMenu from './NavMoreMenu';
import TrustSection from './TrustSection';
import FeedbackWidget from './FeedbackWidget';
import HeroSlideshow from './HeroSlideshow';

const icon = (children) => (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {children}
  </svg>
);

const IconBus = icon(
  <>
    <path d="M4 16V6.6C4 5.2 5.2 4.3 7 4.1C9 3.9 15 3.9 17 4.1C18.8 4.3 20 5.2 20 6.6V16C20 16.7 19.4 17.3 18.7 17.3H18.3C17.6 17.3 17 17.9 17 18.6V19C17 19.4 16.7 19.7 16.3 19.7H14.7C14.3 19.7 14 19.4 14 19V18.6C14 17.9 13.4 17.3 12.7 17.3H11.3C10.6 17.3 10 17.9 10 18.6V19C10 19.4 9.7 19.7 9.3 19.7H7.7C7.3 19.7 7 19.4 7 19V18.6C7 17.9 6.4 17.3 5.7 17.3H5.3C4.6 17.3 4 16.7 4 16Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M4 10.5H20" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="7.5" cy="14" r="0.8" fill="currentColor" />
    <circle cx="16.5" cy="14" r="0.8" fill="currentColor" />
  </>
);

const IconCompass = icon(
  <>
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M15 9L13 13L9 15L11 11L15 9Z" fill="currentColor" />
  </>
);

const IconBed = icon(
  <>
    <path d="M3 18V6M3 13H21V18M3 13V10C3 9 3.9 8 5 8H11C12.1 8 13 9 13 10V13M15 8H19C20.1 8 21 9 21 10V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="7" cy="10.5" r="1.2" stroke="currentColor" strokeWidth="1.3" />
  </>
);

// Stable Wikimedia Commons URLs — same source as the Explore carousel

const FEATURES = [
  {
    to: '/track',
    accent: '#f0a83f',
    Icon: IconBus,
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kandy_lake.jpg',
    title: 'Track Buses',
    desc: 'Find routes, fares, and timings across all 25 districts of Sri Lanka — with live schedule search and an AI travel assistant.',
    cta: 'Find your bus',
  },
  {
    to: '/explore',
    accent: '#0f9d78',
    Icon: IconCompass,
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nine_Arches_Bridge.jpg',
    title: 'Explore Sri Lanka',
    desc: 'Ancient cities, hill country, beaches, wildlife, and hidden gems — discover where to go, then find the bus to get there.',
    cta: 'Discover places',
  },
  {
    to: '/#book',
    accent: '#2b7fd1',
    Icon: IconBed,
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Secret_beach_-_Mirissa_Sri_Lanka.jpg',
    title: 'Book Your Stay',
    desc: 'Reserve intercity bus seats and find hotels or villas near your destination — all from one trip planner.',
    cta: 'Plan your trip',
  },
];

export default function Home() {
  const [theme, setTheme] = useState(() => localStorage.getItem('sl-bus-theme') || 'light');
  const [uiLang, setUiLang] = useState(() => localStorage.getItem('sl-bus-lang') || 'en');
  const [currency, setCurrency] = useState(() => localStorage.getItem('sl-bus-currency') || 'LKR');

  useEffect(() => {
    localStorage.setItem('sl-bus-lang', uiLang);
  }, [uiLang]);

  useEffect(() => {
    localStorage.setItem('sl-bus-currency', currency);
  }, [currency]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('sl-bus-theme', next);
  };

  return (
    <div className="app home-page">
      <Navbar
        extra={
          <>
            <div className="badge">Live</div>
            <NavMoreMenu
              theme={theme}
              toggleTheme={toggleTheme}
              uiLang={uiLang}
              setUiLang={setUiLang}
              currency={currency}
              setCurrency={setCurrency}
            />
          </>
        }
      />

      <div
        className="home-hero home-hero-photo"
      >
        <HeroSlideshow />
        <div className="home-hero-overlay" />
        <div className="home-hero-content">
          <span className="home-eyebrow">Track · Travel · Explore</span>
          <h1>Your journey across <span>Sri Lanka</span> starts here</h1>
          <p>Real bus routes, real fares, real places — one app for getting around and discovering the island.</p>
          <div className="home-hero-actions">
            <Link to="/track" className="home-cta-primary">
              <IconBus className="icon-xs" /> Find a bus
            </Link>
            <Link to="/explore" className="home-cta-secondary">
              <IconCompass className="icon-xs" /> Explore places
            </Link>
          </div>
        </div>
      </div>

      <TrustSection />

      <div className="home-features" id="book">
        {FEATURES.map((f, i) => (
          <Link to={f.to} className="home-feature-card" key={i} style={{ '--feature-accent': f.accent }}>
            <div
              className="home-feature-photo"
              style={{ backgroundImage: `url(${f.image})` }}
            >
              <div className="home-feature-icon">
                <f.Icon className="icon" />
              </div>
            </div>
            <div className="home-feature-body">
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <span className="home-feature-cta">{f.cta} →</span>
            </div>
          </Link>
        ))}
      </div>

      <p className="home-footer">Lankora — built for Sri Lanka, by Sri Lanka.</p>

      <FeedbackWidget pageName="Home" />
    </div>
  );
}