import { Subject } from '../types';

export const COURSES: Subject[] = [
  // 1. AOC - Arquitectura y Organización de Computadores
  {
    id: 'aoc',
    code: '1909',
    name: 'Arquitectura y Organización de Computadores',
    shortName: 'AOC',
    semester: '1º Cuatrimestre · 3º Grado',
    color: 'from-blue-600 to-indigo-700',
    accentColor: 'blue',
    icon: 'Cpu',
    tagline: 'De la instrucción en binario al hardware: Pipelines, Cachés, Tomasulo y Rendimiento Extremo',
    formulaCheatSheet: {
      title: 'Formulario & Leyes de Examen de AOC',
      items: [
        {
          label: 'Tiempo de CPU',
          formulaOrLaw: 'T_CPU = IC \\times CPI \\times T_c = \\frac{IC \\times CPI}{frecuencia}',
          notes: 'IC = Número de instrucciones ejecutadas; CPI = Ciclos por instrucción; Tc = Tiempo de ciclo de reloj.'
        },
        {
          label: 'Ley de Amdahl (Aceleración Speedup)',
          formulaOrLaw: 'S = \\frac{1}{(1 - f_m) + \\frac{f_m}{S_m}}',
          notes: 'fm = Fracción de tiempo mejorable; Sm = Factor de aceleración de esa fracción.'
        },
        {
          label: 'Tiempo Medio de Acceso a Memoria (AMAT)',
          formulaOrLaw: 'AMAT = t_{hit} + (tasa\\_fallo \\times penalizacion\\_fallo)',
          notes: 'Para jerarquías de 2 niveles: AMAT = t_{L1} + m_{L1} \\times (t_{L2} + m_{L2\\_local} \\times penalizacion_{RAM}).'
        },
        {
          label: 'Desglose de Bits de Dirección en Caché',
          formulaOrLaw: 'Bits Total = Tag + Index + Offset',
          notes: 'Offset = log2(Tamaño Bloque en Bytes); Index = log2(Número de Conjuntos); Tag = Resto.'
        },
        {
          label: 'Intensidad Aritmética (Modelo Roofline)',
          formulaOrLaw: 'IA = \\frac{\\text{FLOPs ejecutados}}{\\text{Bytes transferidos de memoria}}',
          notes: 'Si IA < I_codo el algoritmo está acotado por memoria (Memory-Bound); si IA > I_codo está acotado por cómputo (Compute-Bound).'
        }
      ]
    },
    concepts: [
      {
        id: 'aoc-pipeline-hazards',
        title: 'Pipeline de 5 Etapas & Riesgos (Hazards)',
        subtitle: 'El corazón del examen: RAW, Forwarding y Load-Use Stalls',
        importance: 'CRÍTICO EN EXAMEN',
        difficulty: 'Avanzado',
        timeEstimateMin: 45,
        interactiveDemoId: 'pipeline',
        feynmanExplanation: {
          intuition: 'Imagina una lavandería industrial con 5 puestos: Lavar (IF), Secar (ID), Doblar (EX), Planchar (MEM), Guardar (WB). Si tienes 5 cestas de ropa, no esperas a que la primera cesta termine todo el proceso para meter la segunda. Cada ciclo entra una nueva. El problema ocurre si la cesta 2 necesita una camisa que la cesta 1 aún está lavando.',
          analogy: 'Riesgo de Datos (RAW): Si necesitas los calcetines que la lavadora anterior aún está planchando. Solución con Forwarding: en lugar de esperar a que se guarden en el armario (WB), te los pasan directamente de la plancha (MEM o EX) a tus manos.',
          formalTheory: 'El pipeline estándar MIPS/RISC-V consta de 5 etapas: IF, ID, EX, MEM, WB. Un riesgo RAW ocurre cuando I2 lee un registro que I1 aún no ha terminado de escribir. Con adelantamiento (Forwarding), el resultado producido en la ALU en la etapa EX o leído en MEM se cablea directamente a la entrada de la ALU en el ciclo siguiente, evitando paradas en instrucciones ALU-ALU. Sin embargo, para la secuencia LW + uso inmediato, la lectura de datos de memoria ocurre al final de MEM: es IMPOSIBLE adelantar a tiempo para el inicio de EX, por lo que se produce obligatoriamente 1 ciclo de parada (Load-Use Bubble).',
          keyFormulasOrRules: [
            'Adelantamiento EX/MEM -> EX: Si I1 escribe en Rd y I2 lee de Rs/Rt en el ciclo siguiente.',
            'Adelantamiento MEM/WB -> EX: Si I1 escribe en Rd y I3 lee de Rs/Rt dos ciclos después.',
            'Load-Use Hazard: LW R1, 0(R2) seguido inmediatamente de ADD R3, R1, R4 SIEMPRE requiere 1 ciclo de parada forzosa.'
          ],
          examPitfalls: [
            'Olvidar que el registro $zero ($0) nunca cambia: si la instrucción anterior escribe en $0, NO hay forwarding ni dependencia que deba parar el cauce.',
            'Confundir paradas con adelantamiento: asumir erróneamente que el forwarding elimina la parada del Load-Use.',
            'En saltos condicionales (BEQ/BNE), olvidar si la resolución del salto se evalúa en ID (1 ciclo de penalización) o en EX (2 ciclos de penalización).'
          ]
        },
        codeOrExample: {
          language: 'mips',
          code: `# Fragmento clásico de examen UMU:\nLW   $t0, 0($a0)   # Ciclo 1: IF, Ciclo 2: ID, Ciclo 3: EX, Ciclo 4: MEM\nADD  $t1, $t0, $a1 # Ciclo 2: IF, Ciclo 3: ID (STALL), Ciclo 4: ID (repite), Ciclo 5: EX\nSW   $t1, 4($a0)   # Forwarding de EX/MEM de ADD a MEM de SW sin paradas`,
          explanation: 'La burbuja obligatoria entre LW y ADD permite que el dato cargado desde la memoria al final de MEM esté disponible para el inicio de EX de ADD.'
        }
      },
      {
        id: 'aoc-cache-design',
        title: 'Jerarquía de Caché, AMAT y Direcciones',
        subtitle: 'Cálculo de Bits (Tag-Index-Offset) y políticas de escritura Write-Back / Write-Through',
        importance: 'CRÍTICO EN EXAMEN',
        difficulty: 'Avanzado',
        timeEstimateMin: 40,
        interactiveDemoId: 'cache',
        feynmanExplanation: {
          intuition: 'Tu cerebro (registros) es ultrarrápido pero pequeño. Tu escritorio (L1) tiene los 5 papeles que estás usando ahora. Tu archivador (L2) está a dos pasos. La biblioteca municipal (RAM) está a 20 minutos. Cada vez que tienes que ir a la biblioteca municipal tu rendimiento se hunde.',
          analogy: 'Offset = La página dentro del libro. Index = La balda de la estantería donde guardas el libro. Tag = El título del libro para comprobar si es el que buscas o uno viejo que estaba en la misma balda.',
          formalTheory: 'En una memoria caché asociativa por conjuntos de V vías con bloques de B bytes y C conjuntos:\nOffset = log2(B) bits.\nIndex = log2(C) bits, donde C = Capacidad_Total / (B × V).\nTag = Bits_Dirección - Index - Offset.\nEn políticas de escritura: Write-Through escribe en caché y memoria a la vez (lento, requiere write buffer). Write-Back solo escribe en caché y activa el dirty bit, volcando a memoria únicamente al ser reemplazado.',
          keyFormulasOrRules: [
            'Número de Conjuntos = Capacidad / (Tamaño_Bloque × Asociatividad).',
            'AMAT = t_hit + Tasa_Fallo × Penalización_Fallo.',
            'Penalización de fallo en Write-Back: Si el bloque a reemplazar está sucio (Dirty=1), se requiere el doble de accesos a memoria (guardar bloque sucio + traer bloque nuevo).'
          ],
          examPitfalls: [
            'Confundir el número de conjuntos con el número total de bloques (líneas). En asociativa de 4 vías, hay 4 bloques por conjunto.',
            'Calcular mal el AMAT en varios niveles olvidando si la tasa de fallos dada es local o global.',
            'No tener en cuenta el coste del bit de dirty y los bits de tag en el tamaño total del hardware de la caché.'
          ]
        }
      },
      {
        id: 'aoc-tomasulo-rob',
        title: 'Tomasulo, Buffer de Reordenación (ROB) & ILP',
        subtitle: 'Ejecución fuera de orden y finalización en orden (Commit) en procesadores superescalares',
        importance: 'PUNTUACIÓN MÁXIMA',
        difficulty: 'Experto',
        timeEstimateMin: 50,
        feynmanExplanation: {
          intuition: 'Imagina una cocina de restaurante con varios chefs especializados (uno para pasta, uno para parrilla, uno para ensaladas). Los pedidos entran en orden, pero los chefs preparan los platos en paralelo a medida que tienen los ingredientes listos. Sin embargo, los platos de una misma mesa se sirven al comensal todos juntos y en orden estricto para no generar caos.',
          analogy: 'Estaciones de reserva = Las bandejas de cada chef esperando ingredientes. CDB (Common Data Bus) = El megáfono por el que un chef grita "¡La salsa de tomate está lista!" a todos los demás chefs a la vez. ROB = El camarero que retiene los platos y los entrega a la mesa en el orden del ticket.',
          formalTheory: 'El algoritmo de Tomasulo elimina los falsos riesgos de nombres (WAR y WAW) mediante el renombre de registros en hardware en las Estaciones de Reserva (RS). Consta de 3 etapas originales: Issue, Execute y Write Result vía CDB. Para soportar interrupciones precisas y ejecución especulativa tras saltos, se introduce el Reorder Buffer (ROB), transformando el ciclo de vida en: Issue, Execute, Write Result y Commit (en orden de programa). Una instrucción no actualiza el estado arquitectural del procesador (Register File o Memoria) hasta que llega a la cabeza del ROB.',
          keyFormulasOrRules: [
            'Issue: Reserva estación de reserva y entrada en ROB. Si los operandos están listos se leen; si no, se guardan los identificadores del ROB/RS que los producirán.',
            'Write Result: Difunde el resultado por el Common Data Bus (CDB) a todas las estaciones que lo esperan y al ROB.',
            'Commit: Cuando la instrucción llega a la cabeza del ROB, si no hay excepción ni fallo de predicción, se escribe el dato final en el banco de registros o en memoria (Store).'
          ],
          examPitfalls: [
            'Olvidar que las instrucciones STORE no escriben en la caché de datos en la etapa Write, sino ÚNICAMENTE en la etapa COMMIT del ROB.',
            'Asumir que una instrucción puede hacer Commit fuera de orden: el Commit es rigurosamente secuencial.',
            'Confundir dependencias reales (RAW) con dependencias de nombre (WAR/WAW): Tomasulo solo espera por dependencias RAW.'
          ]
        }
      },
      {
        id: 'aoc-coherence-msi',
        title: 'Protocolos de Coherencia de Caché MSI / MESI',
        subtitle: 'Fisgoneo (Snooping) en bus compartido y consistencia secuencial en procesadores multinúcleo',
        importance: 'ALTA RENTABILIDAD',
        difficulty: 'Experto',
        timeEstimateMin: 45,
        feynmanExplanation: {
          intuition: 'Si 4 amigos están editando notas en libretas individuales y uno tacha una cifra para poner otra, todos los demás deben enterarse de inmediato. Si no, seguirán usando el dato viejo. En un procesador multinúcleo con cachés privadas L1, el bus es la sala donde todos gritan cuando quieren leer o modificar una posición.',
          analogy: 'Estado M (Modified): Eres el único que tiene la libreta y además la has modificado (la copia en RAM es obsoleta). Estado S (Shared): Varios amigos tienen una fotocopia idéntica para solo lectura. Estado I (Invalid): Tu fotocopia es vieja y no puedes fiarte de ella.',
          formalTheory: 'En un sistema multiprocesador simétrico (SMP) con bus compartido y protocolo snoopy MSI:\n- Modified (M): El bloque está presente solo en esta caché, ha sido modificado (Dirty) y la memoria principal está desactualizada.\n- Shared (S): El bloque puede estar en una o varias cachés, no está modificado con respecto a la memoria.\n- Invalid (I): El bloque no contiene datos válidos.\nTransacciones en el bus: BusRd (lectura sin intención de modificar), BusRdX (lectura con intención de modificar, invalida copias ajenas), BusUpgr (actualización de S a M invalidando al resto sin traer el bloque completo).',
          keyFormulasOrRules: [
            'Transición S -> M: Genera BusUpgr para invalidar las otras copias compartidas.',
            'Transición I -> M: Genera BusRdX (trae el bloque y solicita exclusividad invalidando al resto).',
            'Snooper en estado M detecta BusRd: Debe volcar el bloque al bus (Flush_C o Flush_C_M) y pasar al estado S.'
          ],
          examPitfalls: [
            'Olvidar que en una escritura en estado S, se emite BusUpgr y NO BusRdX (ahorrando el tráfico de enviar los datos que ya se poseen).',
            'Confundir coherencia con consistencia: la coherencia asegura que todos ven el mismo valor para UNA posición de memoria; la consistencia define el orden de acceso entre DISTINTAS posiciones.',
            'No contabilizar los ciclos de arbitraje del bus cuando dos núcleos intentan emitir BusRdX a la vez.'
          ]
        }
      },
      {
        id: 'aoc-roofline-ilp',
        title: 'Modelo Roofline & Intensidad Aritmética',
        subtitle: 'Límites de rendimiento pico: ¿Acotado por memoria o por computación? (CPU vs GPU)',
        importance: 'ALTA RENTABILIDAD',
        difficulty: 'Avanzado',
        timeEstimateMin: 35,
        feynmanExplanation: {
          intuition: 'Imagina que puedes empaquetar 100 cajas por minuto (tu velocidad de computación máxima), pero el camión solo te entrega 10 cajas por minuto (ancho de banda de memoria). Tu rendimiento real será de 10 cajas por minuto: estás limitado por la memoria. Por mucho que seas Flash, el camión te frena.',
          analogy: 'El "techo" (roofline) tiene dos vertientes: una rampa inclinada (ancho de banda de memoria multiplicativo) y un techo plano horizontal (potencia de cálculo de las ALUs en GFLOPs). El codo es el punto de equilibrio óptimo.',
          formalTheory: 'El modelo Roofline relaciona el rendimiento alcanzable (GFLOP/s) con la Intensidad Aritmética (IA en FLOPs/Byte):\nRendimiento = min(Rendimiento_Pico, Ancho_Banda_Memoria × IA).\nEl "codo" de la gráfica ocurre en IA_codo = Rendimiento_Pico / Ancho_Banda.\nSi IA < IA_codo, la aplicación está Memory-Bound (optimizaciones recomendadas: bloqueo de bucles/tiling, reutilización de caché).\nSi IA > IA_codo, está Compute-Bound (optimizaciones: vectorización SIMD, desenrollado de bucles, paralelismo de hilos con OpenMP).',
          keyFormulasOrRules: [
            'IA = (Total Operaciones de Punto Flotante) / (Total Bytes Leídos/Escritos de DRAM).',
            'Aceleración GPU vs CPU: Una GPU tiene muchísimo mayor rendimiento pico y ancho de banda, pero su IA_codo es más alto, requiriendo algoritmos con enorme paralelismo de datos.'
          ],
          examPitfalls: [
            'Contar accesos a la caché L1 en el denominador de IA: en el modelo Roofline solo se cuentan las transferencias a MEMORIA PRINCIPAL (DRAM/VRAM).',
            'Olvidar que un algoritmo de multiplicación de matrices clásico O(N³) tiene mayor intensidad aritmética que una suma vectorial O(N).'
          ]
        }
      }
    ]
  },

  // 2. ASO - Ampliación de Sistemas Operativos
  {
    id: 'aso',
    code: '1910',
    name: 'Ampliación de Sistemas Operativos',
    shortName: 'ASO',
    semester: '1º Cuatrimestre · 3º Grado',
    color: 'from-cyan-600 to-blue-800',
    accentColor: 'cyan',
    icon: 'Layers',
    tagline: 'Del espacio de usuario a las entrañas del kernel: POSIX, memoria virtual x86, ext2 y xv6',
    formulaCheatSheet: {
      title: 'Formulario & Reglas de Examen de ASO',
      items: [
        {
          label: 'Capacidad Máxima Fichero Ext2/Ext3',
          formulaOrLaw: 'Tam\\_Max = (10 + P + P^2 + P^3) \\times B',
          notes: 'B = Tamaño bloque en bytes; P = B / 4 (número de punteros de 32 bits por bloque).'
        },
        {
          label: 'Offset en Sistema de Ficheros UNIX',
          formulaOrLaw: 'Num\\_Bloque = Offset / B, \\quad Desplazamiento = Offset \\% B',
          notes: 'Si Num_Bloque < 10 es Directo; si 10 <= Num_Bloque < 10+P es BSI; si 10+P <= Num_Bloque < 10+P+P² es BDI.'
        },
        {
          label: 'Traducción de Direcciones Paginación x86-32',
          formulaOrLaw: 'Dirección Virtual: Dir\\_Offset(12b) + Tabla\\_Offset(10b) + Directorio\\_Offset(10b)',
          notes: 'CR3 apunta a la dirección física del Directorio de Páginas. Cada tabla tiene 1024 entradas de 4 bytes = 4 KiB.'
        },
        {
          label: 'Algoritmo del Banquero (Condición de Seguridad)',
          formulaOrLaw: 'Need_i \\le Available \\implies Available = Available + Allocation_i',
          notes: 'Need = Max - Allocation. El sistema es seguro si existe al menos una secuencia que permita terminar a todos los procesos.'
        }
      ]
    },
    concepts: [
      {
        id: 'aso-posix-pipes-signals',
        title: 'Tuberías POSIX, Descriptores y la Señal SIGPIPE',
        subtitle: 'Tabla de Descriptores de Fichero (FDT), Tabla de Ficheros Abiertos (OFT) y redirecciones',
        importance: 'CRÍTICO EN EXAMEN',
        difficulty: 'Avanzado',
        timeEstimateMin: 45,
        feynmanExplanation: {
          intuition: 'Cada proceso tiene una libreta privada donde apunta sus números de teléfono (descriptores 0, 1, 2, 3...). Esos números marcan a una centralita compartida del sistema (la tabla de ficheros abiertos), donde se guarda por qué página del archivo vas leyendo (offset). Si dos procesos usan fork(), el hijo copia la libreta del padre con los mismos números apuntando a la misma centralita.',
          analogy: 'Una tubería es un tubo de fontanería. El extremo 0 es la boca que bebe (read); el extremo 1 es el grifo que echa agua (write). Si cierras la boca que bebe y sigues bombeando agua por el grifo, la tubería revienta y el kernel le dispara un rayo al fontanero (SIGPIPE).',
          formalTheory: 'Las tuberías unidireccionales creadas con pipe(fd) asignan fd[0] para lectura y fd[1] para escritura. Tras un fork(), los descriptores se comparten. Si un proceso ejecuta write() sobre un extremo de tubería donde NO queda ningún proceso en todo el sistema con el extremo de lectura abierto, el kernel genera obligatoriamente la señal SIGPIPE. Por defecto, SIGPIPE termina el proceso inmediatamente (muerte abrupta, sin llamar a return EXIT_SUCCESS). Además, dup2(oldfd, newfd) clona un descriptor cerrando newfd si estaba abierto, permitiendo redirigir stdin (0) o stdout (1).',
          keyFormulasOrRules: [
            'Regla de Oro en tuberías: TODO proceso debe cerrar los extremos de la tubería que no vaya a usar explícitamente.',
            'Si el lector no cierra su copia de fd[1], nunca recibirá EOF (end-of-file) al leer de fd[0], bloqueándose eternamente.',
            'Si todos los lectores cierran y un proceso escribe: se envía SIGPIPE. Si el proceso ignora SIGPIPE, write() retorna -1 con errno = EPIPE.'
          ],
          examPitfalls: [
            'En preguntas de examen "¿Por qué el proceso hijo no devuelve EXIT_SUCCESS?": casi siempre es porque murió por la señal SIGPIPE al intentar escribir en un pipe sin lectores.',
            'Olvidar que fork() duplica los descriptores pero NO duplica las entradas de la Tabla de Ficheros Abiertos: el offset de lectura/escritura es COMPARTIDO entre padre e hijo.',
            'Confundir descriptores: fd[0] es lectura, fd[1] es escritura.'
          ]
        },
        codeOrExample: {
          language: 'c',
          code: `int p[2];\npipe(p);\nif (fork() == 0) {\n    close(p[0]); // El hijo solo escribe: cerrar lectura\n    dup2(p[1], STDOUT_FILENO); // Redirigir stdout al pipe\n    close(p[1]);\n    execlp("ls", "ls", NULL);\n}\nclose(p[1]); // El padre solo lee: cerrar escritura\nread(p[0], buf, sizeof(buf));`,
          explanation: 'Patrón canónico de examen para conectar dos procesos mediante tubería sin fugas de descriptores.'
        }
      },
      {
        id: 'aso-virtual-memory',
        title: 'Memoria Virtual en x86 & Reserva Perezosa (xv6)',
        subtitle: 'Paginación de dos niveles, registro CR3, fallos de página y Copy-On-Write',
        importance: 'CRÍTICO EN EXAMEN',
        difficulty: 'Experto',
        timeEstimateMin: 50,
        interactiveDemoId: 'virtual-memory',
        feynmanExplanation: {
          intuition: 'Cada programa se cree el rey del mundo: piensa que tiene toda la memoria para él solo, desde la dirección 0 hasta los 4 GB. La MMU y el sistema operativo son ilusionistas que traducen esa dirección virtual de mentira a un marco físico real de la memoria RAM. Si intentas tocar una página que aún no existe, el procesador se queja (Page Fault), y el sistema operativo corre a asignarte una página real sin que te des cuenta.',
          analogy: 'Reserva perezosa (Lazy Allocation): Si reservas 100 habitaciones de hotel para tu boda, el hotel no te prepara las 100 habitaciones hoy. Solo cuando un invitado llega a la recepción y pide la llave, el hotel va y le hace la cama en ese instante.',
          formalTheory: 'En arquitecturas x86 de 32 bits con páginas de 4 KiB, la dirección virtual se descompone en:\n- Bits 31-22 (10 bits): Índice en el Page Directory (Directorio de Páginas apuntado por CR3).\n- Bits 21-12 (10 bits): Índice en la Page Table (Tabla de Páginas).\n- Bits 11-0 (12 bits): Desplazamiento (Offset) dentro de la página física.\nEn la práctica de xv6 "Lazy Page Allocation", la llamada sbrk(n) no asigna páginas físicas de inmediato, sino que simplemente incrementa myproc()->sz. Cuando el proceso intenta acceder a la memoria recién solicitada, la MMU genera una excepción T_PGFLT (Page Fault). El manejador del kernel intercepta el trap, comprueba que la dirección virtual fallida (guardada en el registro CR2) es menor que myproc()->sz, invoca kalloc() y mappages(), y reanuda la instrucción.',
          keyFormulasOrRules: [
            'Tamaño de página = 4096 bytes (4 KiB) -> 12 bits de offset.',
            'Directorio de Páginas: 1024 entradas de 4 bytes = 4 KiB.',
            'Entrada de tabla de páginas (PTE): contiene la dirección base del marco físico (bits 31-12) y flags (P: Present, W: Writable, U: User/Supervisor).'
          ],
          examPitfalls: [
            'Asumir que un Page Fault es siempre un error de programa (Segmentation Fault): el Page Fault es la base del lazy allocation, swapping y copy-on-write.',
            'En x86, olvidar que el registro CR2 guarda la dirección virtual exacta que provocó el fallo de página.',
            'No comprobar si la dirección del page fault supera el tamaño máximo permitido del proceso o invade la zona del guard page de la pila.'
          ]
        }
      },
      {
        id: 'aso-fs-inodes',
        title: 'Sistema de Ficheros UNIX / Ext2-3: Nodos-i',
        subtitle: 'Bloques directos, BSI, BDI, BTI y cálculo de accesos a disco por offset',
        importance: 'CRÍTICO EN EXAMEN',
        difficulty: 'Avanzado',
        timeEstimateMin: 40,
        feynmanExplanation: {
          intuition: 'Un nodo-i es la tarjeta de identidad de un archivo. Guarda quién es su dueño, qué permisos tiene y un índice de dónde están sus trozos en el disco duro. Los primeros 10 trozos caben en la tarjeta (bloques directos). Si el archivo es más grande, la tarjeta apunta a una página de libreta (BSI); si es gigante, apunta a un índice de libretas (BDI).',
          analogy: 'Acceder al byte 500.000.000 de un archivo es como buscar un párrafo en una enciclopedia de varios tomos: miras el índice maestro (BTI), que te manda al tomo 5 (BDI), que te manda al capítulo 3 (BSI), que te manda a la página exacta (bloque de datos).',
          formalTheory: 'Estructura estándar de un nodo-i UNIX:\n- 10 punteros directos (bloques 0 a 9).\n- 1 puntero simplemente indirecto (BSI): contiene P punteros a bloques de datos (P = Tamaño_Bloque / 4 bytes).\n- 1 puntero doblemente indirecto (BDI): contiene P punteros a bloques BSI, direccionando P² bloques de datos.\n- 1 puntero triplemente indirecto (BTI): contiene P punteros a bloques BDI, direccionando P³ bloques de datos.\nPara leer el byte en el offset X:\n1. Bloque lógico BL = X div Tamaño_Bloque.\n2. Desplazamiento D = X mod Tamaño_Bloque.\n3. Si BL < 10: acceso directo (1 lectura a disco del bloque de datos).\n4. Si 10 ≤ BL < 10 + P: acceso por BSI (1 lectura del bloque BSI + 1 lectura del bloque de datos = 2 lecturas).\n5. Si 10 + P ≤ BL < 10 + P + P²: acceso por BDI (1 lectura BDI + 1 lectura BSI + 1 bloque de datos = 3 lecturas).',
          keyFormulasOrRules: [
            'Punteros por bloque P = Tamaño_Bloque / Tamaño_Puntero (ej. 4096 / 4 = 1024 punteros).',
            'Rango BSI: de 10 a 10 + P - 1 bloques lógicos.',
            'Rango BDI: de 10 + P a 10 + P + P² - 1 bloques lógicos.',
            'Rango BTI: de 10 + P + P² a 10 + P + P² + P³ - 1 bloques lógicos.'
          ],
          examPitfalls: [
            'Olvidar restar 10 antes de calcular la posición dentro del BSI.',
            'No contabilizar la lectura previa del nodo-i desde la tabla de nodos-i cuando te preguntan el total absoluto de operaciones de E/S.',
            'Confundir bloques de datos con bloques de punteros de metadatos.'
          ]
        }
      },
      {
        id: 'aso-sync-semaphores',
        title: 'Sincronización Concurrente & Algoritmo del Banquero',
        subtitle: 'Secciones críticas, semáforos de Dijkstra y prevención de interbloqueos (Deadlock)',
        importance: 'ALTA RENTABILIDAD',
        difficulty: 'Avanzado',
        timeEstimateMin: 40,
        feynmanExplanation: {
          intuition: 'Si dos personas entran a un cajero automático a la vez con la misma tarjeta y sacan 100€ al mismo milisegundo, la cuenta podría descontar solo 100€ en vez de 200€ si no hay un cerrojo. Un semáforo es un vigilante que solo deja pasar a N personas a la sala de las cajas fuertes.',
          analogy: 'El Algoritmo del Banquero de Dijkstra: Un banquero tiene 10 millones de euros en caja y 5 empresarios pidiendo créditos. El banquero nunca presta dinero a un empresario si eso deja la caja tan vacía que ninguno de los empresarios pueda terminar su proyecto y devolver el dinero.',
          formalTheory: 'Las condiciones de Coffman necesarias para el interbloqueo son: Exclusión mutua, Retención y espera, No apropiación y Espera circular.\nEl Algoritmo del Banquero evalúa el estado del sistema con matrices: Asignación (Allocation), Máximo (Max), Necesidad (Need = Max - Allocation) y vector Disponible (Available).\nUn estado es SEGURO si existe al menos una secuencia de procesos <P1, P2, ... Pn> donde la necesidad de cada Pi pueda satisfacerse con los recursos disponibles actuales más los recursos liberados por los procesos anteriores.',
          keyFormulasOrRules: [
            'Need[i, j] = Max[i, j] - Allocation[i, j].',
            'Paso del banquero: Buscar Pi tal que finish[i] == false y Need[i] ≤ Available.',
            'Si se encuentra: Available = Available + Allocation[i]; finish[i] = true; repetir.',
            'Si finish[i] == true para todos los i, el estado es SEGURO.'
          ],
          examPitfalls: [
            'Confundir estado inseguro con interbloqueo: todo interbloqueo es inseguro, pero un estado inseguro no implica interbloqueo inmediato (solo que no se puede garantizar que no ocurra).',
            'Sumar Need en vez de Allocation a Available cuando un proceso termina su ejecución.',
            'Olvidar comprobar que todos los tipos de recursos cumplan la desigualdad componente a componente.'
          ]
        }
      },
      {
        id: 'aso-xv6-internals',
        title: 'Arquitectura del Kernel xv6: Syscalls & Context Switch',
        subtitle: 'Del trapasm.S a syscall.c: tabla de llamadas, trap frame y swtch.S',
        importance: 'FUNDAMENTAL',
        difficulty: 'Experto',
        timeEstimateMin: 45,
        feynmanExplanation: {
          intuition: 'Cuando tu programa en C escribe printf(), no toca la pantalla directamente: le pide permiso al kernel mediante una llamada al sistema (syscall). Para no colgarse, el procesador hace una foto completa de todos tus registros (el Trap Frame), cambia la vestimenta a modo supervisor (Ring 0), atiende tu petición en el kernel y vuelve a restaurar tu foto para que continúes como si nada.',
          analogy: 'Un cambio de contexto (swtch.S) es como un cambio de turno en un puesto de control: el guardia saliente apunta sus últimas observaciones en su libreta (guarda registros en struct context), y el guardia entrante lee su propia libreta para continuar su turno exactamente donde lo dejó.',
          formalTheory: 'En xv6, cuando el código de usuario ejecuta la instrucción INT T_SYSCALL (0x40 en x86):\n1. La CPU consulta la IDT (Interrupt Descriptor Table) y salta a alltraps en trapasm.S.\n2. Se crea un struct trapframe en la pila del kernel guardando registros generales (pushal) y de segmento.\n3. Se invoca trap(struct trapframe *tf) en trap.c.\n4. Si tf->trapno == T_SYSCALL, se llama a syscall() en syscall.c.\n5. syscall() lee el número de llamada almacenado en el registro %eax (tf->eax), indexa el array de punteros a función syscalls[], y ejecuta la función correspondiente (ej. sys_fork, sys_pipe).\n6. El valor de retorno de la llamada se almacena en tf->eax para que el código de usuario lo reciba.',
          keyFormulasOrRules: [
            'Paso de parámetros en xv6: argint(), argptr(), argstr() leen los argumentos desde la pila de usuario usando tf->esp.',
            'swtch(struct context **old, struct context *new): Guarda solo los registros callee-saved (%ebp, %ebx, %esi, %edi) y cambia %esp.',
            'Cada proceso en xv6 tiene dos pilas: pila de usuario y pila de kernel (de 4 KiB).'
          ],
          examPitfalls: [
            'Asumir que las llamadas al sistema leen argumentos directamente de los registros en x86 de 32 bits (en xv6 los argumentos se pasan en la PILA del usuario).',
            'Olvidar proteger con spinlock las estructuras compartidas del kernel (como la ptable.lock al cambiar estados de procesos).',
            'Modificar el campo tf->eax con el resultado de la syscall: si no se escribe en tf->eax, el proceso de usuario recibe basura.'
          ]
        }
      }
    ]
  },

  // 3. ALF - Autómatas y Lenguajes Formales
  {
    id: 'alf',
    code: '1905',
    name: 'Autómatas y Lenguajes Formales',
    shortName: 'ALF',
    semester: '1º Cuatrimestre · 2º Grado',
    color: 'from-amber-600 to-orange-700',
    accentColor: 'amber',
    icon: 'Sparkles',
    tagline: 'Jerarquía de Chomsky, Autómatas Finitos, Gramáticas y Límites de la Computación',
    formulaCheatSheet: {
      title: 'Formulario & Teoremas de Examen de ALF',
      items: [
        {
          label: 'Lema de Bombeo para Lenguajes Regulares',
          formulaOrLaw: '\\forall w \\in L, |w| \\ge n \\implies w = xyz, \\quad |y| > 0, \\quad |xy| \\le n, \\quad \\forall i \\ge 0: xy^i z \\in L',
          notes: 'Se usa exclusivamente para demostrar que un lenguaje NO es regular (por contradicción).'
        },
        {
          label: 'Lema de Bombeo para Lenguajes Libres del Contexto (GLC)',
          formulaOrLaw: 'w = uvxyz, \\quad |vy| > 0, \\quad |vxy| \\le n, \\quad \\forall i \\ge 0: uv^i x y^i z \\in L',
          notes: 'Permite bombear dos partes (v e y) a la vez manteniendo la proporción.'
        },
        {
          label: 'Minimización de Moore (Clases de Equivalencia)',
          formulaOrLaw: 'q_i \\sim_k q_j \\iff \\delta(q_i, a) \\sim_{k-1} \\delta(q_j, a) \\quad \\forall a \\in \\Sigma',
          notes: 'Se parte de P0 = {Estados Finales F, Estados No Finales Q-F} y se refina hasta que Pk = Pk-1.'
        },
        {
          label: 'Forma Normal de Chomsky (FNC)',
          formulaOrLaw: 'A \\to BC \\quad \\text{o} \\quad A \\to a',
          notes: 'Toda producción debe derivar en exactamente dos variables no terminales o en un terminal único.'
        }
      ]
    },
    concepts: [
      {
        id: 'alf-pumping-lemma',
        title: 'Lema de Bombeo para Lenguajes Regulares',
        subtitle: 'Demostración rigurosa de no-regularidad mediante partición xyz',
        importance: 'CRÍTICO EN EXAMEN',
        difficulty: 'Avanzado',
        timeEstimateMin: 45,
        feynmanExplanation: {
          intuition: 'Un autómata finito tiene memoria limitada (solo sabe en qué estado está). Si una palabra es más larga que el número de estados del autómata, el principio del palomar garantiza que el camino en el grafo ha tenido que repetir al menos un estado (un bucle). Si hay un bucle, puedes dar tantas vueltas al bucle como quieras (bombear) y la palabra resultante DEBERÍA seguir siendo aceptada.',
          analogy: 'Un torniquete de metro que solo cuenta de 0 a 5. Si entra una fila de 10 personas, el torniquete necesariamente se ha reiniciado y ha pasado dos veces por la misma posición. No puede recordar si han entrado exactamente el mismo número de personas rubias que morenas.',
          formalTheory: 'Sea L un lenguaje regular. Entonces existe una constante n > 0 (la longitud de bombeo) tal que cualquier cadena w ∈ L con |w| ≥ n puede dividirse en 3 partes w = xyz cumpliendo:\n1. |y| > 0 (la parte bombeable no es vacía).\n2. |xy| ≤ n (el bucle ocurre dentro de los primeros n símbolos).\n3. Para todo i ≥ 0, xyⁱz ∈ L.\nPara demostrar que un lenguaje NO es regular:\n1. Se asume por reducción al absurdo que L es regular.\n2. Se selecciona una cadena genérica w ∈ L que dependa de n (ej. w = aⁿ bⁿ).\n3. Por la condición 2 (|xy| ≤ n), la subcadena y debe estar compuesta exclusivamente por el primer tipo de símbolos (y = aᵏ con 1 ≤ k ≤ n).\n4. Se prueba que para algún valor de i (ej. i = 0 o i = 2), la cadena bombeada xyⁱz NO pertenece a L, llegando a una contradicción.',
          keyFormulasOrRules: [
            'Condición 1: |y| ≥ 1.',
            'Condición 2: |xy| ≤ n.',
            'Condición 3: xy⁰z = xz ∈ L, xy²z ∈ L, xy³z ∈ L...',
            'El lema NO se puede usar para demostrar que un lenguaje SÍ es regular.'
          ],
          examPitfalls: [
            'Elegir una cadena con un número fijo (ej. w = a¹⁰b¹⁰): en el examen obtendrás 0 puntos. La cadena DEBE escribirse en función de n (aⁿbⁿ).',
            'Asumir que tú eliges los valores de x, y, z: el adversario elige la partición; tú solo puedes acotarla mediante la condición |xy| ≤ n.',
            'Olvidar probar el bombeo para i = 0 (eliminación del bucle).'
          ]
        }
      },
      {
        id: 'alf-automata-runner',
        title: 'Minimización de AFDs & Autómata Cociente',
        subtitle: 'Tabla triangular de pares no distinguibles y algoritmo de Moore / Hopcroft',
        importance: 'CRÍTICO EN EXAMEN',
        difficulty: 'Avanzado',
        timeEstimateMin: 40,
        interactiveDemoId: 'automata',
        feynmanExplanation: {
          intuition: 'A veces diseñamos un autómata con 8 estados cuando con 3 se podía hacer exactamente lo mismo. Dos estados son equivalentes si a partir de ellos, ante cualquier letra que metas, ambos van siempre a estados finales o ambos a estados no finales. Minimizar es fusionar estados clones en uno solo.',
          analogy: 'Dos empleados que hacen exactamente la misma tarea con los mismos clientes: fusionas sus despachos para ahorrar costes en la empresa.',
          formalTheory: 'Dos estados p y q de un AFD son indistinguibles (p ~ q) si para toda cadena w ∈ Σ*, δ*(p, w) ∈ F ⇔ δ*(q, w) ∈ F.\nAlgoritmo de la tabla triangular:\n1. Se dibuja una tabla con todos los pares de estados {p, q}.\n2. Paso inicial: Se marcan con ✗ todos los pares donde uno es estado final (p ∈ F) y el otro no (q ∉ F).\n3. Pasos iterativos: Para cada par {p, q} no marcado y para cada símbolo a ∈ Σ, se calcula {δ(p, a), δ(q, a)}. Si el par de destino ya está marcado con ✗, se marca {p, q}.\n4. Se repite hasta que en una pasada completa no se marque ninguna casilla nueva.\n5. Los pares no marcados corresponden a estados equivalentes que se fusionan en el autómata mínimo cociente.',
          keyFormulasOrRules: [
            'Antes de aplicar el algoritmo de minimización, es OBLIGATORIO eliminar todos los estados inaccesibles desde el estado inicial.',
            'El autómata mínimo para un lenguaje regular es único (salvo isomorfismo de nombres de estados).'
          ],
          examPitfalls: [
            'No eliminar los estados inalcanzables al principio: el algoritmo puede darte estados equivalentes fantasma.',
            'Olvidar que el autómata debe ser completo (tener función de transición definida para todo símbolo del alfabeto) antes de la minimización.',
            'Marcar casillas por error sin propagar recursivamente las dependencias de pares marcados.'
          ]
        }
      },
      {
        id: 'alf-cfg-chomsky',
        title: 'Gramáticas Libres del Contexto (GLC) & FNC',
        subtitle: 'Árboles de derivación sintáctica, ambigüedad y Forma Normal de Chomsky',
        importance: 'ALTA RENTABILIDAD',
        difficulty: 'Experto',
        timeEstimateMin: 45,
        feynmanExplanation: {
          intuition: 'Una gramática libre del contexto es la receta que usan los compiladores para entender código fuente como "if (...) { ... } else { ... }". Las reglas dicen cómo reemplazar símbolos abstractos (Variables) por código real (Terminales).',
          analogy: 'Una receta de cocina: "Pastel -> Bizcocho + Relleno", "Bizcocho -> Harina + Huevos". Puedes sustituir Bizcocho sin importar qué relleno vayas a poner (por eso es "libre del contexto").',
          formalTheory: 'Una GLC es una 4-tupla G = (V, Σ, S, P). Una gramática es AMBIGUA si existe al menos una palabra w ∈ L(G) que admite dos o más árboles de derivación sintáctica distintos (o dos derivaciones por la izquierda distintas).\nTransformación a Forma Normal de Chomsky (FNC):\n1. Eliminar producciones lambda (A -> λ) salvo si λ ∈ L(G).\n2. Eliminar producciones unitarias (A -> B).\n3. Eliminar símbolos no generativos y no alcanzables (símbolos inútiles).\n4. Sustituir terminales en producciones largas para que todas las reglas tengan la forma: A -> BC o A -> a.',
          keyFormulasOrRules: [
            'En FNC, derivar una cadena de longitud |w| requiere exactamente 2|w| - 1 pasos de derivación.',
            'La FNC es el requisito indispensable para el algoritmo de parsing eficiente CYK (Cocke-Younger-Kasami).'
          ],
          examPitfalls: [
            'No aplicar las simplificaciones en el orden estricto: 1º Producciones lambda, 2º Producciones unitarias, 3º Símbolos inútiles.',
            'Olvidar que en una gramática ambigua el problema de decidir si una GLC arbitraria es ambigua es INDECIDIBLE.'
          ]
        }
      },
      {
        id: 'alf-pda-stack',
        title: 'Autómatas con Pila (AP)',
        subtitle: 'Aceptación por estado final vs por pila vacía y no determinismo intrínseco',
        importance: 'ALTA RENTABILIDAD',
        difficulty: 'Experto',
        timeEstimateMin: 45,
        feynmanExplanation: {
          intuition: 'Un autómata finito con una pila de platos LIFO infinita. Puedes apilar un plato cada vez que ves una "a", y desapilar un plato cada vez que ves una "b". Al final, si la pila queda vacía, sabes con certeza que había exactamente el mismo número de "a" que de "b".',
          analogy: 'Un cajero que guarda billetes de 10€ en un tubo vertical y luego solo los saca por arriba: no puede mirar el billete del fondo sin sacar todos los de arriba primero.',
          formalTheory: 'Un Autómata con Pila (AP) es una 7-tupla M = (Q, Σ, Γ, δ, q0, Z0, F). La función de transición δ recibe (estado, símbolo entrada o λ, símbolo cima de la pila) y devuelve un conjunto de pares (nuevo estado, nueva cadena en la cima de la pila).\nDos modos de aceptación equivalentes en potencia (reconocen la misma clase de lenguajes libres de contexto):\n1. Aceptación por estado final L(M): La cadena se consume y el autómata termina en q ∈ F.\n2. Aceptación por pila vacía N(M): La cadena se consume y la pila queda completamente vacía (sin ni siquiera el símbolo inicial Z0).',
          keyFormulasOrRules: [
            'Transición δ(q, a, Z) = {(p, XZ)} apila X encima de Z.',
            'Transición δ(q, a, Z) = {(p, λ)} desapila Z.',
            'Los AP deterministas (APD) son estrictamente menos potentes que los AP no deterministas (APND).'
          ],
          examPitfalls: [
            'Olvidar vaciar el símbolo inicial Z0 cuando se pide diseñar un AP por pila vacía.',
            'Confundir que la cadena termine con que la pila esté vacía: para aceptar, la palabra de entrada debe haberse consumido POR COMPLETO.'
          ]
        }
      },
      {
        id: 'alf-turing-decidability',
        title: 'Máquinas de Turing & El Problema de la Parada',
        subtitle: 'Jerarquía de Chomsky completa, lenguajes recursivos y problemas indecidibles',
        importance: 'FUNDAMENTAL',
        difficulty: 'Experto',
        timeEstimateMin: 40,
        feynmanExplanation: {
          intuition: 'Alan Turing diseñó el modelo matemático supremo de un ordenador: una cinta infinita con un cabezal que lee, escribe y se mueve a izquierda o derecha. Si una máquina de Turing no puede resolver un problema, ningún ordenador del universo podrá resolverlo jamás.',
          analogy: 'El Problema de la Parada (Halting Problem): Es imposible escribir un programa antivirus que analice cualquier otro código y te diga con 100% de certeza "este programa nunca se quedará colgado en un bucle infinito". Siempre se puede construir una trampa autorreferencial.',
          formalTheory: 'Jerarquía de Chomsky:\n- Tipo 3: Regulares (AFDs / Expresiones regulares).\n- Tipo 2: Libres de contexto (Autómatas con Pila / GLC).\n- Tipo 1: Sensibles al contexto (Autómatas linealmente acotados).\n- Tipo 0: Recursivamente enumerables (Máquinas de Turing).\nUn lenguaje es Recursivo (Decidible) si existe una MT que lo acepta y que SIEMPRE se para ante cualquier entrada (responde Sí o No). Es Recursivamente Enumerable (Semidecidible) si la MT se para para palabras de L, pero puede entrar en bucle infinito para palabras que no están en L.',
          keyFormulasOrRules: [
            'Teorema de la Parada: El lenguaje H = {<M, w> | M se para con la entrada w} es indecidible.',
            'Teorema de Rice: Cualquier propiedad semántica no trivial sobre el lenguaje reconocido por una Máquina de Turing es INDECIDIBLE.'
          ],
          examPitfalls: [
            'Confundir lenguaje decidible (recursivo) con lenguaje reconocible por MT (recursivamente enumerable).',
            'Pensar que una MT con múltiples cintas o no determinista reconoce más lenguajes que una MT estándar de una sola cinta: tienen exactamente la MISMA potencia de cómputo.'
          ]
        }
      }
    ]
  },

  // 4. TDS - Tecnologías de Desarrollo de Software
  {
    id: 'tds',
    code: '1907',
    name: 'Tecnologías de Desarrollo de Software',
    shortName: 'TDS',
    semester: '1º Cuatrimestre · 3º Grado',
    color: 'from-purple-600 to-pink-700',
    accentColor: 'purple',
    icon: 'PackageCheck',
    tagline: 'Principios SOLID, Patrones GRASP & GoF, Java Streams y Arquitectura Limpia',
    formulaCheatSheet: {
      title: 'Formulario & Principios de Examen de TDS',
      items: [
        {
          label: 'Principios SOLID',
          formulaOrLaw: 'S: Single Resp | O: Open/Closed | L: Liskov Subst | I: Interface Segr | D: Dependency Inv',
          notes: 'D: Depender de abstracciones (interfaces), no de implementaciones concretas.'
        },
        {
          label: 'Patrones GRASP Fundamentales',
          formulaOrLaw: 'Experto en Información, Creador, Bajo Acoplamiento, Alta Cohesión, Controlador',
          notes: 'Experto: Asignar la responsabilidad a la clase que posee los datos requeridos.'
        },
        {
          label: 'Pipeline Funcional en Java Streams',
          formulaOrLaw: 'collection.stream().filter(Predicate).map(Function).collect(Collector)',
          notes: 'Operaciones intermedias son Lazy; la operación terminal desencadena la computación.'
        },
        {
          label: 'Patrones GoF Clave',
          formulaOrLaw: 'Creación: Factory/Singleton | Estructural: Adapter/Decorator | Comportamiento: Observer/Strategy',
          notes: 'Elegir composición sobre herencia en diseño orientado a objetos.'
        }
      ]
    },
    concepts: [
      {
        id: 'tds-solid-gof',
        title: 'Principios SOLID & Clínica de Refactorización',
        subtitle: 'Detección de code smells y aplicación de SRP, OCP, LSP, ISP y DIP en Java',
        importance: 'CRÍTICO EN EXAMEN',
        difficulty: 'Avanzado',
        timeEstimateMin: 45,
        interactiveDemoId: 'solid-doctor',
        feynmanExplanation: {
          intuition: 'Construir software sin SOLID es como construir una casa apilando ladrillos con chicle: cuando quieres cambiar la bombilla de la cocina, se derrumba el tejado del baño. Cada clase debe tener un solo trabajo, poder ampliarse sin tocar código viejo y comunicarse mediante contratos limpios.',
          analogy: 'Principio de Inversión de Dependencias (DIP): Tu cargador del móvil tiene un conector USB estándar. No soldaste el cable del móvil directamente a los cables de la pared de tu casa. El enchufe es la interfaz abstracta.',
          formalTheory: '1. Single Responsibility (SRP): Una clase debe tener una única razón para cambiar.\n2. Open/Closed (OCP): Las entidades deben estar abiertas a la extensión pero cerradas a la modificación.\n3. Liskov Substitution (LSP): Los subtipos deben ser sustituibles por sus tipos base sin alterar la corrección del programa.\n4. Interface Segregation (ISP): Muchas interfaces específicas para clientes son mejores que una interfaz generalista sobrecargada.\n5. Dependency Inversion (DIP): Los módulos de alto nivel no deben depender de módulos de bajo nivel; ambos deben depender de abstracciones.',
          keyFormulasOrRules: [
            'Violación de SRP: Una clase Factura que calcula importes, dibuja la ventana JavaFX y ejecuta SQL en la base de datos.',
            'Violación de LSP: Una clase Cuadrado que hereda de Rectángulo y rompe setAncho() / setAlto().',
            'Violación de DIP: Un Controlador que hace new MySQLDatabaseService() en su constructor en lugar de inyectar una interfaz Repositorio.'
          ],
          examPitfalls: [
            'Confundir OCP con herencia pura: OCP se logra típicamente mediante composición y patrones como Strategy o Decorator, no con jerarquías gigantescas de clases.',
            'En exámenes de diseño, justificar una decisión diciendo solo "porque es más limpio": se debe justificar citando el principio exacto (SRP, bajo acoplamiento, etc.).'
          ]
        }
      },
      {
        id: 'tds-grasp-patterns',
        title: 'Patrones GRASP (General Responsibility Assignment)',
        subtitle: 'Experto en Información, Creador, Controlador, Alta Cohesión y Bajo Acoplamiento',
        importance: 'CRÍTICO EN EXAMEN',
        difficulty: 'Avanzado',
        timeEstimateMin: 45,
        feynmanExplanation: {
          intuition: '¿A quién le pides el menú en un restaurante? Al camarero, no al cocinero ni al cliente de la mesa de al lado. GRASP son las reglas del sentido común para decidir qué clase debe tener cada método.',
          analogy: 'Controlador: El recepcionista de un hotel que recibe tu petición de check-in y coordina a los botones y la limpieza sin hacer él mismo las camas.',
          formalTheory: 'Los patrones GRASP de Craig Larman definen cómo asignar responsabilidades a clases:\n- Experto en Información: Asignar la responsabilidad a la clase que posee la información necesaria para realizarla.\n- Creador: La clase A crea a B si A contiene, agrega o utiliza intensamente a B.\n- Controlador: Primer objeto más allá de la UI que recibe y coordina un mensaje del sistema (evita sobrecargar la vista GUI).\n- Bajo Acoplamiento: Minimizar las dependencias mutuas entre clases para aumentar la reutilización.\n- Alta Cohesión: Mantener las responsabilidades de una clase fuertemente relacionadas y focalizadas.',
          keyFormulasOrRules: [
            'En los diagramas de interacción de examen: Si Cliente pide total, y Factura contiene LineasFactura, Factura es el Experto en Información para calcular el total.',
            'No delegar la lógica de negocio al Controlador: el controlador delega inmediatamente en las clases del dominio.'
          ],
          examPitfalls: [
            'Asignar responsabilidades a clases "Gestor..." o "Manager..." sin justificar si son Fabricaciones Puras o violaciones de Cohesión.',
            'Hacer que la ventana (Vista) llame directamente al modelo de datos sin pasar por el Controlador.'
          ]
        }
      },
      {
        id: 'tds-gof-patterns-deep',
        title: 'Catálogo de Patrones de Diseño GoF en Java',
        subtitle: 'Factory Method, Singleton, Adapter, Decorator, Composite, Strategy y Observer',
        importance: 'ALTA RENTABILIDAD',
        difficulty: 'Experto',
        timeEstimateMin: 50,
        feynmanExplanation: {
          intuition: 'Soluciones contrastadas por miles de ingenieros senior para problemas que se repiten una y otra vez. En lugar de inventar la rueda cuadrada cada semana, aplicas el plano de una rueda que ya sabes que funciona.',
          analogy: 'Decorator: Ponerle una funda impermeable a tu móvil y luego un soporte magnético. El móvil sigue siendo un móvil, pero le añades capas de funcionalidad envolviéndolo sin alterar sus circuitos internos.',
          formalTheory: 'Clasificación GoF:\n1. Creación: Singleton (instancia única con constructor privado y getInstancia()), Factory Method (método polimórfico de instanciación), Abstract Factory.\n2. Estructurales: Adapter (convierte la interfaz de una clase antigua a la que espera el cliente), Decorator (añade responsabilidades dinámicamente envolviendo el objeto), Composite (trata árboles de objetos y hojas de manera uniforme).\n3. Comportamiento: Strategy (encapsula algoritmos intercambiables como estrategias de descuento), Observer (notificación uno-a-muchos de eventos desacoplada, base de MVC/JavaFX).',
          keyFormulasOrRules: [
            'Strategy vs State: Strategy es elegido por el cliente; State cambia internamente según el ciclo de vida del objeto.',
            'Adapter vs Decorator: Adapter cambia la interfaz; Decorator conserva la interfaz y enriquece el comportamiento.'
          ],
          examPitfalls: [
            'Abusar del Singleton: en exámenes penalizan usar Singleton si introduce acoplamiento global y dificulta las pruebas unitarias.',
            'Confundir Factory Method (patrón GoF formal polimórfico) con una simple clase de factoría estática.'
          ]
        }
      },
      {
        id: 'tds-java-streams',
        title: 'Java Streams API & Programación Funcional',
        subtitle: 'Map, Filter, FlatMap, Reduce, GroupingBy y Collectors avanzados',
        importance: 'ALTA RENTABILIDAD',
        difficulty: 'Avanzado',
        timeEstimateMin: 40,
        feynmanExplanation: {
          intuition: 'En lugar de escribir bucles for anidados con contadores e ifs donde es facilísimo equivocarse con los índices, describes QUÉ quieres hacer con los datos como en una cinta transportadora: filtra los defectuosos, píntalos de azul y mételos en una caja.',
          analogy: 'Una cinta de aeropuerto: las maletas pasan por el filtro de seguridad (filter), les pegan una etiqueta con el destino (map) y las agrupan en el carrito del avión correspondiente (groupingBy).',
          formalTheory: 'Java Streams permite procesamiento declarativo sobre colecciones. Las operaciones intermedias son perezosas (lazy) y devuelven un nuevo Stream. Las operaciones terminales consumen el Stream y producen un valor o efecto.\n- filter(Predicate<T>): selecciona elementos que cumplen la condición booleana.\n- map(Function<T, R>): transforma cada elemento de tipo T en tipo R.\n- flatMap(Function<T, Stream<R>>): aplana estructuras anidadas (ej. listas de listas).\n- collect(Collectors.groupingBy(classifier)): agrupa en un Map<K, List<V>>.\n- reduce(identity, BinaryOperator): acumula elementos en un único resultado.',
          keyFormulasOrRules: [
            'Un Stream solo se puede consumir UNA vez: intentar reutilizarlo lanza IllegalStateException.',
            'Collectors.groupingBy() combinado con Collectors.counting() o Collectors.summingDouble().'
          ],
          examPitfalls: [
            'Modificar el estado de variables exteriores dentro de un forEach() o map() en Streams: viola la pureza funcional y rompe la ejecución paralela.',
            'Olvidar usar flatMap() cuando se tiene una lista de objetos que contienen a su vez listas (ej. Factura -> getLineas()).'
          ]
        },
        codeOrExample: {
          language: 'java',
          code: `// Agrupar facturas por cliente y calcular el gasto total por cada uno:\nMap<Cliente, Double> gastoPorCliente = facturas.stream()\n    .filter(f -> f.getEstado() == EstadoFactura.PAGADA)\n    .collect(Collectors.groupingBy(\n        Factura::getCliente,\n        Collectors.summingDouble(Factura::getTotal)\n    ));`,
          explanation: 'Patrón canónico de examen en los boletines de Streams de TDS en la FIUM.'
        }
      },
      {
        id: 'tds-testing-gitflow',
        title: 'Pruebas Unitarias con Mockito & Git Flow',
        subtitle: 'Mocks, Stubs, Verificaciones, Ciclo TDD y Resolución de Conflictos en Git',
        importance: 'FUNDAMENTAL',
        difficulty: 'Intermedio',
        timeEstimateMin: 35,
        feynmanExplanation: {
          intuition: 'Para probar si el motor de un coche funciona, no te hace falta construir la carretera, las gasolineras y el semáforo. Usas un banco de pruebas con un depósito falso que simula darle gasolina (Mock). Así aíslas exactamente dónde está la avería.',
          analogy: 'Un simulador de vuelo para pilotos: el piloto cree que está en el aire, pero todo el entorno está controlado y predecible.',
          formalTheory: 'El ciclo TDD (Test-Driven Development) sigue el mantra Red -> Green -> Refactor. Con Mockito se crean objetos simulados con mock(Clase.class), se define su comportamiento esperado con when(mock.metodo()).thenReturn(valor), y tras ejecutar la prueba se valida la interacción con verify(mock, times(1)).metodo().\nEn control de versiones Git, el flujo de trabajo en equipo requiere ramas de características (feature branches), rebase para mantener historial lineal y resolución manual de conflictos de fusión marcados con <<<<<<< HEAD y >>>>>>>.',
          keyFormulasOrRules: [
            'verify(mock).metodo() comprueba que el método fue invocado con los parámetros correctos.',
            'ArgumentCaptor<T> permite inspeccionar los objetos creados internamente que se pasaron a un mock.'
          ],
          examPitfalls: [
            'Hacer mock de la propia clase bajo prueba (SUT): solo se deben hacer mocks de sus DEPENDENCIAS externas.',
            'Hacer commits con código que no compila o con marcadores de conflicto de Git sin resolver.'
          ]
        }
      }
    ]
  },

  // 5. ISO - Introducción a los Sistemas Operativos
  {
    id: 'iso',
    code: '1904',
    name: 'Introducción a los Sistemas Operativos',
    shortName: 'ISO',
    semester: '1º Cuatrimestre · 2º Grado',
    color: 'from-emerald-600 to-teal-800',
    accentColor: 'emerald',
    icon: 'Terminal',
    tagline: 'Planificación de CPU, administración de memoria, scripts en Bash y ficheros UNIX',
    formulaCheatSheet: {
      title: 'Formulario & Leyes de Examen de ISO',
      items: [
        {
          label: 'Tiempos de Planificación de CPU',
          formulaOrLaw: 'T_{retorno} = T_{finalizacion} - T_{llegada}, \\quad T_{espera} = T_{retorno} - R\\acute{a}faga_{CPU}',
          notes: 'Tiempo de respuesta = Instante en que la CPU atiende por primera vez al proceso - T_llegada.'
        },
        {
          label: 'Tamaño de Tabla de Nodos-i',
          formulaOrLaw: 'Bloques\\_Tabla = \\frac{N_{nodos\\_i} \\times Tam\\_Nodo}{Tam\\_Bloque}',
          notes: 'El mapa de bits de nodos-i ocupa ceil(N_nodos_i / (8 * Tam_Bloque)) bloques.'
        },
        {
          label: 'Planificación de Disco (Recorrido de Cilindros)',
          formulaOrLaw: 'Costo = \\sum |Cilindro_{siguiente} - Cilindro_{actual}|',
          notes: 'Algoritmos: FCFS, SSTF (el más cercano), SCAN (ascensor hasta el extremo), C-LOOK (solo hasta la última petición).'
        },
        {
          label: 'Permisos Octales en Linux',
          formulaOrLaw: 'r = 4, \\quad w = 2, \\quad x = 1 \\implies rwxr-xr-- = 754',
          notes: 'Especiales: SetUID=4000, SetGID=2000, StickyBit=1000.'
        }
      ]
    },
    concepts: [
      {
        id: 'iso-cpu-scheduling',
        title: 'Planificación de CPU & Tiempos de Retorno',
        subtitle: 'Round Robin, Prioridades Dinámicas con Envejecimiento, SJF y SRTF',
        importance: 'CRÍTICO EN EXAMEN',
        difficulty: 'Avanzado',
        timeEstimateMin: 45,
        interactiveDemoId: 'cpu-scheduler',
        feynmanExplanation: {
          intuition: 'Una sala de espera con un solo médico (la CPU). Si entra un paciente con una consulta de 2 minutos y otro con una operación de 5 horas, ¿a quién atiendes primero? Si atiendes al de 5 horas, el de 2 minutos esperará 5 horas (el efecto convoy). Para ser justos, el médico puede atender a cada uno en turnos de 15 minutos (Round Robin).',
          analogy: 'Envejecimiento (Aging): Para que un proceso de baja prioridad no muera de hambre (inanición), cada tic que pasa esperando en la cola le regalan +1 punto de prioridad.',
          formalTheory: 'La planificación de CPU determina qué proceso en estado Listo pasa a Ejecución:\n- FCFS (First Come First Served): No apropiativo. Sensible a ráfagas largas (Efecto Convoy).\n- SJF (Shortest Job First): Óptimo en tiempo medio de espera entre algoritmos no apropiativos.\n- SRTF (Shortest Remaining Time First): Versión apropiativa de SJF.\n- Round Robin (RR): Apropiativo por quantum Q. Si Q es gigante se comporta como FCFS; si Q es minúsculo, la sobrecarga del cambio de contexto degrada la CPU.\n- Prioridades dinámicas con envejecimiento: Resuelve el problema de la inanición (Starvation).',
          keyFormulasOrRules: [
            'Tiempo de retorno (Turnaround): Momento de finalización menos momento de llegada.',
            'Tiempo de espera (Wait Time): Tiempo total que pasó en la cola de listos (T_retorno - Ráfagas de CPU).',
            'En caso de empate en Round Robin: el proceso recién llegado se encola ANTES que el proceso que acaba de agotar su quantum.'
          ],
          examPitfalls: [
            'Olvidar restar el tiempo de llegada al calcular el tiempo de retorno en el examen.',
            'Confundir ráfagas de E/S con ráfagas de CPU: durante la E/S el proceso está BLOQUEADO, no compite por la CPU.',
            'En prioridad apropiativa: olvidar verificar si un nuevo proceso que se desbloquea tiene mayor prioridad que el que está corriendo en la CPU.'
          ]
        }
      },
      {
        id: 'iso-inodes-fs',
        title: 'Nodos-i y Bloques Lógicos en UNIX',
        subtitle: 'Cálculo del mapa de bits, tabla de inodos y resolución de offsets',
        importance: 'CRÍTICO EN EXAMEN',
        difficulty: 'Avanzado',
        timeEstimateMin: 40,
        feynmanExplanation: {
          intuition: 'El disco duro de Linux tiene un mapa de qué trozos están libres (mapa de bits) y una lista de fichas de cada archivo (tabla de inodos). Cada ficha tiene punteros directos e indirectos para encontrar los datos.',
          analogy: 'Una libreta donde los primeros 10 renglones apuntan a páginas del libro, y el renglón 11 apunta a otra libreta que contiene más renglones.',
          formalTheory: 'Pregunta recurrente de examen oficial FIUM:\nSi un sistema dedica N bloques a la tabla de inodos y al mapa de bits, y se sabe que el mapa de bits ocupa M bloques, se puede despejar el número total de nodos-i: N_inodos = M × 8 bits/byte × Tamaño_Bloque. A partir de ahí se deduce el tamaño de cada nodo-i dividiendo los bytes de la tabla de nodos-i entre N_inodos.',
          keyFormulasOrRules: [
            'Cada byte del mapa de bits gestiona 8 bloques o 8 nodos-i.',
            'Para leer el byte en la posición X de un archivo: bloque = X div B, offset = X mod B.'
          ],
          examPitfalls: [
            'Confundir bits con bytes: un bloque de 4096 bytes contiene 4096 × 8 = 32.768 bits en el mapa.',
            'No contemplar los casos en que las direcciones de disco ocupan 4 bytes vs 8 bytes (32 vs 64 bits).'
          ]
        }
      },
      {
        id: 'iso-bash-scripting',
        title: 'Shell Scripting Avanzado en Bash',
        subtitle: 'Parámetros especiales, filtros (grep, sed, awk), permisos y gestión de procesos',
        importance: 'ALTA RENTABILIDAD',
        difficulty: 'Intermedio',
        timeEstimateMin: 40,
        feynmanExplanation: {
          intuition: 'La terminal de Linux no es una consola aburrida: es un lenguaje de programación hiperrápido que te permite automatizar en 3 líneas de código lo que a un administrativo le llevaría 8 semanas a mano.',
          analogy: 'Las tuberías de bash (|) son como una cadena de montaje de coches: un obrero desatornilla los tornillos (grep), el siguiente lija la chapa (sed) y el tercero empaqueta el producto (tar).',
          formalTheory: 'Estructuras de Bash evaluadas en los exámenes de prácticas de ISO:\n- Parámetros: $# (número de argumentos), $0 (nombre script), $1..$n (argumentos), $@ (todos como lista), $? (código de retorno del último comando: 0 es éxito).\n- Test: [ -f fichero ] (es regular), [ -d dir ] (es directorio), [ -s fichero ] (tamaño > 0), [ -r/-w/-x ] (permisos).\n- Sustitución de órdenes: var=$(comando) o var=`comando`.\n- Bucles: for x in "$@"; do ... done.\n- Redirecciones: 2>&1 (redirige stderr a stdout), >> (append), < (stdin).',
          keyFormulasOrRules: [
            'Siempre entrecomillar variables: "$var" para evitar problemas con nombres con espacios.',
            'chmod 755: rwxr-xr-x (dueño lee/escribe/ejecuta; grupo y otros leen/ejecutan).'
          ],
          examPitfalls: [
            'Olvidar los espacios obligatorios alrededor de los corchetes en if [ "$x" = "1" ]; then ...',
            'Confundir comparaciones numéricas (-eq, -ne, -lt, -gt) con comparaciones de cadenas (=, !=).'
          ]
        },
        codeOrExample: {
          language: 'bash',
          code: `#!/bin/bash\n# Script de examen: buscar ficheros con permisos especiales\nif [ $# -lt 1 ]; then\n    echo "Uso: $0 <directorio>" >&2\n    exit 1\nfi\nfind "$1" -type f -perm -4000 -exec ls -l {} + | awk '{print $3, $9}'`,
          explanation: 'Comprueba argumentos, redirige errores a stderr y busca binarios con SetUID activado.'
        }
      }
    ]
  },

  // 6. AC - Aprendizaje Computacional
  {
    id: 'ac',
    code: '1912',
    name: 'Aprendizaje Computacional',
    shortName: 'AC',
    semester: '2º Cuatrimestre · 3º Grado',
    color: 'from-rose-600 to-pink-900',
    accentColor: 'rose',
    icon: 'Brain',
    tagline: 'Árboles de decisión, modelos supervisados, evaluación con ROC-AUC y Deep Learning',
    formulaCheatSheet: {
      title: 'Formulario & Métricas de Examen de AC',
      items: [
        {
          label: 'Entropía de Shannon H(S)',
          formulaOrLaw: 'H(S) = - \\sum_{i=1}^c p_i \\log_2(p_i)',
          notes: 'Mide la impureza o incertidumbre. Para 2 clases equiprobables (p=0.5), H=1 bit. Si es pura, H=0.'
        },
        {
          label: 'Ganancia de Información (ID3)',
          formulaOrLaw: 'Gain(S, A) = H(S) - \\sum_{v \\in Valores(A)} \\frac{|S_v|}{|S|} H(S_v)',
          notes: 'Diferencia entre la entropía antes y después de dividir por el atributo A.'
        },
        {
          label: 'Métricas de la Matriz de Confusión',
          formulaOrLaw: 'Prec = \\frac{TP}{TP+FP}, \\quad Rec = \\frac{TP}{TP+FN}, \\quad F_1 = \\frac{2 \\times Prec \\times Rec}{Prec + Rec}',
          notes: 'Sensibilidad = Recall (TPR). Especificidad (TNR) = TN / (TN + FP). FPR = 1 - Especificidad.'
        },
        {
          label: 'Compromiso Sesgo-Varianza',
          formulaOrLaw: 'Error\\_Total = Sesgo^2 + Varianza + \\sigma^2_{irreducible}',
          notes: 'Alto sesgo = Underfitting (modelo demasiado simple). Alta varianza = Overfitting (memoriza el ruido).'
        }
      ]
    },
    concepts: [
      {
        id: 'ac-decision-trees',
        title: 'Árboles de Decisión, Entropía y Ganancia',
        subtitle: 'Algoritmos ID3 y C4.5: Ganancia de Información y poda contra el sobreajuste',
        importance: 'CRÍTICO EN EXAMEN',
        difficulty: 'Avanzado',
        timeEstimateMin: 45,
        interactiveDemoId: 'decision-tree',
        feynmanExplanation: {
          intuition: 'Un juego de "¿Quién es quién?": si preguntas "¿Lleva gafas?" y solo una persona en la mesa lleva gafas, tu pregunta ha sido bastante mala porque casi no divides la mesa. Pero si preguntas "¿Es mujer?" y divides la mesa exactamente por la mitad, esa pregunta tiene la máxima Ganancia de Información.',
          analogy: 'Entropía = El desorden de una habitación. Si todos los juguetes en el cajón son coches rojos, la entropía es 0 (orden puro). Si hay mitad coches y mitad muñecas, la entropía es 1 (máximo caos). Tu objetivo al podar y dividir es llegar a cajones de entropía 0.',
          formalTheory: 'El algoritmo ID3 selecciona en cada nodo el atributo que maximiza la Ganancia de Información Gain(S, A). Dado que ID3 tiene sesgo hacia atributos con muchos valores posibles (como el DNI o ID de usuario), C4.5 introduce la Razón de Ganancia (Gain Ratio):\nGainRatio(S, A) = Gain(S, A) / SplitInfo(S, A),\ndonde SplitInfo penaliza atributos con particiones atomizadas. Para evitar el sobreajuste (overfitting), se aplican técnicas de prepoda (detener el crecimiento según un umbral de ganancia o muestras mínimas por hoja) o postpoda (reducir ramas mediante validación cruzada).',
          keyFormulasOrRules: [
            'Entropía de dos clases: H(S) = -p(+) log2 p(+) - p(-) log2 p(-).',
            'Si p=0, 0 * log2(0) se define como 0.',
            'Gain(S, A) = H(S) - Resto(S, A).'
          ],
          examPitfalls: [
            'Usar logaritmo neperiano (ln) o base 10 en lugar de logaritmo en base 2 (log2): la entropía se mide en BITS, por lo que siempre es log2.',
            'No ponderar la entropía de cada rama por la fracción de muestras |Sv| / |S| al calcular el Resto.',
            'Olvidar que un árbol no podado tiene sesgo casi nulo pero varianza altísima (memoriza el dataset de entrenamiento).'
          ]
        }
      },
      {
        id: 'ac-confusion-roc',
        title: 'Matriz de Confusión, Curvas ROC & AUC',
        subtitle: 'Precisión, Sensibilidad, Especificidad y selección de umbrales óptimos',
        importance: 'CRÍTICO EN EXAMEN',
        difficulty: 'Avanzado',
        timeEstimateMin: 40,
        feynmanExplanation: {
          intuition: 'Un detector de incendios. Si salta la alarma cuando hay humo: Verdadero Positivo. Si salta la alarma cuando alguien fuma un cigarrillo: Falso Positivo. Si la casa está ardiendo y el detector se queda callado: Falso Negativo (¡mortal!). Cambiando la sensibilidad del detector decides qué riesgo prefieres asumir.',
          analogy: 'La Curva ROC es como una balanza: te muestra todas las combinaciones posibles de "pescar a los culpables" (Sensibilidad) versus "acusar a inocentes por error" (1 - Especificidad) a medida que ajustas la vara de medir.',
          formalTheory: 'La matriz de confusión organiza los resultados de un clasificador binario:\n- Accuracy = (TP + TN) / Total\n- Precision = TP / (TP + FP)\n- Recall (Sensibilidad / TPR) = TP / (TP + FN)\n- Especificidad (TNR) = TN / (TN + FP)\n- False Positive Rate (FPR) = FP / (TN + FP) = 1 - Especificidad.\nLa curva ROC representa TPR (eje Y) frente a FPR (eje X) para todos los posibles umbrales de decisión. Un clasificador perfecto tiene un punto en (0, 1) y un Área bajo la Curva (AUC) = 1.0. Un clasificador aleatorio sigue la diagonal con AUC = 0.5.',
          keyFormulasOrRules: [
            'F1-Score: Media armónica de Precisión y Recall = 2 × (Prec × Rec) / (Prec + Rec).',
            'En datasets desbalanceados, AUC-ROC y Precision-Recall son infinitamente más fiables que la Accuracy.'
          ],
          examPitfalls: [
            'Calcular la Especificidad usando FN en lugar de FP en el denominador: Especificidad es TN / (TN + FP).',
            'Elegir un modelo guiándote solo por Accuracy en problemas de detección de fraude médico o bancario.'
          ]
        }
      },
      {
        id: 'ac-bias-variance-cv',
        title: 'Compromiso Sesgo-Varianza & Validación Cruzada',
        subtitle: 'Overfitting vs Underfitting, Regularización L1/L2 y paquete caret en R',
        importance: 'ALTA RENTABILIDAD',
        difficulty: 'Avanzado',
        timeEstimateMin: 40,
        feynmanExplanation: {
          intuition: 'El sesgo es la cabezonería del modelo (asumir que el mundo es una línea recta cuando es una curva: underfitting). La varianza es la paranoia del modelo (aprenderse de memoria hasta el ruido de cada punto: overfitting). La ingeniería consiste en encontrar el término medio.',
          analogy: 'Estudiar para un examen: Underfitting es mirarse solo los títulos de las diapositivas. Overfitting es memorizar el número de página y la tipografía de la letra sin entender los conceptos. Validación cruzada es hacer exámenes de prueba de cursos anteriores para ver si realmente sabes resolver problemas nuevos.',
          formalTheory: 'El error esperado de generalización se descompone en:\nE[(y - f̂(x))²] = Sesgo²[f̂(x)] + Var[f̂(x)] + σ².\nPara combatir la alta varianza (Overfitting):\n1. Regularización L2 (Ridge): Añade penalización λ Σ w² (coeficientes pequeños).\n2. Regularización L1 (Lasso): Añade penalización λ Σ |w| (fuerza coeficientes a 0, selección de variables).\n3. Validación cruzada K-Fold (K-fold Cross Validation): Divide los datos en K bloques; entrena en K-1 y evalúa en el restante, promediando el resultado.',
          keyFormulasOrRules: [
            'K-Fold típico: K = 5 o K = 10.',
            'En el paquete caret de R: trainControl(method = "cv", number = 10).'
          ],
          examPitfalls: [
            'Evaluar el modelo final sobre el conjunto de test después de haberlo usado para calibrar hiperparámetros (Data Leakage).',
            'Olvidar estandarizar las variables continuas antes de aplicar regularización Ridge/Lasso o KNN.'
          ]
        }
      }
    ]
  },

  // 7. AR - Arquitectura de Redes
  {
    id: 'ar',
    code: '1908',
    name: 'Arquitectura de Redes',
    shortName: 'AR',
    semester: '2º Cuatrimestre · 3º Grado',
    color: 'from-sky-600 to-blue-700',
    accentColor: 'sky',
    icon: 'Network',
    tagline: 'Direccionamiento VLSM, protocolos IGP/EGP (RIP, OSPF, BGP) y control de flujo TCP',
    formulaCheatSheet: {
      title: 'Formulario & Leyes de Examen de AR',
      items: [
        {
          label: 'Cálculo de Subredes Útiles en IPv4',
          formulaOrLaw: 'N_{hosts\\_utiles} = 2^{32 - CIDR} - 2',
          notes: 'Se restan 2 direcciones: la dirección de Red (todo ceros en host) y la de Broadcast (todo unos en host).'
        },
        {
          label: 'Ecuación de Tráfico TCP (Throughput Medio)',
          formulaOrLaw: 'Rendimiento \\approx \\frac{1.22 \\times MSS}{RTT \\times \\sqrt{p}}',
          notes: 'MSS = Tamaño máximo de segmento; RTT = Tiempo de ida y vuelta; p = Tasa de pérdidas de paquetes.'
        },
        {
          label: 'Estimación de RTT y RTO (Jacobson/Karn)',
          formulaOrLaw: 'SRTT = (1 - \\alpha) SRTT + \\alpha RTT_m, \\quad RTO = SRTT + 4 \\times RTTVAR',
          notes: 'Típicamente alpha = 0.125 (1/8) y beta = 0.25 (1/4).'
        },
        {
          label: 'Métrica de Enlace en OSPF',
          formulaOrLaw: 'Coste = \\frac{10^8 \\text{ bps}}{\\text{Ancho de Banda del Enlace}}',
          notes: 'OSPF utiliza el algoritmo de Dijkstra para calcular los caminos más cortos sin bucles.'
        }
      ]
    },
    concepts: [
      {
        id: 'ar-vlsm-tcp',
        title: 'Direccionamiento IPv4 & Subnetting VLSM',
        subtitle: 'Diseño jerárquico de subredes, máscaras CIDR y asignación óptima sin solapamiento',
        importance: 'CRÍTICO EN EXAMEN',
        difficulty: 'Avanzado',
        timeEstimateMin: 45,
        interactiveDemoId: 'subnet-calc',
        feynmanExplanation: {
          intuition: 'Tienes una tarta grande de direcciones IP (ej. un bloque /24 con 256 porciones). Si una sede de tu empresa necesita 100 ordenadores, le cortas media tarta (/25). Con la otra mitad que te sobra (/25), cortas un trozo para la sede de 50 ordenadores (/26), y así sucesivamente. Si cortas mal los trozos, la tarta se desmorona.',
          analogy: 'Un armario organizador con cajones de tamaños en potencias de 2 (2, 4, 8, 16, 32, 64, 128, 256). No puedes meter 60 calcetines en un cajón de 32; necesitas el cajón de 64, aunque te sobren 4 huecos.',
          formalTheory: 'El algoritmo VLSM (Variable Length Subnet Masking) permite asignar máscaras de diferente tamaño a cada subred:\n1. Ordenar los requerimientos de hosts de las subredes de MAYOR a MENOR.\n2. Para cada subred con H hosts requeridos, calcular los bits de host necesarios: h tal que 2ʰ - 2 ≥ H.\n3. La máscara de la subred es /m = /(32 - h).\n4. Asignar la primera subred en la dirección base.\n5. La dirección de la siguiente subred comienza inmediatamente después de la dirección de broadcast de la subred anterior.',
          keyFormulasOrRules: [
            '2¹ = 2 hosts -> /31 (sin broadcast en enlaces punto a punto RFC 3021) o 2² - 2 = 2 hosts -> /30.',
            'Dirección de red: bits de host en 0.',
            'Dirección de broadcast: bits de host en 1.',
            'Rango útil: desde (Red + 1) hasta (Broadcast - 1).'
          ],
          examPitfalls: [
            'No restar las 2 direcciones reservadas (red y broadcast) al verificar si caben los hosts requeridos.',
            'No ordenar las sedes de mayor a menor número de hosts al inicio del ejercicio (fallo crítico que invalida el problema en el examen de la UMU).',
            'Confundir la máscara en decimal punteado: /25 es 255.255.255.128, /26 es .192, /27 es .224, /28 es .240, /29 es .248, /30 es .252.'
          ]
        }
      },
      {
        id: 'ar-routing-rip-ospf',
        title: 'Protocolos de Encaminamiento: RIP vs OSPF',
        subtitle: 'Vector de Distancias (conteo al infinito, Split Horizon) vs Estado de Enlaces (Dijkstra)',
        importance: 'CRÍTICO EN EXAMEN',
        difficulty: 'Avanzado',
        timeEstimateMin: 45,
        feynmanExplanation: {
          intuition: 'RIP es como pedir indicaciones por la calle: cada vecino te dice "la playa está a 3 manzanas por allí", pero ninguno tiene el mapa completo de la ciudad. Si una calle se corta, pueden marearse unos a otros en círculo (bucle de encaminamiento). OSPF, en cambio, le da una copia de Google Maps completo a cada router y cada uno calcula su ruta con Dijkstra.',
          analogy: 'Split Horizon (Horizonte Dividido): Si un amigo te acaba de decir que el autobús se coge en la plaza, no te des la vuelta 2 segundos después para decirle a ese mismo amigo "oye, el autobús se coge en la plaza a través de ti".',
          formalTheory: '1. RIP (Routing Information Protocol):\n- Basado en el algoritmo Bellman-Ford (Vector de distancias).\n- Métrica única: número de saltos (máximo 15 saltos; 16 = infinito / inalcanzable).\n- Problema de conteo al infinito: mitigado con Split Horizon (no anunciar una ruta por la misma interfaz por la que se aprendió) y Poison Reverse (anunciar la ruta de vuelta con métrica 16).\n2. OSPF (Open Shortest Path First):\n- Basado en Dijkstra (Estado de enlaces).\n- Cada router inunda paquetes LSA (Link-State Advertisement) y construye una base de datos topológica idéntica (LSDB).\n- Soporta áreas jerárquicas (Área 0 backbone) y métrica basada en coste (ancho de banda).',
          keyFormulasOrRules: [
            'RIP intercambia tablas completas cada 30 segundos vía UDP puerto 520.',
            'OSPF envía actualizaciones solo cuando hay cambios y mantiene vecinos vivos con paquetes Hello cada 10s.'
          ],
          examPitfalls: [
            'Afirmar que Split Horizon por sí solo previene todos los bucles en topologías de 3 o más routers: solo previene bucles de dos nodos.',
            'Olvidar que todas las áreas secundarias de OSPF deben conectarse obligatoriamente al Área 0 (Backbone).'
          ]
        }
      },
      {
        id: 'ar-tcp-congestion',
        title: 'Control de Congestión TCP: Tahoe, Reno & Fast Recovery',
        subtitle: 'Slow Start, Congestion Avoidance, Fast Retransmit y comportamiento ante pérdidas',
        importance: 'ALTA RENTABILIDAD',
        difficulty: 'Experto',
        timeEstimateMin: 45,
        feynmanExplanation: {
          intuition: 'TCP envía datos a la red tanteando la tubería. Empieza enviando 1 paquete, si llega bien envía 2, luego 4, luego 8 (crecimiento exponencial). Cuando llega a un umbral seguro, sube despacio de 1 en 1. Si la red se atasca y pierde un paquete, pega un frenazo brusco para no colapsar Internet.',
          analogy: 'Conducir en una carretera con niebla: aceleras hasta que ves una luz de freno. Si solo ves una advertencia suave (3 ACKs duplicados), reduces la velocidad a la mitad (Reno). Si te estrellas de golpe contra un muro (Timeout), paras el coche a cero e inicias en primera marcha.',
          formalTheory: 'El algoritmo de control de congestión de TCP mantiene la ventana de congestión (cwnd) y el umbral ssthresh:\n1. Slow Start (Arranque Lento): cwnd empieza en 1 MSS y se duplica cada RTT (crecimiento exponencial) hasta alcanzar ssthresh.\n2. Congestion Avoidance: Al superar ssthresh, cwnd crece linealmente (+1 MSS por cada RTT).\n3. Detección de pérdida por 3 ACKs Duplicados (Pérdida Leve):\n- TCP Tahoe: ssthresh = cwnd / 2; cwnd = 1 MSS (vuelve a Slow Start).\n- TCP Reno: Fast Retransmit (reenvía el paquete) y entra en Fast Recovery: ssthresh = cwnd / 2; cwnd = ssthresh + 3 MSS; continúa en Evitación de Congestión al recibir nuevo ACK.\n4. Detección de pérdida por Timeout (Pérdida Grave): Ambos bajan cwnd a 1 MSS y reinician Slow Start.',
          keyFormulasOrRules: [
            'Ventana efectiva de emisión W = min(cwnd, rwnd), donde rwnd es el control de flujo del receptor.',
            'Tahoe ante cualquier pérdida -> cwnd = 1.',
            'Reno ante 3 DUPACKs -> Fast Recovery (mantiene cwnd a la mitad).'
          ],
          examPitfalls: [
            'Confundir control de flujo (rwnd, protege al receptor) con control de congestión (cwnd, protege a la red).',
            'En preguntas sobre TCP Reno, reiniciar cwnd a 1 cuando la pérdida se detecta por 3 ACKs duplicados: en Reno solo baja a 1 si la pérdida es por TIMEOUT.'
          ]
        }
      }
    ]
  },

  // 8. ST - Servicios Telemáticos
  {
    id: 'st',
    code: '1911',
    name: 'Servicios Telemáticos',
    shortName: 'ST',
    semester: '2º Cuatrimestre · 3º Grado',
    color: 'from-violet-600 to-purple-800',
    accentColor: 'violet',
    icon: 'ShieldCheck',
    tagline: 'Criptografía asimétrica RSA, seguridad TLS/SSL, DNS, HTTP/2 y servicios de red',
    formulaCheatSheet: {
      title: 'Formulario & Leyes de Examen de ST',
      items: [
        {
          label: 'Generación de Claves RSA',
          formulaOrLaw: 'n = p \\times q, \\quad \\phi(n) = (p-1)(q-1), \\quad e \\cdot d \\equiv 1 \\pmod{\\phi(n)}',
          notes: 'Clave pública = (e, n); Clave privada = (d, n). Cifrado: C = M^e mod n. Descifrado: M = C^d mod n.'
        },
        {
          label: 'Tiempo de Descarga Web con HTTP (RTT)',
          formulaOrLaw: 'T_{no\\_persistente} = 2 RTT + \\sum 2 RTT_{obj}, \\quad T_{persistente\\_pipeline} = 2 RTT + 1 RTT_{todos\\_objs}',
          notes: 'Cada conexión TCP requiere 1 RTT para el handshake SYN/SYN-ACK.'
        },
        {
          label: 'Intercambio Diffie-Hellman',
          formulaOrLaw: 'A = g^a \\pmod p, \\quad B = g^b \\pmod p, \\quad K = B^a = A^b = g^{ab} \\pmod p',
          notes: 'Permite acordar una clave simétrica secreta K sobre un canal inseguro sin revelar a ni b.'
        },
        {
          label: 'Propiedad de Aritmética Modular',
          formulaOrLaw: '(a \\times b) \\pmod n = [(a \\pmod n) \\times (b \\pmod n)] \\pmod n',
          notes: 'Indispensable para calcular potencias en exámenes sin calculadora científica.'
        }
      ]
    },
    concepts: [
      {
        id: 'st-rsa-web',
        title: 'Criptografía Asimétrica RSA & Firma Digital',
        subtitle: 'Generación de claves (e, d, n), función phi de Euler y exponenciación modular',
        importance: 'CRÍTICO EN EXAMEN',
        difficulty: 'Avanzado',
        timeEstimateMin: 45,
        interactiveDemoId: 'rsa-crypto',
        feynmanExplanation: {
          intuition: 'Un candado que se cierra con un clic de la mano (clave pública, todo el mundo puede meter una carta en el buzón y cerrarlo), pero que solo se puede abrir con una llave maestra que solo tú guardas en tu bolsillo (clave privada).',
          analogy: 'Firma digital: Si en lugar de usar la llave para abrir, usas tu llave secreta para ponerle tu sello personal al mensaje, cualquiera que tenga el candado público puede comprobar que el sello solo pudiste ponerlo tú.',
          formalTheory: 'Algoritmo RSA (Rivest, Shamir, Adleman):\n1. Seleccionar dos números primos secretos p y q.\n2. Calcular el módulo público n = p × q.\n3. Calcular la función de Euler φ(n) = (p - 1) × (q - 1).\n4. Elegir un exponente público e tal que 1 < e < φ(n) y mcd(e, φ(n)) = 1.\n5. Calcular el exponente privado d mediante el inverso multiplicativo: d × e ≡ 1 (mod φ(n)).\nCifrado: Para un mensaje numérico M < n, C = Mᵉ mod n.\nDescifrado: M = Cᵈ mod n.\nFirma Digital: El emisor calcula el hash del documento H = h(doc) y lo cifra con su clave privada S = Hᵈ mod n. El receptor verifica calculando H\' = Sᵉ mod n y comprobando si H\' == h(doc).',
          keyFormulasOrRules: [
            'Condición crítica para e: debe ser coprimo con φ(n), NO con n.',
            'Confidencialidad: Se cifra con la clave pública del DESTINATARIO.',
            'Autenticidad/No repudio (Firma): Se cifra con la clave privada del EMISOR.'
          ],
          examPitfalls: [
            'Calcular φ(n) como p × q: un error garrafal en el examen de SSTT. φ(n) = (p-1)(q-1).',
            'Confundir con qué clave se cifra y con qué clave se firma.',
            'Intentar calcular potencias elevadas sin simplificar paso a paso con las propiedades del módulo.'
          ]
        }
      },
      {
        id: 'st-web-performance-rtt',
        title: 'Rendimiento HTTP & Cálculo de RTTs',
        subtitle: 'HTTP/1.0 no persistente, HTTP/1.1 con/sin pipelining y multiplexación HTTP/2',
        importance: 'CRÍTICO EN EXAMEN',
        difficulty: 'Avanzado',
        timeEstimateMin: 40,
        feynmanExplanation: {
          intuition: 'Si vas al supermercado a comprar 4 ingredientes para una pizza:\n- HTTP/1.0 No Persistente: Vas a la tienda, compras la masa, vuelves a casa. Vas a la tienda, compras el queso, vuelves a casa...\n- HTTP/1.1 Persistente sin Pipelining: Te quedas en la tienda, pides la masa, esperas a que te la den; luego pides el queso, esperas...\n- HTTP/1.1 con Pipelining: Llegas a la tienda y pides los 4 ingredientes juntos en un solo pedido.',
          analogy: 'RTT (Round Trip Time): El tiempo que tarda una carta postal en ir desde tu casa a la de tu amigo y volver la confirmación.',
          formalTheory: 'Cálculo del tiempo total para descargar un documento HTML base con N objetos embebidos:\n1. HTTP No Persistente (serie): 2 RTT (1 para TCP handshake + 1 para el HTML) + 2N RTT (para cada objeto se abre una nueva TCP y se descarga). Tiempo total = 2 RTT + 2N RTT.\n2. HTTP Persistente sin Pipelining: 2 RTT iniciales (TCP + HTML) + N RTT (la conexión TCP queda abierta; cada objeto requiere 1 RTT para petición y respuesta secuencial). Tiempo total = 2 RTT + N RTT.\n3. HTTP Persistente con Pipelining: 2 RTT iniciales + 1 RTT para solicitar todos los N objetos en paralelo por la misma conexión TCP. Tiempo total = 3 RTT (asumiendo ancho de banda suficiente).',
          keyFormulasOrRules: [
            'Handshake TCP de 3 vías cuesta 1 RTT.',
            'Petición y descarga del HTML base cuesta 1 RTT.',
            'HTTP/2 elimina el bloqueo Head-of-Line (HoL) a nivel de aplicación multiplexando streams binarios sobre una única conexión TCP.'
          ],
          examPitfalls: [
            'Olvidar sumar el RTT del handshake de TCP al inicio de cada conexión no persistente.',
            'No contabilizar los retardos de resolución DNS previos si el cliente no tiene la IP en su caché local.'
          ]
        }
      },
      {
        id: 'st-ssl-tls-handshake',
        title: 'Seguridad en Transporte: Handshake TLS/SSL',
        subtitle: 'Certificados X.509, autenticación de servidor y negociación del Pre-Master Secret',
        importance: 'ALTA RENTABILIDAD',
        difficulty: 'Experto',
        timeEstimateMin: 45,
        feynmanExplanation: {
          intuition: 'Cuando entras a la web de tu banco con https://, tu navegador no conoce a ese servidor de nada. El banco le enseña su DNI digital (el certificado SSL emitido por una Autoridad de Certificación como DigiCert o Let\'s Encrypt). Tu navegador comprueba que la firma de ese DNI es auténtica y acuerdan una clave secreta para la sesión.',
          analogy: 'Un pasaporte sellado por el gobierno: el oficial de aduanas de Japón no te conoce a ti, pero conoce el sello oficial de la Fábrica de Moneda y Timbre de España.',
          formalTheory: 'Flujo del Handshake TLS 1.2 clásico con RSA:\n1. ClientHello: El cliente envía versiones soportadas, suites de cifrado y un número aleatorio ClientRandom.\n2. ServerHello: El servidor elige la suite y envía su ServerRandom.\n3. Certificate: El servidor envía su certificado X.509 con su clave pública.\n4. ServerHelloDone.\n5. ClientKeyExchange: El cliente genera el Pre-Master Secret (48 bytes), lo cifra con la clave pública del servidor y lo envía.\n6. Ambas partes derivan independientemente las claves de sesión simétricas (Master Secret) a partir de ClientRandom, ServerRandom y Pre-Master Secret.\n7. ChangeCipherSpec & Finished: Intercambio de mensajes cifrados para verificar la integridad del handshake.',
          keyFormulasOrRules: [
            'Un atacante Man-in-the-Middle pasivo no puede descifrar la conversación porque no posee la clave privada del servidor para descifrar el Pre-Master Secret.',
            'Perfect Forward Secrecy (PFS): Se consigue usando Diffie-Hellman efímero (ECDHE) en lugar de RSA para el intercambio de claves.'
          ],
          examPitfalls: [
            'Afirmar que SSL cifra toda la conversación con RSA: ¡Falso! RSA solo se usa para autenticar y acordar la clave; los datos de la sesión se cifran con un cifrado simétrico rápido (como AES-GCM).',
            'Confundir autenticación de servidor (obligatoria en la web) con autenticación mutua de cliente (opcional).'
          ]
        }
      }
    ]
  },

  // 9. SI - Sistemas Inteligentes
  {
    id: 'si',
    code: '1906',
    name: 'Sistemas Inteligentes',
    shortName: 'SI',
    semester: '2º Cuatrimestre · 3º Grado',
    color: 'from-amber-500 to-yellow-600',
    accentColor: 'amber',
    icon: 'Navigation',
    tagline: 'Algoritmo A*, Poda Alfa-Beta, Algoritmos Genéticos y Espacios de Estados',
    formulaCheatSheet: {
      title: 'Formulario & Heurísticas de Examen de SI',
      items: [
        {
          label: 'Evaluación del Algoritmo A*',
          formulaOrLaw: 'f(n) = g(n) + h(n)',
          notes: 'g(n) = Coste exacto acumulado desde origen hasta n; h(n) = Estimación heurística desde n hasta objetivo.'
        },
        {
          label: 'Condición de Admisibilidad',
          formulaOrLaw: 'h(n) \\le h^*(n) \\quad \\forall n',
          notes: 'h nunca sobreestima el coste real al objetivo. Garantiza solución óptima en búsqueda en árbol.'
        },
        {
          label: 'Condición de Monotonía / Consistencia',
          formulaOrLaw: 'h(n) \\le c(n, a, n\') + h(n\')',
          notes: 'Satisface la desigualdad triangular. Garantiza solución óptima en búsqueda en grafo sin reabrir cerrados.'
        },
        {
          label: 'Condición de Poda Alfa-Beta',
          formulaOrLaw: '\\alpha \\ge \\beta \\implies \\text{Poda de la rama}',
          notes: 'alpha = Mejor opción encontrada hasta el momento para MAX; beta = Mejor opción para MIN.'
        },
        {
          label: 'Probabilidad de Aceptación en Temple Simulado',
          formulaOrLaw: 'P(\\Delta E, T) = e^{-\\frac{\\Delta E}{T}}',
          notes: 'Si la nueva solución es peor (Delta E > 0), se acepta con probabilidad exponencial decreciente según la temperatura T.'
        }
      ]
    },
    concepts: [
      {
        id: 'si-search-minimax',
        title: 'Algoritmo A*, Admisibilidad & Monotonía',
        subtitle: 'Búsqueda informada en grafos, listas Abiertos/Cerrados y garantías de optimalidad',
        importance: 'CRÍTICO EN EXAMEN',
        difficulty: 'Avanzado',
        timeEstimateMin: 45,
        interactiveDemoId: 'astar-search',
        feynmanExplanation: {
          intuition: 'Para viajar de Murcia a Madrid en coche, no avanzas en línea recta por caminos de cabras ni das vueltas en círculo hacia Almería. Usas un mapa que combina los kilómetros que ya llevas recorridos (g) con una brújula que apunta en dirección a Madrid (h). Eso es A*.',
          analogy: 'Un GPS inteligente: g(n) es el cuentakilómetros del salpicadero; h(n) es la distancia euclídea en línea recta a vista de pájaro.',
          formalTheory: 'El algoritmo A* expande en cada paso el nodo de la lista de Abiertos (Frontera) que minimiza la función de evaluación f(n) = g(n) + h(n).\n1. Admisibilidad: h(n) es admisible si para todo nodo n, 0 ≤ h(n) ≤ h*(n), donde h*(n) es el coste real del camino óptimo desde n hasta el objetivo. Si h es admisible, A* en árbol siempre halla el camino óptimo.\n2. Consistencia o Monotonía: h es monótona si para todo nodo n y sucesor n\' generado mediante la acción a, h(n) ≤ c(n, a, n\') + h(n\'). La monotonía implica admisibilidad y garantiza que la secuencia de valores f de los nodos expandidos es no decreciente, por lo que NUNCA es necesario reabrir un nodo que ya fue pasado a la lista de Cerrados.',
          keyFormulasOrRules: [
            'Si h(n) = 0 para todo n, A* se convierte exactamente en el Algoritmo de Dijkstra (Búsqueda de Costo Uniforme).',
            'Si h1 y h2 son admisibles, h_max(n) = max(h1(n), h2(n)) también es admisible y domina a ambas (explora menos nodos).'
          ],
          examPitfalls: [
            'Verificar la admisibilidad solo en el nodo raíz: la condición h(n) ≤ h*(n) debe cumplirse en TODOS los nodos del grafo.',
            'Confundir búsqueda en árbol con búsqueda en grafo: en grafo, si h no es monótona, un nodo en Cerrados podría necesitar ser reabierto si se encuentra un camino mejor.',
            'No evaluar la condición de parada en el momento de EXTRAER el nodo de la lista de abiertos (comprobar si es meta al generarlo puede dar una solución no óptima).'
          ]
        }
      },
      {
        id: 'si-adversarial-minimax-alphabeta',
        title: 'Búsqueda con Adversarios: Minimax & Poda Alfa-Beta',
        subtitle: 'Juegos de suma cero, profundidad de análisis y condiciones de corte alfa >= beta',
        importance: 'CRÍTICO EN EXAMEN',
        difficulty: 'Avanzado',
        timeEstimateMin: 45,
        feynmanExplanation: {
          intuition: 'En el ajedrez juegas asumiendo que tu rival es un genio que siempre va a elegir la jugada que más te fastidie. Tú intentas maximizar tu ventaja (nodo MAX), y tu rival intenta minimizarla (nodo MIN).',
          analogy: 'Poda Alfa-Beta: Si estás buscando comprar un coche y en el concesionario A ya has encontrado uno por 10.000€, vas al concesionario B. En cuanto el vendedor de B te dice que su coche más barato vale 12.000€, te das la vuelta de inmediato: no necesitas seguir escuchando si tiene techo solar o asientos de cuero.',
          formalTheory: 'En árboles de juegos bipersonales de suma cero con información perfecta:\n- Nodo MAX: devuelve el valor máximo de sus hijos.\n- Nodo MIN: devuelve el valor mínimo de sus hijos.\nPoda Alfa-Beta mantiene dos valores durante el recorrido en profundidad (DFS):\n- α: El mejor valor (más alto) que MAX tiene garantizado hasta el momento en cualquier punto de elección a lo largo del camino.\n- β: El mejor valor (más bajo) que MIN tiene garantizado hasta el momento.\nCondición de poda: Si en algún momento en un nodo se cumple que α ≥ β, se interrumpe la exploración del resto de ramas de ese nodo (poda alfa si el corte ocurre en nodo MIN, poda beta si ocurre en nodo MAX).',
          keyFormulasOrRules: [
            'α inicial = -∞, β inicial = +∞.',
            'MAX actualiza solo α: α = max(α, v).',
            'MIN actualiza solo β: β = min(β, v).',
            'Con ordenación óptima de movimientos (el mejor primero), la complejidad temporal pasa de O(bᵐ) a O(b^(m/2)).'
          ],
          examPitfalls: [
            'Modificar el valor de alfa en un nodo MIN: los nodos MIN solo actualizan BETA.',
            'Propagar hacia arriba los valores de alfa y beta de vuelta a los padres: solo se propaga el valor de evaluación v del nodo.',
            'Podar cuando α > β en lugar de α ≥ β.'
          ]
        }
      },
      {
        id: 'si-genetic-algorithms',
        title: 'Algoritmos Genéticos & Problema de las N-Reinas',
        subtitle: 'Representación cromosómica, selección por torneo/ruleta, operadores de cruce y GAlib',
        importance: 'ALTA RENTABILIDAD',
        difficulty: 'Avanzado',
        timeEstimateMin: 40,
        feynmanExplanation: {
          intuition: 'Inspirado en la evolución de Darwin: tienes una población de soluciones candidatas. Las que mejor resuelven el problema sobreviven y se reproducen combinando sus genes. De vez en cuando ocurre una mutación aleatoria para que no se estanquen. Tras 100 generaciones, tienes soluciones casi perfectas.',
          analogy: 'Cría selectiva de perros o caballos veloces a lo largo de los siglos.',
          formalTheory: 'Componentes de un Algoritmo Genético (AG):\n1. Representación: En el problema de las N-Reinas, un vector de enteros [c1, c2, ... cn] donde el índice es la columna y el valor es la fila de la reina.\n2. Función de Aptitud (Fitness): Debe maximizarse (ej. número de pares de reinas que NO se atacan mutuamente).\n3. Selección: Ruleta (probabilidad proporcional a fitness) o Torneo (elegir k individuos al azar y quedarse con el mejor).\n4. Cruce (Crossover): Cruce en 1 punto, 2 puntos o cruces específicos para permutaciones (PMX, Order Crossover).\n5. Mutación: Cambia aleatoriamente el valor de un gen con probabilidad baja pm (ej. 1% a 5%) para mantener diversidad genética.',
          keyFormulasOrRules: [
            'Probabilidad de selección en ruleta: P(i) = Fitness(i) / Σ Fitness(j).',
            'En las prácticas de SI con GAlib (C++): uso de GA1DArrayGenome y operadores de mutación swap.'
          ],
          examPitfalls: [
            'Usar una tasa de mutación excesivamente alta (ej. 50%): convierte el algoritmo en una búsqueda aleatoria sin memoria evolutiva.',
            'Usar cruce estándar de un punto en problemas de permutación (como el viajante de comercio TSP o N-reinas sin repetir filas): genera cromosomas ilegales con valores duplicados.'
          ]
        }
      }
    ]
  }
];
