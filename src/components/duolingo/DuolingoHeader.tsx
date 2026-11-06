import React from 'react';
import { Flame, Heart, Gem, Volume2, VolumeX, ArrowLeft, ChevronDown } from 'lucide-react';
import { SubjectId } from '../../types';
import { COURSES } from '../../data/coursesData';
import { AnimatedCounter } from '../ui/AnimatedCounter';

interface DuolingoHeaderProps {
  currentSubjectId: SubjectId;
  hearts: number;
  maxHearts: number;
  streakDays: number;
  gems: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSelectSubject: (subjectId: SubjectId) => void;
  onBackToDashboard: () => void;
  onRefillHearts: () => void;
}

export const DuolingoHeader: React.FC<DuolingoHeaderProps> = ({
  currentSubjectId,
  hearts,
  maxHearts,
  streakDays,
  gems,
  soundEnabled,
  onToggleSound,
  onSelectSubject,
  onBackToDashboard,
  onRefillHearts,
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const currentCourse = COURSES.find(c => c.id === currentSubjectId) || COURSES[0];

  return (
    <div className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-2xl border-b border-white/10 px-4 py-3 shadow-xl">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Back button & Subject Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToDashboard}
            aria-label="Volver al panel principal"
            className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition border border-white/10"
            title="Volver al panel"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Subject Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900 border border-white/10 hover:border-green-500/50 transition text-sm font-black text-white shadow-sm"
            >
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: currentCourse.accentColor }} />
              <span className="font-extrabold uppercase tracking-wide font-mono">{currentCourse.code}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-slate-900 border border-white/15 rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-2xl">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1 font-mono">
                  Elige Asignatura UMU
                </div>
                {COURSES.map(course => (
                  <button
                    key={course.id}
                    onClick={() => {
                      onSelectSubject(course.id);
                      setDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                      currentSubjectId === course.id
                        ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: course.accentColor }} />
                      <span className="truncate">{course.name}</span>
                    </div>
                    <span className="font-mono text-slate-500">{course.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Gamification Stats */}
        <div className="flex items-center gap-3 sm:gap-4 text-sm font-black font-mono">
          {/* Streak */}
          <div className="flex items-center gap-1.5 text-amber-400" title="Días consecutivos de estudio">
            <Flame className="w-5 h-5 fill-amber-400 animate-pulse" />
            <AnimatedCounter value={streakDays} />
          </div>

          {/* Gems / Lingots */}
          <div className="flex items-center gap-1.5 text-cyan-400" title="Gemas ganadas en lecciones">
            <Gem className="w-5 h-5 fill-cyan-400" />
            <AnimatedCounter value={gems} />
          </div>

          {/* Hearts / Vidas */}
          <button
            onClick={onRefillHearts}
            className="flex items-center gap-1.5 text-rose-500 hover:scale-105 transition group"
            title="Vidas restantes (Clic para recargar)"
          >
            <Heart className={`w-5 h-5 ${hearts > 0 ? 'fill-rose-500' : 'text-slate-600'} transition group-hover:scale-110`} />
            <span className={hearts === 0 ? 'text-rose-400 font-bold animate-pulse' : 'text-rose-400'}>
              {hearts}/{maxHearts}
            </span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Silenciar sonido' : 'Activar sonido'}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-white/5 transition"
            title={soundEnabled ? 'Sonido activado' : 'Sonido silenciado'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-green-400" /> : <VolumeX className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </div>
  );
};
