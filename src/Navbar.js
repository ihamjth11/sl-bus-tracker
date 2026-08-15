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

const IconBus = icon(
  <>
    <path d="M4 16V6.6C4 5.2 5.2 4.3 7 4.1C9 3.9 15 3.9 17 4.1C18.8 4.3 20 5.2 20 6.6V16C20 16.7 19.4 17.3 18.7 17.3H18.3C17.6 17.3 17 17.9 17 18.6V19C17 19.4 16.7 19.7 16.3 19.7H14.7C14.3 19.7 14 19.4 14 19V18.6C14 17.9 13.4 17.3 12.7 17.3H11.3C10.6 17.3 10 17.9 10 18.6V19C10 19.4 9.7 19.7 9.3 19.7H7.7C7.3 19.7 7 19.4 7 19V18.6C7 17.9 6.4 17.3 5.7 17.3H5.3C4.6 17.3 4 16.7 4 16Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M4 10.5H20" stroke="currentColor" strokeWidth="1.4" />
  </>
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

const NAV_ITEMS = [
  { to: '/', label: 'Home', Icon: IconHome, match: (p) => p === '/' },
  { to: '/track', label: 'Track', Icon: IconBus, match: (p) => p === '/track' },
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