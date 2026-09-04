import React, { useState } from 'react';
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

const TYPES = [
  { id: 'wrong_fare', label: 'Wrong Fare' },
  { id: 'wrong_route', label: 'Wrong Route' },
  { id: 'bug', label: 'Bug' },
  { id: 'feature', label: 'Feature Idea' },
  { id: 'general', label: 'General' },
];

// Drop this component once in your root layout (e.g. index.js wrapping the
// router, or in each page) and it renders its own floating trigger button —
// no other wiring needed. Optional props let a page pre-fill context:
//   <FeedbackWidget routeContext="Colombo → Kandy" pageName="Track" />
export default function FeedbackWidget({ routeContext: initialRouteContext = '', pageName = '' }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('wrong_fare');
  const [routeContext, setRouteContext] = useState(initialRouteContext);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [issueUrl, setIssueUrl] = useState('');

  const openModal = () => {
    setRouteContext(initialRouteContext);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    // Reset after the close animation would finish, so the form is fresh
    // next time but doesn't visibly flicker while closing.
    setTimeout(() => {
      setStatus('idle');
      setMessage('');
      setErrorMsg('');
      setIssueUrl('');
      setType('wrong_fare');
    }, 200);
  };

  const handleSubmit = async () => {
    if (!message.trim()) {
      setErrorMsg('Please write a message first.');
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
          type,
          message,
          routeContext: routeContext.trim() || undefined,
          page: pageName || undefined,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Could not submit. Please try again.');
      }
      setIssueUrl(data.issueUrl || '');
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
        aria-label="Send feedback or report an issue"
        title="Feedback / Report an issue"
      >
        <IconFeedback className="feedback-fab-icon" />
      </button>

      {open && (
        <div className="feedback-overlay" onClick={closeModal}>
          <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
            <div className="feedback-modal-header">
              <h3>{status === 'success' ? 'Thanks!' : 'Feedback & Reports'}</h3>
              <button className="feedback-close-btn" onClick={closeModal} aria-label="Close">
                <IconClose className="feedback-close-icon" />
              </button>
            </div>

            {status === 'success' ? (
              <div className="feedback-success">
                <IconCheck className="feedback-success-icon" />
                <p>Your report was submitted. We'll take a look soon.</p>
                {issueUrl && (
                  <a href={issueUrl} target="_blank" rel="noopener noreferrer" className="feedback-issue-link">
                    View report
                  </a>
                )}
                <button className="feedback-submit-btn feedback-done-btn" onClick={closeModal}>
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="feedback-type-row">
                  {TYPES.map((t) => (
                    <button
                      key={t.id}
                      className={`feedback-type-chip ${type === t.id ? 'active' : ''}`}
                      onClick={() => setType(t.id)}
                      type="button"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {(type === 'wrong_fare' || type === 'wrong_route') && (
                  <div className="feedback-field">
                    <label>Which route? (e.g. Colombo → Kandy)</label>
                    <input
                      type="text"
                      value={routeContext}
                      onChange={(e) => setRouteContext(e.target.value)}
                      placeholder="From → To"
                    />
                  </div>
                )}

                <div className="feedback-field">
                  <label>What's the issue or idea?</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe it here..."
                    rows={4}
                  />
                </div>

                {status === 'error' && <p className="feedback-error">{errorMsg}</p>}

                <button
                  className="feedback-submit-btn"
                  onClick={handleSubmit}
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? 'Sending...' : 'Submit'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}