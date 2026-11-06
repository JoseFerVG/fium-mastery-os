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
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20">
            <Navigation className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">Visualizador de Búsqueda Heurística en Espacio de Estados (A*)</h3>
            <p className="text-xs text-slate-400">Algoritmo A*, admisibilidad de heurísticas, frontera (abiertos) y lista de cerrados de Sistemas Inteligentes</p>
          </div>
        </div>

        <button
          onClick={handleResetWalls}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Limpiar Muros
        </button>
      </div>

      {/* Algorithm & Drawing Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Algo Picker */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'astar_manhattan', label: 'A* (Manhattan)', desc: 'Admisible en rejilla 4-vecinos' },
            { id: 'astar_euclidean', label: 'A* (Euclídea)', desc: 'Línea recta h(n) <= h*(n)' },
            { id: 'greedy', label: 'Primero el Mejor (Greedy)', desc: 'Solo evalúa h(n), no óptimo' },
            { id: 'dijkstra', label: 'Costo Uniforme / Dijkstra', desc: 'Solo evalúa g(n)' },
            { id: 'bfs', label: 'Anchura (BFS)', desc: 'No informado' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => {
                setAlgorithm(item.id as typeof algorithm);
                soundManager.playClick();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                algorithm === item.id
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md shadow-amber-500/10'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Draw tool */}
        <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          <span className="text-[11px] font-bold text-slate-400 px-2">Modo Pincel:</span>
          <button
            onClick={() => setDrawMode('wall')}
            className={`px-2.5 py-1 rounded-lg font-bold transition ${drawMode === 'wall' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
          >
            🧱 Muro
          </button>
          <button
            onClick={() => setDrawMode('start')}
            className={`px-2.5 py-1 rounded-lg font-bold transition ${drawMode === 'start' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
          >
            🟢 Origen
          </button>
          <button
            onClick={() => setDrawMode('goal')}
            className={`px-2.5 py-1 rounded-lg font-bold transition ${drawMode === 'goal' ? 'bg-rose-600 text-white' : 'text-slate-400'}`}
          >
            🎯 Destino
          </button>
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col items-center overflow-x-auto">
        <div className="grid grid-cols-13 gap-1.5 min-w-[580px]">
          {gridState.map((row, r) =>
            row.map((cell, c) => {
              const isStart = r === startPos[0] && c === startPos[1];
              const isGoal = r === goalPos[0] && c === goalPos[1];

              let cellBg = 'bg-slate-900 border-slate-800/80 text-slate-600';
              if (cell.isWall) cellBg = 'bg-slate-700 border-slate-600';
              else if (isStart) cellBg = 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-500/30';
              else if (isGoal) cellBg = 'bg-rose-600 border-rose-400 text-white shadow-lg shadow-rose-500/30';
              else if (cell.status === 'path') cellBg = 'bg-amber-400 border-amber-300 text-slate-950 font-black shadow-lg shadow-amber-400/20';
              else if (cell.status === 'open') cellBg = 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300';
              else if (cell.status === 'closed') cellBg = 'bg-indigo-950/40 border-indigo-500/30 text-indigo-400';

              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  className={`w-11 h-11 rounded-lg border flex flex-col items-center justify-center transition-all duration-150 hover:scale-105 select-none ${cellBg}`}
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
                      <span className="font-bold">{cell.f !== Infinity ? Math.round(cell.f) : ''}</span>
                      <span className="opacity-70 text-[7px]">{cell.g}+{Math.round(cell.h)}</span>
                    </div>
                  ) : null}
                </button>
              );
            })
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 mt-4">
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-600 inline-block" /> Origen (A)</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-rose-600 inline-block" /> Objetivo (G)</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-slate-700 inline-block" /> Muro</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-cyan-950 border border-cyan-500 inline-block" /> Frontera (Abiertos)</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-indigo-950 border border-indigo-500 inline-block" /> Explorados (Cerrados)</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-400 inline-block" /> Camino Óptimo</div>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-400">Coste Óptimo g*(G):</div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-0.5">{pathStats.cost} pasos</div>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-400">Nodos en Cerrados (Expandidos):</div>
          <div className="text-2xl font-black text-indigo-400 font-mono mt-0.5">{pathStats.visitedCount} nodos</div>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-400">Garantía de Optimalidad:</div>
          <div className="text-xs font-bold text-emerald-400 mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            {algorithm.startsWith('astar') ? '100% Óptimo (h es admisible)' : 'No garantizada'}
          </div>
        </div>
      </div>

      {/* Exam Pitfall alert */}
      <div className="bg-amber-950/20 border border-amber-900/40 p-4 rounded-2xl flex items-start gap-3 text-xs text-amber-200/90">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-300">Teorema de Admisibilidad y Monotonía (Examen FIUM SSII):</span>
          {' '}Una heurística h(n) es <strong>admisible</strong> si nunca sobreestima el coste real: h(n) &le; h*(n), lo que garantiza que A* en árbol siempre halla la solución óptima.
          Para que A* en <strong>grafo</strong> sea óptimo sin necesidad de reabrir nodos cerrados, h(n) debe ser además <strong>consistente (monótona)</strong>:
          h(n) &le; c(n, a, n') + h(n').
        </div>
      </div>
    </div>
  );
};
