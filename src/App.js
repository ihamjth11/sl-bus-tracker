import { searchLocations } from './locations';
import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const DARK_MAP_STYLES = [
  { elementType: "geometry", stylers: [{ color: "#131a22" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#f5a623" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#131a22" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#232e3a" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0e1319" }] },
];

const LIGHT_MAP_STYLES = [
  { elementType: "geometry", stylers: [{ color: "#f7f8fa" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#b45309" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#e2e6ea" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#dbe9f4" }] },
];

const icon = (children, extraProps = {}) => (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...extraProps} {...props}>
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

const IconPin = icon(
  <>
    <path d="M12 21.5C12 21.5 19 15.1 19 9.8C19 5.9 15.9 2.8 12 2.8C8.1 2.8 5 5.9 5 9.8C5 15.1 12 21.5 12 21.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <circle cx="12" cy="9.7" r="2.3" stroke="currentColor" strokeWidth="1.6" />
  </>
);

const IconFlag = icon(
  <>
    <path d="M6 21V4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M6 4.5C7.2 3.6 8.7 3.6 10 4.3C11.6 5.1 13.5 5.1 15 4.2C16 3.6 17.2 3.7 18 4.5V13C17.2 12.2 16 12.1 15 12.7C13.5 13.6 11.6 13.6 10 12.8C8.7 12.1 7.2 12.1 6 13V4.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  </>
);

const IconSwap = icon(
  <path d="M7 4V18M7 18L3.5 14.5M7 18L10.5 14.5M17 20V6M17 6L13.5 9.5M17 6L20.5 9.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
);

const IconHeart = ({ filled, ...rest }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
    <path d="M12 20.3C12 20.3 3.5 15.4 3.5 9.3C3.5 6.4 5.8 4.1 8.6 4.1C10.1 4.1 11.3 4.8 12 5.9C12.7 4.8 13.9 4.1 15.4 4.1C18.2 4.1 20.5 6.4 20.5 9.3C20.5 15.4 12 20.3 12 20.3Z"
      stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"
      fill={filled ? 'currentColor' : 'none'} />
  </svg>
);

const IconBus = icon(
  <>
    <path d="M4 16V6.6C4 5.2 5.2 4.3 7 4.1C9 3.9 15 3.9 17 4.1C18.8 4.3 20 5.2 20 6.6V16C20 16.7 19.4 17.3 18.7 17.3H18.3C17.6 17.3 17 17.9 17 18.6V19C17 19.4 16.7 19.7 16.3 19.7H14.7C14.3 19.7 14 19.4 14 19V18.6C14 17.9 13.4 17.3 12.7 17.3H11.3C10.6 17.3 10 17.9 10 18.6V19C10 19.4 9.7 19.7 9.3 19.7H7.7C7.3 19.7 7 19.4 7 19V18.6C7 17.9 6.4 17.3 5.7 17.3H5.3C4.6 17.3 4 16.7 4 16Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M4 10.5H20" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="7.5" cy="14" r="0.9" fill="currentColor" />
    <circle cx="16.5" cy="14" r="0.9" fill="currentColor" />
  </>
);

const IconSearch = icon(
  <>
    <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
    <path d="M20 20L16 16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </>
);

const IconTrending = icon(
  <path d="M3 17L9.5 10.5L13.5 14.5L21 7M21 7H15.5M21 7V12.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
);

const IconSparkle = icon(
  <path d="M12 3L13.6 8.6L19 10.2L13.6 11.8L12 17.4L10.4 11.8L5 10.2L10.4 8.6L12 3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
);

const IconLocate = icon(
  <>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
    <path d="M12 2.5V5.5M12 18.5V21.5M21.5 12H18.5M5.5 12H2.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </>
);

const IconTicket = icon(
  <>
    <path d="M3 9.5C4.1 9.5 5 10.4 5 11.5C5 12.6 4.1 13.5 3 13.5V16.5C3 17.6 3.9 18.5 5 18.5H19C20.1 18.5 21 17.6 21 16.5V13.5C19.9 13.5 19 12.6 19 11.5C19 10.4 19.9 9.5 21 9.5V6.5C21 5.4 20.1 4.5 19 4.5H5C3.9 4.5 3 5.4 3 6.5V9.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M9.5 4.5V18.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2.4 2.4" />
  </>
);

const IconClock = icon(
  <>
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
    <path d="M12 7.5V12L15 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </>
);

const busRoutes = {
  // ============ COLOMBO ROUTES ============
  "colombo-kandy": {
    normal: { bus: "No. 1", fare: "Rs. 500", duration: "3 hrs" },
    ac: { bus: "No. 1 - AC Intercity", fare: "Rs. 900", duration: "2.5 hrs" },
    timing: { first: "5:30 AM", last: "9:00 PM", frequency: "Every 15 mins" },
    stops: ["Colombo Fort", "Kelaniya", "Kadawatha", "Nittambuwa", "Kandy"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 7.2906, lng: 80.6337 }]
  },
  "colombo-galle": {
    normal: { bus: "No. 2-1", fare: "Rs. 580", duration: "2.5 hrs" },
    ac: { bus: "No. 2-1 - AC Intercity", fare: "Rs. 875", duration: "2 hrs" },
    timing: { first: "5:00 AM", last: "10:00 PM", frequency: "Every 20 mins" },
    stops: ["Colombo Fort", "Moratuwa", "Panadura", "Kalutara", "Galle"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.0535, lng: 80.2210 }]
  },
  "colombo-jaffna": {
    normal: { bus: "No. 15/87", fare: "Rs. 2,150", duration: "8 hrs" },
    ac: { bus: "No. 15/87 - AC Intercity", fare: "Rs. 2,860", duration: "7 hrs" },
    timing: { first: "6:00 AM", last: "8:00 PM", frequency: "Every 1 hour" },
    stops: ["Colombo Fort", "Kurunegala", "Anuradhapura", "Vavuniya", "Jaffna"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 9.6615, lng: 80.0255 }]
  },
  "colombo-negombo": {
    normal: { bus: "No. 4", fare: "Rs. 328", duration: "1.5 hrs" },
    ac: { bus: "No. 4 - AC", fare: "Rs. 710", duration: "1 hr" },
    timing: { first: "5:00 AM", last: "10:30 PM", frequency: "Every 10 mins" },
    stops: ["Colombo Fort", "Wattala", "Ja-Ela", "Negombo"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 7.2097, lng: 79.8350 }]
  },
  "colombo-matara": {
    normal: { bus: "No. 2", fare: "Rs. 870", duration: "3.5 hrs" },
    ac: { bus: "No. 2 - AC Intercity", fare: "Rs. 1,158", duration: "3 hrs" },
    timing: { first: "5:00 AM", last: "9:30 PM", frequency: "Every 20 mins" },
    stops: ["Colombo Fort", "Moratuwa", "Kalutara", "Galle", "Matara"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 5.9549, lng: 80.5550 }]
  },
  "colombo-anuradhapura": {
    normal: { bus: "No. 15-1-1", fare: "Rs. 1,194", duration: "5 hrs" },
    ac: { bus: "No. 15-1-1 - AC", fare: "Rs. 1,593", duration: "4 hrs" },
    timing: { first: "6:00 AM", last: "8:00 PM", frequency: "Every 30 mins" },
    stops: ["Colombo Fort", "Kurunegala", "Dambulla", "Anuradhapura"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 8.3114, lng: 80.4037 }]
  },
  "colombo-trincomalee": {
    normal: { bus: "No. 49", fare: "Rs. 1,391", duration: "7 hrs" },
    ac: { bus: "No. 49 - AC", fare: "Rs. 2,782", duration: "6 hrs" },
    timing: { first: "6:30 AM", last: "7:00 PM", frequency: "Every 1 hour" },
    stops: ["Colombo Fort", "Kurunegala", "Anuradhapura", "Trincomalee"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 8.5874, lng: 81.2152 }]
  },
  "colombo-batticaloa": {
    normal: { bus: "No. 48-1", fare: "Rs. 1,663", duration: "7.5 hrs" },
    ac: { bus: "No. 48-1 - AC Super Luxury", fare: "Rs. 3,326", duration: "6.5 hrs" },
    timing: { first: "6:00 AM", last: "7:30 PM", frequency: "Every 1 hour" },
    stops: ["Colombo Fort", "Kandy", "Polonnaruwa", "Batticaloa"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 7.7310, lng: 81.6747 }]
  },
  "colombo-hambantota": {
    normal: { bus: "No. 32-1", fare: "Rs. 1,292", duration: "5 hrs" },
    ac: { bus: "No. 32-1 - AC", fare: "Rs. 2,378", duration: "4 hrs" },
    timing: { first: "5:30 AM", last: "8:30 PM", frequency: "Every 30 mins" },
    stops: ["Colombo Fort", "Galle", "Matara", "Hambantota"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.1429, lng: 81.1212 }]
  },
  "colombo-badulla": {
    normal: { bus: "No. 21-6", fare: "Rs. 1,364", duration: "6 hrs" },
    ac: { bus: "No. 21-6 - AC", fare: "Rs. 1,844", duration: "5 hrs" },
    timing: { first: "6:00 AM", last: "7:00 PM", frequency: "Every 45 mins" },
    stops: ["Colombo Fort", "Ratnapura", "Welimada", "Badulla"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.9934, lng: 81.0550 }]
  },
  "colombo-nuwara eliya": {
    normal: { bus: "No. 2-10", fare: "Rs. 1,060", duration: "5 hrs" },
    ac: { bus: "No. 2-10 - AC", fare: "Rs. 1,413", duration: "4 hrs" },
    timing: { first: "6:00 AM", last: "7:30 PM", frequency: "Every 30 mins" },
    stops: ["Colombo Fort", "Kandy", "Nuwara Eliya"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.9497, lng: 80.7891 }]
  },
  "colombo-kurunegala": {
    normal: { bus: "No. 6", fare: "Rs. 500", duration: "2.5 hrs" },
    ac: { bus: "No. 6 - AC", fare: "Rs. 731", duration: "2 hrs" },
    timing: { first: "5:30 AM", last: "9:30 PM", frequency: "Every 15 mins" },
    stops: ["Colombo Fort", "Kelaniya", "Gampaha", "Kurunegala"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 7.4818, lng: 80.3609 }]
  },
  "colombo-ratnapura": {
    normal: { bus: "No. 98", fare: "Rs. 595", duration: "3 hrs" },
    ac: { bus: "No. 98 - AC", fare: "Rs. 802", duration: "2.5 hrs" },
    timing: { first: "5:30 AM", last: "9:00 PM", frequency: "Every 20 mins" },
    stops: ["Colombo Fort", "Avissawella", "Ratnapura"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.6828, lng: 80.3992 }]
  },
  "colombo-puttalam": {
    normal: { bus: "No. 7", fare: "Rs. 900", duration: "3.5 hrs" },
    ac: { bus: "No. 4-7 - AC", fare: "Rs. 960", duration: "3 hrs" },
    timing: { first: "6:00 AM", last: "8:00 PM", frequency: "Every 30 mins" },
    stops: ["Colombo Fort", "Negombo", "Chilaw", "Puttalam"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 8.0408, lng: 79.8394 }]
  },
  "colombo-ampara": {
    normal: { bus: "No. 38-4", fare: "Rs. 1,774", duration: "7 hrs" },
    ac: { bus: "No. 38-4 - AC", fare: "Rs. 2,379", duration: "6 hrs" },
    timing: { first: "6:30 AM", last: "6:30 PM", frequency: "Every 1 hour" },
    stops: ["Colombo Fort", "Kandy", "Polonnaruwa", "Ampara"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 7.2811, lng: 81.6747 }]
  },
  "colombo-matale": {
    normal: { bus: "No. 8", fare: "Rs. 601", duration: "3.5 hrs" },
    ac: { bus: "No. 8 - AC", fare: "Rs. 1,080", duration: "3 hrs" },
    timing: { first: "5:30 AM", last: "9:00 PM", frequency: "Every 20 mins" },
    stops: ["Colombo Fort", "Kandy", "Matale"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 7.4675, lng: 80.6234 }]
  },
  "colombo-vavuniya": {
    normal: { bus: "No. 15/87", fare: "Rs. 1,343", duration: "6 hrs" },
    ac: { bus: "No. 15/87 - AC", fare: "Rs. 1,789", duration: "5 hrs" },
    timing: { first: "6:00 AM", last: "7:00 PM", frequency: "Every 1 hour" },
    stops: ["Colombo Fort", "Kurunegala", "Anuradhapura", "Vavuniya"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 8.7514, lng: 80.4971 }]
  },
  "colombo-mannar": {
    normal: { bus: "No. 4", fare: "Rs. 1,643", duration: "7 hrs" },
    ac: { bus: "No. 4 - AC", fare: "Rs. 2,193", duration: "6 hrs" },
    timing: { first: "6:30 AM", last: "6:00 PM", frequency: "Every 2 hours" },
    stops: ["Colombo Fort", "Kurunegala", "Anuradhapura", "Mannar"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 8.9810, lng: 79.9044 }]
  },
  "colombo-monaragala": {
    normal: { bus: "No. 9", fare: "Rs. 1,093", duration: "6 hrs" },
    ac: { bus: "No. 9 - AC", fare: "Rs. 1,909", duration: "5.5 hrs" },
    timing: { first: "6:00 AM", last: "7:00 PM", frequency: "Every 1 hour" },
    stops: ["Colombo Fort", "Ratnapura", "Wellawaya", "Monaragala"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.8728, lng: 81.3507 }]
  },
  "colombo-polonnaruwa": {
    normal: { bus: "No. 48", fare: "Rs. 1,527", duration: "6 hrs" },
    ac: { bus: "No. 48 - AC", fare: "Rs. 3,050", duration: "5 hrs" },
    timing: { first: "6:00 AM", last: "7:30 PM", frequency: "Every 45 mins" },
    stops: ["Colombo Fort", "Kandy", "Dambulla", "Polonnaruwa"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 7.9403, lng: 81.0188 }]
  },
  "colombo-hatton": {
    normal: { bus: "No. 18-2", fare: "Rs. 711", duration: "4 hrs" },
    ac: { bus: "No. 18-2 - AC", fare: "Rs. 950", duration: "3.5 hrs" },
    timing: { first: "6:00 AM", last: "7:00 PM", frequency: "Every 1 hour" },
    stops: ["Colombo Fort", "Avissawella", "Ginigathena", "Hatton"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.8978, lng: 80.5951 }]
  },
  "colombo-kataragama": {
    normal: { bus: "No. 32", fare: "Rs. 1,542", duration: "6 hrs" },
    ac: { bus: "No. 32 - AC", fare: "Rs. 2,059", duration: "5.5 hrs" },
    timing: { first: "6:00 AM", last: "6:00 PM", frequency: "Every 2 hours" },
    stops: ["Colombo Fort", "Galle", "Matara", "Hambantota", "Kataragama"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.4149, lng: 81.3322 }]
  },
  "colombo-embilipitiya": {
    normal: { bus: "No. 3-1", fare: "Rs. 922", duration: "4 hrs" },
    ac: { bus: "No. 3-1 - AC", fare: "Rs. 1,231", duration: "3.5 hrs" },
    timing: { first: "6:00 AM", last: "7:00 PM", frequency: "Every 1 hour" },
    stops: ["Colombo Fort", "Ratnapura", "Pelmadulla", "Embilipitiya"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.3433, lng: 80.8490 }]
  },
  "colombo-chilaw": {
    normal: { bus: "No. 7", fare: "Rs. 500", duration: "2.5 hrs" },
    ac: { bus: "No. 7 - AC", fare: "Rs. 667", duration: "2 hrs" },
    timing: { first: "5:30 AM", last: "9:00 PM", frequency: "Every 20 mins" },
    stops: ["Colombo Fort", "Negombo", "Chilaw"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 7.5758, lng: 79.7953 }]
  },
  "colombo-dambulla": {
    normal: { bus: "No. 6", fare: "Rs. 500", duration: "3 hrs" },
    ac: { bus: "No. 6 - AC", fare: "Rs. 667", duration: "2.5 hrs" },
    timing: { first: "5:30 AM", last: "8:30 PM", frequency: "Every 30 mins" },
    stops: ["Colombo Fort", "Kurunegala", "Dambulla"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 7.8742, lng: 80.6511 }]
  },
  "colombo-welimada": {
    normal: { bus: "No. 2-12", fare: "Rs. 1,222", duration: "5.5 hrs" },
    ac: { bus: "No. 2-12 - AC", fare: "Rs. 1,628", duration: "5 hrs" },
    timing: { first: "6:00 AM", last: "6:30 PM", frequency: "Every 1 hour" },
    stops: ["Colombo Fort", "Ratnapura", "Welimada"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.9018, lng: 80.9171 }]
  },
  "colombo-kegalle": {
    normal: { bus: "No. 96", fare: "Rs. 375", duration: "2 hrs" },
    ac: { bus: "No. 96 - AC", fare: "Rs. 500", duration: "1.5 hrs" },
    timing: { first: "5:30 AM", last: "9:30 PM", frequency: "Every 15 mins" },
    stops: ["Colombo Fort", "Avissawella", "Kegalle"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 7.2513, lng: 80.3464 }]
  },
  "colombo-gampaha": {
    normal: { bus: "No. 5", fare: "Rs. 164", duration: "1 hr" },
    ac: { bus: "No. 5 - AC", fare: "Rs. 219", duration: "45 mins" },
    timing: { first: "5:00 AM", last: "10:30 PM", frequency: "Every 5 mins" },
    stops: ["Colombo Fort", "Wattala", "Ja-Ela", "Gampaha"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 7.0873, lng: 80.0144 }]
  },
  "colombo-kalutara": {
    normal: { bus: "No. 2", fare: "Rs. 219", duration: "1.5 hrs" },
    ac: { bus: "No. 2 - AC", fare: "Rs. 292", duration: "1 hr" },
    timing: { first: "5:00 AM", last: "10:00 PM", frequency: "Every 10 mins" },
    stops: ["Colombo Fort", "Moratuwa", "Panadura", "Kalutara"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.5854, lng: 79.9607 }]
  },
  "colombo-horana": {
    normal: { bus: "No. 98", fare: "Rs. 219", duration: "1.5 hrs" },
    ac: { bus: "No. 98 - AC", fare: "Rs. 292", duration: "1 hr" },
    timing: { first: "5:30 AM", last: "9:30 PM", frequency: "Every 15 mins" },
    stops: ["Colombo Fort", "Panadura", "Horana"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.7153, lng: 80.0615 }]
  },
  "colombo-avissawella": {
    normal: { bus: "No. 96", fare: "Rs. 273", duration: "1.5 hrs" },
    ac: { bus: "No. 96 - AC", fare: "Rs. 364", duration: "1 hr" },
    timing: { first: "5:30 AM", last: "9:30 PM", frequency: "Every 15 mins" },
    stops: ["Colombo Fort", "Hanwella", "Avissawella"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.9497, lng: 80.2089 }]
  },
  "colombo-kilinochchi": {
    normal: { bus: "No. 15/87", fare: "Rs. 1,744", duration: "8.5 hrs" },
    ac: { bus: "No. 15/87 - AC", fare: "Rs. 2,330", duration: "7.5 hrs" },
    timing: { first: "6:00 AM", last: "6:00 PM", frequency: "Every 2 hours" },
    stops: ["Colombo Fort", "Anuradhapura", "Vavuniya", "Kilinochchi"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 9.3803, lng: 80.3770 }]
  },
  "colombo-mullaitivu": {
    normal: { bus: "No. 15/82", fare: "Rs. 1,886", duration: "9 hrs" },
    ac: { bus: "No. 15/82 - AC", fare: "Rs. 2,519", duration: "8 hrs" },
    timing: { first: "6:00 AM", last: "5:30 PM", frequency: "Every 2 hours" },
    stops: ["Colombo Fort", "Anuradhapura", "Vavuniya", "Mullaitivu"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 9.2671, lng: 80.8128 }]
  },
  "colombo-tangalle": {
    normal: { bus: "No. 32-4", fare: "Rs. 1,080", duration: "4.5 hrs" },
    ac: { bus: "No. 32-4 - AC", fare: "Rs. 1,442", duration: "4 hrs" },
    timing: { first: "6:00 AM", last: "7:30 PM", frequency: "Every 1 hour" },
    stops: ["Colombo Fort", "Galle", "Matara", "Tangalle"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.0249, lng: 80.7977 }]
  },
  "colombo-ambalangoda": {
    normal: { bus: "No. 2-3", fare: "Rs. 500", duration: "2 hrs" },
    ac: { bus: "No. 2-3 - AC", fare: "Rs. 667", duration: "1.5 hrs" },
    timing: { first: "5:30 AM", last: "9:00 PM", frequency: "Every 20 mins" },
    stops: ["Colombo Fort", "Moratuwa", "Kalutara", "Ambalangoda"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.2357, lng: 80.0549 }]
  },
  "colombo-hikkaduwa": {
    normal: { bus: "No. 2-1", fare: "Rs. 525", duration: "2 hrs" },
    ac: { bus: "No. 2-1 - AC", fare: "Rs. 700", duration: "1.5 hrs" },
    timing: { first: "5:30 AM", last: "9:00 PM", frequency: "Every 20 mins" },
    stops: ["Colombo Fort", "Moratuwa", "Kalutara", "Hikkaduwa"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.1399, lng: 80.1038 }]
  },
  "colombo-ella": {
    normal: { bus: "No. 98-1", fare: "Rs. 1,411", duration: "6.5 hrs" },
    ac: { bus: "No. 98-1 - AC", fare: "Rs. 1,883", duration: "6 hrs" },
    timing: { first: "6:00 AM", last: "6:30 PM", frequency: "Every 2 hours" },
    stops: ["Colombo Fort", "Ratnapura", "Welimada", "Ella"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.8667, lng: 81.0466 }]
  },
  "colombo-bandarawela": {
    normal: { bus: "No. 98-1", fare: "Rs. 1,356", duration: "6 hrs" },
    ac: { bus: "No. 98-1 - AC", fare: "Rs. 1,810", duration: "5.5 hrs" },
    timing: { first: "6:00 AM", last: "6:30 PM", frequency: "Every 2 hours" },
    stops: ["Colombo Fort", "Ratnapura", "Welimada", "Bandarawela"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.8308, lng: 80.9886 }]
  },
  "colombo-haputale": {
    normal: { bus: "No. 98-1", fare: "Rs. 1,300", duration: "5.5 hrs" },
    ac: { bus: "No. 98-1 - AC", fare: "Rs. 1,735", duration: "5 hrs" },
    timing: { first: "6:00 AM", last: "6:30 PM", frequency: "Every 2 hours" },
    stops: ["Colombo Fort", "Ratnapura", "Haputale"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.7697, lng: 80.9556 }]
  },
  "colombo-mahiyanganaya": {
    normal: { bus: "No. 38-1", fare: "Rs. 1,142", duration: "5 hrs" },
    ac: { bus: "No. 38-1 - AC", fare: "Rs. 1,524", duration: "4.5 hrs" },
    timing: { first: "6:00 AM", last: "6:00 PM", frequency: "Every 2 hours" },
    stops: ["Colombo Fort", "Kandy", "Mahiyanganaya"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 7.3280, lng: 81.0008 }]
  },
  "colombo-tissamaharama": {
    normal: { bus: "No. 32-7", fare: "Rs. 1,400", duration: "5.5 hrs" },
    ac: { bus: "No. 32-7 - AC", fare: "Rs. 1,868", duration: "5 hrs" },
    timing: { first: "6:00 AM", last: "6:00 PM", frequency: "Every 2 hours" },
    stops: ["Colombo Fort", "Galle", "Matara", "Hambantota", "Tissamaharama"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.2864, lng: 81.2875 }]
  },
  "colombo-sigiriya": {
    normal: { bus: "No. 6", fare: "Rs. 545", duration: "3.5 hrs" },
    ac: { bus: "No. 6 - AC", fare: "Rs. 727", duration: "3 hrs" },
    timing: { first: "6:00 AM", last: "7:00 PM", frequency: "Every 1 hour" },
    stops: ["Colombo Fort", "Kurunegala", "Dambulla", "Sigiriya"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 7.9572, lng: 80.7603 }]
  },
  "colombo-panadura": {
    normal: { bus: "No. 2", fare: "Rs. 109", duration: "45 mins" },
    ac: { bus: "No. 2 - AC", fare: "Rs. 146", duration: "35 mins" },
    timing: { first: "5:00 AM", last: "11:00 PM", frequency: "Every 5 mins" },
    stops: ["Colombo Fort", "Moratuwa", "Panadura"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.7131, lng: 79.9042 }]
  },
  "colombo-moratuwa": {
    normal: { bus: "No. 2", fare: "Rs. 82", duration: "30 mins" },
    ac: { bus: "No. 2 - AC", fare: "Rs. 109", duration: "25 mins" },
    timing: { first: "5:00 AM", last: "11:00 PM", frequency: "Every 5 mins" },
    stops: ["Colombo Fort", "Dehiwala", "Moratuwa"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.7730, lng: 79.8814 }]
  },
  "colombo-ja-ela": {
    normal: { bus: "No. 4", fare: "Rs. 109", duration: "45 mins" },
    ac: { bus: "No. 4 - AC", fare: "Rs. 146", duration: "35 mins" },
    timing: { first: "5:00 AM", last: "11:00 PM", frequency: "Every 5 mins" },
    stops: ["Colombo Fort", "Wattala", "Ja-Ela"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 7.0746, lng: 79.8916 }]
  },
  "colombo-katunayake": {
    normal: { bus: "No. 4", fare: "Rs. 164", duration: "1 hr" },
    ac: { bus: "No. 4 - AC", fare: "Rs. 219", duration: "45 mins" },
    timing: { first: "4:30 AM", last: "11:00 PM", frequency: "Every 10 mins" },
    stops: ["Colombo Fort", "Wattala", "Ja-Ela", "Katunayake"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 7.1696, lng: 79.8845 }]
  },
  "colombo-kadawatha": {
    normal: { bus: "No. 1", fare: "Rs. 82", duration: "30 mins" },
    ac: { bus: "No. 1 - AC", fare: "Rs. 109", duration: "25 mins" },
    timing: { first: "5:00 AM", last: "10:30 PM", frequency: "Every 5 mins" },
    stops: ["Colombo Fort", "Kelaniya", "Kadawatha"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.9956, lng: 79.9563 }]
  },
  "colombo-dehiwala": {
    normal: { bus: "No. 2", fare: "Rs. 55", duration: "20 mins" },
    ac: { bus: "No. 2 - AC", fare: "Rs. 73", duration: "15 mins" },
    timing: { first: "5:00 AM", last: "11:00 PM", frequency: "Every 3 mins" },
    stops: ["Colombo Fort", "Dehiwala"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.8517, lng: 79.8647 }]
  },

  // Route 138, verified stop sequence (routemaster.lk / ceylonlanka.info): Pettah - Nugegoda -
  // Maharagama - Pannipitiya - Kottawa - Homagama, one of Colombo's busiest suburban corridors.
  // Fares/frequency estimated by calibrating against this app's own colombo-kadawatha rate (Rs/km) —
  // no published city-route fare table found, so flagged (est.).
  "colombo-nugegoda": {
    normal: { bus: "No. 138", fare: "Rs. 50 (est.)", duration: "30 mins" },
    ac: { bus: "No. 138 - AC", fare: "Rs. 65 (est.)", duration: "25 mins" },
    timing: { first: "5:00 AM", last: "10:30 PM", frequency: "Every 10 mins (approx.)" },
    stops: ["Colombo Fort", "Thummulla", "Kirillapone", "Nugegoda"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.8649, lng: 79.8997 }]
  },
  "colombo-maharagama": {
    normal: { bus: "No. 138", fare: "Rs. 90 (est.)", duration: "45 mins" },
    ac: { bus: "No. 138 - AC", fare: "Rs. 120 (est.)", duration: "35 mins" },
    timing: { first: "5:00 AM", last: "10:30 PM", frequency: "Every 10 mins (approx.)" },
    stops: ["Colombo Fort", "Nugegoda", "Delkanda", "Navinna", "Maharagama"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.8481, lng: 79.9267 }]
  },
  "colombo-homagama": {
    normal: { bus: "No. 138", fare: "Rs. 130 (est.)", duration: "1 hr" },
    ac: { bus: "No. 138 - AC", fare: "Rs. 170 (est.)", duration: "45 mins" },
    timing: { first: "5:00 AM", last: "10:30 PM", frequency: "Every 15 mins (approx.)" },
    stops: ["Colombo Fort", "Nugegoda", "Maharagama", "Pannipitiya", "Kottawa", "Homagama"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.8447, lng: 80.0025 }]
  },
  // Route 123, confirmed via Wikipedia (Rukmale article cross-reference).
  "colombo-athurugiriya": {
    normal: { bus: "No. 123", fare: "Rs. 100 (est.)", duration: "50 mins" },
    ac: { bus: "No. 123 - AC", fare: "Rs. 130 (est.)", duration: "40 mins" },
    timing: { first: "5:00 AM", last: "10:00 PM", frequency: "Every 15 mins (approx.)" },
    stops: ["Colombo Fort", "Rajagiriya", "Kottawa", "Athurugiriya"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.8747, lng: 79.9764 }]
  },

  // Route 177, verified stop sequence (routemaster.lk): Kollupitiya - Borella - Rajagiriya -
  // Welikada - Battaramulla - Koswatta - Thalangama - Malabe - Kaduwela.
  "colombo-rajagiriya": {
    normal: { bus: "No. 177", fare: "Rs. 35 (est.)", duration: "20 mins" },
    ac: { bus: "No. 177 - AC", fare: "Rs. 45 (est.)", duration: "15 mins" },
    timing: { first: "5:00 AM", last: "10:30 PM", frequency: "Every 10 mins (approx.)" },
    stops: ["Colombo Fort", "Borella", "Rajagiriya"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.9096, lng: 79.8912 }]
  },
  "colombo-battaramulla": {
    normal: { bus: "No. 177", fare: "Rs. 45 (est.)", duration: "30 mins" },
    ac: { bus: "No. 177 - AC", fare: "Rs. 60 (est.)", duration: "25 mins" },
    timing: { first: "5:00 AM", last: "10:30 PM", frequency: "Every 10 mins (approx.)" },
    stops: ["Colombo Fort", "Borella", "Rajagiriya", "Welikada", "Battaramulla"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.9017, lng: 79.9192 }]
  },
  "colombo-malabe": {
    normal: { bus: "No. 177", fare: "Rs. 65 (est.)", duration: "45 mins" },
    ac: { bus: "No. 177 - AC", fare: "Rs. 85 (est.)", duration: "35 mins" },
    timing: { first: "5:00 AM", last: "10:30 PM", frequency: "Every 15 mins (approx.)" },
    stops: ["Colombo Fort", "Rajagiriya", "Battaramulla", "Koswatta", "Thalangama", "Malabe"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.9147, lng: 79.9722 }]
  },
  // Route 107, verified (autoslanka.com / ceylonlanka.info): Elakanda - Wattala - Peliyagoda -
  // Old Kelani Bridge - Bloemendhal - Pettah - Fort.
  "colombo-wattala": {
    normal: { bus: "No. 107", fare: "Rs. 55 (est.)", duration: "30 mins" },
    ac: { bus: "No. 107 - AC", fare: "Rs. 70 (est.)", duration: "25 mins" },
    timing: { first: "5:00 AM", last: "10:30 PM", frequency: "Every 10 mins (approx.)" },
    stops: ["Colombo Fort", "Peliyagoda", "Wattala"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.9894, lng: 79.8919 }]
  },
  // Route 135, verified — multiple independent rider reviews (routemaster.lk) confirm ~15 min
  // Borella-Kelaniya and buses "once every four minutes", among Colombo's fastest/most frequent routes.
  "colombo-kelaniya": {
    normal: { bus: "No. 135", fare: "Rs. 50 (est.)", duration: "30 mins" },
    ac: { bus: "No. 135 - AC", fare: "Rs. 65 (est.)", duration: "25 mins" },
    timing: { first: "5:00 AM", last: "10:30 PM", frequency: "Every 4 mins" },
    stops: ["Colombo Fort", "Borella", "Peliyagoda", "Kelaniya"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.9553, lng: 79.9217 }]
  },
  // Route 120, verified (ceylonlanka.info): Pettah - ... - Kohuwala - Rattanapitiya -
  // Boralesgamuwa - Piliyandala - Kesbewa - ... - Horana.
  "colombo-piliyandala": {
    normal: { bus: "No. 120", fare: "Rs. 80 (est.)", duration: "50 mins" },
    ac: { bus: "No. 120 - AC", fare: "Rs. 105 (est.)", duration: "40 mins" },
    timing: { first: "5:00 AM", last: "10:00 PM", frequency: "Every 10 mins (approx.)" },
    stops: ["Colombo Fort", "Kohuwala", "Boralesgamuwa", "Piliyandala"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.8006, lng: 79.9228 }]
  },
  "colombo-boralesgamuwa": {
    normal: { bus: "No. 120", fare: "Rs. 60 (est.)", duration: "40 mins" },
    ac: { bus: "No. 120 - AC", fare: "Rs. 80 (est.)", duration: "30 mins" },
    timing: { first: "5:00 AM", last: "10:00 PM", frequency: "Every 10 mins (approx.)" },
    stops: ["Colombo Fort", "Kohuwala", "Boralesgamuwa"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.8394, lng: 79.9014 }]
  },

  // ============ KANDY ROUTES ============
  // Route 654, well-documented: Torrington bus stand, Kandy -> Digana (35 min) -> Teldeniya (50 min),
  // buses every 5 minutes (multiple independent sources agree). Duration/frequency solidly sourced.
  "kandy-digana": {
    normal: { bus: "No. 654", fare: "Rs. 45 (est.)", duration: "35 mins" },
    ac: { bus: "No. 654 - AC", fare: "Rs. 90 (est.)", duration: "30 mins" },
    timing: { first: "5:30 AM", last: "9:30 PM", frequency: "Every 5 mins" },
    stops: ["Kandy", "Kundasale", "Digana"],
    coords: [{ lat: 7.2906, lng: 80.6337 }, { lat: 7.2833, lng: 80.7167 }]
  },
  "kandy-teldeniya": {
    normal: { bus: "No. 654", fare: "Rs. 90 (est.)", duration: "50 mins" },
    ac: { bus: "No. 654 - AC", fare: "Rs. 175 (est.)", duration: "40 mins" },
    timing: { first: "5:30 AM", last: "9:30 PM", frequency: "Every 5 mins" },
    stops: ["Kandy", "Kundasale", "Digana", "Teldeniya"],
    coords: [{ lat: 7.2906, lng: 80.6337 }, { lat: 7.3167, lng: 80.7500 }]
  },
  // Route 722, confirmed (ceylonlanka.info route directory).
  "kandy-kundasale": {
    normal: { bus: "No. 722", fare: "Rs. 34 (est.)", duration: "20 mins" },
    ac: { bus: "No. 722 - AC", fare: "Rs. 60 (est.)", duration: "15 mins" },
    timing: { first: "5:30 AM", last: "9:30 PM", frequency: "Every 10 mins (approx.)" },
    stops: ["Kandy", "Kundasale"],
    coords: [{ lat: 7.2906, lng: 80.6337 }, { lat: 7.2953, lng: 80.6714 }]
  },
  // Route 718, confirmed (ceylonlanka.info route directory).
  "kandy-gampola": {
    normal: { bus: "No. 718", fare: "Rs. 70 (est.)", duration: "40 mins" },
    ac: { bus: "No. 718 - AC", fare: "Rs. 140 (est.)", duration: "30 mins" },
    timing: { first: "5:00 AM", last: "9:30 PM", frequency: "Every 15 mins (approx.)" },
    stops: ["Kandy", "Peradeniya", "Gampola"],
    coords: [{ lat: 7.2906, lng: 80.6337 }, { lat: 7.1647, lng: 80.5736 }]
  },
  // Route 725, confirmed (ceylonlanka.info route directory).
  "kandy-nawalapitiya": {
    normal: { bus: "No. 725", fare: "Rs. 125 (est.)", duration: "1 hr" },
    ac: { bus: "No. 725 - AC", fare: "Rs. 250 (est.)", duration: "45 mins" },
    timing: { first: "5:00 AM", last: "8:30 PM", frequency: "Every 20 mins (approx.)" },
    stops: ["Kandy", "Peradeniya", "Gampola", "Nawalapitiya"],
    coords: [{ lat: 7.2906, lng: 80.6337 }, { lat: 7.0528, lng: 80.5347 }]
  },
  // Route 729, confirmed (ceylonlanka.info route directory).
  "kandy-katugastota": {
    normal: { bus: "No. 729", fare: "Rs. 34 (est.)", duration: "15 mins" },
    ac: { bus: "No. 729 - AC", fare: "Rs. 45 (est.)", duration: "10 mins" },
    timing: { first: "5:00 AM", last: "10:00 PM", frequency: "Every 5 mins (approx.)" },
    stops: ["Kandy", "Katugastota"],
    coords: [{ lat: 7.2906, lng: 80.6337 }, { lat: 7.3269, lng: 80.6244 }]
  },
  // No dedicated local route number found — these 3 are stops directly on the very frequent
  // Kandy-Colombo/Kandy-Kegalle trunk highway (A1), so effectively any Colombo-bound bus serves
  // them. Distance/duration well-established; frequency reflects the trunk corridor, flagged approx.
  "kandy-peradeniya": {
    normal: { bus: "Colombo-bound trunk buses", fare: "Rs. 34 (est.)", duration: "15 mins" },
    ac: { bus: "Colombo-bound trunk buses - AC", fare: "Rs. 48 (est.)", duration: "10 mins" },
    timing: { first: "5:00 AM", last: "10:30 PM", frequency: "Every 10 mins (approx., trunk corridor)" },
    stops: ["Kandy", "Peradeniya"],
    coords: [{ lat: 7.2906, lng: 80.6337 }, { lat: 7.2599, lng: 80.5977 }]
  },
  "kandy-pilimatalawa": {
    normal: { bus: "Colombo-bound trunk buses", fare: "Rs. 45 (est.)", duration: "25 mins" },
    ac: { bus: "Colombo-bound trunk buses - AC", fare: "Rs. 90 (est.)", duration: "20 mins" },
    timing: { first: "5:00 AM", last: "10:30 PM", frequency: "Every 10 mins (approx., trunk corridor)" },
    stops: ["Kandy", "Peradeniya", "Pilimatalawa"],
    coords: [{ lat: 7.2906, lng: 80.6337 }, { lat: 7.2672, lng: 80.5667 }]
  },
  "kandy-akurana": {
    normal: { bus: "Local service", fare: "Rs. 35 (est.)", duration: "20 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 70 (est.)", duration: "15 mins" },
    timing: { first: "5:30 AM", last: "9:00 PM", frequency: "Every 15 mins (approx.)" },
    stops: ["Kandy", "Katugastota", "Akurana"],
    coords: [{ lat: 7.2906, lng: 80.6337 }, { lat: 7.3667, lng: 80.6167 }]
  },

  "kandy-jaffna": {
    normal: { bus: "No. 43/87", fare: "Rs. 1,732", duration: "7 hrs" },
    ac: { bus: "No. 43/87 - AC", fare: "Rs. 2,291", duration: "6 hrs" },
    timing: { first: "6:00 AM", last: "7:00 PM", frequency: "Every 2 hours" },
    stops: ["Kandy", "Dambulla", "Anuradhapura", "Vavuniya", "Jaffna"],
    coords: [{ lat: 7.2906, lng: 80.6337 }, { lat: 9.6615, lng: 80.0255 }]
  },
  "kandy-anuradhapura": {
    normal: { bus: "No. 43", fare: "Rs. 693", duration: "3.5 hrs" },
    ac: { bus: "No. 43 - AC", fare: "Rs. 928", duration: "3 hrs" },
    timing: { first: "6:00 AM", last: "7:00 PM", frequency: "Every 1 hour" },
    stops: ["Kandy", "Dambulla", "Kekirawa", "Anuradhapura"],
    coords: [{ lat: 7.2906, lng: 80.6337 }, { lat: 8.3114, lng: 80.4037 }]
  },
  "kandy-nuwara eliya": {
    normal: { bus: "No. 98", fare: "Rs. 232", duration: "2 hrs" },
    ac: { bus: "No. 98 - AC", fare: "Rs. 437", duration: "1.5 hrs" },
    timing: { first: "6:00 AM", last: "8:00 PM", frequency: "Every 30 mins" },
    stops: ["Kandy", "Gampola", "Nuwara Eliya"],
    coords: [{ lat: 7.2906, lng: 80.6337 }, { lat: 6.9497, lng: 80.7891 }]
  },
  "kandy-badulla": {
    normal: { bus: "No. 98/1", fare: "Rs. 464", duration: "3.5 hrs" },
    ac: { bus: "No. 98/1 - AC", fare: "Rs. 867", duration: "3 hrs" },
    timing: { first: "6:00 AM", last: "7:00 PM", frequency: "Every 45 mins" },
    stops: ["Kandy", "Nuwara Eliya", "Welimada", "Badulla"],
    coords: [{ lat: 7.2906, lng: 80.6337 }, { lat: 6.9934, lng: 81.0550 }]
  },
  "kandy-polonnaruwa": {
    normal: { bus: "No. 48", fare: "Rs. 414", duration: "3 hrs" },
    ac: { bus: "No. 48 - AC", fare: "Rs. 774", duration: "2.5 hrs" },
    timing: { first: "5:30 AM", last: "7:30 PM", frequency: "Every 45 mins" },
    stops: ["Kandy", "Matale", "Dambulla", "Polonnaruwa"],
    coords: [{ lat: 7.2906, lng: 80.6337 }, { lat: 7.9403, lng: 81.0188 }]
  },
  "kandy-trincomalee": {
    normal: { bus: "No. 49", fare: "Rs. 633", duration: "4 hrs" },
    ac: { bus: "No. 49 - AC", fare: "Rs. 1,189", duration: "3.5 hrs" },
    timing: { first: "6:00 AM", last: "6:00 PM", frequency: "Every 1 hour" },
    stops: ["Kandy", "Dambulla", "Habarana", "Trincomalee"],
    coords: [{ lat: 7.2906, lng: 80.6337 }, { lat: 8.5874, lng: 81.2152 }]
  },
  "kandy-matara": {
    normal: { bus: "No. 2", fare: "Rs. 567", duration: "4 hrs" },
    ac: { bus: "No. 2 - AC", fare: "Rs. 1,064", duration: "3.5 hrs" },
    timing: { first: "5:30 AM", last: "7:00 PM", frequency: "Every 1 hour" },
    stops: ["Kandy", "Colombo", "Galle", "Matara"],
    coords: [{ lat: 7.2906, lng: 80.6337 }, { lat: 5.9549, lng: 80.5550 }]
  },
  "kandy-hatton": {
    normal: { bus: "No. 18-2", fare: "Rs. 219", duration: "2 hrs" },
    ac: { bus: "No. 18-2 - AC", fare: "Rs. 411", duration: "1.5 hrs" },
    timing: { first: "6:00 AM", last: "7:30 PM", frequency: "Every 45 mins" },
    stops: ["Kandy", "Gampola", "Ginigathena", "Hatton"],
    coords: [{ lat: 7.2906, lng: 80.6337 }, { lat: 6.8978, lng: 80.5951 }]
  },
  "kandy-matale": {
    normal: { bus: "No. 8", fare: "Rs. 109", duration: "45 mins" },
    ac: { bus: "No. 8 - AC", fare: "Rs. 219", duration: "30 mins" },
    timing: { first: "5:00 AM", last: "9:30 PM", frequency: "Every 10 mins" },
    stops: ["Kandy", "Matale"],
    coords: [{ lat: 7.2906, lng: 80.6337 }, { lat: 7.4675, lng: 80.6234 }]
  },
  "kandy-kurunegala": {
    normal: { bus: "No. 1", fare: "Rs. 232", duration: "1.5 hrs" },
    ac: { bus: "No. 1 - AC", fare: "Rs. 437", duration: "1 hr" },
    timing: { first: "5:30 AM", last: "9:00 PM", frequency: "Every 20 mins" },
    stops: ["Kandy", "Alawwa", "Kurunegala"],
    coords: [{ lat: 7.2906, lng: 80.6337 }, { lat: 7.4818, lng: 80.3609 }]
  },
  "kandy-mahiyanganaya": {
    normal: { bus: "No. 38-1", fare: "Rs. 232", duration: "2 hrs" },
    ac: { bus: "No. 38-1 - AC", fare: "Rs. 437", duration: "1.5 hrs" },
    timing: { first: "6:00 AM", last: "6:30 PM", frequency: "Every 1 hour" },
    stops: ["Kandy", "Mahiyanganaya"],
    coords: [{ lat: 7.2906, lng: 80.6337 }, { lat: 7.3280, lng: 81.0008 }]
  },
  "kandy-dambulla": {
    normal: { bus: "No. 6", fare: "Rs. 164", duration: "1.5 hrs" },
    ac: { bus: "No. 6 - AC", fare: "Rs. 308", duration: "1 hr" },
    timing: { first: "5:30 AM", last: "9:00 PM", frequency: "Every 15 mins" },
    stops: ["Kandy", "Matale", "Dambulla"],
    coords: [{ lat: 7.2906, lng: 80.6337 }, { lat: 7.8742, lng: 80.6511 }]
  },

  // ============ GALLE ROUTES ============
  "galle-matara": {
    normal: { bus: "No. 32", fare: "Rs. 202", duration: "1 hr" },
    ac: { bus: "No. 32 - AC", fare: "Rs. 379", duration: "45 mins" },
    timing: { first: "5:00 AM", last: "10:00 PM", frequency: "Every 10 mins" },
    stops: ["Galle", "Unawatuna", "Weligama", "Matara"],
    coords: [{ lat: 6.0535, lng: 80.2210 }, { lat: 5.9549, lng: 80.5550 }]
  },
  "galle-hambantota": {
    normal: { bus: "No. 32-1", fare: "Rs. 414", duration: "2 hrs" },
    ac: { bus: "No. 32-1 - AC", fare: "Rs. 777", duration: "1.5 hrs" },
    timing: { first: "5:30 AM", last: "8:00 PM", frequency: "Every 30 mins" },
    stops: ["Galle", "Matara", "Tangalle", "Hambantota"],
    coords: [{ lat: 6.0535, lng: 80.2210 }, { lat: 6.1429, lng: 81.1212 }]
  },
  "galle-ratnapura": {
    normal: { bus: "No. 32/3", fare: "Rs. 349", duration: "2.5 hrs" },
    ac: { bus: "No. 32/3 - AC", fare: "Rs. 655", duration: "2 hrs" },
    timing: { first: "6:00 AM", last: "7:00 PM", frequency: "Every 1 hour" },
    stops: ["Galle", "Elpitiya", "Ratnapura"],
    coords: [{ lat: 6.0535, lng: 80.2210 }, { lat: 6.6828, lng: 80.3992 }]
  },
  "galle-kataragama": {
    normal: { bus: "No. 32-7", fare: "Rs. 707", duration: "3.5 hrs" },
    ac: { bus: "No. 32-7 - AC", fare: "Rs. 1,328", duration: "3 hrs" },
    timing: { first: "6:00 AM", last: "6:00 PM", frequency: "Every 2 hours" },
    stops: ["Galle", "Matara", "Hambantota", "Kataragama"],
    coords: [{ lat: 6.0535, lng: 80.2210 }, { lat: 6.4149, lng: 81.3322 }]
  },

  // Route 752, verified via sprpta.lk (Southern Province Road Passenger Transport Authority live
  // schedule system) — Elpitiya-Galle via Aluthwala, 39.90km, 95 min.
  "galle-elpitiya": {
    normal: { bus: "No. 752", fare: "Rs. 180 (est.)", duration: "1 hr 35 mins" },
    ac: { bus: "No. 752 - AC", fare: "Rs. 340 (est.)", duration: "1 hr 15 mins" },
    timing: { first: "5:00 AM", last: "8:30 PM", frequency: "Every 20 mins (approx.)" },
    stops: ["Galle", "Aluthwala", "Elpitiya"],
    coords: [{ lat: 6.0535, lng: 80.2210 }, { lat: 6.2856, lng: 80.1650 }]
  },
  // Route 378, confirmed (ceylonlanka.info route directory); distance estimated (between Galle and Elpitiya).
  "galle-baddegama": {
    normal: { bus: "No. 378", fare: "Rs. 85 (est.)", duration: "35 mins" },
    ac: { bus: "No. 378 - AC", fare: "Rs. 160 (est.)", duration: "25 mins" },
    timing: { first: "5:00 AM", last: "9:00 PM", frequency: "Every 15 mins (approx.)" },
    stops: ["Galle", "Baddegama"],
    coords: [{ lat: 6.0535, lng: 80.2210 }, { lat: 6.1667, lng: 80.1667 }]
  },
  // Unawatuna, Ahangama, and Weligama are documented stops on this app's own existing galle-matara
  // Route 32 (every 10 min) — same operator/frequency, just shorter legs of that route.
  "galle-unawatuna": {
    normal: { bus: "No. 32", fare: "Rs. 34 (est.)", duration: "15 mins" },
    ac: { bus: "No. 32 - AC", fare: "Rs. 45 (est.)", duration: "10 mins" },
    timing: { first: "5:00 AM", last: "10:00 PM", frequency: "Every 10 mins" },
    stops: ["Galle", "Unawatuna"],
    coords: [{ lat: 6.0535, lng: 80.2210 }, { lat: 6.0108, lng: 80.2492 }]
  },
  "galle-ahangama": {
    normal: { bus: "No. 32", fare: "Rs. 75 (est.)", duration: "30 mins" },
    ac: { bus: "No. 32 - AC", fare: "Rs. 140 (est.)", duration: "25 mins" },
    timing: { first: "5:00 AM", last: "10:00 PM", frequency: "Every 10 mins" },
    stops: ["Galle", "Unawatuna", "Ahangama"],
    coords: [{ lat: 6.0535, lng: 80.2210 }, { lat: 5.9739, lng: 80.3625 }]
  },
  "galle-weligama": {
    normal: { bus: "No. 32", fare: "Rs. 125 (est.)", duration: "45 mins" },
    ac: { bus: "No. 32 - AC", fare: "Rs. 230 (est.)", duration: "35 mins" },
    timing: { first: "5:00 AM", last: "10:00 PM", frequency: "Every 10 mins" },
    stops: ["Galle", "Unawatuna", "Ahangama", "Weligama"],
    coords: [{ lat: 6.0535, lng: 80.2210 }, { lat: 5.9739, lng: 80.4292 }]
  },
  // Balapitiya sits on the Colombo-Galle coastal trunk highway (same corridor as this app's
  // colombo-galle/colombo-ambalangoda routes), so it's served by very frequent trunk traffic
  // rather than one dedicated local route.
  "galle-balapitiya": {
    normal: { bus: "Trunk corridor buses", fare: "Rs. 100 (est.)", duration: "35 mins" },
    ac: { bus: "Trunk corridor buses - AC", fare: "Rs. 190 (est.)", duration: "25 mins" },
    timing: { first: "5:00 AM", last: "10:00 PM", frequency: "Every 10 mins (approx., trunk corridor)" },
    stops: ["Galle", "Ambalangoda", "Balapitiya"],
    coords: [{ lat: 6.0535, lng: 80.2210 }, { lat: 6.2544, lng: 80.0392 }]
  },

  // ============ JAFFNA ROUTES ============
  "jaffna-vavuniya": {
    normal: { bus: "No. 15", fare: "Rs. 540", duration: "2.5 hrs" },
    ac: { bus: "No. 15 - AC", fare: "Rs. 1,013", duration: "2 hrs" },
    timing: { first: "5:30 AM", last: "7:00 PM", frequency: "Every 30 mins" },
    stops: ["Jaffna", "Kilinochchi", "Vavuniya"],
    coords: [{ lat: 9.6615, lng: 80.0255 }, { lat: 8.7514, lng: 80.4971 }]
  },
  "jaffna-trincomalee": {
    normal: { bus: "No. 78", fare: "Rs. 742", duration: "4 hrs" },
    ac: { bus: "No. 78 - AC", fare: "Rs. 1,391", duration: "3.5 hrs" },
    timing: { first: "6:00 AM", last: "5:00 PM", frequency: "Every 2 hours" },
    stops: ["Jaffna", "Mullaitivu", "Trincomalee"],
    coords: [{ lat: 9.6615, lng: 80.0255 }, { lat: 8.5874, lng: 81.2152 }]
  },
  "jaffna-mannar": {
    normal: { bus: "No. 87", fare: "Rs. 414", duration: "2.5 hrs" },
    ac: { bus: "No. 87 - AC", fare: "Rs. 777", duration: "2 hrs" },
    timing: { first: "6:00 AM", last: "5:30 PM", frequency: "Every 1 hour" },
    stops: ["Jaffna", "Paranthan", "Mannar"],
    coords: [{ lat: 9.6615, lng: 80.0255 }, { lat: 8.9810, lng: 79.9044 }]
  },
  "jaffna-anuradhapura": {
    normal: { bus: "No. 15", fare: "Rs. 953", duration: "3.5 hrs" },
    ac: { bus: "No. 15 - AC", fare: "Rs. 1,784", duration: "3 hrs" },
    timing: { first: "6:00 AM", last: "7:00 PM", frequency: "Every 1 hour" },
    stops: ["Jaffna", "Kilinochchi", "Vavuniya", "Anuradhapura"],
    coords: [{ lat: 9.6615, lng: 80.0255 }, { lat: 8.3114, lng: 80.4037 }]
  },
  "jaffna-kilinochchi": {
    normal: { bus: "No. 15", fare: "Rs. 289", duration: "1.5 hrs" },
    ac: { bus: "No. 15 - AC", fare: "Rs. 542", duration: "1 hr" },
    timing: { first: "5:30 AM", last: "7:30 PM", frequency: "Every 30 mins" },
    stops: ["Jaffna", "Elephant Pass", "Kilinochchi"],
    coords: [{ lat: 9.6615, lng: 80.0255 }, { lat: 9.3803, lng: 80.3770 }]
  },

  // Real bus timetable (busseat.lk Point Pedro-Colombo/Jaffna-Colombo services): exact stop
  // sequence confirms Nallur, Kopay, Chavakachcheri, Point Pedro all directly on Jaffna's own
  // local corridors. Point Pedro distance (20.2mi/32.5km, ~1hr) Rome2Rio-confirmed.
  "jaffna-nallur": {
    normal: { bus: "Local service", fare: "Rs. 34 (est.)", duration: "10 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 40 (est.)", duration: "8 mins" },
    timing: { first: "5:00 AM", last: "9:30 PM", frequency: "Every 10 mins (approx.)" },
    stops: ["Jaffna", "Nallur"],
    coords: [{ lat: 9.6615, lng: 80.0255 }, { lat: 9.6650, lng: 80.0286 }]
  },
  "jaffna-kopay": {
    normal: { bus: "Local service", fare: "Rs. 34 (est.)", duration: "15 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 48 (est.)", duration: "10 mins" },
    timing: { first: "5:00 AM", last: "9:00 PM", frequency: "Every 15 mins (approx.)" },
    stops: ["Jaffna", "Nallur", "Kopay"],
    coords: [{ lat: 9.6615, lng: 80.0255 }, { lat: 9.7167, lng: 80.0167 }]
  },
  "jaffna-manipay": {
    normal: { bus: "Local service", fare: "Rs. 34 (est.)", duration: "20 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 54 (est.)", duration: "15 mins" },
    timing: { first: "5:00 AM", last: "9:00 PM", frequency: "Every 15 mins (approx.)" },
    stops: ["Jaffna", "Manipay"],
    coords: [{ lat: 9.6615, lng: 80.0255 }, { lat: 9.6667, lng: 79.9500 }]
  },
  "jaffna-chavakachcheri": {
    normal: { bus: "Local service", fare: "Rs. 50 (est.)", duration: "35 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 95 (est.)", duration: "25 mins" },
    timing: { first: "5:00 AM", last: "9:00 PM", frequency: "Every 15 mins (approx.)" },
    stops: ["Jaffna", "Kopay", "Chavakachcheri"],
    coords: [{ lat: 9.6615, lng: 80.0255 }, { lat: 9.6600, lng: 80.1600 }]
  },
  "jaffna-kayts": {
    normal: { bus: "Local service", fare: "Rs. 48 (est.)", duration: "30 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 90 (est.)", duration: "25 mins" },
    timing: { first: "5:30 AM", last: "8:30 PM", frequency: "Every 30 mins (approx.)" },
    stops: ["Jaffna", "Kayts"],
    coords: [{ lat: 9.6615, lng: 80.0255 }, { lat: 9.6900, lng: 79.8500 }]
  },
  "jaffna-point pedro": {
    normal: { bus: "Local service", fare: "Rs. 105 (est.)", duration: "1 hr" },
    ac: { bus: "Local service - AC", fare: "Rs. 195 (est.)", duration: "45 mins" },
    timing: { first: "5:00 AM", last: "8:30 PM", frequency: "Every 20 mins" },
    stops: ["Jaffna", "Kopay", "Chavakachcheri", "Point Pedro"],
    coords: [{ lat: 9.6615, lng: 80.0255 }, { lat: 9.8167, lng: 80.2333 }]
  },
  // Delft is an island reached via ferry from Kurikadduwan (near Kayts) — much lower frequency.
  "jaffna-delft": {
    normal: { bus: "Local service + ferry", fare: "Rs. 145 (est.)", duration: "2 hrs" },
    ac: { bus: "Local service + ferry", fare: "Rs. 145 (est.)", duration: "2 hrs" },
    timing: { first: "6:00 AM", last: "3:00 PM", frequency: "Every 2 hours (approx., ferry-dependent)" },
    stops: ["Jaffna", "Kayts", "Kurikadduwan (ferry)", "Delft"],
    coords: [{ lat: 9.6615, lng: 80.0255 }, { lat: 9.5167, lng: 79.6667 }]
  },

  // ============ ANURADHAPURA ROUTES ============
  "anuradhapura-nochchiyagama": {
    normal: { bus: "No. 57/822/87", fare: "Rs. 107", duration: "45 mins" },
    ac: { bus: "No. 57 - AC", fare: "Rs. 202", duration: "35 mins" },
    timing: { first: "5:30 AM", last: "8:00 PM", frequency: "Every 20 mins" },
    stops: ["Anuradhapura", "Thalawa", "Nochchiyagama"],
    coords: [{ lat: 8.3114, lng: 80.4037 }, { lat: 8.2833, lng: 80.2167 }],
    alternativeBuses: [
      { bus: "No. 57/1", fare: "Rs. 107", type: "Normal" },
      { bus: "No. 822", fare: "Rs. 107", type: "Normal" },
      { bus: "No. 87", fare: "Rs. 120", type: "Normal" },
    ]
  },
  // Route 42-05, verified via NTC permit registry + operator timetable (Jayasekara Express, NC-6719).
  // Single scheduled daily departure — not a frequent-service route. Fare is estimated
  // (calibrated against colombo-kandy Rs/km) — not independently confirmed, flag to rider.
  "nochchiyagama-kandy": {
    normal: { bus: "No. 42-05", fare: "Rs. 570 (est.)", duration: "5 hrs" },
    ac: { bus: "No. 42-05 - AC", fare: "Rs. 1,025 (est.)", duration: "4.5 hrs" },
    timing: { first: "5:15 AM", last: "5:15 AM", frequency: "Once daily" },
    stops: ["Nochchiyagama", "Galadivulwewa", "Tambuttegama", "Kalawewa", "Kekirawa", "Dambulla", "Naula", "Matale", "Akurana", "Katugastota", "Kandy"],
    coords: [{ lat: 8.2833, lng: 80.2167 }, { lat: 7.2906, lng: 80.6337 }]
  },
  // Frequent local shuttle from Anuradhapura New Town bus stand — fare (Rs.30) and last-bus
  // (7:00 PM) confirmed via multiple independent traveler accounts. No fixed route number or
  // published frequency found (typical for short hub shuttles) — frequency below is a
  // conservative estimate, not confirmed.
  "anuradhapura-mihintale": {
    normal: { bus: "Mihintale Shuttle", fare: "Rs. 30", duration: "20 mins" },
    ac: { bus: "Mihintale Shuttle", fare: "Rs. 30", duration: "20 mins" },
    timing: { first: "6:00 AM", last: "7:00 PM", frequency: "Every 30 mins (approx.)" },
    stops: ["Anuradhapura New Town", "Mihintale"],
    coords: [{ lat: 8.3114, lng: 80.4037 }, { lat: 8.3500, lng: 80.5167 }]
  },
  // Tambuttegama sits on the Route 57 Colombo-Anuradhapura-Vavuniya corridor — served by
  // passing-through buses on that highway route (hourly), confirmed via rome2rio + NTC route
  // 57 description. Fare is distance-calibrated (~27km), not a separately published local fare.
  "anuradhapura-tambuttegama": {
    normal: { bus: "No. 57 (via)", fare: "Rs. 115 (est.)", duration: "40 mins" },
    ac: { bus: "No. 57 (via)", fare: "Rs. 115 (est.)", duration: "35 mins" },
    timing: { first: "5:30 AM", last: "9:00 PM", frequency: "Every 1 hour" },
    stops: ["Anuradhapura", "Thalawa", "Tambuttegama"],
    coords: [{ lat: 8.3114, lng: 80.4037 }, { lat: 8.1500, lng: 80.1167 }]
  },
  // Same Route 57 corridor as anuradhapura-tambuttegama, shorter hop — Thalawa is an
  // intermediate stop on that route, not a separately scheduled service.
  "anuradhapura-thalawa": {
    normal: { bus: "No. 57 (via)", fare: "Rs. 75 (est.)", duration: "20 mins" },
    ac: { bus: "No. 57 (via)", fare: "Rs. 75 (est.)", duration: "18 mins" },
    timing: { first: "5:30 AM", last: "9:00 PM", frequency: "Every 1 hour" },
    stops: ["Anuradhapura", "Thalawa"],
    coords: [{ lat: 8.3114, lng: 80.4037 }, { lat: 8.2333, lng: 80.1833 }]
  },
  // Medawachchiya lies on the Route 4 / 87 Colombo-Anuradhapura-Vavuniya-Jaffna corridor —
  // confirmed as a scheduled stop (NTC route descriptions + operator timetables), served by
  // buses passing through rather than a dedicated local shuttle. Fare/duration distance-calibrated.
  "anuradhapura-medawachchiya": {
    normal: { bus: "No. 4/87 (via)", fare: "Rs. 170 (est.)", duration: "50 mins" },
    ac: { bus: "No. 4/87 (via)", fare: "Rs. 170 (est.)", duration: "45 mins" },
    timing: { first: "5:00 AM", last: "9:30 PM", frequency: "Every 30 mins" },
    stops: ["Anuradhapura", "Medawachchiya"],
    coords: [{ lat: 8.3114, lng: 80.4037 }, { lat: 8.5333, lng: 80.4833 }]
  },
  // Kekirawa lies on the Route 15-1-1 / 57 Colombo-Dambulla-Kekirawa-Anuradhapura corridor —
  // confirmed via NTC route descriptions. Fare/duration distance-calibrated.
  "anuradhapura-kekirawa": {
    normal: { bus: "No. 15-1-1 (via)", fare: "Rs. 180 (est.)", duration: "50 mins" },
    ac: { bus: "No. 15-1-1 (via)", fare: "Rs. 180 (est.)", duration: "45 mins" },
    timing: { first: "5:30 AM", last: "9:00 PM", frequency: "Every 30 mins" },
    stops: ["Anuradhapura", "Kekirawa"],
    coords: [{ lat: 8.3114, lng: 80.4037 }, { lat: 8.0333, lng: 80.5833 }]
  },
  "anuradhapura-trincomalee": {
    normal: { bus: "No. 49", fare: "Rs. 464", duration: "2.5 hrs" },
    ac: { bus: "No. 49 - AC", fare: "Rs. 867", duration: "2 hrs" },
    timing: { first: "6:00 AM", last: "6:30 PM", frequency: "Every 1 hour" },
    stops: ["Anuradhapura", "Kekirawa", "Habarana", "Trincomalee"],
    coords: [{ lat: 8.3114, lng: 80.4037 }, { lat: 8.5874, lng: 81.2152 }]
  },
  "anuradhapura-kurunegala": {
    normal: { bus: "No. 6", fare: "Rs. 347", duration: "2 hrs" },
    ac: { bus: "No. 6 - AC", fare: "Rs. 650", duration: "1.5 hrs" },
    timing: { first: "5:30 AM", last: "8:00 PM", frequency: "Every 30 mins" },
    stops: ["Anuradhapura", "Kekirawa", "Kurunegala"],
    coords: [{ lat: 8.3114, lng: 80.4037 }, { lat: 7.4818, lng: 80.3609 }]
  },
  "anuradhapura-jaffna": {
    normal: { bus: "No. 15", fare: "Rs. 953", duration: "3.5 hrs" },
    ac: { bus: "No. 15 - AC", fare: "Rs. 1,784", duration: "3 hrs" },
    timing: { first: "6:00 AM", last: "7:00 PM", frequency: "Every 1 hour" },
    stops: ["Anuradhapura", "Vavuniya", "Kilinochchi", "Jaffna"],
    coords: [{ lat: 8.3114, lng: 80.4037 }, { lat: 9.6615, lng: 80.0255 }]
  },
  "anuradhapura-polonnaruwa": {
    normal: { bus: "No. 49", fare: "Rs. 347", duration: "2 hrs" },
    ac: { bus: "No. 49 - AC", fare: "Rs. 650", duration: "1.5 hrs" },
    timing: { first: "6:00 AM", last: "6:30 PM", frequency: "Every 1 hour" },
    stops: ["Anuradhapura", "Habarana", "Polonnaruwa"],
    coords: [{ lat: 8.3114, lng: 80.4037 }, { lat: 7.9403, lng: 81.0188 }]
  },

  // ============ TRINCOMALEE ROUTES ============
  "trincomalee-batticaloa": {
    normal: { bus: "No. 48", fare: "Rs. 414", duration: "2.5 hrs" },
    ac: { bus: "No. 48 - AC", fare: "Rs. 777", duration: "2 hrs" },
    timing: { first: "6:00 AM", last: "6:00 PM", frequency: "Every 1 hour" },
    stops: ["Trincomalee", "Muttur", "Batticaloa"],
    coords: [{ lat: 8.5874, lng: 81.2152 }, { lat: 7.7310, lng: 81.6747 }]
  },
  "trincomalee-polonnaruwa": {
    normal: { bus: "No. 49", fare: "Rs. 311", duration: "2 hrs" },
    ac: { bus: "No. 49 - AC", fare: "Rs. 583", duration: "1.5 hrs" },
    timing: { first: "6:00 AM", last: "6:30 PM", frequency: "Every 1 hour" },
    stops: ["Trincomalee", "Kantale", "Polonnaruwa"],
    coords: [{ lat: 8.5874, lng: 81.2152 }, { lat: 7.9403, lng: 81.0188 }]
  },
  "trincomalee-vavuniya": {
    normal: { bus: "No. 87", fare: "Rs. 347", duration: "2 hrs" },
    ac: { bus: "No. 87 - AC", fare: "Rs. 650", duration: "1.5 hrs" },
    timing: { first: "6:00 AM", last: "6:00 PM", frequency: "Every 1 hour" },
    stops: ["Trincomalee", "Vavuniya"],
    coords: [{ lat: 8.5874, lng: 81.2152 }, { lat: 8.7514, lng: 80.4971 }]
  },

  // Trincomalee-Pulmodai local shuttle, confirmed by a firsthand traveler account: runs 04:30-19:30,
  // every 30-60 min, fare starting Rs.44 depending on distance. Uppuveli and Nilaveli are both on
  // this exact road/service, so fare/frequency below are drawn directly from that source.
  "trincomalee-uppuveli": {
    normal: { bus: "Local shuttle", fare: "Rs. 44", duration: "15 mins" },
    ac: { bus: "Local shuttle - AC", fare: "Rs. 85 (est.)", duration: "10 mins" },
    timing: { first: "4:30 AM", last: "7:30 PM", frequency: "Every 30 mins" },
    stops: ["Trincomalee", "Uppuveli"],
    coords: [{ lat: 8.5874, lng: 81.2152 }, { lat: 8.6167, lng: 81.2000 }]
  },
  "trincomalee-nilaveli": {
    normal: { bus: "Local shuttle", fare: "Rs. 65 (est.)", duration: "25 mins" },
    ac: { bus: "Local shuttle - AC", fare: "Rs. 125 (est.)", duration: "20 mins" },
    timing: { first: "4:30 AM", last: "7:30 PM", frequency: "Every 30 mins" },
    stops: ["Trincomalee", "Uppuveli", "Nilaveli"],
    coords: [{ lat: 8.5874, lng: 81.2152 }, { lat: 8.6667, lng: 81.1833 }]
  },
  // Kinniya and Kantale are both on the busy Colombo-Trincomalee trunk highway (Route 49, per
  // nextbus.lk's through-route listing) — distances Rome2Rio-confirmed.
  "trincomalee-kinniya": {
    normal: { bus: "Trunk corridor buses", fare: "Rs. 75 (est.)", duration: "25 mins" },
    ac: { bus: "Trunk corridor buses - AC", fare: "Rs. 140 (est.)", duration: "20 mins" },
    timing: { first: "5:00 AM", last: "9:00 PM", frequency: "Every 20 mins (approx., trunk corridor)" },
    stops: ["Trincomalee", "Kinniya"],
    coords: [{ lat: 8.5874, lng: 81.2152 }, { lat: 8.4919, lng: 81.1997 }]
  },
  "trincomalee-kantale": {
    normal: { bus: "Trunk corridor buses", fare: "Rs. 175 (est.)", duration: "50 mins" },
    ac: { bus: "Trunk corridor buses - AC", fare: "Rs. 330 (est.)", duration: "40 mins" },
    timing: { first: "5:00 AM", last: "9:00 PM", frequency: "Every 30 mins (approx., trunk corridor)" },
    stops: ["Trincomalee", "Kinniya", "Kantale"],
    coords: [{ lat: 8.5874, lng: 81.2152 }, { lat: 8.3667, lng: 80.9833 }]
  },
  // Distance sourced (Rome2Rio, 18.6mi/30km). No published bus frequency found — estimated
  // conservatively given it's a smaller cross-harbour route, not a trunk corridor.
  "trincomalee-mutur": {
    normal: { bus: "Local service", fare: "Rs. 135 (est.)", duration: "1 hr" },
    ac: { bus: "Local service - AC", fare: "Rs. 255 (est.)", duration: "50 mins" },
    timing: { first: "6:00 AM", last: "6:00 PM", frequency: "Every 1 hour (approx.)" },
    stops: ["Trincomalee", "Mutur"],
    coords: [{ lat: 8.5874, lng: 81.2152 }, { lat: 8.4500, lng: 81.2667 }]
  },

  // ============ BATTICALOA ROUTES ============
  // All 4 towns confirmed on this app's own Route 48 corridor (already used in batticaloa-polonnaruwa,
  // which lists Valaichchenai as a stop) — flickr operator listing independently confirms the exact
  // stop order: Batticaloa-Eravur-Chenkalady-...-Valaichchenai direction, and Kalmunai the other way.
  "batticaloa-kalmunai": {
    normal: { bus: "No. 48", fare: "Rs. 125 (est.)", duration: "45 mins" },
    ac: { bus: "No. 48 - AC", fare: "Rs. 240 (est.)", duration: "35 mins" },
    timing: { first: "5:00 AM", last: "9:00 PM", frequency: "Every 20 mins (approx., trunk corridor)" },
    stops: ["Batticaloa", "Kalmunai"],
    coords: [{ lat: 7.7310, lng: 81.6747 }, { lat: 7.4083, lng: 81.8306 }]
  },
  "batticaloa-valaichchenai": {
    normal: { bus: "No. 48", fare: "Rs. 70 (est.)", duration: "30 mins" },
    ac: { bus: "No. 48 - AC", fare: "Rs. 135 (est.)", duration: "25 mins" },
    timing: { first: "5:00 AM", last: "9:00 PM", frequency: "Every 20 mins (approx., trunk corridor)" },
    stops: ["Batticaloa", "Eravur", "Valaichchenai"],
    coords: [{ lat: 7.7310, lng: 81.6747 }, { lat: 7.9167, lng: 81.5333 }]
  },
  "batticaloa-eravur": {
    normal: { bus: "No. 48", fare: "Rs. 34 (est.)", duration: "15 mins" },
    ac: { bus: "No. 48 - AC", fare: "Rs. 55 (est.)", duration: "10 mins" },
    timing: { first: "5:00 AM", last: "9:30 PM", frequency: "Every 15 mins (approx.)" },
    stops: ["Batticaloa", "Eravur"],
    coords: [{ lat: 7.7310, lng: 81.6747 }, { lat: 7.7667, lng: 81.6167 }]
  },
  // Chenkalady distance (15km NW of Batticaloa) Wikipedia-confirmed.
  "batticaloa-chenkalady": {
    normal: { bus: "No. 48", fare: "Rs. 45 (est.)", duration: "20 mins" },
    ac: { bus: "No. 48 - AC", fare: "Rs. 85 (est.)", duration: "15 mins" },
    timing: { first: "5:00 AM", last: "9:30 PM", frequency: "Every 15 mins (approx.)" },
    stops: ["Batticaloa", "Eravur", "Chenkalady"],
    coords: [{ lat: 7.7310, lng: 81.6747 }, { lat: 7.7833, lng: 81.6000 }]
  },
  "batticaloa-ampara": {
    normal: { bus: "No. 68", fare: "Rs. 202", duration: "1.5 hrs" },
    ac: { bus: "No. 68 - AC", fare: "Rs. 379", duration: "1 hr" },
    timing: { first: "5:30 AM", last: "7:00 PM", frequency: "Every 30 mins" },
    stops: ["Batticaloa", "Kalmunai", "Ampara"],
    coords: [{ lat: 7.7310, lng: 81.6747 }, { lat: 7.2811, lng: 81.6747 }]
  },
  "batticaloa-polonnaruwa": {
    normal: { bus: "No. 48", fare: "Rs. 414", duration: "2.5 hrs" },
    ac: { bus: "No. 48 - AC", fare: "Rs. 777", duration: "2 hrs" },
    timing: { first: "6:00 AM", last: "6:00 PM", frequency: "Every 1 hour" },
    stops: ["Batticaloa", "Valaichchenai", "Polonnaruwa"],
    coords: [{ lat: 7.7310, lng: 81.6747 }, { lat: 7.9403, lng: 81.0188 }]
  },

  // ============ MATARA ROUTES ============
  "matara-hambantota": {
    normal: { bus: "No. 32-1", fare: "Rs. 289", duration: "1.5 hrs" },
    ac: { bus: "No. 32-1 - AC", fare: "Rs. 542", duration: "1 hr" },
    timing: { first: "5:30 AM", last: "8:30 PM", frequency: "Every 20 mins" },
    stops: ["Matara", "Tangalle", "Hambantota"],
    coords: [{ lat: 5.9549, lng: 80.5550 }, { lat: 6.1429, lng: 81.1212 }]
  },
  "matara-badulla": {
    normal: { bus: "No. 99", fare: "Rs. 589", duration: "4 hrs" },
    ac: { bus: "No. 99 - AC", fare: "Rs. 1,104", duration: "3.5 hrs" },
    timing: { first: "6:00 AM", last: "6:00 PM", frequency: "Every 2 hours" },
    stops: ["Matara", "Wellawaya", "Badulla"],
    coords: [{ lat: 5.9549, lng: 80.5550 }, { lat: 6.9934, lng: 81.0550 }]
  },
  "matara-kataragama": {
    normal: { bus: "No. 32-7", fare: "Rs. 464", duration: "3 hrs" },
    ac: { bus: "No. 32-7 - AC", fare: "Rs. 870", duration: "2.5 hrs" },
    timing: { first: "6:00 AM", last: "6:30 PM", frequency: "Every 1 hour" },
    stops: ["Matara", "Tangalle", "Hambantota", "Kataragama"],
    coords: [{ lat: 5.9549, lng: 80.5550 }, { lat: 6.4149, lng: 81.3322 }]
  },

  // Route 360/1, verified via sprpta.lk live schedule system: Matara-Akuressa, 24.20km, 55 min.
  "matara-akuressa": {
    normal: { bus: "No. 360/1", fare: "Rs. 110 (est.)", duration: "55 mins" },
    ac: { bus: "No. 360/1 - AC", fare: "Rs. 210 (est.)", duration: "45 mins" },
    timing: { first: "5:00 AM", last: "9:00 PM", frequency: "Every 15 mins (approx.)" },
    stops: ["Matara", "Akuressa"],
    coords: [{ lat: 5.9549, lng: 80.5550 }, { lat: 6.1000, lng: 80.4778 }]
  },
  // Wikipedia-confirmed: "About two buses an hour run from Matara to Deniyaya, through Akuressa."
  "matara-deniyaya": {
    normal: { bus: "Local service", fare: "Rs. 295 (est.)", duration: "1 hr 45 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 550 (est.)", duration: "1 hr 30 mins" },
    timing: { first: "5:00 AM", last: "8:00 PM", frequency: "Every 30 mins" },
    stops: ["Matara", "Akuressa", "Deniyaya"],
    coords: [{ lat: 5.9549, lng: 80.5550 }, { lat: 6.3444, lng: 80.5583 }]
  },
  // Route 353, confirmed (ceylonlanka.info route directory).
  "matara-kamburupitiya": {
    normal: { bus: "No. 353", fare: "Rs. 60 (est.)", duration: "25 mins" },
    ac: { bus: "No. 353 - AC", fare: "Rs. 110 (est.)", duration: "20 mins" },
    timing: { first: "5:00 AM", last: "9:30 PM", frequency: "Every 15 mins (approx.)" },
    stops: ["Matara", "Kamburupitiya"],
    coords: [{ lat: 5.9549, lng: 80.5550 }, { lat: 6.0725, lng: 80.5589 }]
  },
  "matara-hakmana": {
    normal: { bus: "Local service", fare: "Rs. 70 (est.)", duration: "30 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 130 (est.)", duration: "25 mins" },
    timing: { first: "5:00 AM", last: "9:00 PM", frequency: "Every 20 mins (approx.)" },
    stops: ["Matara", "Kamburupitiya", "Hakmana"],
    coords: [{ lat: 5.9549, lng: 80.5550 }, { lat: 6.0833, lng: 80.6167 }]
  },
  // Dickwella sits on the same Matara-Tangalle-Kataragama coastal trunk corridor as this app's own
  // matara-kataragama route (which already stops at Tangalle).
  "matara-dickwella": {
    normal: { bus: "Trunk corridor buses", fare: "Rs. 140 (est.)", duration: "45 mins" },
    ac: { bus: "Trunk corridor buses - AC", fare: "Rs. 260 (est.)", duration: "35 mins" },
    timing: { first: "5:00 AM", last: "9:00 PM", frequency: "Every 20 mins (approx., trunk corridor)" },
    stops: ["Matara", "Dickwella"],
    coords: [{ lat: 5.9549, lng: 80.5550 }, { lat: 5.9667, lng: 80.6833 }]
  },
  "matara-devinuwara": {
    normal: { bus: "Local service", fare: "Rs. 34 (est.)", duration: "15 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 52 (est.)", duration: "10 mins" },
    timing: { first: "5:00 AM", last: "10:00 PM", frequency: "Every 15 mins (approx.)" },
    stops: ["Matara", "Devinuwara"],
    coords: [{ lat: 5.9549, lng: 80.5550 }, { lat: 5.9333, lng: 80.5833 }]
  },
  // Same Route 32 corridor as this app's existing galle-weligama entry.
  "matara-weligama": {
    normal: { bus: "No. 32", fare: "Rs. 65 (est.)", duration: "25 mins" },
    ac: { bus: "No. 32 - AC", fare: "Rs. 120 (est.)", duration: "20 mins" },
    timing: { first: "5:00 AM", last: "10:00 PM", frequency: "Every 10 mins" },
    stops: ["Matara", "Weligama"],
    coords: [{ lat: 5.9549, lng: 80.5550 }, { lat: 5.9739, lng: 80.4292 }]
  },

  // ============ HAMBANTOTA ROUTES ============
  "hambantota-monaragala": {
    normal: { bus: "No. 99", fare: "Rs. 347", duration: "2.5 hrs" },
    ac: { bus: "No. 99 - AC", fare: "Rs. 650", duration: "2 hrs" },
    timing: { first: "6:00 AM", last: "6:00 PM", frequency: "Every 1 hour" },
    stops: ["Hambantota", "Tissamaharama", "Monaragala"],
    coords: [{ lat: 6.1429, lng: 81.1212 }, { lat: 6.8728, lng: 81.3507 }]
  },
  "hambantota-matara": {
    normal: { bus: "No. 32-1", fare: "Rs. 289", duration: "1.5 hrs" },
    ac: { bus: "No. 32-1 - AC", fare: "Rs. 542", duration: "1 hr" },
    timing: { first: "5:00 AM", last: "9:00 PM", frequency: "Every 20 mins" },
    stops: ["Hambantota", "Tangalle", "Matara"],
    coords: [{ lat: 6.1429, lng: 81.1212 }, { lat: 5.9549, lng: 80.5550 }]
  },

  // Route 300, verified via sprpta.lk live schedule system: Hambantota-Sooriyawewa via Meegahajadura.
  "hambantota-suriyawewa": {
    normal: { bus: "No. 300", fare: "Rs. 110 (est.)", duration: "40 mins" },
    ac: { bus: "No. 300 - AC", fare: "Rs. 210 (est.)", duration: "30 mins" },
    timing: { first: "5:30 AM", last: "8:00 PM", frequency: "Every 20 mins (approx.)" },
    stops: ["Hambantota", "Meegahajadura", "Suriyawewa"],
    coords: [{ lat: 6.1429, lng: 81.1212 }, { lat: 6.2833, lng: 80.9333 }]
  },
  // NTC-confirmed: Tissamaharama has buses to Colombo "every 30 minutes" — a major regional hub.
  "hambantota-tissamaharama": {
    normal: { bus: "No. 32", fare: "Rs. 95 (est.)", duration: "30 mins" },
    ac: { bus: "No. 32 - AC", fare: "Rs. 185 (est.)", duration: "25 mins" },
    timing: { first: "5:00 AM", last: "9:30 PM", frequency: "Every 15 mins" },
    stops: ["Hambantota", "Tissamaharama"],
    coords: [{ lat: 6.1429, lng: 81.1212 }, { lat: 6.2769, lng: 81.2856 }]
  },
  // Ambalantota and Tangalle confirmed on the same corridor as this app's own matara-hambantota
  // route (Sejan Super Express: Tissa-Weerawila-Hambantota-Ambalantota-Hungama-Ranna-Tangalle).
  "hambantota-ambalantota": {
    normal: { bus: "No. 32", fare: "Rs. 45 (est.)", duration: "20 mins" },
    ac: { bus: "No. 32 - AC", fare: "Rs. 85 (est.)", duration: "15 mins" },
    timing: { first: "5:00 AM", last: "9:30 PM", frequency: "Every 15 mins" },
    stops: ["Hambantota", "Ambalantota"],
    coords: [{ lat: 6.1429, lng: 81.1212 }, { lat: 6.1181, lng: 81.0169 }]
  },
  "hambantota-tangalle": {
    normal: { bus: "No. 32", fare: "Rs. 90 (est.)", duration: "35 mins" },
    ac: { bus: "No. 32 - AC", fare: "Rs. 170 (est.)", duration: "30 mins" },
    timing: { first: "5:00 AM", last: "9:00 PM", frequency: "Every 20 mins" },
    stops: ["Hambantota", "Ambalantota", "Tangalle"],
    coords: [{ lat: 6.1429, lng: 81.1212 }, { lat: 6.0242, lng: 80.7942 }]
  },
  // Beliatta confirmed as a Southern Expressway interchange town on this corridor.
  "hambantota-beliatta": {
    normal: { bus: "No. 32", fare: "Rs. 125 (est.)", duration: "45 mins" },
    ac: { bus: "No. 32 - AC", fare: "Rs. 235 (est.)", duration: "35 mins" },
    timing: { first: "5:00 AM", last: "8:30 PM", frequency: "Every 20 mins (approx.)" },
    stops: ["Hambantota", "Tangalle", "Beliatta"],
    coords: [{ lat: 6.1429, lng: 81.1212 }, { lat: 6.0667, lng: 80.7000 }]
  },
  // No published route number found — distance is well-established real geography.
  "hambantota-weeraketiya": {
    normal: { bus: "Local service", fare: "Rs. 155 (est.)", duration: "55 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 295 (est.)", duration: "45 mins" },
    timing: { first: "5:30 AM", last: "8:00 PM", frequency: "Every 30 mins (approx.)" },
    stops: ["Hambantota", "Beliatta", "Weeraketiya"],
    coords: [{ lat: 6.1429, lng: 81.1212 }, { lat: 6.1667, lng: 80.7333 }]
  },

  // ============ BADULLA ROUTES ============
  "badulla-nuwara eliya": {
    normal: { bus: "No. 98", fare: "Rs. 232", duration: "2 hrs" },
    ac: { bus: "No. 98 - AC", fare: "Rs. 437", duration: "1.5 hrs" },
    timing: { first: "6:00 AM", last: "6:00 PM", frequency: "Every 45 mins" },
    stops: ["Badulla", "Welimada", "Nuwara Eliya"],
    coords: [{ lat: 6.9934, lng: 81.0550 }, { lat: 6.9497, lng: 80.7891 }]
  },
  "badulla-monaragala": {
    normal: { bus: "No. 99", fare: "Rs. 202", duration: "1.5 hrs" },
    ac: { bus: "No. 99 - AC", fare: "Rs. 379", duration: "1 hr" },
    timing: { first: "6:00 AM", last: "6:30 PM", frequency: "Every 1 hour" },
    stops: ["Badulla", "Wellawaya", "Monaragala"],
    coords: [{ lat: 6.9934, lng: 81.0550 }, { lat: 6.8728, lng: 81.3507 }]
  },
  "badulla-kandy": {
    normal: { bus: "No. 98/1", fare: "Rs. 464", duration: "3.5 hrs" },
    ac: { bus: "No. 98/1 - AC", fare: "Rs. 867", duration: "3 hrs" },
    timing: { first: "6:00 AM", last: "6:30 PM", frequency: "Every 1 hour" },
    stops: ["Badulla", "Welimada", "Nuwara Eliya", "Kandy"],
    coords: [{ lat: 6.9934, lng: 81.0550 }, { lat: 7.2906, lng: 80.6337 }]
  },

  // Real traveler account (manvsglobe.com): Bandarawela buses to Badulla run hourly (1.5hr trip),
  // and to Haputale every 20 min (30 min trip) — confirms this is a well-served hill-country corridor.
  "badulla-bandarawela": {
    normal: { bus: "Local service", fare: "Rs. 100 (est.)", duration: "1 hr" },
    ac: { bus: "Local service - AC", fare: "Rs. 190 (est.)", duration: "50 mins" },
    timing: { first: "5:30 AM", last: "8:00 PM", frequency: "Every 30 mins" },
    stops: ["Badulla", "Hali-Ela", "Bandarawela"],
    coords: [{ lat: 6.9934, lng: 81.0550 }, { lat: 6.8333, lng: 80.9833 }]
  },
  "badulla-haputale": {
    normal: { bus: "Local service", fare: "Rs. 140 (est.)", duration: "1 hr 30 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 260 (est.)", duration: "1 hr 15 mins" },
    timing: { first: "5:30 AM", last: "7:30 PM", frequency: "Every 20 mins" },
    stops: ["Badulla", "Bandarawela", "Haputale"],
    coords: [{ lat: 6.9934, lng: 81.0550 }, { lat: 6.7667, lng: 80.9500 }]
  },
  // Welimada already a confirmed stop on this app's own kandy-badulla route.
  "badulla-welimada": {
    normal: { bus: "No. 98/1", fare: "Rs. 90 (est.)", duration: "45 mins" },
    ac: { bus: "No. 98/1 - AC", fare: "Rs. 175 (est.)", duration: "35 mins" },
    timing: { first: "5:00 AM", last: "8:30 PM", frequency: "Every 20 mins (approx.)" },
    stops: ["Badulla", "Welimada"],
    coords: [{ lat: 6.9934, lng: 81.0550 }, { lat: 6.9061, lng: 80.9153 }]
  },
  // Confirmed real route (multiple named operators): Badulla-Ella-Mattala-Thanamalwila-Wellawaya.
  "badulla-ella": {
    normal: { bus: "Local service", fare: "Rs. 100 (est.)", duration: "1 hr" },
    ac: { bus: "Local service - AC", fare: "Rs. 185 (est.)", duration: "50 mins" },
    timing: { first: "5:30 AM", last: "7:30 PM", frequency: "Every 30 mins (approx.)" },
    stops: ["Badulla", "Hali-Ela", "Ella"],
    coords: [{ lat: 6.9934, lng: 81.0550 }, { lat: 6.8667, lng: 81.0466 }]
  },
  "badulla-mahiyanganaya": {
    normal: { bus: "Local service", fare: "Rs. 150 (est.)", duration: "1 hr 15 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 280 (est.)", duration: "1 hr" },
    timing: { first: "5:30 AM", last: "7:00 PM", frequency: "Every 30 mins (approx.)" },
    stops: ["Badulla", "Mahiyanganaya"],
    coords: [{ lat: 6.9934, lng: 81.0550 }, { lat: 7.3333, lng: 81.0000 }]
  },
  // Real connectivity confirmed (bustimetable.lk: "Travel From Passara To Colombo via Highway...").
  "badulla-passara": {
    normal: { bus: "Local service", fare: "Rs. 65 (est.)", duration: "30 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 125 (est.)", duration: "25 mins" },
    timing: { first: "5:30 AM", last: "8:00 PM", frequency: "Every 20 mins (approx.)" },
    stops: ["Badulla", "Passara"],
    coords: [{ lat: 6.9934, lng: 81.0550 }, { lat: 6.9500, lng: 81.1833 }]
  },
  // Confirmed real service (Rome2Rio: direct Bandarawela-Hali-Ela bus exists); Hali-Ela is
  // effectively a close-in suburb of Badulla town.
  "badulla-hali-ela": {
    normal: { bus: "Local service", fare: "Rs. 34 (est.)", duration: "15 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 62 (est.)", duration: "10 mins" },
    timing: { first: "5:00 AM", last: "9:30 PM", frequency: "Every 15 mins (approx.)" },
    stops: ["Badulla", "Hali-Ela"],
    coords: [{ lat: 6.9934, lng: 81.0550 }, { lat: 6.9333, lng: 81.0333 }]
  },

  // ============ KURUNEGALA ROUTES ============
  "kurunegala-puttalam": {
    normal: { bus: "No. 7", fare: "Rs. 232", duration: "1.5 hrs" },
    ac: { bus: "No. 7 - AC", fare: "Rs. 437", duration: "1 hr" },
    timing: { first: "5:30 AM", last: "8:30 PM", frequency: "Every 20 mins" },
    stops: ["Kurunegala", "Wariyapola", "Puttalam"],
    coords: [{ lat: 7.4818, lng: 80.3609 }, { lat: 8.0408, lng: 79.8394 }]
  },
  // Distances sourced (distancesfrom.com / Rome2Rio). No published fare/frequency table found for
  // these local hub routes — fares calibrated from this app's own kurunegala-kandy rate, frequency
  // is a reasonable estimate for district-hub corridors, both flagged (est./approx.).
  "kurunegala-wariyapola": {
    normal: { bus: "Local service", fare: "Rs. 105 (est.)", duration: "30 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 195 (est.)", duration: "25 mins" },
    timing: { first: "5:30 AM", last: "9:00 PM", frequency: "Every 15 mins (approx.)" },
    stops: ["Kurunegala", "Wariyapola"],
    coords: [{ lat: 7.4818, lng: 80.3609 }, { lat: 7.6333, lng: 80.2333 }]
  },
  "kurunegala-kuliyapitiya": {
    normal: { bus: "Local service", fare: "Rs. 210 (est.)", duration: "50 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 395 (est.)", duration: "40 mins" },
    timing: { first: "5:30 AM", last: "8:30 PM", frequency: "Every 20 mins (approx.)" },
    stops: ["Kurunegala", "Kuliyapitiya"],
    coords: [{ lat: 7.4818, lng: 80.3609 }, { lat: 7.4706, lng: 80.0456 }]
  },
  "kurunegala-nikaweratiya": {
    normal: { bus: "Local service", fare: "Rs. 215 (est.)", duration: "55 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 405 (est.)", duration: "45 mins" },
    timing: { first: "5:30 AM", last: "8:30 PM", frequency: "Every 20 mins (approx.)" },
    stops: ["Kurunegala", "Nikaweratiya"],
    coords: [{ lat: 7.4818, lng: 80.3609 }, { lat: 7.7475, lng: 80.1156 }]
  },
  "kurunegala-pannala": {
    normal: { bus: "Local service", fare: "Rs. 245 (est.)", duration: "1 hr" },
    ac: { bus: "Local service - AC", fare: "Rs. 465 (est.)", duration: "50 mins" },
    timing: { first: "5:30 AM", last: "8:00 PM", frequency: "Every 20 mins (approx.)" },
    stops: ["Kurunegala", "Pannala"],
    coords: [{ lat: 7.4818, lng: 80.3609 }, { lat: 7.3389, lng: 80.0997 }]
  },
  // Ibbagamuwa and Alawwa are both stops on the busy Kurunegala-Colombo/Trincomalee trunk highway
  // (confirmed route: Trincomalee-...-Ibbagamuwa-Kurunegala-Polgahawela-Alawwa-...-Colombo), so
  // effectively frequent trunk traffic serves them rather than a single dedicated local route.
  "kurunegala-ibbagamuwa": {
    normal: { bus: "Trunk corridor buses", fare: "Rs. 45 (est.)", duration: "15 mins" },
    ac: { bus: "Trunk corridor buses - AC", fare: "Rs. 85 (est.)", duration: "10 mins" },
    timing: { first: "5:00 AM", last: "9:30 PM", frequency: "Every 10 mins (approx., trunk corridor)" },
    stops: ["Kurunegala", "Ibbagamuwa"],
    coords: [{ lat: 7.4818, lng: 80.3609 }, { lat: 7.5333, lng: 80.4500 }]
  },
  "kurunegala-alawwa": {
    normal: { bus: "Trunk corridor buses", fare: "Rs. 110 (est.)", duration: "30 mins" },
    ac: { bus: "Trunk corridor buses - AC", fare: "Rs. 205 (est.)", duration: "25 mins" },
    timing: { first: "5:00 AM", last: "9:30 PM", frequency: "Every 10 mins (approx., trunk corridor)" },
    stops: ["Kurunegala", "Alawwa"],
    coords: [{ lat: 7.4818, lng: 80.3609 }, { lat: 7.2833, lng: 80.2167 }]
  },
  "kurunegala-anuradhapura": {
    normal: { bus: "No. 15", fare: "Rs. 347", duration: "2 hrs" },
    ac: { bus: "No. 15 - AC", fare: "Rs. 650", duration: "1.5 hrs" },
    timing: { first: "5:30 AM", last: "8:00 PM", frequency: "Every 30 mins" },
    stops: ["Kurunegala", "Dambulla", "Anuradhapura"],
    coords: [{ lat: 7.4818, lng: 80.3609 }, { lat: 8.3114, lng: 80.4037 }]
  },
  "kurunegala-kandy": {
    normal: { bus: "No. 1", fare: "Rs. 232", duration: "1.5 hrs" },
    ac: { bus: "No. 1 - AC", fare: "Rs. 437", duration: "1 hr" },
    timing: { first: "5:30 AM", last: "9:00 PM", frequency: "Every 20 mins" },
    stops: ["Kurunegala", "Alawwa", "Kandy"],
    coords: [{ lat: 7.4818, lng: 80.3609 }, { lat: 7.2906, lng: 80.6337 }]
  },

  // ============ RATNAPURA ROUTES ============
  "ratnapura-badulla": {
    normal: { bus: "No. 98", fare: "Rs. 414", duration: "3 hrs" },
    ac: { bus: "No. 98 - AC", fare: "Rs. 777", duration: "2.5 hrs" },
    timing: { first: "6:00 AM", last: "6:00 PM", frequency: "Every 1 hour" },
    stops: ["Ratnapura", "Pelmadulla", "Wellawaya", "Badulla"],
    coords: [{ lat: 6.6828, lng: 80.3992 }, { lat: 6.9934, lng: 81.0550 }]
  },
  "ratnapura-galle": {
    normal: { bus: "No. 32/3", fare: "Rs. 349", duration: "2.5 hrs" },
    ac: { bus: "No. 32/3 - AC", fare: "Rs. 655", duration: "2 hrs" },
    timing: { first: "6:00 AM", last: "6:30 PM", frequency: "Every 1 hour" },
    stops: ["Ratnapura", "Elpitiya", "Galle"],
    coords: [{ lat: 6.6828, lng: 80.3992 }, { lat: 6.0535, lng: 80.2210 }]
  },
  "ratnapura-kegalle": {
    normal: { bus: "No. 98", fare: "Rs. 174", duration: "1 hr" },
    ac: { bus: "No. 98 - AC", fare: "Rs. 326", duration: "45 mins" },
    timing: { first: "6:00 AM", last: "8:00 PM", frequency: "Every 20 mins" },
    stops: ["Ratnapura", "Avissawella", "Kegalle"],
    coords: [{ lat: 6.6828, lng: 80.3992 }, { lat: 7.2513, lng: 80.3464 }]
  },

  // Kuruwita and Eheliyagoda confirmed on the same corridor (nextbus.lk: "Avissawella,
  // Eheliyagoda, Kuruwita, Ratnapura, Pelmadulla"). Pelmadulla and Balangoda confirmed on the
  // Ratnapura-Beragala-Bandarawela corridor. Kalawana confirmed direct (Route 473/7, 482, and the
  // long corridor "...Kalawana Ratnapura Pelmadulla Balangoda..."). Embilipitiya confirmed via
  // Route 210 (77.6km) with real "every 20 minutes" frequency (rome2rio).
  "ratnapura-kuruwita": {
    normal: { bus: "Local service", fare: "Rs. 34 (est.)", duration: "10 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 35 (est.)", duration: "8 mins" },
    timing: { first: "5:00 AM", last: "9:30 PM", frequency: "Every 10 mins" },
    stops: ["Ratnapura", "Kuruwita"],
    coords: [{ lat: 6.6828, lng: 80.3992 }, { lat: 6.7897, lng: 80.3717 }]
  },
  "ratnapura-pelmadulla": {
    normal: { bus: "Local service", fare: "Rs. 37 (est.)", duration: "20 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 70 (est.)", duration: "15 mins" },
    timing: { first: "5:00 AM", last: "9:00 PM", frequency: "Every 15 mins" },
    stops: ["Ratnapura", "Pelmadulla"],
    coords: [{ lat: 6.6828, lng: 80.3992 }, { lat: 6.5992, lng: 80.5375 }]
  },
  "ratnapura-eheliyagoda": {
    normal: { bus: "Local service", fare: "Rs. 75 (est.)", duration: "35 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 145 (est.)", duration: "25 mins" },
    timing: { first: "5:00 AM", last: "9:00 PM", frequency: "Every 15 mins" },
    stops: ["Ratnapura", "Kuruwita", "Eheliyagoda"],
    coords: [{ lat: 6.6828, lng: 80.3992 }, { lat: 6.8483, lng: 80.2597 }]
  },
  "ratnapura-balangoda": {
    normal: { bus: "Local service", fare: "Rs. 90 (est.)", duration: "45 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 175 (est.)", duration: "35 mins" },
    timing: { first: "5:00 AM", last: "8:30 PM", frequency: "Every 20 mins" },
    stops: ["Ratnapura", "Pelmadulla", "Balangoda"],
    coords: [{ lat: 6.6828, lng: 80.3992 }, { lat: 6.6547, lng: 80.7028 }]
  },
  "ratnapura-kalawana": {
    normal: { bus: "No. 473/7", fare: "Rs. 105 (est.)", duration: "50 mins" },
    ac: { bus: "No. 473/7 - AC", fare: "Rs. 200 (est.)", duration: "40 mins" },
    timing: { first: "5:00 AM", last: "8:00 PM", frequency: "Every 30 mins (approx.)" },
    stops: ["Ratnapura", "Kalawana"],
    coords: [{ lat: 6.6828, lng: 80.3992 }, { lat: 6.5486, lng: 80.3672 }]
  },
  "ratnapura-embilipitiya": {
    normal: { bus: "No. 210", fare: "Rs. 235 (est.)", duration: "2 hrs" },
    ac: { bus: "No. 210 - AC", fare: "Rs. 445 (est.)", duration: "1.5 hrs" },
    timing: { first: "5:00 AM", last: "8:00 PM", frequency: "Every 20 mins" },
    stops: ["Ratnapura", "Pelmadulla", "Balangoda", "Embilipitiya"],
    coords: [{ lat: 6.6828, lng: 80.3992 }, { lat: 6.3439, lng: 80.8500 }]
  },

  // ============ VAVUNIYA ROUTES ============
  "vavuniya-jaffna": {
    normal: { bus: "No. 15", fare: "Rs. 540", duration: "2 hrs" },
    ac: { bus: "No. 15 - AC", fare: "Rs. 1,013", duration: "1.5 hrs" },
    timing: { first: "5:30 AM", last: "7:30 PM", frequency: "Every 30 mins" },
    stops: ["Vavuniya", "Kilinochchi", "Jaffna"],
    coords: [{ lat: 8.7514, lng: 80.4971 }, { lat: 9.6615, lng: 80.0255 }]
  },
  "vavuniya-anuradhapura": {
    normal: { bus: "No. 15", fare: "Rs. 289", duration: "1.5 hrs" },
    ac: { bus: "No. 15 - AC", fare: "Rs. 542", duration: "1 hr" },
    timing: { first: "5:30 AM", last: "8:00 PM", frequency: "Every 30 mins" },
    stops: ["Vavuniya", "Anuradhapura"],
    coords: [{ lat: 8.7514, lng: 80.4971 }, { lat: 8.3114, lng: 80.4037 }]
  },

  // Cheddikulam confirmed on the Vavuniya-Colombo Route 87/EX03 corridor, distance 31km sourced
  // (distancesfrom.com). Nedunkerni confirmed as a Vavuniya-district town linking Puliyankulam
  // with Mullaitivu (Wikipedia); distance is well-established real geography.
  "vavuniya-cheddikulam": {
    normal: { bus: "No. 87", fare: "Rs. 90 (est.)", duration: "35 mins" },
    ac: { bus: "No. 87 - AC", fare: "Rs. 170 (est.)", duration: "30 mins" },
    timing: { first: "5:30 AM", last: "8:00 PM", frequency: "Every 30 mins" },
    stops: ["Vavuniya", "Cheddikulam"],
    coords: [{ lat: 8.7514, lng: 80.4971 }, { lat: 8.6667, lng: 80.3000 }]
  },
  "vavuniya-nedunkerni": {
    normal: { bus: "Local service", fare: "Rs. 115 (est.)", duration: "50 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 220 (est.)", duration: "40 mins" },
    timing: { first: "5:30 AM", last: "7:00 PM", frequency: "Every 45 mins (approx.)" },
    stops: ["Vavuniya", "Nedunkerni"],
    coords: [{ lat: 8.7514, lng: 80.4971 }, { lat: 9.0614, lng: 80.6609 }]
  },

  // ============ MANNAR ROUTES ============
  "mannar-anuradhapura": {
    normal: { bus: "No. 87", fare: "Rs. 414", duration: "2.5 hrs" },
    ac: { bus: "No. 87 - AC", fare: "Rs. 777", duration: "2 hrs" },
    timing: { first: "6:00 AM", last: "5:30 PM", frequency: "Every 1 hour" },
    stops: ["Mannar", "Medawachchiya", "Anuradhapura"],
    coords: [{ lat: 8.9810, lng: 79.9044 }, { lat: 8.3114, lng: 80.4037 }]
  },

  // NTC Route 87 (official timetable PDF, ntc.gov.lk) confirms the exact stop sequence:
  // ...Medawachchiya-Mankulam-Cheddikulam-Madhu Road-Murunkan-Mannar-Pesalai.
  "mannar-complain": {
    normal: { bus: "No. 87", fare: "Rs. 85 (est.)", duration: "35 mins" },
    ac: { bus: "No. 87 - AC", fare: "Rs. 155 (est.)", duration: "30 mins" },
    timing: { first: "5:30 AM", last: "7:30 PM", frequency: "Every 30 mins (approx.)" },
    stops: ["Mannar", "Murunkan"],
    coords: [{ lat: 8.9810, lng: 79.9044 }, { lat: 8.9333, lng: 80.1000 }]
  },
  "mannar-madhu": {
    normal: { bus: "No. 87", fare: "Rs. 105 (est.)", duration: "45 mins" },
    ac: { bus: "No. 87 - AC", fare: "Rs. 195 (est.)", duration: "35 mins" },
    timing: { first: "5:30 AM", last: "7:00 PM", frequency: "Every 30 mins (approx.)" },
    stops: ["Mannar", "Murunkan", "Madhu"],
    coords: [{ lat: 8.9810, lng: 79.9044 }, { lat: 8.9333, lng: 80.1667 }]
  },
  // Nanattan is a confirmed Mannar-district DS division (Wikipedia); no dedicated route number
  // found — distance is well-established real geography.
  "mannar-nanattan": {
    normal: { bus: "Local service", fare: "Rs. 45 (est.)", duration: "20 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 85 (est.)", duration: "15 mins" },
    timing: { first: "5:30 AM", last: "8:00 PM", frequency: "Every 30 mins (approx.)" },
    stops: ["Mannar", "Nanattan"],
    coords: [{ lat: 8.9810, lng: 79.9044 }, { lat: 8.8500, lng: 79.9833 }]
  },

  // ============ PUTTALAM ROUTES ============
  // Distance (81km), duration (~1hr), and frequency (3x/day, operator NCG Express) sourced.
  // Exact departure times not published — spaced across the day as a reasonable spread, marked approx.
  // Fare estimated using this app's own puttalam-negombo rate (same coastal corridor) — not confirmed.
  "puttalam-wennappuwa": {
    normal: { bus: "NCG Express", fare: "Rs. 250 (est.)", duration: "1 hr" },
    ac: { bus: "NCG Express - AC", fare: "Rs. 470 (est.)", duration: "1 hr" },
    timing: { first: "7:00 AM", last: "4:00 PM", frequency: "Every 4.5 hours (approx., 3 buses/day)" },
    stops: ["Puttalam", "Chilaw", "Wennappuwa"],
    coords: [{ lat: 8.0408, lng: 79.8394 }, { lat: 7.3500, lng: 79.8419 }]
  },

  // Distance/duration sourced (Rome2Rio). Frequency inferred from the same coastal-corridor
  // NCG Express service (Puttalam-Mahawewa, twice daily) — nearby but not route-identical, so
  // flagged approx. Fares are calibrated estimates (this app's puttalam-negombo Rs/km), not
  // independently confirmed.
  "puttalam-marawila": {
    normal: { bus: "NCG Express", fare: "Rs. 230 (est.)", duration: "55 mins" },
    ac: { bus: "NCG Express - AC", fare: "Rs. 430 (est.)", duration: "55 mins" },
    timing: { first: "7:00 AM", last: "5:00 PM", frequency: "Every 5 hours (approx., twice daily)" },
    stops: ["Puttalam", "Chilaw", "Marawila"],
    coords: [{ lat: 8.0408, lng: 79.8394 }, { lat: 7.4258, lng: 79.8306 }]
  },

  "puttalam-nattandiya": {
    normal: { bus: "NCG Express", fare: "Rs. 235 (est.)", duration: "59 mins" },
    ac: { bus: "NCG Express - AC", fare: "Rs. 440 (est.)", duration: "59 mins" },
    timing: { first: "7:00 AM", last: "5:00 PM", frequency: "Every 5 hours (approx., twice daily)" },
    stops: ["Puttalam", "Chilaw", "Nattandiya"],
    coords: [{ lat: 8.0408, lng: 79.8394 }, { lat: 7.4083, lng: 79.8556 }]
  },

  "puttalam-negombo": {
    normal: { bus: "No. 4", fare: "Rs. 289", duration: "2 hrs" },
    ac: { bus: "No. 4 - AC", fare: "Rs. 542", duration: "1.5 hrs" },
    timing: { first: "5:30 AM", last: "8:00 PM", frequency: "Every 30 mins" },
    stops: ["Puttalam", "Chilaw", "Negombo"],
    coords: [{ lat: 8.0408, lng: 79.8394 }, { lat: 7.2097, lng: 79.8350 }]
  },

  // ============ KALUTARA ROUTES ============
  "kalutara-galle": {
    normal: { bus: "No. 2", fare: "Rs. 289", duration: "1.5 hrs" },
    ac: { bus: "No. 2 - AC", fare: "Rs. 542", duration: "1 hr" },
    timing: { first: "5:00 AM", last: "9:30 PM", frequency: "Every 15 mins" },
    stops: ["Kalutara", "Aluthgama", "Bentota", "Galle"],
    coords: [{ lat: 6.5854, lng: 79.9607 }, { lat: 6.0535, lng: 80.2210 }]
  },

  // Route No. 400, verified (routemaster.lk exact stop list): Pettah-...-Panadura-Wadduwa-
  // Waskaduwa-Kalutara-Katukurunda-Payagala-Maggona-Beruwala-Aluthgama. Panadura already a stop
  // on this app's own colombo-kalutara entry.
  "kalutara-panadura": {
    normal: { bus: "No. 400", fare: "Rs. 75 (est.)", duration: "25 mins" },
    ac: { bus: "No. 400 - AC", fare: "Rs. 100 (est.)", duration: "20 mins" },
    timing: { first: "5:00 AM", last: "10:00 PM", frequency: "Every 10 mins" },
    stops: ["Kalutara", "Panadura"],
    coords: [{ lat: 6.5854, lng: 79.9607 }, { lat: 6.7132, lng: 79.9026 }]
  },
  "kalutara-wadduwa": {
    normal: { bus: "No. 400", fare: "Rs. 40 (est.)", duration: "15 mins" },
    ac: { bus: "No. 400 - AC", fare: "Rs. 55 (est.)", duration: "10 mins" },
    timing: { first: "5:00 AM", last: "10:00 PM", frequency: "Every 10 mins" },
    stops: ["Kalutara", "Wadduwa"],
    coords: [{ lat: 6.5854, lng: 79.9607 }, { lat: 6.6667, lng: 79.9333 }]
  },
  "kalutara-beruwala": {
    normal: { bus: "No. 400", fare: "Rs. 50 (est.)", duration: "20 mins" },
    ac: { bus: "No. 400 - AC", fare: "Rs. 70 (est.)", duration: "15 mins" },
    timing: { first: "5:00 AM", last: "9:30 PM", frequency: "Every 15 mins (approx.)" },
    stops: ["Kalutara", "Beruwala"],
    coords: [{ lat: 6.5854, lng: 79.9607 }, { lat: 6.4789, lng: 79.9828 }]
  },
  "kalutara-aluthgama": {
    normal: { bus: "No. 400", fare: "Rs. 90 (est.)", duration: "30 mins" },
    ac: { bus: "No. 400 - AC", fare: "Rs. 120 (est.)", duration: "25 mins" },
    timing: { first: "5:00 AM", last: "9:30 PM", frequency: "Every 15 mins (approx.)" },
    stops: ["Kalutara", "Beruwala", "Aluthgama"],
    coords: [{ lat: 6.5854, lng: 79.9607 }, { lat: 6.4333, lng: 80.0000 }]
  },
  "kalutara-bentota": {
    normal: { bus: "No. 400", fare: "Rs. 100 (est.)", duration: "35 mins" },
    ac: { bus: "No. 400 - AC", fare: "Rs. 135 (est.)", duration: "30 mins" },
    timing: { first: "5:00 AM", last: "9:30 PM", frequency: "Every 15 mins (approx.)" },
    stops: ["Kalutara", "Beruwala", "Aluthgama", "Bentota"],
    coords: [{ lat: 6.5854, lng: 79.9607 }, { lat: 6.4260, lng: 80.0037 }]
  },
  // Route No. 420, confirmed (ceylonlanka.info); already a stop on this app's own kalutara-ratnapura entry.
  "kalutara-horana": {
    normal: { bus: "No. 420", fare: "Rs. 100 (est.)", duration: "35 mins" },
    ac: { bus: "No. 420 - AC", fare: "Rs. 135 (est.)", duration: "30 mins" },
    timing: { first: "5:00 AM", last: "9:30 PM", frequency: "Every 15 mins (approx.)" },
    stops: ["Kalutara", "Horana"],
    coords: [{ lat: 6.5854, lng: 79.9607 }, { lat: 6.7147, lng: 80.0631 }]
  },
  // Route No. 430, confirmed (ceylonlanka.info); distance confirmed 21km (citymeter.net).
  "kalutara-matugama": {
    normal: { bus: "No. 430", fare: "Rs. 105 (est.)", duration: "40 mins" },
    ac: { bus: "No. 430 - AC", fare: "Rs. 140 (est.)", duration: "30 mins" },
    timing: { first: "5:00 AM", last: "9:00 PM", frequency: "Every 15 mins (approx.)" },
    stops: ["Kalutara", "Matugama"],
    coords: [{ lat: 6.5854, lng: 79.9607 }, { lat: 6.5333, lng: 80.1167 }]
  },
  // Agalawatta confirmed just past Matugama on the same corridor (nextbus.lk: "Aluthgama Welipenna
  // Matugama Agalawatta Kalawana Ratnapura...").
  "kalutara-agalawatta": {
    normal: { bus: "Local service", fare: "Rs. 155 (est.)", duration: "55 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 210 (est.)", duration: "45 mins" },
    timing: { first: "5:00 AM", last: "8:30 PM", frequency: "Every 20 mins (approx.)" },
    stops: ["Kalutara", "Matugama", "Agalawatta"],
    coords: [{ lat: 6.5854, lng: 79.9607 }, { lat: 6.4167, lng: 80.1333 }]
  },
  // Ingiriya reached via the Horana direction (EverybodyWiki: "...Bandaragama, Horana, Ingiriya...").
  "kalutara-ingiriya": {
    normal: { bus: "Local service", fare: "Rs. 150 (est.)", duration: "50 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 205 (est.)", duration: "40 mins" },
    timing: { first: "5:00 AM", last: "8:30 PM", frequency: "Every 20 mins (approx.)" },
    stops: ["Kalutara", "Horana", "Ingiriya"],
    coords: [{ lat: 6.5854, lng: 79.9607 }, { lat: 6.8167, lng: 80.1333 }]
  },
  "kalutara-ratnapura": {
    normal: { bus: "No. 98", fare: "Rs. 232", duration: "1.5 hrs" },
    ac: { bus: "No. 98 - AC", fare: "Rs. 437", duration: "1 hr" },
    timing: { first: "6:00 AM", last: "7:30 PM", frequency: "Every 30 mins" },
    stops: ["Kalutara", "Horana", "Ratnapura"],
    coords: [{ lat: 6.5854, lng: 79.9607 }, { lat: 6.6828, lng: 80.3992 }]
  },

  // ============ NUWARA ELIYA ROUTES ============
  "nuwara eliya-badulla": {
    normal: { bus: "No. 98", fare: "Rs. 232", duration: "2 hrs" },
    ac: { bus: "No. 98 - AC", fare: "Rs. 437", duration: "1.5 hrs" },
    timing: { first: "6:00 AM", last: "6:00 PM", frequency: "Every 45 mins" },
    stops: ["Nuwara Eliya", "Welimada", "Badulla"],
    coords: [{ lat: 6.9497, lng: 80.7891 }, { lat: 6.9934, lng: 81.0550 }]
  },
  "nuwara eliya-kandy": {
    normal: { bus: "No. 98", fare: "Rs. 232", duration: "2 hrs" },
    ac: { bus: "No. 98 - AC", fare: "Rs. 437", duration: "1.5 hrs" },
    timing: { first: "6:00 AM", last: "7:00 PM", frequency: "Every 30 mins" },
    stops: ["Nuwara Eliya", "Gampola", "Kandy"],
    coords: [{ lat: 6.9497, lng: 80.7891 }, { lat: 7.2906, lng: 80.6337 }]
  },

  // Wikipedia-confirmed: the A7 trunk road (Avissawella-Nuwara Eliya) passes through Ginigathena,
  // Hatton, Talawakele, Nanuoya to reach Nuwara Eliya — a busy tea-estate/tourist highway.
  "nuwara eliya-talawakele": {
    normal: { bus: "Trunk corridor buses", fare: "Rs. 40 (est.)", duration: "40 mins" },
    ac: { bus: "Trunk corridor buses - AC", fare: "Rs. 80 (est.)", duration: "30 mins" },
    timing: { first: "5:30 AM", last: "8:00 PM", frequency: "Every 20 mins (approx., trunk corridor)" },
    stops: ["Nuwara Eliya", "Talawakele"],
    coords: [{ lat: 6.9497, lng: 80.7891 }, { lat: 6.9333, lng: 80.6583 }]
  },
  "nuwara eliya-hatton": {
    normal: { bus: "Trunk corridor buses", fare: "Rs. 70 (est.)", duration: "1 hr" },
    ac: { bus: "Trunk corridor buses - AC", fare: "Rs. 130 (est.)", duration: "45 mins" },
    timing: { first: "5:30 AM", last: "8:00 PM", frequency: "Every 20 mins (approx., trunk corridor)" },
    stops: ["Nuwara Eliya", "Talawakele", "Hatton"],
    coords: [{ lat: 6.9497, lng: 80.7891 }, { lat: 6.8917, lng: 80.5958 }]
  },
  "nuwara eliya-kotagala": {
    normal: { bus: "Trunk corridor buses", fare: "Rs. 50 (est.)", duration: "30 mins" },
    ac: { bus: "Trunk corridor buses - AC", fare: "Rs. 100 (est.)", duration: "25 mins" },
    timing: { first: "5:30 AM", last: "8:00 PM", frequency: "Every 20 mins (approx., trunk corridor)" },
    stops: ["Nuwara Eliya", "Talawakele", "Kotagala"],
    coords: [{ lat: 6.9497, lng: 80.7891 }, { lat: 6.9333, lng: 80.6167 }]
  },
  // Maskeliya and Norwood are confirmed SLTB Nuwara Eliya depot service areas, reached via Hatton.
  "nuwara eliya-maskeliya": {
    normal: { bus: "Local service", fare: "Rs. 85 (est.)", duration: "1 hr 15 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 165 (est.)", duration: "1 hr" },
    timing: { first: "5:30 AM", last: "7:00 PM", frequency: "Every 30 mins (approx.)" },
    stops: ["Nuwara Eliya", "Hatton", "Maskeliya"],
    coords: [{ lat: 6.9497, lng: 80.7891 }, { lat: 6.8394, lng: 80.5578 }]
  },
  "nuwara eliya-norwood": {
    normal: { bus: "Local service", fare: "Rs. 100 (est.)", duration: "1 hr 20 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 190 (est.)", duration: "1 hr 5 mins" },
    timing: { first: "5:30 AM", last: "7:00 PM", frequency: "Every 30 mins (approx.)" },
    stops: ["Nuwara Eliya", "Hatton", "Norwood"],
    coords: [{ lat: 6.9497, lng: 80.7891 }, { lat: 6.8167, lng: 80.5667 }]
  },
  "nuwara eliya-ginigathena": {
    normal: { bus: "Trunk corridor buses", fare: "Rs. 130 (est.)", duration: "1 hr 30 mins" },
    ac: { bus: "Trunk corridor buses - AC", fare: "Rs. 250 (est.)", duration: "1 hr 10 mins" },
    timing: { first: "5:30 AM", last: "7:30 PM", frequency: "Every 30 mins (approx., trunk corridor)" },
    stops: ["Nuwara Eliya", "Hatton", "Ginigathena"],
    coords: [{ lat: 6.9497, lng: 80.7891 }, { lat: 7.0500, lng: 80.4667 }]
  },
  "nuwara eliya-walapane": {
    normal: { bus: "Local service", fare: "Rs. 80 (est.)", duration: "50 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 155 (est.)", duration: "40 mins" },
    timing: { first: "5:30 AM", last: "7:30 PM", frequency: "Every 30 mins (approx.)" },
    stops: ["Nuwara Eliya", "Walapane"],
    coords: [{ lat: 6.9497, lng: 80.7891 }, { lat: 7.0833, lng: 80.8833 }]
  },

  // ============ MONARAGALA ROUTES ============
  "monaragala-badulla": {
    normal: { bus: "No. 99", fare: "Rs. 202", duration: "1.5 hrs" },
    ac: { bus: "No. 99 - AC", fare: "Rs. 379", duration: "1 hr" },
    timing: { first: "6:00 AM", last: "6:30 PM", frequency: "Every 1 hour" },
    stops: ["Monaragala", "Wellawaya", "Badulla"],
    coords: [{ lat: 6.8728, lng: 81.3507 }, { lat: 6.9934, lng: 81.0550 }]
  },
  "monaragala-hambantota": {
    normal: { bus: "No. 99", fare: "Rs. 347", duration: "2.5 hrs" },
    ac: { bus: "No. 99 - AC", fare: "Rs. 650", duration: "2 hrs" },
    timing: { first: "6:00 AM", last: "5:30 PM", frequency: "Every 1 hour" },
    stops: ["Monaragala", "Tissamaharama", "Hambantota"],
    coords: [{ lat: 6.8728, lng: 81.3507 }, { lat: 6.1429, lng: 81.1212 }]
  },

  // Well-documented A4/A22 corridor (nextbus.lk, bustimetable.lk, multiple operators): the exact
  // real sequence is Monaragala-Buttala-Wellawaya one direction, Monaragala-Siyambalanduwa the
  // other, and Kataragama-Buttala-Monaragala-Bibile-Mahiyanganaya on the third.
  "monaragala-buttala": {
    normal: { bus: "Local service", fare: "Rs. 65 (est.)", duration: "25 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 120 (est.)", duration: "20 mins" },
    timing: { first: "5:00 AM", last: "8:30 PM", frequency: "Every 20 mins" },
    stops: ["Monaragala", "Buttala"],
    coords: [{ lat: 6.8728, lng: 81.3507 }, { lat: 6.7667, lng: 81.2333 }]
  },
  "monaragala-wellawaya": {
    normal: { bus: "Local service", fare: "Rs. 95 (est.)", duration: "40 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 180 (est.)", duration: "30 mins" },
    timing: { first: "5:00 AM", last: "8:30 PM", frequency: "Every 20 mins" },
    stops: ["Monaragala", "Buttala", "Wellawaya"],
    coords: [{ lat: 6.8728, lng: 81.3507 }, { lat: 6.7333, lng: 81.1000 }]
  },
  "monaragala-siyambalanduwa": {
    normal: { bus: "Local service", fare: "Rs. 80 (est.)", duration: "35 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 150 (est.)", duration: "25 mins" },
    timing: { first: "5:00 AM", last: "8:00 PM", frequency: "Every 30 mins (approx.)" },
    stops: ["Monaragala", "Siyambalanduwa"],
    coords: [{ lat: 6.8728, lng: 81.3507 }, { lat: 7.0333, lng: 81.5333 }]
  },
  "monaragala-bibile": {
    normal: { bus: "Local service", fare: "Rs. 110 (est.)", duration: "50 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 210 (est.)", duration: "40 mins" },
    timing: { first: "5:30 AM", last: "7:30 PM", frequency: "Every 30 mins (approx.)" },
    stops: ["Monaragala", "Bibile"],
    coords: [{ lat: 6.8728, lng: 81.3507 }, { lat: 7.1667, lng: 81.2167 }]
  },
  "monaragala-kataragama": {
    normal: { bus: "Local service", fare: "Rs. 160 (est.)", duration: "1 hr 15 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 300 (est.)", duration: "1 hr" },
    timing: { first: "5:00 AM", last: "7:00 PM", frequency: "Every 30 mins (approx.)" },
    stops: ["Monaragala", "Buttala", "Kataragama"],
    coords: [{ lat: 6.8728, lng: 81.3507 }, { lat: 6.4149, lng: 81.3322 }]
  },

  // ============ AMPARA ROUTES ============
  "ampara-batticaloa": {
    normal: { bus: "No. 68", fare: "Rs. 202", duration: "1.5 hrs" },
    ac: { bus: "No. 68 - AC", fare: "Rs. 379", duration: "1 hr" },
    timing: { first: "5:30 AM", last: "7:00 PM", frequency: "Every 30 mins" },
    stops: ["Ampara", "Kalmunai", "Batticaloa"],
    coords: [{ lat: 7.2811, lng: 81.6747 }, { lat: 7.7310, lng: 81.6747 }]
  },

  // Sammanthurai and Uhana confirmed directly on the Dilanka Express corridor through Ampara
  // (bustimetable.lk: Nintavur-Karaitivu-Samanthurai-Ampara-Uhana-MahaOya-...-Kandy-Colombo).
  "ampara-sammanthurai": {
    normal: { bus: "Local service", fare: "Rs. 50 (est.)", duration: "25 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 90 (est.)", duration: "20 mins" },
    timing: { first: "5:00 AM", last: "9:00 PM", frequency: "Every 20 mins (approx.)" },
    stops: ["Ampara", "Sammanthurai"],
    coords: [{ lat: 7.2811, lng: 81.6747 }, { lat: 7.3717, lng: 81.8181 }]
  },
  "ampara-uhana": {
    normal: { bus: "Local service", fare: "Rs. 34 (est.)", duration: "15 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 48 (est.)", duration: "10 mins" },
    timing: { first: "5:00 AM", last: "9:30 PM", frequency: "Every 15 mins (approx.)" },
    stops: ["Ampara", "Uhana"],
    coords: [{ lat: 7.2811, lng: 81.6747 }, { lat: 7.3333, lng: 81.6167 }]
  },
  // Akkaraipattu, Pottuvil, and Lahugala are all confirmed on the same long-distance corridor
  // (nextbus.lk: Akkaraipattu-Thirukkovil-Komari-Pottuvil-Lahugala-Siyambalanduwa-Monaragala...).
  "ampara-akkaraipattu": {
    normal: { bus: "Local service", fare: "Rs. 95 (est.)", duration: "45 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 180 (est.)", duration: "35 mins" },
    timing: { first: "5:00 AM", last: "8:30 PM", frequency: "Every 20 mins (approx.)" },
    stops: ["Ampara", "Sammanthurai", "Akkaraipattu"],
    coords: [{ lat: 7.2811, lng: 81.6747 }, { lat: 7.2167, lng: 81.8500 }]
  },
  "ampara-lahugala": {
    normal: { bus: "Local service", fare: "Rs. 175 (est.)", duration: "1 hr 20 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 330 (est.)", duration: "1 hr" },
    timing: { first: "5:30 AM", last: "7:00 PM", frequency: "Every 30 mins (approx.)" },
    stops: ["Ampara", "Akkaraipattu", "Lahugala"],
    coords: [{ lat: 7.2811, lng: 81.6747 }, { lat: 6.9167, lng: 81.6333 }]
  },
  "ampara-pottuvil": {
    normal: { bus: "Local service", fare: "Rs. 210 (est.)", duration: "1 hr 45 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 390 (est.)", duration: "1 hr 20 mins" },
    timing: { first: "5:30 AM", last: "7:00 PM", frequency: "Every 30 mins (approx.)" },
    stops: ["Ampara", "Akkaraipattu", "Lahugala", "Pottuvil"],
    coords: [{ lat: 7.2811, lng: 81.6747 }, { lat: 6.8667, lng: 81.8333 }]
  },
  "ampara-monaragala": {
    normal: { bus: "No. 99", fare: "Rs. 289", duration: "2 hrs" },
    ac: { bus: "No. 99 - AC", fare: "Rs. 542", duration: "1.5 hrs" },
    timing: { first: "6:00 AM", last: "5:30 PM", frequency: "Every 1 hour" },
    stops: ["Ampara", "Monaragala"],
    coords: [{ lat: 7.2811, lng: 81.6747 }, { lat: 6.8728, lng: 81.3507 }]
  },

  // ============ KILINOCHCHI ROUTES ============
  "kilinochchi-vavuniya": {
    normal: { bus: "No. 15", fare: "Rs. 232", duration: "1 hr" },
    ac: { bus: "No. 15 - AC", fare: "Rs. 437", duration: "45 mins" },
    timing: { first: "5:30 AM", last: "7:30 PM", frequency: "Every 30 mins" },
    stops: ["Kilinochchi", "Vavuniya"],
    coords: [{ lat: 9.3803, lng: 80.3770 }, { lat: 8.7514, lng: 80.4971 }]
  },

  // Paranthan confirmed 5km from Kilinochchi, on the A9 highway (Wikipedia). Pooneryn confirmed
  // "30 minutes from [Kilinochchi] town by car" (Wikivoyage). Kandavalai is Paranthan's own DS
  // Division — essentially the same immediate area.
  "kilinochchi-paranthan": {
    normal: { bus: "Local service", fare: "Rs. 34 (est.)", duration: "10 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 40 (est.)", duration: "8 mins" },
    timing: { first: "5:30 AM", last: "9:00 PM", frequency: "Every 15 mins (approx.)" },
    stops: ["Kilinochchi", "Paranthan"],
    coords: [{ lat: 9.3803, lng: 80.3770 }, { lat: 9.4333, lng: 80.4000 }]
  },
  "kilinochchi-kandavalai": {
    normal: { bus: "Local service", fare: "Rs. 34 (est.)", duration: "15 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 46 (est.)", duration: "10 mins" },
    timing: { first: "5:30 AM", last: "8:30 PM", frequency: "Every 20 mins (approx.)" },
    stops: ["Kilinochchi", "Paranthan", "Kandavalai"],
    coords: [{ lat: 9.3803, lng: 80.3770 }, { lat: 9.4500, lng: 80.3833 }]
  },
  "kilinochchi-pooneryn": {
    normal: { bus: "Local service", fare: "Rs. 65 (est.)", duration: "30 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 120 (est.)", duration: "25 mins" },
    timing: { first: "5:30 AM", last: "7:30 PM", frequency: "Every 30 mins (approx.)" },
    stops: ["Kilinochchi", "Pooneryn"],
    coords: [{ lat: 9.3803, lng: 80.3770 }, { lat: 9.4667, lng: 80.1833 }]
  },

  // ============ MULLAITIVU ROUTES ============
  "mullaitivu-vavuniya": {
    normal: { bus: "No. 15/1", fare: "Rs. 347", duration: "2 hrs" },
    ac: { bus: "No. 15/1 - AC", fare: "Rs. 650", duration: "1.5 hrs" },
    timing: { first: "6:00 AM", last: "5:00 PM", frequency: "Every 2 hours" },
    stops: ["Mullaitivu", "Mankulam", "Vavuniya"],
    coords: [{ lat: 9.2671, lng: 80.8128 }, { lat: 8.7514, lng: 80.4971 }]
  },

  // Distances sourced (distancesfrom.com, Wikipedia A34 road article). Lakpura (travel guide)
  // confirms bus service exists connecting Puthukkudiyiruppu to Mullaitivu but explicitly notes
  // "limited public transport frequency" in this sparsely-served post-conflict region — reflected
  // in the lower frequency estimate below rather than assuming a busy corridor.
  "mullaitivu-puthukkudiyiruppu": {
    normal: { bus: "Local service", fare: "Rs. 60 (est.)", duration: "25 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 110 (est.)", duration: "20 mins" },
    timing: { first: "6:00 AM", last: "6:00 PM", frequency: "Every 1 hour (approx., limited service)" },
    stops: ["Mullaitivu", "Puthukkudiyiruppu"],
    coords: [{ lat: 9.2671, lng: 80.8128 }, { lat: 9.3000, lng: 80.6833 }]
  },
  "mullaitivu-oddusuddan": {
    normal: { bus: "Local service", fare: "Rs. 95 (est.)", duration: "40 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 175 (est.)", duration: "30 mins" },
    timing: { first: "6:00 AM", last: "5:30 PM", frequency: "Every 1.5 hours (approx., limited service)" },
    stops: ["Mullaitivu", "Puthukkudiyiruppu", "Oddusuddan"],
    coords: [{ lat: 9.2671, lng: 80.8128 }, { lat: 9.1500, lng: 80.6500 }]
  },

  // ============ GAMPAHA ROUTES ============
  "gampaha-negombo": {
    normal: { bus: "No. 4", fare: "Rs. 87", duration: "45 mins" },
    ac: { bus: "No. 4 - AC", fare: "Rs. 163", duration: "30 mins" },
    timing: { first: "5:00 AM", last: "10:00 PM", frequency: "Every 10 mins" },
    stops: ["Gampaha", "Ja-Ela", "Negombo"],
    coords: [{ lat: 7.0873, lng: 80.0144 }, { lat: 7.2097, lng: 79.8350 }]
  },
  "gampaha-kandy": {
    normal: { bus: "No. 1", fare: "Rs. 347", duration: "2 hrs" },
    ac: { bus: "No. 1 - AC", fare: "Rs. 650", duration: "1.5 hrs" },
    timing: { first: "5:30 AM", last: "9:00 PM", frequency: "Every 20 mins" },
    stops: ["Gampaha", "Kadawatha", "Nittambuwa", "Kandy"],
    coords: [{ lat: 7.0873, lng: 80.0144 }, { lat: 7.2906, lng: 80.6337 }]
  },

  // Route 277, confirmed (ceylonlanka.info): Ragama-Gampaha direct route.
  "gampaha-ragama": {
    normal: { bus: "No. 277", fare: "Rs. 34 (est.)", duration: "15 mins" },
    ac: { bus: "No. 277 - AC", fare: "Rs. 52 (est.)", duration: "10 mins" },
    timing: { first: "5:00 AM", last: "10:00 PM", frequency: "Every 10 mins (approx.)" },
    stops: ["Gampaha", "Ragama"],
    coords: [{ lat: 7.0873, lng: 80.0144 }, { lat: 7.0296, lng: 79.9187 }]
  },
  // Minuwangoda: main Route 5 (Colombo-Kurunegala) passes through it (Wikipedia-confirmed); also
  // directly linked to Divulapitiya via Route 265.
  "gampaha-minuwangoda": {
    normal: { bus: "Local service", fare: "Rs. 40 (est.)", duration: "20 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 75 (est.)", duration: "15 mins" },
    timing: { first: "5:00 AM", last: "9:30 PM", frequency: "Every 15 mins (approx.)" },
    stops: ["Gampaha", "Minuwangoda"],
    coords: [{ lat: 7.0873, lng: 80.0144 }, { lat: 7.1733, lng: 79.9619 }]
  },
  // Route 265, confirmed (ceylonlanka.info): Minuwangoda-Divulapitiya.
  "gampaha-divulapitiya": {
    normal: { bus: "No. 265", fare: "Rs. 60 (est.)", duration: "30 mins" },
    ac: { bus: "No. 265 - AC", fare: "Rs. 110 (est.)", duration: "25 mins" },
    timing: { first: "5:00 AM", last: "9:00 PM", frequency: "Every 20 mins (approx.)" },
    stops: ["Gampaha", "Minuwangoda", "Divulapitiya"],
    coords: [{ lat: 7.0873, lng: 80.0144 }, { lat: 7.2231, lng: 80.0022 }]
  },
  // Route 242, confirmed (ceylonlanka.info): Mirigama-Divulapitiya.
  "gampaha-mirigama": {
    normal: { bus: "No. 242", fare: "Rs. 60 (est.)", duration: "30 mins" },
    ac: { bus: "No. 242 - AC", fare: "Rs. 110 (est.)", duration: "25 mins" },
    timing: { first: "5:00 AM", last: "9:00 PM", frequency: "Every 20 mins (approx.)" },
    stops: ["Gampaha", "Mirigama"],
    coords: [{ lat: 7.0873, lng: 80.0144 }, { lat: 7.2500, lng: 80.1333 }]
  },
  // Route 225, confirmed (ceylonlanka.info): Kadawata-Ganemulla, same corridor into Gampaha.
  "gampaha-ganemulla": {
    normal: { bus: "No. 225", fare: "Rs. 34 (est.)", duration: "10 mins" },
    ac: { bus: "No. 225 - AC", fare: "Rs. 37 (est.)", duration: "10 mins" },
    timing: { first: "5:00 AM", last: "10:00 PM", frequency: "Every 10 mins (approx.)" },
    stops: ["Gampaha", "Ganemulla"],
    coords: [{ lat: 7.0873, lng: 80.0144 }, { lat: 7.0667, lng: 80.0500 }]
  },
  // Veyangoda and Nittambuwa are stops directly on the Colombo-Kandy trunk highway (A1) — this
  // app's own gampaha-kandy route already lists Nittambuwa as a stop. Rome2Rio independently
  // confirms buses through this corridor run "every 10 minutes" — used directly, not estimated.
  "gampaha-veyangoda": {
    normal: { bus: "Trunk corridor buses", fare: "Rs. 40 (est.)", duration: "20 mins" },
    ac: { bus: "Trunk corridor buses - AC", fare: "Rs. 75 (est.)", duration: "15 mins" },
    timing: { first: "5:00 AM", last: "10:00 PM", frequency: "Every 10 mins" },
    stops: ["Gampaha", "Veyangoda"],
    coords: [{ lat: 7.0873, lng: 80.0144 }, { lat: 7.1531, lng: 80.0350 }]
  },
  "gampaha-nittambuwa": {
    normal: { bus: "Trunk corridor buses", fare: "Rs. 34 (est.)", duration: "15 mins" },
    ac: { bus: "Trunk corridor buses - AC", fare: "Rs. 56 (est.)", duration: "10 mins" },
    timing: { first: "5:00 AM", last: "10:00 PM", frequency: "Every 10 mins" },
    stops: ["Gampaha", "Veyangoda", "Nittambuwa"],
    coords: [{ lat: 7.0873, lng: 80.0144 }, { lat: 7.1500, lng: 80.1000 }]
  },
  "gampaha-katunayake": {
    normal: { bus: "Local service", fare: "Rs. 60 (est.)", duration: "30 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 110 (est.)", duration: "25 mins" },
    timing: { first: "5:00 AM", last: "10:00 PM", frequency: "Every 15 mins (approx.)" },
    stops: ["Gampaha", "Minuwangoda", "Katunayake"],
    coords: [{ lat: 7.0873, lng: 80.0144 }, { lat: 7.1697, lng: 79.8842 }]
  },

  // ============ POLONNARUWA ROUTES ============
  "polonnaruwa-batticaloa": {
    normal: { bus: "No. 48", fare: "Rs. 414", duration: "2.5 hrs" },
    ac: { bus: "No. 48 - AC", fare: "Rs. 777", duration: "2 hrs" },
    timing: { first: "6:00 AM", last: "6:00 PM", frequency: "Every 1 hour" },
    stops: ["Polonnaruwa", "Valaichchenai", "Batticaloa"],
    coords: [{ lat: 7.9403, lng: 81.0188 }, { lat: 7.7310, lng: 81.6747 }]
  },

  // Kaduruwela is Polonnaruwa's modern "New Town" — essentially adjacent (route directory
  // literally calls it "Kaduruwela (Polonnaruwa)"). Route 52 confirmed: Kandy-Medirigiriya-
  // Hingurakgoda. Routes 48-4 (Medirigiriya-Colombo) and 48-6 (Hingurakgoda-Colombo) confirmed
  // via ceylonlanka.info route directory.
  "polonnaruwa-kaduruwela": {
    normal: { bus: "Local service", fare: "Rs. 34 (est.)", duration: "10 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 40 (est.)", duration: "8 mins" },
    timing: { first: "5:00 AM", last: "9:30 PM", frequency: "Every 10 mins (approx.)" },
    stops: ["Polonnaruwa", "Kaduruwela"],
    coords: [{ lat: 7.9403, lng: 81.0188 }, { lat: 7.9297, lng: 81.0158 }]
  },
  "polonnaruwa-hingurakgoda": {
    normal: { bus: "No. 48-6", fare: "Rs. 70 (est.)", duration: "30 mins" },
    ac: { bus: "No. 48-6 - AC", fare: "Rs. 125 (est.)", duration: "25 mins" },
    timing: { first: "5:00 AM", last: "8:30 PM", frequency: "Every 20 mins (approx.)" },
    stops: ["Polonnaruwa", "Kaduruwela", "Hingurakgoda"],
    coords: [{ lat: 7.9403, lng: 81.0188 }, { lat: 8.0500, lng: 80.9500 }]
  },
  "polonnaruwa-medirigiriya": {
    normal: { bus: "No. 48-4", fare: "Rs. 100 (est.)", duration: "45 mins" },
    ac: { bus: "No. 48-4 - AC", fare: "Rs. 190 (est.)", duration: "35 mins" },
    timing: { first: "5:00 AM", last: "8:00 PM", frequency: "Every 30 mins (approx.)" },
    stops: ["Polonnaruwa", "Hingurakgoda", "Medirigiriya"],
    coords: [{ lat: 7.9403, lng: 81.0188 }, { lat: 8.1505, lng: 80.9790 }]
  },
  // No published route number found for Lankapura — distance is well-established real geography.
  "polonnaruwa-lankapura": {
    normal: { bus: "Local service", fare: "Rs. 50 (est.)", duration: "25 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 95 (est.)", duration: "20 mins" },
    timing: { first: "5:30 AM", last: "8:00 PM", frequency: "Every 30 mins (approx.)" },
    stops: ["Polonnaruwa", "Lankapura"],
    coords: [{ lat: 7.9403, lng: 81.0188 }, { lat: 7.8500, lng: 81.0333 }]
  },
  "polonnaruwa-anuradhapura": {
    normal: { bus: "No. 49", fare: "Rs. 347", duration: "2 hrs" },
    ac: { bus: "No. 49 - AC", fare: "Rs. 650", duration: "1.5 hrs" },
    timing: { first: "5:30 AM", last: "7:00 PM", frequency: "Every 45 mins" },
    stops: ["Polonnaruwa", "Habarana", "Kekirawa", "Anuradhapura"],
    coords: [{ lat: 7.9403, lng: 81.0188 }, { lat: 8.3114, lng: 80.4037 }]
  },

  // ============ KEGALLE ROUTES ============
  "kegalle-kandy": {
    normal: { bus: "No. 96", fare: "Rs. 174", duration: "1 hr" },
    ac: { bus: "No. 96 - AC", fare: "Rs. 326", duration: "45 mins" },
    timing: { first: "5:30 AM", last: "9:00 PM", frequency: "Every 15 mins" },
    stops: ["Kegalle", "Mawanella", "Kandy"],
    coords: [{ lat: 7.2513, lng: 80.3464 }, { lat: 7.2906, lng: 80.6337 }]
  },
  "kegalle-ratnapura": {
    normal: { bus: "No. 98", fare: "Rs. 174", duration: "1 hr" },
    ac: { bus: "No. 98 - AC", fare: "Rs. 326", duration: "45 mins" },
    timing: { first: "6:00 AM", last: "8:00 PM", frequency: "Every 20 mins" },
    stops: ["Kegalle", "Avissawella", "Ratnapura"],
    coords: [{ lat: 7.2513, lng: 80.3464 }, { lat: 6.6828, lng: 80.3992 }]
  },

  // Route No. 1, verified via srilanka-information-zone.blogspot.com and NTC/Rome2Rio: the exact
  // Colombo-Kandy trunk corridor stop order is Kandy > Peradeniya > Mawanella > Kegalle >
  // Warakapola > ... > Colombo. NTC confirms buses run this corridor "every 10 minutes."
  "kegalle-mawanella": {
    normal: { bus: "No. 1", fare: "Rs. 45 (est.)", duration: "20 mins" },
    ac: { bus: "No. 1 - AC", fare: "Rs. 58 (est.)", duration: "15 mins" },
    timing: { first: "4:00 AM", last: "11:30 PM", frequency: "Every 10 mins" },
    stops: ["Kegalle", "Mawanella"],
    coords: [{ lat: 7.2513, lng: 80.3464 }, { lat: 7.2500, lng: 80.4500 }]
  },
  "kegalle-warakapola": {
    normal: { bus: "No. 1", fare: "Rs. 70 (est.)", duration: "30 mins" },
    ac: { bus: "No. 1 - AC", fare: "Rs. 95 (est.)", duration: "25 mins" },
    timing: { first: "4:00 AM", last: "11:30 PM", frequency: "Every 10 mins" },
    stops: ["Kegalle", "Warakapola"],
    coords: [{ lat: 7.2513, lng: 80.3464 }, { lat: 7.2261, lng: 80.1978 }]
  },
  // Rambukkana confirmed as a Kegalle-district hub town (Sabaragamuwa bus routes directory,
  // EverybodyWiki) and a rail junction; distance is well-established real geography.
  "kegalle-rambukkana": {
    normal: { bus: "Local service", fare: "Rs. 48 (est.)", duration: "20 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 64 (est.)", duration: "15 mins" },
    timing: { first: "5:00 AM", last: "9:30 PM", frequency: "Every 15 mins (approx.)" },
    stops: ["Kegalle", "Rambukkana"],
    coords: [{ lat: 7.2513, lng: 80.3464 }, { lat: 7.3333, lng: 80.4000 }]
  },
  // No published route number found for these 2 hill-country towns — distance is well-established
  // real geography, frequency/fare estimated conservatively.
  "kegalle-yatiyanthota": {
    normal: { bus: "Local service", fare: "Rs. 170 (est.)", duration: "1 hr" },
    ac: { bus: "Local service - AC", fare: "Rs. 225 (est.)", duration: "50 mins" },
    timing: { first: "5:30 AM", last: "7:30 PM", frequency: "Every 30 mins (approx.)" },
    stops: ["Kegalle", "Yatiyanthota"],
    coords: [{ lat: 7.2513, lng: 80.3464 }, { lat: 7.0833, lng: 80.3833 }]
  },
  "kegalle-dehiowita": {
    normal: { bus: "Local service", fare: "Rs. 190 (est.)", duration: "1 hr 10 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 255 (est.)", duration: "55 mins" },
    timing: { first: "5:30 AM", last: "7:30 PM", frequency: "Every 30 mins (approx.)" },
    stops: ["Kegalle", "Yatiyanthota", "Dehiowita"],
    coords: [{ lat: 7.2513, lng: 80.3464 }, { lat: 7.0667, lng: 80.3167 }]
  },

  // ============ MATALE ROUTES ============
  "matale-dambulla": {
    normal: { bus: "No. 6", fare: "Rs. 116", duration: "45 mins" },
    ac: { bus: "No. 6 - AC", fare: "Rs. 218", duration: "30 mins" },
    timing: { first: "5:30 AM", last: "9:00 PM", frequency: "Every 15 mins" },
    stops: ["Matale", "Sigiriya Junction", "Dambulla"],
    coords: [{ lat: 7.4675, lng: 80.6234 }, { lat: 7.8742, lng: 80.6511 }]
  },
  // Ukuwela confirmed 5.8km south of Matale (Wikipedia, precise). Galewela confirmed 19km
  // (distancesfrom.com) and on the real Matale-Dambulla-Kekirawa corridor. Rattota and Pallepola
  // distances from local bus-stop proximity data (near-place.com). Sigiriya Junction already a
  // stop on this app's own matale-dambulla route.
  "matale-ukuwela": {
    normal: { bus: "Local service", fare: "Rs. 34 (est.)", duration: "15 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 51 (est.)", duration: "10 mins" },
    timing: { first: "5:00 AM", last: "9:30 PM", frequency: "Every 15 mins (approx.)" },
    stops: ["Matale", "Ukuwela"],
    coords: [{ lat: 7.4675, lng: 80.6234 }, { lat: 7.4203, lng: 80.6339 }]
  },
  "matale-pallepola": {
    normal: { bus: "Local service", fare: "Rs. 55 (est.)", duration: "25 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 115 (est.)", duration: "20 mins" },
    timing: { first: "5:00 AM", last: "9:00 PM", frequency: "Every 20 mins (approx.)" },
    stops: ["Matale", "Pallepola"],
    coords: [{ lat: 7.4675, lng: 80.6234 }, { lat: 7.5333, lng: 80.5500 }]
  },
  "matale-rattota": {
    normal: { bus: "Local service", fare: "Rs. 65 (est.)", duration: "30 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 130 (est.)", duration: "25 mins" },
    timing: { first: "5:00 AM", last: "8:30 PM", frequency: "Every 20 mins (approx.)" },
    stops: ["Matale", "Pallepola", "Rattota"],
    coords: [{ lat: 7.4675, lng: 80.6234 }, { lat: 7.5667, lng: 80.6167 }]
  },
  "matale-galewela": {
    normal: { bus: "No. 6", fare: "Rs. 80 (est.)", duration: "35 mins" },
    ac: { bus: "No. 6 - AC", fare: "Rs. 165 (est.)", duration: "25 mins" },
    timing: { first: "5:00 AM", last: "9:00 PM", frequency: "Every 15 mins" },
    stops: ["Matale", "Galewela"],
    coords: [{ lat: 7.4675, lng: 80.6234 }, { lat: 7.7500, lng: 80.5667 }]
  },
  "matale-nalanda": {
    normal: { bus: "Local service", fare: "Rs. 130 (est.)", duration: "50 mins" },
    ac: { bus: "Local service - AC", fare: "Rs. 260 (est.)", duration: "40 mins" },
    timing: { first: "5:00 AM", last: "8:30 PM", frequency: "Every 20 mins (approx.)" },
    stops: ["Matale", "Naula", "Nalanda"],
    coords: [{ lat: 7.4675, lng: 80.6234 }, { lat: 7.6667, lng: 80.6833 }]
  },
  "matale-sigiriya": {
    normal: { bus: "No. 6", fare: "Rs. 130 (est.)", duration: "40 mins" },
    ac: { bus: "No. 6 - AC", fare: "Rs. 260 (est.)", duration: "30 mins" },
    timing: { first: "5:30 AM", last: "8:30 PM", frequency: "Every 15 mins" },
    stops: ["Matale", "Sigiriya Junction", "Sigiriya"],
    coords: [{ lat: 7.4675, lng: 80.6234 }, { lat: 7.9570, lng: 80.7603 }]
  },
};
function findRoute(from, to) {
  const key1 = `${from.toLowerCase()}-${to.toLowerCase()}`;
  const key2 = `${to.toLowerCase()}-${from.toLowerCase()}`;
  return busRoutes[key1] || busRoutes[key2] || null;
}

