import React from 'react';
import { DuolingoUnit, DuolingoLesson } from '../../types/duolingo';
import { DuoMascot } from './DuoMascot';
import { Star, Lock, Check, BookOpen, Gift, Sparkles, Zap } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';
import { motion } from 'motion/react';

interface DuolingoPathProps {
  units: DuolingoUnit[];
  completedLessons: string[];
  onSelectLesson: (lesson: DuolingoLesson) => void;
  onOpenGuide: (unit: DuolingoUnit) => void;
}

export const DuolingoPath: React.FC<DuolingoPathProps> = ({
  units,
  completedLessons,
  onSelectLesson,
  onOpenGuide,
}) => {
  // Horizontal zig-zag offsets for classic Duolingo serpentine path (responsive for mobile)
  const xOffsets = [
    'translate-x-0',
    'translate-x-8 sm:translate-x-12',
    'translate-x-12 sm:translate-x-20',
    'translate-x-8 sm:translate-x-12',
    'translate-x-0',
    '-translate-x-8 sm:-translate-x-12',
    '-translate-x-12 sm:-translate-x-20',
    '-translate-x-8 sm:-translate-x-12',
  ];

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-12 overflow-x-hidden">
      {units.map((unit, unitIdx) => {
        return (
          <div key={unit.id} className="space-y-6">
            {/* Unit Header Banner */}
            <div
              className={`p-6 rounded-3xl bg-gradient-to-r ${unit.color} text-white shadow-xl border-b-6 ${unit.borderColor} flex items-center justify-between gap-4`}
            >
              <div>
                <span className="text-xs font-black tracking-widest uppercase opacity-85">
                  UNIDAD {unit.unitNumber}
                </span>
                <h3 className="text-xl font-black mt-0.5">{unit.title}</h3>
                <p className="text-xs text-white/80 font-medium mt-1">{unit.description}</p>
              </div>

              {/* Guidebook Button */}
              <button
                onClick={() => {
                  soundManager.playClick();
                  onOpenGuide(unit);
                }}
                className="p-3.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition border-2 border-white/20 shadow-md flex items-center gap-1.5 shrink-0"
                title="Ver Guía y Fórmulas del Aula Virtual"
              >
                <BookOpen className="w-5 h-5" />
                <span className="text-xs font-black hidden sm:inline">GUÍA</span>
              </button>
            </div>

            {/* Path Nodes */}
            <div className="flex flex-col items-center space-y-6 py-4 relative">
              {unit.lessons.map((lesson, lessonIdx) => {
                const isCompleted = completedLessons.includes(lesson.id);
                // First non-completed lesson is active/unlocked
                const isCurrent = !isCompleted && (
                  lessonIdx === 0 || completedLessons.includes(unit.lessons[lessonIdx - 1]?.id)
                );
                const isLocked = !isCompleted && !isCurrent;

                const offsetClass = xOffsets[lessonIdx % xOffsets.length];

                return (
                  <div
                    key={lesson.id}
                    className={`relative flex flex-col items-center transition-transform ${offsetClass}`}
                  >
                    {/* Floating Speech bubble for Current Lesson */}
                    {isCurrent && (
                      <div className="absolute -top-11 z-20 animate-bounce">
                        <div className="bg-white text-slate-900 text-xs font-black px-3 py-1.5 rounded-2xl shadow-xl uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          ¡EMPEZAR!
                        </div>
                        <div className="w-0 h-0 border-x-6 border-x-transparent border-t-6 border-t-white mx-auto" />
                      </div>
                    )}

                    {/* Circular 3D Node Button */}
                    <motion.button
                      whileHover={!isLocked ? { scale: 1.08, y: -4 } : undefined}
                      whileTap={!isLocked ? { scale: 0.94 } : undefined}
                      onClick={() => {
                        if (!isLocked) {
                          soundManager.playClick();
                          onSelectLesson(lesson);
                        }
                      }}
                      disabled={isLocked}
                      aria-label={`Lección ${lessonIdx + 1}: ${lesson.title}${isCompleted ? ' (Completada)' : isCurrent ? ' (Siguiente lección)' : ' (Bloqueada)'}`}
                      className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-amber-400 hover:bg-amber-300 text-amber-950 border-b-6 border-amber-600 active:border-b-0 active:translate-y-1 shadow-lg shadow-amber-500/20'
                          : isCurrent
                          ? 'bg-green-500 hover:bg-green-400 text-white border-b-6 border-green-700 active:border-b-0 active:translate-y-1 ring-8 ring-green-500/20 shadow-xl shadow-green-500/30'
                          : 'bg-slate-800 text-slate-500 border-b-6 border-slate-900 cursor-not-allowed opacity-60'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-10 h-10 stroke-[3.5]" />
                      ) : isCurrent ? (
                        <Star className="w-10 h-10 fill-white stroke-[2.5]" />
                      ) : (
                        <Lock className="w-7 h-7" />
                      )}
                    </motion.button>

                    {/* Lesson Label & XP badge */}
                    <div className="flex flex-col items-center mt-2">
                      <span className="text-[11px] font-black text-slate-300 text-center max-w-32 truncate">
                        {lesson.title}
                      </span>
                      {!isLocked && (
                        <span className="text-[10px] font-bold text-amber-400/90 flex items-center gap-0.5 mt-0.5">
                          <Zap className="w-3 h-3 fill-amber-400" /> +{lesson.xpReward} XP
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Bonus Chest / Milestone at end of unit */}
              <div className="relative flex flex-col items-center pt-2">
                <div className="w-16 h-16 rounded-3xl bg-slate-900 border-2 border-b-6 border-amber-500/40 text-amber-400 flex items-center justify-center shadow-lg">
                  <Gift className="w-8 h-8" />
                </div>
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest mt-1.5">
                  Cofre de Lingots
                </span>
              </div>
            </div>
          </div>
        );
      })}

      {/* Encouraging mascot at bottom of path */}
      <div className="text-center py-6">
        <DuoMascot mood="cheering" size="md" speechText="¡Sigue así! Cada lección te acerca más al 10." />
      </div>
    </div>
  );
};
