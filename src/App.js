import { searchLocations } from './locations';
import { busRoutes } from './routesData';
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

const IconShare = icon(
  <>
    <circle cx="18" cy="5" r="2.6" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="6" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="18" cy="19" r="2.6" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8.3 10.6L15.7 6.4M8.3 13.4L15.7 17.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </>
);

const IconClock = icon(
  <>
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
    <path d="M12 7.5V12L15 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </>
);


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
const [currency, setCurrency] = useState(() => localStorage.getItem('sl-bus-currency') || 'LKR');

useEffect(() => {
  localStorage.setItem('sl-bus-currency', currency);
}, [currency]);

// Approximate mid-market rates (LKR per unit) — for tourist reference only, not live/exact.
const FX_RATES = { USD: 335.4, EUR: 387.7 };

const formatFare = (fareStr) => {
  if (!fareStr || currency === 'LKR') return fareStr;
  const match = fareStr.match(/Rs\.\s*([\d,]+)/);
  if (!match) return fareStr;
  const lkr = parseFloat(match[1].replace(/,/g, ''));
  const rate = FX_RATES[currency];
  if (!rate) return fareStr;
  const converted = (lkr / rate).toFixed(2);
  const symbol = currency === 'USD' ? '$' : '€';
  return `${symbol}${converted} (${fareStr})`;
};
const [showFullSchedule, setShowFullSchedule] = useState(false);
const [showTouristTips, setShowTouristTips] = useState(false);

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

const shareRoute = () => {
  if (!result) return;
  const origin = result.stops?.[0] || from;
  const destination = result.stops?.[result.stops.length - 1] || to;
  const lines = [
    `🚌 ${origin} → ${destination}`,
    `Normal: ${result.normal.fare} (${result.normal.duration})`,
    `AC: ${result.ac.fare} (${result.ac.duration})`,
    `First bus: ${result.timing.first} | Last bus: ${result.timing.last}`,
    `Frequency: ${result.timing.frequency}`,
    ``,
    `Via SL Bus Tracker: https://slbustracker.vercel.app`,
  ];
  const text = encodeURIComponent(lines.join('\n'));
  window.open(`https://wa.me/?text=${text}`, '_blank');
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
            className="currency-toggle"
            onClick={() => setCurrency(c => c === 'LKR' ? 'USD' : c === 'USD' ? 'EUR' : 'LKR')}
            title="Show fares in another currency (approximate)"
          >
            {currency}
          </button>
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
    <div className="result-title-row">
      <p className="result-title"><IconTicket className="icon" /> Available Buses</p>
      <button className="share-btn" onClick={shareRoute} title="Share on WhatsApp">
        <IconShare className="icon-xs" /> Share
      </button>
    </div>

    {/* Normal Bus */}
    <div className="bus-option normal-bus">
      <div className="bus-option-header">
        <span className="bus-type-badge normal-badge"><IconBus className="icon" /> Normal</span>
        <span className="bus-fare-tag">{formatFare(result.normal.fare)}</span>
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
        <span className="bus-fare-tag ac-fare">{formatFare(result.ac.fare)}</span>
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
          <span className="alt-bus-fare">{formatFare(bus.fare)}</span>
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

      <div className="quick-routes">
  <p className="quick-title"><IconFlag className="icon-xs" /> Classic Tourist Trail</p>
  <p className="trail-sub">Tap each leg to search it — all confirmed real routes.</p>
  <div className="chips">
    {["Colombo → Kandy", "Kandy → Badulla", "Badulla → Ella"].map((chip, i) => (
      <div className="chip" key={i} onClick={() => handleChip(chip)}>{chip}</div>
    ))}
  </div>
  <p className="trail-note">Galle is usually done as a separate trip from Colombo (search "Colombo → Galle") rather than continuing on from Ella.</p>
</div>

      <div className="quick-routes">
  <button className="schedule-toggle" onClick={() => setShowTouristTips(s => !s)}>
    <IconSparkle className="icon-xs" />
    {showTouristTips ? 'Hide Tourist Tips' : 'First Time in Sri Lanka? Bus Tips'}
    <span className={`schedule-chevron ${showTouristTips ? 'open' : ''}`}>⌄</span>
  </button>
  {showTouristTips && (
    <div className="schedule-panel tips-panel">
      <div className="tip-block">
        <p className="tip-heading">Catching a bus</p>
        <p className="tip-text">Buses don't always stop unless you flag them down — stick your arm out and wave clearly as it approaches. Buses display their destination on the front windscreen (ask a local or the AI assistant below if you can't read it).</p>
      </div>
      <div className="tip-block">
        <p className="tip-heading">Paying</p>
        <p className="tip-text">Pay the conductor in cash once you're seated (not the driver). Small notes help — conductors often can't break large bills. Ask "how much to [destination]?" if unsure.</p>
      </div>
      <div className="tip-block">
        <p className="tip-heading">Avoiding overcharging</p>
        <p className="tip-text">Check the fare shown in this app before boarding so you know roughly what to expect. Normal buses have fixed government fares — if a conductor asks for noticeably more, politely mention the standard fare.</p>
      </div>
      <div className="tip-block">
        <p className="tip-heading">General safety</p>
        <p className="tip-text">Keep bags on your lap or between your feet, not in overhead racks unless you can see them. Intercity buses can be very fast on winding roads — a window seat with a view is nice, but hold on.</p>
      </div>
    </div>
  )}
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