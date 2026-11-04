import { DuolingoUnit } from '../types/duolingo';

export const DUOLINGO_UNITS: DuolingoUnit[] = [
  // ==========================================
  // ASIGNATURA: AOC (Arquitectura y Organización de Computadores)
  // ==========================================
  {
    id: 'aoc-unit-1',
    unitNumber: 1,
    title: 'Rendimiento y Ley de Amdahl',
    description: 'Ecuaciones fundamentales de CPU, CPI y límites matemáticos de aceleración.',
    color: 'from-amber-600 to-orange-600',
    borderColor: 'border-amber-500',
    subjectId: 'aoc',
    guideBook: {
      title: 'Guía de Rendimiento: CPU & Amdahl',
      keyPoints: [
        'Tiempo de CPU = N° Instrucciones × CPI × Periodo de Reloj (T_c).',
        'El CPI global es la media ponderada del CPI de cada tipo de instrucción multiplicada por su frecuencia relativa.',
        'La Ley de Amdahl establece que la aceleración global está estrictamente acotada por la fracción no acelerable: S_global = 1 / ((1 - F_m) + (F_m / S_m)).',
      ],
      commonMistakes: [
        'Olvidar que si una mejora acelera infinitamente el 80% del programa, la aceleración máxima posible es sólo 1 / (1 - 0.8) = 5x (¡no infinito!).',
        'Confundir MIPS (Millones de Instrucciones por Segundo) con rendimiento real; MIPS varía según el conjunto de instrucciones (ISA) y no compara CPUs distintas.',
      ],
      essentialFormula: 'S = 1 / ((1 - F_m) + F_m / S_m) | T_cpu = IC * CPI * T_clock',
    },
    lessons: [
      {
        id: 'aoc-u1-l1',
        title: 'Cálculo del CPI Global',
        subtitle: 'Media ponderada y balance de ciclos',
        unitId: 'aoc-unit-1',
        subjectId: 'aoc',
        xpReward: 20,
        gemReward: 5,
        questions: [
          {
            id: 'aoc-q1',
            type: 'multiple_choice',
            prompt: 'Un programa tiene un 60% de instrucciones ALU (CPI = 1), 20% de memoria (CPI = 4) y 20% de saltos (CPI = 2). ¿Cuál es el CPI medio?',
            subPrompt: 'Calcula la media ponderada de ciclos por instrucción.',
            options: ['CPI = 1.8 ciclos', 'CPI = 2.4 ciclos', 'CPI = 2.0 ciclos', 'CPI = 1.5 ciclos'],
            correctIndex: 0,
            explanation: 'CPI_medio = (0.60 * 1) + (0.20 * 4) + (0.20 * 2) = 0.6 + 0.8 + 0.4 = 1.8 ciclos.',
            tip: 'Los accesos a memoria penalizan severamente el CPI medio si la frecuencia de accesos Load/Store es alta.',
          },
          {
            id: 'aoc-q2',
            type: 'true_false',
            prompt: '¿Es el indicador MIPS una medida universal y fiable para comparar procesadores con diferentes arquitecturas (ej. RISC vs CISC)?',
            statement: 'MIPS mide el rendimiento absoluto de cualquier procesador sin importar su ISA.',
            isTrue: false,
            explanation: 'FALSO: MIPS no tiene en cuenta que un procesador CISC (como x86) realiza más trabajo por instrucción que uno RISC (como MIPS o ARM). Una CPU con mayor MIPS puede tardar más tiempo real en ejecutar el mismo programa si requiere más instrucciones.',
            tip: 'En el examen de AOC siempre te pillan si dices que más MIPS significa mayor velocidad sin verificar el IC (Instruction Count).',
          },
          {
            id: 'aoc-q3',
            type: 'code_reorder',
            prompt: 'Ordena la ecuación del Tiempo de CPU a partir de sus 3 factores fundamentales:',
            tokens: ['PeriodoReloj', 'TiempoCPU', '=', 'NºInstrucciones', '×', 'CPI', '×'],
            correctSequence: ['TiempoCPU', '=', 'NºInstrucciones', '×', 'CPI', '×', 'PeriodoReloj'],
            explanation: 'T_CPU = IC × CPI × T_c (o dividido por la frecuencia f). Esta es la tríada de hierro del rendimiento.',
          },
          {
            id: 'aoc-q4',
            type: 'match_pairs',
            prompt: 'Empareja cada métrica con su definición exacta según el temario:',
            pairs: [
              { left: 'IC (Instruction Count)', right: 'Número de instrucciones ejecutadas' },
              { left: 'CPI', right: 'Ciclos medios consumidos por instrucción' },
              { left: 'Frecuencia (f)', right: 'Ciclos de reloj por segundo (Hz)' },
              { left: 'Amdahl', right: 'Límite de aceleración con fracciones fijas' },
            ],
            explanation: '¡Excelente! Estos 4 parámetros gobiernan toda la teoría del Tema 1 de AOC.',
          },
        ],
      },
      {
        id: 'aoc-u1-l2',
        title: 'Maestría en la Ley de Amdahl',
        subtitle: 'Fracción mejorable y aceleración máxima',
        unitId: 'aoc-unit-1',
        subjectId: 'aoc',
        xpReward: 25,
        gemReward: 10,
        questions: [
          {
            id: 'aoc-q5',
            type: 'multiple_choice',
            prompt: 'Queremos acelerar un servidor. La sección de renderizado ocupa el 75% del tiempo de ejecución. Si introducimos una GPU que hace ese renderizado 4 veces más rápido, ¿cuál es la aceleración global del sistema?',
            options: ['S = 2.29x', 'S = 3.00x', 'S = 1.78x', 'S = 4.00x'],
            correctIndex: 0,
            explanation: 'S = 1 / ((1 - 0.75) + (0.75 / 4)) = 1 / (0.25 + 0.1875) = 1 / 0.4375 ≈ 2.285x ≈ 2.29x.',
            tip: 'Fórmula rápida: El nuevo tiempo es T_nuevo = T_viejo * (0.25 + 0.75/4) = 0.4375 * T_viejo. Luego S = 1 / 0.4375.',
          },
          {
            id: 'aoc-q6',
            type: 'true_false',
            prompt: 'Si una parte del código que ocupa el 50% del tiempo se optimiza de forma ideal (aceleración infinita, tardando 0 segundos), ¿puede el sistema ser 3 veces más rápido?',
            statement: 'Una mejora infinita del 50% del código produce una aceleración mayor a 2x.',
            isTrue: false,
            explanation: 'FALSO: Si F_m = 0.5 y S_m → ∞, la aceleración límite teórica es 1 / (1 - 0.5) = 2x. Es físicamente imposible superar un factor de 2 si la mitad no se acelera.',
          },
        ],
      },
    ],
  },

  // ==========================================
  // ASIGNATURA: AOC (Segmentación y Riesgos de Pipeline)
  // ==========================================
  {
    id: 'aoc-unit-2',
    unitNumber: 2,
    title: 'Segmentación MIPS y Riesgos de Datos',
    description: 'Etapas IF, ID, EX, MEM, WB, riesgos RAW y adelantamiento (Forwarding).',
    color: 'from-blue-600 to-indigo-600',
    borderColor: 'border-blue-500',
    subjectId: 'aoc',
    guideBook: {
      title: 'Guía de Pipeline: 5 Etapas y Riesgos RAW',
      keyPoints: [
        'Las 5 etapas clásicas de MIPS son: IF (Fetch), ID (Decode/RegRead), EX (Execute/ALU), MEM (Memory Access), WB (Write Back a Registros).',
        'En MIPS, los registros se escriben en la primera mitad del ciclo WB y se leen en la segunda mitad del ciclo ID.',
        'Un riesgo RAW (Read After Write) ocurre cuando una instrucción necesita leer un registro antes de que la instrucción previa lo haya escrito.',
        'El adelantamiento (Forwarding) envía el dato desde las salidas de los registros intermedios EX/MEM o MEM/WB directamente a las entradas de la ALU sin esperar a WB.',
        'La única dependencia que exige parada obligatoria (1 ciclo stall) con forwarding es Load-Use: un lw seguido inmediatamente de una instrucción que consume su dato.',
      ],
      commonMistakes: [
        'Creer que el forwarding elimina todas las paradas: entre un LW y una instrucción dependiente siempre queda 1 ciclo de burbuja obligatorio.',
        'Olvidar el branch delay slot en arquitecturas MIPS: la instrucción que sigue a un salto siempre se ejecuta.',
      ],
      essentialFormula: 'Latencia = 5 ciclos | Rendimiento ideal: 1 instrucción completada por ciclo (CPI = 1)',
    },
    lessons: [
      {
        id: 'aoc-u2-l1',
        title: 'Las 5 Etapas del Cauce MIPS',
        subtitle: 'Flujo secuencial de instrucciones',
        unitId: 'aoc-unit-2',
        subjectId: 'aoc',
        xpReward: 20,
        gemReward: 5,
        questions: [
          {
            id: 'aoc-p1',
            type: 'code_reorder',
            prompt: 'Ordena cronológicamente las 5 etapas del cauce segmentado clásico de MIPS:',
            tokens: ['MEM', 'ID', 'IF', 'WB', 'EX'],
            correctSequence: ['IF', 'ID', 'EX', 'MEM', 'WB'],
            explanation: '1. IF (Búsqueda de instrucción) -> 2. ID (Decodificación y lectura de registros) -> 3. EX (Ejecución ALU) -> 4. MEM (Acceso a memoria) -> 5. WB (Escritura en banco de registros).',
          },
          {
            id: 'aoc-p2',
            type: 'multiple_choice',
            prompt: '¿En qué etapa de MIPS se calcula la dirección efectiva de memoria para una instrucción SW (Store Word)?',
            options: ['Etapa EX (mediante el sumador de la ALU)', 'Etapa MEM (en la propia memoria RAM)', 'Etapa ID (durante la decodificación)', 'Etapa WB (al escribir el resultado)'],
            correctIndex: 0,
            explanation: 'La dirección efectiva (Registro Base + Inmediato con signo) se suma en la etapa EX usando la ALU del procesador.',
            tip: 'Tanto LW como SW calculan su dirección en la etapa EX; pero sólo LW lee en MEM y sólo SW escribe en MEM.',
          },
          {
            id: 'aoc-p3',
            type: 'true_false',
            prompt: '¿La segmentación reduce el tiempo de ejecución individual (latencia) de cada instrucción?',
            statement: 'La segmentación hace que una instrucción individual tarde menos nanosegundos en completarse.',
            isTrue: false,
            explanation: 'FALSO: La segmentación aumenta el throughput (caudal de instrucciones por segundo), pero cada instrucción individual tarda igual o un poco más debido a la sobrecarga de los biestables/registros intermedios.',
          },
        ],
      },
      {
        id: 'aoc-u2-l2',
        title: 'Riesgos RAW y Forwarding',
        subtitle: 'Detectar colisiones y paradas Load-Use',
        unitId: 'aoc-unit-2',
        subjectId: 'aoc',
        xpReward: 25,
        gemReward: 10,
        questions: [
          {
            id: 'aoc-p4',
            type: 'multiple_choice',
            prompt: 'Considera el siguiente código MIPS en un cauce CON adelantamiento (Forwarding):\n1: lw $s0, 0($t1)\n2: add $t2, $s0, $t3\n¿Cuántos ciclos de parada (stalls) introduce el procesador?',
            options: ['1 ciclo de parada (burbuja)', '0 ciclos (el forwarding lo resuelve en el mismo ciclo)', '2 ciclos de parada', '3 ciclos de parada'],
            correctIndex: 0,
            explanation: 'El dato de LW no está disponible hasta el final de la etapa MEM (ciclo 4). La instrucción ADD necesita el dato para su etapa EX en el ciclo 3. Por tanto, se necesita obligatoriamente 1 ciclo de stall para que el dato llegue desde MEM/WB hasta EX.',
            tip: 'Esta es la pregunta estrella de los parciales de la FIUM: "Dependencia Load-Use con forwarding = 1 burbuja".',
          },
          {
            id: 'aoc-p5',
            type: 'match_pairs',
            prompt: 'Empareja cada tipo de riesgo con su técnica de mitigación estándar:',
            pairs: [
              { left: 'Riesgo Estructural', right: 'Memorias Harvard separadas (I-Cache y D-Cache)' },
              { left: 'Riesgo de Datos RAW (ALU-ALU)', right: 'Adelantamiento (Forwarding) desde EX/MEM' },
              { left: 'Riesgo de Control (Saltos)', right: 'Predicción de saltos y Branch Delay Slot' },
              { left: 'Riesgo Load-Use', right: '1 ciclo de parada (stall) obligatorio' },
            ],
            explanation: '¡Exacto! El compilador y el hardware combinan estas técnicas para mantener el cauce lo más lleno posible.',
          },
        ],
      },
    ],
  },

  // ==========================================
  // ASIGNATURA: ASO (Ampliación de Sistemas Operativos)
  // ==========================================
  {
    id: 'aso-unit-1',
    unitNumber: 1,
    title: 'Llamadas al Sistema POSIX y Procesos',
    description: 'Bifurcaciones con fork(), execve(), manejo de señales y espacio de memoria.',
    color: 'from-emerald-600 to-teal-600',
    borderColor: 'border-emerald-500',
    subjectId: 'aso',
    guideBook: {
      title: 'Guía ASO: fork, exec, señales y copy-on-write',
      keyPoints: [
        'fork() clona el proceso llamante. Devuelve 0 al proceso hijo, el PID del hijo al padre, o -1 en caso de error.',
        'En Linux, fork() utiliza Copy-on-Write (CoW): las páginas de memoria no se duplican físicamente hasta que uno de los dos procesos escribe en ellas.',
        'execve() reemplaza completamente la imagen de memoria del proceso actual por el nuevo binario. Si tiene éxito, NO RETORNA NUNCA.',
        'waitpid() bloquea al padre hasta que el hijo cambia de estado, evitando procesos Zombie.',
      ],
      commonMistakes: [
        'Creer que el código posterior a un execve() exitoso se ejecutará alguna vez. Si ves código tras execve() sólo se ejecuta en caso de fallo (retorno -1).',
        'Confundir un proceso Zombie (terminó pero su padre no hizo wait()) con un proceso Huérfano (su padre murió y es adoptado por init / systemd).',
      ],
      essentialFormula: 'PID_hijo = fork(); if (PID_hijo == 0) { execve(...); } else { waitpid(PID_hijo); }',
    },
    lessons: [
      {
        id: 'aso-u1-l1',
        title: 'Mecánica de fork() y Retorno',
        subtitle: 'Doble retorno y bifurcación de flujo',
        unitId: 'aso-unit-1',
        subjectId: 'aso',
        xpReward: 20,
        gemReward: 5,
        questions: [
          {
            id: 'aso-q1',
            type: 'multiple_choice',
            prompt: '¿Qué devuelve la llamada al sistema fork() en el proceso hijo cuando se ejecuta con éxito?',
            options: ['Devuelve exactamente 0', 'Devuelve el PID del padre (PPID)', 'Devuelve su propio PID', 'Devuelve 1'],
            correctIndex: 0,
            explanation: 'fork() devuelve 0 al proceso recién creado (hijo), y devuelve el PID positivo del hijo al proceso padre.',
            tip: 'Si fork() devuelve un valor menor que 0 (-1), significa que ocurrió un error y no se pudo crear el proceso (ej. límite de procesos alcanzado).',
          },
          {
            id: 'aso-q2',
            type: 'multiple_choice',
            prompt: 'Observa este fragmento de C:\nint x = 10;\nif (fork() == 0) {\n    x += 5;\n} else {\n    wait(NULL);\n    x += 10;\n}\nprintf("%d", x);\n¿Qué imprime el proceso padre?',
            options: ['20', '25', '15', '10'],
            correctIndex: 0,
            explanation: 'Debido a la protección de memoria y Copy-On-Write, los procesos padre e hijo tienen espacios de direcciones aislados e independientes. El padre conserva su x original (10) y le suma 10 = 20. La modificación del hijo (x=15) nunca afecta al padre.',
          },
          {
            id: 'aso-q3',
            type: 'true_false',
            prompt: '¿Qué sucede si una llamada execve() se ejecuta con éxito en un proceso hijo?',
            statement: 'El proceso vuelve a la siguiente línea de código tras el execve() para continuar su bucle.',
            isTrue: false,
            explanation: 'FALSO: execve() sobreescribe por completo el mapa de memoria del proceso (código, datos, pila y montículo) con el nuevo programa ejecutable. Si tiene éxito, no retorna jamás.',
          },
        ],
      },
    ],
  },
  {
    id: 'aso-unit-2',
    unitNumber: 2,
    title: 'Memoria Virtual y Paginación Multinivel',
    description: 'Direcciones lógicas, CR3, TLB, Page Faults y algoritmos de reemplazo.',
    color: 'from-violet-600 to-purple-600',
    borderColor: 'border-violet-500',
    subjectId: 'aso',
    guideBook: {
      title: 'Guía ASO: Tablas de Páginas x86_64 y Reemplazo',
      keyPoints: [
        'En x86_64 se usa paginación de 4 niveles (PGD, PUD, PMD, PTE) con páginas base de 4 KB (12 bits de desplazamiento).',
        'El registro CR3 del procesador almacena la dirección física base de la tabla de primer nivel del proceso en ejecución.',
        'La TLB (Translation Lookaside Buffer) es una caché asociativa en la MMU que acelera la traducción de direcciones virtuales a físicas.',
        'Un Page Fault (Fallo de Página) se genera por la MMU cuando el bit Present de la PTE es 0; el kernel interrumpe y carga la página desde disco (swap).',
        'El algoritmo de Reloj (Segunda Oportunidad) utiliza el bit de Referencia (A = Accessed). Si A=1, lo pone a 0 y avanza el puntero.',
      ],
      commonMistakes: [
        'Confundir fallo de página (página válida en disco, se recupera con I/O) con Segmentation Fault (acceso a dirección virtual no mapeada o violación de permisos W/X).',
      ],
      essentialFormula: '48 bits = 9 (PGD) + 9 (PUD) + 9 (PMD) + 9 (PTE) + 12 (Offset)',
    },
    lessons: [
      {
        id: 'aso-u2-l1',
        title: 'Estructura de Páginas de 4 Niveles',
        subtitle: 'Jerarquía de tablas y registro CR3',
        unitId: 'aso-unit-2',
        subjectId: 'aso',
        xpReward: 25,
        gemReward: 10,
        questions: [
          {
            id: 'aso-m1',
            type: 'multiple_choice',
            prompt: 'En una arquitectura con páginas de 4 KB (2^12 bytes), ¿cuántos bits se necesitan para el campo Desplazamiento (Offset)?',
            options: ['12 bits', '10 bits', '16 bits', '8 bits'],
            correctIndex: 0,
            explanation: 'Como 4 KB = 4096 bytes = 2^12 bytes, se requieren exactamente 12 bits de offset para indexar byte a byte dentro del marco de página.',
            tip: 'Los 12 bits menos significativos de cualquier dirección virtual en x86 coinciden exactamente con los 12 bits menos significativos de la dirección física (no se traducen).',
          },
          {
            id: 'aso-m2',
            type: 'match_pairs',
            prompt: 'Empareja los componentes del subsistema de memoria virtual de Linux:',
            pairs: [
              { left: 'Registro CR3', right: 'Dirección física de la tabla PGD' },
              { left: 'Bit Present', right: 'Indica si el marco está en memoria física RAM' },
              { left: 'TLB', right: 'Caché de traducción de páginas en la MMU' },
              { left: 'Page Fault', right: 'Excepción de hardware por página ausente en RAM' },
            ],
            explanation: '¡Perfecto! Estos 4 conceptos constituyen la mitad de las preguntas teóricas del examen de ASO.',
          },
          {
            id: 'aso-m3',
            type: 'multiple_choice',
            prompt: 'En el algoritmo de reemplazo de páginas de Reloj (Segunda Oportunidad), ¿qué hace el algoritmo al encontrar un marco con el bit de referencia A = 1?',
            options: ['Cambia el bit A a 0 y avanza la aguja al siguiente marco', 'Expulsa inmediatamente ese marco a swap', 'Duplica la prioridad del marco en memoria', 'Genera un error de protección en el kernel'],
            correctIndex: 0,
            explanation: 'Le da una "segunda oportunidad": pone el bit de acceso en 0 y continúa buscando un marco con A = 0 para reemplazar.',
          },
        ],
      },
    ],
  },

  // ==========================================
  // ASIGNATURA: ALF (Autómatas y Lenguajes Formales)
  // ==========================================
  {
    id: 'alf-unit-1',
    unitNumber: 1,
    title: 'Autómatas Finitos Deterministas (DFA)',
    description: 'Definición formal de quintupla, delta extendida y reconocimiento de cadenas.',
    color: 'from-pink-600 to-rose-600',
    borderColor: 'border-pink-500',
    subjectId: 'alf',
    guideBook: {
      title: 'Guía ALF: Autómatas Finitos & Expresiones Regulares',
      keyPoints: [
        'Un DFA es una 5-tupla M = (Q, Σ, δ, q0, F), donde δ: Q × Σ → Q es una función total.',
        'La función de transición extendida δ*(q, w) procesa una cadena símbolo a símbolo de izquierda a derecha.',
        'Una cadena w es aceptada por el autómata si δ*(q0, w) ∈ F (estado final de aceptación).',
        'Un lenguaje es Regular si y sólo si es aceptado por algún autómata finito (DFA o NFA) o generado por una expresión regular (Teorema de Kleene).',
      ],
      commonMistakes: [
        'Olvidar que en un DFA, desde CADA estado debe salir exactamente UNA transición para cada símbolo del alfabeto Σ.',
        'Creer que el lenguaje L = {a^n b^n | n >= 0} es regular. Requiere memoria infinita (una pila) y por tanto viola el Lema del Bombeo.',
      ],
      essentialFormula: 'L(M) = { w in Sigma* | delta*(q_0, w) in F }',
    },
    lessons: [
      {
        id: 'alf-u1-l1',
        title: 'Elementos del DFA y Estados de Aceptación',
        subtitle: 'Formalismo y función delta',
        unitId: 'alf-unit-1',
        subjectId: 'alf',
        xpReward: 20,
        gemReward: 5,
        questions: [
          {
            id: 'alf-q1',
            type: 'multiple_choice',
            prompt: 'En la definición formal de un Autómata Finito Determinista (DFA), ¿qué representa el conjunto F?',
            options: ['Conjunto de estados finales o de aceptación (F ⊆ Q)', 'El alfabeto de entrada del autómata', 'La función de transición de estados', 'El estado inicial de arranque'],
            correctIndex: 0,
            explanation: 'F (Final states) es un subconjunto de Q que define qué estados determinan que la palabra introducida pertenece al lenguaje formal.',
            tip: 'Un autómata puede tener F vacío (F = ∅); en tal caso, su lenguaje reconocido es el lenguaje vacío L = ∅.',
          },
          {
            id: 'alf-q2',
            type: 'true_false',
            prompt: '¿Es el lenguaje L = { 0^n 1^n | n ≥ 0 } un lenguaje regular reconocible por un Autómata Finito?',
            statement: 'El lenguaje 0^n 1^n puede ser reconocido por un DFA con un número finito de estados.',
            isTrue: false,
            explanation: 'FALSO: Un DFA sólo tiene un número finito de estados y no puede recordar un número arbitrariamente grande n de ceros para contrastarlo con el número de unos. Se demuestra no regular mediante el Lema del Bombeo (Pumping Lemma).',
            tip: 'Esta pregunta aparece en el 90% de los exámenes de junio de ALF.',
          },
          {
            id: 'alf-q3',
            type: 'match_pairs',
            prompt: 'Empareja cada clase de la Jerarquía de Chomsky con su autómata reconocedor:',
            pairs: [
              { left: 'Lenguaje Regular (Tipo 3)', right: 'Autómata Finito (DFA / NFA)' },
              { left: 'Lenguaje Libre de Contexto (Tipo 2)', right: 'Autómata con Pila (PDA)' },
              { left: 'Lenguaje Recursivamente Enumerable (Tipo 0)', right: 'Máquina de Turing' },
            ],
            explanation: '¡Gran trabajo! La jerarquía de Chomsky estructura toda la asignatura de ALF.',
          },
        ],
      },
    ],
  },

  // ==========================================
  // ASIGNATURA: TDS (Tecnologías de Desarrollo de Software)
  // ==========================================
  {
    id: 'tds-unit-1',
    unitNumber: 1,
    title: 'Principios SOLID y Clean Code',
    description: 'Responsabilidad Única, Inversión de Dependencias y desacoplamiento en Java/TypeScript.',
    color: 'from-cyan-600 to-blue-600',
    borderColor: 'border-cyan-500',
    subjectId: 'tds',
    guideBook: {
      title: 'Guía TDS: Los 5 Principios SOLID',
      keyPoints: [
        'SRP (Single Responsibility): Una clase debe tener una única razón para cambiar.',
        'OCP (Open/Closed): Las clases deben estar abiertas a la extensión pero cerradas a la modificación.',
        'LSP (Liskov Substitution): Los subtipos deben poder sustituir a sus tipos base sin alterar la corrección del programa.',
        'ISP (Interface Segregation): Los clientes no deben verse obligados a depender de métodos de interfaz que no utilizan.',
        'DIP (Dependency Inversion): Los módulos de alto nivel no deben depender de los de bajo nivel; ambos deben depender de abstracciones.',
      ],
      commonMistakes: [
        'Hacer new ServicioConcreto() dentro del constructor de un controlador viola DIP directamente. Debe inyectarse la interfaz Servicio por constructor.',
        'Hacer que la subclase lance UnsupportedOperationException viola el principio de Liskov (LSP).',
      ],
      essentialFormula: 'S - Single Responsibility | O - Open/Closed | L - Liskov | I - Interface Segregation | D - Dependency Inversion',
    },
    lessons: [
      {
        id: 'tds-u1-l1',
        title: 'Inversión de Dependencias (DIP) y SRP',
        subtitle: 'Inyección de dependencias e interfaces limpias',
        unitId: 'tds-unit-1',
        subjectId: 'tds',
        xpReward: 20,
        gemReward: 5,
        questions: [
          {
            id: 'tds-q1',
            type: 'multiple_choice',
            prompt: 'En una aplicación bancaria, una clase GestorTransferencias crea directamente una instancia `new MySQLDatabaseConnection()` en su constructor. ¿Qué principio SOLID está violando gravemente?',
            options: ['DIP (Principio de Inversión de Dependencias)', 'LSP (Principio de Sustitución de Liskov)', 'ISP (Segregación de Interfaces)', 'Ley de Demeter'],
            correctIndex: 0,
            explanation: 'Viola DIP: GestorTransferencias (módulo de alto nivel con lógica de negocio) está fuertemente acoplado a una implementación concreta de base de datos MySQL (módulo de bajo nivel). Debe depender de una interfaz abstracta IDatabase.',
            tip: 'En el proyecto y exámenes de TDS, cualquier `new` de una clase de infraestructura dentro de un servicio de dominio es penalizado como violación de DIP.',
          },
          {
            id: 'tds-q2',
            type: 'true_false',
            prompt: 'Si una clase Cuadrado hereda de Rectángulo pero sobreescribe setAncho(w) obligando a que setAlto(w) también cambie, ¿se respeta el principio de Liskov (LSP)?',
            statement: 'Cuadrado es un sustituto válido y transparente de Rectángulo en cualquier contexto.',
            isTrue: false,
            explanation: 'FALSO: Si un cliente invoca r.setAncho(5) y luego r.setAlto(10), esperará que el área sea 50. Con Cuadrado el área resultará 100, rompiendo las postcondiciones asumidas por el cliente y violando LSP.',
          },
          {
            id: 'tds-q3',
            type: 'match_pairs',
            prompt: 'Empareja cada patrón GoF con su propósito fundamental:',
            pairs: [
              { left: 'Factory Method', right: 'Delega la instanciación de objetos en subclases' },
              { left: 'Strategy', right: 'Permite intercambiar algoritmos en tiempo de ejecución' },
              { left: 'Observer', right: 'Notificación 1-a-N de cambios de estado entre objetos' },
              { left: 'Decorator', right: 'Añade responsabilidades dinámicamente sin modificar la clase' },
            ],
            explanation: '¡Excelente! Estos son los 4 patrones de diseño más preguntados en las prácticas y parciales de TDS.',
          },
        ],
      },
    ],
  },
];
