import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RESCUE_DAYS, RescueDay } from '../data/rescuePlanData';
import { SubjectId, SimulatorId } from '../types';
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
  Cpu, 
  BookOpen, 
  Flame, 
  Layers, 
  Check, 
  HelpCircle,
  Award
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
    // Expand the first uncompleted day by default
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 28, stiffness: 350 }}
        className="w-full max-w-4xl max-h-[92vh] bg-slate-900 border-t sm:border border-white/15 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
      >
        {/* Mobile Drag Handle */}
        <div className="pt-2 pb-0 flex justify-center sm:hidden">
          <div className="w-12 h-1.5 rounded-full bg-slate-700/80" />
        </div>

        {/* Header with Progress Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-800/80 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-950 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-tr from-indigo-500 to-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-500/25">
                <Rocket className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Plan de Choque &bull; 14 Días
                  </span>
                  <span className="text-xs text-slate-400 font-mono">40-50 min/día</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                  Protocolo de Rescate y Nivelación Acelerada
                </h2>
                <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
                  ¿Atrasado con las clases? Sigue esta ruta atómica de 14 sesiones. Cubre exactamente las 5 asignaturas de tu primer cuatrimestre y las entregas críticas de noviembre.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Cerrar Plan de Rescate"
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/50 hover:bg-slate-800 transition shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Tracker */}
          <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 flex items-center gap-1.5 font-bold">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Progreso del Sprint: <strong className="text-white">{completedCount}</strong> de {RESCUE_DAYS.length} días completados
              </span>
              <span className="text-indigo-400 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-indigo-500 via-emerald-400 to-amber-300 h-full rounded-full transition-all duration-500 animate-shimmer"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Phase Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <button
              onClick={() => setSelectedPhase('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedPhase === 'all'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Todos ({RESCUE_DAYS.length} Días)
            </button>
            <button
              onClick={() => setSelectedPhase('Fase 1: Despegue Inmediato')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedPhase === 'Fase 1: Despegue Inmediato'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Fase 1: Despegue (Días 1-4)
            </button>
            <button
              onClick={() => setSelectedPhase('Fase 2: Núcleo Crítico')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedPhase === 'Fase 2: Núcleo Crítico'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Fase 2: Núcleo Crítico (Días 5-9)
            </button>
            <button
              onClick={() => setSelectedPhase('Fase 3: Consolidación')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedPhase === 'Fase 3: Consolidación'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Fase 3: Consolidación (Días 10-14)
            </button>
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
                className={`rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-emerald-950/15 border-emerald-500/30'
                    : isExpanded
                    ? 'bg-slate-950/90 border-indigo-500/50 shadow-xl'
                    : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
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
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                          : 'bg-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-700 border border-slate-700'
                      }`}
                    >
                      {isCompleted ? <Check className="w-5 h-5 stroke-[3]" /> : <Circle className="w-5 h-5" />}
                    </button>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold text-indigo-400 uppercase">
                          Día {day.dayNumber} &bull; {day.subjectName} ({day.subjectCode})
                        </span>
                        <BadgePill variant={getPriorityBadgeVariant(day.priority)}>
                          {day.priority}
                        </BadgePill>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" /> {day.durationMin} min
                        </span>
                      </div>
                      <h4 className={`text-base font-bold mt-0.5 transition-colors ${
                        isCompleted ? 'text-emerald-300 line-through opacity-80' : 'text-white'
                      }`}>
                        {day.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <span className="text-xs font-bold text-amber-400 font-mono">
                      +{day.xpReward} XP
                    </span>
                    <span className="text-xs text-slate-500">
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
                      className="px-4 pb-5 pt-1 border-t border-slate-800/80 space-y-4"
                    >
                      <p className="text-xs text-slate-300 leading-relaxed italic">
                        &ldquo;{day.subtitle}&rdquo;
                      </p>

                      <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
                        <span className="text-xs font-bold text-indigo-300 block">
                          🎯 Objetivo de la sesión:
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {day.objective}
                        </p>
                      </div>

                      {/* Checklist */}
                      <div>
                        <span className="text-xs font-bold text-slate-300 block mb-2">
                          Pasos de acción inmediatos (Sin fricción):
                        </span>
                        <div className="space-y-1.5">
                          {day.actionChecklist.map((step, sIdx) => (
                            <div key={sIdx} className="flex items-start gap-2 text-xs text-slate-300">
                              <span className="w-4 h-4 rounded bg-indigo-500/20 text-indigo-400 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                {sIdx + 1}
                              </span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Exam Pro Tip Box */}
                      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
                        <span className="font-bold text-amber-400 block mb-1">
                          💡 Clave de Examen UMU:
                        </span>
                        <p className="leading-relaxed opacity-90 font-mono">
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
                          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 flex items-center gap-1.5 transition"
                        >
                          {day.targetAction.label} <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={(e) => handleToggleComplete(day, e)}
                          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                            isCompleted
                              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          {isCompleted ? 'Desmarcar Día' : 'Marcar como Completado (+120 XP)'}
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
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <span>
            💡 <strong>Consejo anti-queme:</strong> Haz 1 solo día al día (45 min) con el Pomodoro activo. La constancia bate el talento.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition"
          >
            Cerrar y Empezar
          </button>
        </div>
      </motion.div>
    </div>
  );
};
