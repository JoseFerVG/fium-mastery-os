import { Achievement, DailyQuest } from '../types';

export interface PlayerLevel {
  level: number;
  title: string;
  minXp: number;
  icon: string;
  badgeColor: string;
  perk: string;
}

export const PLAYER_LEVELS: PlayerLevel[] = [
  { level: 1, title: 'Novato de la FIUM', minXp: 0, icon: '🌱', badgeColor: 'from-slate-600 to-slate-800', perk: 'Comienza tu viaje hacia la matrícula de honor' },
  { level: 2, title: 'Script Kiddie de Bash', minXp: 200, icon: '🐚', badgeColor: 'from-emerald-600 to-teal-850', perk: 'Dominio de tuberías y permisos chmod' },
  { level: 3, title: 'Decodificador RISC-V', minXp: 500, icon: '⚡', badgeColor: 'from-blue-600 to-indigo-800', perk: 'Forwarding y cálculo de ciclos AMAT' },
  { level: 4, title: 'Domador de xv6 & Kernel Hacker', minXp: 900, icon: '🐧', badgeColor: 'from-cyan-600 to-blue-900', perk: 'Llamadas al sistema y tablas de páginas' },
  { level: 5, title: 'Señor de los Grafos & Autómatas', minXp: 1400, icon: '⚙️', badgeColor: 'from-amber-600 to-orange-850', perk: 'Minimización de autómatas y Pumping Lemma' },
  { level: 6, title: 'Arquitecto SOLID & Patrones GoF', minXp: 2000, icon: '🏛️', badgeColor: 'from-purple-600 to-violet-900', perk: 'Diseño desacoplado y Java Streams de alto nivel' },
  { level: 7, title: 'Guardián de Protocolos TCP/IP', minXp: 2800, icon: '🌐', badgeColor: 'from-sky-600 to-blue-800', perk: 'Subnetting VLSM y control de congestión Reno' },
  { level: 8, title: 'Científico de Datos & Redes Neuronales', minXp: 3800, icon: '🧠', badgeColor: 'from-rose-600 to-pink-900', perk: 'Matriz de confusión y cálculo de entropía' },
  { level: 9, title: 'Maestro de Búsquedas Heurísticas & A*', minXp: 5000, icon: '✨', badgeColor: 'from-fuchsia-600 to-purple-800', perk: 'Heurísticas consistentes y Poda Alfa-Beta' },
  { level: 10, title: 'Leyenda FIUM Cum Laude', minXp: 6500, icon: '👑', badgeColor: 'from-amber-500 via-yellow-400 to-amber-600', perk: 'Salvación total del curso y dominio de ingeniería' }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-step',
    title: 'Primer Paso en la FIUM',
    description: 'Completa tu primera lección de estudio o pregunta de examen.',
    icon: '🎯',
    xpReward: 50,
    gemsReward: 10,
    category: 'mastery',
    unlocked: false
  },
  {
    id: 'streak-3',
    title: 'Racha Ardiente',
    description: 'Mantén una racha de estudio de al menos 3 días consecutivos.',
    icon: '🔥',
    xpReward: 100,
    gemsReward: 20,
    category: 'streak',
    unlocked: false
  },
  {
    id: 'streak-7',
    title: 'Semana de Acero',
    description: 'Alcanza una racha de 7 días seguidos de estudio activo.',
    icon: '⚡',
    xpReward: 250,
    gemsReward: 50,
    category: 'streak',
    unlocked: false
  },
  {
    id: 'feynman-5',
    title: 'Efecto Feynman',
    description: 'Marca 5 conceptos clave en verde (dominio total).',
    icon: '🧠',
    xpReward: 150,
    gemsReward: 25,
    category: 'mastery',
    unlocked: false
  },
  {
    id: 'feynman-15',
    title: 'Cerebro de Silicio',
    description: 'Domina 15 conceptos en verde sin dejar cabos sueltos.',
    icon: '💎',
    xpReward: 350,
    gemsReward: 60,
    category: 'mastery',
    unlocked: false
  },
  {
    id: 'simulator-explorer',
    title: 'Ingeniero Práctico',
    description: 'Prueba al menos 3 simuladores interactivos diferentes.',
    icon: '🛠️',
    xpReward: 120,
    gemsReward: 20,
    category: 'mastery',
    unlocked: false
  },
  {
    id: 'pipeline-wizard',
    title: 'Domador de Paradas (Stalls)',
    description: 'Simula un cauce con forwarding y comprende el Load-Use hazard.',
    icon: '🏎️',
    xpReward: 100,
    gemsReward: 15,
    category: 'mastery',
    unlocked: false
  },
  {
    id: 'subnet-guru',
    title: 'Cartógrafo de Redes',
    description: 'Calcula una red VLSM completa sin fallar direcciones de red ni broadcast.',
    icon: '🌐',
    xpReward: 100,
    gemsReward: 15,
    category: 'mastery',
    unlocked: false
  },
  {
    id: 'rsa-breaker',
    title: 'Criptógrafo Cuántico',
    description: 'Genera claves públicas y privadas RSA y cifra tu primer mensaje.',
    icon: '🔐',
    xpReward: 100,
    gemsReward: 15,
    category: 'mastery',
    unlocked: false
  },
  {
    id: 'scheduler-master',
    title: 'Planificador Infalible',
    description: 'Calcula los tiempos de retorno en el simulador de CPU (Round Robin / SJF).',
    icon: '⏱️',
    xpReward: 100,
    gemsReward: 15,
    category: 'mastery',
    unlocked: false
  },
  {
    id: 'exam-sniper-5',
    title: 'Francotirador de Exámenes',
    description: 'Responde correctamente 5 problemas oficiales de examen seguidos.',
    icon: '🎯',
    xpReward: 200,
    gemsReward: 35,
    category: 'exam',
    unlocked: false
  },
  {
    id: 'exam-master-15',
    title: 'Pesadilla del Tribunal',
    description: 'Supera 15 preguntas de examen oficiales de la UMU.',
    icon: '📜',
    xpReward: 400,
    gemsReward: 80,
    category: 'exam',
    unlocked: false
  },
  {
    id: 'survival-rookie',
    title: 'Superviviente de Enero',
    description: 'Consigue más de 300 puntos en el Modo Supervivencia Convocatoria.',
    icon: '🏆',
    xpReward: 150,
    gemsReward: 25,
    category: 'speedrun',
    unlocked: false
  },
  {
    id: 'survival-champion',
    title: 'Velocidad de Reloj',
    description: 'Consigue más de 1000 puntos en el Modo Supervivencia.',
    icon: '🚀',
    xpReward: 350,
    gemsReward: 70,
    category: 'speedrun',
    unlocked: false
  },
  {
    id: 'pomodoro-focus',
    title: 'Modo Monje FIUM',
    description: 'Acumula más de 60 minutos de estudio concentrado con el Pomodoro.',
    icon: '🧘',
    xpReward: 150,
    gemsReward: 30,
    category: 'focus',
    unlocked: false
  },
  {
    id: 'fiumingo-hero',
    title: 'Búho Laureado',
    description: 'Completa 5 lecciones completas en FIUMingo sin perder todas las vidas.',
    icon: '🦉',
    xpReward: 200,
    gemsReward: 40,
    category: 'mastery',
    unlocked: false
  }
];

