import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EXAM_PROBLEMS } from '../data/examQuestions';
import { SubjectId } from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Award, 
  Sparkles, 
  BookOpen, 
  ChevronRight, 
  ChevronLeft,
  ArrowLeft,
  Keyboard
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SpotlightCard } from './ui/SpotlightCard';
import { BadgePill } from './ui/BadgePill';
import { soundManager } from '../utils/soundEffects';

interface ExamTrainerProps {
  initialSubjectId?: SubjectId | 'all';
  onAnswerSaved?: (questionId: string, isCorrect: boolean) => void;
  onBack?: () => void;
}

export const ExamTrainer: React.FC<ExamTrainerProps> = ({ initialSubjectId = 'all', onAnswerSaved, onBack }) => {
  const [filterSubject, setFilterSubject] = useState<SubjectId | 'all'>(initialSubjectId);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [showDetailedSolution, setShowDetailedSolution] = useState<boolean>(false);

  useEffect(() => {
    setFilterSubject(initialSubjectId);
    setSelectedQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowDetailedSolution(false);
  }, [initialSubjectId]);

  const filteredQuestions = filterSubject === 'all' 
    ? EXAM_PROBLEMS 
    : EXAM_PROBLEMS.filter(q => q.subjectId === filterSubject);

  const currentQ = filteredQuestions[selectedQuestionIndex] || filteredQuestions[0];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = currentQ.options[idx].isCorrect;
    if (isCorrect) {
      soundManager.playCorrect();
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 }
      });
    } else {
      soundManager.playIncorrect();
    }

    if (onAnswerSaved) {
      onAnswerSaved(currentQ.id, isCorrect);
    }
  };

  const handleNextQuestion = () => {
    if (selectedQuestionIndex < filteredQuestions.length - 1) {
      soundManager.playClick();
      setSelectedQuestionIndex(idx => idx + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowDetailedSolution(false);
    }
  };

  const handlePrevQuestion = () => {
    if (selectedQuestionIndex > 0) {
      soundManager.playClick();
      setSelectedQuestionIndex(idx => idx - 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowDetailedSolution(false);
    }
  };

  // Keyboard shortcut listener for power users
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const key = e.key.toUpperCase();
      if (!isAnswered) {
        if (key === 'A' || key === '1') handleSelectOption(0);
        if (key === 'B' || key === '2') handleSelectOption(1);
        if (key === 'C' || key === '3') handleSelectOption(2);
        if (key === 'D' || key === '4') handleSelectOption(3);
      } else {
        if (e.key === 'ArrowRight' || e.key === 'Enter') {
          handleNextQuestion();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, currentQ, selectedQuestionIndex, filteredQuestions.length]);

  return (
    <SpotlightCard 
      spotlightColor="rgba(99, 102, 241, 0.18)"
      className="p-6 sm:p-8 space-y-6 shadow-2xl"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={() => {
                soundManager.playClick();
                onBack();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-xs font-semibold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Volver
            </button>
          )}
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20 shadow-md">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-black text-white">Entrenador de Exámenes Reales UMU</h3>
              <BadgePill variant="indigo">
                Convocatorias 2021-2026
              </BadgePill>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Problemas oficiales resueltos con desarrollo analítico paso a paso.</p>
          </div>
        </div>

        {/* Subject Filter Pills (Smooth scrollable on mobile) */}
        <div className="flex flex-nowrap sm:flex-wrap overflow-x-auto max-w-full pb-1 sm:pb-0 gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-white/10 shadow-inner">
          {(['all', 'aoc', 'aso', 'alf', 'tds', 'iso', 'ac', 'ar', 'st', 'si'] as const).map(sub => (
            <button
              key={sub}
              onClick={() => {
                setFilterSubject(sub);
                setSelectedQuestionIndex(0);
                setSelectedOption(null);
                setIsAnswered(false);
                setShowDetailedSolution(false);
                soundManager.playClick();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase shrink-0 transition ${
                filterSubject === sub
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {sub === 'all' ? 'Todos' : sub.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {currentQ ? (
        <div className="space-y-6">
          {/* Question Meta Bar */}
          <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800 font-mono">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold uppercase">
                {currentQ.subjectId}
              </span>
              <span className="font-semibold text-slate-300">{currentQ.courseYear}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500">
                <Keyboard className="w-3.5 h-3.5" /> Teclas: [A, B, C, D]
              </span>
              <span>
                Pregunta <strong className="text-white">{selectedQuestionIndex + 1}</strong> de {filteredQuestions.length}
              </span>
            </div>
          </div>

          {/* Question Title & Statement */}
          <div className="bg-slate-950/90 p-6 rounded-3xl border border-slate-800 shadow-md">
            <h4 className="text-base sm:text-lg font-bold text-indigo-300 mb-2">{currentQ.title}</h4>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
              {currentQ.question}
            </p>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              let btnClass = 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300 hover:translate-x-1';

              if (isAnswered) {
                if (opt.isCorrect) {
                  btnClass = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500/50 shadow-lg shadow-emerald-500/10';
                } else if (isSelected && !opt.isCorrect) {
                  btnClass = 'bg-rose-950/40 border-rose-500 text-rose-200 ring-1 ring-rose-500/50 animate-shake';
                } else {
                  btnClass = 'bg-slate-950/40 border-slate-900/60 text-slate-600 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex items-start gap-3.5 shadow-sm ${btnClass}`}
                >
                  <span className="w-7 h-7 rounded-xl border border-current flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 bg-slate-900/80">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs sm:text-sm font-medium leading-relaxed">{opt.text}</div>
                    {isAnswered && (opt.isCorrect || isSelected) && (
                      <p className={`text-xs mt-2 font-sans leading-relaxed ${opt.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {opt.explanation}
                      </p>
                    )}
                  </div>
                  {isAnswered && opt.isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  {isAnswered && isSelected && !opt.isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Detailed Solution Toggle with AnimatePresence */}
          {isAnswered && (
            <div className="space-y-4 pt-2">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowDetailedSolution(!showDetailedSolution);
                }}
                className="w-full py-3 px-4 bg-slate-950 hover:bg-slate-900 text-indigo-400 border border-indigo-500/30 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition hover:border-indigo-400/60 shadow-md"
              >
                <BookOpen className="w-4 h-4" />
                {showDetailedSolution ? 'Ocultar Desarrollo Formal Paso a Paso' : 'Ver Desarrollo Formal & Matemático Paso a Paso'}
              </button>

              <AnimatePresence>
                {showDetailedSolution && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-slate-950 p-6 rounded-3xl border border-indigo-500/40 text-xs sm:text-sm text-slate-300 font-mono whitespace-pre-wrap leading-relaxed shadow-xl">
                      <div className="text-sm font-bold text-indigo-300 font-sans mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-400" /> Solución Rigurosa de Examen:
                      </div>
                      {currentQ.detailedStepByStepSolution}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Exam Tip Box */}
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl text-xs sm:text-sm text-amber-200 flex items-start gap-3 shadow-md">
                <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300 font-bold block mb-1">Consejo del Profesor para el 10:</strong>
                  {currentQ.examTip}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={handlePrevQuestion}
              disabled={selectedQuestionIndex === 0}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" /> Anterior
            </button>

            <span className="text-xs text-slate-500 font-mono hidden sm:inline">
              {isAnswered ? 'Pregunta corregida &bull; Pulsa Siguiente' : 'Selecciona una respuesta para validar'}
            </span>

            <button
              onClick={handleNextQuestion}
              disabled={selectedQuestionIndex >= filteredQuestions.length - 1}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition hover:scale-105"
            >
              Siguiente <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500">
          No hay preguntas disponibles para el filtro seleccionado.
        </div>
      )}
    </SpotlightCard>
  );
};
