import { ExamProblem } from '../types';

export const EXAM_PROBLEMS: ExamProblem[] = [
  {
    id: 'aoc-q1-amat',
    subjectId: 'aoc',
    courseYear: 'Examen Oficial AOC - Convocatoria Enero',
    title: 'Cálculo de Tiempo Medio de Acceso a Memoria (AMAT)',
    question: 'En un sistema con frecuencia de reloj de 2 GHz, la caché L1 tiene un tiempo de acierto de 1 ciclo y una tasa de fallos del 5%. Al fallar en L1, se accede a una caché L2 con tiempo de acierto de 8 ciclos y tasa de fallos local del 20%. Si falla también en L2, el acceso a la memoria principal requiere 100 ciclos adicionales. ¿Cuál es el AMAT en ciclos de reloj?',
    options: [
      {
        text: '1.40 ciclos',
        isCorrect: false,
        explanation: 'Error de cálculo: olvidaste propagar la tasa de fallos de L2 multiplicada por la penalización de memoria principal.'
      },
      {
        text: '2.40 ciclos',
        isCorrect: true,
        explanation: '¡Correcto! AMAT = t_L1 + m_L1 * (t_L2 + m_L2 * penalizacion_RAM) = 1 + 0.05 * (8 + 0.20 * 100) = 1 + 0.05 * (8 + 20) = 1 + 0.05 * 28 = 1 + 1.4 = 2.4 ciclos.'
      },
      {
        text: '6.40 ciclos',
        isCorrect: false,
        explanation: 'Error típico: sumaste la penalización de memoria principal sin multiplicarla por la tasa de fallo de L2.'
      },
      {
        text: '3.10 ciclos',
        isCorrect: false,
        explanation: 'Error al no distinguir la tasa de fallo local de L2 de la tasa de fallo global.'
      }
    ],
    detailedStepByStepSolution: `Paso 1: Identificar los parámetros dados:
• Tiempo de acierto en L1 (t_hit_L1) = 1 ciclo.
• Tasa de fallos en L1 (m_L1) = 5% = 0.05.
• Tiempo de acceso a L2 (t_hit_L2) = 8 ciclos.
• Tasa de fallos local en L2 (m_L2) = 20% = 0.20.
• Penalización por acceder a Memoria Principal (Pen_RAM) = 100 ciclos.

Paso 2: Aplicar la fórmula jerárquica de AMAT:
AMAT = t_hit_L1 + m_L1 × Penalización_L1
Donde Penalización_L1 = t_hit_L2 + m_L2 × Pen_RAM

Paso 3: Calcular el término de L2:
Penalización_L1 = 8 + (0.20 × 100) = 8 + 20 = 28 ciclos.

Paso 4: Calcular AMAT total:
AMAT = 1 + (0.05 × 28) = 1 + 1.40 = 2.40 ciclos.`,
    examTip: '¡Atención en el enunciado! Si te dan la tasa de fallos global de L2 en vez de local, no la multipliques por m_L1. En este problema es la tasa LOCAL (la que ocurre dado que ya hubo fallo en L1).'
  },
  {
    id: 'aoc-q2-pipeline-stalls',
    subjectId: 'aoc',
    courseYear: 'Examen Oficial AOC - Convocatoria Junio',
    title: 'Ciclos de Ejecución y Paradas en Cauce con Adelantamiento',
    question: 'Considera el siguiente fragmento de código ejecutado en un cauce clásico MIPS de 5 etapas con unidad de adelantamiento (Forwarding) completa y predicción de saltos:\n\n1: LW   $t0, 0($a0)\n2: ADD  $t1, $t0, $a1\n3: SW   $t1, 4($a0)\n4: SUB  $t2, $t0, $t1\n\n¿Cuántas burbujas (stalls) introduce el procesador durante la ejecución de estas 4 instrucciones?',
    options: [
      {
        text: '0 burbujas (el forwarding lo resuelve todo)',
        isCorrect: false,
        explanation: 'Falso. El forwarding no puede viajar atrás en el tiempo: el dato de LW solo está disponible al final de la etapa MEM, pero ADD lo necesita al principio de EX.'
      },
      {
        text: '1 burbuja (entre LW y ADD)',
        isCorrect: true,
        explanation: '¡Exacto! La dependencia LW $t0 -> ADD $t0 es un Load-Use Hazard que exige 1 ciclo de parada. Entre ADD $t1 -> SW $t1 el dato se adelanta directamente a la etapa MEM de SW. Entre ADD $t1 -> SUB $t1 el dato se adelanta de MEM/WB a EX sin paradas.'
      },
      {
        text: '2 burbujas',
        isCorrect: false,
        explanation: 'Excesivo. El adelantamiento resuelve las dependencias de ADD con SW y SUB.'
      },
      {
        text: '3 burbujas',
        isCorrect: false,
        explanation: 'Esto solo ocurriría si el procesador no tuviera unidad de adelantamiento (forwarding).'
      }
    ],
    detailedStepByStepSolution: `Análisis ciclo a ciclo:
Ciclo 1: IF de LW
Ciclo 2: ID de LW, IF de ADD
Ciclo 3: EX de LW, ID de ADD -> El hardware detecta Load-Use Hazard ($t0 es cargado por LW y requerido por ADD en EX).
Ciclo 4: MEM de LW (el dato se lee de memoria aquí). El cauce introduce 1 BURBUJA: ADD repite ID, LW avanza a WB.
Ciclo 5: WB de LW (forwarding de MEM/WB a EX de ADD). EX de ADD ejecuta con el dato correcto.
Ciclo 6: MEM de ADD. EX de SW (forwarding de EX/MEM a MEM de SW).
Ciclo 7: WB de ADD. MEM de SW. EX de SUB.

Total de burbujas insertadas = 1 ciclo.`,
    examTip: 'Para sacar un 10: Siempre revisa si puedes reordenar instrucciones independientes para eliminar esa burbuja. Aquí la instrucción SW no depende de ADD si cambiamos registros, pero respetando el código dado la respuesta es 1 burbuja.'
  },
  {
    id: 'aso-q1-deadlock',
    subjectId: 'aso',
    courseYear: 'Examen Oficial ASO - Convocatoria Junio',
    title: 'Detección de Estado Seguro (Algoritmo del Banquero)',
    question: 'En un sistema con 3 tipos de recursos (A, B, C) con vector de disponibles Disponible = [3, 3, 2], tenemos los siguientes procesos:\n\nP0: Asignado [0, 1, 0], Máximo [7, 5, 3]\nP1: Asignado [2, 0, 0], Máximo [3, 2, 2]\nP2: Asignado [3, 0, 2], Máximo [9, 0, 2]\nP3: Asignado [2, 1, 1], Máximo [2, 2, 2]\nP4: Asignado [0, 0, 2], Máximo [4, 3, 3]\n\n¿Es el estado actual seguro? Si lo es, ¿cuál es una secuencia de ejecución válida?',
    options: [
      {
        text: 'No es seguro, el sistema está en interbloqueo irresoluble.',
        isCorrect: false,
        explanation: 'Falso. Existen procesos cuyas necesidades (Need) pueden ser satisfechas con los recursos disponibles.'
      },
      {
        text: 'Sí es seguro. Secuencia válida: <P1, P3, P4, P0, P2>',
        isCorrect: true,
        explanation: '¡Excelente! P1 necesita [1, 2, 2] <= [3, 3, 2]. P1 termina y libera sus recursos, Disponible pasa a [5, 3, 2]. Luego P3 necesita [0, 1, 1] <= [5, 3, 2], termina y libera, etc.'
      },
      {
        text: 'Sí es seguro. Secuencia válida: <P0, P1, P2, P3, P4>',
        isCorrect: false,
        explanation: 'P0 no puede ejecutarse primero porque su Need es [7, 4, 3], que supera ampliamente el Disponible [3, 3, 2].'
      },
      {
        text: 'No es seguro porque P2 y P0 piden demasiados recursos de tipo A.',
        isCorrect: false,
        explanation: 'Confusión típica: que tengan un Máximo alto no importa si otros procesos pueden terminar primero y liberar sus recursos.'
      }
    ],
    detailedStepByStepSolution: `Matriz Need = Max - Allocation:
Need(P0) = [7, 5, 3] - [0, 1, 0] = [7, 4, 3]
Need(P1) = [3, 2, 2] - [2, 0, 0] = [1, 2, 2]
Need(P2) = [9, 0, 2] - [3, 0, 2] = [6, 0, 0]
Need(P3) = [2, 2, 2] - [2, 1, 1] = [0, 1, 1]
Need(P4) = [4, 3, 3] - [0, 0, 2] = [4, 3, 1]

Disponible inicial = [3, 3, 2]

Ronda 1:
¿Need(P1) [1, 2, 2] <= Disponible [3, 3, 2]? SÍ.
P1 termina y libera: Disponible = [3, 3, 2] + [2, 0, 0] = [5, 3, 2].

Ronda 2:
¿Need(P3) [0, 1, 1] <= Disponible [5, 3, 2]? SÍ.
P3 termina y libera: Disponible = [5, 3, 2] + [2, 1, 1] = [7, 4, 3].

Ronda 3:
¿Need(P4) [4, 3, 1] <= Disponible [7, 4, 3]? SÍ.
P4 termina y libera: Disponible = [7, 4, 3] + [0, 0, 2] = [7, 4, 5].

Ronda 4:
¿Need(P0) [7, 4, 3] <= Disponible [7, 4, 5]? SÍ.
P0 termina y libera: Disponible = [7, 4, 5] + [0, 1, 0] = [7, 5, 5].

Ronda 5:
¿Need(P2) [6, 0, 0] <= Disponible [7, 5, 5]? SÍ.
P2 termina y todos los procesos finalizan. Secuencia segura: <P1, P3, P4, P0, P2>.`,
    examTip: 'En el examen de ASO te pedirán escribir la matriz Need entera. Recuerda que Need = Max - Allocation. ¡Nunca uses Max directamente para comparar con Disponible!'
  },
  {
    id: 'alf-q1-regular',
    subjectId: 'alf',
    courseYear: 'Examen Oficial ALF - Parcial Tema 1 y 2',
    title: 'Clasificación de Lenguajes y Lema del Bombeo',
    question: 'Sea el lenguaje L = { a^n b^m c^(n+m) | n >= 1, m >= 1 }. ¿Cuál es la clasificación exacta de este lenguaje en la jerarquía de Chomsky?',
    options: [
      {
        text: 'Lenguaje Regular (Tipo 3)',
        isCorrect: false,
        explanation: 'Falso. Requiere recordar dos cantidades simultáneas (n y m) para emparejarlas con la suma en c^(n+m), lo cual excede la memoria finita de un AFD.'
      },
      {
        text: 'Lenguaje Independiente del Contexto (Tipo 2), no regular',
        isCorrect: true,
        explanation: '¡Exacto! Se puede generar con una Gramática Libre de Contexto y reconocer con un Autómata con Pila. Cada vez que leemos "a", apilamos un símbolo; cada vez que leemos "b", apilamos otro. Luego desapilamos un símbolo por cada "c".'
      },
      {
        text: 'Lenguaje Sensible al Contexto (Tipo 1), no independiente del contexto',
        isCorrect: false,
        explanation: 'Error. No necesitas dos pilas ni cinta de Turing. Una única pila LIFO es suficiente porque los símbolos "c" se desapilan en orden inverso a la lectura de a y b.'
      },
      {
        text: 'Lenguaje No Recursivamente Enumerable (Tipo 0)',
        isCorrect: false,
        explanation: 'Completamente falso, es decidible y de baja complejidad sintáctica.'
      }
    ],
    detailedStepByStepSolution: `1. Demostración de NO regularidad:
Si aplicamos el Lema del Bombeo tomando w = a^k b^k c^(2k), al descomponer w = xyz con |xy| <= k, la porción bombeable 'y' está compuesta únicamente por 'a'. Al bombear y^2, aumentamos el número de 'a' pero la cantidad de 'c' permanece 2k, rompiendo la igualdad (n + m = número de c). Por tanto L no es regular.

2. Demostración de que SÍ es Independiente del Contexto (GLC):
Podemos reescribir L como: a^n b^m c^m c^n.
Reglas de la gramática:
S -> a S c | A
A -> b A c | bc

Esta gramática genera exactamente n letras 'a' al principio emparejadas con n letras 'c' al final, y en el interior m letras 'b' emparejadas con m letras 'c'. Al ser generable por una GLC, es de Tipo 2.`,
    examTip: 'Truco visual para el examen: Si la igualdad se puede descomponer de forma anidada (como una cebolla a^n ... c^n), se puede resolver con UNA PILA (Libre de Contexto). Si se cruzan las dependencias (ej. a^n b^m a^n b^m o a^n b^n c^n), ya NO es libre de contexto.'
  }
];
