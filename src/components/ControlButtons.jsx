import React from 'react';

export default function ControlButtons({
  isSimulating = false,
  onStart,
  onReset
}) {
  return (
    <footer className="dashboard-controls-section">
      <div className="controls-panel glass-card centered-controls-panel">
        <div className="controls-glow"></div>
        
        {/* Centered Buttons Layout */}
        <div className="btn-group centered-btn-group">
          <button
            className={`infotainment-btn btn-start ${isSimulating ? 'simulating' : ''}`}
            id="btn-start-sim"
            aria-label="Start Steering Synchronization Simulation"
            onClick={onStart}
          >
            <span className="btn-inner">
              <span className="btn-icon"></span>
              <span className="btn-text">{isSimulating ? 'STOP' : 'START'}</span>
            </span>
          </button>
          <button
            className="infotainment-btn btn-reset"
            id="btn-reset-sim"
            aria-label="Reset Steering Synchronization default values"
            onClick={onReset}
          >
            <span className="btn-inner">
              <span className="btn-icon-reset"></span>
              <span className="btn-text">RESET</span>
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
