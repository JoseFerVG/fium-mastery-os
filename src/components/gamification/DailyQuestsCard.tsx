import React from 'react';
import { Sparkles, CheckCircle2, Circle, Flame, Award, ChevronRight } from 'lucide-react';
import { DailyQuest } from '../../types';
import { soundManager } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

interface DailyQuestsCardProps {
  quests: DailyQuest[];
  onClaimQuest: (questId: string) => void;
  onOpenExamRush: () => void;
  onOpenFlashcards: () => void;
  onOpenDuolingo: () => void;
}

export const DailyQuestsCard: React.FC<DailyQuestsCardProps> = ({
  quests,
  onClaimQuest,
  onOpenExamRush,
  onOpenFlashcards,
  onOpenDuolingo
}) => {
  const completedCount = quests.filter(q => q.completed).length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Misiones Diarias de Salvación
              <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                {completedCount}/{quests.length}
              </span>
            </h3>
            <p className="text-xs text-slate-400">Renovadas cada 24h &bull; ¡Mantén viva tu racha de examen!</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="text-amber-400 font-bold">Bonus Racha x1.5 XP</span>
        </div>
      </div>

      {/* Quests List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {quests.map(quest => {
          return (
            <div
              key={quest.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                quest.completed
                  ? 'bg-emerald-950/20 border-emerald-500/30 shadow-sm'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="mt-0.5">
                  {quest.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className={`text-xs font-bold truncate ${quest.completed ? 'text-emerald-300' : 'text-white'}`}>
                    {quest.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{quest.description}</p>
                  <div className="flex items-center gap-2 text-[10px] font-mono mt-1 text-slate-500">
                    <span className="text-indigo-400 font-bold">+{quest.xpReward} XP</span>
                    <span>&bull;</span>
                    <span className="text-amber-400 font-bold">+{quest.gemsReward} Gemas</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {quest.completed ? (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase shrink-0">
                  Listo
                </span>
              ) : (
                <button
                  onClick={() => {
                    if (quest.type === 'fiumingo') onOpenDuolingo();
                    else if (quest.type === 'quiz') onOpenExamRush();
                    else onOpenFlashcards();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-bold uppercase shrink-0 transition"
                >
                  Ir &rarr;
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