function App() {
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [chat, setChat] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [favorites, setFavorites] = useState(() => {
  const saved = localStorage.getItem('sl-bus-favorites');
  return saved ? JSON.parse(saved) : [];
});
const [routeStats, setRouteStats] = useState(() => {
  const saved = localStorage.getItem('sl-bus-stats');
  return saved ? JSON.parse(saved) : {};
});
const [nearbyStops, setNearbyStops] = useState([]);
const [locationLoading, setLocationLoading] = useState(false);
const [locationError, setLocationError] = useState('');
const [theme, setTheme] = useState(() => localStorage.getItem('sl-bus-theme') || 'dark');
const [showFullSchedule, setShowFullSchedule] = useState(false);

useEffect(() => {
  localStorage.setItem('sl-bus-theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
}, [theme]);

const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  useEffect(() => {
    if (window.google && mapRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: 7.8731, lng: 80.7718 },
        zoom: 7,
        styles: theme === 'dark' ? DARK_MAP_STYLES : LIGHT_MAP_STYLES,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setOptions({ styles: theme === 'dark' ? DARK_MAP_STYLES : LIGHT_MAP_STYLES });
    }
  }, [theme]);

  const handleSearch = () => {
  if (!from || !to) return;
  setShowFullSchedule(false);
  const route = findRoute(from, to);
  const key = `${from}-${to}`;
const newStats = { ...routeStats, [key]: (routeStats[key] || 0) + 1 };
setRouteStats(newStats);
localStorage.setItem('sl-bus-stats', JSON.stringify(newStats));
  if (route) {
    setResult(route);
    setNotFound(false);
    if (mapInstanceRef.current && route.coords) {
      const bounds = new window.google.maps.LatLngBounds();
      route.coords.forEach(coord => {
        new window.google.maps.Marker({
          position: coord,
          map: mapInstanceRef.current,
          icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 8, fillColor: "#38bdf8", fillOpacity: 1, strokeColor: "#fff", strokeWeight: 2 }
        });
        bounds.extend(coord);
      });
      new window.google.maps.Polyline({
        path: route.coords,
        geodesic: true,
        strokeColor: "#38bdf8",
        strokeOpacity: 0.8,
        strokeWeight: 3,
        map: mapInstanceRef.current,
      });
      mapInstanceRef.current.fitBounds(bounds);
    }
  } else {
    setResult(null);
    setNotFound(true);
  }
};
const handleFromChange = (e) => {
  const val = e.target.value;
  setFrom(val);
  const suggestions = searchLocations(val);
  setFromSuggestions(suggestions);
  setShowFromSuggestions(true);
};

