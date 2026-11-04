import React, { useState } from 'react';
import { EXAM_PROBLEMS } from '../data/examQuestions';
import { SubjectId, ExamProblem } from '../types';
import { CheckCircle2, XCircle, HelpCircle, Award, Sparkles, BookOpen, ChevronRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

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
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }

    if (onAnswerSaved) {
      onAnswerSaved(currentQ.id, isCorrect);
    }
  };

  const handleNextQuestion = () => {
    if (selectedQuestionIndex < filteredQuestions.length - 1) {
      setSelectedQuestionIndex(idx => idx + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowDetailedSolution(false);
    }
  };

  const handlePrevQuestion = () => {
    if (selectedQuestionIndex > 0) {
      setSelectedQuestionIndex(idx => idx - 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowDetailedSolution(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-xs font-semibold"
            >
              ← Volver
            </button>
          )}
          <span className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <Award className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-xl font-bold text-white">Entrenador de Exámenes Reales UMU</h3>
            <p className="text-sm text-slate-400">Problemas oficiales de convocatorias anteriores con corrección rigurosa.</p>
          </div>
        </div>

        {/* Subject Filter Pills */}
        <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          {(['all', 'aoc', 'aso', 'alf', 'tds', 'iso', 'ac', 'ar', 'st', 'si'] as const).map(sub => (
            <button
              key={sub}
              onClick={() => {
                setFilterSubject(sub);
                setSelectedQuestionIndex(0);
                setSelectedOption(null);
                setIsAnswered(false);
                setShowDetailedSolution(false);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition ${
                filterSubject === sub
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {sub === 'all' ? 'Todos' : sub.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {currentQ ? (
        <div>
          {/* Question Meta Bar */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold uppercase font-mono">
                {currentQ.subjectId}
              </span>
              <span className="font-semibold text-slate-300">{currentQ.courseYear}</span>
            </div>
            <span className="font-mono">
              Pregunta {selectedQuestionIndex + 1} de {filteredQuestions.length}
            </span>
          </div>

          {/* Question Title & Statement */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 mb-6">
            <h4 className="text-base font-bold text-indigo-300 mb-2">{currentQ.title}</h4>
            <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
              {currentQ.question}
            </p>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-6">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              let btnClass = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300';

              if (isAnswered) {
                if (opt.isCorrect) {
                  btnClass = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500/50';
                } else if (isSelected && !opt.isCorrect) {
                  btnClass = 'bg-rose-950/40 border-rose-500 text-rose-200 ring-1 ring-rose-500/50';
                } else {
                  btnClass = 'bg-slate-950/50 border-slate-900 text-slate-500';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded-xl border transition flex items-start gap-3 ${btnClass}`}
                >
                  <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{opt.text}</div>
                    {isAnswered && (opt.isCorrect || isSelected) && (
                      <p className={`text-xs mt-2 font-sans ${opt.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
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

          {/* Detailed Solution Toggle */}
          {isAnswered && (
            <div className="space-y-4 mb-6">
              <button
                onClick={() => setShowDetailedSolution(!showDetailedSolution)}
                className="w-full py-2.5 px-4 bg-slate-950 hover:bg-slate-800 text-indigo-400 border border-indigo-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <BookOpen className="w-4 h-4" />
                {showDetailedSolution ? 'Ocultar Desarrollo Formal Paso a Paso' : 'Ver Desarrollo Formal & Matemático Paso a Paso'}
              </button>

              {showDetailedSolution && (
                <div className="bg-slate-950 p-5 rounded-2xl border border-indigo-500/40 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
                  <div className="text-sm font-bold text-indigo-300 font-sans mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Solución Rigurosa de Examen:
                  </div>
                  {currentQ.detailedStepByStepSolution}
                </div>
              )}

              {/* Exam Tip Box */}
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl text-xs text-amber-200 flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300 font-bold block mb-0.5">Consejo del Profesor para el 10:</strong>
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
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white text-xs font-bold rounded-xl transition"
            >
              Anterior
            </button>

            <span className="text-xs text-slate-500">
              {isAnswered ? 'Pregunta completada' : 'Selecciona una respuesta para validar'}
            </span>

            <button
              onClick={handleNextQuestion}
              disabled={selectedQuestionIndex >= filteredQuestions.length - 1}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/20 flex items-center gap-1.5 transition"
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
    </div>
  );
};
