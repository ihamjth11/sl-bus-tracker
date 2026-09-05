import React, { useEffect, useRef, useState } from 'react';
import './TrustSection.css';

// Real, verifiable facts about the app — never inflate these. Update the
// numbers here if the underlying data grows (e.g. routesData.js route count).
const STATS = [
  { value: 257, suffix: '+', label: 'Verified Bus Routes' },
  { value: 262, suffix: '+', label: 'Places to Explore' },
  { value: 25, suffix: '', label: 'Districts Covered' },
  { value: 3, suffix: '', label: 'Languages Supported' },
];

function useCountUp(target, active, duration = 1400) {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!active || startedRef.current) return;
    startedRef.current = true;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);

  return value;
}

function StatItem({ value, suffix, label, active }) {
  const count = useCountUp(value, active);
  return (
    <div className="trust-stat">
      <div className="trust-stat-number">
        {count}
        {suffix}
      </div>
      <div className="trust-stat-label">{label}</div>
    </div>
  );
}

const IconQuote = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M7.5 9C5.6 9 4 10.6 4 12.5C4 14.4 5.6 16 7.5 16C7.9 16 8.2 15.9 8.5 15.8C8.1 17.3 7 18.5 5.5 19L6 20.5C9 19.7 11 17.2 11 13.5V12.5C11 10.6 9.4 9 7.5 9Z" fill="currentColor" />
    <path d="M17 9C15.1 9 13.5 10.6 13.5 12.5C13.5 14.4 15.1 16 17 16C17.4 16 17.7 15.9 18 15.8C17.6 17.3 16.5 18.5 15 19L15.5 20.5C18.5 19.7 20.5 17.2 20.5 13.5V12.5C20.5 10.6 18.9 9 17 9Z" fill="currentColor" />
  </svg>
);

const IconStar = ({ filled, ...rest }) => (
  <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} xmlns="http://www.w3.org/2000/svg" {...rest}>
    <path d="M12 2.5L14.9 8.6L21.5 9.5L16.8 14.1L17.9 20.8L12 17.6L6.1 20.8L7.2 14.1L2.5 9.5L9.1 8.6L12 2.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? 's' : ''} ago`;
}

function ReviewCard({ item }) {
  return (
    <div className="trust-testimonial-card">
      <div className="trust-stars">
        {[1, 2, 3, 4, 5].map((i) => (
          <IconStar key={i} filled={i <= item.rating} className="trust-star-icon" />
        ))}
      </div>
      {item.message ? (
        <p className="trust-testimonial-text">{item.message}</p>
      ) : (
        <p className="trust-testimonial-text trust-testimonial-text-muted">Rated their experience</p>
      )}
      <div className="trust-testimonial-footer">
        <div className="trust-testimonial-name">{item.name}</div>
        <div className="trust-testimonial-location">{timeAgo(item.date)}</div>
      </div>
    </div>
  );
}

function EmptyReviewState() {
  const openFeedback = () => {
    window.dispatchEvent(new CustomEvent('open-feedback-widget'));
  };
  return (
    <div className="trust-empty-card">
      <IconQuote className="trust-quote-icon trust-quote-icon-empty" />
      <p className="trust-empty-title">Be the first to rate Lankora!</p>
      <p className="trust-empty-sub">
        Used the app to find a bus? Tap the star button and let other travelers know how it went.
      </p>
      <button className="trust-empty-cta" onClick={openFeedback}>
        Rate Your Experience
      </button>
    </div>
  );
}

export default function TrustSection() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/reviews')
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setReviews(data.reviews || []);
        setAverageRating(data.averageRating || 0);
      })
      .catch(() => {
        // Fail quietly — the section just shows the empty state.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (reviews.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  return (
    <div className="trust-section" ref={sectionRef}>
      <div className="trust-stats-row">
        {STATS.map((s, i) => (
          <StatItem key={i} value={s.value} suffix={s.suffix} label={s.label} active={visible} />
        ))}
      </div>

      {reviews.length > 0 && (
        <div className="trust-average-row">
          <div className="trust-average-number">{averageRating}</div>
          <div className="trust-average-stars">
            {[1, 2, 3, 4, 5].map((i) => (
              <IconStar
                key={i}
                filled={i <= Math.round(averageRating)}
                className="trust-star-icon trust-star-icon-lg"
              />
            ))}
            <span className="trust-average-count">
              from {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      <div className="trust-testimonials-area">
        {!loading && reviews.length === 0 ? (
          <EmptyReviewState />
        ) : reviews.length > 0 ? (
          <>
            <ReviewCard item={reviews[index]} />
            {reviews.length > 1 && (
              <div className="trust-dots">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    className={`trust-dot ${i === index ? 'active' : ''}`}
                    onClick={() => setIndex(i)}
                    aria-label={`Show review ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}