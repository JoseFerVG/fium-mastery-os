import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Flame, 
  Clock, 
  BookOpen, 
  RotateCcw,
  Compass,
  Trophy,
  Bookmark,
  Cpu,
  BookOpenCheck
} from 'lucide-react';
import { Subject, SubjectId } from '../types';
import { getPlayerLevel } from '../data/gamificationData';
import { soundManager } from '../utils/soundEffects';
import { AnimatedCounter } from './ui/AnimatedCounter';

interface NavbarProps {
  currentView: 'dashboard' | 'course' | 'exam' | 'pomodoro' | 'duolingo' | 'simulators';
  selectedSubjectId: SubjectId | null;
  subjects: Subject[];
  overallProgress: number;
  streakDays: number;
  xp: number;
  gems: number;
  onNavigate: (view: 'dashboard' | 'course' | 'exam' | 'pomodoro' | 'duolingo' | 'simulators', subjectId?: SubjectId) => void;
  onOpenExamRush: () => void;
  onOpenFlashcards: () => void;
  onOpenAchievements: () => void;
  onResetProgress: () => void;
  onOpenRescuePlan?: () => void;
  onOpenDeskCompanion?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  selectedSubjectId: _selectedSubjectId,
  subjects: _subjects,
  overallProgress: _overallProgress,
  streakDays,
  xp,
  gems,
  onNavigate,
  onOpenExamRush,
  onOpenFlashcards,
  onOpenAchievements,
  onResetProgress,
  onOpenRescuePlan,
  onOpenDeskCompanion
}) => {
  const playerLevel = getPlayerLevel(xp);

  const navItems = [
    { id: 'dashboard', label: 'Panel', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'duolingo', label: 'FIUMingo', icon: <span className="text-sm">🦉</span>, badge: 'green' },
    { id: 'simulators', label: 'Simuladores', icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: 'exam', label: 'Exámenes', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'pomodoro', label: 'Pomodoro', icon: <Clock className="w-3.5 h-3.5" /> },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/75 backdrop-blur-2xl border-b border-white/10 shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Info */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none group" 
            onClick={() => {
              onNavigate('dashboard');
              soundManager.playClick();
            }}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20 transition-transform duration-300 group-hover:scale-105">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  FIUM Mastery OS
                </span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  UMU 2026/27
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Recuperación Acelerada &bull; Convocatorias 2026/2027
              </p>
            </div>
          </div>

          {/* Navigation Items (Sliding Pill Dock) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/70 p-1.5 rounded-2xl border border-white/10 shadow-inner">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    soundManager.playClick();
                  }}
                  className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-pill"
                      className="absolute inset-0 bg-indigo-600 rounded-xl shadow-md shadow-indigo-600/30 ring-1 ring-white/20"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {item.icon}
                    {item.label}
                  </span>
                </button>
              );
            })}

            {/* Quick Action: Modo Entre Libros */}
            {onOpenDeskCompanion && (
              <button
                onClick={() => {
                  onOpenDeskCompanion();
                  soundManager.playPowerup();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black text-pink-200 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-pink-500/40 transition-all hover:scale-105 ml-1 shadow-sm"
              >
                <BookOpenCheck className="w-3.5 h-3.5 text-pink-400" />
                <span>📖 Entre Libros</span>
              </button>
            )}

            {/* Quick Action: Rescate 14 Días */}
            {onOpenRescuePlan && (
              <button
                onClick={() => {
                  onOpenRescuePlan();
                  soundManager.playClick();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-purple-300 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 transition-all hover:scale-105 ml-1 shadow-sm"
              >
                <span>🚀 Rescate</span>
              </button>
            )}

            {/* Quick Action: Supervivencia */}
            <button
              onClick={() => {
                onOpenExamRush();
                soundManager.playClick();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all hover:scale-105 ml-1"
            >
              <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              Supervivencia
            </button>

            {/* Quick Action: Tarjetas */}
            <button
              onClick={() => {
                onOpenFlashcards();
                soundManager.playClick();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all"
            >
              <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
              Tarjetas
            </button>
          </nav>

          {/* Gamification Stats: Level, XP, Gems, Streak */}
          <div className="flex items-center gap-2.5">
            {/* Level & Rank Badge */}
            <motion.div 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onOpenAchievements();
                soundManager.playClick();
              }}
              className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-900/90 border border-white/10 hover:border-amber-500/50 transition-all shadow-md select-none group"
              title={`Nivel ${playerLevel.level}: ${playerLevel.title} (${xp} XP)`}
            >
              <span className="text-base group-hover:scale-110 transition-transform">{playerLevel.icon}</span>
              <div className="hidden sm:block text-left font-mono">
                <div className="text-[10px] text-amber-400 font-bold leading-none">Lv.{playerLevel.level}</div>
                <div className="text-[11px] text-white font-bold leading-none mt-0.5">
                  <AnimatedCounter value={xp} suffix=" XP" />
                </div>
              </div>
            </motion.div>

            {/* Gems with Animated Counter */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-900/90 border border-white/10 text-cyan-300 font-mono text-xs font-bold shadow-md">
              <span className="text-sm">💎</span>
              <AnimatedCounter value={gems} />
            </div>

            {/* Study Streak */}
            <div 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 font-mono text-xs font-bold select-none shadow-sm"
              title={`Racha de estudio: ${streakDays} días`}
            >
              <Flame className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
              <span>{streakDays}d</span>
            </div>

            {/* Trophy button with accessible aria-label */}
            <button
              onClick={() => {
                onOpenAchievements();
                soundManager.playClick();
              }}
              aria-label="Abrir Sala de Trofeos y Logros"
              className="p-2.5 rounded-2xl bg-slate-900/90 border border-white/10 hover:border-amber-500/50 text-amber-400 transition-all hover:scale-105"
            >
              <Trophy className="w-4 h-4" />
            </button>

            {/* Reset with accessible aria-label */}
            <button
              onClick={onResetProgress}
              aria-label="Reiniciar Progreso de Estudio"
              className="p-2.5 rounded-2xl bg-slate-900/90 border border-white/10 hover:border-slate-700 text-slate-500 hover:text-white transition-all hover:scale-105"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
