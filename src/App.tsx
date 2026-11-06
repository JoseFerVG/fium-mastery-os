import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { CourseView } from './components/CourseView';
import { ExamTrainer } from './components/ExamTrainer';
import { PomodoroTimer } from './components/PomodoroTimer';
import { DuolingoView } from './components/duolingo/DuolingoView';
import { SimulatorsHub } from './components/SimulatorsHub';
import { ExamRushModal } from './components/gamification/ExamRushModal';
import { FlashcardsModal } from './components/gamification/FlashcardsModal';
import { AchievementsModal } from './components/gamification/AchievementsModal';
import { RescuePlanModal } from './components/RescuePlanModal';
import { DeskCompanionModal } from './components/gamification/DeskCompanionModal';
import { MobileBottomNav } from './components/navigation/MobileBottomNav';
import { COURSES } from './data/coursesData';
import { DEFAULT_DAILY_QUESTS, getPlayerLevel } from './data/gamificationData';
import { Subject, SubjectId, UserProgress, SimulatorId } from './types';
import { soundManager } from './utils/soundEffects';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'fium_mastery_os_v2_goal';

const DEFAULT_PROGRESS: UserProgress = {
  topicMastery: {
    'aoc-pipeline-hazards': 'green',
    'aso-virtual-memory': 'yellow',
    'alf-pumping-lemma': 'yellow',
    'tds-solid-gof': 'green',
    'iso-cpu-scheduling': 'green',
    'ac-decision-trees': 'yellow',
    'ar-vlsm-tcp': 'green',
    'st-rsa-web': 'yellow',
    'si-search-minimax': 'green'
  },
  completedQuizzes: {
    'aoc-q1-amat': 1,
    'iso-q1-dynamic-priority-aging': 1,
    'ar-q1-vlsm-subnets': 1
  },
  studyStreakDays: 5,
  totalStudyMinutes: 145,
  lastActiveDate: new Date().toISOString().split('T')[0],
  // Gamification extensions
  xp: 750,
  gems: 45,
  level: 3,
  unlockedAchievements: ['first-step', 'streak-3', 'feynman-5', 'pipeline-wizard'],
  dailyQuests: DEFAULT_DAILY_QUESTS,
  survivalHighScore: 450,
  survivalTotalGames: 3,
  answeredFlashcards: {
    'fc-aoc-1': 'easy',
    'fc-aso-1': 'medium',
    'fc-ar-1': 'easy'
  },
  completedRescueDays: []
};

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'course' | 'exam' | 'pomodoro' | 'duolingo' | 'simulators'>('dashboard');
  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId>('aoc');
  const [selectedSimulatorId, setSelectedSimulatorId] = useState<SimulatorId | undefined>(undefined);

  // Modals
  const [isExamRushOpen, setIsExamRushOpen] = useState(false);
  const [isFlashcardsOpen, setIsFlashcardsOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isRescuePlanOpen, setIsRescuePlanOpen] = useState(false);
  const [isDeskCompanionOpen, setIsDeskCompanionOpen] = useState(false);

  // Saved Progress State
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading progress from localStorage:', e);
    }
    return DEFAULT_PROGRESS;
  });

  // Save progress changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Error saving progress to localStorage:', e);
    }
  }, [progress]);

  // Check achievements automatically based on stats
  const checkAchievements = (newXp: number, currentTopicMastery: Record<string, string>, currentUnlocked: string[]) => {
    const unlocked = new Set(currentUnlocked);
    const greenCount = Object.values(currentTopicMastery).filter(v => v === 'green').length;

    if (greenCount >= 5 && !unlocked.has('feynman-5')) {
      unlocked.add('feynman-5');
      soundManager.playAchievement();
    }
    if (greenCount >= 15 && !unlocked.has('feynman-15')) {
      unlocked.add('feynman-15');
      soundManager.playAchievement();
    }
    if (newXp >= 1000 && !unlocked.has('survival-rookie')) {
      unlocked.add('survival-rookie');
    }
    if (progress.studyStreakDays >= 3 && !unlocked.has('streak-3')) {
      unlocked.add('streak-3');
    }
    if (progress.studyStreakDays >= 7 && !unlocked.has('streak-7')) {
      unlocked.add('streak-7');
    }

    return Array.from(unlocked);
  };

  const handleAddXp = (amount: number) => {
    setProgress(prev => {
      const oldLevel = getPlayerLevel(prev.xp);
      const newXp = prev.xp + amount;
      const newLevel = getPlayerLevel(newXp);

      if (newLevel.level > oldLevel.level) {
        soundManager.playLevelUp();
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.6 }
        });
      }

      const updatedAchievements = checkAchievements(newXp, prev.topicMastery, prev.unlockedAchievements);

      return {
        ...prev,
        xp: newXp,
        level: newLevel.level,
        unlockedAchievements: updatedAchievements
      };
    });
  };

  const handleAddGems = (amount: number) => {
    setProgress(prev => ({
      ...prev,
      gems: prev.gems + amount
    }));
  };

  const handleUpdateMastery = (conceptId: string, status: 'red' | 'yellow' | 'green') => {
    setProgress(prev => {
      const isNewGreen = status === 'green' && prev.topicMastery[conceptId] !== 'green';
      const addedXp = isNewGreen ? 50 : 0;
      const addedGems = isNewGreen ? 5 : 0;

      const nextMastery = {
        ...prev.topicMastery,
        [conceptId]: status,
      };

      const newXp = prev.xp + addedXp;
      const newGems = prev.gems + addedGems;
      const newLevel = getPlayerLevel(newXp);

      const updatedAchievements = checkAchievements(newXp, nextMastery, prev.unlockedAchievements);

      return {
        ...prev,
        topicMastery: nextMastery,
        xp: newXp,
        gems: newGems,
        level: newLevel.level,
        unlockedAchievements: updatedAchievements
      };
    });

    if (status === 'green') {
      soundManager.playCorrect();
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
      });
    } else {
      soundManager.playClick();
    }
  };

  const handleClaimQuest = (questId: string) => {
    setProgress(prev => {
      const quest = prev.dailyQuests.find(q => q.id === questId);
      if (!quest || !quest.completed) return prev;

      soundManager.playFanfare();
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });

      return {
        ...prev,
        xp: prev.xp + quest.xpReward,
        gems: prev.gems + quest.gemsReward
      };
    });
  };

  const handleUpdateSurvivalHighScore = (score: number) => {
    setProgress(prev => ({
      ...prev,
      survivalHighScore: Math.max(prev.survivalHighScore, score),
      survivalTotalGames: prev.survivalTotalGames + 1
    }));
  };

  const handleCompleteRescueDay = (dayNumber: number, xpReward: number, gemsReward: number) => {
    setProgress(prev => {
      const currentDays = prev.completedRescueDays || [];
      const isAlreadyCompleted = currentDays.includes(dayNumber);
      const nextDays = isAlreadyCompleted
        ? currentDays.filter(d => d !== dayNumber)
        : [...currentDays, dayNumber];

      const newXp = Math.max(0, prev.xp + xpReward);
      const newGems = Math.max(0, prev.gems + gemsReward);
      const newLevel = getPlayerLevel(newXp);

      return {
        ...prev,
        completedRescueDays: nextDays,
        xp: newXp,
        gems: newGems,
        level: newLevel.level
      };
    });
  };

  const handleRescueNavigate = (action: { type: 'simulator' | 'course' | 'duolingo' | 'exam'; targetId?: string; subjectId?: SubjectId }) => {
    if (action.type === 'simulator') {
      setSelectedSimulatorId(action.targetId as SimulatorId);
      setCurrentView('simulators');
    } else if (action.type === 'course' && action.subjectId) {
      setSelectedSubjectId(action.subjectId);
      setCurrentView('course');
    } else if (action.type === 'exam') {
      setCurrentView('exam');
    } else if (action.type === 'duolingo') {
      setCurrentView('duolingo');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSubject = (subject: Subject) => {
    setSelectedSubjectId(subject.id);
    setCurrentView('course');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: 'dashboard' | 'course' | 'exam' | 'pomodoro' | 'duolingo' | 'simulators', subjectId?: SubjectId) => {
    if (subjectId) {
      setSelectedSubjectId(subjectId);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSimulators = (simId?: SimulatorId) => {
    setSelectedSimulatorId(simId);
    setCurrentView('simulators');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetProgress = () => {
    if (window.confirm('¿Seguro que deseas reiniciar tu progreso guardado?')) {
      setProgress(DEFAULT_PROGRESS);
      localStorage.removeItem(STORAGE_KEY);
      soundManager.playClick();
    }
  };

  // Find active subject
  const currentSubject = COURSES.find(s => s.id === selectedSubjectId) || COURSES[0];

  // Calculate overall percentage
  const totalConcepts = COURSES.flatMap(c => c.concepts).length;
  const greenConcepts = Object.values(progress.topicMastery).filter(v => v === 'green').length;
  const overallPercentage = totalConcepts > 0 ? Math.round((greenConcepts / totalConcepts) * 100) : 0;

  return (
    <div className="min-h-screen bg-mesh-gradient bg-noise text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      {/* Top Ambient Glow Orb */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-indigo-500/15 via-purple-500/5 to-transparent blur-3xl rounded-full z-0" />

      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        selectedSubjectId={selectedSubjectId}
        subjects={COURSES}
        overallProgress={overallPercentage}
        streakDays={progress.studyStreakDays}
        xp={progress.xp}
        gems={progress.gems}
        onNavigate={handleNavigate}
        onOpenExamRush={() => setIsExamRushOpen(true)}
        onOpenFlashcards={() => setIsFlashcardsOpen(true)}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        onResetProgress={handleResetProgress}
        onOpenRescuePlan={() => setIsRescuePlanOpen(true)}
        onOpenDeskCompanion={() => setIsDeskCompanionOpen(true)}
      />

      {/* Main Content Area with View Transitions */}
      <AnimatePresence mode="wait">
        {currentView === 'duolingo' ? (
          <motion.div
            key="duolingo"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 w-full relative z-10 pb-24 lg:pb-12"
          >
            <DuolingoView
              initialSubjectId={selectedSubjectId}
              onBackToDashboard={() => handleNavigate('dashboard')}
            />
          </motion.div>
        ) : (
          <motion.main
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 lg:pb-12 relative z-10"
          >
            {currentView === 'dashboard' && (
              <Dashboard
                progress={progress}
                onSelectSubject={handleSelectSubject}
                onOpenExamTrainer={() => handleNavigate('exam')}
                onOpenPomodoro={() => handleNavigate('pomodoro')}
                onOpenDuolingo={() => handleNavigate('duolingo')}
                onOpenExamRush={() => setIsExamRushOpen(true)}
                onOpenFlashcards={() => setIsFlashcardsOpen(true)}
                onOpenAchievements={() => setIsAchievementsOpen(true)}
                onOpenSimulators={handleOpenSimulators}
                onClaimQuest={handleClaimQuest}
                onOpenRescuePlan={() => setIsRescuePlanOpen(true)}
                onOpenDeskCompanion={() => setIsDeskCompanionOpen(true)}
              />
            )}

            {currentView === 'simulators' && (
              <SimulatorsHub
                initialSimulatorId={selectedSimulatorId}
                onBack={() => handleNavigate('dashboard')}
              />
            )}

            {currentView === 'course' && (
              <CourseView
                subject={currentSubject}
                topicMastery={progress.topicMastery}
                onUpdateMastery={handleUpdateMastery}
                onOpenExamTrainer={(subjId) => handleNavigate('exam', subjId)}
                onBack={() => handleNavigate('dashboard')}
              />
            )}

            {currentView === 'exam' && (
              <ExamTrainer
                initialSubjectId={selectedSubjectId}
                onBack={() => handleNavigate('dashboard')}
                onAnswerSaved={(qId, isCorrect) => {
                  if (isCorrect) {
                    handleAddXp(50);
                    handleAddGems(5);
                  }
                }}
              />
            )}

            {currentView === 'pomodoro' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Estación de Enfoque Profundo</h2>
                    <p className="text-sm text-slate-400">Técnica Pomodoro 25/5 optimizada para retención conceptual de ingeniería</p>
                  </div>
                  <button
                    onClick={() => handleNavigate('dashboard')}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                  >
                    Volver al Panel
                  </button>
                </div>
                <PomodoroTimer
                  onSessionComplete={(mins) => {
                    handleAddXp(mins * 2);
                    handleAddGems(5);
                    setProgress(p => ({ ...p, totalStudyMinutes: p.totalStudyMinutes + mins }));
                  }}
                />
              </div>
            )}
          </motion.main>
        )}
      </AnimatePresence>

      {/* Gamification Modals with AnimatePresence */}
      <AnimatePresence>
        {isExamRushOpen && (
          <ExamRushModal
            highScore={progress.survivalHighScore}
            onUpdateHighScore={handleUpdateSurvivalHighScore}
            onAddXp={handleAddXp}
            onClose={() => setIsExamRushOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFlashcardsOpen && (
          <FlashcardsModal
            onClose={() => setIsFlashcardsOpen(false)}
            onAddXp={handleAddXp}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAchievementsOpen && (
          <AchievementsModal
            unlockedIds={progress.unlockedAchievements}
            xp={progress.xp}
            gems={progress.gems}
            onClose={() => setIsAchievementsOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isRescuePlanOpen && (
          <RescuePlanModal
            completedDays={progress.completedRescueDays || []}
            onCompleteDay={handleCompleteRescueDay}
            onNavigateAction={handleRescueNavigate}
            onClose={() => setIsRescuePlanOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Desk Companion: Modo Estudio Entre Libros */}
      <AnimatePresence>
        {isDeskCompanionOpen && (
          <DeskCompanionModal
            onClose={() => setIsDeskCompanionOpen(false)}
            onAddXp={handleAddXp}
            onAddGems={handleAddGems}
          />
        )}
      </AnimatePresence>

      {/* Native-feel Mobile Bottom Navigation Dock */}
      <MobileBottomNav
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenDeskCompanion={() => setIsDeskCompanionOpen(true)}
        onOpenFlashcards={() => setIsFlashcardsOpen(true)}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        streakDays={progress.studyStreakDays}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 mb-16 lg:mb-0 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            FIUM Mastery OS &bull; Herramienta de Recuperación de Alto Rendimiento para el Grado en Ingeniería Informática (UMU)
          </p>
          <p className="font-mono text-slate-600">
            José Fernando &bull; Convocatoria 2026/2027
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
