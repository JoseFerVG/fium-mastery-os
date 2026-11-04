import React, { useState } from 'react';
import { Subject, Concept } from '../types';
import { ConceptExplainer } from './ConceptExplainer';
import { CheatSheetModal } from './CheatSheetModal';
import { ArrowLeft, BookMarked, Sparkles, FolderOpen, CheckCircle, Clock } from 'lucide-react';

interface CourseViewProps {
  subject: Subject;
  topicMastery: Record<string, 'red' | 'yellow' | 'green'>;
  onUpdateMastery: (conceptId: string, status: 'red' | 'yellow' | 'green') => void;
  onBack: () => void;
}

export const CourseView: React.FC<CourseViewProps> = ({
  subject,
  topicMastery,
  onUpdateMastery,
  onBack
}) => {
  const [selectedConceptIndex, setSelectedConceptIndex] = useState<number>(0);
  const [showCheatSheet, setShowCheatSheet] = useState<boolean>(false);

  const activeConcept = subject.concepts[selectedConceptIndex] || subject.concepts[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Navigation & Course Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition group self-start"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" /> Volver al Panel Principal
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCheatSheet(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 rounded-xl text-xs font-bold transition shadow-sm"
          >
            <BookMarked className="w-4 h-4" /> Chuleta de Fórmulas & Leyes
          </button>
        </div>
      </div>

      {/* Course Banner */}
      <div className={`p-6 rounded-3xl bg-gradient-to-r ${subject.color} text-white shadow-xl`}>
        <div className="text-xs uppercase font-mono font-bold opacity-80">
          Código {subject.code} · {subject.semester}
        </div>
        <h1 className="text-2xl md:text-3xl font-black mt-1">{subject.name}</h1>
        <p className="text-xs md:text-sm mt-1.5 opacity-90 max-w-2xl">{subject.tagline}</p>
      </div>

      {/* Concept Tabs Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {subject.concepts.map((concept, idx) => {
          const isSelected = selectedConceptIndex === idx;
          const status = topicMastery[concept.id] || 'red';

          let statusIndicator = '🔴';
          if (status === 'yellow') statusIndicator = '🟡';
          if (status === 'green') statusIndicator = '🟢';

          return (
            <button
              key={concept.id}
              onClick={() => setSelectedConceptIndex(idx)}
              className={`flex-shrink-0 px-4 py-3 rounded-2xl border text-left transition flex items-center gap-3 ${
                isSelected
                  ? 'bg-slate-900 border-indigo-500 shadow-lg text-white'
                  : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span className="text-sm">{statusIndicator}</span>
              <div>
                <div className="text-xs font-bold">{concept.title}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{concept.timeEstimateMin} min</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Concept Detailed View */}
      {activeConcept && (
        <ConceptExplainer
          concept={activeConcept}
          masteryStatus={topicMastery[activeConcept.id] || 'red'}
          onStatusChange={newStatus => onUpdateMastery(activeConcept.id, newStatus)}
        />
      )}

      {/* Formula Modal */}
      {showCheatSheet && (
        <CheatSheetModal
          subject={subject}
          onClose={() => setShowCheatSheet(false)}
        />
      )}
    </div>
  );
};
