import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  RotateCw, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Sparkles,
  Zap,
  Layers
} from 'lucide-react';
import { SubjectId } from '../../types';
import { soundManager } from '../../utils/soundEffects';

interface FlashcardData {
  id: string;
  subjectId: SubjectId;
  subjectName: string;
  category: string;
  front: string;
  back: {
    answer: string;
    rule: string;
    trap: string;
  };
}

const FLASHCARDS: FlashcardData[] = [
  {
    id: 'fc-aoc-1',
    subjectId: 'aoc',
    subjectName: 'AOC',
    category: 'Pipeline & Hazards',
    front: '¿Puede una unidad de Forwarding (adelantamiento) eliminar la parada (stall) provocada por una instrucción LW seguida inmediatamente de un ADD que usa el mismo registro?',
    back: {
      answer: 'NO. Es IMPOSIBLE eliminar esa parada.',
      rule: 'El dato de LW se obtiene de memoria al FINAL de la etapa MEM (ciclo 4). Sin embargo, ADD necesita los operandos al PRINCIPIO de su etapa EX (ciclo 4). Como no se puede viajar atrás en el tiempo, se produce obligatoriamente 1 ciclo de parada (Load-Use Bubble).',
      trap: 'En el examen muchos asumen que "con reenvío completo no hay paradas nunca". Esta parada es física e inevitable.'
    }
  },
  {
    id: 'fc-aoc-2',
    subjectId: 'aoc',
    subjectName: 'AOC',
    category: 'Jerarquía & AMAT',
    front: '¿Cuál es la fórmula del Tiempo Medio de Acceso a Memoria (AMAT) para una jerarquía de cachés de 2 niveles (L1 y L2)?',
    back: {
      answer: 'AMAT = t_L1 + m_L1 × (t_L2 + m_L2_local × Pen_RAM)',
      rule: 't_L1 = tiempo acierto L1; m_L1 = tasa fallos L1; t_L2 = tiempo acierto L2; m_L2_local = tasa fallos local de L2.',
      trap: 'Cuidado con la tasa de fallos de L2: si el enunciado te da la tasa GLOBAL (m_L2_global), la fórmula es AMAT = t_L1 + m_L1 × t_L2 + m_L2_global × Pen_RAM. ¡No multipliques dos veces por m_L1!'
    }
  },
  {
    id: 'fc-aso-1',
    subjectId: 'aso',
    subjectName: 'ASO',
    category: 'Señales & Tuberías POSIX',
    front: 'En un programa UNIX con tuberías (pipes), ¿qué ocurre si un proceso intenta escribir con write() en una tubería cuando todos los descriptores de lectura han sido cerrados?',
    back: {
      answer: 'El kernel envía inmediatamente la señal SIGPIPE al proceso escritor.',
      rule: 'Por defecto, SIGPIPE mata al proceso escritor (terminación abrupta) a menos que haya instalado un manejador con sigaction() o la ignore con SIG_IGN (en cuyo caso write() devuelve -1 y errno = EPIPE).',
      trap: 'En los exámenes de ASO preguntan por qué el hijo no devuelve EXIT_SUCCESS: la razón suele ser que el lector murió o cerró antes y el hijo murió por SIGPIPE.'
    }
  },
  {
    id: 'fc-aso-2',
    subjectId: 'aso',
    subjectName: 'ASO',
    category: 'Sistemas de Ficheros UNIX',
    front: 'En un sistema de ficheros tipo Ext2 con bloques de 4 KiB y direcciones de 4 bytes, ¿cuántos bloques de datos puede referenciar un Bloque Doblemente Indirecto (BDI)?',
    back: {
      answer: '1.048.576 bloques de datos (4 GiB)',
      rule: 'Un bloque de 4096 bytes aloja 4096 / 4 = 1024 punteros. El BDI apunta a 1024 BSI, y cada BSI apunta a 1024 bloques de datos: 1024 × 1024 = 1.048.576 bloques. En bytes: 1.048.576 × 4096 = 4 GiB.',
      trap: 'Olvidar restar los 10 bloques directos y el BSI previo cuando te piden el byte exacto al que pertenece un offset.'
    }
  },
  {
    id: 'fc-alf-1',
    subjectId: 'alf',
    subjectName: 'ALF',
    category: 'Lema de Bombeo',
    front: 'Para demostrar que L = {aⁿ bⁿ | n ≥ 0} NO es regular usando el Lema de Bombeo, ¿qué condiciones debe cumplir la descomposición w = xyz?',
    back: {
      answer: '1) |y| > 0 (y no vacía). 2) |xy| ≤ n. 3) Para todo i ≥ 0, xyⁱz ∈ L.',
      rule: 'Como |xy| ≤ n y la cadena elegida es aⁿbⁿ, la subcadena repetida y solo contiene letras "a" (y = aᵏ con k ≥ 1). Al bombear i = 0 (xz) o i = 2 (xy²z), el número de "a" ya no coincide con el número de "b", contradiciendo la pertenencia a L.',
      trap: 'Elegir una cadena concreta sin el parámetro n (ej. w = a¹⁰b¹⁰). El lema de bombeo exige usar la constante de bombeo n como parámetro formal.'
    }
  },
  {
    id: 'fc-alf-2',
    subjectId: 'alf',
    subjectName: 'ALF',
    category: 'Gramáticas Libres de Contexto',
    front: '¿Cuándo se dice que una Gramática Libre de Contexto (GLC) es ambigua?',
    back: {
      answer: 'Cuando existe al menos una cadena del lenguaje que posee dos o más árboles de derivación sintáctica distintos.',
      rule: 'Equivalente a poseer dos derivaciones por la izquierda (leftmost) distintas, o dos por la derecha distintas.',
      trap: 'Confundir ambigüedad de la gramática con que el lenguaje sea inherentemente ambiguo. Muchas gramáticas ambiguas se pueden reescribir fijando precedencia y asociatividad (ej. en expresiones aritméticas suma/producto).'
    }
  },
  {
    id: 'fc-tds-1',
    subjectId: 'tds',
    subjectName: 'TDS',
    category: 'Patrones GRASP',
    front: 'Según el patrón GRASP "Experto en Información", ¿a qué clase se le debe asignar la responsabilidad de realizar un cálculo o acción?',
    back: {
      answer: 'A la clase que posee la mayor cantidad de información necesaria para cumplir dicha responsabilidad.',
      rule: 'Ejemplo: Calcular el total de una Venta. La clase Venta conoce todas sus LineasDeVenta y precios, por tanto getTotal() debe residir en Venta, no en la interfaz gráfica ni en un controlador.',
      trap: 'Diseñar "objetos anémicos" (solo getters/setters) y poner toda la lógica en servicios: viola directamente el patrón Experto y la Alta Cohesión.'
    }
  },
  {
    id: 'fc-tds-2',
    subjectId: 'tds',
    subjectName: 'TDS',
    category: 'Java Streams API',
    front: '¿Cuál es la diferencia entre una operación intermedia y una operación terminal en los Streams de Java?',
    back: {
      answer: 'Las operaciones intermedias son perezosas (lazy) y devuelven otro Stream; las terminales consumen el Stream y producen el resultado final.',
      rule: 'Intermedias: filter(), map(), flatMap(), distinct(), sorted(). Terminales: collect(), forEach(), reduce(), count(), anyMatch(). Sin operación terminal, las intermedias NUNCA se ejecutan.',
      trap: 'Intentar reutilizar un Stream después de haber invocado una operación terminal: lanzará un IllegalStateException: stream has already been operated upon or closed.'
    }
  },
  {
    id: 'fc-iso-1',
    subjectId: 'iso',
    subjectName: 'ISO',
    category: 'Permisos Linux',
    front: '¿Qué significa el permiso especial Sticky Bit (ej. chmod 1777 /tmp) aplicado sobre un directorio?',
    back: {
      answer: 'Solo el dueño de un fichero (o root) puede borrar o renombrar ese fichero dentro del directorio, aunque otros usuarios tengan permiso de escritura.',
      rule: 'En la notación simbólica se representa con una "t" o "T" al final de los permisos de otros (drwxrwxrwt).',
      trap: 'Confundir Sticky Bit con SetUID (4000) o SetGID (2000). SetUID ejecuta con los permisos del propietario del binario.'
    }
  },
  {
    id: 'fc-ac-1',
    subjectId: 'ac',
    subjectName: 'AC',
    category: 'Métricas de Evaluación',
    front: '¿Qué mide la métrica Sensibilidad (Recall / TPR) y en qué casos médicos o de seguridad es prioritaria sobre la Precisión?',
    back: {
      answer: 'Mide la fracción de positivos reales que fueron correctamente identificados: Recall = TP / (TP + FN).',
      rule: 'Es prioritaria cuando el coste de un Falso Negativo (dejar escapar a un enfermo grave o un fraude) es inaceptable, aunque implique tener más falsas alarmas (Falsos Positivos).',
      trap: 'Evaluar clasificadores con Accuracy cuando las clases están desbalanceadas (ej. 99% negativos). En esos casos la Accuracy es una métrica engañosa.'
    }
  },
  {
    id: 'fc-ar-1',
    subjectId: 'ar',
    subjectName: 'AR',
    category: 'TCP Congestion Control',
    front: '¿Qué hace TCP Reno cuando recibe 3 ACKs duplicados (Fast Retransmit)?',
    back: {
      answer: 'Reenvía inmediatamente el segmento perdido sin esperar al temporizador y entra en Fast Recovery (Recuperación Rápida).',
      rule: 'Ajusta ssthresh = cwnd / 2, reduce cwnd = ssthresh + 3, y por cada nuevo ACK duplicado incrementa cwnd en 1. Cuando llega un ACK nuevo, vuelve a Evitación de Congestión.',
      trap: 'Confundir con la pérdida por Timeout (expiración de temporizador): en timeout, TCP baja cwnd a 1 MSS e inicia Slow Start desde cero.'
    }
  },
  {
    id: 'fc-st-1',
    subjectId: 'st',
    subjectName: 'ST',
    category: 'Criptografía RSA',
    front: 'En el cifrado RSA, si p = 5 y q = 11, ¿cuál es el valor de la función de Euler z = φ(n) y qué condición debe cumplir el exponente público e?',
    back: {
      answer: 'φ(n) = (5-1) × (11-1) = 4 × 10 = 40. e debe ser coprimo con 40: mcd(e, 40) = 1.',
      rule: 'Por ejemplo, e = 3 es válido porque mcd(3, 40) = 1. La clave privada d satisface d × 3 ≡ 1 (mod 40), de donde d = 27.',
      trap: 'Calcular φ(n) como p × q = 55. ¡Eso es n! φ(n) es SIEMPRE (p-1)(q-1).'
    }
  },
  {
    id: 'fc-si-1',
    subjectId: 'si',
    subjectName: 'SI',
    category: 'Heurísticas A*',
    front: '¿Por qué la distancia Manhattan es una heurística admisible en un laberinto con movimientos solo horizontales y verticales?',
    back: {
      answer: 'Porque representa la distancia mínima teórica sin obstáculos: h(n) = |x1-x2| + |y1-y2| ≤ h*(n).',
      rule: 'Cualquier obstáculo o pared en el laberinto solo puede AUMENTAR el camino real, nunca acortarlo. Por ende h(n) nunca sobreestima el coste real.',
      trap: 'Usar distancia Manhattan cuando se permiten movimientos en diagonal: en ese caso Manhattan sobreestima el coste euclídeo o de Chebyshev y dejaría de ser admisible.'
    }
  }
];

