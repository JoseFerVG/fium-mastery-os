import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Subject, UserProgress, SimulatorId } from '../types';
import { COURSES } from '../data/coursesData';
import { getPlayerLevel, getNextPlayerLevel } from '../data/gamificationData';
import { DailyQuestsCard } from './gamification/DailyQuestsCard';
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
    <div className="space-y-8 animate-fadeIn font-sans">
      {/* Duolingo Hero Mission Control Banner */}
      <div className="duo-card p-6 sm:p-8 bg-gradient-to-r from-[#58CC02] to-[#46A302] text-white border-2 border-b-[6px] border-[#3B8802] relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-sm">
              🦉 FIUMingo • Informática UMU
            </span>
            <span className="text-xs text-white/90 font-bold">Curso 2026 / 2027</span>
            <span className="bg-white/25 px-3 py-1 rounded-full text-xs font-black text-white">
              💎 <AnimatedCounter value={progress.gems} suffix=" Gemas" />
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Domina tus Asignaturas FIUM al Estilo Duolingo
          </h1>
          <p className="text-xs sm:text-sm text-white/90 font-bold leading-relaxed max-w-2xl">
            Tus 9 asignaturas sintetizadas paso a paso, 10 simuladores visuales en tiempo real,
            la ruta serpentina gamificada, racha diaria y banco oficial de convocatorias de examen.
          </p>

          {/* Quick Action Dock */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => {
                onOpenDuolingo();
                soundManager.playClick();
              }}
              className="duo-btn-white px-5 py-3 text-xs text-[#58CC02]"
            >
              <span className="text-base mr-1.5">🦉</span> RUTA DE APRENDIZAJE
            </button>

            {onOpenDeskCompanion && (
              <button
                onClick={() => {
                  onOpenDeskCompanion();
                  soundManager.playPowerup();
                }}
                className="duo-btn-red px-5 py-3 text-xs"
              >
                <BookOpenCheck className="w-4 h-4 mr-1.5" />
                <span>MODO ENTRE LIBROS (3 MIN)</span>
              </button>
            )}

            <button
              onClick={() => {
                onOpenRescuePlan();
                soundManager.playClick();
              }}
              className="duo-btn-purple px-5 py-3 text-xs"
            >
              <Rocket className="w-4 h-4 mr-1.5" />
              <span>SPRINT DE RESCATE ({completedRescueDaysCount}/14)</span>
            </button>

            <button
              onClick={() => {
                onOpenSimulators();
                soundManager.playClick();
              }}
              className="duo-btn-blue px-5 py-3 text-xs"
            >
              <Cpu className="w-4 h-4 mr-1.5" /> 10 SIMULADORES
            </button>
          </div>
        </div>

        {/* Mascot decoration */}
        <div className="hidden md:block absolute right-6 bottom-4 text-8xl opacity-90 pointer-events-none transform hover:scale-105 transition">
          🦉
        </div>
      </div>

      {/* Gamification Level & XP Progress Banner */}
      <div 
        onClick={() => {
          onOpenAchievements();
          soundManager.playClick();
        }}
        className="duo-card-interactive p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FFF4D0] border-2 border-b-4 border-[#FFC800] flex items-center justify-center text-3xl">
            {currentLevel.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-[#FF9600] uppercase tracking-wider">
                Nivel {currentLevel.level} de 10 • {currentLevel.title}
              </span>
              <span className="text-[11px] bg-[#F7F7F7] px-2.5 py-0.5 rounded-full text-[#4B4B4B] font-black border border-[#E5E5E5]">
                <AnimatedCounter value={progress.xp} suffix=" XP" />
              </span>
            </div>
            <p className="text-xs text-[#777777] font-bold mt-0.5">{currentLevel.perk}</p>
          </div>
        </div>

        <div className="sm:w-64 space-y-2">
          <div className="text-xs text-[#777777] flex justify-between font-black">
            <span>Progreso a Nivel {currentLevel.level + 1}</span>
            <span className="text-[#FF9600]">{levelProgress}%</span>
          </div>
          <div className="w-full bg-[#E5E5E5] h-3.5 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-[#FFC800] h-full rounded-full transition-all duration-700"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
          {nextLevel && (
            <span className="text-[11px] text-[#AFAFAF] block text-right font-bold">
              Faltan <AnimatedCounter value={Math.max(0, nextLevel.minXp - progress.xp)} suffix=" XP" /> para subir
            </span>
          )}
        </div>
      </div>

      {/* Metric Cards Grid in Duolingo Card Style */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Countdown */}
        <div className="duo-card p-5">
          <div className="flex items-center justify-between text-[#777777] text-xs font-black mb-2 uppercase tracking-wider">
            <span>DÍAS EXAMEN</span>
            <Calendar className="w-4 h-4 text-[#1CB0F6]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#4B4B4B]">
            <AnimatedCounter value={daysUntilExams} />
          </div>
          <div className="text-[11px] text-[#AFAFAF] font-bold mt-1 truncate">Enero 2027 UMU</div>
        </div>

        {/* Mastery Progress */}
        <div className="duo-card p-5">
          <div className="flex items-center justify-between text-[#777777] text-xs font-black mb-2 uppercase tracking-wider">
            <span>DOMINIO</span>
            <Award className="w-4 h-4 text-[#58CC02]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#58CC02]">
            <AnimatedCounter value={masteryPercentage} suffix="%" />
          </div>
          <div className="text-[11px] text-[#777777] font-bold mt-1 truncate">
            <span className="text-[#58CC02]">{greenCount}</span> de {totalConcepts} verdes
          </div>
        </div>

        {/* Pass Probability Gauge */}
        <div className="duo-card p-5 border-[#84D8FF] bg-[#F7FBFF]">
          <div className="flex items-center justify-between text-[#1CB0F6] text-xs font-black mb-2 uppercase tracking-wider">
            <span>APROBÓMETRO</span>
            <TrendingUp className="w-4 h-4 text-[#1CB0F6]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#1CB0F6]">
            <AnimatedCounter value={passProbability} suffix="%" />
          </div>
          <div className="text-[11px] text-[#1899D6] font-bold mt-1 truncate">
            Nota: <strong>{projectedGrade}</strong> ({gradeBadge})
          </div>
        </div>

        {/* Study Streak */}
        <div className="duo-card p-5">
          <div className="flex items-center justify-between text-[#777777] text-xs font-black mb-2 uppercase tracking-wider">
            <span>RACHA</span>
            <Flame className="w-4 h-4 text-[#FF9600] fill-[#FF9600]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#FF9600]">
            <AnimatedCounter value={progress.studyStreakDays} suffix=" d" />
          </div>
          <div className="text-[11px] text-[#777777] font-bold mt-1 truncate">¡Constancia activa!</div>
        </div>

        {/* Focus Hours */}
        <div 
          onClick={onOpenPomodoro}
          className="duo-card-interactive p-5 col-span-2 md:col-span-1"
        >
          <div className="flex items-center justify-between text-[#777777] text-xs font-black mb-2 uppercase tracking-wider">
            <span>ENFOQUE</span>
            <Timer className="w-4 h-4 text-[#CE82FF]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#CE82FF]">
            <AnimatedCounter value={progress.totalStudyMinutes} suffix=" m" />
          </div>
          <div className="text-[11px] text-[#AFAFAF] font-bold mt-1">Pomodoro 25/5 →</div>
        </div>
      </div>

      {/* Daily Quests Card */}
      <DailyQuestsCard
        quests={progress.dailyQuests || []}
        onClaimQuest={onClaimQuest}
        onOpenExamRush={onOpenExamRush}
        onOpenFlashcards={onOpenFlashcards}
        onOpenDuolingo={onOpenDuolingo}
      />

      {/* Asignaturas Grid in Duolingo Style */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-[#4B4B4B] flex items-center gap-2">
              <span>Asignaturas FIUM</span>
              <span className="text-xs font-bold text-[#AFAFAF]">[{filteredCourses.length} de {COURSES.length}]</span>
            </h2>
            <p className="text-xs text-[#777777] font-bold mt-0.5">
              {cuatrimestreFilter === '1'
                ? '5 asignaturas críticas de examen en Enero 2027.'
                : cuatrimestreFilter === '2'
                ? 'Asignaturas de 2º cuatrimestre (Comienzan en Febrero 2027).'
                : 'Las 9 asignaturas completas del grado.'}
            </p>
          </div>

          {/* Cuatrimestre Filter Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setCuatrimestreFilter('1'); soundManager.playClick(); }}
              className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border-2 border-b-4 ${
                cuatrimestreFilter === '1'
                  ? 'bg-[#E5F6FD] border-[#84D8FF] text-[#1CB0F6]'
                  : 'bg-white border-[#E5E5E5] text-[#777777] hover:bg-[#F7F7F7]'
              }`}
            >
              1º Cuatrimestre (5)
            </button>
            <button
              onClick={() => { setCuatrimestreFilter('2'); soundManager.playClick(); }}
              className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border-2 border-b-4 ${
                cuatrimestreFilter === '2'
                  ? 'bg-[#E5F6FD] border-[#84D8FF] text-[#1CB0F6]'
                  : 'bg-white border-[#E5E5E5] text-[#777777] hover:bg-[#F7F7F7]'
              }`}
            >
              2º Cuatrimestre (4)
            </button>
            <button
              onClick={() => { setCuatrimestreFilter('all'); soundManager.playClick(); }}
              className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border-2 border-b-4 ${
                cuatrimestreFilter === 'all'
                  ? 'bg-[#E5F6FD] border-[#84D8FF] text-[#1CB0F6]'
                  : 'bg-white border-[#E5E5E5] text-[#777777] hover:bg-[#F7F7F7]'
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
              <div
                key={course.id}
                onClick={() => {
                  onSelectSubject(course);
                  soundManager.playClick();
                }}
                className="duo-card-interactive p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${course.color} text-white shadow-sm`}>
                        {getSubjectIcon(course.icon)}
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-[#AFAFAF] uppercase tracking-wider">
                          {course.code} • {course.shortName}
                        </span>
                        <h3 className="text-base font-black text-[#4B4B4B] line-clamp-1 mt-0.5">
                          {course.name}
                        </h3>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#AFAFAF] shrink-0" />
                  </div>

                  <div className="mt-3">
                    <BadgePill variant={priorityInfo.variant}>
                      {priorityInfo.label}
                    </BadgePill>
                  </div>

                  <p className="text-xs text-[#777777] font-bold mt-2.5 line-clamp-2 leading-relaxed">
                    {course.tagline}
                  </p>
                </div>

                {/* Progress Mini Bar & Stats */}
                <div className="mt-5 pt-4 border-t-2 border-[#E5E5E5] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-black">
                    <span className="flex items-center gap-1 text-[#58CC02] text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" /> {cGreen} listos
                    </span>
                    <span className="text-[#CECECE]">•</span>
                    <span className="flex items-center gap-1 text-[#FF4B4B] text-[11px]">
                      <AlertCircle className="w-3.5 h-3.5 stroke-[2.5]" /> {courseConcepts.length - cGreen} pend.
                    </span>
                  </div>

                  <span className="font-black text-[#58CC02] uppercase tracking-wider text-[11px]">
                    ESTUDIAR →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
