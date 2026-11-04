import React from 'react';
import { Subject, UserProgress } from '../types';
import { COURSES } from '../data/coursesData';
import { 
  Flame, 
  Award, 
  Timer, 
  Zap, 
  ChevronRight, 
  Cpu, 
  Layers, 
  GitBranch, 
  PackageCheck, 
  FolderOpen,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface DashboardProps {
  progress: UserProgress;
  onSelectSubject: (subject: Subject) => void;
  onOpenExamTrainer: () => void;
  onOpenPomodoro: () => void;
  onOpenDuolingo?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  progress,
  onSelectSubject,
  onOpenExamTrainer,
  onOpenPomodoro,
  onOpenDuolingo
}) => {
  // Calculate total concepts and mastery counts
  const allConcepts = COURSES.flatMap(c => c.concepts);
  const totalConcepts = allConcepts.length;
  const greenCount = Object.values(progress.topicMastery).filter(v => v === 'green').length;
  const yellowCount = Object.values(progress.topicMastery).filter(v => v === 'yellow').length;
  const redCount = Object.values(progress.topicMastery).filter(v => v === 'red').length;

  const masteryPercentage = totalConcepts > 0 ? Math.round((greenCount / totalConcepts) * 100) : 0;

  // Days until typical exam period (around Jan 8, 2027)
  const today = new Date('2026-11-04');
  const examDate = new Date('2027-01-08');
  const daysUntilExams = Math.max(0, Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-5 h-5" />;
      case 'Layers': return <Layers className="w-5 h-5" />;
      case 'GitBranch': return <GitBranch className="w-5 h-5" />;
      case 'PackageCheck': return <PackageCheck className="w-5 h-5" />;
      default: return <Cpu className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Mission Control Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-3xl p-8 shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-full text-xs font-black tracking-wider uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Plan de Salvación FIUM · UMU
            </span>
            <span className="text-xs text-slate-400 font-mono">Curso 2026 / 2027</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Recupera el Control Total de tus Asignaturas
          </h1>
          <p className="text-sm md:text-base text-slate-300 mt-2 leading-relaxed">
            Dejamos atrás la teoría difusa y las diapositivas infinitas. Explicaciones con el método Feynman, 
            simuladores interactivos en tiempo real y el banco de problemas reales de examen resueltos paso a paso.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            {onOpenDuolingo && (
              <button
                onClick={onOpenDuolingo}
                className="px-5 py-2.5 bg-green-500 hover:bg-green-400 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-green-500/25 border-b-4 border-green-700 active:border-b-0 active:translate-y-1 flex items-center gap-2 transition"
              >
                <span className="text-sm">🦉</span> Modo FIUMingo (Duolingo)
              </button>
            )}
            <button
              onClick={onOpenPomodoro}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/30 flex items-center gap-2 transition"
            >
              <Timer className="w-4 h-4" /> Iniciar Sesión de Foco (25m)
            </button>
            <button
              onClick={onOpenExamTrainer}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition"
            >
              <Award className="w-4 h-4" /> Entrenar Preguntas de Examen
            </button>
          </div>
        </div>

        {/* Ambient subtle glow */}
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Countdown */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>DÍAS PARA EXÁMENES</span>
            <Calendar className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{daysUntilExams}</div>
          <div className="text-[11px] text-slate-500 mt-1">Convocatoria Enero 2027</div>
        </div>

        {/* Mastery Progress */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>DOMINIO DEL TEMARIO</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">{masteryPercentage}%</div>
          <div className="text-[11px] text-slate-500 mt-1">{greenCount} de {totalConcepts} temas en verde</div>
        </div>

        {/* Study Streak */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>RACHA DE ESTUDIO</span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-black text-rose-400 font-mono">{progress.studyStreakDays} días</div>
          <div className="text-[11px] text-slate-500 mt-1">¡La constancia bate el talento!</div>
        </div>

        {/* Focus Hours */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>TIEMPO DE FOCO</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400 font-mono">{progress.totalStudyMinutes} min</div>
          <div className="text-[11px] text-slate-500 mt-1">Acumulados en esta app</div>
        </div>
      </div>

      {/* Asignaturas Grid (Semáforo de Emergencia) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Tus Asignaturas Críticas (Semáforo de Prioridad)</h2>
            <p className="text-xs text-slate-400">Selecciona cualquier asignatura para ver los temas clave, simuladores y apuntes.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COURSES.map(course => {
            const courseConcepts = course.concepts;
            const cGreen = courseConcepts.filter(c => progress.topicMastery[c.id] === 'green').length;
            const cRed = courseConcepts.filter(c => progress.topicMastery[c.id] === 'red').length;
            const cYellow = courseConcepts.filter(c => progress.topicMastery[c.id] === 'yellow').length;

            return (
              <div
                key={course.id}
                onClick={() => onSelectSubject(course)}
                className="group cursor-pointer bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 p-6 rounded-3xl transition-all duration-200 hover:-translate-y-1 shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${course.color} text-white shadow-md`}>
                      {getSubjectIcon(course.icon)}
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                        Código {course.code} · {course.shortName}
                      </span>
                      <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition">
                        {course.name}
                      </h3>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white transition group-hover:translate-x-1" />
                </div>

                <p className="text-xs text-slate-400 mt-3 line-clamp-2">
                  {course.tagline}
                </p>

                {/* Progress Mini Bar & Stats */}
                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {cGreen} listos
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="flex items-center gap-1 text-rose-400 font-semibold">
                      <AlertCircle className="w-3.5 h-3.5" /> {cRed + (courseConcepts.length - cGreen - cYellow - cRed)} pendientes
                    </span>
                  </div>

                  <span className="font-bold text-indigo-400 group-hover:underline flex items-center gap-1 text-[11px]">
                    Estudiar Asignatura &rarr;
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
