import React, { useState, useMemo } from 'react';
import { Network, RotateCcw, Copy, Check, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface SubnetPreset {
  name: string;
  ip: string;
  cidr: number;
  description: string;
}

const PRESETS: SubnetPreset[] = [
  {
    name: 'Examen AR - Sede Central (100 hosts)',
    ip: '192.168.10.0',
    cidr: 25,
    description: 'Requiere 100 hosts: 2^7 - 2 = 126 hosts útiles. Máscara /25 (255.255.255.128).'
  },
  {
    name: 'Examen AR - Sede Remota (50 hosts)',
    ip: '192.168.10.128',
    cidr: 26,
    description: 'Requiere 50 hosts: 2^6 - 2 = 62 hosts útiles. Máscara /26 (255.255.255.192).'
  },
  {
    name: 'Examen AR - Enlace Punto a Punto (2 routers)',
    ip: '10.0.0.0',
    cidr: 30,
    description: 'Solo 2 direcciones IP útiles para las interfaces de los routers. Máscara /30 (255.255.255.252).'
  },
  {
    name: 'Red de Campus Clase B (/21)',
    ip: '172.16.16.0',
    cidr: 21,
    description: 'Agrupación CIDR de 8 bloques /24. Total 2046 hosts útiles.'
  }
];

export const SubnetCalculator: React.FC = () => {
  const [ipStr, setIpStr] = useState('192.168.10.0');
  const [cidr, setCidr] = useState<number>(25);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const ipToInt = (ip: string): number => {
    const parts = ip.trim().split('.').map(Number);
    if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) return 0;
    return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
  };

  const intToIp = (num: number): string => {
    return [
      (num >>> 24) & 255,
      (num >>> 16) & 255,
      (num >>> 8) & 255,
      num & 255
    ].join('.');
  };

  const toBinaryStr = (num: number): string => {
    return (num >>> 0).toString(2).padStart(32, '0').match(/.{8}/g)!.join('.');
  };

  // Calculations
  const results = useMemo(() => {
    const ipNum = ipToInt(ipStr);
    const hostBits = 32 - cidr;
    const maskNum = cidr === 0 ? 0 : (~0 << hostBits) >>> 0;
    const wildcardNum = (~maskNum) >>> 0;

    const netNum = (ipNum & maskNum) >>> 0;
    const bcastNum = (netNum | wildcardNum) >>> 0;

    const firstHostNum = hostBits > 1 ? (netNum + 1) >>> 0 : netNum;
    const lastHostNum = hostBits > 1 ? (bcastNum - 1) >>> 0 : bcastNum;

    const totalHosts = Math.pow(2, hostBits);
    const usableHosts = hostBits > 1 ? Math.max(0, totalHosts - 2) : (hostBits === 1 ? 2 : 1);

    return {
      networkAddress: intToIp(netNum),
      broadcastAddress: intToIp(bcastNum),
      firstUsableHost: intToIp(firstHostNum),
      lastUsableHost: intToIp(lastHostNum),
      netmask: intToIp(maskNum),
      wildcard: intToIp(wildcardNum),
      totalHosts,
      usableHosts,
      binaryIp: toBinaryStr(ipNum),
      binaryMask: toBinaryStr(maskNum),
      binaryNet: toBinaryStr(netNum),
      hostBits,
      networkBits: cidr
    };
  }, [ipStr, cidr]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    soundManager.playClick();
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSelectPreset = (p: SubnetPreset) => {
    setIpStr(p.ip);
    setCidr(p.cidr);
    soundManager.playCorrect();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-sky-500/10 text-sky-400 rounded-2xl border border-sky-500/20">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">Calculadora Visual de Subredes & VLSM (IPv4)</h3>
            <p className="text-xs text-slate-400">Dominio de direccionamiento CIDR, máscaras de longitud variable y rangos útiles para Arquitectura de Redes</p>
          </div>
        </div>
      </div>

      {/* Presets from actual FIUM exams */}
      <div>
        <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Casos Reales de Examen FIUM (Boletín 3 AR):</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(p)}
              className="p-3 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 rounded-2xl text-left transition group"
            >
              <div className="text-xs font-bold text-sky-300 group-hover:text-white transition">{p.name}</div>
              <div className="text-[11px] font-mono text-slate-400 mt-0.5">{p.ip}/{p.cidr}</div>
              <div className="text-[10px] text-slate-500 mt-1 line-clamp-2">{p.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Inputs Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950 p-5 rounded-2xl border border-slate-800 items-end">
        <div>
          <label htmlFor="subnet-ip-input" className="block text-xs font-bold text-slate-300 mb-1">Dirección IP Base:</label>
          <input
            id="subnet-ip-input"
            name="ipAddress"
            aria-label="Dirección IP base"
            type="text"
            value={ipStr}
            onChange={e => setIpStr(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-sky-500"
            placeholder="192.168.1.0"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
            <label htmlFor="subnet-cidr-range">Máscara de Red (CIDR):</label>
            <span className="text-sky-400 font-mono">/{cidr} ({results.netmask})</span>
          </div>
          <input
            id="subnet-cidr-range"
            name="cidrMask"
            aria-label="Máscara de red en formato CIDR"
            type="range"
            min={1}
            max={32}
            value={cidr}
            onChange={e => setCidr(Number(e.target.value))}
            className="w-full accent-sky-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>/1</span>
            <span>/16</span>
            <span>/24</span>
            <span>/30</span>
            <span>/32</span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Hosts Útiles:</div>
            <div className="text-2xl font-black text-sky-400 font-mono">
              {results.usableHosts.toLocaleString()}
            </div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-[10px] uppercase font-bold text-slate-500">Bits Red / Host</div>
            <div className="text-xs font-mono font-bold text-slate-300">
              {results.networkBits} / {results.hostBits}
            </div>
          </div>
        </div>
      </div>

      {/* Core Results Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Dirección de Red', val: results.networkAddress, desc: 'Identificador del segmento (no asignable a host)' },
          { label: 'Primer Host Útil', val: results.firstUsableHost, desc: 'Típicamente asignada a gateway o router' },
          { label: 'Último Host Útil', val: results.lastUsableHost, desc: 'Última IP asignable a terminal o servidor' },
          { label: 'Dirección de Broadcast', val: results.broadcastAddress, desc: 'Difusión a todos los equipos de la subred' }
        ].map((item, idx) => (
          <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 relative group">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{item.label}</div>
            <div className="text-lg font-black text-white font-mono mt-1 flex items-center justify-between">
              <span>{item.val}</span>
              <button
                onClick={() => copyToClipboard(item.val, item.label)}
                className="opacity-0 group-hover:opacity-100 transition p-1 text-slate-500 hover:text-white"
                title="Copiar"
              >
                {copiedField === item.label ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">{item.desc}</div>
          </div>
        ))}
      </div>

      {/* Binary Breakdown Visualization */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <span>Desglose Binario de Bits (32 bits)</span>
          <span className="text-[10px] font-normal text-slate-500 font-sans">
            (Azul = Bits de Red, Gris = Bits de Host)
          </span>
        </div>

        {/* IP Binary */}
        <div className="font-mono text-xs space-y-1">
          <div className="text-[11px] text-slate-400 font-semibold">IP: {ipStr}</div>
          <div className="p-3 bg-slate-900 rounded-xl overflow-x-auto whitespace-nowrap tracking-widest text-sm">
            {results.binaryIp.split('').map((char, i) => {
              if (char === '.') return <span key={i} className="text-slate-600 px-1">.</span>;
              // determine bit index excluding dots
              const bitIdx = Math.floor(i - Math.floor(i / 9));
              const isNet = bitIdx < cidr;
              return (
                <span
                  key={i}
                  className={`font-black ${isNet ? 'text-sky-400 bg-sky-500/10 px-0.5 rounded' : 'text-slate-500'}`}
                >
                  {char}
                </span>
              );
            })}
          </div>
        </div>

        {/* Mask Binary */}
        <div className="font-mono text-xs space-y-1">
          <div className="text-[11px] text-slate-400 font-semibold">Máscara: {results.netmask}</div>
          <div className="p-3 bg-slate-900 rounded-xl overflow-x-auto whitespace-nowrap tracking-widest text-sm">
            {results.binaryMask.split('').map((char, i) => {
              if (char === '.') return <span key={i} className="text-slate-600 px-1">.</span>;
              const bitIdx = Math.floor(i - Math.floor(i / 9));
              const isNet = bitIdx < cidr;
              return (
                <span
                  key={i}
                  className={`font-black ${isNet ? 'text-emerald-400' : 'text-slate-600'}`}
                >
                  {char}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Exam Pitfall alert */}
      <div className="bg-sky-950/20 border border-sky-900/40 p-4 rounded-2xl flex items-start gap-3 text-xs text-sky-200/90">
        <AlertCircle className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-sky-300">Trampa Clásica de Examen de AR (VLSM):</span>
          {' '}En ejercicios donde se pide diseñar el direccionamiento de varias sedes, SIEMPRE debes ordenar los bloques de subred
          de MAYOR requerimiento de hosts a MENOR requerimiento. Si intentas asignar subredes pequeñas al principio, fragmentarás el espacio de direcciones y será matemáticamente imposible asignar los bloques grandes sin solapamiento.
        </div>
      </div>
    </div>
  );
};
