import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, CheckCircle2, Lock, X } from 'lucide-react';
import { INITIAL_ACHIEVEMENTS, getPlayerLevel, getNextPlayerLevel } from '../../data/gamificationData';
import { soundManager } from '../../utils/soundEffects';
import { AnimatedCounter } from '../ui/AnimatedCounter';

interface AchievementsModalProps {
  unlockedIds: string[];
  xp: number;
  gems: number;
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  unlockedIds,
  xp,
  gems,
  onClose
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'mastery' | 'streak' | 'exam' | 'speedrun' | 'focus'>('all');

  const currentLevel = getPlayerLevel(xp);
  const nextLevel = getNextPlayerLevel(xp);

  const xpProgress = nextLevel 
    ? Math.min(100, Math.round(((xp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100))
    : 100;

  const unlockedSet = new Set(unlockedIds);

  const achievements = INITIAL_ACHIEVEMENTS.map(ach => ({
    ...ach,
    unlocked: unlockedSet.has(ach.id)
  }));

  const filtered = filterCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === filterCategory);

  const totalUnlocked = achievements.filter(a => a.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in select-none">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 450, damping: 30 }}
        className="bg-white border-2 border-b-[6px] border-[#E5E5E5] w-full max-w-3xl rounded-t-3xl sm:rounded-3xl p-5 sm:p-8 relative space-y-6 max-h-[92vh] flex flex-col font-sans"
      >
        {/* Mobile Drag Handle */}
        <div className="pt-1 pb-0 flex justify-center sm:hidden">
          <div className="w-12 h-1.5 rounded-full bg-[#E5E5E5]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#E5E5E5] pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#FFF4D0] text-[#FF9600] rounded-2xl border-2 border-[#FFC800]/50">
              <Trophy className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#4B4B4B] flex items-center gap-2">
                Sala de Trofeos & Rango FIUM
              </h2>
              <p className="text-xs text-[#777777] font-bold">
                Desbloquea insignias de ingeniería y sube de nivel
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Cerrar sala de trofeos"
            className="p-2 rounded-xl text-[#AFAFAF] hover:text-[#4B4B4B] hover:bg-[#F7F7F7] transition cursor-pointer"
          >
            <X className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* Current Player Level Banner */}
        <div className="bg-[#FFF9E5] p-5 rounded-2xl border-2 border-b-4 border-[#FFC800] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white border-2 border-[#FFC800] flex items-center justify-center text-3xl shadow-sm">
              {currentLevel.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[#FF9600] uppercase tracking-wider">
                  Nivel {currentLevel.level} de 10
                </span>
                <span className="text-[11px] bg-white px-2.5 py-0.5 rounded-full text-[#4B4B4B] font-black border border-[#FFC800]/40">
                  <AnimatedCounter value={xp} suffix=" XP" />
                </span>
              </div>
              <h3 className="text-lg font-black text-[#4B4B4B]">{currentLevel.title}</h3>
              <p className="text-xs text-[#777777] font-bold mt-0.5">{currentLevel.perk}</p>
            </div>
          </div>

          <div className="sm:w-48 text-right space-y-1.5">
            <div className="text-xs text-[#777777] flex justify-between font-black">
              <span>Progreso Nivel</span>
              <span className="text-[#FF9600]">{xpProgress}%</span>
            </div>
            <div className="w-full bg-[#E5E5E5] h-3 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-[#FFC800] h-full rounded-full transition-all duration-700"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            {nextLevel && (
              <span className="text-[10px] text-[#AFAFAF] font-bold block">
                Faltan {Math.max(0, nextLevel.minXp - xp)} XP para: <strong className="text-[#4B4B4B]">{nextLevel.title}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Filter Tabs & Gems Counter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: `Todos (${totalUnlocked}/${achievements.length})` },
              { id: 'mastery', label: 'Maestría' },
              { id: 'exam', label: 'Exámenes' },
              { id: 'speedrun', label: 'Supervivencia' },
              { id: 'streak', label: 'Rachas' },
              { id: 'focus', label: 'Foco' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setFilterCategory(tab.id as typeof filterCategory);
                  soundManager.playClick();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition border-2 border-b-4 ${
                  filterCategory === tab.id
                    ? 'bg-[#E5F6FD] border-[#84D8FF] text-[#1CB0F6]'
                    : 'bg-white border-[#E5E5E5] text-[#777777] hover:bg-[#F7F7F7]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-[#1CB0F6] font-black flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E5F6FD] border-2 border-[#84D8FF]">
            <span>💎 <AnimatedCounter value={gems} suffix=" Gemas" /></span>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="overflow-y-auto space-y-3 pr-1 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map(ach => (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border-2 border-b-4 transition-all flex items-start gap-3.5 ${
                  ach.unlocked
                    ? 'bg-white border-[#FFC800] text-[#4B4B4B]'
                    : 'bg-[#F7F7F7] border-[#E5E5E5] text-[#AFAFAF] opacity-70'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border-2 ${
                  ach.unlocked ? 'bg-[#FFF4D0] border-[#FFC800]' : 'bg-[#E5E5E5] border-[#CECECE]'
                }`}>
                  {ach.unlocked ? ach.icon : <Lock className="w-5 h-5 text-[#AFAFAF] stroke-[2.5]" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-sm font-black truncate ${ach.unlocked ? 'text-[#4B4B4B]' : 'text-[#AFAFAF]'}`}>
                      {ach.title}
                    </h4>
                    {ach.unlocked && (
                      <span className="text-[10px] text-[#58CC02] font-black flex items-center gap-0.5 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" /> ¡Listo!
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#777777] font-bold mt-0.5 leading-snug">
                    {ach.description}
                  </p>

                  <div className="mt-2 flex items-center gap-2 text-[11px] font-black">
                    <span className="text-[#1CB0F6]">+{ach.xpReward} XP</span>
                    <span className="text-[#CECECE]">•</span>
                    <span className="text-[#FF9600]">+{ach.gemsReward} Gemas</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
