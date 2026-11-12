import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Subject, SubjectId } from '../types';
import { ConceptExplainer } from './ConceptExplainer';
import { CheatSheetModal } from './CheatSheetModal';
import { ArrowLeft, BookMarked, Award } from 'lucide-react';
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
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* Top Navigation & Course Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button
          onClick={() => {
            onBack();
            soundManager.playClick();
          }}
          className="duo-btn-white px-4 py-2 text-xs"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Volver al Panel
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          {onOpenExamTrainer && (
            <button
              onClick={() => {
                onOpenExamTrainer(subject.id);
                soundManager.playClick();
              }}
              className="duo-btn-red px-4 py-2 text-xs"
            >
              <Award className="w-4 h-4 mr-1.5" /> Entrenar Examen de {subject.shortName}
            </button>
          )}

          <button
            onClick={() => {
              setShowCheatSheet(true);
              soundManager.playClick();
            }}
            className="duo-btn-blue px-4 py-2 text-xs"
          >
            <BookMarked className="w-4 h-4 mr-1.5" /> Chuleta de Fórmulas & Leyes
          </button>
        </div>
      </div>

      {/* Course Banner */}
      <div
        className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-r ${subject.color || 'from-[#1CB0F6] to-[#0A85EA]'} text-white border-2 border-b-[6px] border-black/20 shadow-sm relative overflow-hidden`}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-white/25 backdrop-blur-sm">
              CÓDIGO {subject.code} • {subject.semester}
            </span>
            <span className="text-xs font-black text-white/90">
              {subject.concepts.length} Conceptos Clave
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight">{subject.name}</h1>
          <p className="text-xs md:text-sm mt-2 text-white/90 max-w-2xl leading-relaxed font-bold">
            {subject.tagline}
          </p>
        </div>
      </div>

      {/* Concept Tabs Selector */}
      <div className="flex gap-2.5 overflow-x-auto pb-2">
        {subject.concepts.map((concept, idx) => {
          const isSelected = selectedConceptIndex === idx;
          const status = topicMastery[concept.id] || 'red';

          let statusDot = 'bg-[#FF4B4B]';
          let statusLabel = 'Pendiente';
          if (status === 'yellow') {
            statusDot = 'bg-[#FFC800]';
            statusLabel = 'En curso';
          }
          if (status === 'green') {
            statusDot = 'bg-[#58CC02]';
            statusLabel = 'Dominado';
          }

          return (
            <button
              key={concept.id}
              onClick={() => {
                setSelectedConceptIndex(idx);
                soundManager.playClick();
              }}
              className={`flex-shrink-0 px-4 py-3 rounded-2xl border-2 border-b-4 text-left transition-all flex items-center gap-3 cursor-pointer ${
                isSelected
                  ? 'bg-[#E5F6FD] border-[#84D8FF] text-[#1CB0F6]'
                  : 'bg-white border-[#E5E5E5] text-[#777777] hover:bg-[#F7F7F7]'
              }`}
            >
              <span className={`w-3 h-3 rounded-full shrink-0 ${statusDot}`} />
              <div>
                <span className="text-xs font-black block max-w-[200px] truncate">{concept.title}</span>
                <span className="text-[10px] text-[#AFAFAF] font-bold block">
                  {statusLabel} • {concept.timeEstimateMin} min
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
