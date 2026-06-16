import React, { useState, useEffect, useRef } from 'react';

export default function ActualSteeringCard({ actualAngle = 0 }) {
  const [isMoving, setIsMoving] = useState(false);
  const prevAngleRef = useRef(actualAngle);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (Math.abs(actualAngle - prevAngleRef.current) > 0.1) {
      setIsMoving(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsMoving(false);
      }, 150);
    }
    prevAngleRef.current = actualAngle;
  }, [actualAngle]);

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
        <span className="panel-label">Driver</span>
        <span className="telemetry-id">Driver</span>
      </div>

      <div className="wheel-outer-wrapper">
        <div className="steering-wheel-container">
          <div className={`steering-wheel ${isMoving ? 'is-moving' : ''}`} id="actual-wheel" style={{ transform: `rotate(${actualAngle}deg)` }}>
            <svg className="steering-wheel-svg" viewBox="0 0 240 240">
              <defs>
                {/* Shadow and glow filters */}
                <filter id="steer-shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.8"/>
                </filter>
                <filter id="cyan-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur"/>
                  <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                
                {/* Radial gradient for outer rim */}
                <radialGradient id="leather-rim" cx="50%" cy="50%" r="50%">
                  <stop offset="76%" stopColor="#1b202c" />
                  <stop offset="85%" stopColor="#11151e" />
                  <stop offset="96%" stopColor="#0a0d13" />
                  <stop offset="100%" stopColor="#05070a" />
                </radialGradient>
                
                {/* Hub & spoke textures */}
                <radialGradient id="hub-grad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#283243" />
                  <stop offset="65%" stopColor="#141a25" />
                  <stop offset="100%" stopColor="#0a0d14" />
                </radialGradient>
                
                <linearGradient id="brushed-metal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5a6a85" />
                  <stop offset="50%" stopColor="#2e3848" />
                  <stop offset="100%" stopColor="#161c25" />
                </linearGradient>

                <linearGradient id="chrome-ring" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#8fa3c2" />
                  <stop offset="50%" stopColor="#2e3848" />
                  <stop offset="100%" stopColor="#111620" />
                </linearGradient>
              </defs>

              {/* Ambient Backlight (visible during rotation) */}
              <circle className="wheel-ambient-glow" cx="120" cy="120" r="102" fill="none" stroke="#00f0ff" strokeWidth="20" opacity="0" filter="url(#cyan-glow)" />

              {/* Outer Rim Shadow */}
              <circle cx="120" cy="120" r="102" fill="none" stroke="rgba(0, 0, 0, 0.85)" strokeWidth="22" />
              {/* Outer Rim Body */}
              <circle cx="120" cy="120" r="102" fill="none" stroke="url(#leather-rim)" strokeWidth="18" />
              {/* Inner Rim Highlight */}
              <circle cx="120" cy="120" r="93.5" fill="none" stroke="#00f0ff" strokeWidth="1" opacity="0.25" />

              {/* Leather Stitching Details */}
              <circle cx="120" cy="120" r="110.5" fill="none" stroke="#252e3d" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />
              <circle cx="120" cy="120" r="93.5" fill="none" stroke="#252e3d" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />

              {/* 12 O'Clock Racing Stripe (Cyan) */}
              <path d="M 113.8 18.2 A 102 102 0 0 1 126.2 18.2" fill="none" stroke="#00f0ff" strokeWidth="18.5" className="wheel-glow-accent" />

              {/* Spokes Ambient Backlight */}
              <path d="M 40 120 L 200 120" stroke="#00f0ff" strokeWidth="8" opacity="0" className="wheel-ambient-glow" filter="url(#cyan-glow)" />

              {/* Horizontal Spokes (Left & Right) */}
              {/* Left Spoke */}
              <path d="M 32 105 L 86 105 C 92 105 94 100 96 95 L 96 145 C 94 140 92 135 86 135 L 32 135 C 26 130 26 110 32 105 Z" fill="url(#brushed-metal)" filter="url(#steer-shadow)" />
              <path d="M 38 116 L 54 116 L 54 124 L 38 124 Z" fill="#080a0f" />
              <rect x="58" y="108" width="34" height="24" rx="4" fill="#11151e" stroke="#252d3a" strokeWidth="1.5" />
              <circle cx="66" cy="114" r="2.5" fill="#4a5568" />
              <circle cx="74" cy="114" r="2.5" fill="#4a5568" />
              <circle cx="66" cy="126" r="2.5" fill="#4a5568" />
              <circle cx="74" cy="126" r="2.5" fill="#4a5568" />
              <rect x="80" y="112" width="6" height="16" rx="1.5" fill="#00f0ff" className="wheel-glow-accent" />

              {/* Right Spoke */}
              <path d="M 208 105 L 154 105 C 148 105 146 100 144 95 L 144 145 C 146 140 148 135 154 135 L 208 135 C 214 130 214 110 208 105 Z" fill="url(#brushed-metal)" filter="url(#steer-shadow)" />
              <path d="M 202 116 L 186 116 L 186 124 L 202 124 Z" fill="#080a0f" />
              <rect x="148" y="108" width="34" height="24" rx="4" fill="#11151e" stroke="#252d3a" strokeWidth="1.5" />
              <circle cx="174" cy="114" r="2.5" fill="#4a5568" />
              <circle cx="166" cy="114" r="2.5" fill="#4a5568" />
              <circle cx="174" cy="126" r="2.5" fill="#4a5568" />
              <circle cx="166" cy="126" r="2.5" fill="#4a5568" />
              <rect x="154" y="112" width="6" height="16" rx="1.5" fill="#00f0ff" className="wheel-glow-accent" />

              {/* Bottom Split Spoke */}
              <path d="M 104 145 L 108 206 C 108 212 112 214 114 214 L 117 214 L 117 145 Z" fill="url(#brushed-metal)" />
              <path d="M 136 145 L 132 206 C 132 212 128 214 126 214 L 123 214 L 123 145 Z" fill="url(#brushed-metal)" />
              <rect x="117" y="202" width="6" height="12" fill="#00f0ff" className="wheel-glow-accent" />

              {/* Ergonomic Molded Thumb Grips */}
              <path d="M 31 60 C 24 72 23 88 28 100 C 34 100 37 92 38 85 C 39 78 37 68 31 60 Z" fill="#0c0f15" />
              <path d="M 209 60 C 216 72 217 88 212 100 C 206 100 203 92 202 85 C 201 78 203 68 209 60 Z" fill="#0c0f15" />

              {/* Central Stitched airbag pad */}
              <path d="M 90 85 L 150 85 C 168 85 174 100 172 120 C 168 140 148 152 120 152 C 92 152 72 140 68 120 C 66 100 72 85 90 85 Z" fill="url(#hub-grad)" stroke="#161b24" strokeWidth="2.5" filter="url(#steer-shadow)" />
              <path d="M 92 90 L 148 90 C 162 90 168 102 166 118 C 162 134 144 146 120 146 C 96 146 78 134 74 118 C 72 102 78 90 92 90 Z" fill="none" stroke="#252e3d" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
              <text x="80" y="122" fontFamily="var(--font-cyber)" fontSize="5" fill="#475569" fontWeight="bold">HORN</text>
              <text x="160" y="122" fontFamily="var(--font-cyber)" fontSize="5" fill="#475569" fontWeight="bold" textAnchor="end">HORN</text>

              {/* Premium Chrome Center Badge */}
              <circle cx="120" cy="120" r="23" fill="url(#chrome-ring)" stroke="#0c0f15" strokeWidth="1" />
              <circle cx="120" cy="120" r="19" fill="#070a0e" stroke="#00f0ff" strokeWidth="1.5" className="wheel-glow-accent" />
              <text x="120" y="123" fontFamily="var(--font-cyber)" fontSize="9" fontWeight="900" fill="#00f0ff" textAnchor="middle" letterSpacing="1" className="wheel-glow-accent">DS</text>
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
