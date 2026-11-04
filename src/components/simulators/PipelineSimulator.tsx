import React, { useState } from 'react';
import { Play, RotateCcw, AlertTriangle, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

interface Instruction {
  id: number;
  text: string;
  destReg?: string;
  srcRegs?: string[];
  type: 'alu' | 'load' | 'store' | 'branch';
}

const PRESET_PROGRAMS: { name: string; desc: string; instructions: Instruction[] }[] = [
  {
    name: 'RAW Hazard con Forwarding Resuelto',
    desc: 'ADD escribe en $t1, y SUB lo lee en el ciclo siguiente. Con Forwarding no hay paradas.',
    instructions: [
      { id: 1, text: 'ADD $t1, $s0, $s1', destReg: '$t1', srcRegs: ['$s0', '$s1'], type: 'alu' },
      { id: 2, text: 'SUB $t2, $t1, $s2', destReg: '$t2', srcRegs: ['$t1', '$s2'], type: 'alu' },
      { id: 3, text: 'AND $t3, $t1, $s3', destReg: '$t3', srcRegs: ['$t1', '$s3'], type: 'alu' },
      { id: 4, text: 'OR  $t4, $t2, $t3', destReg: '$t4', srcRegs: ['$t2', '$t3'], type: 'alu' }
    ]
  },
  {
    name: 'Load-Use Hazard (Burbuja Obligatoria)',
    desc: 'LW carga en $t0 y la siguiente instrucción ADD lo lee. Exige 1 ciclo de parada forzoso.',
    instructions: [
      { id: 1, text: 'LW  $t0, 0($s0)', destReg: '$t0', srcRegs: ['$s0'], type: 'load' },
      { id: 2, text: 'ADD $t1, $t0, $s1', destReg: '$t1', srcRegs: ['$t0', '$s1'], type: 'alu' },
      { id: 3, text: 'SW  $t1, 4($s0)', destReg: undefined, srcRegs: ['$t1', '$s0'], type: 'store' }
    ]
  }
];

const STAGES = ['IF', 'ID', 'EX', 'MEM', 'WB'] as const;

export const PipelineSimulator: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [forwardingEnabled, setForwardingEnabled] = useState(true);
  const [currentCycle, setCurrentCycle] = useState(1);

  const program = PRESET_PROGRAMS[selectedPreset];
  const maxCycles = program.instructions.length + 6;

  // Compute pipeline state matrix for each cycle
  // cycle -> instructionIndex -> stage or stall
  const computeGrid = () => {
    const grid: Record<number, Record<number, string>> = {};
    const hasLoadUse = selectedPreset === 1;

    for (let c = 1; c <= maxCycles; c++) {
      grid[c] = {};
    }

    if (hasLoadUse) {
      // LW
      grid[1][0] = 'IF';
      grid[2][0] = 'ID';
      grid[3][0] = 'EX';
      grid[4][0] = 'MEM';
      grid[5][0] = 'WB';

      // ADD
      grid[2][1] = 'IF';
      grid[3][1] = 'ID';
      // At cycle 4, hazard detected:
      grid[4][1] = 'BURBUJA 🛑';
      grid[5][1] = 'EX';
      grid[6][1] = 'MEM';
      grid[7][1] = 'WB';

      // SW
      grid[3][2] = 'IF';
      grid[4][2] = 'ID'; // stalled along with ADD
      grid[5][2] = 'ID';
      grid[6][2] = 'EX';
      grid[7][2] = 'MEM';
      grid[8][2] = 'WB';
    } else {
      // Normal with forwarding
      program.instructions.forEach((_, idx) => {
        const start = idx + 1;
        STAGES.forEach((stage, sIdx) => {
          const cyc = start + sIdx;
          if (cyc <= maxCycles) {
            grid[cyc][idx] = stage;
          }
        });
      });
    }

    return grid;
  };

  const grid = computeGrid();

  const handleNext = () => {
    if (currentCycle < maxCycles) setCurrentCycle(c => c + 1);
  };

  const handleReset = () => {
    setCurrentCycle(1);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <Zap className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-white">Simulador Interactivo de Pipeline MIPS 5 Etapas</h3>
          </div>
          <p className="text-sm text-slate-400 mt-1">Visualiza ciclo a ciclo cómo fluyen las instrucciones y dónde ocurren las paradas.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setForwardingEnabled(!forwardingEnabled)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              forwardingEnabled 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
            }`}
          >
            Forwarding: {forwardingEnabled ? 'ACTIVADO' : 'DESACTIVADO'}
          </button>
        </div>
      </div>

      {/* Preset selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        {PRESET_PROGRAMS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => { setSelectedPreset(idx); setCurrentCycle(1); }}
            className={`p-3 text-left rounded-xl border transition ${
              selectedPreset === idx 
                ? 'bg-indigo-600/15 border-indigo-500 text-white' 
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="font-semibold text-sm text-indigo-300">{p.name}</div>
            <div className="text-xs text-slate-400 mt-0.5">{p.desc}</div>
          </button>
        ))}
      </div>

      {/* Cycle Controls */}
      <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800/80 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Ciclo Actual:</span>
          <span className="text-2xl font-black text-indigo-400 font-mono">#{currentCycle}</span>
          <span className="text-xs text-slate-500">de {maxCycles} ciclos</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reiniciar
          </button>
          <button
            onClick={handleNext}
            disabled={currentCycle >= maxCycles}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-bold rounded-lg shadow-lg shadow-indigo-600/20 transition"
          >
            Siguiente Ciclo <Play className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Pipeline Grid Table */}
      <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
              <th className="py-2.5 px-4 text-left font-semibold w-48">Instrucción</th>
              {Array.from({ length: maxCycles }).map((_, i) => (
                <th 
                  key={i} 
                  className={`py-2 px-3 text-center min-w-12 transition ${
                    currentCycle === i + 1 ? 'bg-indigo-600/30 text-indigo-300 font-bold border-b-2 border-indigo-400' : ''
                  }`}
                >
                  C{i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {program.instructions.map((inst, instIdx) => (
              <tr key={inst.id} className="border-b border-slate-800/60 hover:bg-slate-900/30 transition">
                <td className="py-3 px-4 font-bold text-slate-200">
                  <span className="text-indigo-400 mr-2">I{inst.id}:</span>
                  {inst.text}
                </td>
                {Array.from({ length: maxCycles }).map((_, cIdx) => {
                  const cyc = cIdx + 1;
                  const stage = grid[cyc]?.[instIdx];
                  const isCurrent = cyc === currentCycle;

                  let badgeColor = 'text-slate-600';
                  if (stage === 'IF') badgeColor = 'bg-sky-500/20 text-sky-300 border border-sky-500/30';
                  else if (stage === 'ID') badgeColor = 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
                  else if (stage === 'EX') badgeColor = 'bg-violet-500/20 text-violet-300 border border-violet-500/30';
                  else if (stage === 'MEM') badgeColor = 'bg-pink-500/20 text-pink-300 border border-pink-500/30';
                  else if (stage === 'WB') badgeColor = 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
                  else if (stage?.includes('BURBUJA')) badgeColor = 'bg-rose-500/30 text-rose-300 font-bold border border-rose-500/50 animate-pulse';

                  return (
                    <td 
                      key={cIdx} 
                      className={`text-center py-2 px-1 transition ${
                        isCurrent ? 'bg-indigo-950/40' : ''
                      }`}
                    >
                      {stage ? (
                        <span className={`inline-block px-2 py-1 rounded text-[11px] font-bold ${badgeColor}`}>
                          {stage}
                        </span>
                      ) : (
                        <span className="text-slate-700">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Explanation Box */}
      <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-indigo-500/20 text-xs text-slate-300">
        <div className="flex items-center gap-2 font-bold text-indigo-400 mb-1">
          <CheckCircle2 className="w-4 h-4" />
          <span>Clave de Examen para este caso:</span>
        </div>
        {selectedPreset === 1 ? (
          <p>
            Al tener un <strong className="text-white">LW seguido inmediatamente de su dato en ADD</strong>, el valor cargado de RAM no existe físicamente en el chip hasta finalizar la etapa <strong className="text-pink-400">MEM (ciclo 4)</strong>. Como ADD necesita el dato para iniciar <strong className="text-violet-400">EX</strong>, el hardware congela el cauce 1 ciclo insertando una burbuja en el ciclo 4.
          </p>
        ) : (
          <p>
            Con <strong className="text-emerald-400">Forwarding</strong> activado, la ALU de la etapa EX de ADD entrega su resultado en el ciclo 3 directamente a la entrada de la ALU en el ciclo 4 para SUB, eliminando 2 ciclos de parada.
          </p>
        )}
      </div>
    </div>
  );
};
