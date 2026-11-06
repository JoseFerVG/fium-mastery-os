import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Subject, SubjectId } from '../types';
import { ConceptExplainer } from './ConceptExplainer';
import { CheatSheetModal } from './CheatSheetModal';
import { SpotlightCard } from './ui/SpotlightCard';
import { BadgePill } from './ui/BadgePill';
import { ArrowLeft, BookMarked, Award, Sparkles, BookOpen } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface CourseViewProps {
  subject: Subject;
  topicMastery: Record<string, 'red' | 'yellow' | 'green'>;
  onUpdateMastery: (conceptId: string, status: 'red' | 'yellow' | 'green') => void;
  onOpenExamTrainer?: (subjectId: SubjectId) => void;
  onBack: () => void;
}

export const CourseView: React.FC<CourseViewProps> = ({
  subject,
  topicMastery,
  onUpdateMastery,
  onOpenExamTrainer,
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
          onClick={() => {
            onBack();
            soundManager.playClick();
          }}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition group self-start px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Volver al Panel Principal
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenExamTrainer && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                onOpenExamTrainer(subject.id);
                soundManager.playClick();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 rounded-2xl text-xs font-bold transition shadow-sm"
            >
              <Award className="w-4 h-4" /> Entrenar Examen de {subject.shortName}
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setShowCheatSheet(true);
              soundManager.playClick();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 rounded-2xl text-xs font-bold transition shadow-sm"
          >
            <BookMarked className="w-4 h-4" /> Chuleta de Fórmulas & Leyes
          </motion.button>
        </div>
      </div>

      {/* Course Banner with SpotlightCard */}
      <SpotlightCard
        spotlightColor="rgba(99, 102, 241, 0.25)"
        className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-r ${subject.color} text-white shadow-2xl relative overflow-hidden`}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase font-mono font-bold px-2.5 py-0.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10">
              CÓDIGO {subject.code} &bull; {subject.semester}
            </span>
            <span className="text-xs font-bold text-white/80 font-mono">
              {subject.concepts.length} Conceptos Clave
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight">{subject.name}</h1>
          <p className="text-xs md:text-sm mt-2 text-white/90 max-w-2xl leading-relaxed font-medium">
            {subject.tagline}
          </p>
        </div>
      </SpotlightCard>

      {/* Concept Tabs Selector with Smooth Pill Dock */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {subject.concepts.map((concept, idx) => {
          const isSelected = selectedConceptIndex === idx;
          const status = topicMastery[concept.id] || 'red';

          let statusDot = 'bg-rose-500';
          let statusLabel = 'Bloqueado';
          if (status === 'yellow') {
            statusDot = 'bg-amber-400';
            statusLabel = 'En curso';
          }
          if (status === 'green') {
            statusDot = 'bg-emerald-400';
            statusLabel = 'Dominado';
          }

          return (
            <button
              key={concept.id}
              onClick={() => {
                setSelectedConceptIndex(idx);
                soundManager.playClick();
              }}
              className={`relative flex-shrink-0 px-4 py-3 rounded-2xl border text-left transition-all duration-200 flex items-center gap-3 ${
                isSelected
                  ? 'bg-slate-900 border-indigo-500/80 shadow-lg shadow-indigo-500/10 text-white'
                  : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="active-concept-dock"
                  className="absolute inset-0 bg-indigo-500/10 rounded-2xl border border-indigo-500/40 pointer-events-none"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${statusDot} shadow-sm`} />
              <div>
                <span className="text-xs font-bold block max-w-[200px] truncate">{concept.title}</span>
                <span className="text-[10px] text-slate-500 font-mono block">
                  {statusLabel} &bull; {concept.timeEstimateMin} min
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Feynman Concept Explainer */}
      <ConceptExplainer
        concept={activeConcept}
        masteryStatus={topicMastery[activeConcept.id] || 'red'}
        onStatusChange={(status) => {
          onUpdateMastery(activeConcept.id, status);
        }}
      />

      {/* Cheat Sheet Modal */}
      {showCheatSheet && (
        <CheatSheetModal
          subject={subject}
          onClose={() => setShowCheatSheet(false)}
        />
      )}
    </div>
  );
};
