import React from 'react';

export default function MatchGaugeCard({
  actualAngle = 0,
  dummyAngle = 0,
  isSimulating = false,
  currentLessonIndex = -1,
  revealResult = false
}) {
  const isTrainingActive = isSimulating && currentLessonIndex >= 0;
  const shouldHide = isTrainingActive && !revealResult;

  const difference = Math.abs(actualAngle - dummyAngle);
  const accuracy = Math.max(0, Math.min(100, Math.round(100 - difference)));

  // Gauge arc parameters
  const ARC_LENGTH = 353.43;
  const strokeDashoffset = shouldHide
    ? ARC_LENGTH
    : ARC_LENGTH - (accuracy / 100) * ARC_LENGTH;

  // Determine status details & colors based on requirements
  let statusText = 'LOW MATCH 🔵';
  let statusClass = 'status-low';
  let accuracyClass = 'accuracy-low';
  let glowClass = 'accuracy-glow-low';
  let textClass = 'text-low';
  let themeColorVar = 'var(--accent-blue)';
  let themeRGBVar = '0, 240, 255';
  let feedbackMessage = 'Turn More';

  if (shouldHide) {
    statusText = 'STEER TO MATCH ⏱️';
    statusClass = 'status-low';
    accuracyClass = 'accuracy-low';
    glowClass = 'accuracy-glow-low';
    textClass = 'text-low';
    themeColorVar = 'var(--accent-blue)';
    themeRGBVar = '0, 240, 255';
    feedbackMessage = 'Measuring...';
  } else {
    if (accuracy >= 90) {
      statusText = 'PERFECT MATCH ✅';
      statusClass = 'status-excellent';
      accuracyClass = 'accuracy-excellent';
      glowClass = 'accuracy-glow-excellent';
      textClass = 'text-excellent';
      themeColorVar = 'var(--accent-green)';
      themeRGBVar = '0, 255, 159';
      feedbackMessage = 'Perfect Alignment';
    } else if (accuracy >= 70) {
      statusText = 'GOOD MATCH 🟢';
      statusClass = 'status-excellent';
      accuracyClass = 'accuracy-excellent';
      glowClass = 'accuracy-glow-excellent';
      textClass = 'text-excellent';
      themeColorVar = 'var(--accent-green)';
      themeRGBVar = '0, 255, 159';
      feedbackMessage = 'Almost There';
    } else if (accuracy >= 50) {
      statusText = 'AVERAGE MATCH 🟡';
      statusClass = 'status-moderate';
      accuracyClass = 'accuracy-moderate';
      glowClass = 'accuracy-glow-moderate';
      textClass = 'text-moderate';
      themeColorVar = 'var(--accent-amber)';
      themeRGBVar = '255, 170, 0';
      feedbackMessage = 'Keep Adjusting';
    } else if (accuracy >= 25) {
      statusText = 'LOW MATCH 🔵';
      statusClass = 'status-low';
      accuracyClass = 'accuracy-low';
      glowClass = 'accuracy-glow-low';
      textClass = 'text-low';
      themeColorVar = 'var(--accent-blue)';
      themeRGBVar = '0, 240, 255';
      feedbackMessage = 'Turn More';
    } else {
      statusText = 'POOR MATCH 🔴';
      statusClass = 'status-poor';
      accuracyClass = 'accuracy-poor';
      glowClass = 'accuracy-glow-poor';
      textClass = 'text-poor';
      themeColorVar = 'var(--accent-red)';
      themeRGBVar = '255, 59, 48';
      feedbackMessage = 'Try Again';
    }
  }

  // Standout border / glow color styles based on current accuracy level
  const heroCardStyle = {
    borderColor: `rgba(${themeRGBVar}, 0.35)`,
    boxShadow: `0 0 20px rgba(${themeRGBVar}, 0.15), inset 0 0 15px rgba(${themeRGBVar}, 0.04)`,
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
        <span className="panel-label" style={{ color: themeColorVar, fontWeight: 'bold' }}>Synchronization</span>
        <span className="telemetry-id">Synchronization</span>
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
            <circle className="gauge-bg" cx="100" cy="100" r="75" stroke-dasharray="353.43 471.24" />
            {/* Glow Stroke */}
            <circle className={`gauge-glow ${glowClass}`} id="gauge-stroke-glow" cx="100" cy="100" r="75" stroke-dasharray="353.43 471.24" stroke-dashoffset={strokeDashoffset} filter="url(#glow-blur)" />
            {/* Active Value Stroke */}
            <circle className={`gauge-value ${accuracyClass}`} id="gauge-stroke-val" cx="100" cy="100" r="75" stroke-dasharray="353.43 471.24" stroke-dashoffset={strokeDashoffset} />
          </svg>
          <div className="gauge-overlay-content">
            <span className={`gauge-accuracy-percentage ${textClass}`} id="accuracy-percentage-val">
              {shouldHide ? '--%' : `${accuracy}%`}
            </span>
          </div>
        </div>
      </div>

      <div className="gauge-status-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
        <div style={{ color: themeColorVar, fontWeight: 'bold', fontSize: '1.25rem', fontFamily: 'var(--font-cyber)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          {statusText}
        </div>
        <div style={{ color: 'var(--text-primary)', fontSize: '1.05rem', fontWeight: '600', fontFamily: 'var(--font-cyber)' }}>
          Difference: {shouldHide ? '--°' : `${Math.round(difference)}°`}
        </div>
        <div className={`feedback-message-box ${statusClass}`} style={{ 
          marginTop: '4px', 
          padding: '6px 16px', 
          borderRadius: '8px', 
          border: `1px solid rgba(${themeRGBVar}, 0.25)`,
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
