import React, { useState } from 'react';
import { Concept } from '../types';
import { 
  Lightbulb, 
  BookOpen, 
  AlertTriangle, 
  Code, 
  Clock, 
  Sparkles, 
  Copy, 
  Check, 
  Cpu 
} from 'lucide-react';
import { PipelineSimulator } from './simulators/PipelineSimulator';
import { CacheCalculator } from './simulators/CacheCalculator';
import { AutomataSimulator } from './simulators/AutomataSimulator';
import { MemoryVirtualSimulator } from './simulators/MemoryVirtualSimulator';
import { SolidDoctor } from './simulators/SolidDoctor';
import { CpuSchedulerSimulator } from './simulators/CpuSchedulerSimulator';
import { SubnetCalculator } from './simulators/SubnetCalculator';
import { RsaCryptolab } from './simulators/RsaCryptolab';
import { AStarSearchVisualizer } from './simulators/AStarSearchVisualizer';
import { DecisionTreePlayground } from './simulators/DecisionTreePlayground';
import { SpotlightCard } from './ui/SpotlightCard';
import { BadgePill } from './ui/BadgePill';
import { soundManager } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

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
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    soundManager.playClick();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleStatusSelect = (status: 'red' | 'yellow' | 'green') => {
    if (status === 'green') {
      soundManager.playCorrect();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } else if (status === 'yellow') {
      soundManager.playClick();
    } else {
      soundManager.playIncorrect();
    }
    onStatusChange(status);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Mastery Controller */}
      <SpotlightCard 
        spotlightColor="rgba(99, 102, 241, 0.16)"
        className="p-6 sm:p-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <BadgePill variant="rose">
                {concept.importance}
              </BadgePill>
              <BadgePill variant="slate">
                Dificultad: {concept.difficulty}
              </BadgePill>
              <span className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                <Clock className="w-3.5 h-3.5" /> {concept.timeEstimateMin} min de estudio
              </span>
              {concept.interactiveDemoId && (
                <BadgePill variant="indigo" pulse icon={<Cpu className="w-3.5 h-3.5" />}>
                  Laboratorio Interactivo Disponible
                </BadgePill>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{concept.title}</h2>
            <p className="text-sm text-slate-300 mt-1 leading-relaxed">{concept.subtitle}</p>
          </div>

          {/* Semáforo de Dominio Personal */}
          <div className="bg-slate-950 p-2 rounded-2xl border border-slate-800 flex items-center gap-1 self-start md:self-auto shrink-0 shadow-inner">
            <span className="text-xs font-bold text-slate-400 px-2 font-mono">Tu Nivel:</span>
            <button
              onClick={() => handleStatusSelect('red')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                masteryStatus === 'red'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🔴 Bloqueado
            </button>
            <button
              onClick={() => handleStatusSelect('yellow')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                masteryStatus === 'yellow'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🟡 En Progreso
            </button>
            <button
              onClick={() => handleStatusSelect('green')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                masteryStatus === 'green'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-1 ring-emerald-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🟢 Dominado (+50 XP)
            </button>
          </div>
        </div>

        {/* The Feynman Breakdown Box */}
        <div className="pt-6 space-y-6">
          {/* 1. Intuition & Analogy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/80 border border-slate-800/90 p-5 rounded-2xl shadow-md">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm mb-2">
                <Lightbulb className="w-5 h-5 text-indigo-400" />
                <span>1. Intuición Rápida (Explicado para tu abuela):</span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {concept.feynmanExplanation.intuition}
              </p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/90 p-5 rounded-2xl shadow-md">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm mb-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span>Analogía del Mundo Real:</span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed italic">
                "{concept.feynmanExplanation.analogy}"
              </p>
            </div>
          </div>

          {/* 2. Formal Theory & Rigorous Engineering */}
          <div className="bg-slate-950/80 border border-slate-800/90 p-5 rounded-2xl shadow-md">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm mb-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <span>2. Teoría Formal & Rigor de Examen:</span>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
              {concept.feynmanExplanation.formalTheory}
            </p>

            {concept.feynmanExplanation.keyFormulasOrRules && (
              <div className="mt-4 pt-4 border-t border-slate-800/80">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 font-mono">
                  Reglas de Oro / Fórmulas Clave:
                </span>
                <ul className="space-y-2">
                  {concept.feynmanExplanation.keyFormulasOrRules.map((rule, idx) => (
                    <li key={idx} className="text-xs sm:text-sm text-indigo-300 flex items-start gap-2 font-mono bg-indigo-950/30 p-2.5 rounded-xl border border-indigo-500/20">
                      <span className="text-indigo-400 font-bold">&bull;</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 3. Code or Concrete Example if present */}
          {concept.codeOrExample && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
              <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-slate-300 flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-emerald-400" />
                  Ejemplo en Código ({concept.codeOrExample.language}):
                </span>

                <button
                  onClick={() => handleCopyCode(concept.codeOrExample!.code)}
                  className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                  title="Copiar código"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-mono">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-emerald-300 bg-slate-950 overflow-x-auto selection:bg-emerald-900 selection:text-white">
                <code>{concept.codeOrExample.code}</code>
              </pre>
              <div className="p-3 bg-slate-900/60 border-t border-slate-800 text-[11px] text-slate-400">
                <strong className="text-slate-300">Explicación del snippet:</strong> {concept.codeOrExample.explanation}
              </div>
            </div>
          )}

          {/* 4. Common Exam Pitfalls */}
          <div className="bg-rose-950/20 border border-rose-900/40 p-5 rounded-2xl shadow-md">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm mb-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <span>3. Trampas Típicas de Examen (Donde los profesores quitan puntos):</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-rose-200/90 mt-3">
              {concept.feynmanExplanation.examPitfalls.map((pitfall, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-rose-950/30 p-2.5 rounded-xl border border-rose-500/20">
                  <span className="text-rose-400 font-bold text-sm">✕</span>
                  <span>{pitfall}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SpotlightCard>

      {/* Embedded Interactive Simulators with Anchor */}
      {concept.interactiveDemoId && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
            <Cpu className="w-4 h-4" /> Laboratorio Práctico Integrado
          </div>
          {concept.interactiveDemoId === 'pipeline' && <PipelineSimulator />}
          {concept.interactiveDemoId === 'cache' && <CacheCalculator />}
          {concept.interactiveDemoId === 'automata' && <AutomataSimulator />}
          {concept.interactiveDemoId === 'virtual-memory' && <MemoryVirtualSimulator />}
          {concept.interactiveDemoId === 'solid-doctor' && <SolidDoctor />}
          {concept.interactiveDemoId === 'cpu-scheduler' && <CpuSchedulerSimulator />}
          {concept.interactiveDemoId === 'subnet-calc' && <SubnetCalculator />}
          {concept.interactiveDemoId === 'rsa-crypto' && <RsaCryptolab />}
          {concept.interactiveDemoId === 'astar-search' && <AStarSearchVisualizer />}
          {concept.interactiveDemoId === 'decision-tree' && <DecisionTreePlayground />}
        </div>
      )}
    </div>
  );
};
