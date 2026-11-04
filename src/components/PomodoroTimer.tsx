import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw, Coffee, Zap, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PomodoroTimerProps {
  onSessionComplete?: (minutes: number) => void;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onSessionComplete }) => {
  const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [completedPomodoros, setCompletedPomodoros] = useState<number>(() => {
    return Number(localStorage.getItem('fium_completed_pomodoros') || 0);
  });

  const getDuration = (m: 'focus' | 'shortBreak' | 'longBreak') => {
    if (m === 'focus') return 25 * 60;
    if (m === 'shortBreak') return 5 * 60;
    return 15 * 60;
  };

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      clearInterval(interval);
      setIsActive(false);

      if (mode === 'focus') {
        const newCount = completedPomodoros + 1;
        setCompletedPomodoros(newCount);
        localStorage.setItem('fium_completed_pomodoros', String(newCount));
        if (onSessionComplete) onSessionComplete(25);

        confetti({
          particleCount: 80,
          spread: 70,
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
        setMode('focus');
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, completedPomodoros]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(getDuration(mode));
  };

  const switchMode = (newMode: 'focus' | 'shortBreak' | 'longBreak') => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(getDuration(newMode));
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-rose-500/10 text-rose-400 rounded-lg">
            <Timer className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-xl font-bold text-white">Estación de Foco Profundo (Anti-Procrastinación)</h3>
            <p className="text-sm text-slate-400">Micro-bloques de 25 min para recuperar el ritmo sin agotamiento mental.</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 font-bold text-xs">
          <Flame className="w-4 h-4 text-rose-500" />
          <span>{completedPomodoros} bloques completados</span>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex justify-center gap-2 mb-8">
        <button
          onClick={() => switchMode('focus')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            mode === 'focus'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Zap className="w-4 h-4" /> Estudio Intenso (25 min)
        </button>
        <button
          onClick={() => switchMode('shortBreak')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            mode === 'shortBreak'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Coffee className="w-4 h-4" /> Pausa Corta (5 min)
        </button>
        <button
          onClick={() => switchMode('longBreak')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            mode === 'longBreak'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Coffee className="w-4 h-4" /> Pausa Larga (15 min)
        </button>
      </div>

      {/* Big Digital Clock Display */}
      <div className="text-center py-6">
        <div className="text-7xl md:text-8xl font-black font-mono tracking-tighter text-white drop-shadow-lg">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <p className="text-xs text-slate-500 uppercase tracking-widest mt-3 font-semibold">
          {mode === 'focus' ? '🎯 Modo: Estudio Activo & Sin Distracciones' : '☕ Modo: Descanso Cerebral (Levántate, bebe agua)'}
        </p>
      </div>

      {/* Clock Controls */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          onClick={resetTimer}
          className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
          title="Reiniciar"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        <button
          onClick={toggleTimer}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm shadow-xl transition-all scale-100 hover:scale-105 ${
            isActive
              ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
              : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
          }`}
        >
          {isActive ? (
            <>
              <Pause className="w-5 h-5" /> Pausar
            </>
          ) : (
            <>
              <Play className="w-5 h-5" /> Comenzar Sesión
            </>
          )}
        </button>
      </div>
    </div>
  );
};