const handleToChange = (e) => {
  const val = e.target.value;
  setTo(val);
  const suggestions = searchLocations(val);
  setToSuggestions(suggestions);
  setShowToSuggestions(true);
};

const selectFrom = (location) => {
  setFrom(location.name);
  setShowFromSuggestions(false);
};

const selectTo = (location) => {
  setTo(location.name);
  setShowToSuggestions(false);
};
const toggleFavorite = () => {
  if (!from || !to) return;
  const key = `${from}-${to}`;
  const exists = favorites.find(f => f.key === key);
  let newFavorites;
  if (exists) {
    newFavorites = favorites.filter(f => f.key !== key);
  } else {
    newFavorites = [...favorites, { key, from, to }];
  }
  setFavorites(newFavorites);
  localStorage.setItem('sl-bus-favorites', JSON.stringify(newFavorites));
};

const isFavorite = () => {
  const key = `${from}-${to}`;
  return favorites.some(f => f.key === key);
};
const findNearbyStops = () => {
  setLocationLoading(true);
  setLocationError('');
  setNearbyStops([]);

  if (!navigator.geolocation) {
    setLocationError('Geolocation not supported by your browser');
    setLocationLoading(false);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      const busStops = [
        { name: "Colombo Fort", lat: 6.9271, lng: 79.8612, routes: ["No.1", "No.2", "No.4", "No.6", "No.15"] },
        { name: "Pettah", lat: 6.9344, lng: 79.8528, routes: ["No.1", "No.2", "No.4"] },
        { name: "Kandy Bus Stand", lat: 7.2906, lng: 80.6337, routes: ["No.1", "No.43", "No.48", "No.98"] },
        { name: "Galle Bus Stand", lat: 6.0535, lng: 80.2210, routes: ["No.2", "No.32"] },
        { name: "Jaffna Bus Stand", lat: 9.6615, lng: 80.0255, routes: ["No.15", "No.78", "No.87"] },
        { name: "Anuradhapura Bus Stand", lat: 8.3114, lng: 80.4037, routes: ["No.15", "No.43", "No.49"] },
        { name: "Trincomalee Bus Stand", lat: 8.5874, lng: 81.2152, routes: ["No.49", "No.48", "No.78"] },
        { name: "Batticaloa Bus Stand", lat: 7.7310, lng: 81.6747, routes: ["No.48", "No.68"] },
        { name: "Matara Bus Stand", lat: 5.9549, lng: 80.5550, routes: ["No.2", "No.32", "No.99"] },
        { name: "Hambantota Bus Stand", lat: 6.1429, lng: 81.1212, routes: ["No.32-1", "No.99"] },
        { name: "Negombo Bus Stand", lat: 7.2097, lng: 79.8350, routes: ["No.4", "No.7"] },
        { name: "Kurunegala Bus Stand", lat: 7.4818, lng: 80.3609, routes: ["No.6", "No.7", "No.15"] },
        { name: "Ratnapura Bus Stand", lat: 6.6828, lng: 80.3992, routes: ["No.98", "No.32/3"] },
        { name: "Badulla Bus Stand", lat: 6.9934, lng: 81.0550, routes: ["No.98", "No.99", "No.21-6"] },
        { name: "Nuwara Eliya Bus Stand", lat: 6.9497, lng: 80.7891, routes: ["No.98", "No.2-10"] },
        { name: "Polonnaruwa Bus Stand", lat: 7.9403, lng: 81.0188, routes: ["No.48", "No.49"] },
        { name: "Vavuniya Bus Stand", lat: 8.7514, lng: 80.4971, routes: ["No.15", "No.87"] },
        { name: "Mannar Bus Stand", lat: 8.9810, lng: 79.9044, routes: ["No.87", "No.4"] },
        { name: "Ampara Bus Stand", lat: 7.2811, lng: 81.6747, routes: ["No.68", "No.38-4"] },
        { name: "Monaragala Bus Stand", lat: 6.8728, lng: 81.3507, routes: ["No.99", "No.9"] },
        { name: "Puttalam Bus Stand", lat: 8.0408, lng: 79.8394, routes: ["No.7", "No.4"] },
        { name: "Matale Bus Stand", lat: 7.4675, lng: 80.6234, routes: ["No.8", "No.6"] },
        { name: "Kegalle Bus Stand", lat: 7.2513, lng: 80.3464, routes: ["No.96", "No.98"] },
        { name: "Kilinochchi Bus Stand", lat: 9.3803, lng: 80.3770, routes: ["No.15", "No.87"] },
        { name: "Kalutara Bus Stand", lat: 6.5854, lng: 79.9607, routes: ["No.2", "No.98"] },
        { name: "Gampaha Bus Stand", lat: 7.0873, lng: 80.0144, routes: ["No.5", "No.1"] },
        { name: "Dambulla Bus Stand", lat: 7.8742, lng: 80.6511, routes: ["No.6", "No.43", "No.49"] },
        { name: "Hatton Bus Stand", lat: 6.8978, lng: 80.5951, routes: ["No.18-2"] },
        { name: "Ella Bus Stand", lat: 6.8667, lng: 81.0466, routes: ["No.98-1"] },
        { name: "Bandarawela Bus Stand", lat: 6.8308, lng: 80.9886, routes: ["No.98-1", "No.99"] },
        { name: "Embilipitiya Bus Stand", lat: 6.3433, lng: 80.8490, routes: ["No.3-1"] },
        { name: "Tangalle Bus Stand", lat: 6.0249, lng: 80.7977, routes: ["No.32-4", "No.32-1"] },
        { name: "Tissamaharama Bus Stand", lat: 6.2864, lng: 81.2875, routes: ["No.32-7"] },
        { name: "Kataragama Bus Stand", lat: 6.4149, lng: 81.3322, routes: ["No.32", "No.32-7"] },
        { name: "Avissawella Bus Stand", lat: 6.9497, lng: 80.2089, routes: ["No.96", "No.98"] },
        { name: "Horana Bus Stand", lat: 6.7153, lng: 80.0615, routes: ["No.98"] },
        { name: "Chilaw Bus Stand", lat: 7.5758, lng: 79.7953, routes: ["No.7"] },
        { name: "Sigiriya Bus Stand", lat: 7.9572, lng: 80.7603, routes: ["No.6"] },
        { name: "Mahiyanganaya Bus Stand", lat: 7.3280, lng: 81.0008, routes: ["No.38-1"] },
        { name: "Mullaitivu Bus Stand", lat: 9.2671, lng: 80.8128, routes: ["No.15/1", "No.78"] },
      ];

      const getDistance = (lat1, lng1, lat2, lng2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
          Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
      };

      const stopsWithDistance = busStops.map(stop => ({
        ...stop,
        distance: getDistance(latitude, longitude, stop.lat, stop.lng)
      }));

      stopsWithDistance.sort((a, b) => a.distance - b.distance);
      setNearbyStops(stopsWithDistance.slice(0, 5));
      setLocationLoading(false);
    },
    (error) => {
      setLocationError('Could not get your location. Please allow location access.');
      setLocationLoading(false);
    }
  );
};

