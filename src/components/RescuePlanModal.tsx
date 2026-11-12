import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RESCUE_DAYS, RescueDay } from '../data/rescuePlanData';
import { soundManager } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { BadgePill } from './ui/BadgePill';
import { 
  X, 
  Rocket, 
  CheckCircle2, 
  Circle, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Check
} from 'lucide-react';

interface RescuePlanModalProps {
  completedDays: number[];
  onCompleteDay: (dayNumber: number, xp: number, gems: number) => void;
  onNavigateAction: (action: RescueDay['targetAction']) => void;
  onClose: () => void;
}

export const RescuePlanModal: React.FC<RescuePlanModalProps> = ({
  completedDays,
  onCompleteDay,
  onNavigateAction,
  onClose,
}) => {
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [expandedDay, setExpandedDay] = useState<number | null>(() => {
    const nextUncompleted = RESCUE_DAYS.find(d => !completedDays.includes(d.dayNumber));
    return nextUncompleted ? nextUncompleted.dayNumber : 1;
  });

  const completedCount = completedDays.length;
  const progressPercent = Math.round((completedCount / RESCUE_DAYS.length) * 100);

  const filteredDays = selectedPhase === 'all'
    ? RESCUE_DAYS
    : RESCUE_DAYS.filter(d => d.phase === selectedPhase);

  const handleToggleComplete = (day: RescueDay, e: React.MouseEvent) => {
    e.stopPropagation();
    const isCompleted = completedDays.includes(day.dayNumber);

    if (!isCompleted) {
      soundManager.playCorrect();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      onCompleteDay(day.dayNumber, day.xpReward, day.gemReward);
    } else {
      soundManager.playClick();
      onCompleteDay(day.dayNumber, -day.xpReward, -day.gemReward);
    }
  };

  const getPriorityBadgeVariant = (priority: RescueDay['priority']) => {
    switch (priority) {
      case 'URGENCIA MÁXIMA': return 'rose';
      case 'PRÁCTICA CRÍTICA': return 'amber';
      case 'ALTA RENTABILIDAD': return 'emerald';
      default: return 'indigo';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm select-none font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 28, stiffness: 350 }}
        className="w-full max-w-4xl max-h-[92vh] bg-white border-2 border-b-[6px] border-[#E5E5E5] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#4B4B4B]"
      >
        {/* Mobile Drag Handle */}
        <div className="pt-2 pb-0 flex justify-center sm:hidden">
          <div className="w-12 h-1.5 rounded-full bg-[#E5E5E5]" />
        </div>

        {/* Header with Progress Bar */}
        <div className="p-5 sm:p-6 border-b-2 border-[#E5E5E5] bg-white flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#F5EAFF] text-[#CE82FF] rounded-2xl border-2 border-[#E8C8FF]">
                <Rocket className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F5EAFF] text-[#CE82FF] border border-[#E8C8FF]">
                    Plan de Choque • 14 Días
                  </span>
                  <span className="text-xs text-[#777777] font-bold">40-50 min/día</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#4B4B4B] mt-1">
                  Sprint de Rescate & Nivelación
                </h2>
                <p className="text-xs text-[#777777] font-bold mt-0.5 max-w-2xl leading-relaxed">
                  ¿Atrasado con las clases? Sigue esta ruta atómica de 14 sesiones para el 1º cuatrimestre.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Cerrar Plan de Rescate"
              className="p-2 text-[#AFAFAF] hover:text-[#4B4B4B] rounded-xl hover:bg-[#F7F7F7] transition shrink-0 cursor-pointer"
            >
              <X className="w-6 h-6 stroke-[3]" />
            </button>
          </div>

          {/* Progress Tracker */}
          <div className="bg-[#F7F7F7] p-4 rounded-2xl border-2 border-[#E5E5E5] space-y-2">
            <div className="flex items-center justify-between text-xs font-black">
              <span className="text-[#4B4B4B] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#FFC800] fill-[#FFC800]" />
                Progreso del Sprint: <strong className="text-[#58CC02]">{completedCount}</strong> de {RESCUE_DAYS.length} días
              </span>
              <span className="text-[#58CC02] font-black">{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#E5E5E5] h-3 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-[#58CC02] h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Phase Filter Tabs */}
          <div className="flex flex-wrap gap-2 pt-1">
            {[
              { id: 'all', label: `Todos (${RESCUE_DAYS.length})` },
              { id: 'Fase 1: Despegue Inmediato', label: 'Fase 1: Despegue (1-4)' },
              { id: 'Fase 2: Núcleo Crítico', label: 'Fase 2: Núcleo (5-9)' },
              { id: 'Fase 3: Consolidación', label: 'Fase 3: Consolidación (10-14)' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedPhase(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition border-2 border-b-4 ${
                  selectedPhase === tab.id
                    ? 'bg-[#E5F6FD] border-[#84D8FF] text-[#1CB0F6]'
                    : 'bg-white border-[#E5E5E5] text-[#777777] hover:bg-[#F7F7F7]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Days List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {filteredDays.map(day => {
            const isCompleted = completedDays.includes(day.dayNumber);
            const isExpanded = expandedDay === day.dayNumber;

            return (
              <div
                key={day.dayNumber}
                className={`rounded-2xl border-2 border-b-4 transition-all ${
                  isCompleted
                    ? 'bg-[#EAFBEA] border-[#58CC02]'
                    : isExpanded
                    ? 'bg-white border-[#84D8FF]'
                    : 'bg-white border-[#E5E5E5] hover:bg-[#F7F7F7]'
                }`}
              >
                {/* Day Header Accordion Toggle */}
                <div
                  onClick={() => setExpandedDay(isExpanded ? null : day.dayNumber)}
                  className="p-4 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => handleToggleComplete(day, e)}
                      aria-label={isCompleted ? `Marcar día ${day.dayNumber} como pendiente` : `Marcar día ${day.dayNumber} como completado`}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition shrink-0 cursor-pointer ${
                        isCompleted
                          ? 'bg-[#58CC02] text-white border-2 border-[#58A700]'
                          : 'bg-white text-[#AFAFAF] hover:text-[#4B4B4B] border-2 border-[#E5E5E5]'
                      }`}
                    >
                      {isCompleted ? <Check className="w-5 h-5 stroke-[3]" /> : <Circle className="w-5 h-5 stroke-[2.5]" />}
                    </button>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-black text-[#1CB0F6] uppercase">
                          Día {day.dayNumber} • {day.subjectName} ({day.subjectCode})
                        </span>
                        <BadgePill variant={getPriorityBadgeVariant(day.priority)}>
                          {day.priority}
                        </BadgePill>
                        <span className="text-[11px] text-[#AFAFAF] flex items-center gap-1 font-bold">
                          <Clock className="w-3 h-3" /> {day.durationMin} min
                        </span>
                      </div>
                      <h4 className={`text-base font-black mt-0.5 transition-colors ${
                        isCompleted ? 'text-[#58A700] line-through opacity-80' : 'text-[#4B4B4B]'
                      }`}>
                        {day.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto shrink-0 font-black">
                    <span className="text-xs text-[#FF9600]">
                      +{day.xpReward} XP
                    </span>
                    <span className="text-xs text-[#AFAFAF]">
                      {isExpanded ? '▲' : '▼'}
                    </span>
                  </div>
                </div>

                {/* Expanded Day Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-4 pb-5 pt-2 border-t-2 border-[#E5E5E5] space-y-4"
                    >
                      <p className="text-xs text-[#777777] font-bold leading-relaxed italic">
                        &ldquo;{day.subtitle}&rdquo;
                      </p>

                      <div className="bg-[#F7F7F7] p-4 rounded-2xl border-2 border-[#E5E5E5] space-y-1">
                        <span className="text-xs font-black text-[#1CB0F6] block">
                          🎯 Objetivo de la sesión:
                        </span>
                        <p className="text-xs text-[#4B4B4B] font-bold leading-relaxed">
                          {day.objective}
                        </p>
                      </div>

                      {/* Checklist */}
                      <div>
                        <span className="text-xs font-black text-[#4B4B4B] block mb-2 uppercase tracking-wider">
                          Pasos de acción inmediatos:
                        </span>
                        <div className="space-y-2">
                          {day.actionChecklist.map((step, sIdx) => (
                            <div key={sIdx} className="flex items-start gap-2.5 text-xs text-[#4B4B4B] font-bold">
                              <span className="w-5 h-5 rounded-lg bg-[#E5F6FD] text-[#1CB0F6] font-black text-[10px] flex items-center justify-center shrink-0 border border-[#84D8FF]">
                                {sIdx + 1}
                              </span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Exam Pro Tip Box */}
                      <div className="p-4 rounded-2xl bg-[#FFF9E5] border-2 border-b-4 border-[#FFC800] text-xs text-[#4B4B4B]">
                        <span className="font-black text-[#FF9600] block mb-1">
                          💡 Clave de Examen UMU:
                        </span>
                        <p className="leading-relaxed font-bold">
                          {day.examKey}
                        </p>
                      </div>

                      {/* Bottom Action Row */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <button
                          onClick={() => {
                            onNavigateAction(day.targetAction);
                            onClose();
                          }}
                          className="duo-btn-blue px-5 py-2.5 text-xs"
                        >
                          {day.targetAction.label} <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </button>

                        <button
                          onClick={(e) => handleToggleComplete(day, e)}
                          className={`${
                            isCompleted ? 'duo-btn-white' : 'duo-btn-green'
                          } px-5 py-2.5 text-xs`}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1.5" />
                          {isCompleted ? 'Desmarcar Día' : 'Marcar Completado (+120 XP)'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-[#E5E5E5] bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#777777] font-bold">
          <span>
            💡 <strong>Consejo:</strong> Haz 1 día de sprint al día. La constancia bate el talento.
          </span>
          <button
            onClick={onClose}
            className="duo-btn-white px-5 py-2 text-xs"
          >
            Cerrar
          </button>
        </div>
      </motion.div>
    </div>
  );
};
