import React from 'react';
import { 
  Flame, 
  Clock, 
  BookOpen, 
  RotateCcw,
  Compass,
  Trophy,
  Bookmark,
  Cpu,
  BookOpenCheck,
  Rocket
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
  onOpenExamRush: _onOpenExamRush,
  onOpenFlashcards: _onOpenFlashcards,
  onOpenAchievements,
  onResetProgress,
  onOpenRescuePlan,
  onOpenDeskCompanion
}) => {
  const playerLevel = getPlayerLevel(xp);

  const mainNavItems = [
    { id: 'duolingo', label: 'APRENDER', icon: <span className="text-xl">🦉</span> },
    { id: 'exam', label: 'PRÁCTICA', icon: <BookOpen className="w-5 h-5 stroke-[2.5]" /> },
    { id: 'simulators', label: 'SIMULADORES', icon: <Cpu className="w-5 h-5 stroke-[2.5]" /> },
    { id: 'dashboard', label: 'PANEL', icon: <Compass className="w-5 h-5 stroke-[2.5]" /> },
    { id: 'pomodoro', label: 'ENFOQUE', icon: <Clock className="w-5 h-5 stroke-[2.5]" /> },
  ] as const;

  return (
    <>
      {/* ============================================================== */}
      {/* 1. DUOLINGO DESKTOP LEFT SIDEBAR (Fixed, w-64, White, 2px border) */}
      {/* ============================================================== */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r-2 border-[#E5E5E5] p-4 flex-col justify-between z-40 select-none">
        <div className="space-y-6">
          {/* Logo & Brand Header */}
          <div 
            onClick={() => {
              onNavigate('duolingo');
              soundManager.playClick();
            }}
            className="flex items-center gap-2.5 px-3 py-2 cursor-pointer group"
          >
            <div className="text-3xl transform group-hover:scale-110 group-hover:rotate-6 transition-transform">
              🦉
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-[#58CC02] uppercase font-sans">
                FIUMingo
              </span>
              <div className="text-[10px] font-black tracking-wider text-[#AFAFAF] uppercase">
                Informática UMU
              </div>
            </div>
          </div>

          {/* Navigation Items (Duolingo 3D Button Style) */}
          <nav className="space-y-2">
            {mainNavItems.map(item => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    soundManager.playClick();
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#E5F6FD] border-2 border-b-4 border-[#84D8FF] text-[#1CB0F6]'
                      : 'text-[#777777] hover:bg-[#F7F7F7] hover:text-[#4B4B4B] border-2 border-transparent'
                  }`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Misiones / Trofeos Button */}
            <button
              onClick={() => {
                onOpenAchievements();
                soundManager.playClick();
              }}
              className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider text-[#777777] hover:bg-[#F7F7F7] hover:text-[#4B4B4B] border-2 border-transparent transition-all cursor-pointer"
            >
              <Trophy className="w-5 h-5 text-[#FFC800] stroke-[2.5]" />
              <span>MISIONES</span>
            </button>

            {/* Quick Action: Modo Entre Libros */}
            {onOpenDeskCompanion && (
              <button
                onClick={() => {
                  onOpenDeskCompanion();
                  soundManager.playPowerup();
                }}
                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider text-[#FF4B4B] hover:bg-[#FFF0F0] border-2 border-transparent hover:border-[#FFD0D0] transition-all cursor-pointer"
              >
                <BookOpenCheck className="w-5 h-5 text-[#FF4B4B] stroke-[2.5]" />
                <span>ENTRE LIBROS</span>
              </button>
            )}

            {/* Quick Action: Sprint Rescate */}
            {onOpenRescuePlan && (
              <button
                onClick={() => {
                  onOpenRescuePlan();
                  soundManager.playClick();
                }}
                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider text-[#CE82FF] hover:bg-[#F5EAFF] border-2 border-transparent hover:border-[#E8C8FF] transition-all cursor-pointer"
              >
                <Rocket className="w-5 h-5 text-[#CE82FF] stroke-[2.5]" />
                <span>PLAN RESCATE</span>
              </button>
            )}
          </nav>
        </div>

        {/* Bottom User Level & Stats Summary */}
        <div className="pt-4 border-t-2 border-[#E5E5E5] space-y-3">
          <div 
            onClick={() => {
              onOpenAchievements();
              soundManager.playClick();
            }}
            className="p-3 bg-[#F7F7F7] border-2 border-[#E5E5E5] rounded-2xl flex items-center justify-between cursor-pointer hover:border-[#84D8FF] transition-all"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl">{playerLevel.icon}</span>
              <div>
                <div className="text-[10px] font-black text-[#FF9600] uppercase tracking-wider leading-tight">
                  Nv. {playerLevel.level} • {playerLevel.title}
                </div>
                <div className="text-xs font-black text-[#4B4B4B]">
                  <AnimatedCounter value={xp} suffix=" XP" />
                </div>
              </div>
            </div>
            <span className="text-xs font-black text-[#1CB0F6]">💎 {gems}</span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#AFAFAF] px-1 font-bold">
            <span>FIUM UMU 2026/27</span>
            <button
              onClick={onResetProgress}
              title="Reiniciar progreso"
              className="text-[#AFAFAF] hover:text-[#FF4B4B] transition p-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ============================================================== */}
      {/* 2. MOBILE TOP NAVBAR (Compact, Clean, Sticky, for < lg screens) */}
      {/* ============================================================== */}
      <header className="lg:hidden sticky top-0 z-40 bg-white border-b-2 border-[#E5E5E5] px-4 py-2.5 shadow-sm">
        <div className="flex items-center justify-between">
          <div 
            onClick={() => {
              onNavigate('duolingo');
              soundManager.playClick();
            }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className="text-2xl">🦉</span>
            <span className="text-lg font-black text-[#58CC02] tracking-tight uppercase">
              FIUMingo
            </span>
          </div>

          <div className="flex items-center gap-3.5 text-xs font-black">
            {/* Streak */}
            <div className="flex items-center gap-1 text-[#FF9600]">
              <Flame className="w-4 h-4 fill-[#FF9600]" />
              <span>{streakDays}</span>
            </div>

            {/* Gems */}
            <div className="flex items-center gap-1 text-[#1CB0F6]">
              <span>💎</span>
              <span>{gems}</span>
            </div>

            {/* Achievements button */}
            <button
              onClick={() => {
                onOpenAchievements();
                soundManager.playClick();
              }}
              className="p-1.5 rounded-xl bg-[#FFF4D0] text-[#FF9600] border border-[#FFC800]/50"
            >
              <Trophy className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
