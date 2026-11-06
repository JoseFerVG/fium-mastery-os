import React, { useState, useEffect } from 'react';
import { DuolingoLesson, DuolingoQuestion, MatchPairsQuestion, CodeReorderQuestion } from '../../types/duolingo';
import { DuoMascot, MascotMood } from './DuoMascot';
import { soundManager } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { X, Heart, CheckCircle2, AlertCircle, ArrowRight, RotateCcw, Sparkles, Award } from 'lucide-react';
import { motion } from 'motion/react';

interface DuolingoLessonModalProps {
  lesson: DuolingoLesson;
  hearts: number;
  maxHearts: number;
  onClose: () => void;
  onLoseHeart: () => void;
  onRefillHearts: () => void;
  onCompleteLesson: (xpGained: number, gemsGained: number) => void;
}

export const DuolingoLessonModal: React.FC<DuolingoLessonModalProps> = ({
  lesson,
  hearts,
  maxHearts,
  onClose,
  onLoseHeart,
  onRefillHearts,
  onCompleteLesson,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [selectedTrueFalse, setSelectedTrueFalse] = useState<boolean | null>(null);

  // Match pairs state
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);

  // Code reorder state
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [availableTokens, setAvailableTokens] = useState<string[]>([]);

  // Validation state
  const [answerStatus, setAnswerStatus] = useState<'unanswered' | 'correct' | 'incorrect'>('unanswered');
  const [mascotMood, setMascotMood] = useState<MascotMood>('idle');
  const [isFinished, setIsFinished] = useState(false);
  const [stats, setStats] = useState({ correctFirstTry: 0, totalMistakes: 0 });

  const currentQ: DuolingoQuestion = lesson.questions[currentQuestionIndex];
  const progressPercent = Math.round(((currentQuestionIndex) / lesson.questions.length) * 100);

  // Reset question state on question change
  useEffect(() => {
    setSelectedChoice(null);
    setSelectedTrueFalse(null);
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedPairs([]);
    setAnswerStatus('unanswered');
    setMascotMood('idle');

    if (currentQ.type === 'code_reorder') {
      const q = currentQ as CodeReorderQuestion;
      setAvailableTokens([...q.tokens]);
      setSelectedTokens([]);
    }
  }, [currentQuestionIndex, currentQ]);

  // Keyboard shortcut listener for fast interaction
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (answerStatus === 'unanswered') {
        if (currentQ.type === 'multiple_choice' && ['1', '2', '3', '4'].includes(e.key)) {
          const idx = parseInt(e.key, 10) - 1;
          if (idx < (currentQ.options?.length || 0)) {
            setSelectedChoice(idx);
            soundManager.playClick();
          }
        } else if (e.key === 'Enter') {
          handleCheckAnswer();
        }
      } else {
        if (e.key === 'Enter') {
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [answerStatus, selectedChoice, selectedTokens, selectedTrueFalse, matchedPairs, currentQ]);

  // Handle Token Click for Code Reorder
  const handleSelectToken = (token: string, fromAvailableIndex: number) => {
    if (answerStatus !== 'unanswered') return;
    soundManager.playClick();
    setSelectedTokens([...selectedTokens, token]);
    const nextAvail = [...availableTokens];
    nextAvail.splice(fromAvailableIndex, 1);
    setAvailableTokens(nextAvail);
  };

  const handleDeselectToken = (token: string, fromSelectedIndex: number) => {
    if (answerStatus !== 'unanswered') return;
    soundManager.playClick();
    setAvailableTokens([...availableTokens, token]);
    const nextSelected = [...selectedTokens];
    nextSelected.splice(fromSelectedIndex, 1);
    setSelectedTokens(nextSelected);
  };

  // Handle Pairs Match
  const handleSelectPairItem = (side: 'left' | 'right', item: string) => {
    if (answerStatus !== 'unanswered') return;
    soundManager.playClick();

    const q = currentQ as MatchPairsQuestion;

    if (side === 'left') {
      if (selectedRight) {
        // Evaluate pair
        const isMatch = q.pairs.some(p => p.left === item && p.right === selectedRight);
        if (isMatch) {
          soundManager.playClick();
          setMatchedPairs(prev => [...prev, item, selectedRight]);
        } else {
          soundManager.playIncorrect();
        }
        setSelectedLeft(null);
        setSelectedRight(null);
      } else {
        setSelectedLeft(item);
      }
    } else {
      if (selectedLeft) {
        // Evaluate pair
        const isMatch = q.pairs.some(p => p.left === selectedLeft && p.right === item);
        if (isMatch) {
          soundManager.playClick();
          setMatchedPairs(prev => [...prev, selectedLeft, item]);
        } else {
          soundManager.playIncorrect();
        }
        setSelectedLeft(null);
        setSelectedRight(null);
      } else {
        setSelectedRight(item);
      }
    }
  };

  // Determine if check button should be enabled
  const canCheck = () => {
    if (answerStatus !== 'unanswered') return false;
    if (currentQ.type === 'multiple_choice') return selectedChoice !== null;
    if (currentQ.type === 'true_false') return selectedTrueFalse !== null;
    if (currentQ.type === 'code_reorder') return selectedTokens.length > 0;
    if (currentQ.type === 'match_pairs') {
      const q = currentQ as MatchPairsQuestion;
      return matchedPairs.length === q.pairs.length * 2;
    }
    return false;
  };

  // Check Answer Handler
  const handleCheckAnswer = () => {
    if (!canCheck()) return;

    let isCorrect = false;

    if (currentQ.type === 'multiple_choice') {
      isCorrect = selectedChoice === currentQ.correctIndex;
    } else if (currentQ.type === 'true_false') {
      isCorrect = selectedTrueFalse === currentQ.isTrue;
    } else if (currentQ.type === 'code_reorder') {
      const q = currentQ as CodeReorderQuestion;
      isCorrect = 
        selectedTokens.length === q.correctSequence.length &&
        selectedTokens.every((tok, idx) => tok === q.correctSequence[idx]);
    } else if (currentQ.type === 'match_pairs') {
      isCorrect = true; // Already validated on pairing
    }

    if (isCorrect) {
      soundManager.playCorrect();
      setAnswerStatus('correct');
      setMascotMood('cheering');
      setStats(prev => ({ ...prev, correctFirstTry: prev.correctFirstTry + 1 }));
    } else {
      soundManager.playIncorrect();
      setAnswerStatus('incorrect');
      setMascotMood('crying');
      onLoseHeart();
      setStats(prev => ({ ...prev, totalMistakes: prev.totalMistakes + 1 }));
    }
  };

  // Continue to next question or finish lesson
  const handleNext = () => {
    if (currentQuestionIndex < lesson.questions.length - 1) {
      setCurrentQuestionIndex(idx => idx + 1);
    } else {
      // Completed!
      soundManager.playFanfare();
      setIsFinished(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
      onCompleteLesson(lesson.xpReward, lesson.gemReward);
    }
  };

  // Out of hearts state
  if (hearts <= 0 && answerStatus === 'incorrect') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
        <div className="w-full max-w-md bg-slate-900 border-2 border-rose-800/80 rounded-3xl p-6 text-center space-y-6 shadow-2xl">
          <DuoMascot mood="crying" size="lg" speechText="¡Sin vidas!" />
          <div>
            <h3 className="text-2xl font-black text-white">¡Te has quedado sin vidas!</h3>
            <p className="text-xs text-slate-400 mt-2">
              Los temas de ingeniería de la UMU no perdonan. Recarga tus vidas al instante para seguir practicando o repasa la guía de estudio.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={onRefillHearts}
              className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black border-b-4 border-rose-800 active:border-b-0 active:translate-y-1 transition text-sm flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5 fill-white" />
              Recargar Vidas Gratis (Modo Alumno)
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-slate-800 text-slate-300 hover:text-white font-bold transition text-xs"
            >
              Volver al Mapa de Lecciones
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Lesson Finished Screen
  if (isFinished) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
        <div className="w-full max-w-md bg-slate-900 border-2 border-green-500/40 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <DuoMascot mood="cheering" size="lg" speechText="¡INCREÍBLE!" />
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">¡Lección Completada!</h2>
            <p className="text-sm text-green-400 font-bold mt-1">{lesson.title}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950 p-4 rounded-2xl border-2 border-amber-500/30">
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">EXP Ganada</span>
              <div className="text-2xl font-black text-white flex items-center justify-center gap-1.5 mt-1">
                <Sparkles className="w-5 h-5 text-amber-400" />
                +{lesson.xpReward} XP
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border-2 border-sky-500/30">
              <span className="text-[10px] font-black uppercase text-sky-400 tracking-wider">Gemas</span>
              <div className="text-2xl font-black text-white flex items-center justify-center gap-1.5 mt-1">
                <Award className="w-5 h-5 text-sky-400" />
                +{lesson.gemReward} 💎
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl bg-green-500 hover:bg-green-400 text-white font-black text-base border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition shadow-lg shadow-green-500/20"
          >
            CONTINUAR AL MAPA
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-slate-100 font-sans"
    >
      {/* Top Bar with Progress & Hearts */}
      <div className="max-w-3xl w-full mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <button
          onClick={onClose}
          aria-label="Cerrar lección"
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Duolingo Green Progress Bar */}
        <div className="flex-1 h-4 bg-slate-800 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-300 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Hearts indicator */}
        <div className="flex items-center gap-1.5 text-rose-500 font-black text-sm">
          <Heart className="w-6 h-6 fill-rose-500" />
          <span>{hearts}</span>
        </div>
      </div>

      {/* Center Question Canvas */}
      <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-6 overflow-y-auto flex flex-col justify-center">
        {/* Mascot & Prompt */}
        <div className="flex items-start gap-4 mb-6">
          <DuoMascot mood={mascotMood} size="sm" />
          <div>
            <h2 className="text-lg md:text-xl font-black text-white leading-snug">
              {currentQ.prompt}
            </h2>
            {currentQ.subPrompt && (
              <p className="text-xs text-slate-400 font-medium mt-1">
                {currentQ.subPrompt}
              </p>
            )}
          </div>
        </div>

        {/* QUESTION TYPE 1: Multiple Choice */}
        {currentQ.type === 'multiple_choice' && (
          <div className="grid grid-cols-1 gap-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedChoice === idx;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (answerStatus === 'unanswered') {
                      soundManager.playClick();
                      setSelectedChoice(idx);
                    }
                  }}
                  disabled={answerStatus !== 'unanswered'}
                  className={`w-full text-left p-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-between border-2 border-b-4 ${
                    isSelected
                      ? 'bg-sky-500/10 border-sky-500 text-sky-300 shadow-md shadow-sky-500/10'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center font-mono text-xs border border-slate-700">
                      {idx + 1}
                    </span>
                    <span>{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* QUESTION TYPE 2: True / False */}
        {currentQ.type === 'true_false' && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <button
              onClick={() => {
                if (answerStatus === 'unanswered') {
                  soundManager.playClick();
                  setSelectedTrueFalse(true);
                }
              }}
              disabled={answerStatus !== 'unanswered'}
              className={`p-6 rounded-2xl font-black text-base transition-all border-2 border-b-4 ${
                selectedTrueFalse === true
                  ? 'bg-green-500/20 border-green-500 text-green-400'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200'
              }`}
            >
              VERDADERO
            </button>
            <button
              onClick={() => {
                if (answerStatus === 'unanswered') {
                  soundManager.playClick();
                  setSelectedTrueFalse(false);
                }
              }}
              disabled={answerStatus !== 'unanswered'}
              className={`p-6 rounded-2xl font-black text-base transition-all border-2 border-b-4 ${
                selectedTrueFalse === false
                  ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200'
              }`}
            >
              FALSO
            </button>
          </div>
        )}

        {/* QUESTION TYPE 3: Code / Formula Reorder */}
        {currentQ.type === 'code_reorder' && (
          <div className="space-y-6">
            {/* Assembled sequence dropzone */}
            <div className="min-h-20 p-4 rounded-2xl bg-slate-900 border-2 border-dashed border-slate-700 flex flex-wrap gap-2 items-center">
              {selectedTokens.length === 0 ? (
                <span className="text-xs text-slate-500 italic">Haz clic en los bloques inferiores para ordenar la fórmula o secuencia...</span>
              ) : (
                selectedTokens.map((tok, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDeselectToken(tok, idx)}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs border-b-3 border-indigo-800 transition"
                  >
                    {tok}
                  </button>
                ))
              )}
            </div>

            {/* Token Bank */}
            <div className="flex flex-wrap gap-2 justify-center pt-4 border-t border-slate-800">
              {availableTokens.map((tok, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectToken(tok, idx)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-mono font-bold text-xs border-2 border-b-4 border-slate-700 active:border-b-2 transition"
                >
                  {tok}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* QUESTION TYPE 4: Match Pairs */}
        {currentQ.type === 'match_pairs' && (
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-2">
              {(currentQ as MatchPairsQuestion).pairs.map((p, idx) => {
                const isMatched = matchedPairs.includes(p.left);
                const isSelected = selectedLeft === p.left;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectPairItem('left', p.left)}
                    disabled={isMatched}
                    className={`w-full text-left p-3.5 rounded-xl font-bold text-xs transition border-2 border-b-4 ${
                      isMatched
                        ? 'bg-green-950/40 border-green-800/40 text-green-500 opacity-50 cursor-default'
                        : isSelected
                        ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {p.left}
                  </button>
                );
              })}
            </div>

            {/* Right Column (shuffled order for challenge) */}
            <div className="space-y-2">
              {(currentQ as MatchPairsQuestion).pairs.slice().reverse().map((p, idx) => {
                const isMatched = matchedPairs.includes(p.right);
                const isSelected = selectedRight === p.right;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectPairItem('right', p.right)}
                    disabled={isMatched}
                    className={`w-full text-left p-3.5 rounded-xl font-bold text-xs transition border-2 border-b-4 ${
                      isMatched
                        ? 'bg-green-950/40 border-green-800/40 text-green-500 opacity-50 cursor-default'
                        : isSelected
                        ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {p.right}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sticky Action / Feedback Drawer (Authentic Duolingo Bottom Sheet) */}
      <div
        className={`border-t-2 p-5 pb-safe transition-all duration-300 ${
          answerStatus === 'correct'
            ? 'bg-green-950/90 border-green-600/80'
            : answerStatus === 'incorrect'
            ? 'bg-rose-950/90 border-rose-600/80'
            : 'bg-slate-950 border-slate-800'
        }`}
      >
        <div className="max-w-2xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status feedback message */}
          {answerStatus === 'correct' ? (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-500 rounded-full text-white shrink-0 mt-0.5">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-black text-green-400">¡Increíble! ¡Correcto!</h4>
                <p className="text-xs text-green-200 mt-0.5">{currentQ.explanation}</p>
              </div>
            </div>
          ) : answerStatus === 'incorrect' ? (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-rose-500 rounded-full text-white shrink-0 mt-0.5">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-black text-rose-400">Solución y Trampa de Examen:</h4>
                <p className="text-xs text-rose-200 mt-0.5">{currentQ.explanation}</p>
                {currentQ.tip && (
                  <p className="text-[11px] font-semibold text-rose-300 mt-1 bg-rose-900/40 p-2 rounded-lg">
                    💡 <strong>Ojo en el examen:</strong> {currentQ.tip}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-500 font-semibold hidden md:block">
              {currentQ.type === 'multiple_choice' ? 'Pulsa 1-4 en el teclado o selecciona una opción' : 'Completa la respuesta para comprobar'}
            </div>
          )}

          {/* Action button */}
          {answerStatus === 'unanswered' ? (
            <button
              onClick={handleCheckAnswer}
              disabled={!canCheck()}
              className={`px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all border-b-4 active:border-b-0 active:translate-y-1 ${
                canCheck()
                  ? 'bg-green-500 hover:bg-green-400 text-white border-green-700 shadow-lg shadow-green-500/20'
                  : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
              }`}
            >
              COMPROBAR
            </button>
          ) : (
            <button
              onClick={handleNext}
              className={`px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider text-white transition-all border-b-4 active:border-b-0 active:translate-y-1 ${
                answerStatus === 'correct'
                  ? 'bg-green-500 hover:bg-green-400 border-green-700 shadow-lg shadow-green-500/20'
                  : 'bg-rose-500 hover:bg-rose-400 border-rose-700 shadow-lg shadow-rose-500/20'
              }`}
            >
              CONTINUAR →
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
