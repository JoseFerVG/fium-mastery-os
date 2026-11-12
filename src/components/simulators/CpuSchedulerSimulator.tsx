import React, { useState, useMemo } from 'react';
import { Play, RotateCcw, Clock, Plus, Trash2, Cpu, CheckCircle2, Info } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface Process {
  id: string;
  name: string;
  arrivalTime: number;
  burstTime: number;
  priority: number; // Menor o mayor número
  color: string;
}

const PRESET_PROCESSES: Process[] = [
  { id: 'P1', name: 'P1 (xv6 init)', arrivalTime: 0, burstTime: 8, priority: 3, color: 'bg-blue-600' },
  { id: 'P2', name: 'P2 (sh daemon)', arrivalTime: 1, burstTime: 4, priority: 1, color: 'bg-emerald-600' },
  { id: 'P3', name: 'P3 (grep job)', arrivalTime: 2, burstTime: 9, priority: 4, color: 'bg-amber-600' },
  { id: 'P4', name: 'P4 (cat input)', arrivalTime: 3, burstTime: 5, priority: 2, color: 'bg-purple-600' },
];

export const CpuSchedulerSimulator: React.FC = () => {
  const [algorithm, setAlgorithm] = useState<'fcfs' | 'sjf' | 'srtf' | 'rr' | 'priority'>('rr');
  const [quantum, setQuantum] = useState<number>(3);
  const [processes, setProcesses] = useState<Process[]>(PRESET_PROCESSES);

  // Form states for adding process
  const [newName, setNewName] = useState('');
  const [newArrival, setNewArrival] = useState(0);
  const [newBurst, setNewBurst] = useState(4);
  const [newPriority, setNewPriority] = useState(1);

  // Compute Gantt Chart & metrics
  const simulationResult = useMemo(() => {
    if (processes.length === 0) return { timeline: [], stats: [], avgWait: 0, avgTurnaround: 0 };

    interface GanttSlot {
      processId: string;
      processName: string;
      color: string;
      start: number;
      end: number;
    }

    const timeline: GanttSlot[] = [];
    const procs = processes.map(p => ({
      ...p,
      remainingTime: p.burstTime,
      finishTime: 0,
      startTime: -1,
      waitingTime: 0,
      turnaroundTime: 0
    }));

    let currentTime = 0;
    let completedCount = 0;
    const n = procs.length;
    const maxSimulationCycles = 200;

    if (algorithm === 'fcfs') {
      // Sort by arrival time
      procs.sort((a, b) => a.arrivalTime - b.arrivalTime);
      for (const p of procs) {
        if (currentTime < p.arrivalTime) {
          currentTime = p.arrivalTime;
        }
        const start = currentTime;
        currentTime += p.burstTime;
        p.finishTime = currentTime;
        p.turnaroundTime = p.finishTime - p.arrivalTime;
        p.waitingTime = p.turnaroundTime - p.burstTime;
        timeline.push({
          processId: p.id,
          processName: p.name,
          color: p.color,
          start,
          end: currentTime
        });
      }
    } else if (algorithm === 'sjf') {
      // Non-preemptive Shortest Job First
      while (completedCount < n && currentTime < maxSimulationCycles) {
        const available = procs.filter(p => p.arrivalTime <= currentTime && p.remainingTime > 0);
        if (available.length === 0) {
          currentTime++;
          continue;
        }
        available.sort((a, b) => a.burstTime - b.burstTime);
        const p = available[0];
        const start = currentTime;
        currentTime += p.burstTime;
        p.remainingTime = 0;
        p.finishTime = currentTime;
        p.turnaroundTime = p.finishTime - p.arrivalTime;
        p.waitingTime = p.turnaroundTime - p.burstTime;
        completedCount++;
        timeline.push({
          processId: p.id,
          processName: p.name,
          color: p.color,
          start,
          end: currentTime
        });
      }
    } else if (algorithm === 'srtf') {
      // Shortest Remaining Time First (preemptive)
      let currentProcId: string | null = null;
      let slotStart = 0;

      while (completedCount < n && currentTime < maxSimulationCycles) {
        const available = procs.filter(p => p.arrivalTime <= currentTime && p.remainingTime > 0);
        if (available.length === 0) {
          if (currentProcId) {
            const p = procs.find(x => x.id === currentProcId)!;
            timeline.push({
              processId: p.id,
              processName: p.name,
              color: p.color,
              start: slotStart,
              end: currentTime
            });
            currentProcId = null;
          }
          currentTime++;
          continue;
        }

        available.sort((a, b) => a.remainingTime - b.remainingTime);
        const nextProc = available[0];

        if (nextProc.id !== currentProcId) {
          if (currentProcId) {
            const p = procs.find(x => x.id === currentProcId)!;
            timeline.push({
              processId: p.id,
              processName: p.name,
              color: p.color,
              start: slotStart,
              end: currentTime
            });
          }
          currentProcId = nextProc.id;
          slotStart = currentTime;
        }

        nextProc.remainingTime--;
        currentTime++;

        if (nextProc.remainingTime === 0) {
          nextProc.finishTime = currentTime;
          nextProc.turnaroundTime = nextProc.finishTime - nextProc.arrivalTime;
          nextProc.waitingTime = nextProc.turnaroundTime - nextProc.burstTime;
          completedCount++;
          timeline.push({
            processId: nextProc.id,
            processName: nextProc.name,
            color: nextProc.color,
            start: slotStart,
            end: currentTime
          });
          currentProcId = null;
          slotStart = currentTime;
        }
      }
    } else if (algorithm === 'rr') {
      // Round Robin
      const readyQueue: typeof procs = [];
      let i = 0;
      // Add processes that arrive at time 0
      procs.filter(p => p.arrivalTime <= currentTime).forEach(p => {
        if (!readyQueue.includes(p)) readyQueue.push(p);
      });

      while (completedCount < n && currentTime < maxSimulationCycles) {
        if (readyQueue.length === 0) {
          currentTime++;
          procs.filter(p => p.arrivalTime <= currentTime && p.remainingTime > 0).forEach(p => {
            if (!readyQueue.includes(p)) readyQueue.push(p);
          });
          continue;
        }

        const p = readyQueue.shift()!;
        const execTime = Math.min(quantum, p.remainingTime);
        const start = currentTime;
        currentTime += execTime;
        p.remainingTime -= execTime;

        timeline.push({
          processId: p.id,
          processName: p.name,
          color: p.color,
          start,
          end: currentTime
        });

        // Add newly arrived processes while p was running
        procs.filter(proc => proc.arrivalTime <= currentTime && proc.remainingTime > 0 && proc.id !== p.id).forEach(proc => {
          if (!readyQueue.includes(proc)) readyQueue.push(proc);
        });

        if (p.remainingTime > 0) {
          readyQueue.push(p);
        } else {
          p.finishTime = currentTime;
          p.turnaroundTime = p.finishTime - p.arrivalTime;
          p.waitingTime = p.turnaroundTime - p.burstTime;
          completedCount++;
        }
      }
    } else if (algorithm === 'priority') {
      // Priority scheduling (menor número = mayor prioridad)
      while (completedCount < n && currentTime < maxSimulationCycles) {
        const available = procs.filter(p => p.arrivalTime <= currentTime && p.remainingTime > 0);
        if (available.length === 0) {
          currentTime++;
          continue;
        }
        available.sort((a, b) => a.priority - b.priority);
        const p = available[0];
        const start = currentTime;
        currentTime += p.burstTime;
        p.remainingTime = 0;
        p.finishTime = currentTime;
        p.turnaroundTime = p.finishTime - p.arrivalTime;
        p.waitingTime = p.turnaroundTime - p.burstTime;
        completedCount++;
        timeline.push({
          processId: p.id,
          processName: p.name,
          color: p.color,
          start,
          end: currentTime
        });
      }
    }

    const totalWait = procs.reduce((acc, p) => acc + p.waitingTime, 0);
    const totalTurnaround = procs.reduce((acc, p) => acc + p.turnaroundTime, 0);

    return {
      timeline,
      stats: procs,
      avgWait: procs.length > 0 ? Number((totalWait / procs.length).toFixed(2)) : 0,
      avgTurnaround: procs.length > 0 ? Number((totalTurnaround / procs.length).toFixed(2)) : 0
    };
  }, [processes, algorithm, quantum]);

  const handleAddProcess = () => {
    if (!newName.trim()) return;
    const colors = ['bg-indigo-600', 'bg-rose-600', 'bg-cyan-600', 'bg-lime-600', 'bg-fuchsia-600'];
    const pColor = colors[processes.length % colors.length];
    const newProc: Process = {
      id: `P${processes.length + 1}`,
      name: newName,
      arrivalTime: Number(newArrival),
      burstTime: Math.max(1, Number(newBurst)),
      priority: Number(newPriority),
      color: pColor
    };
    setProcesses([...processes, newProc]);
    setNewName('');
    soundManager.playCorrect();
  };

  const handleRemoveProcess = (id: string) => {
    setProcesses(processes.filter(p => p.id !== id));
    soundManager.playClick();
  };

  const handleReset = () => {
    setProcesses(PRESET_PROCESSES);
    soundManager.playClick();
  };

  const totalCycles = simulationResult.timeline.length > 0 
    ? simulationResult.timeline[simulationResult.timeline.length - 1].end 
    : 1;

  return (
    <div className="duo-card p-6 sm:p-8 bg-white border-2 border-b-[6px] border-[#E5E5E5] text-[#4B4B4B] space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#E5E5E5] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#E5F6FD] text-[#1CB0F6] rounded-2xl border-2 border-[#84D8FF]">
            <Cpu className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#4B4B4B]">Planificador de CPU & Diagrama de Gantt</h3>
            <p className="text-xs text-[#777777] font-bold mt-0.5">Algoritmos oficiales de examen en ISO y ASO: FCFS, SJF, SRTF, Round Robin y Prioridades</p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="duo-btn-white px-4 py-2 text-xs"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reiniciar Caso Típico
        </button>
      </div>

      {/* Algorithm Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {[
          { id: 'rr', name: 'Round Robin (RR)', desc: 'Apropiativo por quantum' },
          { id: 'sjf', name: 'SJF (No apropiativo)', desc: 'Ráfaga corta primero' },
          { id: 'srtf', name: 'SRTF (Apropiativo)', desc: 'Tiempo restante menor' },
          { id: 'fcfs', name: 'FCFS', desc: 'Primero en llegar' },
          { id: 'priority', name: 'Prioridades', desc: 'Menor valor = Más prioridad' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => {
              setAlgorithm(item.id as typeof algorithm);
              soundManager.playClick();
            }}
            className={`p-3.5 rounded-2xl text-left border-2 border-b-4 transition cursor-pointer ${
              algorithm === item.id
                ? 'bg-[#E5F6FD] border-[#84D8FF] text-[#1CB0F6]'
                : 'bg-white border-[#E5E5E5] text-[#4B4B4B] hover:bg-[#F7F7F7]'
            }`}
          >
            <div className="text-xs font-black">{item.name}</div>
            <div className="text-[10px] text-[#777777] font-bold mt-0.5 line-clamp-1">{item.desc}</div>
          </button>
        ))}
      </div>

      {algorithm === 'rr' && (
        <div className="flex items-center gap-4 bg-[#F7F7F7] p-4 rounded-2xl border-2 border-[#E5E5E5]">
          <span className="text-xs font-black text-[#4B4B4B]">Quantum (Q):</span>
          <input
            type="range"
            min={1}
            max={8}
            value={quantum}
            onChange={e => setQuantum(Number(e.target.value))}
            className="flex-1 accent-[#58CC02] cursor-pointer"
          />
          <span className="px-3.5 py-1 bg-[#D7FFB8] text-[#58A700] border-2 border-[#58CC02] font-mono font-black text-xs rounded-xl">
            {quantum} ciclos de reloj
          </span>
        </div>
      )}

      {/* Visual Gantt Chart */}
      <div className="bg-[#F7F7F7] p-5 rounded-2xl border-2 border-[#E5E5E5] space-y-3">
        <div className="flex items-center justify-between text-xs font-black text-[#777777] uppercase tracking-wider">
          <span>DIAGRAMA DE GANTT (Tiempo total: {totalCycles} ciclos)</span>
          <span className="text-[11px] font-mono text-[#1CB0F6] font-black">T_llegada ≤ T_ejecución</span>
        </div>

        {/* Timeline Bar */}
        <div className="relative overflow-x-auto pb-2">
          <div className="flex min-w-[500px] h-14 bg-white rounded-2xl overflow-hidden border-2 border-[#E5E5E5] p-1 gap-1">
            {simulationResult.timeline.map((slot, idx) => {
              const duration = slot.end - slot.start;
              const widthPct = (duration / totalCycles) * 100;
              return (
                <div
                  key={idx}
                  style={{ width: `${widthPct}%` }}
                  className={`${slot.color} h-full rounded-xl flex flex-col items-center justify-center text-white font-black text-xs shadow-sm transition-all relative group border-b-2 border-black/20`}
                  title={`${slot.processName}: [${slot.start} - ${slot.end}]`}
                >
                  <span className="text-[11px] truncate px-1">{slot.processId}</span>
                  <span className="text-[9px] font-mono opacity-90">{duration}c</span>
                </div>
              );
            })}
          </div>

          {/* Time markers under Gantt */}
          <div className="flex min-w-[500px] justify-between text-[10px] font-mono font-bold text-[#AFAFAF] mt-1.5 px-1">
            <span>0</span>
            {simulationResult.timeline.map((slot, idx) => (
              <span key={idx} style={{ left: `${(slot.end / totalCycles) * 100}%` }}>
                {slot.end}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Summary & Averages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="duo-card p-5 border-2 border-b-4 border-[#84D8FF] bg-[#E5F6FD] flex items-center justify-between">
          <div>
            <div className="text-xs font-black text-[#1CB0F6] uppercase tracking-wider">Tiempo Medio de Espera (T_esp)</div>
            <div className="text-[11px] text-[#777777] font-bold">Espera en cola de listos (T_retorno - Ráfaga)</div>
          </div>
          <div className="text-3xl font-black text-[#1CB0F6] font-mono">
            {simulationResult.avgWait} <span className="text-xs text-[#777777]">ciclos</span>
          </div>
        </div>

        <div className="duo-card p-5 border-2 border-b-4 border-[#58CC02] bg-[#D7FFB8] flex items-center justify-between">
          <div>
            <div className="text-xs font-black text-[#58A700] uppercase tracking-wider">Tiempo Medio de Retorno (T_ret)</div>
            <div className="text-[11px] text-[#777777] font-bold">Turnaround total (T_fin - T_llegada)</div>
          </div>
          <div className="text-3xl font-black text-[#58A700] font-mono">
            {simulationResult.avgTurnaround} <span className="text-xs text-[#777777]">ciclos</span>
          </div>
        </div>
      </div>

      {/* Process Table & Controller */}
      <div className="bg-white rounded-2xl border-2 border-b-4 border-[#E5E5E5] overflow-hidden">
        <div className="p-4 bg-[#F7F7F7] border-b-2 border-[#E5E5E5] flex items-center justify-between">
          <span className="text-xs font-black text-[#4B4B4B] uppercase tracking-wider">Tabla de Procesos Activos</span>
          <span className="text-xs text-[#777777] font-bold">{processes.length} procesos en cola</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F7F7F7] text-[#777777] uppercase font-mono text-[10px] font-bold border-b border-[#E5E5E5]">
              <tr>
                <th className="p-3 font-black">Proceso</th>
                <th className="p-3 font-black">Llegada</th>
                <th className="p-3 font-black">Ráfaga CPU</th>
                <th className="p-3 font-black">Prioridad</th>
                <th className="p-3 font-black">Fin</th>
                <th className="p-3 font-black">T. Retorno</th>
                <th className="p-3 font-black">T. Espera</th>
                <th className="p-3 text-right font-black">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5] font-mono">
              {simulationResult.stats.map(p => (
                <tr key={p.id} className="hover:bg-[#F7F7F7] transition">
                  <td className="p-3 font-sans font-black flex items-center gap-2 text-[#4B4B4B]">
                    <span className={`w-3 h-3 rounded-full ${p.color}`} />
                    {p.name}
                  </td>
                  <td className="p-3 text-[#4B4B4B] font-bold">{p.arrivalTime}</td>
                  <td className="p-3 text-[#1CB0F6] font-black">{p.burstTime}</td>
                  <td className="p-3 text-[#FF9600] font-black">{p.priority}</td>
                  <td className="p-3 text-[#4B4B4B] font-bold">{p.finishTime}</td>
                  <td className="p-3 text-[#58A700] font-black">{p.turnaroundTime}</td>
                  <td className="p-3 text-[#1CB0F6] font-black">{p.waitingTime}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleRemoveProcess(p.id)}
                      className="p-1 rounded text-[#AFAFAF] hover:text-[#FF4B4B] transition cursor-pointer"
                      title="Eliminar proceso"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add process inline bar */}
        <div className="p-4 bg-[#F7F7F7] border-t-2 border-[#E5E5E5] flex flex-wrap gap-2 items-center text-xs">
          <input
            type="text"
            id="cpu-new-process-name"
            name="processName"
            aria-label="Nombre del nuevo proceso"
            autoComplete="off"
            placeholder="Nombre (ej. P5)"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            className="px-3.5 py-2 bg-white border-2 border-b-4 border-[#E5E5E5] rounded-xl text-[#4B4B4B] font-bold placeholder-[#AFAFAF] focus:outline-none focus:border-[#1CB0F6] flex-1 min-w-[120px]"
          />
          <div className="flex items-center gap-1.5">
            <label htmlFor="cpu-new-process-arrival" className="text-[#777777] font-bold text-xs">Llegada:</label>
            <input
              type="number"
              id="cpu-new-process-arrival"
              name="arrivalTime"
              aria-label="Tiempo de llegada del proceso"
              min={0}
              value={newArrival}
              onChange={e => setNewArrival(Number(e.target.value))}
              className="w-16 px-2.5 py-2 bg-white border-2 border-b-4 border-[#E5E5E5] rounded-xl text-[#4B4B4B] font-mono font-bold"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <label htmlFor="cpu-new-process-burst" className="text-[#777777] font-bold text-xs">Ráfaga:</label>
            <input
              type="number"
              id="cpu-new-process-burst"
              name="burstTime"
              aria-label="Ráfaga de CPU del proceso"
              min={1}
              value={newBurst}
              onChange={e => setNewBurst(Number(e.target.value))}
              className="w-16 px-2.5 py-2 bg-white border-2 border-b-4 border-[#E5E5E5] rounded-xl text-[#4B4B4B] font-mono font-bold"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <label htmlFor="cpu-new-process-priority" className="text-[#777777] font-bold text-xs">Prioridad:</label>
            <input
              type="number"
              id="cpu-new-process-priority"
              name="priority"
              aria-label="Prioridad del proceso"
              value={newPriority}
              onChange={e => setNewPriority(Number(e.target.value))}
              className="w-16 px-2.5 py-2 bg-white border-2 border-b-4 border-[#E5E5E5] rounded-xl text-[#4B4B4B] font-mono font-bold"
            />
          </div>
          <button
            onClick={handleAddProcess}
            className="duo-btn-green px-4 py-2 text-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Añadir Proceso
          </button>
        </div>
      </div>

      {/* Tip for exams */}
      <div className="bg-[#FFF4D0] border-2 border-b-4 border-[#FFC800] p-4 rounded-2xl flex items-start gap-3 text-xs text-[#E08500] font-bold">
        <Info className="w-5 h-5 text-[#FF9600] shrink-0 mt-0.5" />
        <div>
          <span className="font-black text-[#FF9600] uppercase tracking-wider block mb-0.5">Regla de Oro en Examen de FIUM:</span>
          En Round Robin, cuando un proceso agota su quantum exactamente en el mismo instante en que un nuevo proceso llega al sistema,
          el nuevo proceso que llega entra en la cola de listos ANTES de que el proceso que agotó el quantum vuelva a colocarse al final.
        </div>
      </div>
    </div>
  );
};
