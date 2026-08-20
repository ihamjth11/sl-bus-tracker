import React, { useState, useEffect, useRef } from "react";
import "./FeaturedCarousel.css";

// Stable Wikimedia Commons URLs — no API key needed, no rate limits
const SLIDES = [
  {
    id: "sigiriya",
    title: "Sigiriya",
    subtitle: "Ancient Rock Fortress",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Sigiriya.jpg",
  },
  {
    id: "ella",
    title: "Ella",
    subtitle: "Hill Country Views",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Nine_Arches_Bridge.jpg",
  },
  {
    id: "mirissa",
    title: "Mirissa",
    subtitle: "Whale Watching & Beaches",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Secret_beach_-_Mirissa_Sri_Lanka.jpg",
  },
  {
    id: "kandy",
    title: "Kandy",
    subtitle: "Temple of the Sacred Tooth",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Kandy_lake.jpg",
  },
  {
    id: "yala",
    title: "Yala",
    subtitle: "Leopards & Wildlife",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Sri_Lankan_Leopard_-_Yala_National_Park.jpg",
  },
];

// Simple SVG fallback (no emoji, matches Lankora's icon convention)
const FALLBACK_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'>
      <rect width='800' height='450' fill='#1c1f26'/>
      <circle cx='400' cy='200' r='40' fill='none' stroke='#f5a623' stroke-width='4'/>
      <path d='M370 240 L400 200 L430 240' fill='none' stroke='#f5a623' stroke-width='4'/>
    </svg>`
  );

export default function FeaturedCarousel() {
  const [active, setActive] = useState(0);
  const [failedIds, setFailedIds] = useState({});
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (index) => {
    setActive(index);
    // Reset the auto-rotate timer on manual interaction
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
  };

  const handleImgError = (id) => {
    setFailedIds((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="featured-carousel" aria-label="Featured destinations">
      <div className="carousel-track">
        {SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`carousel-slide ${index === active ? "active" : ""}`}
            style={{ opacity: index === active ? 1 : 0 }}
          >
            <img
              src={failedIds[slide.id] ? FALLBACK_IMG : slide.image}
              alt={slide.title}
              onError={() => handleImgError(slide.id)}
              loading={index === 0 ? "eager" : "lazy"}
            />
            <div className="carousel-caption">
              <h3>{slide.title}</h3>
              <p>{slide.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="carousel-dots" role="tablist">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            className={`carousel-dot ${index === active ? "active" : ""}`}
            onClick={() => goTo(index)}
            aria-label={`Show ${slide.title}`}
            aria-selected={index === active}
            role="tab"
          />
        ))}
      </div>
    </div>
  );
}