import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import ActualSteeringCard from './components/ActualSteeringCard';
import MatchGaugeCard from './components/MatchGaugeCard';
import DummySteeringCard from './components/DummySteeringCard';
import InstructorPanel from './components/InstructorPanel';
import ControlButtons from './components/ControlButtons';
import RotateDevice from './components/RotateDevice';
import './App.css';

const BASE_ANGLES = [0, 15, -15, 30, -30, 45, -45, 60, -60, 90, -90];

function createLesson(angle, index) {
  const scenarioNumber = String(index + 1).padStart(2, '0');
  let title = '';
  let instruction = '';

  if (angle === 0) {
    title = `SCENARIO ${scenarioNumber}: CENTER STEER`;
    instruction = 'Straighten the wheel.';
  } else {
    const direction = angle > 0 ? 'RIGHT' : 'LEFT';
    const absAngle = Math.abs(angle);
    let intensity = 'GENTLE';
    if (absAngle <= 15) {
      intensity = 'MINIMAL';
    } else if (absAngle <= 30) {
      intensity = 'GENTLE';
    } else if (absAngle <= 45) {
      intensity = 'MODERATE';
    } else if (absAngle <= 60) {
      intensity = 'SHARP';
    } else {
      intensity = 'MAXIMUM';
    }
    title = `SCENARIO ${scenarioNumber}: ${intensity} ${direction}`;
    instruction = `Take a ${intensity.toLowerCase()} ${direction.toLowerCase()} turn.`;
  }

  return {
    scenarioTitle: title,
    instruction: instruction,
    target: angle
  };
}

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function App() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(-1);
  const [countdown, setCountdown] = useState(null);
  
  const [actualAngle, setActualAngle] = useState(0);
  const [dummyAngle, setDummyAngle] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const [revealResult, setRevealResult] = useState(false);
  const [lessons, setLessons] = useState([]);
  const lessonsRef = useRef([]);

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

  const startLesson = (index, currentLessons = lessonsRef.current) => {
    setCurrentLessonIndex(index);
    setCountdown(5);
    setRevealResult(false);
    
    // Reset driver wheel position to 0 at start of round
    setActualAngle(0);
    actualAngleRef.current = 0;

    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    startRotation(index, currentLessons);
    runCountdown(5, index, currentLessons);
  };

  const runCountdown = (number, index, currentLessons = lessonsRef.current) => {
    if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);

    countdownTimerRef.current = setTimeout(() => {
      if (number === 5) {
        setCountdown(4);
        runCountdown(4, index, currentLessons);
      } else if (number === 4) {
        setCountdown(3);
        runCountdown(3, index, currentLessons);
      } else if (number === 3) {
        setCountdown(2);
        runCountdown(2, index, currentLessons);
      } else if (number === 2) {
        setCountdown(1);
        runCountdown(1, index, currentLessons);
      } else if (number === 1) {
        setCountdown('GO');
        setRevealResult(true);
        runCountdown('GO', index, currentLessons);
      } else if (number === 'GO') {
        setCountdown(null);
        startHold(index, currentLessons);
      }
    }, 1000);
  };

  const startRotation = (index, currentLessons = lessonsRef.current) => {
    const lesson = currentLessons[index];
    if (!lesson) return;
    const target = lesson.target;

    const animate = () => {
      const current = actualAngleRef.current;
      const diff = target - current;
      const step = 1.5; // Speed: 1.5 degrees per frame

      if (Math.abs(diff) <= step) {
        actualAngleRef.current = target;
        setActualAngle(target);
      } else {
        const nextAngle = current + (diff > 0 ? step : -step);
        actualAngleRef.current = nextAngle;
        setActualAngle(nextAngle);
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const startHold = (index, currentLessons = lessonsRef.current) => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);

    holdTimerRef.current = setTimeout(() => {
      const nextIndex = index + 1;
      if (nextIndex < currentLessons.length) {
        startLesson(nextIndex, currentLessons);
      } else {
        // Complete training sequence
        setIsSimulating(false);
        setCurrentLessonIndex(currentLessons.length); // mark as completely finished
        if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
      }
    }, 4000); // Hold for 4 seconds after reveal is complete
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
    setRevealResult(false);
    setIsSimulating(true);

    // Generate dynamic shuffled angles training sequence
    const shuffledAngles = shuffleArray(BASE_ANGLES);
    const newLessons = shuffledAngles.map((angle, idx) => createLesson(angle, idx));
    lessonsRef.current = newLessons;
    setLessons(newLessons);

    // 2. Start clock
    elapsedTimerRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    // 3. Start lesson 1
    startLesson(0, newLessons);
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
    setRevealResult(false);
    setLessons([]);
    lessonsRef.current = [];
  };

  // Derive lesson details
  const activeLesson = currentLessonIndex >= 0 && currentLessonIndex < lessons.length ? lessons[currentLessonIndex] : null;
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
        <DummySteeringCard
          dummyAngle={dummyAngle}
          targetAngle={targetAngle}
          isSimulating={isSimulating}
          currentLessonIndex={currentLessonIndex}
          setDummyAngle={setDummyAngle}
          revealResult={revealResult}
        />

        <MatchGaugeCard
          actualAngle={actualAngle}
          dummyAngle={dummyAngle}
          isSimulating={isSimulating}
          currentLessonIndex={currentLessonIndex}
          revealResult={revealResult}
        />

        <ActualSteeringCard
          actualAngle={actualAngle}
          targetAngle={targetAngle}
          isSimulating={isSimulating}
        />
      </main>

      {/* Compact Instructor HUD Bar */}
      <InstructorPanel
        isSimulating={isSimulating}
        currentLessonIndex={currentLessonIndex}
        countdown={countdown}
        instruction={instruction}
        scenarioTitle={scenarioTitle}
        actualAngle={actualAngle}
        dummyAngle={dummyAngle}
        lessonsCount={lessons.length}
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
