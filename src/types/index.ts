export type SubjectId = 
  | 'aoc'
  | 'aso'
  | 'alf'
  | 'tds'
  | 'iso'
  | 'ac'
  | 'ar'
  | 'si'
  | 'st';

export type SimulatorId =
  | 'pipeline'
  | 'cache'
  | 'automata'
  | 'virtual-memory'
  | 'solid-doctor'
  | 'cpu-scheduler'
  | 'subnet-calc'
  | 'rsa-crypto'
  | 'astar-search'
  | 'decision-tree';

export interface Concept {
  id: string;
  title: string;
  subtitle: string;
  importance: 'CRÍTICO EN EXAMEN' | 'ALTA RENTABILIDAD' | 'FUNDAMENTAL' | 'PUNTUACIÓN MÁXIMA';
  difficulty: 'Intermedio' | 'Avanzado' | 'Experto';
  timeEstimateMin: number;
  feynmanExplanation: {
    intuition: string;
    analogy: string;
    formalTheory: string;
    keyFormulasOrRules?: string[];
    examPitfalls: string[]; // Errores típicos donde los profesores restan puntos en la UMU
  };
  interactiveDemoId?: SimulatorId;
  codeOrExample?: {
    language: string;
    code: string;
    explanation: string;
  };
}

export interface ExamProblem {
  id: string;
  subjectId: SubjectId;
  courseYear: string; // e.g. "Examen Junio 2024 - UMU"
  title: string;
  question: string;
  options: {
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  detailedStepByStepSolution: string;
  examTip: string;
}

export interface Subject {
  id: SubjectId;
  code: string;
  name: string;
  shortName: string;
  semester: string;
  color: string;
  accentColor: string;
  icon: string;
  tagline: string;
  officialRepoOrSite?: string;
  concepts: Concept[];
  formulaCheatSheet: {
    title: string;
    items: { label: string; formulaOrLaw: string; notes: string }[];
  };
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  gemsReward: number;
  targetCount: number;
  currentCount: number;
  completed: boolean;
  type: 'quiz' | 'fiumingo' | 'feynman' | 'simulator' | 'focus';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  gemsReward: number;
  category: 'mastery' | 'streak' | 'exam' | 'speedrun' | 'focus';
  unlocked: boolean;
  unlockedAt?: string;
}

export interface Flashcard {
  id: string;
  subjectId: SubjectId;
  topic: string;
  question: string;
  answer: string;
  keyRule: string;
  trap: string;
}

export interface UserProgress {
  topicMastery: Record<string, 'red' | 'yellow' | 'green'>;
  completedQuizzes: Record<string, number>; // questionId -> score/status
  studyStreakDays: number;
  totalStudyMinutes: number;
  lastActiveDate: string;
  // Gamification extensions
  xp: number;
  gems: number;
  level: number;
  unlockedAchievements: string[];
  dailyQuests: DailyQuest[];
  survivalHighScore: number;
  survivalTotalGames: number;
  answeredFlashcards: Record<string, 'easy' | 'medium' | 'hard'>;
  completedRescueDays?: number[];
}
