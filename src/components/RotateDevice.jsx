import React from 'react';

export default function RotateDevice() {
  return (
    <div className="rotate-device-screen">
      <div className="rotate-device-content">
        <div className="rotate-icon-container">
          <svg
            className="rotate-icon-svg"
            viewBox="0 0 64 64"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Phone outline + home indicator that rotates */}
            <g className="phone-device">
              <rect x="24" y="14" width="16" height="28" rx="2.5" />
              <line x1="30" y1="18" x2="34" y2="18" strokeWidth="2" />
            </g>
            {/* Rotate Arrow */}
            <path d="M 48 22 A 18 18 0 0 1 42 44 L 47 44 M 42 44 L 42 39" className="rotate-arrow" />
          </svg>
        </div>
        <h1 className="rotate-title">🔄 Landscape Mode Required</h1>
        <p className="rotate-message">Please rotate your device to enter DriveSync cockpit mode.</p>
      </div>
    </div>
  );
}
