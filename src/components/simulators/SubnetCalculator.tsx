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
    <div className="bg-white border-2 border-b-[6px] border-[#E5E5E5] rounded-3xl p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#E5E5E5] pb-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#DDF4FF] border-2 border-b-4 border-[#84D8FF] flex items-center justify-center text-[#1CB0F6] shrink-0">
            <Network className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase bg-[#E5F6FD] text-[#1CB0F6] border border-[#84D8FF]">
                AR / REDES
              </span>
              <span className="text-xs font-bold text-[#AFAFAF] uppercase">Calculadora IPv4</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#4B4B4B] uppercase tracking-tight mt-0.5">
              Calculadora Visual de Subredes & VLSM
            </h3>
            <p className="text-xs text-[#777777] font-semibold">
              Direccionamiento CIDR, máscaras de longitud variable y rangos útiles para Arquitectura de Redes
            </p>
          </div>
        </div>
      </div>

      {/* Presets from actual FIUM exams */}
      <div>
        <div className="text-xs font-black text-[#AFAFAF] mb-3 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#FFC800]" />
          Casos Reales de Examen FIUM (Boletín 3 AR):
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(p)}
              className="p-3.5 bg-white hover:bg-[#F7F7F7] active:translate-y-1 border-2 border-b-4 border-[#E5E5E5] hover:border-[#1CB0F6] rounded-2xl text-left transition group cursor-pointer"
            >
              <div className="text-xs font-black text-[#4B4B4B] group-hover:text-[#1CB0F6] transition">{p.name}</div>
              <div className="text-xs font-mono font-bold text-[#1CB0F6] mt-0.5">{p.ip}/{p.cidr}</div>
              <div className="text-[11px] text-[#777777] font-medium mt-1 line-clamp-2">{p.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Inputs Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#F7F7F7] p-5 rounded-3xl border-2 border-[#E5E5E5] items-end">
        <div>
          <label htmlFor="subnet-ip-input" className="block text-xs font-black text-[#4B4B4B] uppercase tracking-wider mb-1.5">
            Dirección IP Base:
          </label>
          <input
            id="subnet-ip-input"
            name="ipAddress"
            aria-label="Dirección IP base"
            type="text"
            value={ipStr}
            onChange={e => setIpStr(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border-2 border-b-4 border-[#E5E5E5] rounded-2xl text-[#4B4B4B] font-mono text-sm font-bold focus:outline-none focus:border-[#1CB0F6] transition"
            placeholder="192.168.1.0"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-black text-[#4B4B4B] uppercase tracking-wider mb-1.5">
            <label htmlFor="subnet-cidr-range">Máscara (CIDR):</label>
            <span className="text-[#1CB0F6] font-mono font-black">/{cidr} ({results.netmask})</span>
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
            className="w-full accent-[#1CB0F6] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-[#AFAFAF] font-mono font-bold mt-1">
            <span>/1</span>
            <span>/16</span>
            <span>/24</span>
            <span>/30</span>
            <span>/32</span>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border-2 border-b-4 border-[#E5E5E5]">
          <div>
            <div className="text-[10px] uppercase font-black text-[#AFAFAF] tracking-wider">Hosts Útiles:</div>
            <div className="text-2xl font-black text-[#58CC02] font-mono">
              {results.usableHosts.toLocaleString()}
            </div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-[10px] uppercase font-black text-[#AFAFAF] tracking-wider">Bits Red / Host</div>
            <div className="text-sm font-mono font-black text-[#4B4B4B]">
              {results.networkBits} / {results.hostBits}
            </div>
          </div>
        </div>
      </div>

      {/* Core Results Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Dirección de Red', val: results.networkAddress, desc: 'Identificador del segmento (no asignable)' },
          { label: 'Primer Host Útil', val: results.firstUsableHost, desc: 'Típicamente asignada a gateway / router' },
          { label: 'Último Host Útil', val: results.lastUsableHost, desc: 'Última IP asignable a terminal o host' },
          { label: 'Dirección de Broadcast', val: results.broadcastAddress, desc: 'Difusión a todos los equipos' }
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded-2xl border-2 border-b-4 border-[#E5E5E5] relative group">
            <div className="text-[10px] font-black uppercase tracking-wider text-[#AFAFAF]">{item.label}</div>
            <div className="text-lg font-black text-[#4B4B4B] font-mono mt-1 flex items-center justify-between">
              <span>{item.val}</span>
              <button
                onClick={() => copyToClipboard(item.val, item.label)}
                className="opacity-70 group-hover:opacity-100 transition p-1 text-[#777777] hover:text-[#1CB0F6] cursor-pointer"
                title="Copiar"
              >
                {copiedField === item.label ? <Check className="w-4 h-4 text-[#58CC02]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="text-[11px] text-[#777777] font-semibold mt-1">{item.desc}</div>
          </div>
        ))}
      </div>

      {/* Binary Breakdown Visualization */}
      <div className="bg-[#F7F7F7] p-5 rounded-3xl border-2 border-[#E5E5E5] space-y-4">
        <div className="text-xs font-black text-[#4B4B4B] uppercase tracking-wider flex items-center gap-2">
          <span>Desglose Binario de Bits (32 bits)</span>
          <span className="text-[11px] font-bold text-[#777777] font-sans">
            (Azul = Bits de Red, Gris = Bits de Host)
          </span>
        </div>

        {/* IP Binary */}
        <div className="font-mono text-xs space-y-1.5">
          <div className="text-xs text-[#4B4B4B] font-bold">IP: {ipStr}</div>
          <div className="p-3 bg-white border-2 border-[#E5E5E5] rounded-2xl overflow-x-auto whitespace-nowrap tracking-widest text-sm font-bold">
            {results.binaryIp.split('').map((char, i) => {
              if (char === '.') return <span key={i} className="text-[#AFAFAF] px-1 font-black">.</span>;
              const bitIdx = Math.floor(i - Math.floor(i / 9));
              const isNet = bitIdx < cidr;
              return (
                <span
                  key={i}
                  className={`font-black ${isNet ? 'text-[#1CB0F6] bg-[#DDF4FF] px-0.5 rounded' : 'text-[#AFAFAF]'}`}
                >
                  {char}
                </span>
              );
            })}
          </div>
        </div>

        {/* Mask Binary */}
        <div className="font-mono text-xs space-y-1.5">
          <div className="text-xs text-[#4B4B4B] font-bold">Máscara: {results.netmask}</div>
          <div className="p-3 bg-white border-2 border-[#E5E5E5] rounded-2xl overflow-x-auto whitespace-nowrap tracking-widest text-sm font-bold">
            {results.binaryMask.split('').map((char, i) => {
              if (char === '.') return <span key={i} className="text-[#AFAFAF] px-1 font-black">.</span>;
              const bitIdx = Math.floor(i - Math.floor(i / 9));
              const isNet = bitIdx < cidr;
              return (
                <span
                  key={i}
                  className={`font-black ${isNet ? 'text-[#58CC02] bg-[#D7FFB8] px-0.5 rounded' : 'text-[#CECECE]'}`}
                >
                  {char}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Exam Pitfall alert */}
      <div className="bg-[#E5F6FD] border-2 border-b-4 border-[#84D8FF] p-5 rounded-3xl flex items-start gap-3.5 text-xs text-[#1899D6] font-bold">
        <AlertCircle className="w-5 h-5 text-[#1CB0F6] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-black text-[#1CB0F6] uppercase tracking-wide block mb-1">
            Trampa Clásica de Examen de AR (VLSM):
          </span>
          En ejercicios donde se pide diseñar el direccionamiento de varias sedes, SIEMPRE debes ordenar los bloques de subred
          de MAYOR requerimiento de hosts a MENOR requerimiento. Si intentas asignar subredes pequeñas al principio, fragmentarás el espacio de direcciones y será matemáticamente imposible asignar los bloques grandes sin solapamiento.
        </div>
      </div>
    </div>
  );
};
