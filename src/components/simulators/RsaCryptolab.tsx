import React, { useState, useMemo } from 'react';
import { Key, Lock, Unlock, RotateCcw, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

function gcd(a: number, b: number): number {
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function modInverse(e: number, phi: number): number {
  let m0 = phi;
  let y = 0, x = 1;
  if (phi === 1) return 0;
  while (e > 1) {
    const q = Math.floor(e / phi);
    let t = phi;
    phi = e % phi;
    e = t;
    t = y;
    y = x - q * y;
    x = t;
  }
  if (x < 0) x += m0;
  return x;
}

function modPow(base: number, exp: number, mod: number): number {
  let res = 1;
  base = base % mod;
  while (exp > 0) {
    if (exp % 2 === 1) res = (res * base) % mod;
    base = (base * base) % mod;
    exp = Math.floor(exp / 2);
  }
  return res;
}

export const RsaCryptolab: React.FC = () => {
  const [p, setP] = useState<number>(5);
  const [q, setQ] = useState<number>(11);
  const [e, setE] = useState<number>(3);
  const [message, setMessage] = useState<number>(8);

  // RSA Math
  const rsa = useMemo(() => {
    const n = p * q;
    const phi = (p - 1) * (q - 1);
    const isEValid = e > 1 && e < phi && gcd(e, phi) === 1;
    const d = isEValid ? modInverse(e, phi) : 0;

    // Encrypt
    const ciphertext = (isEValid && message < n) ? modPow(message, e, n) : null;
    // Decrypt
    const decryptedMessage = (ciphertext !== null && isEValid) ? modPow(ciphertext, d, n) : null;

    return {
      n,
      phi,
      isEValid,
      d,
      ciphertext,
      decryptedMessage
    };
  }, [p, q, e, message]);

  const loadExamPreset = () => {
    setP(5);
    setQ(11);
    setE(3);
    setMessage(8);
    soundManager.playCorrect();
  };

  const loadLargerPreset = () => {
    setP(13);
    setQ(17);
    setE(5);
    setMessage(42);
    soundManager.playCorrect();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-2xl border border-purple-500/20">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">Laboratorio Criptográfico RSA (Servicios Telemáticos)</h3>
            <p className="text-xs text-slate-400">Generación de claves asimétricas, aritmética modular y cifrado paso a paso</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadExamPreset}
            className="px-3 py-1.5 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:text-white text-xs font-bold transition"
          >
            📋 Cargar Ejercicio de Examen (p=5, q=11)
          </button>
          <button
            onClick={loadLargerPreset}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            Caso p=13, q=17
          </button>
        </div>
      </div>

      {/* Setup Step 1: Primes Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
        <div>
          <label htmlFor="rsa-prime-p" className="block text-xs font-bold text-slate-300 mb-1">Primo p:</label>
          <input
            id="rsa-prime-p"
            name="primeP"
            aria-label="Primer número primo p secreto"
            type="number"
            min={3}
            max={97}
            value={p}
            onChange={ev => setP(Number(ev.target.value))}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-purple-500"
          />
          <span className="text-[10px] text-slate-500 mt-0.5 block">Primer factor primo secreto</span>
        </div>

        <div>
          <label htmlFor="rsa-prime-q" className="block text-xs font-bold text-slate-300 mb-1">Primo q:</label>
          <input
            id="rsa-prime-q"
            name="primeQ"
            aria-label="Segundo número primo q secreto"
            type="number"
            min={3}
            max={97}
            value={q}
            onChange={ev => setQ(Number(ev.target.value))}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-purple-500"
          />
          <span className="text-[10px] text-slate-500 mt-0.5 block">Segundo factor primo secreto</span>
        </div>

        <div>
          <label htmlFor="rsa-public-e" className="block text-xs font-bold text-slate-300 mb-1">Exponente Público e:</label>
          <input
            id="rsa-public-e"
            name="publicE"
            aria-label="Exponente público e coprimo con phi"
            type="number"
            min={2}
            value={e}
            onChange={ev => setE(Number(ev.target.value))}
            className={`w-full px-3 py-2 bg-slate-900 border rounded-xl text-white font-mono text-sm focus:outline-none ${
              rsa.isEValid ? 'border-slate-800 focus:border-purple-500' : 'border-rose-500 text-rose-300'
            }`}
          />
          <span className={`text-[10px] mt-0.5 block ${rsa.isEValid ? 'text-emerald-400' : 'text-rose-400 font-bold'}`}>
            {rsa.isEValid ? `mcd(e, ${rsa.phi}) = 1 (Válido)` : `Inválido: no es coprimo con phi=${rsa.phi}`}
          </span>
        </div>
      </div>

      {/* Step-by-Step Mathematical Derivations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-400">1. Módulo n (Público)</div>
          <div className="text-xl font-black text-white font-mono mt-1">n = {rsa.n}</div>
          <div className="text-[11px] text-slate-500 font-mono mt-1">n = p &times; q = {p} &times; {q}</div>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-400">2. Función Euler &phi;(n)</div>
          <div className="text-xl font-black text-amber-400 font-mono mt-1">&phi;(n) = {rsa.phi}</div>
          <div className="text-[11px] text-slate-500 font-mono mt-1">(p-1)(q-1) = {p-1} &times; {q-1}</div>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-purple-500/30">
          <div className="text-[10px] uppercase font-bold text-purple-300">3. Clave Pública (e, n)</div>
          <div className="text-xl font-black text-purple-400 font-mono mt-1">({e}, {rsa.n})</div>
          <div className="text-[11px] text-slate-500 mt-1">Conocida por todo el mundo</div>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-rose-500/30">
          <div className="text-[10px] uppercase font-bold text-rose-300">4. Clave Privada (d, n)</div>
          <div className="text-xl font-black text-rose-400 font-mono mt-1">({rsa.d}, {rsa.n})</div>
          <div className="text-[11px] text-slate-500 font-mono mt-1">e&times;d &equiv; 1 (mod &phi;) &rarr; {e}&times;{rsa.d} = {e * rsa.d}</div>
        </div>
      </div>

      {/* Interactive Encryption & Decryption Pipeline */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Prueba de Cifrado y Descifrado en Tiempo Real</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Plaintext */}
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
            <label htmlFor="rsa-message-input" className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5"><Unlock className="w-3.5 h-3.5 text-sky-400" /> Mensaje Claro (M)</span>
              <span className="text-[10px] text-slate-500">M &lt; n</span>
            </label>
            <input
              id="rsa-message-input"
              name="rsaMessage"
              aria-label="Mensaje en claro M para cifrar"
              type="number"
              min={0}
              max={rsa.n - 1}
              value={message}
              onChange={ev => setMessage(Number(ev.target.value))}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-lg font-black focus:outline-none focus:border-sky-500"
            />
            <div className="text-[11px] text-slate-400">
              Fórmula de cifrado: <code className="text-sky-300 font-bold">C = M^e mod n</code>
            </div>
          </div>

          {/* Ciphertext */}
          <div className="bg-purple-950/20 p-4 rounded-2xl border border-purple-500/40 space-y-2 text-center">
            <div className="text-xs font-bold text-purple-300 flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Texto Cifrado (C)
            </div>
            <div className="text-3xl font-black text-purple-400 font-mono">
              {rsa.ciphertext !== null ? rsa.ciphertext : '---'}
            </div>
            <div className="text-[11px] font-mono text-purple-200/80">
              {message}<sup>{e}</sup> mod {rsa.n} = {rsa.ciphertext}
            </div>
          </div>

          {/* Decrypted */}
          <div className="bg-emerald-950/20 p-4 rounded-2xl border border-emerald-500/40 space-y-2">
            <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Mensaje Descifrado (M')
            </div>
            <div className="text-3xl font-black text-emerald-400 font-mono">
              {rsa.decryptedMessage !== null ? rsa.decryptedMessage : '---'}
            </div>
            <div className="text-[11px] font-mono text-emerald-200/80">
              C<sup>d</sup> mod n = {rsa.ciphertext}<sup>{rsa.d}</sup> mod {rsa.n} = <span className="font-bold underline">{rsa.decryptedMessage}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Exam Pitfall alert */}
      <div className="bg-purple-950/20 border border-purple-900/40 p-4 rounded-2xl flex items-start gap-3 text-xs text-purple-200/90">
        <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-purple-300">Regla Clave del Examen de SSTT (RSA):</span>
          {' '}Para calcular potencias grandes como 8³ mod 55 a mano en el examen, nunca eleves al número completo.
          Aplica siempre la propiedad modular: <code className="text-purple-300">8³ = 8² &times; 8 = 64 &times; 8 &equiv; 9 &times; 8 = 72 &equiv; 17 (mod 55)</code>.
          ¡El tribunal busca que demuestres simplificaciones intermedias paso a paso!
        </div>
      </div>
    </div>
  );
};
