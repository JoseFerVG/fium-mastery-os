import React, { useState } from 'react';
import { GitBranch, Play, RotateCcw, Check, X, ArrowRight, CornerDownRight } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

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
    <div className="duo-card p-6 sm:p-8 bg-white border-2 border-b-[6px] border-[#E5E5E5] text-[#4B4B4B] font-sans">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-[#E5E5E5]">
        <span className="p-2.5 bg-[#D7FFB8] text-[#58A700] rounded-2xl border-2 border-[#58CC02]">
          <GitBranch className="w-5 h-5 stroke-[2.5]" />
        </span>
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-[#4B4B4B]">Simulador de Autómatas Finitos (ALF)</h3>
          <p className="text-xs text-[#777777] font-bold mt-0.5">Prueba cadenas paso a paso y visualiza la cinta de lectura y los estados activos.</p>
        </div>
      </div>

      {/* Preset Automata Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {DFAS.map((item, idx) => (
          <button
            key={idx}
            onClick={() => {
              soundManager.playClick();
              setSelectedDfaIndex(idx);
              setInputString(idx === 2 ? 'ababb' : '1001');
              setCurrentStep(0);
            }}
            className={`p-4 text-left rounded-2xl border-2 border-b-4 transition cursor-pointer ${
              selectedDfaIndex === idx
                ? 'bg-[#D7FFB8] border-[#58CC02] text-[#58A700]'
                : 'bg-white border-[#E5E5E5] text-[#4B4B4B] hover:bg-[#F7F7F7]'
            }`}
          >
            <div className="font-black text-sm text-[#58A700]">{item.name}</div>
            <div className="text-xs text-[#777777] font-bold mt-1">{item.description}</div>
          </button>
        ))}
      </div>

      {/* Input Tape & Controls */}
      <div className="bg-[#F7F7F7] p-5 rounded-2xl border-2 border-[#E5E5E5] mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-auto flex-1">
            <label htmlFor="automata-input-string" className="text-xs font-black text-[#777777] block mb-1.5 uppercase tracking-wider">
              Cadena de entrada (Alfabeto permitido: {dfa.alphabet.join(', ')}):
            </label>
            <input
              id="automata-input-string"
              name="automataInputString"
              aria-label="Cadena de entrada para el autómata"
              autoComplete="off"
              type="text"
              value={inputString}
              onChange={e => {
                setInputString(e.target.value);
                setCurrentStep(0);
              }}
              className="w-full bg-white border-2 border-b-4 border-[#E5E5E5] rounded-xl px-4 py-2.5 font-mono text-sm text-[#4B4B4B] font-black focus:border-[#58CC02] outline-none transition"
              placeholder="Introduce cadena..."
            />
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              onClick={() => {
                soundManager.playClick();
                handleReset();
              }}
              className="duo-btn-white px-3.5 py-2 text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reiniciar
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                handleNextStep();
              }}
              disabled={isFinished}
              className="duo-btn-green px-4 py-2 text-xs"
            >
              Leer Siguiente <Play className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        </div>

        {/* Visual Tape Display */}
        <div className="mt-4 pt-4 border-t-2 border-[#E5E5E5]">
          <div className="text-xs text-[#777777] mb-2 font-black uppercase tracking-wider">Cinta de Entrada (Cabezal de lectura):</div>
          <div className="flex gap-2 font-mono overflow-x-auto pb-2">
            {inputString.split('').map((char, idx) => {
              const isPast = idx < currentStep;
              const isCurrent = idx === currentStep;

              return (
                <div
                  key={idx}
                  className={`w-12 h-14 flex flex-col items-center justify-center rounded-2xl border-2 text-base font-black transition-all ${
                    isCurrent
                      ? 'bg-[#D7FFB8] border-b-4 border-[#58CC02] text-[#58A700] ring-4 ring-[#58CC02]/20 -translate-y-1'
                      : isPast
                      ? 'bg-white border-[#E5E5E5] text-[#AFAFAF]'
                      : 'bg-white border-b-4 border-[#E5E5E5] text-[#4B4B4B]'
                  }`}
                >
                  <span>{char}</span>
                  {isCurrent && <span className="text-[10px] text-[#58A700] font-black leading-none">▲</span>}
                </div>
              );
            })}
            <div className="w-12 h-14 flex items-center justify-center rounded-2xl border-2 border-dashed border-[#CECECE] text-[#AFAFAF] font-black">
              λ
            </div>
          </div>
        </div>
      </div>

      {/* State Graph Visualizer (Nodes) */}
      <div className="mb-6">
        <div className="text-xs font-black text-[#777777] uppercase tracking-wider mb-2">Estados del Autómata:</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {dfa.states.map(state => {
            const isActive = currentItem.state === state;
            const isInitial = dfa.initialState === state;
            const isAccept = dfa.acceptStates.includes(state);

            return (
              <div
                key={state}
                className={`p-4 rounded-2xl border-2 text-center transition-all ${
                  isActive
                    ? 'bg-[#D7FFB8] border-b-4 border-[#58CC02] text-[#58A700] shadow-sm scale-105'
                    : 'bg-white border-b-4 border-[#E5E5E5] text-[#4B4B4B]'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 font-mono font-black text-lg text-[#4B4B4B]">
                  {isInitial && <ArrowRight className="w-4 h-4 text-[#58CC02] inline" />}
                  <span>{state}</span>
                  {isAccept && <span className="text-xs text-[#58A700] ml-1 font-sans px-2 py-0.5 bg-[#D7FFB8] rounded-full border border-[#58CC02] font-black">FINAL</span>}
                </div>
                <div className="text-[11px] text-[#777777] mt-2 font-mono font-bold">
                  {dfa.alphabet.map(sym => (
                    <div key={sym}>
                      con '{sym}' &rarr; <span className="text-[#1CB0F6]">{dfa.transitions[state][sym]}</span>
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
          className={`p-4 rounded-2xl border-2 border-b-4 flex items-center justify-between text-sm font-black ${
            isAccepted
              ? 'bg-[#D7FFB8] border-[#58CC02] text-[#58A700]'
              : 'bg-[#FFDFE0] border-[#FF4B4B] text-[#EA2B2B]'
          }`}
        >
          <div className="flex items-center gap-2">
            {isAccepted ? <Check className="w-5 h-5 text-[#58CC02] stroke-[3]" /> : <X className="w-5 h-5 text-[#FF4B4B] stroke-[3]" />}
            <span>
              Resultado final: La cadena "{inputString}" ha sido{' '}
              <strong className="underline">{isAccepted ? 'ACEPTADA' : 'RECHAZADA'}</strong> por el autómata.
            </span>
          </div>
          <span className="text-xs opacity-90 font-mono">Estado final: {currentItem.state}</span>
        </div>
      )}
    </div>
  );
};
