import React from 'react';

export default function StatusCard() {
  return (
    <section className="telemetry-card glass-card" id="status-card-section">
      <div className="card-edge-glow"></div>
      <div className="card-meta">
        <span className="panel-label">COCKPIT STATUS CHECK</span>
        <span className="telemetry-id">SYS-05</span>
      </div>

      <div className="status-grid" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', flexGrow: 1, justifyContent: 'center' }}>
        <div className="status-item-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="sub-label">SENSOR ARRAY</span>
          <span className="sub-value" style={{ color: 'var(--accent-green)', textShadow: '0 0 8px rgba(0, 255, 159, 0.3)' }}>ONLINE</span>
        </div>
        <div className="status-divider" style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.04)' }}></div>
        
        <div className="status-item-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="sub-label">OBD-II DATA FEED</span>
          <span className="sub-value" style={{ color: 'var(--accent-green)', textShadow: '0 0 8px rgba(0, 255, 159, 0.3)' }}>CONNECTED</span>
        </div>
        <div className="status-divider" style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.04)' }}></div>

        <div className="status-item-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="sub-label">CO-DRIVER FOCUS</span>
          <span className="sub-value">ATTENTIVE (94%)</span>
        </div>
        <div className="status-divider" style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.04)' }}></div>

        <div className="status-item-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="sub-label">TRACTION INDEX</span>
          <span className="sub-value">0.82 DRY ASPHALT</span>
        </div>
        <div className="status-divider" style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.04)' }}></div>

        <div className="status-item-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="sub-label">AUX VOLTAGE</span>
          <span className="sub-value">13.8V NORMAL</span>
        </div>
      </div>
    </section>
  );
}
