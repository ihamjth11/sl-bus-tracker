import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const icon = (children) => (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {children}
  </svg>
);

const IconHome = icon(
  <path d="M4 11.5L12 4.5L20 11.5M6 10V19C6 19.6 6.4 20 7 20H10V15C10 14.4 10.4 14 11 14H13C13.6 14 14 14.4 14 15V20H17C17.6 20 18 19.6 18 19V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
);

const IconCompass = icon(
  <>
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
    <path d="M15 9L13 13L9 15L11 11L15 9Z" fill="currentColor" />
  </>
);

const IconBed = icon(
  <>
    <path d="M3 18V6M3 13H21V18M3 13V10C3 9 3.9 8 5 8H11C12.1 8 13 9 13 10V13M15 8H19C20.1 8 21 9 21 10V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="7" cy="10.5" r="1.2" stroke="currentColor" strokeWidth="1.3" />
  </>
);

// "Track" pill removed per user request — Home already links to /track via its
// own CTA, so this nav no longer duplicates it.
const NAV_ITEMS = [
  { to: '/', label: 'Home', Icon: IconHome, match: (p) => p === '/' },
  { to: '/explore', label: 'Explore', Icon: IconCompass, match: (p) => p === '/explore' },
  { to: '/#book', label: 'Book', Icon: IconBed, match: () => false },
];

export default function Navbar({ extra }) {
  const location = useLocation();

  return (
    <nav className="lankora-nav">
      <Link to="/" className="lankora-nav-brand">
        <img src="/logo-icon.png" alt="Lankora" className="lankora-nav-logo" />
        <span>Lankora</span>
      </Link>

      <div className="lankora-nav-links">
        {NAV_ITEMS.map(({ to, label, Icon, match }) => (
          <Link
            key={label}
            to={to}
            className={`lankora-nav-link ${match(location.pathname) ? 'active' : ''}`}
          >
            <Icon className="icon-xs" />
            <span>{label}</span>
          </Link>
        ))}
      </div>

      {extra && <div className="lankora-nav-extra">{extra}</div>}
    </nav>
  );
}