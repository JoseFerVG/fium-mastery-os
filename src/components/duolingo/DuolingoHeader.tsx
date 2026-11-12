import React, { useState, useRef, useEffect } from 'react';
import { Flame, Heart, Gem, Volume2, VolumeX, ArrowLeft, ChevronDown } from 'lucide-react';
import { SubjectId } from '../../types';
import { COURSES } from '../../data/coursesData';
import { AnimatedCounter } from '../ui/AnimatedCounter';

interface DuolingoHeaderProps {
  currentSubjectId: SubjectId;
  hearts: number;
  maxHearts: number;
  streakDays: number;
  gems: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSelectSubject: (subjectId: SubjectId) => void;
  onBackToDashboard: () => void;
  onRefillHearts: () => void;
}

export const DuolingoHeader: React.FC<DuolingoHeaderProps> = ({
  currentSubjectId,
  hearts,
  maxHearts,
  streakDays,
  gems,
  soundEnabled,
  onToggleSound,
  onSelectSubject,
  onBackToDashboard,
  onRefillHearts,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentCourse = COURSES.find(c => c.id === currentSubjectId) || COURSES[0];

  const firstSemesterCourses = COURSES.filter(c => c.semester.includes('1º'));
  const secondSemesterCourses = COURSES.filter(c => c.semester.includes('2º'));

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="sticky top-0 z-30 bg-white border-b-2 border-[#E5E5E5] px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Back button & Subject Switcher */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBackToDashboard}
            aria-label="Volver al panel principal"
            className="p-2 rounded-xl bg-white hover:bg-[#F7F7F7] text-[#777777] hover:text-[#4B4B4B] transition border-2 border-[#E5E5E5] border-b-4 active:border-b-2 active:translate-y-0.5"
            title="Volver al panel"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Subject Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border-2 border-b-4 border-[#E5E5E5] hover:border-[#84D8FF] active:border-b-2 active:translate-y-0.5 transition text-xs font-black text-[#4B4B4B]"
            >
              <span className="w-3.5 h-3.5 rounded-full shadow-inner" style={{ backgroundColor: currentCourse.accentColor }} />
              <span className="font-extrabold uppercase tracking-wider">{currentCourse.code} · {currentCourse.shortName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#777777]" />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-72 max-h-[85vh] overflow-y-auto bg-white border-2 border-b-4 border-[#E5E5E5] rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100 divide-y divide-[#F0F0F0]">
                {/* 1º Cuatrimestre */}
                <div className="pb-2">
                  <div className="flex items-center justify-between px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#58A700]">
                    <span>1º Cuatrimestre (5 Asignaturas)</span>
                    <span className="bg-[#D7FFB8] text-[#58A700] text-[9px] px-1.5 py-0.5 rounded-md font-black">ACTUAL</span>
                  </div>
                  <div className="space-y-1 mt-1">
                    {firstSemesterCourses.map(course => (
                      <button
                        key={course.id}
                        onClick={() => {
                          onSelectSubject(course.id);
                          setDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-black transition text-left ${
                          currentSubjectId === course.id
                            ? 'bg-[#E5F6FD] text-[#1CB0F6] border-2 border-[#84D8FF]'
                            : 'text-[#4B4B4B] hover:bg-[#F7F7F7]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: course.accentColor }} />
                          <span className="truncate">{course.name}</span>
                        </div>
                        <span className="text-[10px] text-[#AFAFAF] font-bold shrink-0 ml-2">{course.code}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2º Cuatrimestre */}
                <div className="pt-2">
                  <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#AFAFAF]">
                    2º Cuatrimestre (4 Asignaturas)
                  </div>
                  <div className="space-y-1 mt-1">
                    {secondSemesterCourses.map(course => (
                      <button
                        key={course.id}
                        onClick={() => {
                          onSelectSubject(course.id);
                          setDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-black transition text-left ${
                          currentSubjectId === course.id
                            ? 'bg-[#E5F6FD] text-[#1CB0F6] border-2 border-[#84D8FF]'
                            : 'text-[#4B4B4B] hover:bg-[#F7F7F7]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: course.accentColor }} />
                          <span className="truncate">{course.name}</span>
                        </div>
                        <span className="text-[10px] text-[#AFAFAF] font-bold shrink-0 ml-2">{course.code}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Gamification Stats */}
        <div className="flex items-center gap-3 sm:gap-5 text-sm font-black">
          {/* Streak */}
          <div className="flex items-center gap-1.5 text-[#FF9600]" title="Días consecutivos de estudio">
            <Flame className="w-5 h-5 fill-[#FF9600] text-[#FF9600]" />
            <span className="font-black text-[#FF9600]"><AnimatedCounter value={streakDays} /></span>
          </div>

          {/* Gems / Lingots */}
          <div className="flex items-center gap-1.5 text-[#1CB0F6]" title="Gemas ganadas en lecciones">
            <Gem className="w-5 h-5 fill-[#1CB0F6] text-[#1CB0F6]" />
            <span className="font-black text-[#1CB0F6]"><AnimatedCounter value={gems} /></span>
          </div>

          {/* Hearts / Vidas */}
          <button
            onClick={onRefillHearts}
            className="flex items-center gap-1.5 text-[#FF4B4B] hover:scale-105 transition group"
            title="Vidas restantes (Clic para recargar)"
          >
            <Heart className={`w-5 h-5 ${hearts > 0 ? 'fill-[#FF4B4B]' : 'text-[#E5E5E5]'} transition group-hover:scale-110`} />
            <span className="font-black text-[#FF4B4B]">
              {hearts}/{maxHearts}
            </span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Silenciar sonido' : 'Activar sonido'}
            className="p-2 rounded-xl text-[#777777] hover:text-[#4B4B4B] hover:bg-[#F7F7F7] border-2 border-transparent hover:border-[#E5E5E5] transition"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
