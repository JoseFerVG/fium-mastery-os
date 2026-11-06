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
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 450, damping: 30 }}
        className="bg-slate-900 border-t sm:border border-white/15 w-full max-w-3xl rounded-t-3xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl relative space-y-6 max-h-[92vh] flex flex-col"
      >
        {/* Mobile Drag Handle */}
        <div className="pt-1 pb-0 flex justify-center sm:hidden">
          <div className="w-12 h-1.5 rounded-full bg-slate-700/80" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20 shadow-md shadow-amber-500/10">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                Sala de Trofeos & Rango de Alumno FIUM
              </h2>
              <p className="text-xs text-slate-400">
                Desbloquea insignias de ingeniería y avanza de nivel con tu estudio
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Cerrar sala de trofeos"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Player Level Banner */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-5 rounded-2xl border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/20">
              {currentLevel.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  Nivel {currentLevel.level} de 10
                </span>
                <span className="text-[10px] bg-slate-800/90 px-2 py-0.5 rounded-full text-slate-300 font-mono border border-white/5">
                  <AnimatedCounter value={xp} suffix=" XP" />
                </span>
              </div>
              <h3 className="text-lg font-black text-white">{currentLevel.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{currentLevel.perk}</p>
            </div>
          </div>

          <div className="sm:w-48 text-right space-y-1.5 font-mono">
            <div className="text-[11px] text-slate-400 flex justify-between">
              <span>Progreso Nivel</span>
              <span className="text-amber-400 font-bold">{xpProgress}%</span>
            </div>
            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800 relative">
              <div
                className="bg-gradient-to-r from-indigo-500 via-amber-400 to-yellow-300 h-full rounded-full transition-all duration-700 animate-shimmer"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            {nextLevel && (
              <span className="text-[10px] text-slate-500 block">
                Faltan {Math.max(0, nextLevel.minXp - xp)} XP para: <strong className="text-slate-300 font-sans">{nextLevel.title}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Filter Tabs & Gems Counter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            {[
              { id: 'all', label: `Todos (${totalUnlocked}/${achievements.length})` },
              { id: 'mastery', label: 'Maestría' },
              { id: 'exam', label: 'Exámenes' },
              { id: 'speedrun', label: 'Supervivencia' },
              { id: 'streak', label: 'Rachas' },
              { id: 'focus', label: 'Foco Pomodoro' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setFilterCategory(tab.id as typeof filterCategory);
                  soundManager.playClick();
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  filterCategory === tab.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-xs font-mono text-cyan-300 font-bold flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950 border border-white/5">
            <span>💎 <AnimatedCounter value={gems} suffix=" Gemas Acumuladas" /></span>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="overflow-y-auto space-y-3 pr-1 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map(ach => (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                  ach.unlocked
                    ? 'bg-slate-950/80 border-amber-500/40 shadow-lg shadow-amber-500/5 relative overflow-hidden'
                    : 'bg-slate-950/40 border-slate-800/80 opacity-60'
                }`}
              >
                {ach.unlocked && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/10 to-transparent pointer-events-none rounded-bl-3xl" />
                )}

                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                  ach.unlocked ? 'bg-amber-500/20 border border-amber-500/30 animate-pulse-glow' : 'bg-slate-800'
                }`}>
                  {ach.unlocked ? ach.icon : <Lock className="w-5 h-5 text-slate-500" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-sm font-bold truncate ${ach.unlocked ? 'text-white' : 'text-slate-400'}`}>
                      {ach.title}
                    </h4>
                    {ach.unlocked && (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5 shrink-0">
                        <CheckCircle2 className="w-3 h-3" /> Desbloqueado
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                    {ach.description}
                  </p>

                  <div className="mt-2 flex items-center gap-2 text-[11px] font-mono">
                    <span className="text-indigo-400 font-bold">+{ach.xpReward} XP</span>
                    <span className="text-slate-600">&bull;</span>
                    <span className="text-amber-400 font-bold">+{ach.gemsReward} Gemas</span>
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
