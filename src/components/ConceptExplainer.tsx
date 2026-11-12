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
    <div className="space-y-6 font-sans">
      {/* Top Banner & Mastery Controller */}
      <div className="duo-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b-2 border-[#E5E5E5]">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <BadgePill variant="rose">
                {concept.importance}
              </BadgePill>
              <BadgePill variant="slate">
                Dificultad: {concept.difficulty}
              </BadgePill>
              <span className="flex items-center gap-1 text-xs text-[#777777] font-bold">
                <Clock className="w-3.5 h-3.5" /> {concept.timeEstimateMin} min de estudio
              </span>
              {concept.interactiveDemoId && (
                <BadgePill variant="indigo" pulse icon={<Cpu className="w-3.5 h-3.5" />}>
                  Laboratorio Práctico
                </BadgePill>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#4B4B4B] tracking-tight">{concept.title}</h2>
            <p className="text-xs sm:text-sm text-[#777777] font-bold mt-1 leading-relaxed">{concept.subtitle}</p>
          </div>

          {/* Semáforo de Dominio Personal */}
          <div className="bg-[#F7F7F7] p-2 rounded-2xl border-2 border-[#E5E5E5] flex items-center gap-1.5 self-start md:self-auto shrink-0">
            <span className="text-xs font-black text-[#777777] px-2 uppercase">Tu Nivel:</span>
            <button
              onClick={() => handleStatusSelect('red')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition border-2 border-b-4 ${
                masteryStatus === 'red'
                  ? 'bg-[#FF4B4B] text-white border-[#EA2B2B]'
                  : 'bg-white text-[#777777] border-[#E5E5E5]'
              }`}
            >
              🔴 Pendiente
            </button>
            <button
              onClick={() => handleStatusSelect('yellow')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition border-2 border-b-4 ${
                masteryStatus === 'yellow'
                  ? 'bg-[#FFC800] text-white border-[#E5A500]'
                  : 'bg-white text-[#777777] border-[#E5E5E5]'
              }`}
            >
              🟡 En Progreso
            </button>
            <button
              onClick={() => handleStatusSelect('green')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition border-2 border-b-4 ${
                masteryStatus === 'green'
                  ? 'bg-[#58CC02] text-white border-[#58A700]'
                  : 'bg-white text-[#777777] border-[#E5E5E5]'
              }`}
            >
              🟢 Dominado (+50 XP)
            </button>
          </div>
        </div>

        {/* The Feynman Breakdown Box */}
        <div className="space-y-6">
          {/* 1. Intuition & Analogy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#E5F6FD] border-2 border-[#84D8FF] p-5 rounded-3xl">
              <div className="flex items-center gap-2 text-[#1CB0F6] font-black text-sm mb-2">
                <Lightbulb className="w-5 h-5 text-[#1CB0F6]" />
                <span>1. Intuición Rápida (Método Feynman):</span>
              </div>
              <p className="text-[#4B4B4B] text-xs sm:text-sm font-bold leading-relaxed">
                {concept.feynmanExplanation.intuition}
              </p>
            </div>

            <div className="bg-[#F5EAFF] border-2 border-[#E8C8FF] p-5 rounded-3xl">
              <div className="flex items-center gap-2 text-[#CE82FF] font-black text-sm mb-2">
                <Sparkles className="w-5 h-5 text-[#CE82FF]" />
                <span>Analogía del Mundo Real:</span>
              </div>
              <p className="text-[#4B4B4B] text-xs sm:text-sm font-bold leading-relaxed italic">
                "{concept.feynmanExplanation.analogy}"
              </p>
            </div>
          </div>

          {/* 2. Formal Theory & Rigorous Engineering */}
          <div className="bg-[#F7F7F7] border-2 border-[#E5E5E5] p-5 rounded-3xl">
            <div className="flex items-center gap-2 text-[#4B4B4B] font-black text-sm mb-2">
              <BookOpen className="w-5 h-5 text-[#1CB0F6]" />
              <span>2. Teoría Formal & Rigor de Examen:</span>
            </div>
            <p className="text-[#4B4B4B] text-xs sm:text-sm font-bold leading-relaxed whitespace-pre-line">
              {concept.feynmanExplanation.formalTheory}
            </p>

            {concept.feynmanExplanation.keyFormulasOrRules && (
              <div className="mt-4 pt-4 border-t-2 border-[#E5E5E5]">
                <span className="text-xs font-black text-[#777777] uppercase tracking-wider block mb-2">
                  Reglas de Oro / Fórmulas Clave:
                </span>
                <ul className="space-y-2">
                  {concept.feynmanExplanation.keyFormulasOrRules.map((rule, idx) => (
                    <li key={idx} className="text-xs sm:text-sm text-[#1899D6] font-mono font-bold flex items-start gap-2 bg-[#E5F6FD] p-3 rounded-2xl border border-[#84D8FF]">
                      <span className="text-[#1CB0F6] font-black">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 3. Code or Concrete Example if present */}
          {concept.codeOrExample && (
            <div className="bg-[#1E293B] border-2 border-[#334155] rounded-3xl overflow-hidden shadow-sm">
              <div className="px-5 py-3 bg-[#0F172A] border-b border-[#334155] flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-slate-200 flex items-center gap-2">
                  <Code className="w-4 h-4 text-[#58CC02]" />
                  Ejemplo en Código ({concept.codeOrExample.language}):
                </span>

                <button
                  onClick={() => handleCopyCode(concept.codeOrExample!.code)}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer"
                  title="Copiar código"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#58CC02]" />
                      <span className="text-[#58CC02] font-mono">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-5 text-xs font-mono text-[#58CC02] bg-[#1E293B] overflow-x-auto selection:bg-emerald-900 selection:text-white">
                <code>{concept.codeOrExample.code}</code>
              </pre>
              <div className="p-3.5 bg-[#0F172A] border-t border-[#334155] text-xs text-slate-400">
                <strong className="text-white">Explicación:</strong> {concept.codeOrExample.explanation}
              </div>
            </div>
          )}

          {/* 4. Common Exam Pitfalls */}
          <div className="bg-[#FFF0F0] border-2 border-b-4 border-[#FFD0D0] p-5 rounded-3xl">
            <div className="flex items-center gap-2 text-[#EA2B2B] font-black text-sm mb-2">
              <AlertTriangle className="w-5 h-5 text-[#FF4B4B]" />
              <span>3. Trampas Típicas de Examen:</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-[#EA2B2B] font-bold mt-3">
              {concept.feynmanExplanation.examPitfalls.map((pitfall, idx) => (
                <li key={idx} className="flex items-start gap-2.5 bg-white p-3 rounded-2xl border border-[#FFD0D0]">
                  <span className="text-[#FF4B4B] font-black text-sm">✕</span>
                  <span>{pitfall}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Embedded Interactive Simulators */}
      {concept.interactiveDemoId && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-black text-[#1CB0F6] uppercase tracking-wider">
            <Cpu className="w-4 h-4 stroke-[2.5]" /> Laboratorio Práctico Integrado
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
