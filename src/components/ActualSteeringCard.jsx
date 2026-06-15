import React from 'react';

export default function ActualSteeringCard({ actualAngle = 0 }) {
  const formatAngle = (angle) => {
    const rounded = Math.round(angle);
    const sign = rounded > 0 ? '+' : '';
    const dir = rounded > 0 ? 'RIGHT' : (rounded < 0 ? 'LEFT' : 'CENTER');
    return {
      text: `${sign}${rounded}°`,
      dir
    };
  };

  const formatted = formatAngle(actualAngle);

  return (
    <section className="telemetry-card glass-card" id="actual-steering-section">
      <div className="card-edge-glow"></div>
      <div className="card-meta">
        <span className="panel-label">Actual Steering</span>
        <span className="telemetry-id">DRV-01</span>
      </div>

      <div className="wheel-outer-wrapper">
        <div className="steering-wheel-container">
          <div className="steering-wheel" id="actual-wheel" style={{ transform: `rotate(${actualAngle}deg)` }}>
            <svg className="steering-wheel-svg" viewBox="0 0 240 240">
              <defs>
                <radialGradient id="rim-grad-act" cx="50%" cy="50%" r="50%">
                  <stop offset="72%" stopColor="#161b24" />
                  <stop offset="92%" stopColor="#0e1118" />
                  <stop offset="100%" stopColor="#05070a" />
                </radialGradient>
                <radialGradient id="hub-grad-act" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#2c374b" />
                  <stop offset="65%" stopColor="#151b27" />
                  <stop offset="100%" stopColor="#0a0d14" />
                </radialGradient>
                <linearGradient id="spoke-grad-act" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3c4c69" />
                  <stop offset="100%" stopColor="#141a26" />
                </linearGradient>
              </defs>

              {/* Outer Rim leather shadow */}
              <circle cx="120" cy="120" r="100" fill="none" stroke="rgba(0, 0, 0, 0.7)" strokeWidth="20" />
              {/* Outer Rim */}
              <circle cx="120" cy="120" r="100" fill="none" stroke="url(#rim-grad-act)" strokeWidth="16" />
              {/* Inner neon highlights */}
              <circle cx="120" cy="120" r="92" fill="none" stroke="#00f0ff" strokeWidth="1" opacity="0.35" />

              {/* Spokes */}
              {/* Left Spoke */}
              <path d="M 30 114 L 85 114 Q 92 114 90 128 L 34 128 Z" fill="url(#spoke-grad-act)" />
              {/* Right Spoke */}
              <path d="M 210 114 L 155 114 Q 148 114 150 128 L 206 128 Z" fill="url(#spoke-grad-act)" />
              {/* Bottom Spoke */}
              <path d="M 112 150 L 112 206 C 112 210 128 210 128 206 L 128 150 Z" fill="url(#spoke-grad-act)" />

              {/* Center Hub carbon texture area */}
              <circle cx="120" cy="120" r="34" fill="url(#hub-grad-act)" stroke="#1a2333" strokeWidth="2" />

              {/* Logo Badge */}
              <circle cx="120" cy="120" r="18" fill="#080b11" stroke="#00f0ff" strokeWidth="1.5" />
              <text x="120" y="123" fontFamily="'Orbitron', sans-serif" fontSize="9" fontWeight="900" fill="#00f0ff" textAnchor="middle" letterSpacing="0.5">DS</text>

              {/* Grip markers */}
              <path d="M 29 95 Q 26 105 29 115 L 33 115 Q 30 105 33 95 Z" fill="#0a0d14" />
              <path d="M 211 95 Q 214 105 211 115 L 207 115 Q 210 105 207 95 Z" fill="#0a0d14" />
            </svg>
          </div>
        </div>
      </div>

      <div className="stats-panel">
        <div className="telemetry-value-display">
          <span className="telemetry-label">STEERING ANGLE</span>
          <div className="telemetry-box angle-box-actual">
            <span className="telemetry-number" id="actual-angle-val">{formatted.text}</span>
          </div>
        </div>
        <div className="sub-telemetry-row" style={{ justifyContent: 'center' }}>
          <div className="sub-telemetry-item" style={{ textAlign: 'center' }}>
            <span className="sub-label">DIRECTION</span>
            <span className="sub-value highlight-cyan" id="actual-dir-val" style={{ fontSize: '0.9rem' }}>{formatted.dir}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
