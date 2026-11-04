import React from 'react';
import { Subject } from '../types';
import { X, BookMarked, Sparkles } from 'lucide-react';

interface CheatSheetModalProps {
  subject: Subject;
  onClose: () => void;
}

export const CheatSheetModal: React.FC<CheatSheetModalProps> = ({ subject, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <BookMarked className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">{subject.formulaCheatSheet.title}</h3>
              <p className="text-xs text-slate-400">{subject.name} ({subject.code})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable list of formulas */}
        <div className="overflow-y-auto py-4 space-y-4 pr-1">
          {subject.formulaCheatSheet.items.map((item, idx) => (
            <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
              <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
                {item.label}
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 font-mono text-sm text-emerald-300 font-bold overflow-x-auto my-2">
                {item.formulaOrLaw}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {item.notes}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Aprenderte estas fórmulas de memoria garantiza puntos inmediatos en la parte práctica del examen.
          </p>
        </div>
      </div>
    </div>
  );
};
