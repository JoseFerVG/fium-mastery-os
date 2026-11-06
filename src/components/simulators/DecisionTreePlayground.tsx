import React, { useState, useMemo } from 'react';
import { Network, Calculator, RotateCcw, Sparkles, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

export const DecisionTreePlayground: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'confusion' | 'entropy'>('confusion');

  // Confusion matrix states
  const [tp, setTp] = useState<number>(75);
  const [fp, setFp] = useState<number>(15);
  const [fn, setFn] = useState<number>(10);
  const [tn, setTn] = useState<number>(150);

  // Entropy calculator states (Parent set S)
  const [parentPos, setParentPos] = useState<number>(9);
  const [parentNeg, setParentNeg] = useState<number>(5);

  // Split attribute branch 1
  const [b1Pos, setB1Pos] = useState<number>(6);
  const [b1Neg, setB1Neg] = useState<number>(2);

  // Split attribute branch 2
  const [b2Pos, setB2Pos] = useState<number>(3);
  const [b2Neg, setB2Neg] = useState<number>(3);

  // Metrics computation for Confusion Matrix
  const metrics = useMemo(() => {
    const total = tp + fp + fn + tn;
    if (total === 0) return { accuracy: 0, precision: 0, recall: 0, specificity: 0, f1: 0, fpr: 0 };

    const accuracy = (tp + tn) / total;
    const precision = (tp + fp) > 0 ? tp / (tp + fp) : 0;
    const recall = (tp + fn) > 0 ? tp / (tp + fn) : 0; // Sensitivity
    const specificity = (tn + fp) > 0 ? tn / (tn + fp) : 0;
    const f1 = (precision + recall) > 0 ? (2 * precision * recall) / (precision + recall) : 0;
    const fpr = 1 - specificity;

    return {
      total,
      accuracy: Number((accuracy * 100).toFixed(2)),
      precision: Number((precision * 100).toFixed(2)),
      recall: Number((recall * 100).toFixed(2)),
      specificity: Number((specificity * 100).toFixed(2)),
      f1: Number((f1 * 100).toFixed(2)),
      fpr: Number((fpr * 100).toFixed(2))
    };
  }, [tp, fp, fn, tn]);

  // Entropy helper
  const calcEntropy = (pos: number, neg: number): number => {
    const total = pos + neg;
    if (total === 0 || pos === 0 || neg === 0) return 0;
    const p1 = pos / total;
    const p2 = neg / total;
    return -(p1 * Math.log2(p1) + p2 * Math.log2(p2));
  };

  // Information Gain calculation
  const entropyResults = useMemo(() => {
    const parentEntropy = calcEntropy(parentPos, parentNeg);

    const b1Total = b1Pos + b1Neg;
    const b2Total = b2Pos + b2Neg;
    const totalSamples = b1Total + b2Total;

    const b1Entropy = calcEntropy(b1Pos, b1Neg);
    const b2Entropy = calcEntropy(b2Pos, b2Neg);

    const remainder = totalSamples > 0 
      ? (b1Total / totalSamples) * b1Entropy + (b2Total / totalSamples) * b2Entropy 
      : 0;

    const gain = Math.max(0, parentEntropy - remainder);

    return {
      parentEntropy: Number(parentEntropy.toFixed(4)),
      b1Entropy: Number(b1Entropy.toFixed(4)),
      b2Entropy: Number(b2Entropy.toFixed(4)),
      remainder: Number(remainder.toFixed(4)),
      gain: Number(gain.toFixed(4))
    };
  }, [parentPos, parentNeg, b1Pos, b1Neg, b2Pos, b2Neg]);

  const loadCreditDatasetPreset = () => {
    // Preset from the FIUM caret practical exam (Credit approval)
    setTp(68);
    setFp(18);
    setFn(14);
    setTn(100);
    soundManager.playCorrect();
  };

  const loadTennisPreset = () => {
    // Classic Quinlan ID3 PlayTennis: 9 Yes, 5 No
    setParentPos(9);
    setParentNeg(5);
    setB1Pos(4);
    setB1Neg(0); // Outlook = Overcast (Pure entropy = 0!)
    setB2Pos(5);
    setB2Neg(5); // Remainder
    soundManager.playCorrect();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">Laboratorio de Métricas & Árboles de Decisión (AC)</h3>
            <p className="text-xs text-slate-400">Matriz de confusión, Sensibilidad, Precisión, Curvas ROC, Entropía de Shannon y Ganancia de Información</p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs self-start sm:self-auto">
          <button
            onClick={() => {
              setActiveTab('confusion');
              soundManager.playClick();
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              activeTab === 'confusion' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            📊 Matriz de Confusión & ROC
          </button>
          <button
            onClick={() => {
              setActiveTab('entropy');
              soundManager.playClick();
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              activeTab === 'entropy' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            🌳 Entropía & Ganancia (ID3 / C4.5)
          </button>
        </div>
      </div>

      {activeTab === 'confusion' ? (
        <div className="space-y-6">
          {/* Controls & Preset */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ajuste de Valores de la Matriz (2x2):</span>
            <button
              onClick={loadCreditDatasetPreset}
              className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Cargar Preset Práctica Caret (Crédito)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Visual 2x2 Matrix */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <div className="text-center text-xs font-bold text-slate-400 mb-3">CLASE REAL (GROUND TRUTH)</div>
              <div className="grid grid-cols-2 gap-3">
                {/* TP */}
                <div className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-xl space-y-1">
                  <label htmlFor="matrix-tp-input" className="text-[10px] uppercase font-bold text-emerald-400 block">Verdaderos Positivos (TP)</label>
                  <input
                    id="matrix-tp-input"
                    name="truePositives"
                    aria-label="Verdaderos positivos (TP)"
                    type="number"
                    min={0}
                    value={tp}
                    onChange={e => setTp(Number(e.target.value))}
                    className="w-full text-2xl font-black text-white bg-transparent focus:outline-none font-mono"
                  />
                  <div className="text-[10px] text-emerald-300/70">Predicho: Positivo &bull; Real: Positivo</div>
                </div>

                {/* FP */}
                <div className="bg-rose-950/40 border border-rose-500/40 p-4 rounded-xl space-y-1">
                  <label htmlFor="matrix-fp-input" className="text-[10px] uppercase font-bold text-rose-400 block">Falsos Positivos (FP) - Error Tipo I</label>
                  <input
                    id="matrix-fp-input"
                    name="falsePositives"
                    aria-label="Falsos positivos (FP)"
                    type="number"
                    min={0}
                    value={fp}
                    onChange={e => setFp(Number(e.target.value))}
                    className="w-full text-2xl font-black text-white bg-transparent focus:outline-none font-mono"
                  />
                  <div className="text-[10px] text-rose-300/70">Predicho: Positivo &bull; Real: Negativo</div>
                </div>

                {/* FN */}
                <div className="bg-amber-950/40 border border-amber-500/40 p-4 rounded-xl space-y-1">
                  <label htmlFor="matrix-fn-input" className="text-[10px] uppercase font-bold text-amber-400 block">Falsos Negativos (FN) - Error Tipo II</label>
                  <input
                    id="matrix-fn-input"
                    name="falseNegatives"
                    aria-label="Falsos negativos (FN)"
                    type="number"
                    min={0}
                    value={fn}
                    onChange={e => setFn(Number(e.target.value))}
                    className="w-full text-2xl font-black text-white bg-transparent focus:outline-none font-mono"
                  />
                  <div className="text-[10px] text-amber-300/70">Predicho: Negativo &bull; Real: Positivo</div>
                </div>

                {/* TN */}
                <div className="bg-cyan-950/40 border border-cyan-500/40 p-4 rounded-xl space-y-1">
                  <label htmlFor="matrix-tn-input" className="text-[10px] uppercase font-bold text-cyan-400 block">Verdaderos Negativos (TN)</label>
                  <input
                    id="matrix-tn-input"
                    name="trueNegatives"
                    aria-label="Verdaderos negativos (TN)"
                    type="number"
                    min={0}
                    value={tn}
                    onChange={e => setTn(Number(e.target.value))}
                    className="w-full text-2xl font-black text-white bg-transparent focus:outline-none font-mono"
                  />
                  <div className="text-[10px] text-cyan-300/70">Predicho: Negativo &bull; Real: Negativo</div>
                </div>
              </div>
            </div>

            {/* Calculated Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-[10px] font-bold uppercase text-slate-400">Exactitud (Accuracy)</div>
                <div className="text-2xl font-black text-white font-mono mt-0.5">{metrics.accuracy}%</div>
                <div className="text-[10px] text-slate-500 font-mono">(TP + TN) / Total</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-[10px] font-bold uppercase text-slate-400">Precisión (PPV)</div>
                <div className="text-2xl font-black text-sky-400 font-mono mt-0.5">{metrics.precision}%</div>
                <div className="text-[10px] text-slate-500 font-mono">TP / (TP + FP)</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-[10px] font-bold uppercase text-slate-400">Sensibilidad / Recall (TPR)</div>
                <div className="text-2xl font-black text-emerald-400 font-mono mt-0.5">{metrics.recall}%</div>
                <div className="text-[10px] text-slate-500 font-mono">TP / (TP + FN)</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-[10px] font-bold uppercase text-slate-400">Especificidad (TNR)</div>
                <div className="text-2xl font-black text-cyan-400 font-mono mt-0.5">{metrics.specificity}%</div>
                <div className="text-[10px] text-slate-500 font-mono">TN / (TN + FP)</div>
              </div>

              <div className="col-span-2 bg-slate-950 p-4 rounded-xl border border-indigo-500/40 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase text-indigo-300">Puntuación F1 (F1-Score)</div>
                  <div className="text-[10px] text-slate-400">Media armónica entre Precisión y Sensibilidad</div>
                </div>
                <div className="text-3xl font-black text-indigo-400 font-mono">{metrics.f1}%</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Entropy & Gain View */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cálculo de Entropía y Ganancia al Dividir por un Atributo:</span>
            <button
              onClick={loadTennisPreset}
              className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Cargar Preset ID3 PlayTennis
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Parent Node */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-white uppercase flex items-center justify-between">
                <span>Nodo Padre (Conjunto S)</span>
                <span className="text-amber-400 font-mono font-black">{parentPos + parentNeg} muestras</span>
              </div>
              <div className="flex gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400">Positivos (+):</label>
                  <input
                    type="number"
                    min={0}
                    value={parentPos}
                    onChange={e => setParentPos(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400">Negativos (-):</label>
                  <input
                    type="number"
                    min={0}
                    value={parentNeg}
                    onChange={e => setParentNeg(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-sm"
                  />
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 text-xs flex justify-between font-mono">
                <span className="text-slate-400">Entropía H(S):</span>
                <span className="text-amber-400 font-bold">{entropyResults.parentEntropy} bits</span>
              </div>
            </div>

            {/* Split Branch 1 */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-sky-300 uppercase flex items-center justify-between">
                <span>Rama 1 (Atributo = v1)</span>
                <span className="text-sky-400 font-mono font-black">{b1Pos + b1Neg} muestras</span>
              </div>
              <div className="flex gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400">Pos (+):</label>
                  <input
                    type="number"
                    min={0}
                    value={b1Pos}
                    onChange={e => setB1Pos(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400">Neg (-):</label>
                  <input
                    type="number"
                    min={0}
                    value={b1Neg}
                    onChange={e => setB1Neg(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-sm"
                  />
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 text-xs flex justify-between font-mono">
                <span className="text-slate-400">H(S_v1):</span>
                <span className="text-sky-400 font-bold">{entropyResults.b1Entropy} bits</span>
              </div>
            </div>

            {/* Split Branch 2 */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-emerald-300 uppercase flex items-center justify-between">
                <span>Rama 2 (Atributo = v2)</span>
                <span className="text-emerald-400 font-mono font-black">{b2Pos + b2Neg} muestras</span>
              </div>
              <div className="flex gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400">Pos (+):</label>
                  <input
                    type="number"
                    min={0}
                    value={b2Pos}
                    onChange={e => setB2Pos(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400">Neg (-):</label>
                  <input
                    type="number"
                    min={0}
                    value={b2Neg}
                    onChange={e => setB2Neg(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-sm"
                  />
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 text-xs flex justify-between font-mono">
                <span className="text-slate-400">H(S_v2):</span>
                <span className="text-emerald-400 font-bold">{entropyResults.b2Entropy} bits</span>
              </div>
            </div>
          </div>

          {/* Gain Result Highlight */}
          <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 p-6 rounded-2xl border border-indigo-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase font-bold text-indigo-300">Ganancia de Información Neta:</div>
              <div className="text-3xl font-black text-white font-mono mt-1">
                Gain(S, A) = {entropyResults.gain} bits
              </div>
              <div className="text-xs text-slate-400 mt-1 font-mono">
                Gain = H(S) - Remainder = {entropyResults.parentEntropy} - {entropyResults.remainder}
              </div>
            </div>

            <div className="px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-xl text-xs text-indigo-200">
              {entropyResults.gain > 0.4 ? '🔥 Partición excelente (Alta reducción de incertidumbre)' : 'Atributo con ganancia moderada o baja'}
            </div>
          </div>
        </div>
      )}

      {/* Exam Pitfall alert */}
      <div className="bg-emerald-950/20 border border-emerald-900/40 p-4 rounded-2xl flex items-start gap-3 text-xs text-emerald-200/90">
        <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-emerald-300">Trampa Clásica de Aprendizaje Computacional en la FIUM:</span>
          {' '}En conjuntos de datos altamente desbalanceados (ej. Detección de Fraude en Tarjetas de Crédito, 99% No Fraude y 1% Fraude),
          la métrica de Exactitud (Accuracy) es un ENGAÑO mortal: un clasificador trivial que diga siempre "No Fraude" obtiene un 99% de Accuracy pero es inútil.
          En exámenes SIEMPRE debes justificar el uso de <strong>Sensibilidad (Recall)</strong>, <strong>F1-Score</strong> o el <strong>Área bajo la Curva ROC (AUC)</strong>.
        </div>
      </div>
    </div>
  );
};
