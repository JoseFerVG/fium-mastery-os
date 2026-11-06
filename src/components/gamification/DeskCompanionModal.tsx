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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-xl"
    >
      <motion.div
        initial={{ y: '100%', opacity: 0.5 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className="w-full sm:max-w-2xl bg-slate-900 border-t sm:border border-white/15 sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[85vh] overflow-hidden"
      >
        {/* Mobile Drag / Sheet Handle */}
        <div className="pt-3 pb-1 flex justify-center sm:hidden">
          <div className="w-12 h-1.5 rounded-full bg-slate-700/80" />
        </div>

        {/* Modal Top Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-slate-950/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-white text-base tracking-tight">
                  Modo Móvil Entre Libros
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  3 MIN BLITZ
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pon a prueba tu retención activa mientras tienes 2 libros abiertos en la mesa
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            aria-label="Cerrar modal"
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {!drillActive ? (
            /* Setup View: Select 2 Active Books */
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div className="text-xs text-indigo-200 leading-relaxed">
                  <strong>¿Cómo funciona?</strong> Coloca el móvil junto a tus apuntes o libros. Selecciona las 2 asignaturas que estás estudiando hoy. La app te lanzará 5 preguntas clave de examen contrastando las <em>trampas del profesor</em> con lo que acabas de leer.
                </div>
              </div>

              {/* Book Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Book 1 */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase font-mono">
                    <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                    Libro / Asignatura 1:
                  </label>
                  <select
                    value={selectedBook1}
                    onChange={(e) => setSelectedBook1(e.target.value as SubjectId)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-3 text-sm font-bold text-white focus:outline-none focus:border-purple-500"
                  >
                    {COURSES.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                  {book1Course && (
                    <div className="text-[11px] text-slate-400 px-1 font-mono">
                      Temas: {book1Course.concepts.map(c => c.subtitle).join(', ')}
                    </div>
                  )}
                </div>

                {/* Book 2 */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase font-mono">
                    <BookOpen className="w-3.5 h-3.5 text-pink-400" />
                    Libro / Asignatura 2:
                  </label>
                  <select
                    value={selectedBook2}
                    onChange={(e) => setSelectedBook2(e.target.value as SubjectId)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-3 text-sm font-bold text-white focus:outline-none focus:border-pink-500"
                  >
                    {COURSES.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                  {book2Course && (
                    <div className="text-[11px] text-slate-400 px-1 font-mono">
                      Temas: {book2Course.concepts.map(c => c.subtitle).join(', ')}
                    </div>
                  )}
                </div>
              </div>

              {/* Real Fruits Forecast */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    Frutos Reales de esta Sesión:
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">+0.4 Nota Proyectada</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">XP POSIBLE</span>
                    <strong className="text-amber-400 text-sm">Hasta 450 XP</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">RECOMPENSA</span>
                    <strong className="text-cyan-400 text-sm">+15 Gemas</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">COMBO RACHA</span>
                    <strong className="text-rose-400 text-sm">x3 Multiplicador</strong>
                  </div>
                </div>
              </div>

              {/* Start Button */}
              <button
                onClick={handleStartDrill}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm tracking-wide shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition active:scale-98"
              >
                <Zap className="w-5 h-5 fill-white" />
                <span>INICIAR RETO ENTRE LIBROS (5 PREGUNTAS)</span>
              </button>
            </div>
          ) : drillFinished ? (
            /* Results Screen */
            <div className="text-center py-6 space-y-6">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/25">
                🏆
              </div>

              <div>
                <h4 className="text-2xl font-black text-white">¡Reto Completado con Éxito!</h4>
                <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                  Has fijado en tu memoria de largo plazo las preguntas más tramposas de tus dos libros.
                </p>
              </div>

              {/* Fruits Earned Card */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 max-w-sm mx-auto space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase font-mono tracking-wider">
                  Frutos Cosechados
                </div>
                <div className="flex justify-around items-center font-mono">
                  <div>
                    <span className="text-2xl font-black text-amber-400">+{score}</span>
                    <span className="text-[10px] text-slate-400 block font-sans">XP Total</span>
                  </div>
                  <div className="h-8 w-px bg-slate-800" />
                  <div>
                    <span className="text-2xl font-black text-cyan-400">+15</span>
                    <span className="text-[10px] text-slate-400 block font-sans">Gemas</span>
                  </div>
                  <div className="h-8 w-px bg-slate-800" />
                  <div>
                    <span className="text-2xl font-black text-emerald-400">92%</span>
                    <span className="text-[10px] text-slate-400 block font-sans">Retención</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
                <button
                  onClick={handleStartDrill}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" /> Otra Ronda
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md shadow-purple-600/30"
                >
                  <CheckCircle2 className="w-4 h-4" /> Volver a los Libros
                </button>
              </div>
            </div>
          ) : (
            /* Active Drill Question View */
            <div className="space-y-4">
              {/* Question Header & Combo Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-xl bg-purple-500/20 text-purple-300 font-mono text-xs font-bold border border-purple-500/30">
                    Pregunta {currentIdx + 1} de {activeQuestions.length}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase font-mono">
                    {currentProblem.subjectId.toUpperCase()}
                  </span>
                </div>

                {/* Combo Multiplier */}
                {comboStreak > 1 && (
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono text-xs font-black"
                  >
                    <Flame className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
                    <span>COMBO x{getComboMultiplier(comboStreak)}</span>
                  </motion.div>
                )}
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / activeQuestions.length) * 100}%` }}
                />
              </div>

              {/* Question Box */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 space-y-2">
                <div className="text-[10px] font-mono text-indigo-400 font-bold uppercase">
                  {currentProblem.courseYear}
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white leading-relaxed">
                  {currentProblem.question}
                </h4>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentProblem.options.map((opt, optIdx) => {
                  const isSelected = selectedOption === optIdx;
                  const isSubmitted = selectedOption !== null;
                  const isCorrect = opt.isCorrect;

                  let optionStyle = 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 text-slate-200';
                  if (isSubmitted) {
                    if (isCorrect) {
                      optionStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-bold';
                    } else if (isSelected) {
                      optionStyle = 'bg-rose-950/40 border-rose-500 text-rose-200 font-bold';
                    } else {
                      optionStyle = 'bg-slate-950/50 border-slate-900 text-slate-500 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-3.5 rounded-2xl border text-xs leading-relaxed flex items-start gap-3 transition-all active:scale-98 ${optionStyle}`}
                    >
                      <span className="w-6 h-6 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 font-mono text-[11px] font-bold">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1 mt-0.5">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback & Exam Trap reveal */}
              {selectedOption !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-slate-950 border border-white/15 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    {currentProblem.options[selectedOption].isCorrect ? (
                      <span className="text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> ¡Excelente! Has identificado la respuesta exacta
                      </span>
                    ) : (
                      <span className="text-rose-400 font-bold text-xs flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" /> Has caído en una trampa común del examen
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentProblem.options[selectedOption].explanation}
                  </p>

                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed font-sans">
                    <strong className="text-amber-400">💡 Consejo para tu libro:</strong> {currentProblem.examTip}
                  </div>

                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition active:scale-98"
                  >
                    <span>{currentIdx + 1 === activeQuestions.length ? 'VER RESULTADOS' : 'SIGUIENTE PREGUNTA'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
