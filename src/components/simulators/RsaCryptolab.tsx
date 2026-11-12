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
    <div className="bg-white border-2 border-b-[6px] border-[#E5E5E5] rounded-3xl p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#E5E5E5] pb-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#F2E5FF] border-2 border-b-4 border-[#CE82FF] flex items-center justify-center text-[#A559D9] shrink-0">
            <Key className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase bg-[#F2E5FF] text-[#A559D9] border border-[#CE82FF]">
                SSTT / SEGURIDAD
              </span>
              <span className="text-xs font-bold text-[#AFAFAF] uppercase">Criptografía Asimétrica</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#4B4B4B] uppercase tracking-tight mt-0.5">
              Laboratorio Criptográfico RSA
            </h3>
            <p className="text-xs text-[#777777] font-semibold">
              Generación de claves asimétricas, aritmética modular y cifrado paso a paso
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={loadExamPreset}
            className="duo-btn-purple text-xs px-3.5 py-2 cursor-pointer"
          >
            📋 Caso Examen (p=5, q=11)
          </button>
          <button
            onClick={loadLargerPreset}
            className="duo-btn-white text-xs px-3.5 py-2 cursor-pointer"
          >
            Caso p=13, q=17
          </button>
        </div>
      </div>

      {/* Setup Step 1: Primes Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#F7F7F7] p-5 rounded-3xl border-2 border-[#E5E5E5]">
        <div>
          <label htmlFor="rsa-prime-p" className="block text-xs font-black text-[#4B4B4B] uppercase tracking-wider mb-1.5">
            Primo p (Secreto):
          </label>
          <input
            id="rsa-prime-p"
            name="primeP"
            aria-label="Primer número primo p secreto"
            type="number"
            min={3}
            max={97}
            value={p}
            onChange={ev => setP(Number(ev.target.value))}
            className="w-full px-4 py-2.5 bg-white border-2 border-b-4 border-[#E5E5E5] rounded-2xl text-[#4B4B4B] font-mono text-sm font-black focus:outline-none focus:border-[#CE82FF] transition"
          />
          <span className="text-[11px] text-[#777777] font-medium mt-1 block">Primer factor primo secreto</span>
        </div>

        <div>
          <label htmlFor="rsa-prime-q" className="block text-xs font-black text-[#4B4B4B] uppercase tracking-wider mb-1.5">
            Primo q (Secreto):
          </label>
          <input
            id="rsa-prime-q"
            name="primeQ"
            aria-label="Segundo número primo q secreto"
            type="number"
            min={3}
            max={97}
            value={q}
            onChange={ev => setQ(Number(ev.target.value))}
            className="w-full px-4 py-2.5 bg-white border-2 border-b-4 border-[#E5E5E5] rounded-2xl text-[#4B4B4B] font-mono text-sm font-black focus:outline-none focus:border-[#CE82FF] transition"
          />
          <span className="text-[11px] text-[#777777] font-medium mt-1 block">Segundo factor primo secreto</span>
        </div>

        <div>
          <label htmlFor="rsa-public-e" className="block text-xs font-black text-[#4B4B4B] uppercase tracking-wider mb-1.5">
            Exponente Público e:
          </label>
          <input
            id="rsa-public-e"
            name="publicE"
            aria-label="Exponente público e coprimo con phi"
            type="number"
            min={2}
            value={e}
            onChange={ev => setE(Number(ev.target.value))}
            className={`w-full px-4 py-2.5 bg-white border-2 border-b-4 rounded-2xl text-[#4B4B4B] font-mono text-sm font-black focus:outline-none transition ${
              rsa.isEValid ? 'border-[#E5E5E5] focus:border-[#CE82FF]' : 'border-[#FF4B4B] text-[#FF4B4B]'
            }`}
          />
          <span className={`text-[11px] mt-1 block font-bold ${rsa.isEValid ? 'text-[#58CC02]' : 'text-[#FF4B4B]'}`}>
            {rsa.isEValid ? `✓ mcd(e, ${rsa.phi}) = 1 (Válido)` : `✗ Inválido: no es coprimo con phi=${rsa.phi}`}
          </span>
        </div>
      </div>

      {/* Step-by-Step Mathematical Derivations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border-2 border-b-4 border-[#E5E5E5]">
          <div className="text-[10px] uppercase font-black tracking-wider text-[#AFAFAF]">1. Módulo n (Público)</div>
          <div className="text-xl font-black text-[#4B4B4B] font-mono mt-1">n = {rsa.n}</div>
          <div className="text-[11px] text-[#777777] font-mono font-bold mt-1">n = p &times; q = {p} &times; {q}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border-2 border-b-4 border-[#E5E5E5]">
          <div className="text-[10px] uppercase font-black tracking-wider text-[#AFAFAF]">2. Función Euler &phi;(n)</div>
          <div className="text-xl font-black text-[#FF9600] font-mono mt-1">&phi;(n) = {rsa.phi}</div>
          <div className="text-[11px] text-[#777777] font-mono font-bold mt-1">(p-1)(q-1) = {p-1} &times; {q-1}</div>
        </div>

        <div className="bg-[#F2E5FF] p-4 rounded-2xl border-2 border-b-4 border-[#CE82FF]">
          <div className="text-[10px] uppercase font-black tracking-wider text-[#A559D9]">3. Clave Pública (e, n)</div>
          <div className="text-xl font-black text-[#A559D9] font-mono mt-1">({e}, {rsa.n})</div>
          <div className="text-[11px] text-[#777777] font-bold mt-1">Conocida por todo el mundo</div>
        </div>

        <div className="bg-[#FFF0F0] p-4 rounded-2xl border-2 border-b-4 border-[#FF4B4B]">
          <div className="text-[10px] uppercase font-black tracking-wider text-[#EA2B2B]">4. Clave Privada (d, n)</div>
          <div className="text-xl font-black text-[#EA2B2B] font-mono mt-1">({rsa.d}, {rsa.n})</div>
          <div className="text-[11px] text-[#777777] font-mono font-bold mt-1">e&times;d &equiv; 1 (mod &phi;)</div>
        </div>
      </div>

      {/* Interactive Encryption & Decryption Pipeline */}
      <div className="bg-[#F7F7F7] p-6 rounded-3xl border-2 border-[#E5E5E5] space-y-4">
        <div className="text-xs font-black text-[#4B4B4B] uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#58CC02]" />
          <span>Prueba de Cifrado y Descifrado en Tiempo Real</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Plaintext */}
          <div className="bg-white p-4 rounded-2xl border-2 border-b-4 border-[#E5E5E5] space-y-2">
            <label htmlFor="rsa-message-input" className="flex items-center justify-between text-xs font-black text-[#4B4B4B] uppercase tracking-wider">
              <span className="flex items-center gap-1.5"><Unlock className="w-3.5 h-3.5 text-[#1CB0F6]" /> Mensaje Claro (M)</span>
              <span className="text-[10px] text-[#AFAFAF] font-mono font-bold">M &lt; n</span>
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
              className="w-full px-3 py-2 bg-[#F7F7F7] border-2 border-[#E5E5E5] rounded-xl text-[#4B4B4B] font-mono text-xl font-black focus:outline-none focus:border-[#1CB0F6] transition"
            />
            <div className="text-[11px] text-[#777777] font-bold">
              Fórmula: <code className="text-[#1CB0F6]">C = M^e mod n</code>
            </div>
          </div>

          {/* Ciphertext */}
          <div className="bg-[#F2E5FF] p-4 rounded-2xl border-2 border-b-4 border-[#CE82FF] space-y-2 text-center">
            <div className="text-xs font-black text-[#A559D9] uppercase tracking-wider flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Texto Cifrado (C)
            </div>
            <div className="text-3xl font-black text-[#A559D9] font-mono">
              {rsa.ciphertext !== null ? rsa.ciphertext : '---'}
            </div>
            <div className="text-[11px] font-mono font-bold text-[#A559D9]">
              {message}<sup>{e}</sup> mod {rsa.n} = {rsa.ciphertext}
            </div>
          </div>

          {/* Decrypted */}
          <div className="bg-[#D7FFB8] p-4 rounded-2xl border-2 border-b-4 border-[#58CC02] space-y-2 text-center">
            <div className="text-xs font-black text-[#58A700] uppercase tracking-wider flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Descifrado (M')
            </div>
            <div className="text-3xl font-black text-[#58A700] font-mono">
              {rsa.decryptedMessage !== null ? rsa.decryptedMessage : '---'}
            </div>
            <div className="text-[11px] font-mono font-bold text-[#58A700]">
              C<sup>d</sup> mod n = <span className="underline font-black">{rsa.decryptedMessage}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Exam Pitfall alert */}
      <div className="bg-[#F2E5FF] border-2 border-b-4 border-[#CE82FF] p-5 rounded-3xl flex items-start gap-3.5 text-xs text-[#A559D9] font-bold">
        <Sparkles className="w-5 h-5 text-[#CE82FF] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-black text-[#A559D9] uppercase tracking-wide block mb-1">
            Regla Clave del Examen de SSTT (RSA):
          </span>
          Para calcular potencias grandes como 8³ mod 55 a mano en el examen, nunca eleves al número completo.
          Aplica siempre la propiedad modular: <code className="bg-white/80 px-1 py-0.5 rounded text-[#A559D9] font-black">8³ = 8² &times; 8 = 64 &times; 8 &equiv; 9 &times; 8 = 72 &equiv; 17 (mod 55)</code>.
          ¡El tribunal busca que demuestres simplificaciones intermedias paso a paso!
        </div>
      </div>
    </div>
  );
};
