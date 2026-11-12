import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Cpu, 
  Database, 
  Layers, 
  Sparkles,
  ChevronRight,
  ArrowLeft,
  Clock,
  ShieldCheck,
  Brain,
  Network
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
}

const SIMULATORS_CATALOG: SimulatorItem[] = [
  {
    id: 'pipeline',
    subjectId: 'aoc',
    subjectName: 'AOC',
    title: 'Pipeline MIPS / RISC-V & Hazards',
    tagline: 'Simulador de 5 etapas, adelantamiento (forwarding) y paradas load-use obligatorias.',
    icon: <Cpu className="w-5 h-5 text-[#1CB0F6]" />,
    badge: 'Hardware & ILP',
    gradient: 'from-blue-600 to-indigo-700',
  },
  {
    id: 'cache',
    subjectId: 'aoc',
    subjectName: 'AOC',
    title: 'Calculadora de AMAT & Caché',
    tagline: 'Desglose Tag-Index-Offset en memorias asociativas por conjuntos y cálculo de tiempo medio AMAT.',
    icon: <Database className="w-5 h-5 text-[#CE82FF]" />,
    badge: 'Jerarquía de Memoria',
    gradient: 'from-indigo-600 to-purple-700',
  },
  {
    id: 'cpu-scheduler',
    subjectId: 'iso',
    subjectName: 'ISO / ASO',
    title: 'Planificador de CPU & Diagrama de Gantt',
    tagline: 'Simula Round Robin con quantum, SJF, SRTF y prioridades calculando tiempos de espera y retorno.',
    icon: <Clock className="w-5 h-5 text-[#58CC02]" />,
    badge: 'Gestión de Procesos',
    gradient: 'from-emerald-600 to-teal-700',
  },
  {
    id: 'virtual-memory',
    subjectId: 'aso',
    subjectName: 'ASO',
    title: 'Memoria Virtual & Tablas de Páginas x86',
    tagline: 'Traducción de direcciones virtuales CR3, fallos de página y lazy page allocation en xv6.',
    icon: <Layers className="w-5 h-5 text-[#1CB0F6]" />,
    badge: 'Kernel & x86 Paging',
    gradient: 'from-cyan-600 to-blue-800',
  },
  {
    id: 'automata',
    subjectId: 'alf',
    subjectName: 'ALF',
    title: 'Simulador de Autómatas Finitos & Minimización',
    tagline: 'Comprobador de estados, transiciones lambda y minimización de AFDs mediante clases de equivalencia.',
    icon: <Sparkles className="w-5 h-5 text-[#FFC800]" />,
    badge: 'Teoría de Computación',
    gradient: 'from-amber-600 to-orange-700',
  },
  {
    id: 'solid-doctor',
    subjectId: 'tds',
    subjectName: 'TDS',
    title: 'Doctor SOLID & Refactorización GoF',
    tagline: 'Diagnóstico de code smells, violaciones OCP/LSP y aplicación de patrones Factory y Strategy.',
    icon: <ShieldCheck className="w-5 h-5 text-[#FF4B4B]" />,
    badge: 'Diseño Software',
    gradient: 'from-rose-600 to-red-800',
  },
  {
    id: 'subnet-calc',
    subjectId: 'ar',
    subjectName: 'AR',
    title: 'Calculadora VLSM & Enrutamiento IP',
    tagline: 'División jerárquica de subredes, máscaras de longitud variable y cálculo de direcciones broadcast.',
    icon: <Network className="w-5 h-5 text-[#1CB0F6]" />,
    badge: 'Redes TCP/IP',
    gradient: 'from-sky-600 to-blue-800',
  },
  {
    id: 'rsa-crypto',
    subjectId: 'st',
    subjectName: 'ST',
    title: 'Laboratorio Criptográfico RSA',
    tagline: 'Generación de claves p y q, cálculo de función de Euler φ(n) y firma digital con clave privada.',
    icon: <ShieldCheck className="w-5 h-5 text-[#CE82FF]" />,
    badge: 'Seguridad Telemática',
    gradient: 'from-purple-600 to-indigo-800',
  },
  {
    id: 'astar-search',
    subjectId: 'si',
    subjectName: 'SI',
    title: 'Buscador de Caminos A* & Heurísticas',
    tagline: 'Visualización paso a paso de nodo actual, lista abierta y cerrada con distancias Manhattan y Euclídea.',
    icon: <Brain className="w-5 h-5 text-[#58CC02]" />,
    badge: 'Inteligencia Artificial',
    gradient: 'from-emerald-600 to-green-800',
  },
  {
    id: 'decision-tree',
    subjectId: 'ac',
    subjectName: 'AC',
    title: 'Playground de Árboles de Decisión (ID3)',
    tagline: 'Cálculo interactivo de entropía, ganancia de información y partición de nodos para clasificación.',
    icon: <Brain className="w-5 h-5 text-[#FFC800]" />,
    badge: 'Machine Learning',
    gradient: 'from-yellow-600 to-amber-700',
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
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#E5E5E5] pb-4">
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
            className="duo-btn-white px-4 py-2 text-xs"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> {activeSimId ? 'Ver Todos los Simuladores' : 'Volver al Panel'}
          </button>
          <div>
            <h2 className="text-2xl font-black text-[#4B4B4B] tracking-tight flex items-center gap-2">
              <span>Simuladores Interactivos FIUM</span>
              <BadgePill variant="indigo">
                10 Labs
              </BadgePill>
            </h2>
            <p className="text-xs text-[#777777] font-bold mt-0.5">
              Experimenta en tiempo real con los algoritmos y arquitecturas de tus asignaturas.
            </p>
          </div>
        </div>
      </div>

      {activeSimId ? (
        <div className="space-y-6">
          {/* Active Lab Header */}
          <div className="duo-card p-5 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <BadgePill variant="indigo">
                {currentSimMeta?.subjectName}
              </BadgePill>
              <div>
                <span className="text-base font-black text-[#4B4B4B] block">{currentSimMeta?.title}</span>
                <span className="text-xs text-[#58CC02] font-black uppercase tracking-wider">Simulación en Vivo</span>
              </div>
            </div>
            
            <button
              onClick={() => setActiveSimId(null)}
              className="duo-btn-blue px-4 py-2 text-xs"
            >
              Cambiar Simulador →
            </button>
          </div>

          {/* Active Simulator Container */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderActiveSimulator()}
          </motion.div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Subject Filter Bar */}
          <div className="flex flex-wrap gap-2">
            {(['all', 'aoc', 'aso', 'alf', 'tds', 'iso', 'ac', 'ar', 'st', 'si'] as const).map(sub => (
              <button
                key={sub}
                onClick={() => {
                  setFilterSubject(sub);
                  soundManager.playClick();
                }}
                className={`px-3.5 py-1.5 rounded-2xl text-xs font-black uppercase tracking-wider transition border-2 border-b-4 ${
                  filterSubject === sub
                    ? 'bg-[#E5F6FD] border-[#84D8FF] text-[#1CB0F6]'
                    : 'bg-white border-[#E5E5E5] text-[#777777] hover:bg-[#F7F7F7]'
                }`}
              >
                {sub === 'all' ? 'Todos los Labs (10)' : sub}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCatalog.map(sim => (
              <div
                key={sim.id}
                onClick={() => handleSelectSim(sim.id)}
                className="duo-card-interactive p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-3 rounded-2xl bg-[#F7F7F7] border-2 border-[#E5E5E5]">
                        {sim.icon}
                      </div>
                      <span className="text-xs font-black px-2.5 py-0.5 rounded-xl bg-[#E5F6FD] text-[#1CB0F6] border border-[#84D8FF]">
                        {sim.subjectName}
                      </span>
                    </div>
                    <BadgePill variant="slate">
                      {sim.badge}
                    </BadgePill>
                  </div>

                  <h3 className="text-base font-black text-[#4B4B4B]">
                    {sim.title}
                  </h3>
                  <p className="text-xs text-[#777777] font-bold mt-2 leading-relaxed">
                    {sim.tagline}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t-2 border-[#E5E5E5] flex items-center justify-between text-xs font-black text-[#58CC02] uppercase tracking-wider">
                  <span>ABRIR SIMULADOR</span>
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
