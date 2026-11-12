import React, { useState, useEffect } from 'react';
import { DuolingoLesson, DuolingoQuestion, MatchPairsQuestion, CodeReorderQuestion } from '../../types/duolingo';
import { DuoMascot, MascotMood } from './DuoMascot';
import { soundManager } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { X, Heart, CheckCircle2, AlertCircle, Sparkles, Award } from 'lucide-react';
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
  const [isHeartShaking, setIsHeartShaking] = useState(false);

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
      isCorrect = true;
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
      setIsHeartShaking(true);
      setTimeout(() => setIsHeartShaking(false), 600);
      onLoseHeart();
      setStats(prev => ({ ...prev, totalMistakes: prev.totalMistakes + 1 }));
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < lesson.questions.length - 1) {
      setCurrentQuestionIndex(idx => idx + 1);
    } else {
      soundManager.playFanfare();
      setIsFinished(true);
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 }
      });
      onCompleteLesson(lesson.xpReward, lesson.gemReward);
    }
  };

  // Out of hearts modal
  if (hearts <= 0 && answerStatus === 'incorrect') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
        <div className="w-full max-w-md bg-white border-2 border-b-[6px] border-[#FF4B4B] rounded-3xl p-8 text-center space-y-6">
          <DuoMascot mood="crying" size="lg" speechText="¡Sin vidas!" />
          <div>
            <h3 className="text-2xl font-black text-[#4B4B4B]">¡Te has quedado sin vidas!</h3>
            <p className="text-xs text-[#777777] font-bold mt-2 leading-relaxed">
              Los temas de ingeniería de la FIUM son exigentes. Recarga tus vidas al instante para seguir practicando o repasa la guía de estudio.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={onRefillHearts}
              className="duo-btn-red w-full py-4 text-sm flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5 fill-white stroke-[2]" />
              Recargar Vidas Gratis (Modo Alumno)
            </button>
            <button
              onClick={onClose}
              className="duo-btn-white w-full py-3.5 text-xs"
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
        <div className="w-full max-w-md bg-white border-2 border-b-[6px] border-[#58CC02] rounded-3xl p-8 text-center space-y-6">
          <DuoMascot mood="cheering" size="lg" speechText="¡INCREÍBLE!" />
          <div>
            <h2 className="text-3xl font-black text-[#58CC02] tracking-tight">¡Lección Completada!</h2>
            <p className="text-sm text-[#4B4B4B] font-extrabold mt-1">{lesson.title}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#FFF9E5] p-4 rounded-2xl border-2 border-b-4 border-[#FFC800]">
              <span className="text-[10px] font-black uppercase text-[#E5A500] tracking-wider">EXP Ganada</span>
              <div className="text-2xl font-black text-[#4B4B4B] flex items-center justify-center gap-1.5 mt-1">
                <Sparkles className="w-5 h-5 text-[#FFC800] fill-[#FFC800]" />
                +{lesson.xpReward} XP
              </div>
            </div>

            <div className="bg-[#E5F6FD] p-4 rounded-2xl border-2 border-b-4 border-[#1CB0F6]">
              <span className="text-[10px] font-black uppercase text-[#1899D6] tracking-wider">Gemas</span>
              <div className="text-2xl font-black text-[#4B4B4B] flex items-center justify-center gap-1.5 mt-1">
                <Award className="w-5 h-5 text-[#1CB0F6]" />
                +{lesson.gemReward} 💎
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="duo-btn-green w-full py-4 text-base"
          >
            CONTINUAR AL MAPA
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-white text-[#4B4B4B] font-sans select-none"
    >
      {/* Top Bar with Progress & Hearts */}
      <div className="max-w-3xl w-full mx-auto px-4 py-4 sm:py-6 flex items-center justify-between gap-4">
        <button
          onClick={onClose}
          aria-label="Cerrar lección"
          className="p-2 text-[#AFAFAF] hover:text-[#4B4B4B] transition cursor-pointer"
        >
          <X className="w-6 h-6 stroke-[3]" />
        </button>

        {/* Duolingo Green Chunky Progress Bar */}
        <div className="flex-1 h-4 bg-[#E5E5E5] rounded-full overflow-hidden p-0.5 relative">
          <div
            className="h-full bg-[#58CC02] rounded-full transition-all duration-300 relative"
            style={{ width: `${progressPercent}%` }}
          >
            {/* Top Gloss highlight */}
            <div className="absolute top-0.5 left-2 right-2 h-1 bg-white/30 rounded-full" />
          </div>
        </div>

        {/* Hearts indicator */}
        <div
          className={`flex items-center gap-1.5 text-[#FF4B4B] font-black text-base ${
            isHeartShaking ? 'animate-shake' : ''
          }`}
        >
          <Heart className="w-6 h-6 fill-[#FF4B4B] stroke-[2]" />
          <span>{hearts}</span>
        </div>
      </div>

      {/* Center Question Canvas */}
      <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-4 sm:py-8 overflow-y-auto flex flex-col justify-center">
        {/* Mascot & Prompt */}
        <div className="flex items-start gap-4 mb-6 sm:mb-8">
          <DuoMascot mood={mascotMood} size="sm" />
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-black text-[#4B4B4B] leading-tight">
              {currentQ.prompt}
            </h2>
            {currentQ.subPrompt && (
              <p className="text-xs text-[#777777] font-bold mt-1.5 leading-relaxed">
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
                  className={`w-full text-left p-4 rounded-2xl font-extrabold text-sm transition-all flex items-center justify-between border-2 border-b-4 cursor-pointer ${
                    isSelected
                      ? 'bg-[#DDF4FF] border-[#84D8FF] text-[#1CB0F6]'
                      : 'bg-white border-[#E5E5E5] text-[#4B4B4B] hover:bg-[#F7F7F7] active:border-b-2 active:translate-y-0.5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs border-2 ${
                        isSelected
                          ? 'border-[#84D8FF] text-[#1CB0F6] bg-white'
                          : 'border-[#E5E5E5] text-[#AFAFAF] bg-[#F7F7F7]'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* QUESTION TYPE 2: True / False */}
        {currentQ.type === 'true_false' && (
          <div className="grid grid-cols-2 gap-4 mt-2">
            <button
              onClick={() => {
                if (answerStatus === 'unanswered') {
                  soundManager.playClick();
                  setSelectedTrueFalse(true);
                }
              }}
              disabled={answerStatus !== 'unanswered'}
              className={`p-6 rounded-2xl font-black text-base transition-all border-2 border-b-4 cursor-pointer ${
                selectedTrueFalse === true
                  ? 'bg-[#E5F6FD] border-[#1CB0F6] text-[#1CB0F6]'
                  : 'bg-white border-[#E5E5E5] hover:bg-[#F7F7F7] text-[#4B4B4B]'
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
              className={`p-6 rounded-2xl font-black text-base transition-all border-2 border-b-4 cursor-pointer ${
                selectedTrueFalse === false
                  ? 'bg-[#FFF0F0] border-[#FF4B4B] text-[#FF4B4B]'
                  : 'bg-white border-[#E5E5E5] hover:bg-[#F7F7F7] text-[#4B4B4B]'
              }`}
            >
              FALSO
            </button>
          </div>
        )}

        {/* QUESTION TYPE 3: Code / Formula Reorder */}
        {currentQ.type === 'code_reorder' && (
          <div className="space-y-6">
            <div className="min-h-20 p-4 rounded-2xl bg-[#F7F7F7] border-2 border-dashed border-[#E5E5E5] flex flex-wrap gap-2 items-center">
              {selectedTokens.length === 0 ? (
                <span className="text-xs text-[#AFAFAF] font-bold">Haz clic en los bloques inferiores para ordenar la fórmula o secuencia...</span>
              ) : (
                selectedTokens.map((tok, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDeselectToken(tok, idx)}
                    className="duo-btn-blue px-4 py-2 text-xs font-mono lowercase"
                  >
                    {tok}
                  </button>
                ))
              )}
            </div>

            <div className="flex flex-wrap gap-2 justify-center pt-4 border-t-2 border-[#E5E5E5]">
              {availableTokens.map((tok, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectToken(tok, idx)}
                  className="duo-btn-white px-4 py-2 text-xs font-mono lowercase"
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
            <div className="space-y-2.5">
              {(currentQ as MatchPairsQuestion).pairs.map((p, idx) => {
                const isMatched = matchedPairs.includes(p.left);
                const isSelected = selectedLeft === p.left;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectPairItem('left', p.left)}
                    disabled={isMatched}
                    className={`w-full text-left p-4 rounded-2xl font-black text-xs transition border-2 border-b-4 cursor-pointer ${
                      isMatched
                        ? 'bg-[#E5E5E5] border-[#CECECE] text-[#AFAFAF] cursor-default'
                        : isSelected
                        ? 'bg-[#DDF4FF] border-[#84D8FF] text-[#1CB0F6]'
                        : 'bg-white border-[#E5E5E5] text-[#4B4B4B] hover:bg-[#F7F7F7]'
                    }`}
                  >
                    {p.left}
                  </button>
                );
              })}
            </div>

            <div className="space-y-2.5">
              {(currentQ as MatchPairsQuestion).pairs.slice().reverse().map((p, idx) => {
                const isMatched = matchedPairs.includes(p.right);
                const isSelected = selectedRight === p.right;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectPairItem('right', p.right)}
                    disabled={isMatched}
                    className={`w-full text-left p-4 rounded-2xl font-black text-xs transition border-2 border-b-4 cursor-pointer ${
                      isMatched
                        ? 'bg-[#E5E5E5] border-[#CECECE] text-[#AFAFAF] cursor-default'
                        : isSelected
                        ? 'bg-[#DDF4FF] border-[#84D8FF] text-[#1CB0F6]'
                        : 'bg-white border-[#E5E5E5] text-[#4B4B4B] hover:bg-[#F7F7F7]'
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

      {/* Bottom Sticky Action / Feedback Drawer (Official Duolingo Bottom Sheet) */}
      <div
        className={`border-t-2 p-5 sm:p-6 pb-safe transition-colors duration-200 ${
          answerStatus === 'correct'
            ? 'bg-[#D7FFB8] border-[#58CC02]'
            : answerStatus === 'incorrect'
            ? 'bg-[#FFDFE0] border-[#FF4B4B]'
            : 'bg-white border-[#E5E5E5]'
        }`}
      >
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Status feedback message */}
          {answerStatus === 'correct' ? (
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-[#58CC02] rounded-full text-white shrink-0 mt-0.5">
                <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-xl font-black text-[#58A700]">¡Excelente!</h4>
                <p className="text-xs font-bold text-[#46A302] mt-0.5 leading-relaxed">{currentQ.explanation}</p>
              </div>
            </div>
          ) : answerStatus === 'incorrect' ? (
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-[#FF4B4B] rounded-full text-white shrink-0 mt-0.5">
                <AlertCircle className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-xl font-black text-[#EA2B2B]">Solución correcta:</h4>
                <p className="text-xs font-bold text-[#EA2B2B] mt-0.5 leading-relaxed">{currentQ.explanation}</p>
                {currentQ.tip && (
                  <p className="text-[11px] font-extrabold text-[#EA2B2B]/90 mt-1.5 bg-white/60 p-2.5 rounded-xl border border-[#FF4B4B]/20">
                    💡 <strong>Ojo en el examen:</strong> {currentQ.tip}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-xs text-[#AFAFAF] font-black hidden sm:block uppercase tracking-wider">
              {currentQ.type === 'multiple_choice' ? 'Pulsa 1-4 en el teclado o elige una opción' : 'Completa la respuesta para comprobar'}
            </div>
          )}

          {/* Action button */}
          {answerStatus === 'unanswered' ? (
            <button
              onClick={handleCheckAnswer}
              disabled={!canCheck()}
              className="duo-btn-green px-10 py-3.5 text-sm sm:w-auto w-full"
            >
              COMPROBAR
            </button>
          ) : (
            <button
              onClick={handleNext}
              className={`${
                answerStatus === 'correct' ? 'duo-btn-green' : 'duo-btn-red'
              } px-10 py-3.5 text-sm sm:w-auto w-full`}
            >
              CONTINUAR
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
