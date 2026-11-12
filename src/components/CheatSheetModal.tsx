import React from 'react';
import { Subject } from '../types';
import { X, BookMarked, Sparkles } from 'lucide-react';

interface CheatSheetModalProps {
  subject: Subject;
  onClose: () => void;
}

export const CheatSheetModal: React.FC<CheatSheetModalProps> = ({ subject, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in select-none font-sans">
      <div className="bg-white border-2 border-b-[6px] border-[#E5E5E5] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[85vh] flex flex-col text-[#4B4B4B]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-[#E5E5E5]">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-[#E5F6FD] text-[#1CB0F6] rounded-2xl border-2 border-[#84D8FF]">
              <BookMarked className="w-5 h-5 stroke-[2.5]" />
            </span>
            <div>
              <h3 className="text-lg font-black text-[#4B4B4B]">{subject.formulaCheatSheet.title}</h3>
              <p className="text-xs text-[#777777] font-bold">{subject.name} ({subject.code})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar chuleta"
            className="p-2 text-[#AFAFAF] hover:text-[#4B4B4B] hover:bg-[#F7F7F7] rounded-xl transition cursor-pointer"
          >
            <X className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* Scrollable list of formulas */}
        <div className="overflow-y-auto py-4 space-y-4 pr-1">
          {subject.formulaCheatSheet.items.map((item, idx) => (
            <div key={idx} className="bg-[#F7F7F7] p-4 rounded-2xl border-2 border-[#E5E5E5]">
              <div className="text-xs font-black text-[#1CB0F6] uppercase tracking-wider mb-1">
                {item.label}
              </div>
              <div className="bg-[#E5F6FD] p-3.5 rounded-xl border border-[#84D8FF] font-mono text-sm text-[#1899D6] font-black overflow-x-auto my-2">
                {item.formulaOrLaw}
              </div>
              <p className="text-xs text-[#4B4B4B] font-bold leading-relaxed">
                {item.notes}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t-2 border-[#E5E5E5] text-center">
          <p className="text-xs text-[#777777] font-bold flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#FFC800] fill-[#FFC800]" />
            Aprenderte estas fórmulas de memoria garantiza puntos inmediatos en la parte práctica del examen.
          </p>
        </div>
      </div>
    </div>
  );
};
