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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white border-2 border-b-[6px] border-[#E5E5E5] rounded-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className={`p-6 bg-gradient-to-r ${unit.color || 'from-[#58CC02] to-[#46A302]'} text-white flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <BookOpen className="w-6 h-6 text-white stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-white/90">
                Guía de Estudio • Unidad {unit.unitNumber}
              </span>
              <h3 className="text-xl font-black">{unit.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar guía"
            className="p-2 rounded-2xl bg-black/15 hover:bg-black/25 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#4B4B4B]">
          {/* Mascot intro */}
          <div className="flex items-center gap-4 bg-[#F7F7F7] p-4 rounded-2xl border-2 border-[#E5E5E5]">
            <DuoMascot mood="scholar" size="sm" />
            <div className="text-xs text-[#4B4B4B] leading-relaxed">
              <span className="font-black text-[#58CC02]">Consejo de DuoFIUM:</span> Repasa estos puntos clave antes de entrar a las lecciones. Te ahorrarán vidas y aprenderás los conceptos exactos del examen.
            </div>
          </div>

          {/* Key Points */}
          <div>
            <h4 className="text-xs font-black text-[#4B4B4B] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FFC800] fill-[#FFC800]" />
              Puntos Fundamentales del Aula Virtual
            </h4>
            <div className="space-y-2.5">
              {unit.guideBook.keyPoints.map((point, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-[#F7F7F7] p-3.5 rounded-2xl border-2 border-[#E5E5E5] text-xs font-bold text-[#4B4B4B]">
                  <CheckCircle2 className="w-4 h-4 text-[#58CC02] shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Essential Formula if present */}
          {unit.guideBook.essentialFormula && (
            <div className="bg-[#E5F6FD] p-4 rounded-2xl border-2 border-[#84D8FF]">
              <div className="text-[11px] font-black uppercase tracking-wider text-[#1CB0F6] mb-1.5">
                Fórmula Analítica de Examen
              </div>
              <div className="font-mono text-xs sm:text-sm text-[#1899D6] font-bold bg-white p-3 rounded-xl border border-[#84D8FF] text-center">
                {unit.guideBook.essentialFormula}
              </div>
            </div>
          )}

          {/* Common Mistakes / Traps */}
          <div>
            <h4 className="text-xs font-black text-[#FF4B4B] uppercase tracking-wider mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#FF4B4B]" />
              Trampas Frecuentes de la Convocatoria
            </h4>
            <div className="space-y-2.5">
              {unit.guideBook.commonMistakes.map((mistake, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-[#FFF0F0] border-2 border-[#FFD0D0] p-3.5 rounded-2xl text-xs font-bold text-[#EA2B2B]">
                  <span className="shrink-0">⚠️</span>
                  <span>{mistake}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div className="p-4 bg-white border-t-2 border-[#E5E5E5] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="duo-btn-white px-5 py-2.5 text-xs"
          >
            Cerrar
          </button>
          {onStartLesson && (
            <button
              onClick={() => {
                onClose();
                onStartLesson();
              }}
              className="duo-btn-green px-6 py-2.5 text-xs"
            >
              ¡Empezar Lección!
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
