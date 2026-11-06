import { SubjectId, SimulatorId } from '../types';

export interface RescueDay {
  dayNumber: number;
  phase: 'Fase 1: Despegue Inmediato' | 'Fase 2: Núcleo Crítico' | 'Fase 3: Consolidación';
  subjectId: SubjectId;
  subjectName: string;
  subjectCode: string;
  title: string;
  subtitle: string;
  priority: 'URGENCIA MÁXIMA' | 'ALTA RENTABILIDAD' | 'PRÁCTICA CRÍTICA';
  durationMin: number;
  objective: string;
  actionChecklist: string[];
  examKey: string;
  targetAction: {
    type: 'simulator' | 'course' | 'duolingo' | 'exam';
    targetId?: SimulatorId | string;
    subjectId?: SubjectId;
    label: string;
  };
  xpReward: number;
  gemReward: number;
}

export const RESCUE_DAYS: RescueDay[] = [
  // FASE 1: DESPEGUE INMEDIATO (DÍAS 1-4) - Romper la inercia con victorias rápidas
  {
    dayNumber: 1,
    phase: 'Fase 1: Despegue Inmediato',
    subjectId: 'aoc',
    subjectName: 'AOC',
    subjectCode: '1909',
    title: 'Pipeline MIPS de 5 Etapas, Hazards y Forwarding',
    subtitle: 'El problema que SIEMPRE cae en el primer ejercicio del examen de AOC',
    priority: 'ALTA RENTABILIDAD',
    durationMin: 40,
    objective: 'Comprender visualmente el flujo de instrucciones en IF, ID, EX, MEM, WB y saber exactamente cuándo ocurre una burbuja forzosa.',
    actionChecklist: [
      'Abre el Simulador de Pipeline y activa el caso "RAW Hazard con Forwarding".',
      'Observa cómo el valor producido en la ALU en ciclo 3 pasa directamente al ciclo 4 sin paradas.',
      'Cambia al preset "Load-Use Hazard": comprueba por qué un LW seguido de un ADD obliga a congelar el procesador 1 ciclo.',
      'Memoriza la regla de oro: la RAM entrega el dato al final de MEM, por lo que nunca llega a tiempo para el inicio de EX inmediato.'
    ],
    examKey: 'Si en el examen ves "LW $t0, 0($a0)" seguido inmediatamente de "ADD $t1, $t0, $a1", pon SIEMPRE 1 ciclo de parada (burbuja).',
    targetAction: {
      type: 'simulator',
      targetId: 'pipeline',
      label: 'Abrir Simulador de Pipeline'
    },
    xpReward: 120,
    gemReward: 15
  },
  {
    dayNumber: 2,
    phase: 'Fase 1: Despegue Inmediato',
    subjectId: 'tds',
    subjectName: 'TDS',
    subjectCode: '1907',
    title: 'SOLID Code Doctor y Reglas de Corrección de TDS',
    subtitle: 'Evita los antipatrones que provocan el suspenso directo en el proyecto y en teoría',
    priority: 'PRÁCTICA CRÍTICA',
    durationMin: 45,
    objective: 'Distinguir con claridad los principios SRP, OCP y DIP, y saber cómo aplicarlos en el código de Java.',
    actionChecklist: [
      'Entra en el SOLID Code Doctor y revisa el caso "Violación Clásica: La Clase Dios".',
      'Examina por qué una clase de Dominio nunca debe tener imports de interfaz gráfica (JavaFX) ni sentencias directas de SQL.',
      'Revisa el caso OCP: sustitución de switch-case infinitos por la interfaz del patrón Strategy.',
      'Anota el criterio del profesor para la evaluación del proyecto de Gestión de Gastos.'
    ],
    examKey: 'Criterio eliminatorio en la UMU: si en el proyecto o examen una clase de la Vista hace "new EntidadDominio()" o accede a repositorios directamente, penalización máxima por violar MVC y GRASP Controlador.',
    targetAction: {
      type: 'simulator',
      targetId: 'solid-doctor',
      label: 'Abrir SOLID Code Doctor'
    },
    xpReward: 120,
    gemReward: 15
  },
  {
    dayNumber: 3,
    phase: 'Fase 1: Despegue Inmediato',
    subjectId: 'aso',
    subjectName: 'ASO',
    subjectCode: '1910',
    title: 'Llamadas al Sistema POSIX: fork, pipe y dup2',
    subtitle: 'El esqueleto de código en C que entra en todos los exámenes de prácticas y teoría',
    priority: 'PRÁCTICA CRÍTICA',
    durationMin: 45,
    objective: 'Dominar la creación de procesos en C con fork(), la redirección de descriptores con dup2() y el cierre riguroso de descriptores no usados.',
    actionChecklist: [
      'Abre el tema Feynman de ASO: "Llamadas al Sistema POSIX, Tuberías y Señales".',
      'Lee la analogía de la fontanería: una tubería tiene 2 extremos (p[0] para leer, p[1] para escribir).',
      'Estudia el patrón canónico: el proceso hijo cierra p[0], hace dup2(p[1], STDOUT_FILENO), cierra p[1] y ejecuta execlp().',
      'El padre cierra p[1] inmediatamente para permitir que el pipe detecte el fin de fichero (EOF).'
    ],
    examKey: 'Error típico número 1 de examen: olvidar cerrar p[1] en el proceso padre. Si no se cierra, read() se queda bloqueado esperando eternamente y el programa se congela.',
    targetAction: {
      type: 'course',
      subjectId: 'aso',
      targetId: 'aso-posix-pipes-signals',
      label: 'Ver Apuntes Feynman de POSIX'
    },
    xpReward: 120,
    gemReward: 15
  },
  {
    dayNumber: 4,
    phase: 'Fase 1: Despegue Inmediato',
    subjectId: 'alf',
    subjectName: 'ALF',
    subjectCode: '1905',
    title: 'Autómatas Finitos Deterministas y No Deterministas (AFD & AFND)',
    subtitle: 'La base procedural de ALF: cómo diseñar autómatas y procesar cadenas paso a paso',
    priority: 'ALTA RENTABILIDAD',
    durationMin: 40,
    objective: 'Comprender la función de transición de estados y visualizar el cabezal de lectura de la cinta.',
    actionChecklist: [
      'Abre el Simulador de Autómatas Finitos en la sección de simuladores.',
      'Carga el autómata "Cadenas que terminan en 01" y avanza la cinta símbolo a símbolo con el botón paso a paso.',
      'Prueba una cadena que deba ser aceptada (ej. "1101") y otra rechazada (ej. "1010").',
      'Carga el autómata con alfabeto {a, b} y observa las transiciones en bucle de los estados finales.'
    ],
    examKey: 'En exámenes de ALF: un autómata finito determinista (AFD) debe tener DEFINIDA exactamente una transición para CADA símbolo del alfabeto en CADA estado. Si falta alguna, el profesor te considerará que es un AFND.',
    targetAction: {
      type: 'simulator',
      targetId: 'automata',
      label: 'Abrir Simulador de Autómatas'
    },
    xpReward: 120,
    gemReward: 15
  },

  // FASE 2: NÚCLEO CRÍTICO (DÍAS 5-9) - Ataque frontal a los temas más temidos
  {
    dayNumber: 5,
    phase: 'Fase 2: Núcleo Crítico',
    subjectId: 'aoc',
    subjectName: 'AOC',
    subjectCode: '1909',
    title: 'Desglose de Direcciones de Caché y Cálculo de AMAT',
    subtitle: 'Tag, Index, Offset: el ejercicio numérico garantizado de AOC',
    priority: 'URGENCIA MÁXIMA',
    durationMin: 50,
    objective: 'Saber calcular al instante los bits de Tag, Índice y Offset para cualquier tamaño de bloque y nivel de asociatividad.',
    actionChecklist: [
      'Abre la Calculadora de Caché Interactiva.',
      'Configura: Dirección de 32 bits, Bloque de 64 Bytes (Offset = log2(64) = 6 bits).',
      'Prueba correspondencia directa vs asociativa por conjuntos de 4 vías.',
      'Introduce una dirección en hexadecimal (ej. 0x0040A2F4) y observa cómo se descomponen los bits automáticamente.',
      'Repasa la fórmula de AMAT: t_acceso + (tasa_fallo * penalizacion_fallo).'
    ],
    examKey: '¡Ojo con las unidades! El tamaño del bloque y de la caché siempre deben convertirse a Bytes antes de calcular el logaritmo en base 2.',
    targetAction: {
      type: 'simulator',
      targetId: 'cache',
      label: 'Abrir Calculadora de Caché'
    },
    xpReward: 140,
    gemReward: 20
  },
  {
    dayNumber: 6,
    phase: 'Fase 2: Núcleo Crítico',
    subjectId: 'tds',
    subjectName: 'TDS',
    subjectCode: '1907',
    title: 'Patrones GoF: Strategy, Observer, Factory y Singleton',
    subtitle: 'Los patrones obligatorios en la rúbrica del proyecto de Gestión de Gastos',
    priority: 'PRÁCTICA CRÍTICA',
    durationMin: 50,
    objective: 'Identificar qué patrón aplicar a cada requisito del proyecto sin dudar.',
    actionChecklist: [
      'Abre el tema Feynman de TDS: "Patrones GoF y Arquitectura Limpia".',
      'Estrategia (Strategy): Para algoritmos de cálculo de impuestos o conversión de monedas variables.',
      'Observador (Observer): Para que la interfaz gráfica JavaFX se actualice automáticamente cuando se añade un gasto al modelo.',
      'Factoría (Factory): Para la importación de datos polimórfica (ficheros CSV, JSON, XML).',
      'Singleton: Para el Controlador principal de la aplicación o el repositorio único.'
    ],
    examKey: 'Pregunta fija de teoría: "¿Por qué el patrón Strategy favorece la composición frente a la herencia?". Respuesta: porque permite intercambiar el algoritmo en tiempo de ejecución (dinámico) sin recompilar subclases rígidas.',
    targetAction: {
      type: 'course',
      subjectId: 'tds',
      targetId: 'tds-gof-patterns-deep',
      label: 'Ver Apuntes de Patrones GoF'
    },
    xpReward: 140,
    gemReward: 20
  },
  {
    dayNumber: 7,
    phase: 'Fase 2: Núcleo Crítico',
    subjectId: 'aso',
    subjectName: 'ASO',
    subjectCode: '1910',
    title: 'Memoria Virtual: Fallos de Página y Algoritmos de Reemplazo',
    subtitle: 'Compara paso a paso FIFO, LRU y el Algoritmo del Reloj',
    priority: 'URGENCIA MÁXIMA',
    durationMin: 45,
    objective: 'Calcular el número exacto de fallos de página ante una secuencia de referencias arbitraria.',
    actionChecklist: [
      'Abre el Simulador de Reemplazo de Páginas de ASO.',
      'Usa 3 marcos de memoria física y la cadena típica de examen: 7, 0, 1, 2, 0, 3, 0, 4, 2, 3.',
      'Ejecuta primero con FIFO y cuenta los fallos de página.',
      'Reinicia y ejecuta con LRU: observa qué página se desaloja en cada instante.',
      'Prueba el Algoritmo del Reloj (Segunda Oportunidad) y visualiza cómo rota la aguja y se limpian los bits de uso.'
    ],
    examKey: 'En exámenes de ASO: ten mucho cuidado con la Anomalía de Bélády en FIFO (aumentar el número de marcos a veces provoca MÁS fallos de página). LRU nunca sufre esta anomalía.',
    targetAction: {
      type: 'simulator',
      targetId: 'virtual-memory',
      label: 'Abrir Simulador de Memoria Virtual'
    },
    xpReward: 140,
    gemReward: 20
  },
  {
    dayNumber: 8,
    phase: 'Fase 2: Núcleo Crítico',
    subjectId: 'iso',
    subjectName: 'ISO',
    subjectCode: '1904',
    title: 'Planificación de CPU: Round Robin, SRTF y FCFS',
    subtitle: 'Construcción impecable de Diagramas de Gantt y cálculo de tiempos medios',
    priority: 'ALTA RENTABILIDAD',
    durationMin: 40,
    objective: 'Dibujar el diagrama de Gantt sin equivocarse con el tiempo de llegada y calcular el Tiempo de Espera Medio (TEM).',
    actionChecklist: [
      'Abre el Simulador de Planificación de CPU.',
      'Prueba el algoritmo Round Robin con Quantum = 2 y Quantum = 4.',
      'Observa cómo el quantum pequeño favorece la interactividad pero genera mayor sobrecarga de cambio de contexto.',
      'Prueba SRTF (Shortest Remaining Time First) con expulsión: fíjate qué proceso toma la CPU cuando llega uno nuevo con menor ráfaga pendiente.'
    ],
    examKey: 'En el examen de ISO: el Tiempo de Retorno (Turnaround) es T_fin - T_llegada. El Tiempo de Espera es T_retorno - Ráfaga_CPU. ¡No olvides restar el tiempo de llegada!',
    targetAction: {
      type: 'simulator',
      targetId: 'cpu-scheduler',
      label: 'Abrir Simulador de Planificación'
    },
    xpReward: 130,
    gemReward: 20
  },
  {
    dayNumber: 9,
    phase: 'Fase 2: Núcleo Crítico',
    subjectId: 'tds',
    subjectName: 'TDS',
    subjectCode: '1907',
    title: 'Java Streams: Filter, Map, Reduce y Collectors.groupingBy',
    subtitle: 'La sintaxis funcional moderna obligatoria en las prácticas y el proyecto',
    priority: 'PRÁCTICA CRÍTICA',
    durationMin: 45,
    objective: 'Reemplazar bucles tradicionales for anidados por pipelines declarativos con Java Streams.',
    actionChecklist: [
      'Abre el tema Feynman de TDS: "Java Streams & Procesamiento Funcional".',
      'Aprende a filtrar listas con .filter(p -> p.getCantidad() > 0).',
      'Mapea datos con .map(Gasto::getImporte).',
      'Domina la agrupación con Collectors.groupingBy(Gasto::getCategoria, Collectors.summingDouble(Gasto::getImporte)).'
    ],
    examKey: 'En el examen de TDS: los profesores penalizan explícitamente el uso de bucles "for" o "while" para procesar colecciones en los ejercicios de programación funcional.',
    targetAction: {
      type: 'course',
      subjectId: 'tds',
      targetId: 'tds-java-streams',
      label: 'Ver Código y Ejemplos de Java Streams'
    },
    xpReward: 140,
    gemReward: 20
  },

  // FASE 3: CONSOLIDACIÓN Y EXÁMENES (DÍAS 10-14) - Asegurar el aprobado en primera convocatoria
  {
    dayNumber: 10,
    phase: 'Fase 3: Consolidación',
    subjectId: 'alf',
    subjectName: 'ALF',
    subjectCode: '1905',
    title: 'Gramáticas Libres de Contexto (GLC) y Jerarquía de Chomsky',
    subtitle: 'Árboles de derivación sintáctica y eliminación de ambigüedad',
    priority: 'ALTA RENTABILIDAD',
    durationMin: 45,
    objective: 'Saber demostrar si una gramática es ambigua y construir el árbol de derivación para una palabra.',
    actionChecklist: [
      'Abre el tema Feynman de ALF: "Jerarquía de Chomsky y Gramáticas Libres de Contexto".',
      'Repasa los 4 tipos de la jerarquía: Tipo 0 (recursivamente enumerables), Tipo 1 (sensibles al contexto), Tipo 2 (libres de contexto) y Tipo 3 (regulares).',
      'Aprende a probar ambigüedad: encontrar 1 palabra que tenga DOS árboles de derivación sintáctica distintos (o dos derivaciones a la izquierda diferentes).'
    ],
    examKey: 'Para demostrar ambigüedad en el examen basta con encontrar UN SOLO contraejemplo con dos árboles distintos. No hace falta una demostración general.',
    targetAction: {
      type: 'course',
      subjectId: 'alf',
      targetId: 'alf-cfg-chomsky',
      label: 'Ver Apuntes de Gramáticas'
    },
    xpReward: 150,
    gemReward: 25
  },
  {
    dayNumber: 11,
    phase: 'Fase 3: Consolidación',
    subjectId: 'aso',
    subjectName: 'ASO',
    subjectCode: '1910',
    title: 'Sistema de Ficheros UNIX ext2, Inodos y Estructura xv6',
    subtitle: 'Bloques directos, indirectos simples, dobles y triples',
    priority: 'URGENCIA MÁXIMA',
    durationMin: 50,
    objective: 'Calcular el tamaño máximo de fichero que admite un inodo según el tamaño de bloque del sistema de ficheros.',
    actionChecklist: [
      'Abre el tema Feynman de ASO: "Sistema de Ficheros UNIX: Inodos, Bloques y xv6".',
      'Memoriza la estructura clásica: 12 bloques directos, 1 puntero indirecto simple, 1 puntero indirecto doble, 1 puntero indirecto triple.',
      'Calcula cuántos punteros caben en un bloque: Tamaño_Bloque / 4 bytes (en sistemas de 32 bits).',
      'Revisa el funcionamiento de las llamadas open(), read(), write() y lseek() sobre la tabla de descriptores y la tabla de ficheros abiertos del kernel.'
    ],
    examKey: 'Recuerda que los nombres de los ficheros NO están guardados en el inodo, sino en el contenido del bloque del directorio padre.',
    targetAction: {
      type: 'course',
      subjectId: 'aso',
      targetId: 'aso-fs-inodes',
      label: 'Ver Apuntes de Inodos y ext2'
    },
    xpReward: 150,
    gemReward: 25
  },
  {
    dayNumber: 12,
    phase: 'Fase 3: Consolidación',
    subjectId: 'iso',
    subjectName: 'ISO',
    subjectCode: '1904',
    title: 'Automatización y Scripts en Bash para Exámenes UMU',
    subtitle: 'Comprobación de argumentos, bucles for, pipes con grep, awk y sed',
    priority: 'ALTA RENTABILIDAD',
    durationMin: 45,
    objective: 'Escribir scripts en Bash robustos que validen el número de parámetros y procesen ficheros de texto sin fallos.',
    actionChecklist: [
      'Abre el tema Feynman de ISO: "Automatización y Scripts en Bash para Ingeniería".',
      'Estructura estándar de examen: if [ $# -lt 1 ]; then echo "Uso..." >&2; exit 1; fi.',
      'Uso de find con -type f y permisos -perm.',
      'Filtrado de columnas de texto con awk y conteo con wc -l.'
    ],
    examKey: 'Siempre redirige los mensajes de error a stderr con ">&2" y sal del script con un código de error "exit 1". Los correctores de ISO restan nota si el error va a stdout.',
    targetAction: {
      type: 'course',
      subjectId: 'iso',
      targetId: 'iso-bash-scripting',
      label: 'Ver Plantilla de Scripts Bash'
    },
    xpReward: 150,
    gemReward: 25
  },
  {
    dayNumber: 13,
    phase: 'Fase 3: Consolidación',
    subjectId: 'aoc',
    subjectName: 'AOC',
    subjectCode: '1909',
    title: 'Tomasulo con ROB (Reorder Buffer) y Ejecución Fuera de Orden',
    subtitle: 'Renombramiento de registros, estaciones de reserva y confirmación en orden',
    priority: 'URGENCIA MÁXIMA',
    durationMin: 50,
    objective: 'Comprender cómo el procesador elimina riesgos WAR y WAW mediante renombramiento en el ROB y confirma los resultados en orden para garantizar excepciones precisas.',
    actionChecklist: [
      'Abre el tema Feynman de AOC: "Procesadores Superescalares y Tomasulo con ROB".',
      'Identifica las 4 fases: Emisión (Issue), Ejecución (Execute), Escritura de Resultado (Write Result) y Confirmación (Commit).',
      'Observa qué campo del ROB actúa como identificador temporal de la instrucción.',
      'Comprende por qué el Commit estricto en orden es lo que permite recuperarse de fallos de página y predicciones de salto erróneas.'
    ],
    examKey: 'La confirmación (Commit) SIEMPRE se realiza en el orden estricto del programa. Aunque una instrucción termine antes, debe esperar su turno en la cabeza de la cola FIFO del ROB.',
    targetAction: {
      type: 'course',
      subjectId: 'aoc',
      targetId: 'aoc-tomasulo-rob',
      label: 'Ver Apuntes de Tomasulo con ROB'
    },
    xpReward: 160,
    gemReward: 25
  },
  {
    dayNumber: 14,
    phase: 'Fase 3: Consolidación',
    subjectId: 'aoc',
    subjectName: 'Todas',
    subjectCode: 'UMU',
    title: 'Simulacro de Examen Oficial y Banco de Problemas Reales',
    subtitle: 'Pon a prueba tus conocimientos en condiciones reales de examen con soluciones paso a paso',
    priority: 'URGENCIA MÁXIMA',
    durationMin: 55,
    objective: 'Resolver 5 preguntas de convocatorias anteriores y comprobar que dominas las trampas más habituales de la corrección.',
    actionChecklist: [
      'Abre el Entrenador de Exámenes de FIUM Mastery OS.',
      'Resuelve al menos 1 problema de AOC (AMAT o Pipeline).',
      'Resuelve 1 problema de ASO (Paginación o Señales).',
      'Resuelve 1 problema de TDS (SOLID o GRASP).',
      'Lee la derivación matemática detallada y los consejos de examen adjuntos a cada solución.'
    ],
    examKey: '¡Felicidades por completar los 14 días! Has transformado el atraso y la incertidumbre en un dominio estructurado y verificable de las 5 asignaturas de tu cuatrimestre.',
    targetAction: {
      type: 'exam',
      label: 'Abrir Banco Oficial de Exámenes'
    },
    xpReward: 200,
    gemReward: 50
  }
];
