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
    examPitfalls: string[]; // Errores típicos donde los profesores restan puntos
  };
  interactiveDemoId?: 'pipeline' | 'cache' | 'automata' | 'virtual-memory' | 'solid-doctor';
  codeOrExample?: {
    language: string;
    code: string;
    explanation: string;
  };
}

export interface ExamProblem {
  id: string;
  subjectId: SubjectId;
  courseYear: string; // e.g. "Examen Junio 2023 - UMU"
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

export interface UserProgress {
  topicMastery: Record<string, 'red' | 'yellow' | 'green'>;
  completedQuizzes: Record<string, number>; // questionId -> score/status
  studyStreakDays: number;
  totalStudyMinutes: number;
  lastActiveDate: string;
}
