import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Subject, UserProgress, SimulatorId } from '../types';
import { COURSES } from '../data/coursesData';
import { getPlayerLevel, getNextPlayerLevel } from '../data/gamificationData';
import { DailyQuestsCard } from './gamification/DailyQuestsCard';
import { SpotlightCard } from './ui/SpotlightCard';
import { AnimatedCounter } from './ui/AnimatedCounter';
import { BadgePill } from './ui/BadgePill';
import { 
  Flame, 
  Award, 
  Timer, 
  ChevronRight, 
  Cpu, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Trophy, 
  Brain, 
  Network, 
  ShieldCheck, 
  Terminal, 
  Code2, 
  TrendingUp, 
  Bookmark,
  Rocket,
  BookOpenCheck,
  Smartphone
} from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface DashboardProps {
  progress: UserProgress;
  onSelectSubject: (subject: Subject) => void;
  onOpenExamTrainer: () => void;
  onOpenPomodoro: () => void;
  onOpenDuolingo: () => void;
  onOpenExamRush: () => void;
  onOpenFlashcards: () => void;
  onOpenAchievements: () => void;
  onOpenSimulators: (simId?: SimulatorId) => void;
  onClaimQuest: (questId: string) => void;
  onOpenRescuePlan: () => void;
  onOpenDeskCompanion?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  progress,
  onSelectSubject,
  onOpenExamTrainer: _onOpenExamTrainer,
  onOpenPomodoro,
  onOpenDuolingo,
  onOpenExamRush,
  onOpenFlashcards,
  onOpenAchievements,
  onOpenSimulators,
  onClaimQuest,
  onOpenRescuePlan,
  onOpenDeskCompanion
}) => {
  const [cuatrimestreFilter, setCuatrimestreFilter] = useState<'1' | '2' | 'all'>('1');
  const completedRescueDaysCount = progress.completedRescueDays?.length || 0;

  // Filtered courses based on semester
  const filteredCourses = COURSES.filter(course => {
    if (cuatrimestreFilter === '1') return course.semester.includes('1º');
    if (cuatrimestreFilter === '2') return course.semester.includes('2º');
    return true;
  });

  const getSubjectPriority = (code: string) => {
    switch (code) {
      case '1907': return { label: '🔴 Práctica Crítica (Noviembre)', variant: 'rose' as const };
      case '1910': return { label: '🔴 Kernel & Syscalls (Noviembre)', variant: 'rose' as const };
      case '1909': return { label: '🟡 Pipeline & Caché (Examen)', variant: 'amber' as const };
      case '1905': return { label: '🟡 Autómatas & Gramáticas', variant: 'amber' as const };
      case '1904': return { label: '🟢 CPU & Bash (Rápido)', variant: 'emerald' as const };
      default: return { label: '📅 2º Cuatrimestre', variant: 'slate' as const };
    }
  };

  // Total concepts and mastery
  const allConcepts = COURSES.flatMap(c => c.concepts);
  const totalConcepts = allConcepts.length;
  const greenCount = Object.values(progress.topicMastery).filter(v => v === 'green').length;
  const masteryPercentage = totalConcepts > 0 ? Math.round((greenCount / totalConcepts) * 100) : 0;

  // Days until typical exam period (Convocatoria Enero UMU)
  const today = new Date();
  const examDate = new Date('2027-01-08');
  const daysUntilExams = Math.max(0, Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  // Player level
  const currentLevel = getPlayerLevel(progress.xp);
  const nextLevel = getNextPlayerLevel(progress.xp);
  const levelProgress = nextLevel 
    ? Math.min(100, Math.round(((progress.xp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100))
    : 100;

  // Pass Probability calculation (Aprobómetro Real FIUM)
  const passProbability = Math.min(99, Math.max(15, Math.round(
    (masteryPercentage * 0.70) + 
    (Math.min(progress.studyStreakDays, 14) * 1.2) + 
    (Math.min(progress.xp, 3000) / 3000 * 13)
  )));
  const projectedGrade = Math.min(10, Math.max(1.5, ((passProbability / 100) * 8.5) + 1.5)).toFixed(1);
  const gradeBadge = Number(projectedGrade) >= 9 ? 'Sobresaliente' : Number(projectedGrade) >= 7 ? 'Notable' : Number(projectedGrade) >= 5 ? 'Aprobado' : 'En Riesgo';

  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-5 h-5" />;
      case 'Layers': return <Layers className="w-5 h-5" />;
      case 'PackageCheck': return <Code2 className="w-5 h-5" />;
      case 'Terminal': return <Terminal className="w-5 h-5" />;
      case 'Brain': return <Brain className="w-5 h-5" />;
      case 'Network': return <Network className="w-5 h-5" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
      case 'Navigation': return <TrendingUp className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Mission Control Banner with Gamification Bar */}
      <SpotlightCard 
        spotlightColor="rgba(99, 102, 241, 0.22)" 
        glowSize={650}
        className="border-indigo-500/30 bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-slate-950/90 p-6 sm:p-8"
      >
        <div className="max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <BadgePill variant="indigo" pulse icon={<Sparkles className="w-3.5 h-3.5" />}>
              PLAN MAESTRO FIUM &bull; UMU
            </BadgePill>
            <span className="text-xs text-slate-400 font-mono">Curso 2026 / 2027</span>
            <BadgePill variant="amber" icon={<span>💎</span>}>
              <AnimatedCounter value={progress.gems} suffix=" Gemas" />
            </BadgePill>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Recupera el Control Total de tu Año Académico
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Tus 9 asignaturas sintetizadas con el método Feynman, 10 simuladores visuales en tiempo real,
            modo Duolingo gamificado (FIUMingo), modo supervivencia arcade y banco oficial de problemas de convocatorias anteriores.
          </p>

          {/* Quick Action Dock */}
          <div className="flex flex-wrap gap-2.5 pt-2">
            {onOpenDeskCompanion && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  onOpenDeskCompanion();
                  soundManager.playPowerup();
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-purple-500 text-white font-black text-xs rounded-2xl shadow-lg shadow-pink-600/30 flex items-center gap-2 transition border border-white/20"
              >
                <BookOpenCheck className="w-4 h-4 fill-white/20" />
                <span>📖 Modo Entre Libros</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-mono">
                  3 min blitz
                </span>
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                onOpenRescuePlan();
                soundManager.playClick();
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs rounded-2xl shadow-lg shadow-purple-600/30 flex items-center gap-2 transition"
            >
              <Rocket className="w-4 h-4 fill-white" />
              <span>🚀 Sprint de Rescate (14 Días)</span>
              {completedRescueDaysCount > 0 && (
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-mono">
                  {completedRescueDaysCount}/14
                </span>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                onOpenDuolingo();
                soundManager.playClick();
              }}
              className="px-4 py-2.5 bg-green-500 hover:bg-green-400 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-green-500/25 border-b-4 border-green-700 active:border-b-0 active:translate-y-1 flex items-center gap-2 transition"
            >
              <span className="text-base">🦉</span> Modo FIUMingo (Duolingo)
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                onOpenExamRush();
                soundManager.playClick();
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-rose-600/30 flex items-center gap-2 transition"
            >
              <Flame className="w-4 h-4 fill-white" /> Modo Supervivencia (Arcade)
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                onOpenSimulators();
                soundManager.playClick();
              }}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition"
            >
              <Cpu className="w-4 h-4" /> 10 Simuladores Visuales
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                onOpenFlashcards();
                soundManager.playClick();
              }}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-purple-600/30 flex items-center gap-2 transition"
            >
              <Bookmark className="w-4 h-4" /> Tarjetas de Memoria Activa
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                onOpenAchievements();
                soundManager.playClick();
              }}
              className="px-4 py-2.5 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 font-bold text-xs rounded-2xl flex items-center gap-2 transition"
            >
              <Trophy className="w-4 h-4" /> Sala de Trofeos
            </motion.button>
          </div>
        </div>

        {/* Ambient subtle glow */}
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      </SpotlightCard>

      {/* Gamification Level & XP Progress Banner */}
      <SpotlightCard 
        onClick={() => {
          onOpenAchievements();
          soundManager.playClick();
        }}
        spotlightColor="rgba(245, 158, 11, 0.15)"
        className="cursor-pointer group hover:border-amber-500/50 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
            {currentLevel.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Nivel {currentLevel.level} de 10 &bull; {currentLevel.title}
              </span>
              <span className="text-[10px] bg-slate-800/90 px-2.5 py-0.5 rounded-full text-slate-300 font-mono border border-white/5">
                <AnimatedCounter value={progress.xp} suffix=" XP" />
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{currentLevel.perk}</p>
          </div>
        </div>

        <div className="sm:w-64 space-y-1.5">
          <div className="text-[11px] text-slate-400 flex justify-between font-mono">
            <span>Progreso a Nivel {currentLevel.level + 1}</span>
            <span className="text-amber-400 font-bold">{levelProgress}%</span>
          </div>
          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800 relative">
            <div
              className="bg-gradient-to-r from-indigo-500 via-amber-400 to-yellow-300 h-full rounded-full transition-all duration-700 animate-shimmer"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
          {nextLevel && (
            <span className="text-[10px] text-slate-500 block text-right font-mono">
              Faltan <AnimatedCounter value={Math.max(0, nextLevel.minXp - progress.xp)} suffix=" XP" /> para subir
            </span>
          )}
        </div>
      </SpotlightCard>

      {/* Metric Cards Grid with Spotlight */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Countdown */}
        <SpotlightCard spotlightColor="rgba(99, 102, 241, 0.12)" className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>DÍAS EXAMEN</span>
            <Calendar className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            <AnimatedCounter value={daysUntilExams} />
          </div>
          <div className="text-[11px] text-slate-500 mt-1 truncate">Enero 2027 UMU</div>
        </SpotlightCard>

        {/* Mastery Progress */}
        <SpotlightCard spotlightColor="rgba(16, 185, 129, 0.12)" className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>DOMINIO TEMAS</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
            <AnimatedCounter value={masteryPercentage} suffix="%" />
          </div>
          <div className="text-[11px] text-slate-500 mt-1 truncate">
            <span className="font-semibold text-emerald-400">{greenCount}</span> de {totalConcepts} verdes
          </div>
        </SpotlightCard>

        {/* Pass Probability Gauge (Aprobómetro FIUM) */}
        <SpotlightCard spotlightColor="rgba(6, 182, 212, 0.16)" className="p-4 sm:p-5 border-cyan-500/30 bg-slate-900/80">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span className="text-cyan-300 font-bold">APROBÓMETRO</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">
            <AnimatedCounter value={passProbability} suffix="%" />
          </div>
          <div className="text-[11px] text-cyan-200 mt-1 truncate font-medium">
            Nota: <strong className="text-white">{projectedGrade}</strong> ({gradeBadge})
          </div>
        </SpotlightCard>

        {/* Study Streak */}
        <SpotlightCard spotlightColor="rgba(244, 63, 94, 0.12)" className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>RACHA DIARIA</span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">
            <AnimatedCounter value={progress.studyStreakDays} suffix=" d" />
          </div>
          <div className="text-[11px] text-slate-500 mt-1 truncate">¡Constancia activa!</div>
        </SpotlightCard>

        {/* Focus Hours */}
        <SpotlightCard 
          spotlightColor="rgba(245, 158, 11, 0.12)" 
          onClick={onOpenPomodoro}
          className="p-4 sm:p-5 cursor-pointer hover:border-amber-500/40 col-span-2 md:col-span-1"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>TIEMPO FOCO</span>
            <Timer className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
            <AnimatedCounter value={progress.totalStudyMinutes} suffix=" m" />
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Pomodoro 25/5 &rarr;</div>
        </SpotlightCard>
      </div>

      {/* Rescue Sprint Hero Banner */}
      <SpotlightCard
        onClick={() => {
          onOpenRescuePlan();
          soundManager.playClick();
        }}
        spotlightColor="rgba(168, 85, 247, 0.22)"
        className="cursor-pointer group hover:border-purple-500/50 p-6 bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900 border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl"
      >
        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl text-white shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform shrink-0">
            <Rocket className="w-7 h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Ponte al Día &bull; Sprint 14 Días
              </span>
              <span className="text-xs text-amber-400 font-bold font-mono">
                {completedRescueDaysCount} / 14 días completados ({Math.round((completedRescueDaysCount / 14) * 100)}%)
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white mt-1 group-hover:text-purple-300 transition-colors">
              ¿Vas con retraso? Abre el Protocolo de Rescate Diario
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              1 sesión atómica al día (40-50 min) enfocada en las 5 asignaturas de tu primer cuatrimestre y las entregas críticas de noviembre (TDS y ASO).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
          <button className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-purple-600/30 flex items-center gap-2 transition">
            ABRIR SPRINT DE RESCATE &rarr;
          </button>
        </div>
      </SpotlightCard>

      {/* Featured Desk Companion Banner: Modo Estudio Entre Libros */}
      {onOpenDeskCompanion && (
        <SpotlightCard
          onClick={() => {
            onOpenDeskCompanion();
            soundManager.playPowerup();
          }}
          spotlightColor="rgba(236, 72, 153, 0.22)"
          className="cursor-pointer group hover:border-pink-500/50 p-6 bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-slate-900 border-pink-500/30 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl"
        >
          <div className="flex items-start gap-4">
            <div className="p-3.5 bg-gradient-to-tr from-pink-600 to-purple-600 rounded-2xl text-white shadow-lg shadow-pink-500/30 group-hover:scale-105 transition-transform shrink-0">
              <Smartphone className="w-7 h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  Estudio en Móvil &bull; Dos Libros a la Vez
                </span>
                <span className="text-xs text-amber-400 font-bold font-mono">
                  🔥 Combo x3 &bull; Retención Activa Inmediata
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white mt-1 group-hover:text-pink-300 transition-colors">
                ¿Estudiando con dos libros abiertos? Activa el Asalto Exprés
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Pon a prueba lo que acabas de leer sin soltar los apuntes: 5 preguntas tramposas con vibración táctil y la regla formal exacta de la asignatura.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
            <button className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-pink-600/30 flex items-center gap-2 transition">
              ACTIVAR RETO MÓVIL &rarr;
            </button>
          </div>
        </SpotlightCard>
      )}

      {/* Daily Quests Card */}
      <DailyQuestsCard
        quests={progress.dailyQuests || []}
        onClaimQuest={onClaimQuest}
        onOpenExamRush={onOpenExamRush}
        onOpenFlashcards={onOpenFlashcards}
        onOpenDuolingo={onOpenDuolingo}
      />

      {/* Asignaturas Grid with Spotlight Cards */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Tus Asignaturas (Semáforo de Prioridad FIUM)</span>
              <span className="text-xs font-normal text-slate-400 font-mono">[{filteredCourses.length} de {COURSES.length}]</span>
            </h2>
            <p className="text-xs text-slate-400">
              {cuatrimestreFilter === '1'
                ? 'Mostrando solo las 5 asignaturas de examen en Enero 2027 (Prioridad inmediata).'
                : cuatrimestreFilter === '2'
                ? 'Mostrando asignaturas de 2º cuatrimestre (Comienzan en Febrero 2027).'
                : 'Mostrando las 9 asignaturas completas del curso.'}
            </p>
          </div>

          {/* Cuatrimestre Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => { setCuatrimestreFilter('1'); soundManager.playClick(); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                cuatrimestreFilter === '1'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🔥 1º Cuatrimestre (Enero)</span>
              <span className="text-[10px] bg-indigo-500/20 px-1.5 py-0.5 rounded font-mono">5</span>
            </button>
            <button
              onClick={() => { setCuatrimestreFilter('2'); soundManager.playClick(); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                cuatrimestreFilter === '2'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🌿 2º Cuatrimestre</span>
              <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded font-mono">4</span>
            </button>
            <button
              onClick={() => { setCuatrimestreFilter('all'); soundManager.playClick(); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                cuatrimestreFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todas (9)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map(course => {
            const courseConcepts = course.concepts;
            const cGreen = courseConcepts.filter(c => progress.topicMastery[c.id] === 'green').length;
            const priorityInfo = getSubjectPriority(course.code);

            return (
              <SpotlightCard
                key={course.id}
                onClick={() => {
                  onSelectSubject(course);
                  soundManager.playClick();
                }}
                spotlightColor="rgba(99, 102, 241, 0.16)"
                className="group cursor-pointer hover:border-indigo-500/60 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-2xl bg-gradient-to-br ${course.color} text-white shadow-md shadow-black/40 group-hover:scale-105 transition-transform`}>
                        {getSubjectIcon(course.icon)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                            {course.code} &bull; {course.shortName}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 mt-0.5">
                          {course.name}
                        </h3>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-transform group-hover:translate-x-1 shrink-0" />
                  </div>

                  <div className="mt-2.5">
                    <BadgePill variant={priorityInfo.variant}>
                      {priorityInfo.label}
                    </BadgePill>
                  </div>

                  <p className="text-xs text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
                    {course.tagline}
                  </p>
                </div>

                {/* Progress Mini Bar & Stats */}
                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {cGreen} listos
                    </span>
                    <span className="text-slate-600">&bull;</span>
                    <span className="flex items-center gap-1 text-rose-400 font-semibold text-[11px]">
                      <AlertCircle className="w-3.5 h-3.5" /> {courseConcepts.length - cGreen} pend.
                    </span>
                  </div>

                  <span className="font-bold text-indigo-400 group-hover:text-indigo-300 group-hover:underline flex items-center gap-1 text-[11px]">
                    Estudiar &rarr;
                  </span>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </div>
    </div>
  );
};