export const DEFAULT_DAILY_QUESTS: DailyQuest[] = [
  {
    id: 'quest-streak',
    title: 'Presencia en la FIUM',
    description: 'Entra a estudiar hoy y mantén viva tu racha.',
    xpReward: 40,
    gemsReward: 5,
    targetCount: 1,
    currentCount: 1,
    completed: true,
    type: 'feynman'
  },
  {
    id: 'quest-exam-problems',
    title: 'Desafío de Examen',
    description: 'Resuelve 2 preguntas del banco de exámenes oficiales.',
    xpReward: 80,
    gemsReward: 15,
    targetCount: 2,
    currentCount: 0,
    completed: false,
    type: 'quiz'
  },
  {
    id: 'quest-fiumingo-lesson',
    title: 'Paseo por FIUMingo',
    description: 'Completa 1 lección interactiva de Duolingo.',
    xpReward: 60,
    gemsReward: 10,
    targetCount: 1,
    currentCount: 0,
    completed: false,
    type: 'fiumingo'
  },
  {
    id: 'quest-interactive-lab',
    title: 'Práctica de Laboratorio',
    description: 'Experimenta con al menos 1 simulador interactivo.',
    xpReward: 50,
    gemsReward: 10,
    targetCount: 1,
    currentCount: 0,
    completed: false,
    type: 'simulator'
  }
];

export function getPlayerLevel(xp: number): PlayerLevel {
  for (let i = PLAYER_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= PLAYER_LEVELS[i].minXp) {
      return PLAYER_LEVELS[i];
    }
  }
  return PLAYER_LEVELS[0];
}

export function getNextPlayerLevel(xp: number): PlayerLevel | null {
  const current = getPlayerLevel(xp);
  const nextIdx = PLAYER_LEVELS.findIndex(l => l.level === current.level + 1);
  return nextIdx !== -1 ? PLAYER_LEVELS[nextIdx] : null;
}
