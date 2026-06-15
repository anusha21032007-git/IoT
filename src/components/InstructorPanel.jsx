import React from 'react';

export default function InstructorPanel({
  isSimulating = false,
  currentLessonIndex = -1,
  countdown = null,
  instruction = '',
  scenarioTitle = ''
}) {
  let bodyContent = '';

  if (currentLessonIndex >= 4) {
    bodyContent = 'Training Completed ✅ Press START to begin another session.';
  } else if (isSimulating) {
    bodyContent = instruction ? `"${instruction}"` : 'Simulating...';
  } else {
    bodyContent = 'Ready to begin steering training. Press START to begin.';
  }

  return (
    <div className="instructor-bar glass-card" id="instructor-panel-section">
      <div className="instructor-content-row">
        <div className="instructor-text-group">
          <span className="instructor-label">INSTRUCTOR:</span>
          <span className="instructor-instruction" id="instructor-text">{bodyContent}</span>
        </div>
        
        {countdown !== null && (
          <div className="instructor-countdown-group">
            <span className="countdown-label">COUNTDOWN:</span>
            <span className={`countdown-value ${countdown === 'GO' ? 'go-active' : 'count-active'}`} id="countdown-val">
              {countdown}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
