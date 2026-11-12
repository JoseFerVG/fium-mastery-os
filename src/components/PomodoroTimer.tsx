import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  Zap, 
  Flame, 
  Volume2, 
  VolumeX 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/soundEffects';
import { BadgePill } from './ui/BadgePill';
import { AnimatedCounter } from './ui/AnimatedCounter';

interface PomodoroTimerProps {
  onSessionComplete?: (minutes: number) => void;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onSessionComplete }) => {
  const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [soundTickEnabled, setSoundTickEnabled] = useState<boolean>(true);
  const [completedPomodoros, setCompletedPomodoros] = useState<number>(() => {
    return Number(localStorage.getItem('fium_completed_pomodoros') || 0);
  });

  const getDuration = (m: 'focus' | 'shortBreak' | 'longBreak') => {
    if (m === 'focus') return 25 * 60;
    if (m === 'shortBreak') return 5 * 60;
    return 15 * 60;
  };

  const totalDuration = getDuration(mode);
  const progressRatio = timeLeft / totalDuration;
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progressRatio);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 5 && soundTickEnabled) {
            soundManager.playTick();
          }
          return t - 1;
        });
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      clearInterval(interval);
      setIsActive(false);

      if (mode === 'focus') {
        const newCount = completedPomodoros + 1;
        setCompletedPomodoros(newCount);
        localStorage.setItem('fium_completed_pomodoros', String(newCount));
        if (onSessionComplete) onSessionComplete(25);
        soundManager.playFanfare();

        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });

        if (newCount % 4 === 0) {
          setMode('longBreak');
          setTimeLeft(15 * 60);
        } else {
          setMode('shortBreak');
          setTimeLeft(5 * 60);
        }
      } else {
        soundManager.playPowerup();
        setMode('focus');
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, completedPomodoros, soundTickEnabled]);

  const toggleTimer = () => {
    soundManager.playClick();
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    soundManager.playClick();
    setIsActive(false);
    setTimeLeft(getDuration(mode));
  };

  const switchMode = (newMode: 'focus' | 'shortBreak' | 'longBreak') => {
    soundManager.playClick();
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(getDuration(newMode));
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const modeTheme = {
    focus: {
      ringColor: '#FF9600',
      title: '🎯 Modo: Estudio Activo & Sin Distracciones',
      badge: 'amber' as const
    },
    shortBreak: {
      ringColor: '#58CC02',
      title: '☕ Modo: Pausa Corta (Respira, hidrátate)',
      badge: 'emerald' as const
    },
    longBreak: {
      ringColor: '#1CB0F6',
      title: '🧘 Modo: Pausa Larga (Camina, despeja la mente)',
      badge: 'indigo' as const
    }
  }[mode];

  return (
    <div className="duo-card p-6 sm:p-10 max-w-3xl mx-auto font-sans text-[#4B4B4B]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b-2 border-[#E5E5E5]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BadgePill variant={modeTheme.badge} pulse={isActive}>
              ESTACIÓN DE ENFOQUE PROFUNDO
            </BadgePill>
            <span className="text-xs font-bold text-[#AFAFAF]">Técnica 25/5</span>
          </div>
          <h3 className="text-2xl font-black text-[#4B4B4B]">Cronómetro Pomodoro FIUM</h3>
          <p className="text-xs text-[#777777] font-bold mt-0.5">Micro-bloques para consolidación de memoria a largo plazo.</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setSoundTickEnabled(!soundTickEnabled)}
            className="p-2.5 rounded-xl border-2 border-[#E5E5E5] hover:bg-[#F7F7F7] text-[#777777] transition cursor-pointer"
            title={soundTickEnabled ? 'Sonido activado' : 'Sonido silenciado'}
          >
            {soundTickEnabled ? <Volume2 className="w-4 h-4 text-[#FF9600]" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF4D0] border-2 border-[#FFC800]/50 rounded-2xl text-[#FF9600] font-black text-xs">
            <Flame className="w-4 h-4 text-[#FF9600] fill-[#FF9600]" />
            <span><AnimatedCounter value={completedPomodoros} suffix=" bloques" /></span>
          </div>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex justify-center gap-2 mb-8 max-w-md mx-auto">
        {[
          { id: 'focus', label: 'Estudio (25 min)', icon: <Zap className="w-3.5 h-3.5" /> },
          { id: 'shortBreak', label: 'Pausa (5 min)', icon: <Coffee className="w-3.5 h-3.5" /> },
          { id: 'longBreak', label: 'Larga (15 min)', icon: <Coffee className="w-3.5 h-3.5" /> }
        ].map(tab => {
          const isCurrent = mode === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => switchMode(tab.id as typeof mode)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition border-2 border-b-4 flex items-center gap-1.5 cursor-pointer ${
                isCurrent
                  ? 'bg-[#E5F6FD] border-[#84D8FF] text-[#1CB0F6]'
                  : 'bg-white border-[#E5E5E5] text-[#777777] hover:bg-[#F7F7F7]'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Circular Progress Ring */}
      <div className="relative flex flex-col items-center justify-center my-6">
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 260 260">
            <circle
              cx="130"
              cy="130"
              r={radius}
              className="text-[#E5E5E5]"
              strokeWidth="12"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="130"
              cy="130"
              r={radius}
              stroke={modeTheme.ringColor}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          {/* Time Display Center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
            <div className="text-6xl sm:text-7xl font-black tracking-tighter text-[#4B4B4B] tabular-nums">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest mt-2 px-3.5 py-1 bg-[#F7F7F7] text-[#777777] rounded-full border-2 border-[#E5E5E5]">
              {isActive ? 'EJECUTANDO SESIÓN' : 'EN PAUSA'}
            </span>
          </div>
        </div>

        <p className="text-xs text-[#777777] font-black uppercase tracking-wider mt-4 text-center">
          {modeTheme.title}
        </p>
      </div>

      {/* Clock Controls */}
      <div className="flex justify-center items-center gap-4 mt-8 pt-6 border-t-2 border-[#E5E5E5]">
        <button
          onClick={resetTimer}
          aria-label="Reiniciar temporizador"
          className="duo-btn-white p-3.5"
          title="Reiniciar"
        >
          <RotateCcw className="w-5 h-5 stroke-[2.5]" />
        </button>

        <button
          onClick={toggleTimer}
          className={`${
            isActive ? 'duo-btn-yellow' : 'duo-btn-green'
          } px-10 py-3.5 text-sm flex items-center gap-2`}
        >
          {isActive ? (
            <>
              <Pause className="w-5 h-5 fill-white" /> Pausar Foco
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-white" /> Comenzar Sesión
            </>
          )}
        </button>
      </div>
    </div>
  );
};
