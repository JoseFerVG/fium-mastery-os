import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Flame, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  TrendingUp, 
  Trophy, 
  RotateCcw,
  Zap,
  ArrowRight,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { SubjectId } from '../../types';
import { COURSES } from '../../data/coursesData';
import { EXAM_PROBLEMS } from '../../data/examQuestions';
import { soundManager } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

interface DeskCompanionModalProps {
  onClose: () => void;
  onAddXp: (amount: number) => void;
  onAddGems: (amount: number) => void;
}

export const DeskCompanionModal: React.FC<DeskCompanionModalProps> = ({
  onClose,
  onAddXp,
  onAddGems,
}) => {
  // Preset book pairings common in the semester
  const [selectedBook1, setSelectedBook1] = useState<SubjectId>('aoc');
  const [selectedBook2, setSelectedBook2] = useState<SubjectId>('aso');
  const [drillActive, setDrillActive] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [comboStreak, setComboStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [drillFinished, setDrillFinished] = useState(false);

  // Filter questions for the selected two books
  const activeQuestions = EXAM_PROBLEMS.filter(
    p => p.subjectId === selectedBook1 || p.subjectId === selectedBook2
  ).slice(0, 5);

  const currentProblem = activeQuestions[currentIdx] || activeQuestions[0];
  const book1Course = COURSES.find(c => c.id === selectedBook1);
  const book2Course = COURSES.find(c => c.id === selectedBook2);

  const getComboMultiplier = (streak: number) => {
    if (streak >= 4) return 3.0;
    if (streak >= 3) return 2.0;
    if (streak >= 2) return 1.5;
    return 1.0;
  };

  const handleStartDrill = () => {
    soundManager.playPowerup();
    setDrillActive(true);
    setCurrentIdx(0);
    setSelectedOption(null);
    setComboStreak(0);
    setScore(0);
    setDrillFinished(false);
  };

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null || !currentProblem) return;
    setSelectedOption(idx);

    const isCorrect = currentProblem.options[idx].isCorrect;
    if (isCorrect) {
      soundManager.playCorrect();
      const newStreak = comboStreak + 1;
      setComboStreak(newStreak);
      const mult = getComboMultiplier(newStreak);
      const gained = Math.round(50 * mult);
      setScore(prev => prev + gained);
      onAddXp(gained);
    } else {
      soundManager.playIncorrect();
      setComboStreak(0);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < activeQuestions.length) {
      soundManager.playClick();
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
    } else {
      // Completed drill!
      soundManager.playFanfare();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      onAddGems(15);
      setDrillFinished(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm select-none"
    >
      <motion.div
        initial={{ y: '100%', opacity: 0.5 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className="w-full sm:max-w-2xl bg-white border-2 border-b-[6px] border-[#E5E5E5] sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[85vh] overflow-hidden font-sans"
      >
        {/* Mobile Drag / Sheet Handle */}
        <div className="pt-3 pb-1 flex justify-center sm:hidden">
          <div className="w-12 h-1.5 rounded-full bg-[#E5E5E5]" />
        </div>

        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b-2 border-[#E5E5E5] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF0F0] border-2 border-[#FFD0D0] flex items-center justify-center text-[#FF4B4B]">
              <Smartphone className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-[#4B4B4B] text-base tracking-tight">
                  Modo Móvil Entre Libros
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#FFF0F0] text-[#FF4B4B] border border-[#FFD0D0]">
                  3 MIN BLITZ
                </span>
              </div>
              <p className="text-xs text-[#777777] font-bold">
                Retención activa con 2 libros abiertos en tu mesa
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            aria-label="Cerrar modal"
            className="p-2 rounded-xl text-[#AFAFAF] hover:text-[#4B4B4B] hover:bg-[#F7F7F7] transition cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!drillActive ? (
            /* Setup View: Select 2 Active Books */
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-[#E5F6FD] border-2 border-[#84D8FF] flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#1CB0F6] shrink-0 mt-0.5" />
                <div className="text-xs text-[#1899D6] font-bold leading-relaxed">
                  <strong>¿Cómo funciona?</strong> Coloca el móvil junto a tus apuntes. Elige 2 asignaturas y pon a prueba lo que acabas de leer con 5 preguntas clave de examen.
                </div>
              </div>

              {/* Book Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Book 1 */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-[#4B4B4B] flex items-center gap-1.5 uppercase tracking-wider">
                    <BookOpen className="w-4 h-4 text-[#1CB0F6]" />
                    Libro 1:
                  </label>
                  <select
                    value={selectedBook1}
                    onChange={(e) => setSelectedBook1(e.target.value as SubjectId)}
                    className="w-full bg-white border-2 border-b-4 border-[#E5E5E5] rounded-2xl px-4 py-3 text-xs font-black text-[#4B4B4B] focus:outline-none focus:border-[#84D8FF]"
                  >
                    {COURSES.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Book 2 */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-[#4B4B4B] flex items-center gap-1.5 uppercase tracking-wider">
                    <BookOpen className="w-4 h-4 text-[#FF4B4B]" />
                    Libro 2:
                  </label>
                  <select
                    value={selectedBook2}
                    onChange={(e) => setSelectedBook2(e.target.value as SubjectId)}
                    className="w-full bg-white border-2 border-b-4 border-[#E5E5E5] rounded-2xl px-4 py-3 text-xs font-black text-[#4B4B4B] focus:outline-none focus:border-[#FF4B4B]"
                  >
                    {COURSES.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Start Button */}
              <button
                onClick={handleStartDrill}
                className="duo-btn-green w-full py-4 text-sm"
              >
                <Zap className="w-5 h-5 mr-1.5" />
                <span>INICIAR RETO ENTRE LIBROS (5 PREGUNTAS)</span>
              </button>
            </div>
          ) : drillFinished ? (
            /* Results Screen */
            <div className="text-center py-6 space-y-6">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-[#FFF4D0] border-2 border-b-4 border-[#FFC800] flex items-center justify-center text-4xl shadow-sm">
                🏆
              </div>

              <div>
                <h4 className="text-2xl font-black text-[#58CC02]">¡Reto Completado!</h4>
                <p className="text-xs text-[#777777] font-bold mt-1 max-w-sm mx-auto">
                  Has fijado en tu memoria de largo plazo los conceptos más tramposos de tus dos asignaturas.
                </p>
              </div>

              {/* Fruits Earned Card */}
              <div className="p-5 rounded-3xl bg-[#F7F7F7] border-2 border-b-4 border-[#E5E5E5] max-w-sm mx-auto space-y-3">
                <div className="text-xs font-black text-[#AFAFAF] uppercase tracking-wider">
                  Recompensas Ganadas
                </div>
                <div className="flex justify-around items-center font-black">
                  <div>
                    <span className="text-2xl font-black text-[#FF9600]">+{score}</span>
                    <span className="text-[10px] text-[#777777] block">XP</span>
                  </div>
                  <div className="h-8 w-px bg-[#E5E5E5]" />
                  <div>
                    <span className="text-2xl font-black text-[#1CB0F6]">+15</span>
                    <span className="text-[10px] text-[#777777] block">Gemas</span>
                  </div>
                  <div className="h-8 w-px bg-[#E5E5E5]" />
                  <div>
                    <span className="text-2xl font-black text-[#58CC02]">92%</span>
                    <span className="text-[10px] text-[#777777] block">Retención</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
                <button
                  onClick={handleStartDrill}
                  className="duo-btn-white flex-1 py-3 text-xs"
                >
                  <RotateCcw className="w-4 h-4 mr-1" /> Otra Ronda
                </button>
                <button
                  onClick={onClose}
                  className="duo-btn-green flex-1 py-3 text-xs"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" /> Continuar
                </button>
              </div>
            </div>
          ) : (
            /* Active Drill Question View */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-[#E5F6FD] text-[#1CB0F6] font-black text-xs border border-[#84D8FF]">
                    Pregunta {currentIdx + 1} de {activeQuestions.length}
                  </span>
                  <span className="text-xs font-black text-[#AFAFAF] uppercase">
                    {currentProblem.subjectId.toUpperCase()}
                  </span>
                </div>

                {comboStreak > 1 && (
                  <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-[#FFF0F0] border border-[#FFD0D0] text-[#FF4B4B] font-black text-xs">
                    <Flame className="w-4 h-4 fill-[#FF4B4B]" />
                    <span>COMBO x{getComboMultiplier(comboStreak)}</span>
                  </div>
                )}
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#E5E5E5] h-3 rounded-full overflow-hidden p-0.5">
                <div 
                  className="bg-[#58CC02] h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / activeQuestions.length) * 100}%` }}
                />
              </div>

              {/* Question Box */}
              <div className="p-5 rounded-3xl bg-[#F7F7F7] border-2 border-[#E5E5E5] space-y-2">
                <div className="text-[10px] text-[#1CB0F6] font-black uppercase">
                  {currentProblem.courseYear}
                </div>
                <h4 className="text-sm sm:text-base font-black text-[#4B4B4B] leading-relaxed">
                  {currentProblem.question}
                </h4>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentProblem.options.map((opt, optIdx) => {
                  const isSelected = selectedOption === optIdx;
                  const isSubmitted = selectedOption !== null;
                  const isCorrect = opt.isCorrect;

                  let optionStyle = 'bg-white hover:bg-[#F7F7F7] border-[#E5E5E5] text-[#4B4B4B]';
                  if (isSubmitted) {
                    if (isCorrect) {
                      optionStyle = 'bg-[#D7FFB8] border-[#58CC02] text-[#58A700]';
                    } else if (isSelected) {
                      optionStyle = 'bg-[#FFDFE0] border-[#FF4B4B] text-[#EA2B2B]';
                    } else {
                      optionStyle = 'bg-[#F7F7F7] border-[#E5E5E5] text-[#AFAFAF] opacity-60';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-4 rounded-2xl border-2 border-b-4 text-xs font-black leading-relaxed flex items-start gap-3 transition-all cursor-pointer ${optionStyle}`}
                    >
                      <span className="w-6 h-6 rounded-xl bg-white border border-[#E5E5E5] flex items-center justify-center shrink-0 text-[11px] font-black text-[#AFAFAF]">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1 mt-0.5">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback reveal */}
              {selectedOption !== null && (
                <div className="p-5 rounded-3xl bg-[#F7F7F7] border-2 border-b-4 border-[#E5E5E5] space-y-3">
                  <div className="flex items-center gap-2">
                    {currentProblem.options[selectedOption].isCorrect ? (
                      <span className="text-[#58CC02] font-black text-sm flex items-center gap-1.5">
                        <CheckCircle2 className="w-5 h-5 stroke-[2.5]" /> ¡Correcto!
                      </span>
                    ) : (
                      <span className="text-[#FF4B4B] font-black text-sm flex items-center gap-1.5">
                        <AlertTriangle className="w-5 h-5 stroke-[2.5]" /> ¡Ojo a la trampa!
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#4B4B4B] font-bold leading-relaxed">
                    {currentProblem.options[selectedOption].explanation}
                  </p>

                  <button
                    onClick={handleNextQuestion}
                    className="duo-btn-green w-full py-3.5 text-xs"
                  >
                    <span>{currentIdx + 1 === activeQuestions.length ? 'VER RESULTADOS' : 'CONTINUAR'}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
