import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Heart, 
  Clock, 
  Zap, 
  RotateCcw, 
  Trophy,
  Play,
  X
} from 'lucide-react';
import { EXAM_PROBLEMS } from '../../data/examQuestions';
import { ExamProblem } from '../../types';
import { soundManager } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

interface ExamRushModalProps {
  highScore: number;
  onUpdateHighScore: (score: number) => void;
  onAddXp: (amount: number) => void;
  onClose: () => void;
}

export const ExamRushModal: React.FC<ExamRushModalProps> = ({
  highScore,
  onUpdateHighScore,
  onAddXp,
  onClose
}) => {
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'gameover'>('lobby');
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [lives, setLives] = useState<number>(3);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [shuffledQuestions, setShuffledQuestions] = useState<ExamProblem[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const startGame = () => {
    // Shuffle all exam problems
    const shuffled = [...EXAM_PROBLEMS].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setScore(0);
    setStreak(0);
    setMultiplier(1);
    setLives(3);
    setTimeLeft(60);
    setFeedback(null);
    setGameState('playing');
    soundManager.playPowerup();
  };

  // Timer loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    if (timeLeft <= 0 || lives <= 0) {
      setGameState('gameover');
      if (score > highScore) {
        onUpdateHighScore(score);
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        soundManager.playFanfare();
      } else {
        soundManager.playIncorrect();
      }
      onAddXp(score);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft, lives, score, highScore, onUpdateHighScore, onAddXp]);

  const currentQ = shuffledQuestions[currentQuestionIndex] || EXAM_PROBLEMS[0];

  const handleSelectAnswer = (isCorrect: boolean) => {
    if (feedback !== null) return; // Prevent double taps

    if (isCorrect) {
      soundManager.playCorrect();
      setFeedback('correct');
      const newStreak = streak + 1;
      setStreak(newStreak);

      const newMult = Math.min(4, Math.floor(newStreak / 2) + 1);
      setMultiplier(newMult);

      const addedPoints = 50 * newMult;
      setScore(prev => prev + addedPoints);
      setTimeLeft(prev => Math.min(90, prev + 5)); // Bonus +5s!

      if (newMult > multiplier) {
        soundManager.playPowerup();
      }
    } else {
      soundManager.playIncorrect();
      setFeedback('wrong');
      setStreak(0);
      setMultiplier(1);
      setLives(prev => prev - 1);
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentQuestionIndex + 1 < shuffledQuestions.length) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // Re-shuffle if we ran out
        setShuffledQuestions([...EXAM_PROBLEMS].sort(() => Math.random() - 0.5));
        setCurrentQuestionIndex(0);
      }
    }, 700);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 transition-colors duration-500 ${
      gameState === 'playing' && timeLeft <= 10
        ? 'bg-rose-950/70 backdrop-blur-xl shadow-[inset_0_0_120px_rgba(244,63,94,0.3)]'
        : 'bg-slate-950/85 backdrop-blur-xl'
    }`}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 450, damping: 30 }}
        className="bg-slate-900 border-t sm:border border-white/15 w-full max-w-2xl rounded-t-3xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden max-h-[92vh] sm:max-h-none overflow-y-auto"
      >
        {/* Mobile Drag Handle */}
        <div className="pt-1 pb-2 flex justify-center sm:hidden">
          <div className="w-12 h-1.5 rounded-full bg-slate-700/80" />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition z-20"
          title="Salir"
          aria-label="Cerrar modal de supervivencia"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Lobby State */}
        {gameState === 'lobby' && (
          <div className="text-center space-y-6 py-6">
            <div className="w-20 h-20 bg-gradient-to-tr from-rose-600 via-orange-500 to-amber-500 rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-rose-600/30 ring-4 ring-rose-500/20 animate-bounce">
              <Flame className="w-10 h-10 text-white" />
            </div>

            <div>
              <span className="px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full text-xs font-black tracking-wider uppercase">
                Arcade de Exámenes FIUM
              </span>
              <h2 className="text-3xl font-black text-white mt-2">
                Modo Supervivencia Convocatoria
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
                60 segundos. 3 vidas. Preguntas aleatorias de todas tus 9 asignaturas. 
                Cada acierto suma <strong>+5s de tiempo</strong> y acumula multiplicador de combo. ¿Cuánto resistirás?
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 max-w-xs mx-auto flex items-center justify-between font-mono">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-bold">
                <Trophy className="w-4 h-4" /> Récord Histórico:
              </div>
              <div className="text-xl font-black text-white">{highScore} pts</div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={startGame}
                className="px-8 py-3.5 bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-rose-600/30 flex items-center gap-2 transition hover:scale-105"
              >
                <Play className="w-5 h-5 fill-white" /> ¡Iniciar Supervivencia!
              </button>
              <button
                onClick={onClose}
                className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-2xl transition"
              >
                Volver
              </button>
            </div>
          </div>
        )}

        {/* Playing State */}
        {gameState === 'playing' && currentQ && (
          <div className="space-y-6">
            {/* Top HUD */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              {/* Lives */}
              <div className="flex items-center gap-1.5">
                {[1, 2, 3].map(i => (
                  <Heart
                    key={i}
                    className={`w-6 h-6 transition ${
                      i <= lives ? 'fill-rose-500 text-rose-500' : 'text-slate-700'
                    }`}
                  />
                ))}
              </div>

              {/* Timer Bar */}
              <div className="flex items-center gap-2">
                <Clock className={`w-5 h-5 ${timeLeft <= 10 ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`} />
                <span className={`text-2xl font-black font-mono ${timeLeft <= 10 ? 'text-rose-400' : 'text-white'}`}>
                  {timeLeft}s
                </span>
              </div>

              {/* Score & Combo */}
              <div className="text-right">
                <div className="text-lg font-black text-white font-mono">{score} pts</div>
                <div className="flex items-center justify-end gap-1 text-[11px] font-bold text-amber-400">
                  <Zap className="w-3.5 h-3.5" /> Combo x{multiplier}
                </div>
              </div>
            </div>

            {/* Question Card with Spring Shake */}
            <div className={`p-5 rounded-2xl border transition-all ${
              feedback === 'correct'
                ? 'bg-emerald-950/40 border-emerald-500/80 shadow-lg shadow-emerald-500/20'
                : feedback === 'wrong'
                ? 'bg-rose-950/40 border-rose-500/80 shadow-lg shadow-rose-500/20 animate-shake'
                : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="flex items-center justify-between text-xs font-mono font-bold mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-indigo-300 uppercase">
                  {currentQ.subjectId.toUpperCase()} &bull; {currentQ.courseYear}
                </span>
                <span className="text-slate-500">+{50 * multiplier} XP</span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                {currentQ.question}
              </h3>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-2.5">
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(opt.isCorrect)}
                  disabled={feedback !== null}
                  className={`p-4 rounded-2xl text-left border text-xs sm:text-sm font-medium transition-all ${
                    feedback === null
                      ? 'bg-slate-950/70 hover:bg-slate-800 border-slate-800 hover:border-indigo-500 text-slate-200 hover:translate-x-1'
                      : opt.isCorrect
                      ? 'bg-emerald-600/30 border-emerald-500 text-white font-bold'
                      : 'bg-slate-950/40 border-slate-800/40 text-slate-600'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Game Over State */}
        {gameState === 'gameover' && (
          <div className="text-center space-y-6 py-6 animate-fadeIn">
            <div className="w-20 h-20 bg-slate-950 border border-slate-800 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-xl">
              {score > highScore ? '👑' : score > 300 ? '🎉' : '💀'}
            </div>

            <div>
              <h2 className="text-3xl font-black text-white">
                {score > highScore ? '¡Nuevo Récord Histórico!' : 'Fin de la Convocatoria'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {lives <= 0 ? 'Te quedaste sin vidas.' : 'Se agotó el tiempo.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Puntuación Final</div>
                <div className="text-3xl font-black text-rose-400 font-mono mt-1">{score}</div>
                <div className="text-[10px] text-slate-500 font-mono">+{score} XP ganados</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Récord Guardado</div>
                <div className="text-3xl font-black text-amber-400 font-mono mt-1">
                  {Math.max(score, highScore)}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">Puntuación máxima</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={startGame}
                className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/30 flex items-center gap-2 transition"
              >
                <RotateCcw className="w-4 h-4" /> Intentar Otra Vez
              </button>
              <button
                onClick={onClose}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
