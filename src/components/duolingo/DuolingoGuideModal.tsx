import React from 'react';
import { DuolingoUnit } from '../../types/duolingo';
import { X, BookOpen, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';
import { DuoMascot } from './DuoMascot';

interface DuolingoGuideModalProps {
  unit: DuolingoUnit;
  onClose: () => void;
  onStartLesson?: () => void;
}

export const DuolingoGuideModal: React.FC<DuolingoGuideModalProps> = ({
  unit,
  onClose,
  onStartLesson,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border-2 border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className={`p-6 bg-gradient-to-r ${unit.color} text-white flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-white/80">
                Guía de Estudio · Unidad {unit.unitNumber}
              </span>
              <h3 className="text-xl font-black">{unit.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-black/20 hover:bg-black/30 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200">
          {/* Mascot intro */}
          <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <DuoMascot mood="scholar" size="sm" />
            <div className="text-xs text-slate-300">
              <span className="font-black text-green-400">Consejo de DuoFIUM:</span> Repasa estos puntos clave antes de entrar a las lecciones. Te ahorrarán vidas y aprenderás los conceptos exactos del examen.
            </div>
          </div>

          {/* Key Points */}
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Puntos Fundamentales del Aula Virtual
            </h4>
            <div className="space-y-2">
              {unit.guideBook.keyPoints.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Essential Formula if present */}
          {unit.guideBook.essentialFormula && (
            <div className="bg-gradient-to-r from-indigo-950/60 to-purple-950/60 p-4 rounded-2xl border border-indigo-500/30">
              <div className="text-[11px] font-black uppercase tracking-wider text-indigo-400 mb-1">
                Fórmula Analítica de Examen
              </div>
              <div className="font-mono text-sm text-white font-bold bg-slate-950/80 p-2.5 rounded-xl border border-indigo-500/20 text-center">
                {unit.guideBook.essentialFormula}
              </div>
            </div>
          )}

          {/* Common Mistakes / Traps */}
          <div>
            <h4 className="text-sm font-black text-rose-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Trampas Frecuentes de la Convocatoria
            </h4>
            <div className="space-y-2">
              {unit.guideBook.commonMistakes.map((mistake, idx) => (
                <div key={idx} className="flex items-start gap-2.5 bg-rose-950/20 border border-rose-900/30 p-3 rounded-xl text-xs text-rose-200">
                  <span className="text-rose-500 font-bold shrink-0">⚠️</span>
                  <span>{mistake}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-400 hover:text-white transition"
          >
            Cerrar
          </button>
          {onStartLesson && (
            <button
              onClick={() => {
                onClose();
                onStartLesson();
              }}
              className="px-6 py-3 rounded-2xl text-xs font-black bg-green-500 hover:bg-green-400 text-white border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition shadow-lg shadow-green-500/20 uppercase tracking-wide"
            >
              ¡Empezar Lección!
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
