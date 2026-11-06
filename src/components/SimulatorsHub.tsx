import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Cpu, 
  Database, 
  Layers, 
  Sparkles,
  ChevronRight,
  ArrowLeft,
  Activity,
  Code2,
  Clock,
  Compass
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
import { SimulatorId, SubjectId } from '../types';
import { soundManager } from '../utils/soundEffects';
import { SpotlightCard } from './ui/SpotlightCard';
import { BorderBeam } from './ui/BorderBeam';
import { BadgePill } from './ui/BadgePill';

interface SimulatorItem {
  id: SimulatorId;
  subjectId: SubjectId;
  subjectName: string;
  title: string;
  tagline: string;
  icon: React.ReactNode;
  badge: string;
  gradient: string;
  spotlightColor: string;
}

const SIMULATORS_CATALOG: SimulatorItem[] = [
  {
    id: 'pipeline',
    subjectId: 'aoc',
    subjectName: 'AOC',
    title: 'Pipeline MIPS / RISC-V & Hazards',
    tagline: 'Simulador de 5 etapas, adelantamiento (forwarding) y paradas load-use obligatorias.',
    icon: <Cpu className="w-5 h-5 text-blue-400" />,
    badge: 'Hardware & ILP',
    gradient: 'from-blue-600 to-indigo-700',
    spotlightColor: 'rgba(59, 130, 246, 0.16)'
  },
  {
    id: 'cache',
    subjectId: 'aoc',
    subjectName: 'AOC',
    title: 'Calculadora de AMAT & Caché',
    tagline: 'Desglose Tag-Index-Offset en memorias asociativas por conjuntos y cálculo de tiempo medio AMAT.',
    icon: <Database className="w-5 h-5 text-indigo-400" />,
    badge: 'Jerarquía de Memoria',
    gradient: 'from-indigo-600 to-purple-700',
    spotlightColor: 'rgba(99, 102, 241, 0.16)'
  },
  {
    id: 'cpu-scheduler',
    subjectId: 'iso',
    subjectName: 'ISO / ASO',
    title: 'Planificador de CPU & Diagrama de Gantt',
    tagline: 'Simula Round Robin con quantum, SJF, SRTF y prioridades calculando tiempos de espera y retorno.',
    icon: <Clock className="w-5 h-5 text-emerald-400" />,
    badge: 'Gestión de Procesos',
    gradient: 'from-emerald-600 to-teal-700',
    spotlightColor: 'rgba(16, 185, 129, 0.16)'
  },
  {
    id: 'virtual-memory',
    subjectId: 'aso',
    subjectName: 'ASO',
    title: 'Memoria Virtual & Tablas de Páginas x86',
    tagline: 'Traducción de direcciones virtuales CR3, fallos de página y lazy page allocation en xv6.',
    icon: <Layers className="w-5 h-5 text-cyan-400" />,
    badge: 'Kernel & x86 Paging',
    gradient: 'from-cyan-600 to-blue-800',
    spotlightColor: 'rgba(6, 182, 212, 0.16)'
  },
  {
    id: 'automata',
    subjectId: 'alf',
    subjectName: 'ALF',
    title: 'Simulador de Autómatas Finitos & Minimización',
    tagline: 'Comprobador de estados, transiciones lambda y minimización de AFDs mediante clases de equivalencia.',
    icon: <Sparkles className="w-5 h-5 text-amber-400" />,
    badge: 'Teoría de la Computación',
    gradient: 'from-amber-600 to-orange-700',
    spotlightColor: 'rgba(245, 158, 11, 0.16)'
  },
  {
    id: 'solid-doctor',
    subjectId: 'tds',
    subjectName: 'TDS',
    title: 'Clínica de Refactorización SOLID & Code Smells',
    tagline: 'Diagnostica violaciones de SRP, OCP, LSP, ISP y DIP en Java y aplica refactorizaciones limpias.',
    icon: <Code2 className="w-5 h-5 text-purple-400" />,
    badge: 'Diseño OO & Clean Code',
    gradient: 'from-purple-600 to-pink-700',
    spotlightColor: 'rgba(168, 85, 247, 0.16)'
  },
  {
    id: 'subnet-calc',
    subjectId: 'ar',
    subjectName: 'AR',
    title: 'Calculadora Visual de Subredes & VLSM',
    tagline: 'Cálculo de máscaras de longitud variable, rangos útiles, red y broadcast con desglose binario de 32 bits.',
    icon: <Activity className="w-5 h-5 text-sky-400" />,
    badge: 'Direccionamiento IPv4',
    gradient: 'from-sky-600 to-indigo-800',
    spotlightColor: 'rgba(14, 165, 233, 0.16)'
  },
  {
    id: 'rsa-crypto',
    subjectId: 'st',
    subjectName: 'ST',
    title: 'Laboratorio Criptográfico RSA',
    tagline: 'Generación de claves pública (e, n) y privada (d, n), phi(n) de Euler y exponenciación modular paso a paso.',
    icon: <Sparkles className="w-5 h-5 text-rose-400" />,
    badge: 'Seguridad en Redes',
    gradient: 'from-rose-600 to-red-800',
    spotlightColor: 'rgba(244, 63, 94, 0.16)'
  },
  {
    id: 'astar-search',
    subjectId: 'si',
    subjectName: 'SI',
    title: 'Visualizador de Búsqueda Heurística A*',
    tagline: 'Laberinto 2D interactivo con heurísticas Manhattan y Euclídea, frontera abierta y lista de cerrados.',
    icon: <Compass className="w-5 h-5 text-teal-400" />,
    badge: 'Espacios de Estados',
    gradient: 'from-teal-600 to-emerald-800',
    spotlightColor: 'rgba(20, 184, 166, 0.16)'
  },
  {
    id: 'decision-tree',
    subjectId: 'ac',
    subjectName: 'AC',
    title: 'Laboratorio de Métricas & Árboles de Decisión',
    tagline: 'Calcula Entropía de Shannon, Ganancia de Información, Matriz de Confusión 2x2, F1-Score y puntos ROC.',
    icon: <Cpu className="w-5 h-5 text-yellow-400" />,
    badge: 'Machine Learning',
    gradient: 'from-yellow-600 to-amber-700',
    spotlightColor: 'rgba(234, 179, 8, 0.16)'
  }
];

