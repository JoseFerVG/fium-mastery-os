import React from 'react';
import { CheckCircle2, Circle, Flame } from 'lucide-react';
import { DailyQuest } from '../../types';

interface DailyQuestsCardProps {
  quests: DailyQuest[];
  onClaimQuest: (questId: string) => void;
  onOpenExamRush: () => void;
  onOpenFlashcards: () => void;
  onOpenDuolingo: () => void;
}

export const DailyQuestsCard: React.FC<DailyQuestsCardProps> = ({
  quests,
  onClaimQuest: _onClaimQuest,
  onOpenExamRush,
  onOpenFlashcards,
  onOpenDuolingo
}) => {
  const completedCount = quests.filter(q => q.completed).length;

  return (
    <div className="duo-card p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-[#E5E5E5] pb-3.5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#FFF4D0] text-[#FF9600] border-2 border-[#FFC800]/50">
            <Flame className="w-5 h-5 fill-[#FF9600]" />
          </div>
          <div>
            <h3 className="text-base font-black text-[#4B4B4B] flex items-center gap-2">
              Misiones Diarias
              <span className="text-xs font-black text-[#FF9600] bg-[#FFF4D0] px-2.5 py-0.5 rounded-full border border-[#FFC800]/50">
                {completedCount}/{quests.length}
              </span>
            </h3>
            <p className="text-xs text-[#777777] font-bold">¡Complétalas hoy para mantener viva tu racha!</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-black text-[#58CC02] uppercase tracking-wider">
          <span>Bonus Racha x1.5 XP</span>
        </div>
      </div>

      {/* Quests List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {quests.map(quest => {
          return (
            <div
              key={quest.id}
              className={`p-4 rounded-2xl border-2 border-b-4 transition-all flex items-center justify-between gap-3 ${
                quest.completed
                  ? 'bg-[#EAFBEA] border-[#58CC02] text-[#4B4B4B]'
                  : 'bg-white border-[#E5E5E5] hover:border-[#84D8FF]'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="mt-0.5">
                  {quest.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-[#58CC02] shrink-0 stroke-[2.5]" />
                  ) : (
                    <Circle className="w-5 h-5 text-[#CECECE] shrink-0 stroke-[2.5]" />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className={`text-xs font-black truncate ${quest.completed ? 'text-[#58A700]' : 'text-[#4B4B4B]'}`}>
                    {quest.title}
                  </h4>
                  <p className="text-[11px] text-[#777777] font-bold line-clamp-1">{quest.description}</p>
                  <div className="flex items-center gap-2 text-[10px] font-black mt-1.5">
                    <span className="text-[#1CB0F6]">+{quest.xpReward} XP</span>
                    <span className="text-[#AFAFAF]">•</span>
                    <span className="text-[#FF9600]">+{quest.gemsReward} Gemas</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {quest.completed ? (
                <span className="px-3 py-1 rounded-xl bg-[#D7FFB8] text-[#58A700] text-[10px] font-black uppercase tracking-wider shrink-0 border border-[#58CC02]/30">
                  ¡Listo!
                </span>
              ) : (
                <button
                  onClick={() => {
                    if (quest.type === 'fiumingo') onOpenDuolingo();
                    else if (quest.type === 'quiz') onOpenExamRush();
                    else onOpenFlashcards();
                  }}
                  className="duo-btn-blue px-3 py-1.5 text-[10px] uppercase shrink-0"
                >
                  Ir →
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
