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

  // ==========================================
  // ASIGNATURA: AOC (Unidad 3: Superescalar & Tomasulo) - Sugerencia de Carlos
  // ==========================================
  {
    id: 'aoc-unit-3',
    unitNumber: 3,
    title: 'Procesadores Superescalares y Tomasulo con ROB',
    description: 'Ejecución fuera de orden, renombramiento de registros y confirmación en orden.',
    color: 'from-blue-700 to-indigo-800',
    borderColor: 'border-blue-600',
    subjectId: 'aoc',
    guideBook: {
      title: 'Guía Superescalar: Tomasulo, ROB y Fases F-I-X-W-C',
      keyPoints: [
        'En emisión múltiple (Superescalar), el procesador despacha 2 o más instrucciones por ciclo de reloj.',
        'Las falsas dependencias WAR y WAW surgen únicamente por escasez de nombres en el banco de registros lógicos; el Renombramiento de Registros las elimina por completo.',
        'El Reorder Buffer (ROB) almacena los resultados de forma especulativa y garantiza confirmación (Commit) en orden secuencial para soportar excepciones precisas.',
      ],
      commonMistakes: [
        'Pensar que una instrucción puede hacer Commit fuera de orden; SOLO la etapa X (Ejecución) y W (Writeback) son fuera de orden. F, I y C son siempre en orden.',
      ],
      essentialFormula: 'Etapas: F (Fetch) -> I (Issue/Rename) -> X (Exec fuera de orden) -> W (Writeback CDB) -> C (Commit en orden)',
    },
    lessons: [
      {
        id: 'aoc-u3-l1',
        title: 'Fases del Procesador Superescalar',
        subtitle: 'F, I, X, W, C y el Bus Común CDB',
        unitId: 'aoc-unit-3',
        subjectId: 'aoc',
        xpReward: 25,
        gemReward: 10,
        questions: [
          {
            id: 'aoc-tomasulo-q1',
            type: 'multiple_choice',
            prompt: 'En el algoritmo de Tomasulo con Reorder Buffer (ROB), ¿en qué etapa se liberan definitivamente los registros lógicos y se escriben los datos en memoria?',
            options: ['Etapa C (Commit / Confirmación)', 'Etapa W (Writeback a las Estaciones de Reserva)', 'Etapa X (Ejecución ALU)', 'Etapa I (Issue)'],
            correctIndex: 0,
            explanation: 'En la etapa Commit, las instrucciones se confirman en estricto orden de programa. Los Stores a memoria y las actualizaciones del banco de registros visible solo ocurren aquí.',
            tip: 'Esto garantiza que si ocurre una excepción (ej. división por cero o fallo de página), el estado del procesador sea idéntico al de una ejecución puramente secuencial (excepción precisa).'
          },
          {
            id: 'aoc-tomasulo-q2',
            type: 'true_false',
            prompt: '¿Puede el renombramiento de registros eliminar las verdaderas dependencias de datos RAW (Read After Write)?',
            statement: 'El renombramiento de registros elimina tanto las dependencias RAW como las WAR y WAW.',
            isTrue: false,
            explanation: 'FALSO: Una dependencia RAW es una dependencia de flujo real: el consumidor NECESITA el dato que produce el productor. Ningún renombramiento puede eliminar la necesidad del dato; solo elimina las dependencias de nombre (WAR y WAW).',
          }
        ]
      }
    ]
  },

  // ==========================================
  // ASIGNATURA: ASO (Unidad 3: FDT, OFT, Señales & Kernel) - Sugerencia de Lucía
  // ==========================================
  {
    id: 'aso-unit-3',
    unitNumber: 3,
    title: 'Descriptores FDT/OFT y Señales en Linux',
    description: 'Estructuras de ficheros en el kernel, duplicación de descriptores y entrega de señales.',
    color: 'from-teal-600 to-emerald-700',
    borderColor: 'border-teal-500',
    subjectId: 'aso',
    guideBook: {
      title: 'Guía de Kernel ASO: FDT, OFT y Señales POSIX',
      keyPoints: [
        'FDT (File Descriptor Table): privada de cada proceso (índice 0, 1, 2...).',
        'OFT (Open File Table): compartida en el kernel, guarda el offset actual y el modo de acceso.',
        'dup(fd) y fork() duplican el puntero hacia la MISMA entrada de la OFT (comparten offset).',
        'open() sobre el mismo fichero crea una NUEVA entrada en la OFT (offsets independientes).',
        'Las señales estándar POSIX no se encolan; son un simple bit en SigPnd (coalescencia).',
      ],
      commonMistakes: [
        'Creer que dos procesos que abren el mismo fichero con open() comparten el offset de lectura/escritura: ¡falso, cada open tiene su propio offset!',
      ],
      essentialFormula: 'dup() / fork() -> MISMA entrada en OFT | open() -> NUEVA entrada en OFT con offset a 0',
    },
    lessons: [
      {
        id: 'aso-u3-l1',
        title: 'Descriptores y la Tabla OFT del Kernel',
        subtitle: 'El clásico ejercicio del examen de DITEC',
        unitId: 'aso-unit-3',
        subjectId: 'aso',
        xpReward: 25,
        gemReward: 10,
        questions: [
          {
            id: 'aso-q-oft-sharing',
            type: 'multiple_choice',
            prompt: 'Un programa ejecuta:\nint fd1 = open("f.txt", O_RDWR|O_CREAT|O_TRUNC, 0644);\nwrite(fd1, "HOLA", 4);\nint fd2 = dup(fd1);\nint fd3 = open("f.txt", O_RDWR);\nwrite(fd2, "MUNDO", 5);\nwrite(fd3, "ZZ", 2);\n¿Cuál es el contenido final del fichero "f.txt"?',
            options: ['ZZLAMUNDO', 'HOLAMUNDOZZ', 'ZZNDO', 'HZMUNDO'],
            correctIndex: 0,
            explanation: '¡Clásico examen DITEC! fd1 y fd2 apuntan a la MISMA entrada en la OFT, compartiendo offset (4 tras "HOLA", 9 tras "MUNDO"). fd3 abrió el fichero de nuevo de forma independiente con offset 0: al escribir "ZZ", sobreescribe los bytes 0 y 1 ("HO"), quedando "ZZLAMUNDO".',
            tip: 'Regla de oro: fork() y dup() comparten entrada en OFT (mismo offset). open() crea una entrada nueva en OFT con offset independiente a 0.',
          },
          {
            id: 'aso-q-signals-coalesce',
            type: 'true_false',
            prompt: 'Si un proceso bloquea SIGUSR1 con sigprocmask(), recibe la señal SIGUSR1 5 veces de procesos externos, y luego desbloquea la señal, ¿se invocará el manejador de SIGUSR1 exactamente 5 veces?',
            statement: 'Las señales estándar POSIX se encolan acumulativamente en el kernel.',
            isTrue: false,
            explanation: 'FALSO: Las señales estándar de Linux NO se encolan. El kernel únicamente marca un bit en el vector de pendientes (SigPnd). Múltiples envíos se fusionan (coalescencia) en una única entrega al desbloquear.',
          },
          {
            id: 'aso-q-zombie-orphan',
            type: 'match_pairs',
            prompt: 'Empareja cada estado de proceso con su tratamiento exacto en el kernel de Linux:',
            pairs: [
              { left: 'Proceso Zombie', right: 'Terminó pero el padre no ha hecho waitpid(); ocupa entrada en PCB' },
              { left: 'Proceso Huérfano', right: 'Su padre murió antes; es adoptado por init/systemd (PID 1)' },
              { left: 'Señal SIGCHLD', right: 'Notificación asíncrona enviada al padre cuando un hijo concluye' },
              { left: 'Opción WNOHANG', right: 'Permite consultar el estado del hijo sin bloquear al padre' },
            ],
            explanation: 'Dominar la diferencia entre Zombie (recursos de memoria liberados, retiene PCB para status) y Huérfano (re-parented) es vital en ASO.',
          },
        ],
      },
    ],
  },

  // ==========================================
  // ASIGNATURA: TDS (Unidad 2: GoF Avanzado & TDD) - Sugerencia de Marcos
  // ==========================================
  {
    id: 'tds-unit-2',
    unitNumber: 2,
    title: 'Patrones GoF y Testing con Mockito',
    description: 'Factory con Lambdas, Decorator, Adapter y pruebas unitarias aisladas en JUnit 5.',
    color: 'from-blue-600 to-cyan-700',
    borderColor: 'border-blue-500',
    subjectId: 'tds',
    guideBook: {
      title: 'Guía TDS: Patrones Estructurales & Mockito',
      keyPoints: [
        'El patrón Factory con Java 8 se simplifica con `Map<String, Supplier<T>>` eliminando switch-cases.',
        'El patrón Decorator envuelve un objeto añadiendo comportamiento dinámico con la misma interfaz (ej. Streams en Java I/O).',
        'En Mockito: NUNCA se mockea el SUT (System Under Test); solo sus dependencias colaboradoras.',
      ],
      commonMistakes: [
        'Hacer new de la clase probada como mock. Si quieres testear ServicioGastos, haces `new ServicioGastos(repoMock)`.',
      ],
      essentialFormula: 'Target (interfaz esperada) <-> Adapter (adaptador) <-> Adaptee (clase existente)',
    },
    lessons: [
      {
        id: 'tds-u2-l1',
        title: 'Factory con Lambdas y Mockito',
        subtitle: 'Pruebas unitarias sin efectos colaterales',
        unitId: 'tds-unit-2',
        subjectId: 'tds',
        xpReward: 25,
        gemReward: 10,
        questions: [
          {
            id: 'tds-q-factory-lambda',
            type: 'multiple_choice',
            prompt: 'En el patrón Factoría moderno en Java 8+, ¿cuál es la mejor forma de eliminar sentencias switch al registrar nuevos tipos dinámicamente?',
            options: [
              'Map<String, Supplier<Producto>> asociando nombres con referencias a constructores (ProductoConcreto::new)',
              'Usar múltiples sentencias if-else encadenadas en el constructor',
              'Hacer que la interfaz Producto herede de Cloneable',
              'Instanciar siempre mediante reflexión bruta usando cadenas de texto en un fichero properties'
            ],
            correctIndex: 0,
            explanation: 'Usar un mapa con Supplier<Producto> permite cumplir OCP de forma limpia: nuevos productos se registran con map.put("TIPO", TipoProducto::new) sin tocar el código de la factoría.',
            tip: 'En el Tema 4 de TDS (Creación, slide 79), los profesores explican este mecanismo moderno para evitar el antipatrón del switch infinito.'
          },
          {
            id: 'tds-q-mockito-sut',
            type: 'true_false',
            prompt: 'En un test unitario con JUnit y Mockito de la clase ServicioGastos, ¿debemos crear un mock de ServicioGastos?',
            statement: 'Para testear ServicioGastos con Mockito se debe invocar Mockito.mock(ServicioGastos.class).',
            isTrue: false,
            explanation: 'FALSO: El objeto que estás testeando (SUT, System Under Test) debe instanciarse REALMENTE con new. Los únicos que se mockean con Mockito son sus colaboradores externos (ej. RepositorioGastos repoMock = mock(RepositorioGastos.class)).',
          },
          {
            id: 'tds-q-tdd-cycle',
            type: 'code_reorder',
            prompt: 'Ordena cronológicamente las 3 fases del ciclo TDD (Test-Driven Development):',
            tokens: ['3. Refactorizar código y tests', '1. Escribir test que falle (Rojo)', '2. Escribir código mínimo que pase el test (Verde)'],
            correctSequence: ['1. Escribir test que falle (Rojo)', '2. Escribir código mínimo que pase el test (Verde)', '3. Refactorizar código y tests'],
            explanation: 'Ciclo Red-Green-Refactor: primero el test falla (garantiza que prueba algo nuevo), luego se implementa lo mínimo para pasar, y finalmente se pule la arquitectura.',
          }
        ]
      }
    ]
  },

  // ==========================================
  // ASIGNATURA: ISO (Introducción a los Sistemas Operativos) - Sugerencia de Javier
  // ==========================================
  {
    id: 'iso-unit-1',
    unitNumber: 1,
    title: 'Planificación de CPU y Algoritmos de Gantt',
    description: 'Round Robin, FCFS, SJF no apropiativo vs SRTF y cálculo de tiempos de espera.',
    color: 'from-amber-600 to-yellow-600',
    borderColor: 'border-amber-500',
    subjectId: 'iso',
    guideBook: {
      title: 'Guía de Planificación ISO: Round Robin y Tiempos Medios',
      keyPoints: [
        'Tiempo de Retorno (Turnaround): Finalización - Llegada.',
        'Tiempo de Espera (Wait Time): Retorno - Ráfaga de CPU real.',
        'Round Robin reparte la CPU en rodajas de tiempo de tamaño q (quantum). Si un proceso no termina en q, vuelve a la cola de listos.',
        'SJF es óptimo en tiempo medio de espera, pero sufre de inanición (starvation) para procesos con ráfagas largas.',
      ],
      commonMistakes: [
        'En Round Robin, olvidar que cuando un proceso agota su quantum en el instante t y otro nuevo llega en t, el nuevo tiene preferencia para entrar a la cola.',
      ],
      essentialFormula: 'T_retorno = T_fin - T_llegada | T_espera = T_retorno - Ráfaga',
    },
    lessons: [
      {
        id: 'iso-u1-l1',
        title: 'Mecánica de Round Robin y Tiempos de Espera',
        subtitle: 'Diagramas de Gantt sin errores de cálculo',
        unitId: 'iso-unit-1',
        subjectId: 'iso',
        xpReward: 20,
        gemReward: 5,
        questions: [
          {
            id: 'iso-q1',
            type: 'multiple_choice',
            prompt: 'Tres procesos P1 (ráfaga 6), P2 (ráfaga 4) y P3 (ráfaga 2) llegan simultáneamente en t=0. Se planifican con Round Robin (quantum q = 2). ¿En qué instante finaliza P3?',
            options: ['En t = 6', 'En t = 2', 'En t = 4', 'En t = 12'],
            correctIndex: 0,
            explanation: 'Gantt: P1 ejecuta [0-2] (le quedan 4). P2 ejecuta [2-4] (le quedan 2). P3 ejecuta [4-6] (consume sus 2 unidades y FINALIZA en t=6).',
            tip: 'Dibuja siempre la cola de listos circular en sucio antes de responder preguntas de tiempo de finalización en ISO.'
          },
          {
            id: 'iso-q2',
            type: 'true_false',
            prompt: '¿Qué ocurre con el algoritmo Round Robin si el tamaño del quantum q se hace infinitamente grande (q -> ∞)?',
            statement: 'Un Round Robin con quantum infinito se comporta de forma idéntica al algoritmo FCFS (First-Come, First-Served).',
            isTrue: true,
            explanation: 'VERDADERO: Si el quantum supera la ráfaga de cualquier proceso, ningún proceso será expulsado antes de terminar su ráfaga, ejecutándose estrictamente en orden de llegada (FCFS).',
          }
        ]
      }
    ]
  },
  {
    id: 'iso-unit-2',
    unitNumber: 2,
    title: 'Sistemas de Ficheros e Inodos de Disco',
    description: 'Punteros directos, indirectos simples, dobles y triples para cálculo de capacidad máxima.',
    color: 'from-orange-600 to-amber-700',
    borderColor: 'border-orange-500',
    subjectId: 'iso',
    guideBook: {
      title: 'Guía de Ficheros ISO: Cálculo de Capacidad Máxima de un Inodo',
      keyPoints: [
        'Un inodo estándar de tipo UNIX contiene 12 punteros directos, 1 puntero indirecto simple, 1 indirecto doble y 1 indirecto triple.',
        'Punteros por bloque = Tamaño del Bloque / Tamaño del Puntero (ej. 4 KB / 4 B = 1024 punteros).',
        'Los punteros directos apuntan a bloques de datos. Los indirectos apuntan a bloques de punteros.',
      ],
      commonMistakes: [
        'Confundir KB con KiB o multiplicar por 1000 en vez de 1024 en el cálculo de bytes en disco.',
      ],
      essentialFormula: 'TamMax = (N_dir + P_bloque + P_bloque^2 + P_bloque^3) * TamBloque',
    },
    lessons: [
      {
        id: 'iso-u2-l1',
        title: 'Cálculo de Inodos en Examen',
        subtitle: 'Capacidad de direccionamiento en disco',
        unitId: 'iso-unit-2',
        subjectId: 'iso',
        xpReward: 25,
        gemReward: 10,
        questions: [
          {
            id: 'iso-q3',
            type: 'multiple_choice',
            prompt: 'En un sistema de ficheros tipo ext2 con bloques de 4 KB y punteros de bloque de 4 bytes, ¿cuántos punteros caben en un bloque de indirección simple?',
            options: ['1024 punteros', '4096 punteros', '512 punteros', '256 punteros'],
            correctIndex: 0,
            explanation: '4 KB = 4096 bytes. Si cada puntero ocupa 4 bytes: 4096 / 4 = 1024 punteros a bloques de datos (lo que permite direccionar 1024 * 4 KB = 4 MB con una sola indirección simple).',
            tip: 'Pregunta fija de examen de ISO en la FIUM: "Punteros por bloque = Bloque / Puntero".'
          }
        ]
      }
    ]
  },

  // ==========================================
  // ASIGNATURA: AC (Aprendizaje Computacional) - Sugerencia de Laura
  // ==========================================
  {
    id: 'ac-unit-1',
    unitNumber: 1,
    title: 'Fundamentos de ML y Árboles de Decisión',
    description: 'Entropía de Shannon, Ganancia de Información y el Dilema Sesgo-Varianza.',
    color: 'from-emerald-600 to-teal-700',
    borderColor: 'border-emerald-500',
    subjectId: 'ac',
    guideBook: {
      title: 'Guía de AC: Entropía, ID3 y Métricas de Rendimiento',
      keyPoints: [
        'Entropía H(S) = - sum(p_i * log2(p_i)). Mide la impureza de las clases.',
        'Ganancia de Información IG(S, A) = H(S) - sum(|S_v|/|S| * H(S_v)). Atributo que maximiza la pureza.',
        'Precision = TP / (TP + FP); Recall = TP / (TP + FN); F1 = 2 * (P * R) / (P + R).',
      ],
      commonMistakes: [
        'Confundir Precision (de lo que el modelo predijo positivo, cuánto acertó) con Recall (de los positivos reales que existían, cuántos detectó).',
      ],
      essentialFormula: 'H(S) = - [ p+ * log2(p+) + p- * log2(p-) ]',
    },
    lessons: [
      {
        id: 'ac-u1-l1',
        title: 'Cálculo de Entropía y Selección ID3',
        subtitle: 'Pureza de atributos y partición óptima',
        unitId: 'ac-unit-1',
        subjectId: 'ac',
        xpReward: 20,
        gemReward: 5,
        questions: [
          {
            id: 'ac-q1',
            type: 'multiple_choice',
            prompt: 'Un conjunto de datos de entrenamiento contiene 8 ejemplos positivos y 8 ejemplos negativos (50% / 50%). ¿Cuál es la Entropía de Shannon H(S)?',
            options: ['H(S) = 1.0 bit', 'H(S) = 0.0 bits', 'H(S) = 0.5 bits', 'H(S) = 8.0 bits'],
            correctIndex: 0,
            explanation: 'H(S) = - (0.5 * log2(0.5) + 0.5 * log2(0.5)) = - (0.5 * (-1) + 0.5 * (-1)) = 1.0 bit. Es la máxima impureza e incertidumbre posible en un problema binario.',
            tip: 'Si todos los ejemplos fueran positivos (16 positivos y 0 negativos), la entropía sería 0 (pureza total).'
          },
          {
            id: 'ac-q2',
            type: 'match_pairs',
            prompt: 'Empareja cada métrica de evaluación de aprendizaje automático con su fórmula:',
            pairs: [
              { left: 'Precision (Precisión)', right: 'TP / (TP + FP)' },
              { left: 'Recall (Sensibilidad)', right: 'TP / (TP + FN)' },
              { left: 'F1-Score', right: 'Media armónica de Precision y Recall' },
              { left: 'Specificity (Especificidad)', right: 'TN / (TN + FP)' },
            ],
            explanation: '¡Exacto! Las 4 métricas estándar derivadas de la matriz de confusión en AC.',
          }
        ]
      }
    ]
  },

  // ==========================================
  // ASIGNATURA: AR (Arquitectura de Redes) - Sugerencia de Alejandro
  // ==========================================
  {
    id: 'ar-unit-1',
    unitNumber: 1,
    title: 'Subnetting VLSM y Mecanismos TCP',
    description: 'Direccionamiento CIDR eficiente, cálculo de retardos y control de congestión.',
    color: 'from-sky-600 to-cyan-700',
    borderColor: 'border-sky-500',
    subjectId: 'ar',
    guideBook: {
      title: 'Guía de AR: VLSM, Retardos y TCP Reno',
      keyPoints: [
        'Retardo de transmisión d_trans = L / R (tamaño paquete / ancho de banda).',
        'Retardo de propagación d_prop = d / v (distancia física / velocidad 2x10^8 m/s).',
        'En subredes IPv4: Hosts utilizables = 2^(32 - prefijo) - 2.',
        'TCP Slow Start duplica la ventana por cada RTT; Congestion Avoidance suma 1 MSS por RTT.',
      ],
      commonMistakes: [
        'Olvidar restar 2 direcciones (Red y Broadcast) al calcular hosts útiles en una subred.',
      ],
      essentialFormula: 'Hosts = 2^(32 - prefijo) - 2 | d_trans = L / R | d_prop = d / v',
    },
    lessons: [
      {
        id: 'ar-u1-l1',
        title: 'Cálculo de Subredes con VLSM',
        subtitle: 'Asignación óptima de máscaras de red',
        unitId: 'ar-unit-1',
        subjectId: 'ar',
        xpReward: 20,
        gemReward: 5,
        questions: [
          {
            id: 'ar-q1',
            type: 'multiple_choice',
            prompt: 'Una empresa necesita crear una subred en la que conectará 50 ordenadores. ¿Cuál es el prefijo CIDR mínimo necesario para albergar esa subred?',
            options: ['/26 (máscara 255.255.255.192, 62 hosts utilizables)', '/27 (30 hosts utilizables)', '/25 (126 hosts utilizables)', '/24 (254 hosts utilizables)'],
            correctIndex: 0,
            explanation: 'Con prefijo /26 quedan 32 - 26 = 6 bits para host. 2^6 - 2 = 64 - 2 = 62 hosts útiles, suficiente para 50 ordenadores. Un /27 solo daría 2^5 - 2 = 30 (insuficiente).',
            tip: 'En el examen de AR, siempre elige la potencia de 2 más ajustada por arriba de N + 2.'
          },
          {
            id: 'ar-q2',
            type: 'true_false',
            prompt: '¿Aumentar el ancho de banda del enlace (de 10 Mbps a 1 Gbps) reduce el tiempo que tarda un fotón en viajar por la fibra óptica (retardo de propagación)?',
            statement: 'Un enlace con mayor ancho de banda tiene menor retardo de propagación.',
            isTrue: false,
            explanation: 'FALSO: El ancho de banda reduce el retardo de TRANSMISIÓN (L / R, el tiempo en inyectar los bits al cable), pero la velocidad de propagación de la luz en la fibra es constante (~200.000 km/s) y depende solo de la distancia física.',
          }
        ]
      }
    ]
  },

  // ==========================================
  // ASIGNATURA: ST (Servicios Telemáticos) - Sugerencia de Sofía
  // ==========================================
  {
    id: 'st-unit-1',
    unitNumber: 1,
    title: 'Criptografía RSA y Arquitectura Web HTTP',
    description: 'Generación de claves asimétricas, firmas digitales y tiempos de descarga con RTT.',
    color: 'from-purple-600 to-indigo-700',
    borderColor: 'border-purple-500',
    subjectId: 'st',
    guideBook: {
      title: 'Guía de ST: Criptografía RSA & HTTP Persistente',
      keyPoints: [
        'En RSA: n = p * q; phi(n) = (p - 1)(q - 1). La clave pública es (e, n); privada (d, n).',
        'e * d = 1 (mod phi(n)). Se cifra con M^e mod n; se descifra con C^d mod n.',
        'HTTP/1.0 no persistente abre una conexión TCP independiente por cada objeto (2 RTTs por imagen).',
        'HTTP/1.1 persistente reutiliza la conexión TCP; HTTP/2 añade multiplexación binaria.',
      ],
      commonMistakes: [
        'Calcular phi(n) como n - 1 en vez de (p - 1)(q - 1).',
      ],
      essentialFormula: 'n = p * q | phi(n) = (p-1)(q-1) | e * d = 1 mod phi(n)',
    },
    lessons: [
      {
        id: 'st-u1-l1',
        title: 'Mecánica de Claves en RSA',
        subtitle: 'Generación de claves y cifrado asimétrico',
        unitId: 'st-unit-1',
        subjectId: 'st',
        xpReward: 20,
        gemReward: 5,
        questions: [
          {
            id: 'st-q1',
            type: 'multiple_choice',
            prompt: 'En el algoritmo criptográfico RSA, elegimos los números primos p = 3 y q = 11. ¿Cuál es el valor de la función de Euler phi(n)?',
            options: ['phi(n) = 20', 'phi(n) = 33', 'phi(n) = 32', 'phi(n) = 14'],
            correctIndex: 0,
            explanation: 'phi(n) = (p - 1) * (q - 1) = (3 - 1) * (11 - 1) = 2 * 10 = 20. El módulo es n = 3 * 11 = 33.',
            tip: 'Pregunta clásica de examen de ST: cualquier exponente público "e" debe ser coprimo con phi(n), por ejemplo e = 3 o e = 7.'
          },
          {
            id: 'st-q2',
            type: 'match_pairs',
            prompt: 'Empareja cada protocolo de la capa de aplicación con su puerto TCP por defecto:',
            pairs: [
              { left: 'HTTP', right: 'Puerto 80' },
              { left: 'HTTPS (TLS)', right: 'Puerto 443' },
              { left: 'DNS (Consultas)', right: 'Puerto 53 (UDP/TCP)' },
              { left: 'SSH', right: 'Puerto 22' },
            ],
            explanation: '¡Excelente! Puertos esenciales que todo graduado de la FIUM debe conocer de memoria.',
          }
        ]
      }
    ]
  },

  // ==========================================
  // ASIGNATURA: SI (Sistemas Inteligentes) - Sugerencia de Pablo
  // ==========================================
  {
    id: 'si-unit-1',
    unitNumber: 1,
    title: 'Algoritmo A* y Poda Alfa-Beta en Juegos',
    description: 'Búsqueda informada óptima, heurísticas admisibles y poda de árboles Minimax.',
    color: 'from-rose-600 to-pink-700',
    borderColor: 'border-rose-500',
    subjectId: 'si',
    guideBook: {
      title: 'Guía de SI: Búsqueda Heurística A* y Minimax',
      keyPoints: [
        'A* evalúa nodos con f(n) = g(n) + h(n).',
        'Una heurística h(n) es admisible si nunca sobreestima el coste real al objetivo (h(n) <= h*(n)).',
        'Una heurística es consistente (monótona) si h(n) <= c(n, a, n\') + h(n\'). La consistencia garantiza que el primer camino a un nodo sea el óptimo.',
        'La Poda Alfa-Beta poda ramas cuando beta <= alfa (el adversario tiene una opción mejor en otro sitio).',
      ],
      commonMistakes: [
        'Detener el algoritmo A* cuando el objetivo entra en Abiertos. ¡Error! Solo debe detenerse cuando se EXTRAE el objetivo de la cola.',
      ],
      essentialFormula: 'f(n) = g(n) + h(n) | Podar en Minimax si beta <= alfa',
    },
    lessons: [
      {
        id: 'si-u1-l1',
        title: 'Heurísticas Admisibles y Función f(n)',
        subtitle: 'Condición de optimalidad en búsqueda informada',
        unitId: 'si-unit-1',
        subjectId: 'si',
        xpReward: 20,
        gemReward: 5,
        questions: [
          {
            id: 'si-q1',
            type: 'multiple_choice',
            prompt: 'En el algoritmo A*, si usamos la heurística trivial h(n) = 0 para todos los nodos del espacio de estados, ¿en qué algoritmo de búsqueda se convierte exactamente?',
            options: [
              'Búsqueda de Coste Uniforme (Dijkstra / UCS)',
              'Búsqueda en Profundidad (DFS)',
              'Búsqueda Voraz Primero el Mejor (Greedy Best-First)',
              'Búsqueda con Profundidad Iterativa (IDS)'
            ],
            correctIndex: 0,
            explanation: 'Al ser h(n) = 0, la función f(n) = g(n) + 0 = g(n), que es exactamente el coste real acumulado desde el inicio. El algoritmo expande siempre el nodo de menor g(n), que es la definición de Búsqueda de Coste Uniforme (UCS).',
            tip: 'Pregunta trampa recurrente en la FIUM: "A* con h=0 es UCS; A* con g=0 es Búsqueda Voraz".'
          },
          {
            id: 'si-q2',
            type: 'true_false',
            prompt: 'En la Poda Alfa-Beta en árboles de juego de suma cero (Minimax), ¿se altera el valor numérico óptimo de la raíz respecto a Minimax estándar sin poda?',
            statement: 'La poda Alfa-Beta devuelve exactamente la misma decisión y valor de utilidad que Minimax explorando todo el árbol.',
            isTrue: true,
            explanation: 'VERDADERO: La poda Alfa-Beta es una optimización EXACTA. Solo descarta ramas que matemáticamente nunca podrán ser elegidas por los jugadores racionales, garantizando el mismo resultado con mucho menos coste de cómputo.',
          }
        ]
      }
    ]
  }
];
