import React, { useState } from 'react';
import { Layers, Play, RotateCcw, CheckCircle, AlertOctagon, HelpCircle } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

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
    <div className="duo-card p-6 sm:p-8 bg-white border-2 border-b-[6px] border-[#E5E5E5] text-[#4B4B4B] font-sans">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-[#E5E5E5]">
        <span className="p-2.5 bg-[#FFF4D0] text-[#FF9600] rounded-2xl border-2 border-[#FFC800]">
          <Layers className="w-5 h-5 stroke-[2.5]" />
        </span>
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-[#4B4B4B]">Simulador de Reemplazo de Páginas (ASO)</h3>
          <p className="text-xs text-[#777777] font-bold mt-0.5">Comprueba paso a paso fallos de página con FIFO, LRU y el Algoritmo del Reloj.</p>
        </div>
      </div>

      {/* Settings Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-xs font-black text-[#777777] uppercase tracking-wider block mb-1.5">Algoritmo de Reemplazo</label>
          <div className="grid grid-cols-3 gap-1.5 bg-[#F7F7F7] p-1.5 rounded-2xl border-2 border-[#E5E5E5]">
            {(['fifo', 'lru', 'clock'] as const).map(alg => (
              <button
                key={alg}
                onClick={() => {
                  soundManager.playClick();
                  setAlgorithm(alg);
                  setCurrentStep(0);
                }}
                className={`py-2 text-xs font-black uppercase rounded-xl transition cursor-pointer border-2 border-b-4 ${
                  algorithm === alg
                    ? 'bg-[#FFF4D0] border-[#FFC800] text-[#E08500]'
                    : 'bg-white border-[#E5E5E5] text-[#777777] hover:bg-[#F7F7F7]'
                }`}
              >
                {alg}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="memory-frames-select" className="text-xs font-black text-[#777777] uppercase tracking-wider block mb-1.5">Marcos de Memoria Física (Frames)</label>
          <select
            id="memory-frames-select"
            name="memoryFrames"
            aria-label="Marcos de memoria física"
            value={numFrames}
            onChange={e => {
              soundManager.playClick();
              setNumFrames(Number(e.target.value));
              setCurrentStep(0);
            }}
            className="w-full bg-white border-2 border-b-4 border-[#E5E5E5] rounded-2xl px-4 py-2.5 text-xs font-black text-[#4B4B4B] focus:border-[#FF9600] outline-none transition"
          >
            <option value={3}>3 Marcos (Problema típico UMU)</option>
            <option value={4}>4 Marcos</option>
            <option value={5}>5 Marcos</option>
          </select>
        </div>

        <div>
          <label htmlFor="memory-ref-string" className="text-xs font-black text-[#777777] uppercase tracking-wider block mb-1.5">Cadena de Referencias</label>
          <input
            id="memory-ref-string"
            name="memoryRefString"
            aria-label="Cadena de referencias de páginas solicitadas"
            autoComplete="off"
            type="text"
            value={refString}
            onChange={e => {
              setRefString(e.target.value);
              setCurrentStep(0);
            }}
            className="w-full bg-white border-2 border-b-4 border-[#E5E5E5] rounded-2xl px-4 py-2.5 text-xs font-mono font-black text-[#4B4B4B] focus:border-[#FF9600] outline-none transition"
          />
        </div>
      </div>

      {/* Stepper Controls */}
      <div className="flex items-center justify-between bg-[#F7F7F7] p-4 rounded-2xl border-2 border-[#E5E5E5] mb-6">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-[11px] font-black text-[#777777] uppercase tracking-wider block">Paso:</span>
            <span className="text-xl font-black text-[#FF9600] font-mono">{currentStep} / {pages.length}</span>
          </div>
          <div className="h-8 w-px bg-[#E5E5E5]" />
          <div>
            <span className="text-[11px] font-black text-[#777777] uppercase tracking-wider block">Fallos de Página (Faults):</span>
            <span className="text-xl font-black text-[#FF4B4B] font-mono">{totalFaults}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundManager.playClick();
              setCurrentStep(0);
            }}
            className="duo-btn-white px-3.5 py-2 text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reiniciar
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              if (currentStep < pages.length) setCurrentStep(s => s + 1);
            }}
            disabled={currentStep >= pages.length}
            className="duo-btn-blue px-4 py-2 text-xs"
          >
            Avanzar Referencia <Play className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
      </div>

      {/* Reference Stream Display */}
      <div className="mb-6">
        <div className="text-xs font-black text-[#777777] uppercase tracking-wider mb-2">Secuencia de Páginas Solicitadas:</div>
        <div className="flex gap-2 overflow-x-auto pb-2 font-mono">
          {pages.map((p, idx) => {
            const isCurrent = idx === currentStep - 1;
            const isDone = idx < currentStep;
            const stepInfo = simSteps[idx];

            return (
              <div
                key={idx}
                className={`flex-shrink-0 w-12 h-16 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${
                  isCurrent
                    ? 'bg-[#FFF4D0] border-b-4 border-[#FFC800] text-[#E08500] ring-4 ring-[#FF9600]/30 -translate-y-1'
                    : isDone
                    ? stepInfo.isFault
                      ? 'bg-[#FFDFE0] border-b-4 border-[#FF4B4B] text-[#EA2B2B]'
                      : 'bg-[#D7FFB8] border-b-4 border-[#58CC02] text-[#58A700]'
                    : 'bg-white border-b-4 border-[#E5E5E5] text-[#AFAFAF]'
                }`}
              >
                <span className="text-base font-black">{p}</span>
                {isDone && (
                  <span className="text-[10px] font-black">
                    {stepInfo.isFault ? 'F' : 'H'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Physical RAM Frames State */}
      <div className="bg-[#F7F7F7] p-5 rounded-2xl border-2 border-[#E5E5E5] mb-6">
        <div className="text-xs font-black text-[#777777] uppercase tracking-wider mb-3">Estado de la RAM Física (Marcos de Página):</div>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {Array.from({ length: numFrames }).map((_, fIdx) => {
            const pageInFrame = currentStepData ? currentStepData.frames[fIdx] : null;
            const isJustLoaded = currentStepData?.isFault && pageInFrame === currentStepData.page;
            const isHit = !currentStepData?.isFault && currentStepData?.hitIndex === fIdx;

            return (
              <div
                key={fIdx}
                className={`p-4 rounded-2xl border-2 border-b-4 text-center font-mono transition ${
                  isJustLoaded
                    ? 'bg-[#FFDFE0] border-[#FF4B4B] text-[#EA2B2B]'
                    : isHit
                    ? 'bg-[#D7FFB8] border-[#58CC02] text-[#58A700]'
                    : 'bg-white border-[#E5E5E5] text-[#4B4B4B]'
                }`}
              >
                <div className="text-[10px] text-[#AFAFAF] font-sans font-black uppercase">Marco {fIdx}</div>
                <div className="text-2xl font-black mt-1">
                  {pageInFrame !== null && pageInFrame !== undefined ? (
                    <span className="text-[#4B4B4B]">Pág {pageInFrame}</span>
                  ) : (
                    <span className="text-[#CECECE] text-base font-normal">Vacío</span>
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
          className={`p-4 rounded-2xl border-2 border-b-4 text-xs font-black flex items-center justify-between ${
            currentStepData.isFault
              ? 'bg-[#FFDFE0] border-[#FF4B4B] text-[#EA2B2B]'
              : 'bg-[#D7FFB8] border-[#58CC02] text-[#58A700]'
          }`}
        >
          <div>
            <strong>Paso {currentStep}:</strong> Solicitada la página{' '}
            <strong className="underline">{currentStepData.page}</strong>. Resultado:{' '}
            <strong>{currentStepData.isFault ? 'FALLO DE PÁGINA (PAGE FAULT)' : 'ACIERTO (HIT)'}</strong>.
            {currentStepData.victimPage !== null && currentStepData.victimPage !== undefined && (
              <span className="ml-1">
                Víctima desalojada por {algorithm.toUpperCase()}:{' '}
                <strong className="text-[#4B4B4B]">Página {currentStepData.victimPage}</strong>.
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
