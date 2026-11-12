import React from 'react';
import { DuolingoUnit, DuolingoLesson } from '../../types/duolingo';
import { DuoMascot } from './DuoMascot';
import { Star, Lock, Check, BookOpen, Gift, Sparkles, Zap, Crown } from 'lucide-react';
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
  // Classic Duolingo serpentine path offsets
  const xOffsets = [
    'translate-x-0',
    'translate-x-10 sm:translate-x-16',
    'translate-x-16 sm:translate-x-24',
    'translate-x-10 sm:translate-x-16',
    'translate-x-0',
    '-translate-x-10 sm:-translate-x-16',
    '-translate-x-16 sm:-translate-x-24',
    '-translate-x-10 sm:-translate-x-16',
  ];

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-14 overflow-x-hidden">
      {units.map((unit, unitIdx) => {
        return (
          <div key={unit.id} className="space-y-6">
            {/* Duolingo Unit Header Banner */}
            <div
              className={`p-6 rounded-3xl bg-gradient-to-r ${unit.color || 'from-[#58CC02] to-[#46A302]'} text-white border-2 border-b-[6px] ${unit.borderColor || 'border-[#58A700]'} flex items-center justify-between gap-4 shadow-sm`}
            >
              <div>
                <span className="text-[11px] font-black tracking-widest uppercase opacity-90">
                  SECCIÓN {unitIdx + 1} • UNIDAD {unit.unitNumber}
                </span>
                <h3 className="text-xl sm:text-2xl font-black mt-0.5 tracking-tight">{unit.title}</h3>
                <p className="text-xs text-white/90 font-bold mt-1 max-w-sm">{unit.description}</p>
              </div>

              {/* Guidebook Button */}
              <button
                onClick={() => {
                  soundManager.playClick();
                  onOpenGuide(unit);
                }}
                className="p-3.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition border-2 border-b-4 border-white/30 active:border-b-2 active:translate-y-0.5 flex items-center gap-2 shrink-0 cursor-pointer"
                title="Ver Guía y Fórmulas"
              >
                <BookOpen className="w-5 h-5 stroke-[2.5]" />
                <span className="text-xs font-black hidden sm:inline tracking-wider">GUÍA</span>
              </button>
            </div>

            {/* Path Nodes */}
            <div className="flex flex-col items-center space-y-8 py-4 relative">
              {unit.lessons.map((lesson, lessonIdx) => {
                const isCompleted = completedLessons.includes(lesson.id);
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
                      <div className="absolute -top-12 z-20 animate-bounce">
                        <div className="bg-white text-[#58CC02] text-xs font-black px-3.5 py-1.5 rounded-2xl border-2 border-b-4 border-[#E5E5E5] uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                          <Sparkles className="w-3.5 h-3.5 text-[#FFC800] fill-[#FFC800]" />
                          ¡EMPEZAR!
                        </div>
                        <div className="w-0 h-0 border-x-6 border-x-transparent border-t-6 border-t-white mx-auto -mt-0.5" />
                      </div>
                    )}

                    {/* Circular 3D Node Button */}
                    <div className="relative">
                      {/* Active ring glow for current lesson */}
                      {isCurrent && (
                        <div className="absolute inset-0 -m-2 rounded-full border-4 border-[#58CC02]/30 animate-ping pointer-events-none" />
                      )}

                      <motion.button
                        whileHover={!isLocked ? { scale: 1.05 } : undefined}
                        whileTap={!isLocked ? { scale: 0.95, y: 3 } : undefined}
                        onClick={() => {
                          if (!isLocked) {
                            soundManager.playClick();
                            onSelectLesson(lesson);
                          }
                        }}
                        disabled={isLocked}
                        aria-label={`Lección ${lessonIdx + 1}: ${lesson.title}${isCompleted ? ' (Completada)' : isCurrent ? ' (Siguiente lección)' : ' (Bloqueada)'}`}
                        className={`w-20 h-20 sm:w-22 sm:h-22 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                          isCompleted
                            ? 'bg-[#FFC800] hover:bg-[#FFD21A] text-white border-2 border-b-[6px] border-[#E5A500] active:border-b-2'
                            : isCurrent
                            ? 'bg-[#58CC02] hover:bg-[#61E002] text-white border-2 border-b-[6px] border-[#58A700] active:border-b-2 ring-4 ring-[#58CC02]/20'
                            : 'bg-[#E5E5E5] text-[#AFAFAF] border-2 border-b-[6px] border-[#CECECE] cursor-not-allowed'
                        }`}
                      >
                        {isCompleted ? (
                          <Crown className="w-10 h-10 fill-white stroke-[2.5]" />
                        ) : isCurrent ? (
                          <Star className="w-10 h-10 fill-white stroke-[2.5]" />
                        ) : (
                          <Lock className="w-8 h-8 stroke-[2.5]" />
                        )}
                      </motion.button>
                    </div>

                    {/* Lesson Label & XP badge */}
                    <div className="flex flex-col items-center mt-2.5">
                      <span className="text-xs font-black text-[#4B4B4B] text-center max-w-36 truncate">
                        {lesson.title}
                      </span>
                      {!isLocked && (
                        <span className="text-[11px] font-black text-[#FF9600] flex items-center gap-1 mt-0.5">
                          <Zap className="w-3.5 h-3.5 fill-[#FF9600]" /> +{lesson.xpReward} XP
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Bonus Chest / Milestone at end of unit */}
              <div className="relative flex flex-col items-center pt-2">
                <div className="w-18 h-18 rounded-3xl bg-white border-2 border-b-[6px] border-[#E5E5E5] text-[#FFC800] flex items-center justify-center hover:bg-[#F7F7F7] transition cursor-pointer">
                  <Gift className="w-9 h-9 stroke-[2.5]" />
                </div>
                <span className="text-xs font-black text-[#FFC800] uppercase tracking-wider mt-2">
                  Cofre de Lingots
                </span>
              </div>
            </div>
          </div>
        );
      })}

      {/* Encouraging mascot at bottom of path */}
      <div className="text-center py-6">
        <DuoMascot mood="cheering" size="md" speechText="¡Sigue así! Cada lección te acerca más a tu matrícula de honor." />
      </div>
    </div>
  );
};
