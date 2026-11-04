import React from 'react';
import { 
  Zap, 
  Flame, 
  Brain, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  RotateCcw,
  Compass,
  Sparkles
} from 'lucide-react';
import { Subject, SubjectId } from '../types';

interface NavbarProps {
  currentView: 'dashboard' | 'course' | 'exam' | 'pomodoro' | 'duolingo';
  selectedSubjectId: SubjectId | null;
  subjects: Subject[];
  overallProgress: number;
  streakDays: number;
  onNavigate: (view: 'dashboard' | 'course' | 'exam' | 'pomodoro' | 'duolingo', subjectId?: SubjectId) => void;
  onResetProgress: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  selectedSubjectId,
  subjects,
  overallProgress,
  streakDays,
  onNavigate,
  onResetProgress
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Info */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  FIUM Mastery OS
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  UMU v2.0
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Alto Rendimiento &bull; Recuperación Acelerada FIUM
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-slate-800/60">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Mission Control
            </button>

            {/* Duolingo Gamified Mode Button */}
            <button
              onClick={() => onNavigate('duolingo')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentView === 'duolingo'
                  ? 'bg-green-500 text-white shadow-md shadow-green-500/20 border border-green-400'
                  : 'text-green-400 hover:text-white hover:bg-green-500/20 border border-green-500/30'
              }`}
            >
              <span className="text-sm">🦉</span>
              FIUMingo
              <span className="px-1.5 py-0.2 rounded-full bg-green-950/80 text-green-300 text-[10px] border border-green-500/40">
                Duolingo
              </span>
            </button>

            {/* Courses quick dropdown/picker */}
            <div className="relative group">
              <button
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentView === 'course'
                    ? 'bg-purple-600/30 text-purple-300 border border-purple-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Asignaturas
                <span className="text-[10px] ml-1 bg-slate-800 px-1 rounded text-slate-300">{subjects.length}</span>
              </button>

              <div className="absolute left-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-xl p-2 hidden group-hover:block transition-all z-50">
                <div className="text-[11px] font-semibold text-slate-500 px-2 py-1 uppercase tracking-wider">
                  Primer Cuatrimestre
                </div>
                {subjects.map(s => (
                  <button
                    key={s.id}
                    onClick={() => onNavigate('course', s.id)}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      selectedSubjectId === s.id && currentView === 'course'
                        ? 'bg-indigo-600/20 text-indigo-300 font-bold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.accentColor }}></span>
                      <span className="truncate">{s.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{s.code}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => onNavigate('exam')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === 'exam'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Brain className="w-3.5 h-3.5 text-emerald-400" />
              Simulador Exámenes
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px]">
                Target 10
              </span>
            </button>

            <button
              onClick={() => onNavigate('pomodoro')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === 'pomodoro'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-rose-400" />
              Deep Focus
            </button>
          </nav>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center gap-3">
            {/* Streak */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400/30 animate-pulse" />
              <span>{streakDays}d racha</span>
            </div>

            {/* Overall Mastery Pill */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-slate-400">Dominio:</span>
              <span className="font-bold text-white font-mono">{overallProgress}%</span>
            </div>

            {/* Reset Button */}
            <button
              onClick={onResetProgress}
              title="Reiniciar progreso"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile secondary navigation */}
        <div className="md:hidden flex items-center justify-between py-2 border-t border-slate-800/50 text-xs">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`flex-1 py-1 text-center font-medium ${currentView === 'dashboard' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('duolingo')}
            className={`flex-1 py-1 text-center font-bold ${currentView === 'duolingo' ? 'text-green-400 font-bold' : 'text-green-500/80'}`}
          >
            🦉 Duolingo
          </button>
          <button
            onClick={() => onNavigate('exam')}
            className={`flex-1 py-1 text-center font-medium ${currentView === 'exam' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
          >
            Exámenes
          </button>
          <button
            onClick={() => onNavigate('pomodoro')}
            className={`flex-1 py-1 text-center font-medium ${currentView === 'pomodoro' ? 'text-rose-400 font-bold' : 'text-slate-400'}`}
          >
            Focus
          </button>
        </div>
      </div>
    </header>
  );
};
