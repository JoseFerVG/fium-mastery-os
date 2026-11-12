import React from 'react';
import { Flame, Trophy, Sparkles, Check, ChevronRight, Zap, Target } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface DuolingoRightSidebarProps {
  xp: number;
  streakDays: number;
  gems: number;
  onOpenAchievements?: () => void;
  onOpenExamRush?: () => void;
  onOpenDeskCompanion?: () => void;
}

export const DuolingoRightSidebar: React.FC<DuolingoRightSidebarProps> = ({
  xp,
  streakDays,
  gems: _gems,
  onOpenAchievements,
  onOpenExamRush,
  onOpenDeskCompanion,
}) => {
  const weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const todayIdx = (new Date().getDay() + 6) % 7; // 0 is Monday

  const leaderboard = [
    { rank: 1, name: 'Alejandro (AOC)', xp: 1420, avatar: '👨‍💻' },
    { rank: 2, name: 'Tú (Estudiante FIUM)', xp: Math.max(xp, 890), avatar: '🦉', isUser: true },
    { rank: 3, name: 'Lucía (ASO)', xp: 780, avatar: '👩‍💻' },
    { rank: 4, name: 'Carlos (ALF)', xp: 620, avatar: '🧑‍🔬' },
    { rank: 5, name: 'Elena (TDS)', xp: 510, avatar: '👩‍🎓' },
  ];

  return (
    <aside className="w-88 hidden xl:flex flex-col space-y-6 shrink-0 py-8 pr-6 pl-2">
      {/* 1. Super FIUM Promo Card (Authentic Duolingo Super Card) */}
      <div className="duo-card p-5 bg-gradient-to-br from-[#1CB0F6] to-[#0A85EA] text-white border-2 border-b-4 border-[#0B72C7] relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-black tracking-widest uppercase bg-white/25 px-2.5 py-1 rounded-full text-white">
            SUPER FIUM
          </span>
          <span className="text-xl">✨</span>
        </div>
        <h4 className="text-lg font-black leading-tight">
          Estudia sin anuncios ni límite de vidas
        </h4>
        <p className="text-xs text-white/90 font-bold mt-1.5 leading-relaxed">
          Accede a todos los simuladores, exámenes y resúmenes de asignaturas del Aula Virtual UMU.
        </p>
        <button
          onClick={() => {
            soundManager.playCelebration();
            if (onOpenDeskCompanion) onOpenDeskCompanion();
          }}
          className="duo-btn-white w-full py-3 mt-4 text-xs text-[#1CB0F6] border-b-4 border-[#CECECE]"
        >
          ACTIVAR SUPER GRATIS
        </button>
      </div>

      {/* 2. Racha de Estudio Semanal */}
      <div className="duo-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#FF9600] fill-[#FF9600]" />
            <h4 className="text-sm font-black text-[#4B4B4B]">Racha de {streakDays} días</h4>
          </div>
          <span className="text-xs font-black text-[#FF9600]">¡Imparable!</span>
        </div>
        
        {/* Week Circles */}
        <div className="flex items-center justify-between pt-1">
          {weekDays.map((day, idx) => {
            const isCompleted = idx <= todayIdx;
            return (
              <div key={day} className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                    isCompleted
                      ? 'bg-[#FF9600] text-white border-2 border-[#E08500]'
                      : 'bg-[#F7F7F7] text-[#AFAFAF] border-2 border-[#E5E5E5]'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : day}
                </div>
                <span className="text-[10px] font-black text-[#AFAFAF]">{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Misiones del Día Widget */}
      <div className="duo-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#58CC02]" />
            <h4 className="text-sm font-black text-[#4B4B4B]">Misiones Diarias</h4>
          </div>
          <button
            onClick={onOpenAchievements}
            className="text-xs font-black text-[#1CB0F6] uppercase hover:underline"
          >
            Ver todas
          </button>
        </div>

        <div className="space-y-3">
          {/* Quest 1 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-black text-[#4B4B4B]">
              <span>Gana 50 de EXP</span>
              <span className="text-[#FF9600]">+{Math.min(50, xp % 100)} / 50 XP</span>
            </div>
            <div className="w-full h-3 bg-[#E5E5E5] rounded-full overflow-hidden p-0.5">
              <div 
                className="h-full bg-[#FF9600] rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(100, ((xp % 100) / 50) * 100)}%` }} 
              />
            </div>
          </div>

          {/* Quest 2 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-black text-[#4B4B4B]">
              <span>Completa 2 lecciones</span>
              <span className="text-[#58CC02]">1 / 2</span>
            </div>
            <div className="w-full h-3 bg-[#E5E5E5] rounded-full overflow-hidden p-0.5">
              <div className="h-full bg-[#58CC02] rounded-full w-1/2" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Clasificación / Liga Diamante */}
      <div className="duo-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#FFC800] fill-[#FFC800]" />
            <h4 className="text-sm font-black text-[#4B4B4B]">Liga Diamante FIUM</h4>
          </div>
          <span className="text-[10px] font-black text-[#AFAFAF] uppercase">Top 5</span>
        </div>

        <div className="space-y-2">
          {leaderboard.map(student => (
            <div
              key={student.rank}
              className={`flex items-center justify-between p-2.5 rounded-2xl text-xs font-black transition-all ${
                student.isUser
                  ? 'bg-[#E5F6FD] border-2 border-[#84D8FF] text-[#1CB0F6]'
                  : 'text-[#4B4B4B] hover:bg-[#F7F7F7]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`w-5 text-center font-black ${
                  student.rank === 1 ? 'text-[#FFC800]' : student.rank === 2 ? 'text-[#AFAFAF]' : 'text-[#CE82FF]'
                }`}>
                  {student.rank}
                </span>
                <span className="text-base">{student.avatar}</span>
                <span className="truncate max-w-[130px]">{student.name}</span>
              </div>
              <span className="font-mono text-[#777777]">{student.xp} XP</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
