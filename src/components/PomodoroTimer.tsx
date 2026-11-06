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
  VolumeX, 
  Sparkles 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/soundEffects';
import { SpotlightCard } from './ui/SpotlightCard';
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

        // Switch to break
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
      gradient: 'from-rose-500 to-amber-500',
      ringColor: '#f43f5e',
      textColor: 'text-rose-400',
      spotlight: 'rgba(244, 63, 94, 0.16)',
      title: '🎯 Modo: Estudio Activo & Sin Distracciones',
      badge: 'rose' as const
    },
    shortBreak: {
      gradient: 'from-emerald-500 to-teal-400',
      ringColor: '#10b981',
      textColor: 'text-emerald-400',
      spotlight: 'rgba(16, 185, 129, 0.16)',
      title: '☕ Modo: Pausa Corta (Respira, hidrátate)',
      badge: 'emerald' as const
    },
    longBreak: {
      gradient: 'from-indigo-500 to-purple-400',
      ringColor: '#6366f1',
      textColor: 'text-indigo-400',
      spotlight: 'rgba(99, 102, 241, 0.16)',
      title: '🧘 Modo: Pausa Larga (Camina, despeja la mente)',
      badge: 'indigo' as const
    }
  }[mode];

  return (
    <SpotlightCard 
      spotlightColor={modeTheme.spotlight}
      className="p-6 sm:p-10 max-w-3xl mx-auto shadow-2xl relative overflow-hidden"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BadgePill variant={modeTheme.badge} pulse={isActive}>
              ESTACIÓN DE ENFOQUE PROFUNDO
            </BadgePill>
            <span className="text-xs font-mono text-slate-400">Técnica 25/5</span>
          </div>
          <h3 className="text-2xl font-black text-white">Cronómetro Pomodoro de Alto Rendimiento</h3>
          <p className="text-xs text-slate-400 mt-0.5">Micro-bloques optimizados para consolidación de memoria a largo plazo.</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Ticking sound toggle */}
          <button
            onClick={() => setSoundTickEnabled(!soundTickEnabled)}
            className={`p-2.5 rounded-xl border transition ${
              soundTickEnabled
                ? 'bg-slate-800 border-slate-700 text-slate-300'
                : 'bg-slate-950 border-slate-900 text-slate-600'
            }`}
            title={soundTickEnabled ? 'Sonido de tic-tac activado' : 'Sonido silenciado'}
          >
            {soundTickEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Completed blocks counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 font-mono font-bold text-xs">
            <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span><AnimatedCounter value={completedPomodoros} suffix=" bloques" /></span>
          </div>
        </div>
      </div>

      {/* Mode Switcher Dock */}
      <div className="flex justify-center gap-2 mb-8 bg-slate-950/80 p-1.5 rounded-2xl border border-white/10 max-w-md mx-auto shadow-inner">
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
              className={`relative px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                isCurrent ? 'text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isCurrent && (
                <motion.div
                  layoutId="active-pomodoro-mode"
                  className={`absolute inset-0 rounded-xl bg-gradient-to-r ${modeTheme.gradient} shadow-md`}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                {tab.icon}
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Circular Progress Ring & Digital Timer */}
      <div className="relative flex flex-col items-center justify-center my-6">
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
          {/* Background Ambient SVG Ring */}
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 260 260">
            <circle
              cx="130"
              cy="130"
              r={radius}
              className="text-slate-800/60"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Animated Progress Ring */}
            <circle
              cx="130"
              cy="130"
              r={radius}
              stroke={modeTheme.ringColor}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-linear shadow-lg"
              style={{
                filter: `drop-shadow(0 0 12px ${modeTheme.ringColor}80)`
              }}
            />
          </svg>

          {/* Time Display Center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
            <div className="text-6xl sm:text-7xl font-black font-mono tracking-tighter text-white tabular-nums drop-shadow-xl">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest mt-2 px-3 py-1 bg-slate-900/80 rounded-full border border-white/5">
              {isActive ? 'EJECUTANDO SESIÓN' : 'EN PAUSA'}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400 font-mono mt-4 font-semibold text-center">
          {modeTheme.title}
        </p>
      </div>

      {/* Clock Controls */}
      <div className="flex justify-center items-center gap-4 mt-8 pt-4 border-t border-slate-800/80">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetTimer}
          aria-label="Reiniciar temporizador"
          className="p-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-2xl transition shadow-md"
          title="Reiniciar"
        >
          <RotateCcw className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTimer}
          className={`flex items-center gap-2.5 px-10 py-3.5 rounded-2xl font-black text-sm shadow-xl transition-all ${
            isActive
              ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30 ring-2 ring-amber-400/30'
              : `bg-gradient-to-r ${modeTheme.gradient} text-white shadow-lg shadow-rose-600/30 hover:brightness-110`
          }`}
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
        </motion.button>
      </div>
    </SpotlightCard>
  );
};