interface SimulatorsHubProps {
  initialSimulatorId?: SimulatorId;
  onBack: () => void;
}

export const SimulatorsHub: React.FC<SimulatorsHubProps> = ({
  initialSimulatorId,
  onBack
}) => {
  const [activeSimId, setActiveSimId] = useState<SimulatorId | null>(initialSimulatorId || null);
  const [filterSubject, setFilterSubject] = useState<SubjectId | 'all'>('all');

  const filteredCatalog = filterSubject === 'all'
    ? SIMULATORS_CATALOG
    : SIMULATORS_CATALOG.filter(s => s.subjectId === filterSubject);

  const handleSelectSim = (id: SimulatorId) => {
    setActiveSimId(id);
    soundManager.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderActiveSimulator = () => {
    switch (activeSimId) {
      case 'pipeline': return <PipelineSimulator />;
      case 'cache': return <CacheCalculator />;
      case 'cpu-scheduler': return <CpuSchedulerSimulator />;
      case 'virtual-memory': return <MemoryVirtualSimulator />;
      case 'automata': return <AutomataSimulator />;
      case 'solid-doctor': return <SolidDoctor />;
      case 'subnet-calc': return <SubnetCalculator />;
      case 'rsa-crypto': return <RsaCryptolab />;
      case 'astar-search': return <AStarSearchVisualizer />;
      case 'decision-tree': return <DecisionTreePlayground />;
      default: return null;
    }
  };

  const currentSimMeta = SIMULATORS_CATALOG.find(s => s.id === activeSimId);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (activeSimId) {
                setActiveSimId(null);
              } else {
                onBack();
              }
              soundManager.playClick();
            }}
            className="px-3.5 py-2 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-2 transition hover:scale-105"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> {activeSimId ? 'Ver Todos los Simuladores' : 'Volver al Panel'}
          </button>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Laboratorio de Simuladores Interactivos FIUM</span>
              <BadgePill variant="indigo" pulse>
                10 Laboratorios
              </BadgePill>
            </h2>
            <p className="text-xs text-slate-400">
              Aprende experimentando en tiempo real con los algoritmos y arquitecturas de tus 9 asignaturas.
            </p>
          </div>
        </div>
      </div>

      {activeSimId ? (
        <div className="space-y-6">
          {/* Active Lab Header with BorderBeam */}
          <div className="relative overflow-hidden flex items-center justify-between bg-slate-950 p-5 rounded-3xl border border-indigo-500/30 shadow-2xl">
            <BorderBeam duration={10} size={250} colorFrom="#6366f1" colorTo="#06b6d4" />
            
            <div className="flex items-center gap-3 relative z-10">
              <BadgePill variant="indigo">
                {currentSimMeta?.subjectName}
              </BadgePill>
              <div>
                <span className="text-base font-bold text-white block">{currentSimMeta?.title}</span>
                <span className="text-xs text-slate-400 font-mono">Motor de Simulación en Vivo &bull; 60 FPS</span>
              </div>
            </div>
            
            <button
              onClick={() => setActiveSimId(null)}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition font-bold relative z-10 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50"
            >
              Cambiar de Simulador &rarr;
            </button>
          </div>

          {/* Active Simulator Container */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {renderActiveSimulator()}
          </motion.div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Subject Filter Bar */}
          <div className="flex flex-wrap gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-white/10 shadow-inner">
            {(['all', 'aoc', 'aso', 'alf', 'tds', 'iso', 'ac', 'ar', 'st', 'si'] as const).map(sub => (
              <button
                key={sub}
                onClick={() => {
                  setFilterSubject(sub);
                  soundManager.playClick();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition ${
                  filterSubject === sub
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sub === 'all' ? 'Todos los Labs (10)' : sub}
              </button>
            ))}
          </div>

          {/* Cards Grid with Spotlight Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCatalog.map(sim => (
              <SpotlightCard
                key={sim.id}
                onClick={() => handleSelectSim(sim.id)}
                spotlightColor={sim.spotlightColor}
                className="group cursor-pointer hover:border-slate-700/90 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 group-hover:scale-110 transition-transform">
                        {sim.icon}
                      </div>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300">
                        {sim.subjectName}
                      </span>
                    </div>
                    <BadgePill variant="slate">
                      {sim.badge}
                    </BadgePill>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {sim.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {sim.tagline}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
                  <span>Abrir Simulador</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
