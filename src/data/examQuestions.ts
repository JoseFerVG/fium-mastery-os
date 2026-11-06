import { ExamProblem } from '../types';

export const EXAM_PROBLEMS: ExamProblem[] = [
  // ========================== AOC ==========================
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
    id: 'aoc-q3-coherence-msi',
    subjectId: 'aoc',
    courseYear: 'Examen Oficial AOC - Convocatoria Julio',
    title: 'Transiciones de Estado en Protocolo Snoopy MSI',
    question: 'En un sistema multiprocesador SMP con protocolo de coherencia snoopy MSI sobre bus compartido, dos procesadores P1 y P2 tienen el mismo bloque B en estado Compartido (S). Si el procesador P1 ejecuta una instrucción de escritura (PrEscr) sobre dicho bloque, ¿qué transacción se emite al bus y en qué estado queda el bloque en P1 y en P2?',
    options: [
      {
        text: 'Emite BusRdX; P1 pasa a M y P2 pasa a S.',
        isCorrect: false,
        explanation: 'Incorrecto: no puede quedar en S en P2, ya que P1 ha modificado el bloque en exclusiva.'
      },
      {
        text: 'Emite BusUpgr; P1 pasa a M y P2 pasa a I (Invalid).',
        isCorrect: true,
        explanation: '¡Exacto! Como P1 ya posee los datos válidos en su caché, no necesita leer de nuevo los datos de memoria; solo necesita invalidar las demás copias emitiendo BusUpgr. P1 pasa a Modified (M) y P2 pasa a Invalid (I).'
      },
      {
        text: 'Emite BusRd; P1 pasa a S y P2 pasa a I.',
        isCorrect: false,
        explanation: 'Falso: una escritura no emite BusRd ni mantiene el bloque en S.'
      },
      {
        text: 'No emite nada al bus porque P1 ya tenía el bloque en caché.',
        isCorrect: false,
        explanation: 'Grave error: si no emitiera mensaje al bus, P2 seguiría leyendo el dato viejo, rompiendo la coherencia de memoria.'
      }
    ],
    detailedStepByStepSolution: `1. Estado inicial: P1(S), P2(S). Ambos tienen copias de solo lectura idénticas a la memoria.
2. Petición del procesador local: P1 recibe PrEscr (Processor Write).
3. Transacción en el bus: Dado que P1 ya tiene el bloque en su caché, emitir BusRdX transferiría datos innecesarios. Se emite la optimización BusUpgr (Invalidate).
4. Acción de P2: La controladora de caché de P2 "fisgonea" (snoops) el mensaje BusUpgr para el bloque B, e inmediatamente invalida su propia copia (transición S -> I).
5. Estado final: P1 queda en estado M (Modified, propietario único y dirty); P2 queda en estado I (Invalid).`,
    examTip: 'Distinguir entre BusRdX (trae datos y pide exclusividad desde estado I) y BusUpgr (solo pide exclusividad sin traer datos desde estado S).'
  },

  // ========================== ASO ==========================
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
        text: 'Es seguro. Una secuencia válida es <P1, P3, P4, P0, P2>.',
        isCorrect: true,
        explanation: '¡Correcto! Calculando Need = Max - Asignado:\nNeed(P1) = [1, 2, 2] <= [3, 3, 2] -> Ejecuta P1 y libera [2, 0, 0] -> Disp = [5, 3, 2].\nNeed(P3) = [0, 1, 1] <= [5, 3, 2] -> Ejecuta P3 y libera [2, 1, 1] -> Disp = [7, 4, 3].\nNeed(P4) = [4, 3, 1] <= [7, 4, 3] -> Ejecuta P4 y libera [0, 0, 2] -> Disp = [7, 4, 5].\nNeed(P0) = [7, 4, 3] <= [7, 4, 5] -> Ejecuta P0 y libera [0, 1, 0] -> Disp = [7, 5, 5].\nNeed(P2) = [6, 0, 0] <= [7, 5, 5] -> Ejecuta P2. Todos terminan.'
      },
      {
        text: 'Es seguro, pero solo si la secuencia comienza estrictamente por P0.',
        isCorrect: false,
        explanation: 'Falso: P0 necesita [7, 4, 3] y actualmente solo hay [3, 3, 2] disponibles.'
      },
      {
        text: 'El estado es inseguro porque los recursos totales superan la memoria física.',
        isCorrect: false,
        explanation: 'Inconexo con el algoritmo del banquero.'
      }
    ],
    detailedStepByStepSolution: `Paso 1: Construir la matriz de Necesidad (Need = Max - Allocation):
• Need(P0) = [7-0, 5-1, 3-0] = [7, 4, 3]
• Need(P1) = [3-2, 2-0, 2-0] = [1, 2, 2]
• Need(P2) = [9-3, 0-0, 2-2] = [6, 0, 0]
• Need(P3) = [2-2, 2-1, 2-1] = [0, 1, 1]
• Need(P4) = [4-0, 3-0, 3-2] = [4, 3, 1]

Paso 2: Comparar con Disponible = [3, 3, 2]:
• P1: Need(P1) = [1, 2, 2] <= [3, 3, 2] -> Sí.
  Nuevo Disponible = [3, 3, 2] + Allocation(P1) = [3+2, 3+0, 2+0] = [5, 3, 2].
• P3: Need(P3) = [0, 1, 1] <= [5, 3, 2] -> Sí.
  Nuevo Disponible = [5, 3, 2] + Allocation(P3) = [5+2, 3+1, 2+1] = [7, 4, 3].
• P4: Need(P4) = [4, 3, 1] <= [7, 4, 3] -> Sí.
  Nuevo Disponible = [7+0, 4+0, 3+2] = [7, 4, 5].
• P0: Need(P0) = [7, 4, 3] <= [7, 4, 5] -> Sí.
  Nuevo Disponible = [7, 5, 5].
• P2: Need(P2) = [6, 0, 0] <= [7, 5, 5] -> Sí.
  Todos los procesos completan -> Estado SEGURO.`,
    examTip: 'Recuerda que sumar la matriz de Asignación (Allocation) al vector Disponible al terminar cada proceso es la clave, ya que el proceso LIBERA los recursos que tenía retenidos.'
  },
  {
    id: 'aso-q2-ext2-inode-offset',
    subjectId: 'aso',
    courseYear: 'Examen Oficial ASO - Convocatoria Enero',
    title: 'Resolución de Offset en Sistema de Ficheros Ext2/Ext3',
    question: 'En un sistema de ficheros Ext3 con bloques lógicos de 4096 bytes y punteros de disco de 4 bytes, un nodo-i dispone de 10 punteros directos, 1 BSI, 1 BDI y 1 BTI. Si un proceso ejecuta lseek(fd, 4202496, SEEK_SET) y a continuación realiza una lectura de 1 byte, ¿a través de qué estructura se accede al bloque de datos y cuántas operaciones de E/S de bloques se realizan?',
    options: [
      {
        text: 'A través del 6º bloque directo; 1 operación de E/S.',
        isCorrect: false,
        explanation: 'Falso: 10 bloques directos solo cubren 10 * 4096 = 40.960 bytes.'
      },
      {
        text: 'A través del puntero 15 del BSI; 2 operaciones de E/S (BSI + bloque de datos).',
        isCorrect: true,
        explanation: '¡Correcto! Número de bloque = 4.202.496 / 4096 = 1026.\n10 bloques directos cubren de 0 a 9.\nPunteros por bloque = 4096 / 4 = 1024.\nEl BSI cubre desde el bloque 10 hasta el 10 + 1024 - 1 = 1033.\nComo 1026 está entre 10 y 1033, se encuentra en el BSI.\nÍndice en BSI = 1026 - 10 = 1016 (o puntero dentro del rango BSI). Requiere leer el bloque de metadatos BSI y luego el bloque de datos: 2 lecturas.'
      },
      {
        text: 'A través del BDI; 3 operaciones de E/S.',
        isCorrect: false,
        explanation: 'Falso: el BDI solo se utiliza a partir del bloque lógico 1034.'
      },
      {
        text: 'Provoca un error de límite de fichero (EFBIG).',
        isCorrect: false,
        explanation: 'Falso: el fichero soporta más de 4 TiB de capacidad.'
      }
    ],
    detailedStepByStepSolution: `1. Calcular el tamaño de bloque: B = 4096 bytes.
2. Calcular punteros por bloque: P = 4096 / 4 = 1024 punteros.
3. Calcular el número de bloque lógico correspondiente al offset:
   Bloque = 4.202.496 / 4096 = 1026.
   Desplazamiento dentro del bloque = 4.202.496 % 4096 = 0 bytes.
4. Identificar el tramo en el nodo-i:
   - Bloques directos (10 punteros): Bloques 0 a 9. (Total 10 bloques = 40 KiB).
   - Bloque Simplemente Indirecto BSI (1024 punteros): Bloques 10 a 1033. (Total 1024 bloques = 4 MiB).
   Como 1026 pertenece al rango [10, 1033], el bloque reside en el BSI.
5. Operaciones de lectura a disco:
   - 1ª lectura: Traer a memoria el bloque BSI.
   - 2ª lectura: Traer a memoria el bloque de datos indexado por el BSI.
   Total = 2 lecturas de bloques de disco.`,
    examTip: 'Ten siempre presente la fórmula del tramo: BSI cubre [10, 10 + P - 1]. BDI cubre [10 + P, 10 + P + P² - 1].'
  },

  // ========================== ALF ==========================
  {
    id: 'alf-q1-regular',
    subjectId: 'alf',
    courseYear: 'Examen Oficial ALF - Convocatoria Enero',
    title: 'Aplicación del Lema de Bombeo para Lenguajes Regulares',
    question: 'Sea el lenguaje L = { 0^n 1^m 0^(n+m) | n >= 1, m >= 1 }. Para demostrar mediante el Lema de Bombeo que L NO es regular, ¿cuál es la elección adecuada de la cadena w perteneciente a L en función de la longitud de bombeo p?',
    options: [
      {
        text: 'w = 0^p 1 0^(p+1)',
        isCorrect: false,
        explanation: 'Aunque pertenece a L, fijar m=1 no aprovecha la potencia general del lema y complica la justificación.'
      },
      {
        text: 'w = 0^p 1^p 0^(2p)',
        isCorrect: true,
        explanation: '¡Excelente! Como |w| = 4p >= p, el lema establece que w = xyz con |xy| <= p y |y| > 0. Por tanto, y está compuesta exclusivamente de ceros del primer bloque (y = 0^k con k >= 1). Al bombear para i = 2 (xy^2z), la cadena tiene más ceros al principio pero el bloque final sigue teniendo 2p ceros, violando la igualdad n + m y demostrando la no regularidad.'
      },
      {
        text: 'w = 000 111 000000',
        isCorrect: false,
        explanation: 'Error fatal: no puedes usar números fijos en el lema de bombeo, debe depender del parámetro p.'
      },
      {
        text: 'w = (010)^p',
        isCorrect: false,
        explanation: 'Esa cadena ni siquiera pertenece al lenguaje L (no tiene la forma 0^n 1^m 0^(n+m)).'
      }
    ],
    detailedStepByStepSolution: `1. Supongamos por reducción al absurdo que L es regular. Por el Lema de Bombeo, existe una constante p > 0.
2. Elegimos la cadena w = 0^p 1^p 0^(2p) ∈ L. Su longitud es 4p >= p.
3. Por el Lema, w se divide en xyz tal que:
   - |xy| <= p
   - |y| >= 1
4. Dado que |xy| <= p, tanto x como y están contenidos enteramente en el primer prefijo de ceros (0^p). Por tanto, y = 0^k con 1 <= k <= p.
5. Tomamos i = 2 (bombeo de la cadena: xy²z):
   La cadena resultante tendrá p + k ceros iniciales, p unos, y 2p ceros finales.
6. Para pertenecer a L, debería cumplirse que: (p + k) + p = 2p + k sea igual al número de ceros finales (2p).
   Pero como k >= 1, 2p + k != 2p.
7. Contradicción. Por tanto, L no es regular.`,
    examTip: 'Recuerda: Si |xy| <= p, la subcadena y NUNCA puede contener unos si el primer bloque de ceros tiene longitud p.'
  },

  // ========================== TDS ==========================
  {
    id: 'tds-q1-grasp-refactor',
    subjectId: 'tds',
    courseYear: 'Examen Oficial TDS - Convocatoria Junio',
    title: 'Aplicación del Patrón GRASP Experto en Información',
    question: 'En un sistema de comercio electrónico desarrollado en Java, una clase ControladorFacturacion contiene un método calcularTotalFactura(Factura f) que recorre la lista de Líneas de Factura de f, consulta los precios y calcula el IVA y el total final. ¿Qué principio o patrón de diseño se está violando y cómo debe corregirse?',
    options: [
      {
        text: 'Se viola el patrón Singleton; Factura debe ser un Singleton.',
        isCorrect: false,
        explanation: 'Completamente incorrecto: una factura es una entidad de dominio con múltiples instancias.'
      },
      {
        text: 'Se viola el patrón GRASP Experto en Información; la responsabilidad de calcular el total debe residir en la clase Factura.',
        isCorrect: true,
        explanation: '¡Exacto! La clase Factura posee la colección de Líneas de Factura y sus impuestos asociados: es la Experta en la Información necesaria para realizar el cálculo. Colocar la lógica en el controlador genera bajo acoplamiento deficiente y un modelo de dominio anémico.'
      },
      {
        text: 'Se viola el patrón Adapter; se debe crear un adaptador entre la GUI y la Base de Datos.',
        isCorrect: false,
        explanation: 'El problema no es de incompatibilidad de interfaces, sino de asignación de responsabilidades de negocio.'
      },
      {
        text: 'No se viola ningún patrón; es la forma estándar de programar en tres capas.',
        isCorrect: false,
        explanation: 'Falso: convertir las entidades en meros sacos de datos (getters/setters) rompe el encapsulamiento orientado a objetos.'
      }
    ],
    detailedStepByStepSolution: `1. Diagnóstico del Code Smell: El ControladorFacturacion está asumiendo lógica de negocio y cálculo que no le corresponde, actuando como una "God Class" o clase controladora inflada.
2. Identificación de la Información: Para calcular el total se necesitan las líneas de factura, sus cantidades, precios unitarios y tipo de IVA.
3. Evaluación de GRASP:
   - Patrón Experto en Información: "Asignar la responsabilidad a la clase que tiene la información necesaria para realizarla".
   - La clase Factura tiene la lista de Líneas y la clase LineaFactura tiene la cantidad y el precio del producto.
4. Solución Refactorizada:
   - Factura.getTotal() itera sobre sus lineas invocando linea.getSubtotal().
   - El controlador se limita a invocar factura.getTotal().`,
    examTip: 'En los ejercicios de diseño de TDS, mover la lógica a la clase que tiene los datos no solo satisface el patrón Experto, sino que aumenta la Alta Cohesión y reduce el Acoplamiento.'
  },

  // ========================== ISO (Convocatorias 2026 UMU) ==========================
  {
    id: 'iso-q1-dynamic-priority-aging',
    subjectId: 'iso',
    courseYear: 'Examen Oficial ISO - Convocatoria Junio 2026',
    title: 'Planificación por Prioridades Dinámicas con Envejecimiento (Aging)',
    question: 'Supón un esquema de planificación con prioridades dinámicas (a mayor número, mayor prioridad) en el que, para evitar la inanición, se aumenta en 1 la prioridad de un proceso cada tic completo que pasa en la cola de listos. En caso de empate, continúa en CPU el que ya la tiene.\n\nAl comienzo del tic t se empieza a ejecutar P (prioridad inicial 2, ráfagas: 3 CPU, 1 E/S, 1 CPU). Justo antes del tic t+1 se inserta en listos Q (prioridad inicial 4, ráfagas: 2 CPU, 1 E/S, 2 CPU).\n\n¿Bajo qué condición el tiempo medio de retorno de ambos procesos será exactamente 7?',
    options: [
      {
        text: 'Si la planificación por prioridades es APROPIATIVA.',
        isCorrect: true,
        explanation: '¡Exacto! Según la solución oficial de junio 2026: si es apropiativa, en t+1 el proceso Q tiene prioridad 4 frente a P que tiene prioridad 2. Q expulsa a P. El tiempo de retorno de P es 8 y el de Q es 6: Media = (8 + 6) / 2 = 7 tics. Si fuera no apropiativa, la media sería de 6.5 tics.'
      },
      {
        text: 'Si la planificación por prioridades es NO APROPIATIVA.',
        isCorrect: false,
        explanation: 'Falso: si es no apropiativa, P no es expulsado en t+1 y el tiempo medio de retorno resultante es (6 + 7) / 2 = 6.5 tics.'
      },
      {
        text: 'Solo si el quantum de Round Robin es igual a 1.',
        isCorrect: false,
        explanation: 'Inconexo: el algoritmo evaluado no es Round Robin sino prioridades con envejecimiento.'
      },
      {
        text: 'Bajo ninguna circunstancia, el tiempo medio de retorno es siempre 8.',
        isCorrect: false,
        explanation: 'Falso: el cálculo detallado del cronograma demuestra que con apropiación da exactamente 7.'
      }
    ],
    detailedStepByStepSolution: `Análisis ciclo a ciclo (Caso Apropiativo):
• Tic t: P se ejecuta (Prioridad 2).
• Tic t+1: Llega Q (Prioridad 4). Como es apropiativa y 4 > 2, Q expulsa a P. Q ejecuta (rafaga 1/2). P pasa a listos.
• Tic t+2: Q ejecuta su 2ª ráfaga de CPU y pasa a E/S. P pasa de prioridad 2 a 3 por envejecimiento (1 tic en listos).
• Tic t+3: Q está bloqueado en E/S. P toma la CPU con prioridad 3 (ejecuta su 2ª ráfaga).
• Tic t+4: P ejecuta su 3ª ráfaga de CPU y pasa a E/S. Q termina su E/S y pasa a listos.
• Tic t+5: P en E/S. Q toma la CPU.
• Tic t+6: Q termina su 2ª ráfaga de CPU y FINALIZA en t+6. T_retorno(Q) = 6.
• Tic t+7: P toma la CPU para su última ráfaga y FINALIZA en t+8. T_retorno(P) = 8.

Tiempo Medio de Retorno = (8 + 6) / 2 = 7 tics.`,
    examTip: 'Pregunta real del examen de mayo/junio 2026 de Javier Cuenca en la UMU. ¡Recuerda siempre trazar la tabla t, t+1, t+2 con estados E (ejecución), L (listo) y B (bloqueado)!'
  },
  {
    id: 'iso-q2-inode-bitmap-blocks',
    subjectId: 'iso',
    courseYear: 'Examen Oficial ISO - Convocatoria Junio 2026',
    title: 'Cálculo de Bloques de Mapa de Bits y Nodos-i',
    question: 'En un sistema de ficheros UNIX estándar se dedican un total de 15.375 bloques lógicos para almacenar conjuntamente el mapa de bits de nodos-i y la tabla de nodos-i. Una configuración posible para que el mapa de bits ocupe exactamente 15 bloques lógicos es que:',
    options: [
      {
        text: 'Los nodos-i sean de 128 bytes y los bloques lógicos de 4.096 bytes.',
        isCorrect: true,
        explanation: '¡Correcto! Solución oficial de 2026: Con bloques de 4096 bytes y 15 bloques de mapa de bits, se gestionan: 15 * (4096 * 8) = 491.520 nodos-i. La tabla de nodos-i ocupa 15.375 - 15 = 15.360 bloques. El tamaño de cada nodo-i es: (15.360 * 4096) / 491.520 = 128 bytes.'
      },
      {
        text: 'Los nodos-i sean de 256 bytes y los bloques lógicos de 1.024 bytes.',
        isCorrect: false,
        explanation: 'Falso: no cuadran las ecuaciones entre el mapa de bits y los bloques restantes de la tabla.'
      },
      {
        text: 'Los nodos-i sean de 64 bytes y los bloques de 2.048 bytes.',
        isCorrect: false,
        explanation: 'Falso: produciría una discrepancia en el número total de inodos direccionables.'
      },
      {
        text: 'El sistema no puede albergar más de 10.000 nodos-i.',
        isCorrect: false,
        explanation: 'Falso: alberga casi medio millón de nodos-i.'
      }
    ],
    detailedStepByStepSolution: `1. Si el mapa de bits ocupa 15 bloques y cada bloque mide B bytes:
   Número de bits = 15 × (B × 8 bits/byte) = 120 × B bits = Número de nodos-i (I).
2. Para B = 4096 bytes:
   I = 15 × (4096 × 8) = 491.520 nodos-i.
3. Bloques asignados a la tabla de nodos-i:
   Bloques_Tabla = 15.375 - 15 = 15.360 bloques.
4. Comprobación del tamaño del nodo-i (T_nodo):
   Bytes totales de la tabla = 15.360 × 4096 = 62.914.560 bytes.
   T_nodo = 62.914.560 / 491.520 = 128 bytes exactos.`,
    examTip: 'Cada bloque de mapa de bits contiene B * 8 bits. ¡Nunca olvides el factor 8 de bits por byte!'
  },

  // ========================== AC ==========================
  {
    id: 'ac-q1-entropy-gain',
    subjectId: 'ac',
    courseYear: 'Examen Oficial AC - Convocatoria Enero',
    title: 'Cálculo de Entropía y Ganancia de Información en Árboles',
    question: 'En un conjunto de datos con 14 instancias, 9 pertenecen a la clase Positiva (+) y 5 a la clase Negativa (-). Su entropía inicial es H(S) = 0.940 bits. Si evaluamos un atributo "Viento" que divide los datos en:\n- Viento Débil (8 instancias: 6+, 2-)\n- Viento Fuerte (6 instancias: 3+, 3-)\n¿Cuál es la Ganancia de Información Gain(S, Viento)?',
    options: [
      {
        text: '0.048 bits',
        isCorrect: true,
        explanation: '¡Correcto! H(Débil) = -6/8 log2(6/8) - 2/8 log2(2/8) = 0.811 bits.\nH(Fuerte) = -3/6 log2(3/6) - 3/6 log2(3/6) = 1.000 bit.\nResto(S, Viento) = (8/14) * 0.811 + (6/14) * 1.000 = 0.463 + 0.429 = 0.892 bits.\nGain(S, Viento) = 0.940 - 0.892 = 0.048 bits.'
      },
      {
        text: '0.129 bits',
        isCorrect: false,
        explanation: 'Error en la ponderación por el número de instancias de cada rama.'
      },
      {
        text: '0.500 bits',
        isCorrect: false,
        explanation: 'Error al no restar la entropía residual de la entropía del nodo padre.'
      },
      {
        text: '0.940 bits',
        isCorrect: false,
        explanation: 'Esa es la entropía del nodo padre, no la ganancia.'
      }
    ],
    detailedStepByStepSolution: `Paso 1: Calcular la entropía de cada subconjunto:
• Rama Débil (8 muestras: 6+, 2-):
  p+ = 6/8 = 0.75; p- = 2/8 = 0.25.
  H(Débil) = -(0.75 × log2(0.75) + 0.25 × log2(0.25)) = -(0.75 × (-0.415) + 0.25 × (-2)) = 0.311 + 0.500 = 0.811 bits.
• Rama Fuerte (6 muestras: 3+, 3-):
  Equiprobable -> H(Fuerte) = 1.000 bit.

Paso 2: Calcular el Resto ponderado:
Resto = (8/14) × 0.811 + (6/14) × 1.000 = 0.4634 + 0.4286 = 0.8920 bits.

Paso 3: Calcular la Ganancia:
Gain(S, Viento) = H(S) - Resto = 0.940 - 0.892 = 0.048 bits.`,
    examTip: 'ID3 del dataset PlayTennis de Quinlan. Recuerda que si una rama está balanceada al 50/50, su entropía es exactamente 1.0.'
  },

  // ========================== AR ==========================
  {
    id: 'ar-q1-vlsm-subnets',
    subjectId: 'ar',
    courseYear: 'Examen Oficial AR - Convocatoria Junio',
    title: 'Diseño de Subredes VLSM con Prefijo de Red',
    question: 'A partir del bloque de red IPv4 192.168.10.0/24, se necesita configurar una subred que albergue exactamente 55 hosts útiles para la Facultad de Informática. ¿Cuál es la máscara de subred en notación decimal punteada y cuál es la dirección de difusión (broadcast) asignada?',
    options: [
      {
        text: 'Máscara: 255.255.255.192 (/26); Broadcast: 192.168.10.63',
        isCorrect: true,
        explanation: '¡Excelente! Para 55 hosts útiles: 2^h - 2 >= 55 -> h = 6 bits de host (2^6 - 2 = 62 hosts útiles). Máscara = 32 - 6 = /26 = 255.255.255.192. La subred va de 192.168.10.0 a 192.168.10.63, siendo .63 el broadcast.'
      },
      {
        text: 'Máscara: 255.255.255.128 (/25); Broadcast: 192.168.10.127',
        isCorrect: false,
        explanation: 'Desperdicio de direcciones: /25 aloja hasta 126 hosts cuando con /26 caben perfectamente 62.'
      },
      {
        text: 'Máscara: 255.255.255.224 (/27); Broadcast: 192.168.10.31',
        isCorrect: false,
        explanation: 'Error grave: /27 solo admite 2^5 - 2 = 30 hosts útiles, insuficiente para los 55 requeridos.'
      },
      {
        text: 'Máscara: 255.255.255.0 (/24); Broadcast: 192.168.10.255',
        isCorrect: false,
        explanation: 'Esa es la red original sin subredes divididas.'
      }
    ],
    detailedStepByStepSolution: `1. Requerimiento: H = 55 hosts.
2. Calcular bits de host h:
   2^5 - 2 = 30 < 55 (Insuficiente).
   2^6 - 2 = 62 >= 55 (Suficiente y óptimo). Por tanto h = 6 bits.
3. Longitud de prefijo CIDR: 32 - 6 = /26.
4. Máscara decimal punteada:
   11111111.11111111.11111111.11000000 = 255.255.255.192.
5. Rango de la subred:
   - Dirección de Red: 192.168.10.0
   - Primer host útil: 192.168.10.1
   - Último host útil: 192.168.10.62
   - Dirección de Broadcast: 192.168.10.63`,
    examTip: 'Comprueba siempre que 2^h - 2 cubra los hosts pedidos. ¡No olvides el -2 de red y broadcast!'
  },

  // ========================== ST ==========================
  {
    id: 'st-q1-rsa-calculation',
    subjectId: 'st',
    courseYear: 'Examen Oficial ST - Convocatoria Junio',
    title: 'Cálculo de Par de Claves y Cifrado RSA',
    question: 'En el sistema RSA, un usuario elige los números primos p = 5 y q = 11, y escoge el exponente público e = 3. Si desea cifrar el mensaje numérico M = 8, ¿cuál es el valor de la clave privada d y cuál es el criptograma C resultante?',
    options: [
      {
        text: 'd = 27; C = 17',
        isCorrect: true,
        explanation: '¡Impecable! n = 5 * 11 = 55; phi(n) = (5-1) * (11-1) = 4 * 10 = 40. d * 3 = 1 mod 40 -> 27 * 3 = 81 = 2 * 40 + 1 (d = 27). C = 8^3 mod 55 = 512 mod 55. 512 = 9 * 55 + 17 -> C = 17.'
      },
      {
        text: 'd = 7; C = 12',
        isCorrect: false,
        explanation: 'Error al calcular el inverso modular d: 7 * 3 = 21 != 1 mod 40.'
      },
      {
        text: 'd = 13; C = 8',
        isCorrect: false,
        explanation: 'Error en el cálculo de phi(n) o del criptograma.'
      },
      {
        text: 'd = 3; C = 35',
        isCorrect: false,
        explanation: 'e y d no pueden ser iguales en este escenario.'
      }
    ],
    detailedStepByStepSolution: `Paso 1: Módulo y función phi de Euler:
• n = p × q = 5 × 11 = 55.
• φ(n) = (p - 1) × (q - 1) = 4 × 10 = 40.

Paso 2: Exponente público e:
• e = 3. Comprobación de coprimalidad: mcd(3, 40) = 1 (Válido).

Paso 3: Clave privada d (inverso modular de e mod 40):
• Buscamos d tal que (d × 3) mod 40 = 1.
• Probando múltiplos: 40 × 2 + 1 = 81. 81 / 3 = 27. Por tanto d = 27.

Paso 4: Cifrado del mensaje M = 8:
• C = M^e mod n = 8^3 mod 55 = 512 mod 55.
• 512 / 55 = 9.309... -> 9 × 55 = 495.
• 512 - 495 = 17.
• Criptograma C = 17.`,
    examTip: 'Problema idéntico al ejercicio oficial 1 del Boletín del Tema 7 de Seguridad de Servicios Telemáticos.'
  },

  // ========================== SI ==========================
  {
    id: 'si-q1-astar-admissibility',
    subjectId: 'si',
    courseYear: 'Examen Oficial SI - Convocatoria Enero',
    title: 'Condición de Admisibilidad y Monotonía de Heurísticas en A*',
    question: 'En un problema de búsqueda en espacio de estados resuelto mediante el algoritmo A* en grafo con función de evaluación f(n) = g(n) + h(n), ¿qué condición matemática garantiza que nunca sea necesario reabrir un nodo que ya se encuentra en la lista de Cerrados?',
    options: [
      {
        text: 'Que la heurística h(n) sea Monótona (Consistente): h(n) <= c(n, a, n\') + h(n\').',
        isCorrect: true,
        explanation: '¡Exacto! La consistencia (o monotonía) exige que la heurística cumpla la desigualdad triangular respecto al coste del paso c(n, a, n\'). Esto garantiza que los valores f(n) crecen de forma no decreciente a lo largo de cualquier camino y que la primera vez que un nodo se extrae hacia Cerrados ya se ha alcanzado por su camino óptimo.'
      },
      {
        text: 'Que la heurística h(n) sea mayor que el coste real h*(n).',
        isCorrect: false,
        explanation: 'Falso: eso violaría la admisibilidad y perdería la garantía de optimalidad.'
      },
      {
        text: 'Que la lista de Abiertos esté ordenada exclusivamente por g(n).',
        isCorrect: false,
        explanation: 'Eso sería el algoritmo de Dijkstra / Coste Uniforme, no A*.'
      },
      {
        text: 'Que el factor de ramificación del grafo sea menor o igual a 2.',
        isCorrect: false,
        explanation: 'Inconexo con las garantías de reapertura de nodos de A*.'
      }
    ],
    detailedStepByStepSolution: `1. En búsqueda en árbol, la Admisibilidad (h(n) <= h*(n)) basta para asegurar la optimalidad.
2. Sin embargo, en búsqueda en GRAFO, un nodo puede alcanzarse por múltiples caminos. Si h es admisible pero no consistente, podríamos expandir un nodo n por un camino subóptimo y cerrarlo, y más tarde encontrar un camino con menor g(n), obligando a reabrir n y todos sus descendientes.
3. La condición de Consistencia (Monotonía):
   h(n) <= c(n, a, n') + h(n')
   asegura que f(n') = g(n') + h(n') = g(n) + c(n, a, n') + h(n') >= g(n) + h(n) = f(n).
4. Como f es monótona no decreciente, el primer camino que llega a un nodo cerrado es garantizadamente el de menor coste: Cerrados es definitivo.`,
    examTip: 'Típica pregunta conceptual del Tema 3 de Sistemas Inteligentes. Toda heurística consistente es admisible, pero no toda heurística admisible es consistente.'
  }
];
