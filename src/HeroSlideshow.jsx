import React, { useEffect, useState } from 'react';
import './HeroSlideshow.css';

// All verified, working image URLs — same Wikimedia Commons stable
// Special:FilePath redirects already used elsewhere in the app (Explore's
// carousel, other hero photos). Only add new photos here after confirming
// the exact filename resolves (avoid repeating the earlier broken-image
// issue from invented filenames).
const SLIDES = [
  { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sigiriya.jpg', alt: 'Sigiriya Rock Fortress' },
  { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nine_Arches_Bridge.jpg', alt: 'Nine Arches Bridge, Ella' },
  { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Secret_beach_-_Mirissa_Sri_Lanka.jpg', alt: 'Mirissa Beach' },
  { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kandy_lake.jpg', alt: 'Kandy Lake' },
  { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sri_Lankan_Leopard_-_Yala_National_Park.jpg', alt: 'Yala National Park Leopard' },
];

const SLIDE_DURATION = 5000;

export default function HeroSlideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero-slideshow" aria-hidden="true">
      {SLIDES.map((slide, i) => (
        <div
          key={slide.url}
          className={`hero-slideshow-slide ${i === index ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.url})` }}
          title={slide.alt}
        />
      ))}
    </div>
  );
}