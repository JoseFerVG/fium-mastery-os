import React, { useState } from 'react';
import { Layers, Play, RotateCcw, CheckCircle, AlertOctagon, HelpCircle } from 'lucide-react';

export const MemoryVirtualSimulator: React.FC = () => {
  const [numFrames, setNumFrames] = useState<number>(3);
  const [algorithm, setAlgorithm] = useState<'fifo' | 'lru' | 'clock'>('lru');
  const [refString, setRefString] = useState<string>('7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2');
  const [currentStep, setCurrentStep] = useState<number>(0);

  const pages = refString
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !isNaN(Number(s)))
    .map(Number);

  // Compute simulation steps
  const computeSimulation = () => {
    const history: {
      step: number;
      page: number;
      frames: (number | null)[];
      isFault: boolean;
      victimPage?: number | null;
      hitIndex?: number;
    }[] = [];

    const frames: (number | null)[] = Array(numFrames).fill(null);
    const lastUsedTime: Record<number, number> = {};
    const fifoQueue: number[] = [];
    const useBits: Record<number, number> = {};
    let clockHand = 0;

    pages.forEach((page, stepIdx) => {
      const existingIdx = frames.indexOf(page);
      if (existingIdx !== -1) {
        // HIT
        lastUsedTime[page] = stepIdx;
        useBits[page] = 1;
        history.push({
          step: stepIdx + 1,
          page,
          frames: [...frames],
          isFault: false,
          hitIndex: existingIdx
        });
      } else {
        // PAGE FAULT
        let victim: number | null = null;
        const emptyIdx = frames.indexOf(null);

        if (emptyIdx !== -1) {
          // Free frame available
          frames[emptyIdx] = page;
          fifoQueue.push(page);
          lastUsedTime[page] = stepIdx;
          useBits[page] = 1;
        } else {
          // Replacement needed
          if (algorithm === 'fifo') {
            victim = fifoQueue.shift()!;
            const victIdx = frames.indexOf(victim);
            frames[victIdx] = page;
            fifoQueue.push(page);
          } else if (algorithm === 'lru') {
            // Find page with smallest lastUsedTime
            let oldestPage = frames[0]!;
            let oldestTime = lastUsedTime[oldestPage] ?? -1;

            frames.forEach(f => {
              if (f !== null && (lastUsedTime[f] ?? -1) < oldestTime) {
                oldestTime = lastUsedTime[f] ?? -1;
                oldestPage = f;
              }
            });

            victim = oldestPage;
            const victIdx = frames.indexOf(victim);
            frames[victIdx] = page;
            lastUsedTime[page] = stepIdx;
          } else if (algorithm === 'clock') {
            while (true) {
              const currentFramePage = frames[clockHand]!;
              if (useBits[currentFramePage] === 0) {
                victim = currentFramePage;
                frames[clockHand] = page;
                useBits[page] = 1;
                clockHand = (clockHand + 1) % numFrames;
                break;
              } else {
                useBits[currentFramePage] = 0;
                clockHand = (clockHand + 1) % numFrames;
              }
            }
          }
        }

        history.push({
          step: stepIdx + 1,
          page,
          frames: [...frames],
          isFault: true,
          victimPage: victim
        });
      }
    });

    return history;
  };

  const simSteps = computeSimulation();
  const currentStepData = simSteps[Math.min(currentStep, simSteps.length - 1)];
  const totalFaults = simSteps.slice(0, currentStep).filter(s => s.isFault).length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center gap-2 mb-6">
        <span className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
          <Layers className="w-5 h-5" />
        </span>
        <div>
          <h3 className="text-xl font-bold text-white">Simulador de Reemplazo de Páginas (ASO)</h3>
          <p className="text-sm text-slate-400">Comprueba paso a paso fallos de página con FIFO, LRU y el Algoritmo del Reloj.</p>
        </div>
      </div>

      {/* Settings Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1.5">Algoritmo de Reemplazo</label>
          <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['fifo', 'lru', 'clock'] as const).map(alg => (
              <button
                key={alg}
                onClick={() => { setAlgorithm(alg); setCurrentStep(0); }}
                className={`py-1.5 text-xs font-bold uppercase rounded-lg transition ${
                  algorithm === alg
                    ? 'bg-amber-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {alg}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1.5">Marcos de Memoria Física (Frames)</label>
          <select
            value={numFrames}
            onChange={e => { setNumFrames(Number(e.target.value)); setCurrentStep(0); }}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-500 outline-none"
          >
            <option value={3}>3 Marcos (Problema típico UMU)</option>
            <option value={4}>4 Marcos</option>
            <option value={5}>5 Marcos</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1.5">Cadena de Referencias</label>
          <input
            type="text"
            value={refString}
            onChange={e => { setRefString(e.target.value); setCurrentStep(0); }}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-white focus:border-amber-500 outline-none"
          />
        </div>
      </div>

      {/* Stepper Controls */}
      <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-xs font-semibold text-slate-400 block">Paso:</span>
            <span className="text-xl font-black text-amber-400 font-mono">{currentStep} / {pages.length}</span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <span className="text-xs font-semibold text-slate-400 block">Fallos de Página (Faults):</span>
            <span className="text-xl font-black text-rose-400 font-mono">{totalFaults}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentStep(0)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reiniciar
          </button>
          <button
            onClick={() => {
              if (currentStep < pages.length) setCurrentStep(s => s + 1);
            }}
            disabled={currentStep >= pages.length}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white text-xs font-bold rounded-lg shadow-lg shadow-amber-600/20 transition"
          >
            Avanzar Referencia <Play className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Reference Stream Display */}
      <div className="mb-6">
        <div className="text-xs font-semibold text-slate-400 mb-2">Secuencia de Páginas Solicitadas:</div>
        <div className="flex gap-2 overflow-x-auto pb-2 font-mono">
          {pages.map((p, idx) => {
            const isCurrent = idx === currentStep - 1;
            const isDone = idx < currentStep;
            const stepInfo = simSteps[idx];

            return (
              <div
                key={idx}
                className={`flex-shrink-0 w-11 h-14 rounded-xl border flex flex-col items-center justify-center transition-all ${
                  isCurrent
                    ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-500/50 -translate-y-1'
                    : isDone
                    ? stepInfo.isFault
                      ? 'bg-rose-950/30 border-rose-800/60 text-rose-300'
                      : 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                <span className="text-base font-bold">{p}</span>
                {isDone && (
                  <span className="text-[10px] font-bold">
                    {stepInfo.isFault ? 'F' : 'H'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Physical RAM Frames State */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6">
        <div className="text-xs font-semibold text-slate-400 mb-3">Estado de la RAM Física (Marcos de Página):</div>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {Array.from({ length: numFrames }).map((_, fIdx) => {
            const pageInFrame = currentStepData ? currentStepData.frames[fIdx] : null;
            const isJustLoaded = currentStepData?.isFault && pageInFrame === currentStepData.page;
            const isHit = !currentStepData?.isFault && currentStepData?.hitIndex === fIdx;

            return (
              <div
                key={fIdx}
                className={`p-4 rounded-xl border text-center font-mono transition ${
                  isJustLoaded
                    ? 'bg-rose-500/20 border-rose-500 ring-2 ring-rose-500/40'
                    : isHit
                    ? 'bg-emerald-500/20 border-emerald-500 ring-2 ring-emerald-500/40'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div className="text-[10px] text-slate-500 font-sans uppercase">Marco {fIdx}</div>
                <div className="text-2xl font-black mt-1">
                  {pageInFrame !== null && pageInFrame !== undefined ? (
                    <span className="text-white">Página {pageInFrame}</span>
                  ) : (
                    <span className="text-slate-600 text-base font-normal">Vacío</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Last Action Explanatory Box */}
      {currentStep > 0 && currentStepData && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center justify-between ${
            currentStepData.isFault
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
          }`}
        >
          <div>
            <strong>Paso {currentStep}:</strong> Solicitada la página{' '}
            <strong className="underline">{currentStepData.page}</strong>. Resultado:{' '}
            <strong>{currentStepData.isFault ? 'FALLO DE PÁGINA (PAGE FAULT)' : 'ACIERTO (HIT)'}</strong>.
            {currentStepData.victimPage !== null && currentStepData.victimPage !== undefined && (
              <span className="ml-1">
                Víctima desalojada por {algorithm.toUpperCase()}:{' '}
                <strong className="text-white">Página {currentStepData.victimPage}</strong>.
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
