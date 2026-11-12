import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Flame, 
  Heart, 
  Clock, 
  Zap, 
  Trophy, 
  Play, 
  RotateCcw, 
  X
} from 'lucide-react';
import { EXAM_PROBLEMS } from '../../data/examQuestions';
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
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [streak, setStreak] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [shuffledQuestions, setShuffledQuestions] = useState([...EXAM_PROBLEMS]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const startGame = () => {
    const shuffled = [...EXAM_PROBLEMS].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setScore(0);
    setLives(3);
    setStreak(0);
    setMultiplier(1);
    setTimeLeft(60);
    setFeedback(null);
    setGameState('playing');
    soundManager.playPowerup();
  };

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
    if (feedback !== null) return;

    if (isCorrect) {
      soundManager.playCorrect();
      setFeedback('correct');
      const newStreak = streak + 1;
      setStreak(newStreak);

      const newMult = Math.min(4, Math.floor(newStreak / 2) + 1);
      setMultiplier(newMult);

      const addedPoints = 50 * newMult;
      setScore(prev => prev + addedPoints);
      setTimeLeft(prev => Math.min(90, prev + 5));

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
        setShuffledQuestions([...EXAM_PROBLEMS].sort(() => Math.random() - 0.5));
        setCurrentQuestionIndex(0);
      }
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm select-none font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 450, damping: 30 }}
        className="bg-white border-2 border-b-[6px] border-[#E5E5E5] w-full max-w-2xl rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 relative overflow-hidden max-h-[92vh] sm:max-h-none overflow-y-auto"
      >
        {/* Mobile Drag Handle */}
        <div className="pt-1 pb-2 flex justify-center sm:hidden">
          <div className="w-12 h-1.5 rounded-full bg-[#E5E5E5]" />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#AFAFAF] hover:text-[#4B4B4B] p-2 rounded-xl transition cursor-pointer z-20"
          title="Salir"
          aria-label="Cerrar modal de supervivencia"
        >
          <X className="w-6 h-6 stroke-[3]" />
        </button>

        {/* Lobby State */}
        {gameState === 'lobby' && (
          <div className="text-center space-y-6 py-6">
            <div className="w-20 h-20 bg-[#FFF0F0] border-2 border-b-4 border-[#FF4B4B] rounded-3xl mx-auto flex items-center justify-center">
              <Flame className="w-10 h-10 fill-[#FF4B4B] text-[#FF4B4B]" />
            </div>

            <div>
              <span className="px-3 py-1 bg-[#FFF0F0] text-[#FF4B4B] border border-[#FFD0D0] rounded-full text-xs font-black tracking-wider uppercase">
                Arcade de Exámenes FIUM
              </span>
              <h2 className="text-3xl font-black text-[#4B4B4B] mt-2">
                Modo Supervivencia
              </h2>
              <p className="text-xs sm:text-sm text-[#777777] font-bold max-w-md mx-auto mt-2 leading-relaxed">
                60 segundos. 3 vidas. Preguntas aleatorias de tus 9 asignaturas. 
                Cada acierto suma <strong>+5s de tiempo</strong> y acumula multiplicador de combo. ¿Cuánto resistirás?
              </p>
            </div>

            <div className="bg-[#F7F7F7] p-4 rounded-2xl border-2 border-[#E5E5E5] max-w-xs mx-auto flex items-center justify-between font-black">
              <div className="flex items-center gap-2 text-xs text-[#FF9600]">
                <Trophy className="w-4 h-4" /> Récord Histórico:
              </div>
              <div className="text-xl font-black text-[#4B4B4B]">{highScore} pts</div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={startGame}
                className="duo-btn-red px-8 py-4 text-sm"
              >
                <Play className="w-5 h-5 fill-white mr-1.5" /> ¡Iniciar Supervivencia!
              </button>
              <button
                onClick={onClose}
                className="duo-btn-white px-5 py-4 text-xs"
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
            <div className="flex items-center justify-between border-b-2 border-[#E5E5E5] pb-4">
              {/* Lives */}
              <div className="flex items-center gap-1.5">
                {[1, 2, 3].map(i => (
                  <Heart
                    key={i}
                    className={`w-6 h-6 transition ${
                      i <= lives ? 'fill-[#FF4B4B] text-[#FF4B4B]' : 'text-[#E5E5E5]'
                    }`}
                  />
                ))}
              </div>

              {/* Timer Bar */}
              <div className="flex items-center gap-2">
                <Clock className={`w-5 h-5 ${timeLeft <= 10 ? 'text-[#FF4B4B] animate-pulse' : 'text-[#777777]'}`} />
                <span className={`text-2xl font-black ${timeLeft <= 10 ? 'text-[#FF4B4B]' : 'text-[#4B4B4B]'}`}>
                  {timeLeft}s
                </span>
              </div>

              {/* Score & Combo */}
              <div className="text-right">
                <div className="text-lg font-black text-[#4B4B4B]">{score} pts</div>
                <div className="flex items-center justify-end gap-1 text-[11px] font-black text-[#FF9600]">
                  <Zap className="w-3.5 h-3.5 fill-[#FF9600]" /> Combo x{multiplier}
                </div>
              </div>
            </div>

            {/* Question Card */}
            <div className={`p-5 rounded-3xl border-2 border-b-4 transition-all ${
              feedback === 'correct'
                ? 'bg-[#D7FFB8] border-[#58CC02] text-[#58A700]'
                : feedback === 'wrong'
                ? 'bg-[#FFDFE0] border-[#FF4B4B] text-[#EA2B2B] animate-shake'
                : 'bg-[#F7F7F7] border-[#E5E5E5] text-[#4B4B4B]'
            }`}>
              <div className="flex items-center justify-between text-xs font-black mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-white text-[#1CB0F6] uppercase border border-[#84D8FF]">
                  {currentQ.subjectId.toUpperCase()} • {currentQ.courseYear}
                </span>
                <span className="text-[#FF9600]">+{50 * multiplier} XP</span>
              </div>

              <h3 className="text-sm sm:text-base font-black leading-snug">
                {currentQ.question}
              </h3>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-3">
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(opt.isCorrect)}
                  disabled={feedback !== null}
                  className={`p-4 rounded-2xl text-left border-2 border-b-4 text-xs sm:text-sm font-black transition-all cursor-pointer ${
                    feedback === null
                      ? 'bg-white hover:bg-[#F7F7F7] border-[#E5E5E5] text-[#4B4B4B]'
                      : opt.isCorrect
                      ? 'bg-[#D7FFB8] border-[#58CC02] text-[#58A700]'
                      : 'bg-[#F7F7F7] border-[#E5E5E5] text-[#AFAFAF] opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-[#F7F7F7] border border-[#E5E5E5] text-[#777777] flex items-center justify-center text-xs font-black shrink-0">
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
            <div className="w-20 h-20 bg-[#FFF4D0] border-2 border-b-4 border-[#FFC800] rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-sm">
              {score > highScore ? '👑' : score > 300 ? '🎉' : '💀'}
            </div>

            <div>
              <h2 className="text-3xl font-black text-[#4B4B4B]">
                {score > highScore ? '¡Nuevo Récord Histórico!' : 'Fin de la Convocatoria'}
              </h2>
              <p className="text-xs sm:text-sm text-[#777777] font-bold mt-1">
                {lives <= 0 ? 'Te has quedado sin vidas.' : 'Se agotó el tiempo.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <div className="bg-[#FFF0F0] p-4 rounded-2xl border-2 border-b-4 border-[#FF4B4B]">
                <div className="text-[10px] uppercase font-black text-[#FF4B4B]">Puntuación Final</div>
                <div className="text-3xl font-black text-[#EA2B2B] mt-1">{score}</div>
                <div className="text-[10px] text-[#EA2B2B]/80 font-bold">+{score} XP ganados</div>
              </div>

              <div className="bg-[#FFF4D0] p-4 rounded-2xl border-2 border-b-4 border-[#FFC800]">
                <div className="text-[10px] uppercase font-black text-[#E5A500]">Récord Guardado</div>
                <div className="text-3xl font-black text-[#4B4B4B] mt-1">
                  {Math.max(score, highScore)}
                </div>
                <div className="text-[10px] text-[#AFAFAF] font-bold">Puntuación máxima</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={startGame}
                className="duo-btn-red px-6 py-3.5 text-xs"
              >
                <RotateCcw className="w-4 h-4 mr-1.5" /> Intentar Otra Vez
              </button>
              <button
                onClick={onClose}
                className="duo-btn-white px-5 py-3.5 text-xs"
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
