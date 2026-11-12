import React, { useState } from 'react';
import { Play, RotateCcw, Zap, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

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

export const PipelineSimulator: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [forwardingEnabled, setForwardingEnabled] = useState(true);
  const [currentCycle, setCurrentCycle] = useState(1);

  const program = PRESET_PROGRAMS[selectedPreset];
  const maxCycles = program.instructions.length + 6;

  // Compute pipeline state matrix for each cycle
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
      grid[4][1] = 'BURBUJA 🛑';
      grid[5][1] = 'EX';
      grid[6][1] = 'MEM';
      grid[7][1] = 'WB';

      // SW
      grid[3][2] = 'IF';
      grid[4][2] = 'ID';
      grid[5][2] = 'ID (Rep)';
      grid[6][2] = 'EX';
      grid[7][2] = 'MEM';
      grid[8][2] = 'WB';
    } else {
      // Normal with forwarding
      for (let i = 0; i < program.instructions.length; i++) {
        const start = i + 1;
        grid[start][i] = 'IF';
        grid[start + 1][i] = 'ID';
        grid[start + 2][i] = 'EX';
        grid[start + 3][i] = 'MEM';
        grid[start + 4][i] = 'WB';
      }
    }

    return grid;
  };

  const grid = computeGrid();

  const handleNext = () => {
    if (currentCycle < maxCycles) {
      soundManager.playClick();
      setCurrentCycle(c => c + 1);
    }
  };

  const handleReset = () => {
    soundManager.playClick();
    setCurrentCycle(1);
  };

  return (
    <div className="duo-card p-6 sm:p-8 bg-white border-2 border-b-[6px] border-[#E5E5E5] text-[#4B4B4B] font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b-2 border-[#E5E5E5]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 bg-[#E5F6FD] text-[#1CB0F6] rounded-2xl border-2 border-[#84D8FF]">
              <Zap className="w-5 h-5 stroke-[2.5]" />
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#4B4B4B]">Simulador de Pipeline MIPS 5 Etapas</h3>
          </div>
          <p className="text-xs text-[#777777] font-bold mt-1">Visualiza ciclo a ciclo cómo fluyen las instrucciones y dónde ocurren las paradas.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundManager.playClick();
              setForwardingEnabled(!forwardingEnabled);
            }}
            className={forwardingEnabled ? 'duo-btn-green px-4 py-2 text-xs' : 'duo-btn-red px-4 py-2 text-xs'}
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
            onClick={() => {
              soundManager.playClick();
              setSelectedPreset(idx);
              setCurrentCycle(1);
            }}
            className={`p-4 text-left rounded-2xl border-2 border-b-4 transition cursor-pointer ${
              selectedPreset === idx 
                ? 'bg-[#E5F6FD] border-[#84D8FF] text-[#1CB0F6]' 
                : 'bg-white border-[#E5E5E5] text-[#4B4B4B] hover:bg-[#F7F7F7]'
            }`}
          >
            <div className="font-black text-sm text-[#1CB0F6]">{p.name}</div>
            <div className="text-xs text-[#777777] font-bold mt-0.5">{p.desc}</div>
          </button>
        ))}
      </div>

      {/* Cycle Controls */}
      <div className="flex items-center justify-between bg-[#F7F7F7] p-4 rounded-2xl border-2 border-[#E5E5E5] mb-6">
        <div className="flex items-center gap-3">
          <span className="text-xs font-black text-[#777777] uppercase tracking-wider">Ciclo Actual:</span>
          <span className="text-2xl font-black text-[#1CB0F6] font-mono">#{currentCycle}</span>
          <span className="text-xs text-[#AFAFAF] font-bold">de {maxCycles} ciclos</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="duo-btn-white px-3.5 py-2 text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reiniciar
          </button>
          <button
            onClick={handleNext}
            disabled={currentCycle >= maxCycles}
            className="duo-btn-blue px-4 py-2 text-xs"
          >
            Siguiente Ciclo <Play className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
      </div>

      {/* Pipeline Grid Table */}
      <div className="overflow-x-auto border-2 border-[#E5E5E5] rounded-2xl bg-white mb-6">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b-2 border-[#E5E5E5] bg-[#F7F7F7] text-[#777777]">
              <th className="py-3 px-4 text-left font-black w-48">Instrucción</th>
              {Array.from({ length: maxCycles }).map((_, i) => (
                <th 
                  key={i} 
                  className={`py-2 px-3 text-center min-w-12 transition ${
                    currentCycle === i + 1 ? 'bg-[#DDF4FF] text-[#1CB0F6] font-black border-b-2 border-[#84D8FF]' : ''
                  }`}
                >
                  C{i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {program.instructions.map((inst, instIdx) => (
              <tr key={inst.id} className="border-b border-[#E5E5E5] hover:bg-[#F7F7F7] transition">
                <td className="py-3 px-4 font-black text-[#4B4B4B]">
                  <span className="text-[#1CB0F6] mr-2">I{inst.id}:</span>
                  {inst.text}
                </td>
                {Array.from({ length: maxCycles }).map((_, cIdx) => {
                  const cyc = cIdx + 1;
                  const stage = grid[cyc]?.[instIdx];
                  const isCurrent = cyc === currentCycle;

                  let badgeColor = 'text-[#AFAFAF]';
                  if (stage === 'IF') badgeColor = 'bg-[#E5F6FD] text-[#1CB0F6] border border-[#84D8FF]';
                  else if (stage === 'ID') badgeColor = 'bg-[#FFF4D0] text-[#FF9600] border border-[#FFC800]';
                  else if (stage === 'EX') badgeColor = 'bg-[#F5EAFF] text-[#CE82FF] border border-[#CE82FF]';
                  else if (stage === 'MEM') badgeColor = 'bg-[#FFE8F0] text-[#E91E63] border border-[#FF80AB]';
                  else if (stage === 'WB') badgeColor = 'bg-[#D7FFB8] text-[#58A700] border border-[#58CC02]';
                  else if (stage?.includes('BURBUJA')) badgeColor = 'bg-[#FFDFE0] text-[#EA2B2B] font-black border-2 border-[#FF4B4B] animate-pulse';

                  return (
                    <td 
                      key={cIdx} 
                      className={`text-center py-2 px-1 transition ${
                        isCurrent ? 'bg-[#E5F6FD]/40' : ''
                      }`}
                    >
                      {stage ? (
                        <span className={`inline-block px-2 py-1 rounded-xl text-[11px] font-black ${badgeColor}`}>
                          {stage}
                        </span>
                      ) : (
                        <span className="text-[#CECECE]">-</span>
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
      <div className="p-4 rounded-2xl bg-[#E5F6FD] border-2 border-[#84D8FF] text-xs text-[#1899D6] font-bold">
        <div className="flex items-center gap-2 font-black text-[#1CB0F6] mb-1">
          <CheckCircle2 className="w-4 h-4" />
          <span>Clave de Examen para este caso:</span>
        </div>
        {selectedPreset === 1 ? (
          <p>
            Al tener un <strong className="text-[#4B4B4B]">LW seguido inmediatamente de su dato en ADD</strong>, el valor cargado de RAM no existe físicamente en el chip hasta finalizar la etapa <strong className="text-[#E91E63]">MEM (ciclo 4)</strong>. Como ADD necesita el dato para iniciar <strong className="text-[#CE82FF]">EX</strong>, el hardware congela el cauce 1 ciclo insertando una burbuja en el ciclo 4.
          </p>
        ) : (
          <p>
            Con <strong className="text-[#58A700]">Forwarding</strong> activado, la ALU de la etapa EX de ADD entrega su resultado en el ciclo 3 directamente a la entrada de la ALU en el ciclo 4 para SUB, eliminando 2 ciclos de parada.
          </p>
        )}
      </div>
    </div>
  );
};
