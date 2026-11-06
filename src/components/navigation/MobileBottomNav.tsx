import React from 'react';
import { motion } from 'motion/react';
import { 
  Compass, 
  Sparkles, 
  Bookmark, 
  Trophy, 
  BookOpenCheck,
  Flame
} from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface MobileBottomNavProps {
  currentView: 'dashboard' | 'course' | 'exam' | 'pomodoro' | 'duolingo' | 'simulators';
  onNavigate: (view: 'dashboard' | 'course' | 'exam' | 'pomodoro' | 'duolingo' | 'simulators') => void;
  onOpenDeskCompanion: () => void;
  onOpenFlashcards: () => void;
  onOpenAchievements: () => void;
  streakDays: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onNavigate,
  onOpenDeskCompanion,
  onOpenFlashcards,
  onOpenAchievements,
  streakDays,
}) => {
  return (
    <nav 
      aria-label="Navegación Móvil Principal"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/85 backdrop-blur-2xl border-t border-white/10 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.6)] pb-safe transition-all"
    >
      <div className="max-w-md mx-auto px-2 py-1.5 flex items-center justify-around">
        {/* Tab 1: Panel */}
        <button
          onClick={() => {
            soundManager.playClick();
            onNavigate('dashboard');
          }}
          className={`flex flex-col items-center justify-center py-1.5 px-2.5 rounded-2xl relative transition-all active:scale-95 ${
            currentView === 'dashboard' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {currentView === 'dashboard' && (
            <motion.div
              layoutId="mobile-nav-indicator"
              className="absolute inset-0 bg-indigo-500/15 rounded-2xl border border-indigo-500/30"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <Compass className="w-5 h-5 relative z-10" />
          <span className="text-[10px] tracking-tight mt-0.5 relative z-10 font-sans">Panel</span>
        </button>

        {/* Tab 2: FIUMingo */}
        <button
          onClick={() => {
            soundManager.playClick();
            onNavigate('duolingo');
          }}
          className={`flex flex-col items-center justify-center py-1.5 px-2.5 rounded-2xl relative transition-all active:scale-95 ${
            currentView === 'duolingo' ? 'text-green-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {currentView === 'duolingo' && (
            <motion.div
              layoutId="mobile-nav-indicator"
              className="absolute inset-0 bg-green-500/15 rounded-2xl border border-green-500/30"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="text-lg leading-none relative z-10">🦉</span>
          <span className="text-[10px] tracking-tight mt-0.5 relative z-10 font-sans">FIUMingo</span>
        </button>

        {/* Tab 3: CENTER HERO BUTTON - MODO ENTRE LIBROS */}
        <div className="relative -top-3">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              soundManager.playPowerup();
              onOpenDeskCompanion();
            }}
            className="flex flex-col items-center justify-center w-13 h-13 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 text-white shadow-lg shadow-purple-600/40 border-2 border-white/25 active:border-white/40 relative group"
            title="Estudio Rápido Entre Libros"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-sm opacity-60 group-hover:opacity-100 transition animate-pulse" />
            <BookOpenCheck className="w-6 h-6 relative z-10 fill-white/20" />
            <span className="absolute -bottom-5 text-[9px] font-black tracking-tight text-purple-300 uppercase whitespace-nowrap drop-shadow">
              Entre Libros
            </span>
          </motion.button>
        </div>

        {/* Tab 4: Flashcards / Repaso */}
        <button
          onClick={() => {
            soundManager.playClick();
            onOpenFlashcards();
          }}
          className="flex flex-col items-center justify-center py-1.5 px-2.5 rounded-2xl relative text-slate-400 hover:text-slate-200 transition-all active:scale-95"
        >
          <Bookmark className="w-5 h-5 relative z-10 text-indigo-400" />
          <span className="text-[10px] tracking-tight mt-0.5 relative z-10 font-sans">Tarjetas</span>
        </button>

        {/* Tab 5: Progreso / Trofeos */}
        <button
          onClick={() => {
            soundManager.playClick();
            onOpenAchievements();
          }}
          className="flex flex-col items-center justify-center py-1.5 px-2.5 rounded-2xl relative text-slate-400 hover:text-slate-200 transition-all active:scale-95"
        >
          <div className="relative">
            <Trophy className="w-5 h-5 text-amber-400" />
            {streakDays > 0 && (
              <span className="absolute -top-1 -right-2 flex items-center justify-center bg-rose-500 text-white text-[9px] font-mono font-bold w-4 h-4 rounded-full border border-slate-950">
                <Flame className="w-2.5 h-2.5 fill-white" />
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 relative z-10 font-sans">Nivel</span>
        </button>
      </div>
    </nav>
  );
};
