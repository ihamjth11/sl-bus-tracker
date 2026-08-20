import React, { useState, useRef, useEffect } from 'react';
import './NavMoreMenu.css';

const icon = (children) => (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {children}
  </svg>
);

const IconDots = icon(
  <>
    <circle cx="12" cy="5.5" r="1.6" fill="currentColor" />
    <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    <circle cx="12" cy="18.5" r="1.6" fill="currentColor" />
  </>
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

const IconGlobe = icon(
  <>
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M3.5 12H20.5M12 3.5C14.5 6 15.7 9 15.7 12C15.7 15 14.5 18 12 20.5C9.5 18 8.3 15 8.3 12C8.3 9 9.5 6 12 3.5Z" stroke="currentColor" strokeWidth="1.5" />
  </>
);

const IconCoin = icon(
  <>
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 7.5V16.5M9.5 9.5C9.5 8.4 10.6 7.5 12 7.5C13.4 7.5 14.5 8.3 14.5 9.3C14.5 11.3 9.5 10.7 9.5 12.7C9.5 13.7 10.6 14.5 12 14.5C13.4 14.5 14.5 13.6 14.5 12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </>
);

// Compact "more options" popover — single button trigger, click outside to close.
// Only renders the rows for props actually passed in, so it works whether the
// caller wants just a theme toggle or the full theme+language+currency set.
export default function NavMoreMenu({ theme, toggleTheme, uiLang, setUiLang, currency, setCurrency }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const langLabel = { en: 'English', si: 'Sinhala', ta: 'Tamil' };

  return (
    <div className="nav-more" ref={wrapRef}>
      <button
        className="nav-more-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-label="More options"
        aria-expanded={open}
      >
        <IconDots className="icon" />
      </button>

      {open && (
        <div className="nav-more-panel">
          {toggleTheme && (
            <button className="nav-more-row" onClick={toggleTheme}>
              <span className="nav-more-row-icon">
                {theme === 'dark' ? <IconSun className="icon-xs" /> : <IconMoon className="icon-xs" />}
              </span>
              <span className="nav-more-row-label">Theme</span>
              <span className="nav-more-row-value">{theme === 'dark' ? 'Dark' : 'Light'}</span>
            </button>
          )}

          {setUiLang && (
            <button
              className="nav-more-row"
              onClick={() => setUiLang((l) => (l === 'en' ? 'si' : l === 'si' ? 'ta' : 'en'))}
            >
              <span className="nav-more-row-icon"><IconGlobe className="icon-xs" /></span>
              <span className="nav-more-row-label">Language</span>
              <span className="nav-more-row-value">{langLabel[uiLang] || 'English'}</span>
            </button>
          )}

          {setCurrency && (
            <button
              className="nav-more-row"
              onClick={() => setCurrency((c) => (c === 'LKR' ? 'USD' : c === 'USD' ? 'EUR' : 'LKR'))}
            >
              <span className="nav-more-row-icon"><IconCoin className="icon-xs" /></span>
              <span className="nav-more-row-label">Currency</span>
              <span className="nav-more-row-value">{currency}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}