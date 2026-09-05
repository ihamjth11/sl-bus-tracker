import React, { useState, useEffect } from 'react';
import './FeedbackWidget.css';

const IconFeedback = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M4 5.5C4 4.4 4.9 3.5 6 3.5H18C19.1 3.5 20 4.4 20 5.5V14.5C20 15.6 19.1 16.5 18 16.5H9L5 20.2V16.5H6C4.9 16.5 4 15.6 4 14.5V5.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <circle cx="9" cy="10" r="0.9" fill="currentColor" />
    <circle cx="12" cy="10" r="0.9" fill="currentColor" />
    <circle cx="15" cy="10" r="0.9" fill="currentColor" />
  </svg>
);

const IconClose = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconCheck = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.6" />
    <path d="M8 12.5L10.7 15L16 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconStar = ({ filled, ...rest }) => (
  <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} xmlns="http://www.w3.org/2000/svg" {...rest}>
    <path d="M12 2.5L14.9 8.6L21.5 9.5L16.8 14.1L17.9 20.8L12 17.6L6.1 20.8L7.2 14.1L2.5 9.5L9.1 8.6L12 2.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

// Drop this once anywhere in your layout — it renders its own floating
// button. Ratings submitted here are automatically fetched and shown live
// by <TrustSection /> (via /api/reviews) — no manual step needed.
export default function FeedbackWidget({ pageName = '' }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const openModal = () => setOpen(true);

  const closeModal = () => {
    setOpen(false);
    setTimeout(() => {
      setStatus('idle');
      setRating(0);
      setHoverRating(0);
      setName('');
      setMessage('');
      setErrorMsg('');
    }, 200);
  };

  // Lets other components open this widget without prop-drilling, e.g.
  // TrustSection's "Share Your Experience" button when there are no
  // reviews yet: window.dispatchEvent(new CustomEvent('open-feedback-widget'))
  useEffect(() => {
    const handler = () => openModal();
    window.addEventListener('open-feedback-widget', handler);
    return () => window.removeEventListener('open-feedback-widget', handler);
  }, []);

  const handleSubmit = async () => {
    if (rating === 0) {
      setErrorMsg('Please tap a star to rate your experience.');
      setStatus('error');
      return;
    }
    setStatus('sending');
    setErrorMsg('');
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          name: name.trim() || undefined,
          message: message.trim() || undefined,
          page: pageName || undefined,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Could not submit. Please try again.');
      }
      setStatus('success');
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  return (
    <>
      <button
        className="feedback-fab"
        onClick={openModal}
        aria-label="Rate your experience"
        title="Rate your experience"
      >
        <IconFeedback className="feedback-fab-icon" />
      </button>

      {open && (
        <div className="feedback-overlay" onClick={closeModal}>
          <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
            <div className="feedback-modal-header">
              <h3>{status === 'success' ? 'Thanks!' : 'Rate Your Experience'}</h3>
              <button className="feedback-close-btn" onClick={closeModal} aria-label="Close">
                <IconClose className="feedback-close-icon" />
              </button>
            </div>

            {status === 'success' ? (
              <div className="feedback-success">
                <IconCheck className="feedback-success-icon" />
                <p>Thanks for rating Lankora! Your review is now live for other travelers to see.</p>
                <button className="feedback-submit-btn feedback-done-btn" onClick={closeModal}>
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="feedback-field">
                  <div className="feedback-star-row feedback-star-row-lg">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        className="feedback-star-btn"
                        onClick={() => setRating(n)}
                        onMouseEnter={() => setHoverRating(n)}
                        onMouseLeave={() => setHoverRating(0)}
                        aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
                      >
                        <IconStar
                          filled={n <= (hoverRating || rating)}
                          className={`feedback-star-icon ${n <= (hoverRating || rating) ? 'filled' : ''}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="feedback-field">
                  <label>Your name (optional)</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex M."
                  />
                </div>

                <div className="feedback-field">
                  <label>Tell us about your experience (optional)</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="What did you like? What could be better?"
                    rows={4}
                  />
                </div>

                {status === 'error' && <p className="feedback-error">{errorMsg}</p>}

                <button
                  className="feedback-submit-btn"
                  onClick={handleSubmit}
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? 'Submitting...' : 'Submit Rating'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}