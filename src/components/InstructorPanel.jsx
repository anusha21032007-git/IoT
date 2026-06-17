import React from 'react';

export default function InstructorPanel({
  isSimulating = false,
  currentLessonIndex = -1,
  countdown = null,
  instruction = '',
  scenarioTitle = '',
  actualAngle = 0,
  dummyAngle = 0,
  lessonsCount = 11
}) {
  let bodyContent = '';

  if (currentLessonIndex >= lessonsCount) {
    bodyContent = 'Training Completed ✅ Press START to begin another session.';
  } else if (isSimulating) {
    if (countdown !== null) {
      bodyContent = `Preparing: ${scenarioTitle || 'Next Lesson'}`;
    } else {
      // Calculate dynamic friendly guidance message
      const angleDiff = actualAngle - dummyAngle;
      if (Math.abs(angleDiff) < 5) {
        bodyContent = 'Perfect synchronization!';
      } else if (dummyAngle < actualAngle) {
        bodyContent = 'Turn slightly more right.';
      } else {
        bodyContent = 'Turn slightly more left.';
      }
    }
  } else {
    bodyContent = 'Ready to begin steering training. Press START to begin.';
  }

  return (
    <div className="instructor-bar glass-card" id="instructor-panel-section">
      <div className="instructor-content-row">
        <div className="instructor-text-group">
          <span className="instructor-label">GUIDANCE:</span>
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
