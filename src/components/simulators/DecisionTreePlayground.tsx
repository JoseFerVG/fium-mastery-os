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
    <div className="bg-white border-2 border-b-[6px] border-[#E5E5E5] rounded-3xl p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#E5E5E5] pb-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#D7FFB8] border-2 border-b-4 border-[#58CC02] flex items-center justify-center text-[#58A700] shrink-0">
            <Calculator className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase bg-[#D7FFB8] text-[#58A700] border border-[#58CC02]">
                AC / MACHINE LEARNING
              </span>
              <span className="text-xs font-bold text-[#AFAFAF] uppercase">Métricas & Entropía</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#4B4B4B] uppercase tracking-tight mt-0.5">
              Laboratorio de Métricas & Árboles de Decisión
            </h3>
            <p className="text-xs text-[#777777] font-semibold">
              Matriz de confusión, Sensibilidad, Precisión, F1-Score, Entropía de Shannon y Ganancia ID3
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-[#F7F7F7] p-1.5 rounded-2xl border-2 border-[#E5E5E5] text-xs self-start sm:self-auto">
          <button
            onClick={() => {
              setActiveTab('confusion');
              soundManager.playClick();
            }}
            className={`px-3.5 py-2 rounded-xl font-black uppercase transition cursor-pointer ${
              activeTab === 'confusion' ? 'bg-[#58CC02] text-white shadow-sm' : 'text-[#777777] hover:text-[#4B4B4B]'
            }`}
          >
            📊 Matriz 2x2 & ROC
          </button>
          <button
            onClick={() => {
              setActiveTab('entropy');
              soundManager.playClick();
            }}
            className={`px-3.5 py-2 rounded-xl font-black uppercase transition cursor-pointer ${
              activeTab === 'entropy' ? 'bg-[#1CB0F6] text-white shadow-sm' : 'text-[#777777] hover:text-[#4B4B4B]'
            }`}
          >
            🌳 Entropía & Ganancia
          </button>
        </div>
      </div>

      {activeTab === 'confusion' ? (
        <div className="space-y-6">
          {/* Controls & Preset */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-black text-[#AFAFAF] uppercase tracking-wider">Ajuste de Valores de la Matriz (2x2):</span>
            <button
              onClick={loadCreditDatasetPreset}
              className="duo-btn-white text-xs px-3.5 py-2 cursor-pointer"
            >
              📋 Cargar Caso Práctica Caret (Crédito)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Visual 2x2 Matrix */}
            <div className="bg-[#F7F7F7] p-5 rounded-3xl border-2 border-[#E5E5E5]">
              <div className="text-center text-xs font-black text-[#777777] uppercase tracking-widest mb-3">CLASE REAL (GROUND TRUTH)</div>
              <div className="grid grid-cols-2 gap-3">
                {/* TP */}
                <div className="bg-[#D7FFB8] border-2 border-b-4 border-[#58CC02] p-4 rounded-2xl space-y-1">
                  <label htmlFor="matrix-tp-input" className="text-[10px] uppercase font-black text-[#58A700] block tracking-wider">
                    Verdaderos Positivos (TP)
                  </label>
                  <input
                    id="matrix-tp-input"
                    name="truePositives"
                    aria-label="Verdaderos positivos (TP)"
                    type="number"
                    min={0}
                    value={tp}
                    onChange={e => setTp(Number(e.target.value))}
                    className="w-full text-2xl font-black text-[#58A700] bg-transparent focus:outline-none font-mono"
                  />
                  <div className="text-[11px] text-[#58A700]/90 font-bold">Predicho: Pos &bull; Real: Pos</div>
                </div>

                {/* FP */}
                <div className="bg-[#FFF0F0] border-2 border-b-4 border-[#FF4B4B] p-4 rounded-2xl space-y-1">
                  <label htmlFor="matrix-fp-input" className="text-[10px] uppercase font-black text-[#EA2B2B] block tracking-wider">
                    Falsos Positivos (FP) - Tipo I
                  </label>
                  <input
                    id="matrix-fp-input"
                    name="falsePositives"
                    aria-label="Falsos positivos (FP)"
                    type="number"
                    min={0}
                    value={fp}
                    onChange={e => setFp(Number(e.target.value))}
                    className="w-full text-2xl font-black text-[#EA2B2B] bg-transparent focus:outline-none font-mono"
                  />
                  <div className="text-[11px] text-[#EA2B2B]/90 font-bold">Predicho: Pos &bull; Real: Neg</div>
                </div>

                {/* FN */}
                <div className="bg-[#FFF4D9] border-2 border-b-4 border-[#FFD966] p-4 rounded-2xl space-y-1">
                  <label htmlFor="matrix-fn-input" className="text-[10px] uppercase font-black text-[#B87A00] block tracking-wider">
                    Falsos Negativos (FN) - Tipo II
                  </label>
                  <input
                    id="matrix-fn-input"
                    name="falseNegatives"
                    aria-label="Falsos negativos (FN)"
                    type="number"
                    min={0}
                    value={fn}
                    onChange={e => setFn(Number(e.target.value))}
                    className="w-full text-2xl font-black text-[#B87A00] bg-transparent focus:outline-none font-mono"
                  />
                  <div className="text-[11px] text-[#B87A00]/90 font-bold">Predicho: Neg &bull; Real: Pos</div>
                </div>

                {/* TN */}
                <div className="bg-[#DDF4FF] border-2 border-b-4 border-[#84D8FF] p-4 rounded-2xl space-y-1">
                  <label htmlFor="matrix-tn-input" className="text-[10px] uppercase font-black text-[#1899D6] block tracking-wider">
                    Verdaderos Negativos (TN)
                  </label>
                  <input
                    id="matrix-tn-input"
                    name="trueNegatives"
                    aria-label="Verdaderos negativos (TN)"
                    type="number"
                    min={0}
                    value={tn}
                    onChange={e => setTn(Number(e.target.value))}
                    className="w-full text-2xl font-black text-[#1899D6] bg-transparent focus:outline-none font-mono"
                  />
                  <div className="text-[11px] text-[#1899D6]/90 font-bold">Predicho: Neg &bull; Real: Neg</div>
                </div>
              </div>
            </div>

            {/* Calculated Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-2xl border-2 border-b-4 border-[#E5E5E5]">
                <div className="text-[10px] font-black uppercase text-[#AFAFAF] tracking-wider">Exactitud (Accuracy)</div>
                <div className="text-2xl font-black text-[#4B4B4B] font-mono mt-0.5">{metrics.accuracy}%</div>
                <div className="text-[11px] text-[#777777] font-mono font-bold">(TP + TN) / Total</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border-2 border-b-4 border-[#E5E5E5]">
                <div className="text-[10px] font-black uppercase text-[#AFAFAF] tracking-wider">Precisión (PPV)</div>
                <div className="text-2xl font-black text-[#1CB0F6] font-mono mt-0.5">{metrics.precision}%</div>
                <div className="text-[11px] text-[#777777] font-mono font-bold">TP / (TP + FP)</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border-2 border-b-4 border-[#E5E5E5]">
                <div className="text-[10px] font-black uppercase text-[#AFAFAF] tracking-wider">Sensibilidad (Recall)</div>
                <div className="text-2xl font-black text-[#58CC02] font-mono mt-0.5">{metrics.recall}%</div>
                <div className="text-[11px] text-[#777777] font-mono font-bold">TP / (TP + FN)</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border-2 border-b-4 border-[#E5E5E5]">
                <div className="text-[10px] font-black uppercase text-[#AFAFAF] tracking-wider">Especificidad (TNR)</div>
                <div className="text-2xl font-black text-[#CE82FF] font-mono mt-0.5">{metrics.specificity}%</div>
                <div className="text-[11px] text-[#777777] font-mono font-bold">TN / (TN + FP)</div>
              </div>

              <div className="col-span-2 bg-[#F2E5FF] p-4 rounded-2xl border-2 border-b-4 border-[#CE82FF] flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase text-[#A559D9] tracking-wider">Puntuación F1 (F1-Score)</div>
                  <div className="text-xs text-[#777777] font-bold">Media armónica entre Precisión y Sensibilidad</div>
                </div>
                <div className="text-3xl font-black text-[#A559D9] font-mono">{metrics.f1}%</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Entropy & Gain View */
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-black text-[#AFAFAF] uppercase tracking-wider">Cálculo de Entropía y Ganancia al Dividir por un Atributo:</span>
            <button
              onClick={loadTennisPreset}
              className="duo-btn-white text-xs px-3.5 py-2 cursor-pointer"
            >
              📋 Cargar Caso ID3 PlayTennis
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Parent Node */}
            <div className="bg-white p-5 rounded-3xl border-2 border-b-4 border-[#E5E5E5] space-y-3">
              <div className="text-xs font-black text-[#4B4B4B] uppercase tracking-wider flex items-center justify-between">
                <span>Nodo Padre (S)</span>
                <span className="text-[#FF9600] font-mono font-black">{parentPos + parentNeg} muestras</span>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-[10px] font-black uppercase text-[#AFAFAF] tracking-wider block mb-1">Pos (+):</label>
                  <input
                    type="number"
                    min={0}
                    value={parentPos}
                    onChange={e => setParentPos(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F7F7F7] border-2 border-[#E5E5E5] rounded-xl text-[#4B4B4B] font-mono text-sm font-black focus:outline-none focus:border-[#58CC02]"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-black uppercase text-[#AFAFAF] tracking-wider block mb-1">Neg (-):</label>
                  <input
                    type="number"
                    min={0}
                    value={parentNeg}
                    onChange={e => setParentNeg(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F7F7F7] border-2 border-[#E5E5E5] rounded-xl text-[#4B4B4B] font-mono text-sm font-black focus:outline-none focus:border-[#FF4B4B]"
                  />
                </div>
              </div>
              <div className="pt-2.5 border-t-2 border-[#E5E5E5] text-xs flex justify-between font-mono">
                <span className="text-[#777777] font-bold">Entropía H(S):</span>
                <span className="text-[#FF9600] font-black">{entropyResults.parentEntropy} bits</span>
              </div>
            </div>

            {/* Split Branch 1 */}
            <div className="bg-white p-5 rounded-3xl border-2 border-b-4 border-[#84D8FF] space-y-3">
              <div className="text-xs font-black text-[#1CB0F6] uppercase tracking-wider flex items-center justify-between">
                <span>Rama 1 (v1)</span>
                <span className="text-[#1CB0F6] font-mono font-black">{b1Pos + b1Neg} muestras</span>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-[10px] font-black uppercase text-[#AFAFAF] tracking-wider block mb-1">Pos (+):</label>
                  <input
                    type="number"
                    min={0}
                    value={b1Pos}
                    onChange={e => setB1Pos(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F7F7F7] border-2 border-[#E5E5E5] rounded-xl text-[#4B4B4B] font-mono text-sm font-black focus:outline-none focus:border-[#1CB0F6]"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-black uppercase text-[#AFAFAF] tracking-wider block mb-1">Neg (-):</label>
                  <input
                    type="number"
                    min={0}
                    value={b1Neg}
                    onChange={e => setB1Neg(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F7F7F7] border-2 border-[#E5E5E5] rounded-xl text-[#4B4B4B] font-mono text-sm font-black focus:outline-none focus:border-[#1CB0F6]"
                  />
                </div>
              </div>
              <div className="pt-2.5 border-t-2 border-[#E5E5E5] text-xs flex justify-between font-mono">
                <span className="text-[#777777] font-bold">H(S_v1):</span>
                <span className="text-[#1CB0F6] font-black">{entropyResults.b1Entropy} bits</span>
              </div>
            </div>

            {/* Split Branch 2 */}
            <div className="bg-white p-5 rounded-3xl border-2 border-b-4 border-[#58CC02] space-y-3">
              <div className="text-xs font-black text-[#58A700] uppercase tracking-wider flex items-center justify-between">
                <span>Rama 2 (v2)</span>
                <span className="text-[#58A700] font-mono font-black">{b2Pos + b2Neg} muestras</span>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-[10px] font-black uppercase text-[#AFAFAF] tracking-wider block mb-1">Pos (+):</label>
                  <input
                    type="number"
                    min={0}
                    value={b2Pos}
                    onChange={e => setB2Pos(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F7F7F7] border-2 border-[#E5E5E5] rounded-xl text-[#4B4B4B] font-mono text-sm font-black focus:outline-none focus:border-[#58CC02]"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-black uppercase text-[#AFAFAF] tracking-wider block mb-1">Neg (-):</label>
                  <input
                    type="number"
                    min={0}
                    value={b2Neg}
                    onChange={e => setB2Neg(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F7F7F7] border-2 border-[#E5E5E5] rounded-xl text-[#4B4B4B] font-mono text-sm font-black focus:outline-none focus:border-[#58CC02]"
                  />
                </div>
              </div>
              <div className="pt-2.5 border-t-2 border-[#E5E5E5] text-xs flex justify-between font-mono">
                <span className="text-[#777777] font-bold">H(S_v2):</span>
                <span className="text-[#58A700] font-black">{entropyResults.b2Entropy} bits</span>
              </div>
            </div>
          </div>

          {/* Gain Result Highlight */}
          <div className="bg-[#DDF4FF] p-6 rounded-3xl border-2 border-b-4 border-[#84D8FF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase font-black text-[#1899D6] tracking-wider">Ganancia de Información Neta:</div>
              <div className="text-3xl font-black text-[#1899D6] font-mono mt-1">
                Gain(S, A) = {entropyResults.gain} bits
              </div>
              <div className="text-xs text-[#777777] mt-1 font-mono font-bold">
                Gain = H(S) - Remainder = {entropyResults.parentEntropy} - {entropyResults.remainder}
              </div>
            </div>

            <div className="px-4 py-2.5 bg-white border-2 border-b-4 border-[#84D8FF] rounded-2xl text-xs font-black text-[#1CB0F6]">
              {entropyResults.gain > 0.4 ? '🔥 Partición excelente (Alta reducción de incertidumbre)' : 'Atributo con ganancia moderada o baja'}
            </div>
          </div>
        </div>
      )}

      {/* Exam Pitfall alert */}
      <div className="bg-[#D7FFB8] border-2 border-b-4 border-[#58CC02] p-5 rounded-3xl flex items-start gap-3.5 text-xs text-[#58A700] font-bold">
        <Sparkles className="w-5 h-5 text-[#58CC02] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-black text-[#58A700] uppercase tracking-wide block mb-1">
            Trampa Clásica de Aprendizaje Computacional en la FIUM:
          </span>
          En conjuntos de datos altamente desbalanceados (ej. Detección de Fraude en Tarjetas de Crédito, 99% No Fraude y 1% Fraude),
          la métrica de Exactitud (Accuracy) es un ENGAÑO mortal: un clasificador trivial que diga siempre "No Fraude" obtiene un 99% de Accuracy pero es inútil.
          En exámenes SIEMPRE debes justificar el uso de <strong>Sensibilidad (Recall)</strong>, <strong>F1-Score</strong> o el <strong>Área bajo la Curva ROC (AUC)</strong>.
        </div>
      </div>
    </div>
  );
};
