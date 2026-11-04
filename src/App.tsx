import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { CourseView } from './components/CourseView';
import { ExamTrainer } from './components/ExamTrainer';
import { PomodoroTimer } from './components/PomodoroTimer';
import { DuolingoView } from './components/duolingo/DuolingoView';
import { COURSES } from './data/coursesData';
import { Subject, SubjectId, UserProgress } from './types';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'fium_mastery_os_v1';

const DEFAULT_PROGRESS: UserProgress = {
  topicMastery: {
    'aoc-pipeline-intro': 'yellow',
    'aso-page-tables': 'red',
    'alf-dfa-minimization': 'yellow',
    'tds-solid-dip': 'green',
  },
  completedQuizzes: {
    'q-aoc-1': 1,
  },
  studyStreakDays: 4,
  totalStudyMinutes: 120,
  lastActiveDate: new Date().toISOString().split('T')[0],
};

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'course' | 'exam' | 'pomodoro' | 'duolingo'>('dashboard');
  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId>('aoc');
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

  const handleUpdateMastery = (conceptId: string, status: 'red' | 'yellow' | 'green') => {
    setProgress(prev => {
      const next = {
        ...prev,
        topicMastery: {
          ...prev.topicMastery,
          [conceptId]: status,
        },
      };
      return next;
    });

    if (status === 'green') {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  const handleSelectSubject = (subject: Subject) => {
    setSelectedSubjectId(subject.id);
    setCurrentView('course');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: 'dashboard' | 'course' | 'exam' | 'pomodoro' | 'duolingo', subjectId?: SubjectId) => {
    if (subjectId) {
      setSelectedSubjectId(subjectId);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetProgress = () => {
    if (window.confirm('¿Seguro que deseas reiniciar tu progreso guardado?')) {
      setProgress({
        topicMastery: {},
        completedQuizzes: {},
        studyStreakDays: 1,
        totalStudyMinutes: 0,
        lastActiveDate: new Date().toISOString().split('T')[0],
      });
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Find active subject
  const currentSubject = COURSES.find(s => s.id === selectedSubjectId) || COURSES[0];

  // Calculate overall percentage
  const totalConcepts = COURSES.flatMap(c => c.concepts).length;
  const greenConcepts = Object.values(progress.topicMastery).filter(v => v === 'green').length;
  const overallPercentage = totalConcepts > 0 ? Math.round((greenConcepts / totalConcepts) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        selectedSubjectId={selectedSubjectId}
        subjects={COURSES}
        overallProgress={overallPercentage}
        streakDays={progress.studyStreakDays}
        onNavigate={handleNavigate}
        onResetProgress={handleResetProgress}
      />

      {/* Main Content Area */}
      {currentView === 'duolingo' ? (
        <DuolingoView
          initialSubjectId={selectedSubjectId}
          onBackToDashboard={() => handleNavigate('dashboard')}
        />
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {currentView === 'dashboard' && (
            <Dashboard
              progress={progress}
              onSelectSubject={handleSelectSubject}
              onOpenExamTrainer={() => handleNavigate('exam')}
              onOpenPomodoro={() => handleNavigate('pomodoro')}
              onOpenDuolingo={() => handleNavigate('duolingo')}
            />
          )}

          {currentView === 'course' && (
            <CourseView
              subject={currentSubject}
              topicMastery={progress.topicMastery}
              onUpdateMastery={handleUpdateMastery}
              onBack={() => handleNavigate('dashboard')}
            />
          )}

          {currentView === 'exam' && (
            <ExamTrainer
              onBack={() => handleNavigate('dashboard')}
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
              <PomodoroTimer />
            </div>
          )}
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
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
