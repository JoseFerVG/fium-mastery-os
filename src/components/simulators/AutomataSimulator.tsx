import React, { useState } from 'react';
import { GitBranch, Play, RotateCcw, Check, X, ArrowRight, CornerDownRight } from 'lucide-react';

interface DFA {
  name: string;
  description: string;
  alphabet: string[];
  states: string[];
  initialState: string;
  acceptStates: string[];
  transitions: Record<string, Record<string, string>>; // state -> symbol -> nextState
}

const DFAS: DFA[] = [
  {
    name: 'Cadenas que terminan en "01"',
    description: 'Acepta cualquier cadena binaria cuyo sufijo sea 01 (ej: 01, 101, 11001).',
    alphabet: ['0', '1'],
    states: ['q0', 'q1', 'q2'],
    initialState: 'q0',
    acceptStates: ['q2'],
    transitions: {
      q0: { '0': 'q1', '1': 'q0' },
      q1: { '0': 'q1', '1': 'q2' },
      q2: { '0': 'q1', '1': 'q0' }
    }
  },
  {
    name: 'Número par de ceros (0s)',
    description: 'Acepta cadenas con 0, 2, 4, 6... ceros, sin importar el número de unos.',
    alphabet: ['0', '1'],
    states: ['qPAR', 'qIMPAR'],
    initialState: 'qPAR',
    acceptStates: ['qPAR'],
    transitions: {
      qPAR: { '0': 'qIMPAR', '1': 'qPAR' },
      qIMPAR: { '0': 'qPAR', '1': 'qIMPAR' }
    }
  },
  {
    name: 'Contiene la subcadena "abb"',
    description: 'Sobre el alfabeto {a, b}, reconoce cadenas que contengan "abb".',
    alphabet: ['a', 'b'],
    states: ['q0', 'qA', 'qAB', 'qABB'],
    initialState: 'q0',
    acceptStates: ['qABB'],
    transitions: {
      q0: { 'a': 'qA', 'b': 'q0' },
      qA: { 'a': 'qA', 'b': 'qAB' },
      qAB: { 'a': 'qA', 'b': 'qABB' },
      qABB: { 'a': 'qABB', 'b': 'qABB' }
    }
  }
];

