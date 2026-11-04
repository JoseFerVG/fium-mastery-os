import React, { useState, useEffect } from 'react';
import { SubjectId } from '../../types';
import { DuolingoUserState, DuolingoLesson, DuolingoUnit } from '../../types/duolingo';
import { DUOLINGO_UNITS } from '../../data/duolingoData';
import { DuolingoHeader } from './DuolingoHeader';
import { DuolingoPath } from './DuolingoPath';
import { DuolingoLessonModal } from './DuolingoLessonModal';
import { DuolingoGuideModal } from './DuolingoGuideModal';
import { soundManager } from '../../utils/soundEffects';

interface DuolingoViewProps {
  initialSubjectId?: SubjectId;
  onBackToDashboard: () => void;
}

const DUOLINGO_STORAGE_KEY = 'fium_duolingo_state_v1';

const DEFAULT_STATE: DuolingoUserState = {
  hearts: 5,
  maxHearts: 5,
  xp: 140,
  streakDays: 4,
  gems: 350,
  completedLessons: ['aoc-u1-l1'],
  currentSubjectId: 'aoc',
  soundEnabled: true,
};

export const DuolingoView: React.FC<DuolingoViewProps> = ({
  initialSubjectId = 'aoc',
  onBackToDashboard,
}) => {
  const [userState, setUserState] = useState<DuolingoUserState>(() => {
    try {
      const saved = localStorage.getItem(DUOLINGO_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...parsed, currentSubjectId: initialSubjectId || parsed.currentSubjectId };
      }
    } catch (e) {
      console.error('Error loading duolingo state:', e);
    }
    return { ...DEFAULT_STATE, currentSubjectId: initialSubjectId };
  });

  const [activeLesson, setActiveLesson] = useState<DuolingoLesson | null>(null);
  const [activeGuideUnit, setActiveGuideUnit] = useState<DuolingoUnit | null>(null);

  // Sync sound manager enabled flag
  useEffect(() => {
    soundManager.setEnabled(userState.soundEnabled);
  }, [userState.soundEnabled]);

  // Persist state to local storage
  useEffect(() => {
    try {
      localStorage.setItem(DUOLINGO_STORAGE_KEY, JSON.stringify(userState));
    } catch (e) {
      console.error('Error saving duolingo state:', e);
    }
  }, [userState]);

  const handleToggleSound = () => {
    setUserState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const handleSelectSubject = (subId: SubjectId) => {
    setUserState(prev => ({ ...prev, currentSubjectId: subId }));
  };

  const handleRefillHearts = () => {
    soundManager.playCorrect();
    setUserState(prev => ({ ...prev, hearts: prev.maxHearts }));
  };

  const handleLoseHeart = () => {
    setUserState(prev => ({ ...prev, hearts: Math.max(0, prev.hearts - 1) }));
  };

  const handleCompleteLesson = (xpGained: number, gemsGained: number) => {
    if (!activeLesson) return;
    setUserState(prev => ({
      ...prev,
      xp: prev.xp + xpGained,
      gems: prev.gems + gemsGained,
      completedLessons: prev.completedLessons.includes(activeLesson.id)
        ? prev.completedLessons
        : [...prev.completedLessons, activeLesson.id],
    }));
  };

  // Filter units for current subject
  const currentUnits = DUOLINGO_UNITS.filter(u => u.subjectId === userState.currentSubjectId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Duolingo Gamification Header */}
      <DuolingoHeader
        currentSubjectId={userState.currentSubjectId}
        hearts={userState.hearts}
        maxHearts={userState.maxHearts}
        streakDays={userState.streakDays}
        gems={userState.gems}
        soundEnabled={userState.soundEnabled}
        onToggleSound={handleToggleSound}
        onSelectSubject={handleSelectSubject}
        onBackToDashboard={onBackToDashboard}
        onRefillHearts={handleRefillHearts}
      />

      {/* Path Canvas */}
      <main className="flex-1 pb-16">
        {currentUnits.length > 0 ? (
          <DuolingoPath
            units={currentUnits}
            completedLessons={userState.completedLessons}
            onSelectLesson={lesson => setActiveLesson(lesson)}
            onOpenGuide={unit => setActiveGuideUnit(unit)}
          />
        ) : (
          <div className="max-w-md mx-auto text-center py-20 px-4 space-y-4">
            <div className="text-4xl">🦉</div>
            <h3 className="text-xl font-black text-white">Unidades en Preparación</h3>
            <p className="text-xs text-slate-400">
              Estamos volcando los apuntes y exámenes de esta asignatura del Aula Virtual al formato gamificado. ¡Prueba mientras tanto con AOC, ASO, ALF o TDS!
            </p>
            <button
              onClick={() => handleSelectSubject('aoc')}
              className="px-6 py-3 rounded-2xl bg-green-500 hover:bg-green-400 text-white font-black text-xs border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition"
            >
              Ir a AOC (Arquitectura)
            </button>
          </div>
        )}
      </main>

      {/* Guidebook Modal */}
      {activeGuideUnit && (
        <DuolingoGuideModal
          unit={activeGuideUnit}
          onClose={() => setActiveGuideUnit(null)}
          onStartLesson={() => {
            const firstLesson = activeGuideUnit.lessons[0];
            if (firstLesson) setActiveLesson(firstLesson);
          }}
        />
      )}

      {/* Interactive Lesson Modal */}
      {activeLesson && (
        <DuolingoLessonModal
          lesson={activeLesson}
          hearts={userState.hearts}
          maxHearts={userState.maxHearts}
          onClose={() => setActiveLesson(null)}
          onLoseHeart={handleLoseHeart}
          onRefillHearts={handleRefillHearts}
          onCompleteLesson={handleCompleteLesson}
        />
      )}
    </div>
  );
};
