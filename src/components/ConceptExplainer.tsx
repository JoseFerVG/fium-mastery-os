import React from 'react';
import { Concept } from '../types';
import { Lightbulb, BookOpen, AlertTriangle, CheckCircle, Code, Play, Clock, Sparkles } from 'lucide-react';
import { PipelineSimulator } from './simulators/PipelineSimulator';
import { CacheCalculator } from './simulators/CacheCalculator';
import { AutomataSimulator } from './simulators/AutomataSimulator';
import { MemoryVirtualSimulator } from './simulators/MemoryVirtualSimulator';
import { SolidDoctor } from './simulators/SolidDoctor';

interface ConceptExplainerProps {
  concept: Concept;
  masteryStatus: 'red' | 'yellow' | 'green';
  onStatusChange: (newStatus: 'red' | 'yellow' | 'green') => void;
}

export const ConceptExplainer: React.FC<ConceptExplainerProps> = ({
  concept,
  masteryStatus,
  onStatusChange
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner & Mastery Controller */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
                {concept.importance}
              </span>
              <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-xs font-medium">
                Dificultad: {concept.difficulty}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5" /> {concept.timeEstimateMin} min de estudio
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">{concept.title}</h2>
            <p className="text-sm text-slate-400 mt-1">{concept.subtitle}</p>
          </div>

          {/* Semáforo de Dominio Personal */}
          <div className="bg-slate-950 p-2 rounded-2xl border border-slate-800 flex items-center gap-1 self-start md:self-auto">
            <span className="text-xs font-bold text-slate-400 px-2">Tu Nivel:</span>
            <button
              onClick={() => onStatusChange('red')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                masteryStatus === 'red'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🔴 Bloqueado
            </button>
            <button
              onClick={() => onStatusChange('yellow')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                masteryStatus === 'yellow'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🟡 En Proceso
            </button>
            <button
              onClick={() => onStatusChange('green')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                masteryStatus === 'green'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🟢 Dominado (10)
            </button>
          </div>
        </div>

        {/* 1. Feynman Intuition Card */}
        <div className="mt-6 space-y-6">
          <div className="bg-gradient-to-br from-indigo-950/40 to-slate-950 p-6 rounded-2xl border border-indigo-500/20">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm mb-3">
              <Lightbulb className="w-5 h-5" />
              <span>1. La Intuición Humana (Método Feynman):</span>
            </div>
            <p className="text-slate-200 text-sm leading-relaxed mb-4">
              {concept.feynmanExplanation.intuition}
            </p>
            <div className="bg-slate-900/90 p-4 rounded-xl border border-indigo-500/30 text-xs text-indigo-200 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-bold mb-0.5">Analogía Práctica:</strong>
                {concept.feynmanExplanation.analogy}
              </div>
            </div>
          </div>

          {/* 2. Formal Theory Card */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-3">
              <BookOpen className="w-5 h-5" />
              <span>2. Teoría Formal & Rigor Académico (Para el 10 en Examen):</span>
            </div>
            <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {concept.feynmanExplanation.formalTheory}
            </div>

            {concept.feynmanExplanation.keyFormulasOrRules && (
              <div className="mt-4 pt-4 border-t border-slate-800/80">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Reglas de Oro:
                </div>
                <ul className="space-y-1.5 text-xs text-emerald-300 font-mono">
                  {concept.feynmanExplanation.keyFormulasOrRules.map((r, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 3. Code Example if present */}
          {concept.codeOrExample && (
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden font-mono text-xs">
              <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-2 font-bold font-sans">
                  <Code className="w-4 h-4 text-indigo-400" /> Ejemplo de Código ({concept.codeOrExample.language})
                </span>
              </div>
              <pre className="p-4 text-slate-300 overflow-x-auto leading-relaxed">
                {concept.codeOrExample.code}
              </pre>
              <div className="p-3 bg-slate-900/60 border-t border-slate-800/80 text-xs text-slate-400 font-sans">
                {concept.codeOrExample.explanation}
              </div>
            </div>
          )}

          {/* 4. Common Exam Pitfalls */}
          <div className="bg-rose-950/20 border border-rose-900/40 p-5 rounded-2xl">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm mb-2">
              <AlertTriangle className="w-5 h-5" />
              <span>3. Trampas Típicas de Examen (Donde los profesores quitan puntos):</span>
            </div>
            <ul className="space-y-2 text-xs text-rose-200/90 mt-3">
              {concept.feynmanExplanation.examPitfalls.map((pitfall, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>{pitfall}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Embedded Interactive Simulator if concept has one */}
      {concept.interactiveDemoId === 'pipeline' && <PipelineSimulator />}
      {concept.interactiveDemoId === 'cache' && <CacheCalculator />}
      {concept.interactiveDemoId === 'automata' && <AutomataSimulator />}
      {concept.interactiveDemoId === 'virtual-memory' && <MemoryVirtualSimulator />}
      {concept.interactiveDemoId === 'solid-doctor' && <SolidDoctor />}
    </div>
  );
};
