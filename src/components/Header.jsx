import React, { useState, useEffect } from 'react';

export default function Header() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`);
      });
    }
  };

  return (
    <header className="dashboard-header">
      <div className="header-content">
        <h1 className="logo-title">DRIVESYNC</h1>
        <p className="logo-tagline">Mirror the Drive. Feel the Journey.</p>
      </div>
      <button className="fullscreen-btn" onClick={toggleFullscreen} aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}>
        <span>{isFullscreen ? '✕ Exit Fullscreen' : '⛶ Fullscreen'}</span>
      </button>
    </header>
  );
}