export const AutomataSimulator: React.FC = () => {
  const [selectedDfaIndex, setSelectedDfaIndex] = useState<number>(0);
  const [inputString, setInputString] = useState<string>('1001');
  const [currentStep, setCurrentStep] = useState<number>(0);

  const dfa = DFAS[selectedDfaIndex];

  // Compute transition trace
  const computeTrace = () => {
    let currentState = dfa.initialState;
    const history = [{ state: currentState, symbolRead: '', step: 0 }];

    for (let i = 0; i < inputString.length; i++) {
      const sym = inputString[i];
      if (dfa.transitions[currentState] && dfa.transitions[currentState][sym]) {
        currentState = dfa.transitions[currentState][sym];
        history.push({ state: currentState, symbolRead: sym, step: i + 1 });
      } else {
        break;
      }
    }
    return history;
  };

  const trace = computeTrace();
  const currentItem = trace[Math.min(currentStep, trace.length - 1)];
  const isFinished = currentStep >= inputString.length;
  const isAccepted = isFinished && dfa.acceptStates.includes(currentItem.state);

  const handleNextStep = () => {
    if (currentStep < inputString.length) {
      setCurrentStep(s => s + 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center gap-2 mb-6">
        <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
          <GitBranch className="w-5 h-5" />
        </span>
        <div>
          <h3 className="text-xl font-bold text-white">Simulador Interactivo de Autómatas Finitos (ALF)</h3>
          <p className="text-sm text-slate-400">Prueba cadenas paso a paso y visualiza la cinta de lectura y los estados activos.</p>
        </div>
      </div>

      {/* Preset Automata Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {DFAS.map((item, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSelectedDfaIndex(idx);
              setInputString(idx === 2 ? 'ababb' : '1001');
              setCurrentStep(0);
            }}
            className={`p-3 text-left rounded-xl border transition ${
              selectedDfaIndex === idx
                ? 'bg-emerald-600/15 border-emerald-500 text-white'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="font-semibold text-sm text-emerald-300">{item.name}</div>
            <div className="text-xs text-slate-400 mt-1">{item.description}</div>
          </button>
        ))}
      </div>

      {/* Input Tape & Controls */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-auto flex-1">
            <label className="text-xs font-semibold text-slate-400 block mb-1">
              Cadena de entrada (Alfabeto permitido: {dfa.alphabet.join(', ')}):
            </label>
            <input
              type="text"
              value={inputString}
              onChange={e => {
                setInputString(e.target.value);
                setCurrentStep(0);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 font-mono text-sm text-white focus:border-emerald-500 outline-none"
              placeholder="Introduce cadena..."
            />
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reiniciar
            </button>
            <button
              onClick={handleNextStep}
              disabled={isFinished}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold rounded-lg shadow-lg shadow-emerald-600/20 transition"
            >
              Leer Siguiente Símbolo <Play className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Visual Tape Display */}
        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <div className="text-xs text-slate-400 mb-2 font-semibold">Cinta de Entrada (Cabezal de lectura):</div>
          <div className="flex gap-2 font-mono overflow-x-auto pb-2">
            {inputString.split('').map((char, idx) => {
              const isPast = idx < currentStep;
              const isCurrent = idx === currentStep;

              return (
                <div
                  key={idx}
                  className={`w-10 h-12 flex flex-col items-center justify-center rounded-lg border text-base font-bold transition-all ${
                    isCurrent
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 ring-2 ring-emerald-500/40 -translate-y-1'
                      : isPast
                      ? 'bg-slate-900 border-slate-800 text-slate-500'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <span>{char}</span>
                  {isCurrent && <span className="text-[10px] text-emerald-400 font-normal">▲</span>}
                </div>
              );
            })}
            <div className="w-10 h-12 flex items-center justify-center rounded-lg border border-dashed border-slate-800 text-slate-600 font-bold">
              λ
            </div>
          </div>
        </div>
      </div>

      {/* State Graph Visualizer (Nodes) */}
      <div className="mb-6">
        <div className="text-xs font-semibold text-slate-400 mb-2">Estados del Autómata:</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {dfa.states.map(state => {
            const isActive = currentItem.state === state;
            const isInitial = dfa.initialState === state;
            const isAccept = dfa.acceptStates.includes(state);

            return (
              <div
                key={state}
                className={`p-4 rounded-xl border text-center transition-all ${
                  isActive
                    ? 'bg-emerald-500/20 border-emerald-400 ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-500/20 scale-105'
                    : 'bg-slate-950 border-slate-800/80 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 font-mono font-bold text-lg text-white">
                  {isInitial && <ArrowRight className="w-4 h-4 text-emerald-400 inline" />}
                  <span>{state}</span>
                  {isAccept && <span className="text-xs text-emerald-400 ml-1 font-sans px-1.5 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/30">FINAL</span>}
                </div>
                <div className="text-[11px] text-slate-500 mt-2 font-mono">
                  {dfa.alphabet.map(sym => (
                    <div key={sym}>
                      con '{sym}' &rarr; <span className="text-slate-300">{dfa.transitions[state][sym]}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Result Status Banner */}
      {isFinished && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-sm font-bold ${
            isAccepted
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {isAccepted ? <Check className="w-5 h-5 text-emerald-400" /> : <X className="w-5 h-5 text-rose-400" />}
            <span>
              Resultado final: La cadena "{inputString}" ha sido{' '}
              <strong className="underline">{isAccepted ? 'ACEPTADA' : 'RECHAZADA'}</strong> por el autómata.
            </span>
          </div>
          <span className="text-xs opacity-80 font-mono">Estado final: {currentItem.state}</span>
        </div>
      )}
    </div>
  );
};
