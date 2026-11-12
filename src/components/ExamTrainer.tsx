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

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
    <div className="duo-card p-6 sm:p-8 space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-[#E5E5E5]">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={() => {
                soundManager.playClick();
                onBack();
              }}
              className="duo-btn-white px-3.5 py-2 text-xs"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Volver
            </button>
          )}
          <div className="p-3 bg-[#E5F6FD] text-[#1CB0F6] rounded-2xl border-2 border-[#84D8FF]">
            <Award className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-black text-[#4B4B4B]">Exámenes Reales FIUM</h3>
              <BadgePill variant="indigo">
                Convocatorias Oficiales
              </BadgePill>
            </div>
            <p className="text-xs text-[#777777] font-bold mt-0.5">Problemas de examen resueltos paso a paso.</p>
          </div>
        </div>

        {/* Subject Filter Pills */}
        <div className="flex flex-nowrap sm:flex-wrap overflow-x-auto max-w-full pb-1 sm:pb-0 gap-1.5">
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
              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider shrink-0 transition border-2 border-b-4 ${
                filterSubject === sub
                  ? 'bg-[#E5F6FD] border-[#84D8FF] text-[#1CB0F6]'
                  : 'bg-white border-[#E5E5E5] text-[#777777] hover:bg-[#F7F7F7]'
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
          <div className="flex items-center justify-between text-xs text-[#777777] bg-[#F7F7F7] px-4 py-2.5 rounded-2xl border-2 border-[#E5E5E5] font-black">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-[#E5F6FD] text-[#1CB0F6] font-black uppercase border border-[#84D8FF]">
                {currentQ.subjectId}
              </span>
              <span className="font-bold text-[#4B4B4B]">{currentQ.courseYear}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:flex items-center gap-1 text-[11px] text-[#AFAFAF]">
                <Keyboard className="w-3.5 h-3.5" /> Teclas: [1, 2, 3, 4]
              </span>
              <span>
                Pregunta <strong className="text-[#4B4B4B]">{selectedQuestionIndex + 1}</strong> de {filteredQuestions.length}
              </span>
            </div>
          </div>

          {/* Question Title & Statement */}
          <div className="bg-[#F7F7F7] p-6 rounded-3xl border-2 border-[#E5E5E5]">
            <h4 className="text-base sm:text-lg font-black text-[#1CB0F6] mb-2">{currentQ.title}</h4>
            <p className="text-sm sm:text-base text-[#4B4B4B] leading-relaxed whitespace-pre-wrap font-bold">
              {currentQ.question}
            </p>
          </div>

          {/* Answer Options in 3D Duolingo Card Style */}
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              let btnClass = 'bg-white border-[#E5E5E5] text-[#4B4B4B] hover:bg-[#F7F7F7]';

              if (isAnswered) {
                if (opt.isCorrect) {
                  btnClass = 'bg-[#D7FFB8] border-[#58CC02] text-[#58A700]';
                } else if (isSelected && !opt.isCorrect) {
                  btnClass = 'bg-[#FFDFE0] border-[#FF4B4B] text-[#EA2B2B] animate-shake';
                } else {
                  btnClass = 'bg-[#F7F7F7] border-[#E5E5E5] text-[#AFAFAF] opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 border-b-4 transition-all duration-150 flex items-start gap-3.5 cursor-pointer ${btnClass}`}
                >
                  <span className="w-7 h-7 rounded-xl border-2 border-current flex items-center justify-center text-xs font-black shrink-0 mt-0.5 bg-white">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs sm:text-sm font-black leading-relaxed">{opt.text}</div>
                    {isAnswered && (opt.isCorrect || isSelected) && (
                      <p className={`text-xs mt-2 font-bold leading-relaxed ${opt.isCorrect ? 'text-[#58A700]' : 'text-[#EA2B2B]'}`}>
                        {opt.explanation}
                      </p>
                    )}
                  </div>
                  {isAnswered && opt.isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-[#58CC02] shrink-0 mt-0.5 stroke-[2.5]" />
                  )}
                  {isAnswered && isSelected && !opt.isCorrect && (
                    <XCircle className="w-5 h-5 text-[#FF4B4B] shrink-0 mt-0.5 stroke-[2.5]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Detailed Solution Toggle */}
          {isAnswered && (
            <div className="space-y-4 pt-2">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowDetailedSolution(!showDetailedSolution);
                }}
                className="duo-btn-blue w-full py-3 px-4 text-xs"
              >
                <BookOpen className="w-4 h-4 mr-2" />
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
                    <div className="bg-[#E5F6FD] p-6 rounded-3xl border-2 border-[#84D8FF] text-xs sm:text-sm text-[#4B4B4B] font-mono whitespace-pre-wrap leading-relaxed">
                      <div className="text-sm font-black text-[#1CB0F6] font-sans mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#1CB0F6]" /> Solución Rigurosa de Examen:
                      </div>
                      {currentQ.detailedStepByStepSolution}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Exam Tip Box */}
              <div className="bg-[#FFF9E5] border-2 border-b-4 border-[#FFC800] p-4 rounded-2xl text-xs sm:text-sm text-[#4B4B4B] flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-[#FF9600] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#FF9600] font-black block mb-1">Consejo del Profesor para el 10:</strong>
                  {currentQ.examTip}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t-2 border-[#E5E5E5]">
            <button
              onClick={handlePrevQuestion}
              disabled={selectedQuestionIndex === 0}
              className="duo-btn-white px-5 py-2.5 text-xs"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
            </button>

            <span className="text-xs text-[#AFAFAF] font-black hidden sm:inline uppercase tracking-wider">
              {isAnswered ? 'Pregunta corregida • Pulsa Siguiente' : 'Selecciona una respuesta para validar'}
            </span>

            <button
              onClick={handleNextQuestion}
              disabled={selectedQuestionIndex >= filteredQuestions.length - 1}
              className="duo-btn-green px-6 py-2.5 text-xs"
            >
              Siguiente <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-[#AFAFAF] font-bold">
          No hay preguntas disponibles para el filtro seleccionado.
        </div>
      )}
    </div>
  );
};
