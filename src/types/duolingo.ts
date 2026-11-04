import { SubjectId } from './index';

export type QuestionType = 
  | 'multiple_choice' 
  | 'match_pairs' 
  | 'code_reorder' 
  | 'true_false';

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  subPrompt?: string;
  explanation: string;
  tip?: string; // Teacher trap or memory tip
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple_choice';
  options: string[];
  correctIndex: number;
}

export interface MatchPairsQuestion extends BaseQuestion {
  type: 'match_pairs';
  pairs: { left: string; right: string }[];
}

export interface CodeReorderQuestion extends BaseQuestion {
  type: 'code_reorder';
  tokens: string[]; // Shuffled tokens
  correctSequence: string[]; // Correct ordered tokens
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: 'true_false';
  statement: string;
  isTrue: boolean;
}

export type DuolingoQuestion = 
  | MultipleChoiceQuestion 
  | MatchPairsQuestion 
  | CodeReorderQuestion 
  | TrueFalseQuestion;

export interface DuolingoLesson {
  id: string;
  title: string;
  subtitle: string;
  unitId: string;
  subjectId: SubjectId;
  xpReward: number;
  gemReward: number;
  questions: DuolingoQuestion[];
}

export interface DuolingoUnit {
  id: string;
  unitNumber: number;
  title: string;
  description: string;
  color: string; // Tailwind background gradient or color
  borderColor: string;
  subjectId: SubjectId;
  guideBook: {
    title: string;
    keyPoints: string[];
    commonMistakes: string[];
    essentialFormula?: string;
  };
  lessons: DuolingoLesson[];
}

export interface DuolingoUserState {
  hearts: number; // 0 - 5
  maxHearts: number;
  xp: number;
  streakDays: number;
  gems: number;
  completedLessons: string[]; // Lesson IDs
  currentSubjectId: SubjectId;
  soundEnabled: boolean;
}