interface FlashcardsModalProps {
  onClose: () => void;
  onAddXp: (amount: number) => void;
}

export const FlashcardsModal: React.FC<FlashcardsModalProps> = ({ onClose, onAddXp }) => {
  const [filterSubject, setFilterSubject] = useState<SubjectId | 'all'>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [reviewedCount, setReviewedCount] = useState<number>(0);

  const filteredCards = filterSubject === 'all'
    ? FLASHCARDS
    : FLASHCARDS.filter(c => c.subjectId === filterSubject);

  const currentCard = filteredCards[currentIndex] || filteredCards[0];

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
    soundManager.playTick();
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      setCurrentIndex(filteredCards.length - 1);
    }
    soundManager.playTick();
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    soundManager.playClick();
  };

  const handleRate = (rating: 'hard' | 'good' | 'easy') => {
    soundManager.playCorrect();
    setReviewedCount(prev => prev + 1);
    onAddXp(rating === 'easy' ? 20 : rating === 'good' ? 15 : 10);
    handleNext();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 450, damping: 30 }}
        className="bg-slate-900 border-t sm:border border-white/15 w-full max-w-2xl rounded-t-3xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl relative space-y-6 max-h-[92vh] sm:max-h-none overflow-y-auto"
      >
        {/* Mobile Drag Handle */}
        <div className="pt-1 pb-0 flex justify-center sm:hidden">
          <div className="w-12 h-1.5 rounded-full bg-slate-700/80" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Tarjetas de Memoria Activa (Anki FIUM)
                <span className="text-xs font-mono font-normal text-slate-400">
                  [{currentIndex + 1} / {filteredCards.length}]
                </span>
              </h3>
              <p className="text-xs text-slate-400">Repaso rápido de trampas de examen y fórmulas esenciales</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Cerrar modal de tarjetas"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subject Filter Pills (Smooth scrollable on mobile) */}
        <div className="flex flex-nowrap sm:flex-wrap overflow-x-auto max-w-full pb-1 sm:pb-0 gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          {(['all', 'aoc', 'aso', 'alf', 'tds', 'iso', 'ac', 'ar', 'st', 'si'] as const).map(sub => (
            <button
              key={sub}
              onClick={() => {
                setFilterSubject(sub);
                setCurrentIndex(0);
                setIsFlipped(false);
                soundManager.playClick();
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase shrink-0 transition ${
                filterSubject === sub
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Interactive 3D Flip Card */}
        <div
          onClick={handleFlip}
          className="cursor-pointer min-h-[280px] bg-slate-950/90 hover:border-indigo-500/60 border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-200 shadow-2xl relative group select-none active:scale-[0.99]"
        >
          {/* Card Top Banner */}
          <div className="flex items-center justify-between text-xs font-mono font-bold">
            <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 uppercase">
              {currentCard.subjectName} &bull; {currentCard.category}
            </span>
            <span className="text-slate-500 flex items-center gap-1 group-hover:text-indigo-400 transition text-[11px]">
              <RotateCw className="w-3.5 h-3.5" /> Haz clic para voltear
            </span>
          </div>

          {/* Card Body */}
          <div className="my-auto py-4">
            {!isFlipped ? (
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Pregunta / Escenario de Examen:</span>
                <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
                  {currentCard.front}
                </p>
              </div>
            ) : (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Respuesta Directa:</span>
                  <p className="text-sm sm:text-base font-bold text-emerald-200 mt-1">
                    {currentCard.back.answer}
                  </p>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono">
                  <strong className="text-indigo-300 font-sans">Regla Formal:</strong> {currentCard.back.rule}
                </div>

                <div className="bg-rose-950/20 p-3 rounded-xl border border-rose-900/40 text-xs text-rose-200/90 leading-relaxed">
                  <strong className="text-rose-400">Trampa del Profesor:</strong> {currentCard.back.trap}
                </div>
              </div>
            )}
          </div>

          {/* Card Footer prompt */}
          <div className="text-center text-[10px] text-slate-600 font-mono">
            {isFlipped ? '¿Qué tal te ha resultado?' : 'Piensa la respuesta antes de voltear'}
          </div>
        </div>

        {/* Rating & Navigation Controller */}
        {isFlipped ? (
          <div className="grid grid-cols-3 gap-3 animate-fadeIn">
            <button
              onClick={() => handleRate('hard')}
              className="py-3 px-4 rounded-xl bg-rose-600/20 border border-rose-500/40 text-rose-300 hover:bg-rose-600 hover:text-white font-bold text-xs transition flex flex-col items-center"
            >
              <span>Difícil (+10 XP)</span>
              <span className="text-[10px] opacity-75 font-normal">Repetir pronto</span>
            </button>
            <button
              onClick={() => handleRate('good')}
              className="py-3 px-4 rounded-xl bg-amber-600/20 border border-amber-500/40 text-amber-300 hover:bg-amber-600 hover:text-white font-bold text-xs transition flex flex-col items-center"
            >
              <span>Bien (+15 XP)</span>
              <span className="text-[10px] opacity-75 font-normal">Duda resuelta</span>
            </button>
            <button
              onClick={() => handleRate('easy')}
              className="py-3 px-4 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600 hover:text-white font-bold text-xs transition flex flex-col items-center"
            >
              <span>Fácil (+20 XP)</span>
              <span className="text-[10px] opacity-75 font-normal">Totalmente dominado</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1 transition"
            >
              <ChevronLeft className="w-4 h-4" /> Anterior
            </button>
            <button
              onClick={handleFlip}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/30 transition"
            >
              Mostrar Solución
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1 transition"
            >
              Siguiente <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
