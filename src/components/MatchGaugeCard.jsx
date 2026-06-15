import React from 'react';

export default function MatchGaugeCard({ actualAngle = 0, dummyAngle = 0 }) {
  const difference = Math.abs(actualAngle - dummyAngle);
  const accuracy = Math.max(0, Math.min(100, Math.round(100 - difference)));

  // Gauge arc parameters
  const ARC_LENGTH = 353.43;
  const strokeDashoffset = ARC_LENGTH - (accuracy / 100) * ARC_LENGTH;

  // Determine status details & colors based on requirements:
  // 90-100: Green
  // 70-89: Yellow
  // 50-69: Orange
  // Below 50: Red
  let statusText = 'Poor Match 🔴';
  let statusClass = 'status-poor';
  let accuracyClass = 'accuracy-poor';
  let glowClass = 'accuracy-glow-poor';
  let textClass = 'text-poor';
  let themeColorVar = 'var(--accent-red)';

  if (accuracy >= 90) {
    statusText = 'Excellent Match ✅';
    statusClass = 'status-excellent';
    accuracyClass = 'accuracy-excellent';
    glowClass = 'accuracy-glow-excellent';
    textClass = 'text-excellent';
    themeColorVar = 'var(--accent-green)';
  } else if (accuracy >= 70) {
    statusText = 'Good Match 🟡';
    statusClass = 'status-good';
    accuracyClass = 'accuracy-good';
    glowClass = 'accuracy-glow-good';
    textClass = 'text-good';
    themeColorVar = 'var(--accent-yellow)';
  } else if (accuracy >= 50) {
    statusText = 'Average Match 🟠';
    statusClass = 'status-average';
    accuracyClass = 'accuracy-average';
    glowClass = 'accuracy-glow-average';
    textClass = 'text-average';
    themeColorVar = 'var(--accent-orange)';
  }

  // Calculate dynamic feedback message:
  // Perfect Alignment, Great Steering Control, Good Match, Turn Slightly Left, Turn Slightly Right, Try Turning More
  const diffAngle = actualAngle - dummyAngle; // positive if actual is more to the right than dummy
  let feedbackMessage = "";
  if (accuracy >= 95) {
    feedbackMessage = "Perfect Alignment";
  } else if (accuracy >= 85) {
    feedbackMessage = "Great Steering Control";
  } else if (accuracy >= 70) {
    feedbackMessage = "Good Match";
  } else {
    // accuracy < 70
    if (diffAngle > 30) {
      feedbackMessage = "Try Turning More";
    } else if (diffAngle < -30) {
      feedbackMessage = "Try Turning More";
    } else if (diffAngle > 0) {
      feedbackMessage = "Turn Slightly Right";
    } else {
      feedbackMessage = "Turn Slightly Left";
    }
  }

  // Standout border / glow color styles based on current accuracy level
  const heroCardStyle = {
    borderColor: `rgba(${accuracy >= 90 ? '0, 255, 159' : accuracy >= 70 ? '255, 204, 0' : accuracy >= 50 ? '255, 149, 0' : '255, 59, 48'}, 0.45)`,
    boxShadow: `0 0 45px rgba(${accuracy >= 90 ? '0, 255, 159' : accuracy >= 70 ? '255, 204, 0' : accuracy >= 50 ? '255, 149, 0' : '255, 59, 48'}, 0.2), inset 0 0 30px rgba(${accuracy >= 90 ? '0, 255, 159' : accuracy >= 70 ? '255, 204, 0' : accuracy >= 50 ? '255, 149, 0' : '255, 59, 48'}, 0.08)`,
    transform: 'scale(1.02)',
    zIndex: 6
  };

  return (
    <section 
      className="telemetry-card glass-card highlight-card hero-accuracy-card" 
      id="accuracy-gauge-section"
      style={heroCardStyle}
    >
      <div className="card-edge-glow"></div>
      <div className="card-meta">
        <span className="panel-label" style={{ color: themeColorVar, fontWeight: 'bold' }}>Accuracy Card</span>
        <span className="telemetry-id">SYNC-02</span>
      </div>

      <div className="gauge-outer-wrapper">
        {/* SVG Circular Gauge */}
        <div className="svg-gauge-container">
          <svg className="circular-gauge" viewBox="0 0 200 200">
            <defs>
              <filter id="glow-blur" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            {/* Background Track */}
            <circle className="gauge-bg" cx="100" cy="100" r="75" strokeDasharray="353.43 471.24" />
            {/* Glow Stroke */}
            <circle className={`gauge-glow ${glowClass}`} id="gauge-stroke-glow" cx="100" cy="100" r="75" strokeDasharray="353.43 471.24" strokeDashoffset={strokeDashoffset} filter="url(#glow-blur)" />
            {/* Active Value Stroke */}
            <circle className={`gauge-value ${accuracyClass}`} id="gauge-stroke-val" cx="100" cy="100" r="75" strokeDasharray="353.43 471.24" strokeDashoffset={strokeDashoffset} />
          </svg>
          <div className="gauge-overlay-content">
            <span className={`gauge-accuracy-percentage ${textClass}`} id="accuracy-percentage-val">{accuracy}%</span>
          </div>
        </div>
      </div>

      <div className="gauge-status-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
        <div style={{ color: themeColorVar, fontWeight: 'bold', fontSize: '1.25rem', fontFamily: 'var(--font-cyber)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          {statusText}
        </div>
        <div style={{ color: 'var(--text-primary)', fontSize: '1.05rem', fontWeight: '600', fontFamily: 'var(--font-cyber)' }}>
          Difference: {Math.round(difference)}°
        </div>
        <div className={`feedback-message-box ${statusClass}`} style={{ 
          marginTop: '4px', 
          padding: '6px 16px', 
          borderRadius: '8px', 
          border: `1px solid rgba(${accuracy >= 90 ? '0, 255, 159' : accuracy >= 70 ? '255, 204, 0' : accuracy >= 50 ? '255, 149, 0' : '255, 59, 48'}, 0.25)`,
          background: 'rgba(0, 0, 0, 0.3)',
          textAlign: 'center',
          minWidth: '200px'
        }}>
          <span className={`feedback-msg-text ${textClass}`} style={{ fontWeight: 'bold', fontSize: '0.9rem', letterSpacing: '0.5px' }}>
            {feedbackMessage}
          </span>
        </div>
      </div>
    </section>
  );
}
