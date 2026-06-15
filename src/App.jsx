import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import ActualSteeringCard from './components/ActualSteeringCard';
import MatchGaugeCard from './components/MatchGaugeCard';
import DummySteeringCard from './components/DummySteeringCard';
import InstructorPanel from './components/InstructorPanel';
import ControlButtons from './components/ControlButtons';
import RotateDevice from './components/RotateDevice';
import './App.css';

const LESSONS = [
  { scenarioTitle: 'SCENARIO 01: GENTLE RIGHT', instruction: 'Take a gentle right turn.', target: 45 },
  { scenarioTitle: 'SCENARIO 02: GENTLE LEFT', instruction: 'Take a gentle left turn.', target: -45 },
  { scenarioTitle: 'SCENARIO 03: SHARP RIGHT', instruction: 'Take a sharp right turn.', target: 90 },
  { scenarioTitle: 'SCENARIO 04: CENTER STEER', instruction: 'Straighten the wheel.', target: 0 }
];

function App() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(-1);
  const [countdown, setCountdown] = useState(null);
  
  const [actualAngle, setActualAngle] = useState(0);
  const [dummyAngle, setDummyAngle] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const [isLandscape, setIsLandscape] = useState(
    window.matchMedia("(orientation: landscape)").matches || window.innerWidth > window.innerHeight
  );
  
  // Dynamic telemetry metrics (kept for state management compatibility)
  const [temp, setTemp] = useState(35.4);
  const [latency, setLatency] = useState(8);
  const [feedback, setFeedback] = useState(4.5);

  const countdownTimerRef = useRef(null);
  const holdTimerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const elapsedTimerRef = useRef(null);
  const actualAngleRef = useRef(0);

  // Stop all timers, animations, and intervals
  const stopAllTimers = () => {
    if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => stopAllTimers();
  }, []);

  // Listen for orientation and resize changes
  useEffect(() => {
    const handleResize = () => {
      const isOrientLandscape = window.matchMedia("(orientation: landscape)").matches;
      const isWidthGreater = window.innerWidth > window.innerHeight;
      setIsLandscape(isOrientLandscape || isWidthGreater);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    // Initial check
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Sync angle ref
  useEffect(() => {
    actualAngleRef.current = actualAngle;
  }, [actualAngle]);

  // General telemetry fluctuation when simulating
  useEffect(() => {
    if (!isSimulating) {
      setTemp(35.4);
      setLatency(8);
      setFeedback(4.5);
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const nextFeedback = 4.0 + Math.abs(Math.sin(elapsed * 0.001)) * 2.0 + (Math.random() * 0.3 - 0.15);
      const nextTemp = 35.0 + Math.sin(elapsed * 0.0001) * 1.2 + (Math.random() * 0.1 - 0.05);
      const nextLatency = Math.max(4, Math.min(24, Math.round(8 + Math.sin(elapsed * 0.0008) * 4 + (Math.random() * 2 - 1))));

      setFeedback(nextFeedback);
      setTemp(nextTemp);
      setLatency(nextLatency);
    }, 500);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const startLesson = (index) => {
    setCurrentLessonIndex(index);
    setCountdown(3);

    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    runCountdown(3, index);
  };

  const runCountdown = (number, index) => {
    if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);

    countdownTimerRef.current = setTimeout(() => {
      if (number === 3) {
        setCountdown(2);
        runCountdown(2, index);
      } else if (number === 2) {
        setCountdown(1);
        runCountdown(1, index);
      } else if (number === 1) {
        setCountdown('GO');
        runCountdown('GO', index);
      } else if (number === 'GO') {
        setCountdown(null);
        startRotation(index);
      }
    }, 1000);
  };

  const startRotation = (index) => {
    const lesson = LESSONS[index];
    const target = lesson.target;

    const animate = () => {
      const current = actualAngleRef.current;
      const diff = target - current;
      const step = 1.5; // Speed: 1.5 degrees per frame

      if (Math.abs(diff) <= step) {
        actualAngleRef.current = target;
        setActualAngle(target);
        startHold(index);
      } else {
        const nextAngle = current + (diff > 0 ? step : -step);
        actualAngleRef.current = nextAngle;
        setActualAngle(nextAngle);
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const startHold = (index) => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);

    holdTimerRef.current = setTimeout(() => {
      const nextIndex = index + 1;
      if (nextIndex < LESSONS.length) {
        startLesson(nextIndex);
      } else {
        // Complete training sequence
        setIsSimulating(false);
        setCurrentLessonIndex(LESSONS.length); // mark as completely finished
        if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
      }
    }, 4000); // Hold for 4 seconds
  };

  const handleStart = () => {
    if (isSimulating) {
      // Act as STOP
      setIsSimulating(false);
      stopAllTimers();
      return;
    }

    // 1. Reset state
    stopAllTimers();
    setActualAngle(0);
    actualAngleRef.current = 0;
    setDummyAngle(0);
    setElapsedTime(0);
    setIsSimulating(true);

    // 2. Start clock
    elapsedTimerRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    // 3. Start lesson 1
    startLesson(0);
  };

  const handleReset = () => {
    stopAllTimers();
    setIsSimulating(false);
    setCurrentLessonIndex(-1);
    setCountdown(null);
    setActualAngle(0);
    actualAngleRef.current = 0;
    setDummyAngle(0);
    setElapsedTime(0);
  };

  // Derive lesson details
  const activeLesson = currentLessonIndex >= 0 && currentLessonIndex < LESSONS.length ? LESSONS[currentLessonIndex] : null;
  const instruction = activeLesson ? activeLesson.instruction : '';
  const scenarioTitle = activeLesson ? activeLesson.scenarioTitle : '';
  const targetAngle = activeLesson ? activeLesson.target : 0;

  if (!isLandscape) {
    return <RotateDevice />;
  }

  return (
    <div className="cockpit-container">
      {/* Cockpit Glass reflection overlay */}
      <div className="cockpit-reflection"></div>
      
      {/* Dashboard Header */}
      <Header />
      
      {/* Main Steering Dashboard Grid */}
      <main className="dashboard-grid">
        <ActualSteeringCard actualAngle={actualAngle} />
        
        <MatchGaugeCard actualAngle={actualAngle} dummyAngle={dummyAngle} />
        
        <DummySteeringCard
          dummyAngle={dummyAngle}
          targetAngle={targetAngle}
          isSimulating={isSimulating}
          currentLessonIndex={currentLessonIndex}
          setDummyAngle={setDummyAngle}
        />
      </main>

      {/* Compact Instructor HUD Bar */}
      <InstructorPanel
        isSimulating={isSimulating}
        currentLessonIndex={currentLessonIndex}
        countdown={countdown}
        instruction={instruction}
        scenarioTitle={scenarioTitle}
      />

      {/* Centered Controls Unit */}
      <ControlButtons
        isSimulating={isSimulating}
        onStart={handleStart}
        onReset={handleReset}
      />
    </div>
  );
}

export default App;
