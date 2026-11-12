import React, { useState, useEffect, useCallback } from 'react';
import { Play, RotateCcw, Sparkles, Navigation, Layers, Info, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface GridNode {
  r: number;
  c: number;
  isWall: boolean;
  g: number;
  h: number;
  f: number;
  parent: GridNode | null;
  status: 'empty' | 'wall' | 'open' | 'closed' | 'path' | 'start' | 'goal';
}

const ROWS = 9;
const COLS = 13;

export const AStarSearchVisualizer: React.FC = () => {
  const [algorithm, setAlgorithm] = useState<'astar_manhattan' | 'astar_euclidean' | 'greedy' | 'bfs' | 'dijkstra'>('astar_manhattan');
  const [startPos, setStartPos] = useState<[number, number]>([1, 1]);
  const [goalPos, setGoalPos] = useState<[number, number]>([7, 11]);
  const [walls, setWalls] = useState<Set<string>>(() => {
    const s = new Set<string>();
    // Default maze-like obstacle
    for (let r = 2; r <= 6; r++) s.add(`${r}-5`);
    for (let r = 4; r <= 7; r++) s.add(`${r}-8`);
    return s;
  });

  const [drawMode, setDrawMode] = useState<'wall' | 'start' | 'goal'>('wall');
  const [pathStats, setPathStats] = useState<{ pathLength: number; visitedCount: number; cost: number }>({ pathLength: 0, visitedCount: 0, cost: 0 });
  const [gridState, setGridState] = useState<GridNode[][]>([]);

  const heuristic = useCallback((r1: number, c1: number, r2: number, c2: number, type: typeof algorithm): number => {
    if (type === 'bfs' || type === 'dijkstra') return 0;
    if (type === 'astar_euclidean') {
      return Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(c1 - c2, 2));
    }
    // Manhattan distance
    return Math.abs(r1 - r2) + Math.abs(c1 - c2);
  }, []);

  const runSearch = useCallback(() => {
    // Initialize nodes
    const nodes: GridNode[][] = [];
    for (let r = 0; r < ROWS; r++) {
      nodes[r] = [];
      for (let c = 0; c < COLS; c++) {
        const isWall = walls.has(`${r}-${c}`);
        nodes[r][c] = {
          r,
          c,
          isWall,
          g: Infinity,
          h: 0,
          f: Infinity,
          parent: null,
          status: isWall ? 'wall' : 'empty'
        };
      }
    }

    const [sr, sc] = startPos;
    const [gr, gc] = goalPos;

    nodes[sr][sc].status = 'start';
    nodes[sr][sc].g = 0;
    nodes[sr][sc].h = heuristic(sr, sc, gr, gc, algorithm);
    nodes[sr][sc].f = nodes[sr][sc].h;

    nodes[gr][gc].status = 'goal';

    const openList: GridNode[] = [nodes[sr][sc]];
    const closedSet = new Set<string>();
    let found = false;
    let goalNode: GridNode | null = null;

    while (openList.length > 0) {
      // Sort openList based on algorithm evaluation function
      if (algorithm === 'bfs') {
        // FIFO queue behavior
      } else if (algorithm === 'greedy') {
        openList.sort((a, b) => a.h - b.h);
      } else if (algorithm === 'dijkstra') {
        openList.sort((a, b) => a.g - b.g);
      } else {
        // A* : f = g + h
        openList.sort((a, b) => (a.f === b.f ? a.h - b.h : a.f - b.f));
      }

      const current = openList.shift()!;
      const key = `${current.r}-${current.c}`;

      if (current.r === gr && current.c === gc) {
        found = true;
        goalNode = current;
        break;
      }

      closedSet.add(key);
      if (!(current.r === sr && current.c === sc)) {
        current.status = 'closed';
      }

      // Check 4 orthogonal neighbors
      const neighbors = [
        [current.r - 1, current.c],
        [current.r + 1, current.c],
        [current.r, current.c - 1],
        [current.r, current.c + 1]
      ];

      for (const [nr, nc] of neighbors) {
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
        const neighbor = nodes[nr][nc];
        if (neighbor.isWall || closedSet.has(`${nr}-${nc}`)) continue;

        const tentativeG = current.g + 1;

        if (tentativeG < neighbor.g) {
          neighbor.parent = current;
          neighbor.g = tentativeG;
          neighbor.h = heuristic(nr, nc, gr, gc, algorithm);
          neighbor.f = neighbor.g + neighbor.h;

          if (!openList.some(n => n.r === nr && n.c === nc)) {
            openList.push(neighbor);
            if (!(nr === gr && nc === gc)) {
              neighbor.status = 'open';
            }
          }
        }
      }
    }

    let pLen = 0;
    if (found && goalNode) {
      let curr: GridNode | null = goalNode.parent;
      while (curr && !(curr.r === sr && curr.c === sc)) {
        curr.status = 'path';
        pLen++;
        curr = curr.parent;
      }
      pLen++; // include goal
    }

    setGridState(nodes);
    setPathStats({
      pathLength: found ? pLen : 0,
      visitedCount: closedSet.size,
      cost: found ? (goalNode?.g || 0) : 0
    });
  }, [algorithm, startPos, goalPos, walls, heuristic]);

  useEffect(() => {
    runSearch();
  }, [runSearch]);

  const handleCellClick = (r: number, c: number) => {
    soundManager.playClick();
    if (drawMode === 'start') {
      if (r === goalPos[0] && c === goalPos[1]) return;
      const key = `${r}-${c}`;
      walls.delete(key);
      setStartPos([r, c]);
    } else if (drawMode === 'goal') {
      if (r === startPos[0] && c === startPos[1]) return;
      const key = `${r}-${c}`;
      walls.delete(key);
      setGoalPos([r, c]);
    } else {
      // Toggle wall
      if ((r === startPos[0] && c === startPos[1]) || (r === goalPos[0] && c === goalPos[1])) return;
      const key = `${r}-${c}`;
      const newWalls = new Set(walls);
      if (newWalls.has(key)) {
        newWalls.delete(key);
      } else {
        newWalls.add(key);
      }
      setWalls(newWalls);
    }
  };

  const handleResetWalls = () => {
    setWalls(new Set());
    soundManager.playClick();
  };

  return (
    <div className="bg-white border-2 border-b-[6px] border-[#E5E5E5] rounded-3xl p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#E5E5E5] pb-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FFF4D9] border-2 border-b-4 border-[#FFD966] flex items-center justify-center text-[#FF9600] shrink-0">
            <Navigation className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase bg-[#FFF4D9] text-[#FF9600] border border-[#FFD966]">
                SSII / BÚSQUEDA
              </span>
              <span className="text-xs font-bold text-[#AFAFAF] uppercase">Espacio de Estados</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#4B4B4B] uppercase tracking-tight mt-0.5">
              Visualizador Heurístico A* & Espacio de Estados
            </h3>
            <p className="text-xs text-[#777777] font-semibold">
              Algoritmo A*, admisibilidad de heurísticas, frontera (abiertos) y lista de cerrados
            </p>
          </div>
        </div>

        <button
          onClick={handleResetWalls}
          className="duo-btn-white text-xs px-3.5 py-2 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" /> Limpiar Muros
        </button>
      </div>

      {/* Algorithm & Drawing Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Algo Picker */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'astar_manhattan', label: 'A* (Manhattan)', desc: 'Admisible 4-vecinos' },
            { id: 'astar_euclidean', label: 'A* (Euclídea)', desc: 'Línea recta h<=h*' },
            { id: 'greedy', label: 'Primero el Mejor (Greedy)', desc: 'Solo h(n)' },
            { id: 'dijkstra', label: 'Costo Uniforme / Dijkstra', desc: 'Solo g(n)' },
            { id: 'bfs', label: 'Anchura (BFS)', desc: 'No informado' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => {
                setAlgorithm(item.id as typeof algorithm);
                soundManager.playClick();
              }}
              className={`px-3 py-1.5 rounded-2xl text-xs font-black uppercase transition border-2 border-b-4 cursor-pointer ${
                algorithm === item.id
                  ? 'bg-[#FFF4D9] text-[#FF9600] border-[#FFD966] translate-y-0.5'
                  : 'bg-white text-[#777777] border-[#E5E5E5] hover:bg-[#F7F7F7]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Draw tool */}
        <div className="flex items-center gap-1.5 bg-[#F7F7F7] p-1.5 rounded-2xl border-2 border-[#E5E5E5] text-xs">
          <span className="text-[11px] font-black uppercase text-[#AFAFAF] px-2">Modo:</span>
          <button
            onClick={() => setDrawMode('wall')}
            className={`px-3 py-1.5 rounded-xl font-black uppercase transition cursor-pointer ${
              drawMode === 'wall' ? 'bg-[#4B4B4B] text-white shadow-sm' : 'text-[#777777] hover:text-[#4B4B4B]'
            }`}
          >
            🧱 Muro
          </button>
          <button
            onClick={() => setDrawMode('start')}
            className={`px-3 py-1.5 rounded-xl font-black uppercase transition cursor-pointer ${
              drawMode === 'start' ? 'bg-[#58CC02] text-white shadow-sm' : 'text-[#777777] hover:text-[#4B4B4B]'
            }`}
          >
            🟢 Origen
          </button>
          <button
            onClick={() => setDrawMode('goal')}
            className={`px-3 py-1.5 rounded-xl font-black uppercase transition cursor-pointer ${
              drawMode === 'goal' ? 'bg-[#FF4B4B] text-white shadow-sm' : 'text-[#777777] hover:text-[#4B4B4B]'
            }`}
          >
            🎯 Destino
          </button>
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="bg-[#F7F7F7] p-5 rounded-3xl border-2 border-[#E5E5E5] flex flex-col items-center overflow-x-auto">
        <div className="grid grid-cols-13 gap-1.5 min-w-[580px]">
          {gridState.map((row, r) =>
            row.map((cell, c) => {
              const isStart = r === startPos[0] && c === startPos[1];
              const isGoal = r === goalPos[0] && c === goalPos[1];

              let cellBg = 'bg-white border-2 border-[#E5E5E5] text-[#777777] hover:border-[#1CB0F6]';
              if (cell.isWall) cellBg = 'bg-[#4B4B4B] border-2 border-[#333333] text-white';
              else if (isStart) cellBg = 'bg-[#58CC02] border-2 border-b-4 border-[#58A700] text-white shadow-sm';
              else if (isGoal) cellBg = 'bg-[#FF4B4B] border-2 border-b-4 border-[#EA2B2B] text-white shadow-sm';
              else if (cell.status === 'path') cellBg = 'bg-[#FFC800] border-2 border-b-4 border-[#E5A500] text-[#4B4B4B] font-black shadow-sm';
              else if (cell.status === 'open') cellBg = 'bg-[#DDF4FF] border-2 border-[#84D8FF] text-[#1CB0F6]';
              else if (cell.status === 'closed') cellBg = 'bg-[#F2E5FF] border-2 border-[#CE82FF] text-[#A559D9]';

              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center transition-all duration-150 active:scale-95 select-none cursor-pointer ${cellBg}`}
                >
                  {isStart ? (
                    <span className="text-xs font-black">A</span>
                  ) : isGoal ? (
                    <span className="text-xs font-black">G</span>
                  ) : cell.isWall ? (
                    <span className="text-[10px] opacity-40">✕</span>
                  ) : cell.status === 'path' ? (
                    <span className="text-[10px] font-mono font-black">{cell.g}</span>
                  ) : cell.status === 'open' || cell.status === 'closed' ? (
                    <div className="text-[8px] font-mono leading-none flex flex-col items-center">
                      <span className="font-black">{cell.f !== Infinity ? Math.round(cell.f) : ''}</span>
                      <span className="opacity-70 text-[7px]">{cell.g}+{Math.round(cell.h)}</span>
                    </div>
                  ) : null}
                </button>
              );
            })
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-[#777777] mt-5">
          <div className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-lg bg-[#58CC02] border border-[#58A700] inline-block" /> Origen (A)</div>
          <div className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-lg bg-[#FF4B4B] border border-[#EA2B2B] inline-block" /> Objetivo (G)</div>
          <div className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-lg bg-[#4B4B4B] inline-block" /> Muro</div>
          <div className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-lg bg-[#DDF4FF] border border-[#84D8FF] inline-block" /> Abiertos (Frontera)</div>
          <div className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-lg bg-[#F2E5FF] border border-[#CE82FF] inline-block" /> Cerrados (Explorados)</div>
          <div className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-lg bg-[#FFC800] border border-[#E5A500] inline-block" /> Camino Óptimo</div>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-2xl border-2 border-b-4 border-[#E5E5E5]">
          <div className="text-[10px] uppercase font-black tracking-wider text-[#AFAFAF]">Coste Óptimo g*(G):</div>
          <div className="text-2xl font-black text-[#FF9600] font-mono mt-0.5">{pathStats.cost} pasos</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border-2 border-b-4 border-[#E5E5E5]">
          <div className="text-[10px] uppercase font-black tracking-wider text-[#AFAFAF]">Nodos en Cerrados (Expandidos):</div>
          <div className="text-2xl font-black text-[#A559D9] font-mono mt-0.5">{pathStats.visitedCount} nodos</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border-2 border-b-4 border-[#E5E5E5]">
          <div className="text-[10px] uppercase font-black tracking-wider text-[#AFAFAF]">Garantía de Optimalidad:</div>
          <div className="text-xs font-black text-[#58CC02] mt-2 flex items-center gap-1.5 uppercase">
            <CheckCircle2 className="w-4 h-4 text-[#58CC02]" />
            {algorithm.startsWith('astar') ? '100% Óptimo (h admisible)' : 'No garantizada'}
          </div>
        </div>
      </div>

      {/* Exam Pitfall alert */}
      <div className="bg-[#FFF4D9] border-2 border-b-4 border-[#FFD966] p-5 rounded-3xl flex items-start gap-3.5 text-xs text-[#B87A00] font-bold">
        <Info className="w-5 h-5 text-[#FF9600] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-black text-[#FF9600] uppercase tracking-wide block mb-1">
            Teorema de Admisibilidad y Monotonía (Examen FIUM SSII):
          </span>
          Una heurística h(n) es <strong>admisible</strong> si nunca sobreestima el coste real: h(n) &le; h*(n), lo que garantiza que A* en árbol siempre halla la solución óptima.
          Para que A* en <strong>grafo</strong> sea óptimo sin necesidad de reabrir nodos cerrados, h(n) debe ser además <strong>consistente (monótona)</strong>:
          h(n) &le; c(n, a, n') + h(n').
        </div>
      </div>
    </div>
  );
};
