import React, { useState, useRef, useEffect } from 'react';

export default function DummySteeringCard({
  dummyAngle = 0,
  targetAngle = 0,
  isSimulating = false,
  currentLessonIndex = -1,
  setDummyAngle
}) {
  const [inputMethod, setInputMethod] = useState('MANUAL');

  const wheelContainerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startCursorAngleRef = useRef(0);
  const startWheelAngleRef = useRef(0);
  const dummyAngleRef = useRef(dummyAngle);

  // Keep ref in sync to prevent stale closures in event listeners
  useEffect(() => {
    dummyAngleRef.current = dummyAngle;
  }, [dummyAngle]);

  const getWheelCenter = () => {
    if (!wheelContainerRef.current) return { x: 0, y: 0 };
    const rect = wheelContainerRef.current.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  };

  const getPointerAngle = (clientX, clientY, center) => {
    const dx = clientX - center.x;
    const dy = clientY - center.y;
    const radians = Math.atan2(dy, dx);
    return radians * (180 / Math.PI);
  };

  const onDragStart = (clientX, clientY) => {
    isDraggingRef.current = true;
    setInputMethod('STEERING');

    const center = getWheelCenter();
    startCursorAngleRef.current = getPointerAngle(clientX, clientY, center);
    startWheelAngleRef.current = dummyAngleRef.current;
  };

  const onDragMove = (clientX, clientY) => {
    if (!isDraggingRef.current) return;

    const center = getWheelCenter();
    const currentCursorAngle = getPointerAngle(clientX, clientY, center);

    let delta = currentCursorAngle - startCursorAngleRef.current;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    let target = startWheelAngleRef.current + delta;
    target = Math.max(-180, Math.min(180, target));

    setDummyAngle(target);
  };

  const onDragEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setInputMethod('MANUAL');
  };

  const handleMouseDown = (e) => {
    onDragStart(e.clientX, e.clientY);
    e.preventDefault();
  };

  const handleTouchStart = (e) => {
    if (e.touches.length > 0) {
      onDragStart(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDraggingRef.current) {
        onDragMove(e.clientX, e.clientY);
      }
    };

    const handleMouseUp = () => {
      onDragEnd();
    };

    const handleTouchMove = (e) => {
      if (isDraggingRef.current && e.touches.length > 0) {
        onDragMove(e.touches[0].clientX, e.touches[0].clientY);
        if (e.cancelable) e.preventDefault();
      }
    };

    const handleTouchEnd = () => {
      onDragEnd();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const formatAngle = (angle) => {
    const rounded = Math.round(angle);
    const sign = rounded > 0 ? '+' : '';
    const dir = rounded > 0 ? 'RIGHT' : (rounded < 0 ? 'LEFT' : 'CENTER');
    return {
      text: `${sign}${rounded}°`,
      dir
    };
  };

  const formatted = formatAngle(dummyAngle);

  return (
    <section className="telemetry-card glass-card" id="dummy-steering-section">
      <div className="card-edge-glow"></div>
      <div className="card-meta">
        <span className="panel-label">Dummy Steering</span>
        <span className="telemetry-id">SIM-03</span>
      </div>

      <div className="wheel-outer-wrapper">
        {/* Steering Wheel Container */}
        <div
          className="steering-wheel-container interactive-container"
          id="dummy-wheel-container"
          ref={wheelContainerRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className="steering-wheel" id="dummy-wheel" style={{ transform: `rotate(${dummyAngle}deg)` }}>
            <svg className="steering-wheel-svg" viewBox="0 0 240 240">
              <defs>
                <radialGradient id="rim-grad-dum" cx="50%" cy="50%" r="50%">
                  <stop offset="72%" stopColor="#181f2a" />
                  <stop offset="92%" stopColor="#0f141b" />
                  <stop offset="100%" stopColor="#06090d" />
                </radialGradient>
                <radialGradient id="hub-grad-dum" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#323e54" />
                  <stop offset="65%" stopColor="#19202e" />
                  <stop offset="100%" stopColor="#0d111a" />
                </radialGradient>
              </defs>

              {/* Outer Rim leather shadow */}
              <circle cx="120" cy="120" r="100" fill="none" stroke="rgba(0, 0, 0, 0.7)" strokeWidth="20" />
              {/* Outer Rim */}
              <circle cx="120" cy="120" r="100" fill="none" stroke="url(#rim-grad-dum)" strokeWidth="16" />
              {/* Dashed Neon interaction pattern */}
              <circle cx="120" cy="120" r="92" fill="none" stroke="#00f0ff" strokeWidth="1.5" strokeDasharray="6, 4" opacity="0.6" />

              {/* Spokes */}
              <path d="M 30 114 L 85 114 Q 92 114 90 128 L 34 128 Z" fill="#2c374b" />
              <path d="M 210 114 L 155 114 Q 148 114 150 128 L 206 128 Z" fill="#2c374b" />
              <path d="M 112 150 L 112 206 C 112 210 128 210 128 206 L 128 150 Z" fill="#2c374b" />

              {/* Center Hub carbon texture area */}
              <circle cx="120" cy="120" r="34" fill="url(#hub-grad-dum)" stroke="#1d2636" strokeWidth="2" />
              {/* Pulsing interactive hub glow */}
              <circle className="hub-pulse-glow" cx="120" cy="120" r="34" fill="none" stroke="#00f0ff" strokeWidth="2" />

              {/* Logo Badge */}
              <circle cx="120" cy="120" r="18" fill="#0c1117" stroke="#ffffff" strokeWidth="1.5" />
              <text x="120" y="123" fontFamily="'Orbitron', sans-serif" fontSize="9" fontWeight="900" fill="#ffffff" textAnchor="middle" letterSpacing="0.5">REF</text>

              {/* Grip markers */}
              <path d="M 29 95 Q 26 105 29 115 L 33 115 Q 30 105 33 95 Z" fill="#0a0d14" />
              <path d="M 211 95 Q 214 105 211 115 L 207 115 Q 210 105 207 95 Z" fill="#0a0d14" />

              {/* Drag handle point */}
              <g className="drag-point-handle">
                <circle cx="120" cy="28" r="8" fill="#00f0ff" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="120" cy="28" r="4" fill="#0b0f14" />
              </g>
            </svg>
          </div>

          {/* Ghost Target Overlay (semi-transparent target steering wheel overlay) */}
          {isSimulating && currentLessonIndex >= 0 && (
            <div
              className="steering-wheel ghost-target-wheel"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                transform: `rotate(${targetAngle}deg)`,
                opacity: 0.35,
                pointerEvents: 'none',
                zIndex: 2
              }}
            >
              <svg className="steering-wheel-svg" viewBox="0 0 240 240">
                <defs>
                  <radialGradient id="rim-grad-ghost" cx="50%" cy="50%" r="50%">
                    <stop offset="72%" stopColor="rgba(0, 240, 255, 0.15)" />
                    <stop offset="100%" stopColor="rgba(0, 240, 255, 0.05)" />
                  </radialGradient>
                </defs>
                {/* Outer rim */}
                <circle cx="120" cy="120" r="100" fill="none" stroke="url(#rim-grad-ghost)" strokeWidth="16" />
                <circle cx="120" cy="120" r="92" fill="none" stroke="#00f0ff" strokeWidth="1.5" strokeDasharray="6, 4" opacity="0.6" />
                {/* Spokes */}
                <path d="M 30 114 L 85 114 Q 92 114 90 128 L 34 128 Z" fill="rgba(0, 240, 255, 0.2)" />
                <path d="M 210 114 L 155 114 Q 148 114 150 128 L 206 128 Z" fill="rgba(0, 240, 255, 0.2)" />
                <path d="M 112 150 L 112 206 C 112 210 128 210 128 206 L 128 150 Z" fill="rgba(0, 240, 255, 0.2)" />
                {/* Hub */}
                <circle cx="120" cy="120" r="34" fill="rgba(0, 240, 255, 0.1)" stroke="#00f0ff" strokeWidth="1" strokeDasharray="3, 3" />
                <circle cx="120" cy="120" r="18" fill="rgba(0, 240, 255, 0.2)" stroke="#00f0ff" strokeWidth="1" />
                <text x="120" y="123" fontFamily="'Orbitron', sans-serif" fontSize="9" fontWeight="900" fill="#00f0ff" textAnchor="middle" letterSpacing="0.5">TGT</text>
              </svg>
            </div>
          )}
        </div>
      </div>

      <div className="stats-panel">
        <div className="telemetry-value-display">
          <span className="telemetry-label">REFERENCE ANGLE</span>
          <div className="telemetry-box angle-box-dummy">
            <span className="telemetry-number" id="dummy-angle-val">{formatted.text}</span>
          </div>
        </div>
        <div className="sub-telemetry-row" style={{ justifyContent: 'center' }}>
          <div className="sub-telemetry-item" style={{ textAlign: 'center' }}>
            <span className="sub-label">DIRECTION</span>
            <span className={`sub-value ${formatted.dir !== 'CENTER' ? 'highlight-cyan' : ''}`} id="dummy-dir-val" style={{ fontSize: '0.9rem' }}>
              {formatted.dir}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
