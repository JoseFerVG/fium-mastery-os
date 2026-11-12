import React from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Cpu, 
  Flame, 
  Trophy, 
  BookOpenCheck 
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
  onOpenFlashcards: _onOpenFlashcards,
  onOpenAchievements,
  streakDays: _streakDays,
}) => {
  return (
    <nav 
      aria-label="Navegación Móvil Principal"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-[#E5E5E5] pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.04)]"
    >
      <div className="max-w-md mx-auto px-2 py-2 flex items-center justify-around">
        {/* Tab 1: APRENDER / FIUMingo */}
        <button
          onClick={() => {
            soundManager.playClick();
            onNavigate('duolingo');
          }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl relative transition-transform active:scale-90 ${
            currentView === 'duolingo' ? 'text-[#58CC02]' : 'text-[#AFAFAF] hover:text-[#4B4B4B]'
          }`}
        >
          {currentView === 'duolingo' && (
            <motion.div
              layoutId="mobile-nav-duo"
              className="absolute inset-0 bg-[#EAFBEA] rounded-2xl border-2 border-[#58CC02]"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
          <span className="text-xl leading-none relative z-10">🦉</span>
          <span className="text-[10px] font-black uppercase tracking-wider mt-0.5 relative z-10">Aprender</span>
        </button>

        {/* Tab 2: PRÁCTICA / EXÁMENES */}
        <button
          onClick={() => {
            soundManager.playClick();
            onNavigate('exam');
          }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl relative transition-transform active:scale-90 ${
            currentView === 'exam' ? 'text-[#1CB0F6]' : 'text-[#AFAFAF] hover:text-[#4B4B4B]'
          }`}
        >
          {currentView === 'exam' && (
            <motion.div
              layoutId="mobile-nav-duo"
              className="absolute inset-0 bg-[#E5F6FD] rounded-2xl border-2 border-[#84D8FF]"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
          <BookOpen className="w-5 h-5 relative z-10 stroke-[2.5]" />
          <span className="text-[10px] font-black uppercase tracking-wider mt-0.5 relative z-10">Práctica</span>
        </button>

        {/* Tab 3: SIMULADORES */}
        <button
          onClick={() => {
            soundManager.playClick();
            onNavigate('simulators');
          }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl relative transition-transform active:scale-90 ${
            currentView === 'simulators' ? 'text-[#CE82FF]' : 'text-[#AFAFAF] hover:text-[#4B4B4B]'
          }`}
        >
          {currentView === 'simulators' && (
            <motion.div
              layoutId="mobile-nav-duo"
              className="absolute inset-0 bg-[#F5EAFF] rounded-2xl border-2 border-[#CE82FF]"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
          <Cpu className="w-5 h-5 relative z-10 stroke-[2.5]" />
          <span className="text-[10px] font-black uppercase tracking-wider mt-0.5 relative z-10">Sims</span>
        </button>

        {/* Tab 4: MISIONES & LOGROS */}
        <button
          onClick={() => {
            soundManager.playClick();
            onOpenAchievements();
          }}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-2xl text-[#AFAFAF] hover:text-[#4B4B4B] active:scale-90 transition-transform"
        >
          <Trophy className="w-5 h-5 stroke-[2.5] text-[#FFC800]" />
          <span className="text-[10px] font-black uppercase tracking-wider mt-0.5 text-[#E5A500]">Misiones</span>
        </button>

        {/* Tab 5: MODO ENTRE LIBROS */}
        <button
          onClick={() => {
            soundManager.playPowerup();
            onOpenDeskCompanion();
          }}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-2xl text-[#AFAFAF] hover:text-[#4B4B4B] active:scale-90 transition-transform"
        >
          <BookOpenCheck className="w-5 h-5 stroke-[2.5] text-[#FF4B4B]" />
          <span className="text-[10px] font-black uppercase tracking-wider mt-0.5 text-[#FF4B4B]">Libros</span>
        </button>
      </div>
    </nav>
  );
};
