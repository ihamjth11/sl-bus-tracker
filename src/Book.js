import React, { useState, useEffect } from 'react';
import './App.css';
import './Book.css';
import Navbar from './Navbar';

const icon = (children) => (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {children}
  </svg>
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

const IconTicket = icon(
  <>
    <path d="M3 9.5C4.1 9.5 5 10.4 5 11.5C5 12.6 4.1 13.5 3 13.5V16.5C3 17.6 3.9 18.5 5 18.5H19C20.1 18.5 21 17.6 21 16.5V13.5C19.9 13.5 19 12.6 19 11.5C19 10.4 19.9 9.5 21 9.5V6.5C21 5.4 20.1 4.5 19 4.5H5C3.9 4.5 3 5.4 3 6.5V9.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M9.5 4.5V18.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2.4 2.4" />
  </>
);

const IconBed = icon(
  <>
    <path d="M3 18V6M3 13H21V18M3 13V10C3 9 3.9 8 5 8H11C12.1 8 13 9 13 10V13M15 8H19C20.1 8 21 9 21 10V13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="7" cy="10.5" r="1.3" stroke="currentColor" strokeWidth="1.4" />
  </>
);

const IconCar = icon(
  <>
    <path d="M4 16V12.5L5.8 7.8C6.1 7 6.8 6.5 7.6 6.5H16.4C17.2 6.5 17.9 7 18.2 7.8L20 12.5V16" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M4 16C4 16.6 4.4 17 5 17H6C6.6 17 7 16.6 7 16V15H17V16C17 16.6 17.4 17 18 17H19C19.6 17 20 16.6 20 16V12.5H4V16Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="7.5" cy="14" r="1" fill="currentColor" />
    <circle cx="16.5" cy="14" r="1" fill="currentColor" />
  </>
);

const IconTrain = icon(
  <>
    <path d="M5 11.5V6.5C5 4.6 6.6 3.5 9 3.3C10.5 3.15 13.5 3.15 15 3.3C17.4 3.5 19 4.6 19 6.5V11.5C19 13.2 17.6 14.5 16 14.5H8C6.4 14.5 5 13.2 5 11.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M5 10.5H19" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="8.3" cy="12.2" r="0.9" fill="currentColor" />
    <circle cx="15.7" cy="12.2" r="0.9" fill="currentColor" />
    <path d="M8.5 17.5L6.5 20.5M15.5 17.5L17.5 20.5M9.5 14.5V17.5H14.5V14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </>
);

const IconArrow = icon(
  <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
);

export default function Book() {
  const [theme, setTheme] = useState(() => localStorage.getItem('sl-bus-theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('sl-bus-theme', next);
  };

  return (
    <div className="app book-page">
      <Navbar
        extra={
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? <IconSun className="icon" /> : <IconMoon className="icon" />}
          </button>
        }
      />

      <div className="hero">
        <h2>Book Your <span>Trip</span></h2>
        <p>Bus seats, places to stay, and getting around — all your bookings in one place.</p>
      </div>

      <div className="book-options">
        <a
          href="https://1315.lk"
          target="_blank"
          rel="noopener noreferrer"
          className="book-option-card"
          style={{ '--book-accent': '#f0a83f' }}
        >
          <div className="book-option-icon">
            <IconTicket className="icon-lg" />
          </div>
          <div className="book-option-body">
            <h3>SLTB Bus Booking</h3>
            <p>Reserve intercity bus seats directly through the official Sri Lanka Transport Board booking site — 1315.lk.</p>
            <span className="book-option-cta">Book a seat <IconArrow className="icon-xs" /></span>
          </div>
        </a>

        <a
          href="https://seatreservation.railway.gov.lk/"
          target="_blank"
          rel="noopener noreferrer"
          className="book-option-card"
          style={{ '--book-accent': '#0f9d78' }}
        >
          <div className="book-option-icon">
            <IconTrain className="icon-lg" />
          </div>
          <div className="book-option-body">
            <h3>Train Booking</h3>
            <p>Reserve seats on Sri Lanka's scenic rail lines — including the Kandy-Ella hill country route — through the official Sri Lanka Railways site.</p>
            <span className="book-option-cta">Book a seat <IconArrow className="icon-xs" /></span>
          </div>
        </a>

        <a
          href="https://www.booking.com/searchresults.html?ss=Sri%20Lanka"
          target="_blank"
          rel="noopener noreferrer"
          className="book-option-card"
          style={{ '--book-accent': '#2b7fd1' }}
        >
          <div className="book-option-icon">
            <IconBed className="icon-lg" />
          </div>
          <div className="book-option-body">
            <h3>Hotels & Rooms</h3>
            <p>Find and book hotels, guesthouses, and villas across Sri Lanka through Booking.com.</p>
            <span className="book-option-cta">Find a room <IconArrow className="icon-xs" /></span>
          </div>
        </a>

        <div
          className="book-option-card disabled"
          style={{ '--book-accent': '#8a94a3' }}
        >
          <div className="book-option-icon">
            <IconTicket className="icon-lg" />
          </div>
          <div className="book-option-body">
            <h3>Private Bus Booking</h3>
            <p>Book seats on private intercity bus operators, in addition to SLTB services.</p>
            <span className="book-option-cta book-option-soon">Coming soon</span>
          </div>
        </div>

        <div
          className="book-option-card disabled"
          style={{ '--book-accent': '#8a94a3' }}
        >
          <div className="book-option-icon">
            <IconCar className="icon-lg" />
          </div>
          <div className="book-option-body">
            <h3>Car & Private Travel</h3>
            <p>Book a private car or driver for your trip across the island.</p>
            <span className="book-option-cta book-option-soon">Coming soon</span>
          </div>
        </div>
      </div>

      <p className="book-footer">Part of Lankora — bus routes, fares, and timings across all 25 districts.</p>
    </div>
  );
}