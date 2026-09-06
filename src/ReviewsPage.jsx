import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import FeedbackWidget from './FeedbackWidget';
import './ReviewsPage.css';

const IconStar = ({ filled, ...rest }) => (
  <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} xmlns="http://www.w3.org/2000/svg" {...rest}>
    <path d="M12 2.5L14.9 8.6L21.5 9.5L16.8 14.1L17.9 20.8L12 17.6L6.1 20.8L7.2 14.1L2.5 9.5L9.1 8.6L12 2.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

const IconBack = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M15 5L8 12L15 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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

function StarRow({ rating, size = 'sm' }) {
  return (
    <div className={`reviews-stars reviews-stars-${size}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <IconStar key={i} filled={i <= rating} className="reviews-star-icon" />
      ))}
    </div>
  );
}

// Real distribution of ratings (5-star count, 4-star count, etc.) —
// computed from the live data, never invented.
function RatingBreakdown({ reviews }) {
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));
  const max = Math.max(...counts.map((c) => c.count), 1);

  return (
    <div className="reviews-breakdown">
      {counts.map(({ star, count }) => (
        <div className="reviews-breakdown-row" key={star}>
          <span className="reviews-breakdown-label">{star} ★</span>
          <div className="reviews-breakdown-bar-track">
            <div
              className="reviews-breakdown-bar-fill"
              style={{ width: `${(count / max) * 100}%` }}
            />
          </div>
          <span className="reviews-breakdown-count">{count}</span>
        </div>
      ))}
    </div>
  );
}

function ReviewRow({ item }) {
  return (
    <div className="reviews-row">
      <div className="reviews-row-header">
        <div>
          <div className="reviews-row-name">{item.name}</div>
          <StarRow rating={item.rating} size="sm" />
        </div>
        <span className="reviews-row-date">{timeAgo(item.date)}</span>
      </div>
      {item.message && <p className="reviews-row-text">{item.message}</p>}
    </div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const openFeedback = () => {
    window.dispatchEvent(new CustomEvent('open-feedback-widget'));
  };

  return (
    <div className="app reviews-page">
      <Navbar />

      <Link to="/" className="reviews-back-link">
        <IconBack className="reviews-back-icon" /> Back to Home
      </Link>

      <h1 className="reviews-title">Traveler Reviews</h1>
      <p className="reviews-subtitle">Real ratings from real Lankora users — nothing here is invented.</p>

      {loading ? (
        <p className="reviews-loading">Loading reviews...</p>
      ) : error ? (
        <p className="reviews-loading">Couldn't load reviews right now. Please try again later.</p>
      ) : reviews.length === 0 ? (
        <div className="reviews-empty-card">
          <p className="reviews-empty-title">No reviews yet — be the first!</p>
          <p className="reviews-empty-sub">Used Lankora to find a bus? Let other travelers know how it went.</p>
          <button className="reviews-rate-btn" onClick={openFeedback}>
            Rate Your Experience
          </button>
        </div>
      ) : (
        <>
          <div className="reviews-summary-card">
            <div className="reviews-summary-left">
              <div className="reviews-summary-number">{averageRating}</div>
              <StarRow rating={Math.round(averageRating)} size="lg" />
              <div className="reviews-summary-count">
                {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </div>
            </div>
            <RatingBreakdown reviews={reviews} />
          </div>

          <button className="reviews-rate-btn reviews-rate-btn-full" onClick={openFeedback}>
            Rate Your Experience
          </button>

          <div className="reviews-list">
            {reviews.map((r) => (
              <ReviewRow key={r.id} item={r} />
            ))}
          </div>
        </>
      )}

      <FeedbackWidget pageName="Reviews" />
    </div>
  );
}