const generateFullSchedule = (timing) => {
  if (!timing) return [];

  const parseTime = (timeStr) => {
    const [time, period] = timeStr.split(' ');
    let [hours, mins] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return hours * 60 + mins;
  };

  const formatTime = (totalMins) => {
    let h = Math.floor(totalMins / 60) % 24;
    const m = totalMins % 60;
    const period = h >= 12 ? 'PM' : 'AM';
    let h12 = h % 12;
    if (h12 === 0) h12 = 12;
    return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
  };

  const getFrequencyMins = (freq) => {
    const minMatch = freq.match(/([\d.]+)\s*min/i);
    if (minMatch) return parseFloat(minMatch[1]);
    const hourMatch = freq.match(/([\d.]+)\s*hour/i);
    if (hourMatch) return parseFloat(hourMatch[1]) * 60;
    return 60;
  };

  const firstMins = parseTime(timing.first);
  const lastMins = parseTime(timing.last);
  const freqMins = getFrequencyMins(timing.frequency);

  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();

  const slots = [];
  for (let t = firstMins; t <= lastMins; t += freqMins) {
    slots.push({ mins: t, label: formatTime(t), passed: t < nowMins });
  }
  return slots;
};

const getNextBus = (timing) => {
  if (!timing) return null;
  
  const now = new Date();
  const currentHour = now.getHours();
  const currentMin = now.getMinutes();
  const currentTotalMins = currentHour * 60 + currentMin;

  const parseTime = (timeStr) => {
    const [time, period] = timeStr.split(' ');
    let [hours, mins] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return hours * 60 + mins;
  };

  const getFrequencyMins = (freq) => {
    const minMatch = freq.match(/([\d.]+)\s*min/i);
    if (minMatch) return parseFloat(minMatch[1]);
    const hourMatch = freq.match(/([\d.]+)\s*hour/i);
    if (hourMatch) return parseFloat(hourMatch[1]) * 60;
    return 60;
  };

  const firstBusMins = parseTime(timing.first);
  const lastBusMins = parseTime(timing.last);
  const freqMins = getFrequencyMins(timing.frequency);

  if (currentTotalMins > lastBusMins) {
    return { status: 'no_more', message: 'No more buses today', nextDay: timing.first };
  }

  if (currentTotalMins < firstBusMins) {
    const waitMins = firstBusMins - currentTotalMins;
    
    return {
      status: 'waiting',
      message: `First bus at ${timing.first}`,
      wait: `${waitMins} mins to go`
    };
  }

  const elapsed = currentTotalMins - firstBusMins;
  const nextBusElapsed = Math.ceil(elapsed / freqMins) * freqMins;
  const nextBusTotalMins = firstBusMins + nextBusElapsed;
  const waitMins = nextBusTotalMins - currentTotalMins;
  const nextHour = Math.floor(nextBusTotalMins / 60);
  const nextMin = nextBusTotalMins % 60;
  const period = nextHour >= 12 ? 'PM' : 'AM';
  const displayHour = nextHour > 12 ? nextHour - 12 : nextHour === 0 ? 12 : nextHour;
  const nextBusTime = `${displayHour}:${nextMin.toString().padStart(2, '0')} ${period}`;

  return {
    status: 'next',
    time: nextBusTime,
    wait: waitMins <= 1 ? 'Departing now!' : `~${waitMins} mins away`
  };
};

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
    setResult(null);
    setNotFound(false);
  };

  const handleChip = (chip) => {
    const [f, t] = chip.split(' → ');
    setFrom(f);
    setTo(t);
    setResult(null);
    setNotFound(false);
  };

  const handleChat = async () => {
  if (!chatInput.trim()) return;
  const userMsg = chatInput;
  setChatInput('');
  setChat(prev => [...prev, { role: 'user', text: userMsg }]);
  setLoading(true);

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMsg,
        history: chat.map(m => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.text
        }))
      })
    });

    const data = await response.json();
    setChat(prev => [...prev, { role: 'assistant', text: data.reply }]);
  } catch (error) {
    setChat(prev => [...prev, { role: 'assistant', text: 'Sorry, something went wrong. Please try again!' }]);
  }
  setLoading(false);
};

  return (
    <div className="app">
      <div className="header">
        <div className="logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 16.5V6.8C4 5.2 5.3 4.3 7 4.1C9 3.9 15 3.9 17 4.1C18.7 4.3 20 5.2 20 6.8V16.5C20 17.3 19.3 18 18.5 18H18C17.4 18 17 18.4 17 19V19.3C17 19.7 16.7 20 16.3 20H14.7C14.3 20 14 19.7 14 19.3V19C14 18.4 13.6 18 13 18H11C10.4 18 10 18.4 10 19V19.3C10 19.7 9.7 20 9.3 20H7.7C7.3 20 7 19.7 7 19.3V19C7 18.4 6.6 18 6 18H5.5C4.7 18 4 17.3 4 16.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
              <path d="M4 11H20" stroke="currentColor" strokeWidth="1.6"/>
              <path d="M7.5 14.3H7.51" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
              <path d="M16.5 14.3H16.51" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
              <path d="M6.5 7.2H17.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="logo-text">
            <h1>BusTracker</h1>
            <span>Sri Lanka 🇱🇰</span>
          </div>
        </div>
        <div className="header-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <IconSun className="icon" /> : <IconMoon className="icon" />}
          </button>
          <div className="badge">● Live</div>
        </div>
      </div>

      <div className="hero">
        <h2>Where are you<br /><span>heading today?</span></h2>
        <p>Smart routes across all Sri Lanka</p>
      </div>

      <div className="search-card">
  {/* From Input */}
  <div className="input-wrapper">
    <div className="input-group">
      <span className="input-icon"><IconPin className="icon" /></span>
      <input
        type="text"
        placeholder="From — Colombo, Kandy..."
        value={from}
        onChange={handleFromChange}
        onFocus={() => setShowFromSuggestions(true)}
        onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
      />
    </div>
    {showFromSuggestions && fromSuggestions.length > 0 && (
      <div className="suggestions-box">
        {fromSuggestions.map((loc, i) => (
          <div key={i} className="suggestion-item" onMouseDown={() => selectFrom(loc)}>
            <span className="suggestion-name">{loc.name}</span>
            <span className="suggestion-district">{loc.district}</span>
          </div>
        ))}
      </div>
    )}
  </div>

  {/* Swap */}
  <div className="divider">
    <div className="divider-line"></div>
    <div className="swap-btn" onClick={handleSwap}><IconSwap className="icon" /></div>
    <div className="divider-line"></div>
  </div>

  {/* To Input */}
  <div className="input-wrapper">
    <div className="input-group">
      <span className="input-icon"><IconFlag className="icon" /></span>
      <input
        type="text"
        placeholder="To — Galle, Jaffna..."
        value={to}
        onChange={handleToChange}
        onFocus={() => setShowToSuggestions(true)}
        onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
      />
    </div>
    {showToSuggestions && toSuggestions.length > 0 && (
      <div className="suggestions-box">
        {toSuggestions.map((loc, i) => (
          <div key={i} className="suggestion-item" onMouseDown={() => selectTo(loc)}>
            <span className="suggestion-name">{loc.name}</span>
            <span className="suggestion-district">{loc.district}</span>
          </div>
        ))}
      </div>
    )}
  </div>

 <div className="search-actions">
  <button className="search-btn" onClick={handleSearch}>Find My Bus →</button>
  <button className="fav-btn" onClick={toggleFavorite} title="Save to favorites">
    <IconHeart filled={isFavorite()} className="icon" />
  </button>
</div>
</div>

      {result && (
  <div className="result-card">
    <p className="result-title"><IconTicket className="icon" /> Available Buses</p>

    {/* Normal Bus */}
    <div className="bus-option normal-bus">
      <div className="bus-option-header">
        <span className="bus-type-badge normal-badge"><IconBus className="icon" /> Normal</span>
        <span className="bus-fare-tag">{result.normal.fare}</span>
      </div>
      <div className="bus-option-info">
        <span>{result.normal.bus}</span>
        <span className="info-with-icon"><IconClock className="icon-xs" /> {result.normal.duration}</span>
      </div>
    </div>

    {/* AC Bus */}
    <div className="bus-option ac-bus">
      <div className="bus-option-header">
        <span className="bus-type-badge ac-badge">AC Intercity</span>
        <span className="bus-fare-tag ac-fare">{result.ac.fare}</span>
      </div>
      <div className="bus-option-info">
        <span>{result.ac.bus}</span>
        <span className="info-with-icon"><IconClock className="icon-xs" /> {result.ac.duration}</span>
      </div>
    </div>

    {/* Timing */}
<div className="timing-box">
  <div className="timing-title"><IconClock className="icon-xs" /> Bus Timings</div>
  <div className="timing-grid">
    <div className="timing-item">
      <span className="timing-label">First Bus</span>
      <span className="timing-value">{result.timing.first}</span>
    </div>
    <div className="timing-item">
      <span className="timing-label">Last Bus</span>
      <span className="timing-value">{result.timing.last}</span>
    </div>
    <div className="timing-item full">
      <span className="timing-label">Frequency</span>
      <span className="timing-value">{result.timing.frequency}</span>
    </div>
  </div>

  {/* Next Bus */}
  {(() => {
    const next = getNextBus(result.timing);
    if (!next) return null;
    return (
      <div className={`next-bus-box ${next.status}`}>
        {next.status === 'next' && (
          <>
            <span className="next-bus-label"><IconBus className="icon-xs" /> Next Bus</span>
            <span className="next-bus-time">{next.time}</span>
            <span className="next-bus-wait">{next.wait}</span>
          </>
        )}
        {next.status === 'waiting' && (
          <>
            <span className="next-bus-label"><IconClock className="icon-xs" /> {next.message}</span>
            <span className="next-bus-wait">{next.wait}</span>
          </>
        )}
        {next.status === 'no_more' && (
          <>
            <span className="next-bus-label"><IconMoon className="icon-xs" /> No more buses today</span>
            <span className="next-bus-wait">First bus tomorrow at {next.nextDay}</span>
          </>
        )}
      </div>
    );
  })()}

  {/* Full Day Schedule — works for every route, derived from first/last/frequency */}
  <button
    className="schedule-toggle"
    onClick={() => setShowFullSchedule(s => !s)}
  >
    <IconClock className="icon-xs" />
    {showFullSchedule ? 'Hide Full Day Schedule' : 'View Full Day Schedule'}
    <span className={`schedule-chevron ${showFullSchedule ? 'open' : ''}`}>⌄</span>
  </button>

  {showFullSchedule && (() => {
    const slots = generateFullSchedule(result.timing);
    return (
      <div className="schedule-panel">
        <p className="schedule-note">
          Every {result.timing.frequency.replace('Every ', '')} · {slots.length} buses between {result.timing.first} and {result.timing.last}
        </p>
        <div className="schedule-grid">
          {slots.map((slot, i) => (
            <span key={i} className={`schedule-slot ${slot.passed ? 'passed' : ''}`}>
              {slot.label}
            </span>
          ))}
        </div>
      </div>
    );
  })()}
</div>
{/* Alternative Buses */}
{result.alternativeBuses && result.alternativeBuses.length > 0 && (
  <div className="alt-buses">
    <div className="alt-buses-title"><IconBus className="icon-xs" /> Other Buses on this Route</div>
    <div className="alt-buses-list">
      {result.alternativeBuses.map((bus, i) => (
        <div key={i} className="alt-bus-item">
          <span className="alt-bus-number">{bus.bus}</span>
          <span className="alt-bus-type">{bus.type}</span>
          <span className="alt-bus-fare">{bus.fare}</span>
        </div>
      ))}
    </div>
  </div>
)}

    {/* Stops */}
    <div className="stops-title"><IconFlag className="icon-xs" /> Stops</div>
    <div className="stops">
      {result.stops.map((stop, i) => (
        <div className="stop" key={i}>
          <div className="stop-dot"></div>
          <span>{stop}</span>
        </div>
      ))}
    </div>
  </div>
)}

      {notFound && (
  <div className="not-found">
    <div className="not-found-icon"><IconSearch className="icon-lg" /></div>
    <p>Route not found in our database!</p>
    <p className="not-found-sub">Ask our AI Assistant below — it knows ALL Sri Lanka bus routes!</p>
    <button className="ask-ai-btn" onClick={() => {
      document.querySelector('.chat-input-row input').focus();
      document.querySelector('.chat-input-row input').value = `${from} to ${to} bus route`;
      document.querySelector('.chat-input-row input').dispatchEvent(new Event('change', { bubbles: true }));
    }}>
      Ask AI Assistant →
    </button>
  </div>
)}

{/* Nearby Bus Stops */}
<div className="nearby-section">
  <div className="nearby-header">
    <p className="quick-title"><IconPin className="icon-xs" /> Nearby Bus Stops</p>
    <button className="locate-btn" onClick={findNearbyStops}>
      <IconLocate className="icon-xs" /> {locationLoading ? 'Locating...' : 'Find Near Me'}
    </button>
  </div>
  {locationError && <p className="location-error">{locationError}</p>}
  {nearbyStops.length > 0 && (
    <div className="nearby-stops">
      {nearbyStops.map((stop, i) => (
        <div key={i} className="nearby-stop" onClick={() => setFrom(stop.name)}>
          <div className="nearby-stop-info">
            <span className="nearby-stop-name">{stop.name}</span>
            <span className="nearby-stop-distance">{stop.distance.toFixed(1)} km away</span>
          </div>
          <div className="nearby-stop-routes">
            {stop.routes.slice(0, 3).map((route, j) => (
              <span key={j} className="nearby-route-badge">{route}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )}
</div>

      {/* Map */}
      <div className="map-container" ref={mapRef}></div>
      {favorites.length > 0 && (
  <div className="quick-routes">
    <p className="quick-title"><IconHeart filled className="icon-xs" /> Your Favorites</p>
    <div className="chips">
      {favorites.map((fav, i) => (
        <div key={i} className="chip favorite-chip" onClick={() => {
          setFrom(fav.from);
          setTo(fav.to);
          setResult(null);
          setNotFound(false);
        }}>
          {fav.from} → {fav.to}
          <span className="remove-fav" onClick={(e) => {
            e.stopPropagation();
            const newFavorites = favorites.filter(f => f.key !== fav.key);
            setFavorites(newFavorites);
            localStorage.setItem('sl-bus-favorites', JSON.stringify(newFavorites));
          }}>✕</span>
        </div>
      ))}
    </div>
  </div>
)}

      <div className="quick-routes">
  <p className="quick-title"><IconTrending className="icon-xs" /> Popular Routes</p>
  <div className="chips">
    {Object.keys(routeStats).length > 0
      ? Object.entries(routeStats)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([key, count], i) => {
            const [f, t] = key.split('-');
            return (
              <div className="chip" key={i} onClick={() => {
                setFrom(f.charAt(0).toUpperCase() + f.slice(1));
                setTo(t.charAt(0).toUpperCase() + t.slice(1));
                setResult(null);
                setNotFound(false);
              }}>
                {f.charAt(0).toUpperCase() + f.slice(1)} → {t.charAt(0).toUpperCase() + t.slice(1)}
                <span className="count-badge">{count}</span>
              </div>
            );
          })
      : ["Colombo → Kandy", "Colombo → Galle", "Colombo → Jaffna", "Colombo → Negombo", "Colombo → Trincomalee", "Colombo → Badulla", "Colombo → Hambantota", "Colombo → Batticaloa"].map((chip, i) => (
          <div className="chip" key={i} onClick={() => handleChip(chip)}>{chip}</div>
        ))
    }
  </div>
</div>

      <div className="chat-section">
        <p className="quick-title"><IconSparkle className="icon-xs" /> AI Assistant</p>
        <div className="chat-box">
          {chat.length === 0 && <p className="chat-placeholder">Ask me anything about Sri Lanka buses! 🇱🇰</p>}
          {chat.map((msg, i) => (
            <div key={i} className={`chat-msg ${msg.role}`}>
              <p>{msg.text}</p>
            </div>
          ))}
          {loading && <div className="chat-msg assistant"><p>Typing...</p></div>}
        </div>
        <div className="chat-input-row">
          <input type="text" placeholder="Ask about any route..." value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleChat()} />
          <button onClick={handleChat}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;