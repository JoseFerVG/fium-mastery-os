import React, { useState } from 'react';
import { Database, Sparkles } from 'lucide-react';

export const CacheCalculator: React.FC = () => {
  const [addressBits, setAddressBits] = useState<number>(32);
  const [cacheSizeKB, setCacheSizeKB] = useState<number>(32); // 32 KB
  const [blockSizeB, setBlockSizeB] = useState<number>(64); // 64 Bytes
  const [ways, setWays] = useState<number>(4); // 4-way set associative
  const [hexAddress, setHexAddress] = useState<string>('0x0040A56C');

  // Math derivations
  const offsetBits = Math.log2(blockSizeB);
  const totalBlocks = (cacheSizeKB * 1024) / blockSizeB;
  const numSets = ways === 0 ? 1 : totalBlocks / ways; // ways === 0 means fully associative
  const indexBits = ways === 0 ? 0 : Math.log2(numSets);
  const tagBits = addressBits - indexBits - offsetBits;

  // Total hardware bits calculation
  const bitsPerLineTag = tagBits;
  const bitsPerLineControl = 2; // 1 valid bit + 1 dirty bit
  const totalOverheadBits = totalBlocks * (bitsPerLineTag + bitsPerLineControl);
  const totalDataBits = cacheSizeKB * 1024 * 8;
  const totalHardwareKB = ((totalDataBits + totalOverheadBits) / 8 / 1024).toFixed(2);

  // Address parsing
  const cleanHex = hexAddress.trim().replace(/^0x/i, '');
  const parsedInt = parseInt(cleanHex || '0', 16);
  const binaryString = isNaN(parsedInt) 
    ? '0'.repeat(addressBits) 
    : parsedInt.toString(2).padStart(addressBits, '0').slice(-addressBits);

  const tagBinary = binaryString.slice(0, tagBits);
  const indexBinary = binaryString.slice(tagBits, tagBits + indexBits);
  const offsetBinary = binaryString.slice(tagBits + indexBits);

  const parsedTagHex = '0x' + parseInt(tagBinary || '0', 2).toString(16).toUpperCase();
  const parsedIndexDec = parseInt(indexBinary || '0', 2);
  const parsedOffsetDec = parseInt(offsetBinary || '0', 2);

  return (
    <div className="duo-card p-6 sm:p-8 bg-white border-2 border-b-[6px] border-[#E5E5E5] text-[#4B4B4B] font-sans">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-[#E5E5E5]">
        <span className="p-2.5 bg-[#E5F6FD] text-[#1CB0F6] rounded-2xl border-2 border-[#84D8FF]">
          <Database className="w-5 h-5 stroke-[2.5]" />
        </span>
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-[#4B4B4B]">Calculadora de Cachés & Tag-Index-Offset</h3>
          <p className="text-xs text-[#777777] font-bold mt-0.5">Desglosa direcciones en Tag, Index y Offset al instante con fórmulas oficiales de examen.</p>
        </div>
      </div>

      {/* Control Inputs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label htmlFor="cache-address-bits" className="text-xs font-black text-[#777777] uppercase tracking-wider block mb-1.5">Bits de Dirección</label>
          <select 
            id="cache-address-bits"
            name="addressBits"
            aria-label="Bits de dirección de memoria"
            value={addressBits} 
            onChange={e => setAddressBits(Number(e.target.value))}
            className="w-full bg-white border-2 border-b-4 border-[#E5E5E5] rounded-2xl px-3.5 py-2.5 text-xs font-black text-[#4B4B4B] focus:border-[#1CB0F6] outline-none transition"
          >
            <option value={32}>32 bits (Estándar UMU)</option>
            <option value={64}>64 bits (x86_64 moderno)</option>
          </select>
        </div>

        <div>
          <label htmlFor="cache-size-kb" className="text-xs font-black text-[#777777] uppercase tracking-wider block mb-1.5">Capacidad de Datos</label>
          <select 
            id="cache-size-kb"
            name="cacheSizeKB"
            aria-label="Capacidad de datos de la caché en KB"
            value={cacheSizeKB} 
            onChange={e => setCacheSizeKB(Number(e.target.value))}
            className="w-full bg-white border-2 border-b-4 border-[#E5E5E5] rounded-2xl px-3.5 py-2.5 text-xs font-black text-[#4B4B4B] focus:border-[#1CB0F6] outline-none transition"
          >
            <option value={8}>8 KB</option>
            <option value={16}>16 KB</option>
            <option value={32}>32 KB</option>
            <option value={64}>64 KB</option>
            <option value={128}>128 KB</option>
          </select>
        </div>

        <div>
          <label htmlFor="cache-block-size" className="text-xs font-black text-[#777777] uppercase tracking-wider block mb-1.5">Tamaño de Bloque</label>
          <select 
            id="cache-block-size"
            name="blockSizeB"
            aria-label="Tamaño de bloque en bytes"
            value={blockSizeB} 
            onChange={e => setBlockSizeB(Number(e.target.value))}
            className="w-full bg-white border-2 border-b-4 border-[#E5E5E5] rounded-2xl px-3.5 py-2.5 text-xs font-black text-[#4B4B4B] focus:border-[#1CB0F6] outline-none transition"
          >
            <option value={16}>16 Bytes</option>
            <option value={32}>32 Bytes</option>
            <option value={64}>64 Bytes (Estándar)</option>
            <option value={128}>128 Bytes</option>
          </select>
        </div>

        <div>
          <label htmlFor="cache-ways" className="text-xs font-black text-[#777777] uppercase tracking-wider block mb-1.5">Asociatividad</label>
          <select 
            id="cache-ways"
            name="ways"
            aria-label="Grado de asociatividad de la caché"
            value={ways} 
            onChange={e => setWays(Number(e.target.value))}
            className="w-full bg-white border-2 border-b-4 border-[#E5E5E5] rounded-2xl px-3.5 py-2.5 text-xs font-black text-[#4B4B4B] focus:border-[#1CB0F6] outline-none transition"
          >
            <option value={1}>Mapeo Directo (1 vía)</option>
            <option value={2}>Asociativa de 2 vías</option>
            <option value={4}>Asociativa de 4 vías</option>
            <option value={8}>Asociativa de 8 vías</option>
            <option value={0}>Totalmente Asociativa</option>
          </select>
        </div>
      </div>

      {/* Hex Address Input */}
      <div className="bg-[#F7F7F7] p-4 rounded-2xl border-2 border-[#E5E5E5] mb-6">
        <label htmlFor="cache-hex-address-input" className="text-xs font-black text-[#777777] block mb-1.5 flex items-center justify-between">
          <span>Probar una Dirección de Memoria (Hexadecimal):</span>
          <span className="text-xs text-[#1CB0F6] font-mono font-bold">Ej: 0x0040A56C</span>
        </label>
        <div className="flex gap-2">
          <input
            id="cache-hex-address-input"
            name="hexAddress"
            aria-label="Dirección de memoria en hexadecimal"
            autoComplete="off"
            type="text"
            value={hexAddress}
            onChange={e => setHexAddress(e.target.value)}
            className="flex-1 bg-white border-2 border-b-4 border-[#E5E5E5] rounded-xl px-4 py-2.5 font-mono text-sm text-[#4B4B4B] font-black focus:border-[#1CB0F6] outline-none transition"
            placeholder="0x0040A56C"
          />
        </div>
      </div>

      {/* Bit Split Visualizer Bar */}
      <div className="mb-6">
        <div className="text-xs font-black text-[#777777] uppercase tracking-wider mb-2">Desglose Visual de los {addressBits} bits:</div>
        <div className="flex h-14 rounded-2xl overflow-hidden font-mono text-xs font-black text-center border-2 border-[#E5E5E5]">
          <div 
            style={{ width: `${(tagBits / addressBits) * 100}%` }}
            className="bg-[#CE82FF] text-white flex flex-col justify-center border-r-2 border-white"
          >
            <span>ETIQUETA (TAG)</span>
            <span className="text-[10px] opacity-90">{tagBits} bits</span>
          </div>

          {indexBits > 0 && (
            <div 
              style={{ width: `${(indexBits / addressBits) * 100}%` }}
              className="bg-[#FF9600] text-white flex flex-col justify-center border-r-2 border-white"
            >
              <span>ÍNDICE</span>
              <span className="text-[10px] opacity-90">{indexBits} bits</span>
            </div>
          )}

          <div 
            style={{ width: `${(offsetBits / addressBits) * 100}%` }}
            className="bg-[#58CC02] text-white flex flex-col justify-center"
          >
            <span>OFFSET</span>
            <span className="text-[10px] opacity-90">{offsetBits} bits</span>
          </div>
        </div>
      </div>

      {/* Numerical Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="duo-card p-4 border-2 border-b-4 border-[#CE82FF]/40 bg-[#F5EAFF]">
          <div className="text-xs text-[#A559D9] font-black uppercase tracking-wider">Etiqueta (Tag)</div>
          <div className="text-2xl font-black text-[#A559D9] font-mono mt-1">{tagBits} bits</div>
          <div className="text-xs text-[#4B4B4B] mt-2 font-mono break-all font-bold">
            Valor Hex: <strong className="text-[#A559D9]">{parsedTagHex}</strong>
          </div>
          <div className="text-[11px] text-[#777777] mt-1 font-mono">Binario: {tagBinary}</div>
        </div>

        <div className="duo-card p-4 border-2 border-b-4 border-[#FFC800]/40 bg-[#FFF4D0]">
          <div className="text-xs text-[#E08500] font-black uppercase tracking-wider">Índice (Index)</div>
          <div className="text-2xl font-black text-[#E08500] font-mono mt-1">{indexBits} bits</div>
          <div className="text-xs text-[#4B4B4B] mt-2 font-mono font-bold">
            Conjunto #: <strong className="text-[#E08500]">{parsedIndexDec}</strong> (de {numSets})
          </div>
          <div className="text-[11px] text-[#777777] mt-1 font-mono">Binario: {indexBinary || 'N/A (Totalmente asoc.)'}</div>
        </div>

        <div className="duo-card p-4 border-2 border-b-4 border-[#58CC02]/40 bg-[#D7FFB8]">
          <div className="text-xs text-[#58A700] font-black uppercase tracking-wider">Offset (Byte)</div>
          <div className="text-2xl font-black text-[#58A700] font-mono mt-1">{offsetBits} bits</div>
          <div className="text-xs text-[#4B4B4B] mt-2 font-mono font-bold">
            Byte dentro del bloque: <strong className="text-[#58A700]">{parsedOffsetDec}</strong>
          </div>
          <div className="text-[11px] text-[#777777] mt-1 font-mono">Binario: {offsetBinary}</div>
        </div>
      </div>

      {/* Formula & Derivations Summary */}
      <div className="p-4 rounded-2xl bg-[#E5F6FD] border-2 border-[#84D8FF] text-xs text-[#1899D6] font-bold space-y-2">
        <div className="font-black text-[#1CB0F6] flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" />
          <span>Fórmulas analíticas del examen:</span>
        </div>
        <ul className="list-disc pl-5 space-y-1 text-[#1899D6]">
          <li><strong>Offset:</strong> log₂({blockSizeB}) = {offsetBits} bits.</li>
          <li><strong>Bloques totales:</strong> ({cacheSizeKB} × 1024) / {blockSizeB} = {totalBlocks} bloques.</li>
          {ways > 0 ? (
            <li><strong>Conjuntos:</strong> {totalBlocks} / {ways} = {numSets} conjuntos → log₂({numSets}) = {indexBits} bits de índice.</li>
          ) : (
            <li><strong>Totalmente Asociativa:</strong> No hay índice (0 bits). El Tag son todos los bits restantes.</li>
          )}
          <li><strong>Etiqueta (Tag):</strong> {addressBits} - {indexBits} - {offsetBits} = {tagBits} bits.</li>
          <li><strong>Memoria física del chip:</strong> {cacheSizeKB} KB de datos + {(totalOverheadBits / 8 / 1024).toFixed(2)} KB de etiquetas/control = <strong>{totalHardwareKB} KB totales</strong>.</li>
        </ul>
      </div>
    </div>
  );
};
