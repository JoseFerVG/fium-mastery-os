import { Subject } from '../types';

export const COURSES: Subject[] = [
  {
    id: 'aoc',
    code: '1909',
    name: 'Arquitectura y Organización de Computadores',
    shortName: 'AOC',
    semester: '1º Cuatrimestre · 3º Grado',
    color: 'from-blue-600 to-indigo-700',
    accentColor: 'blue',
    icon: 'Cpu',
    tagline: 'De la instrucción en binario al hardware: Pipelines, Cachés y Rendimiento Extremo',
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
          notes: 'Para jerarquías de 2 niveles: AMAT = t_{L1} + m_{L1} \\times (t_{L2} + m_{L2} \\times penalizacion_{L2}).'
        },
        {
          label: 'Desglose de Bits de Dirección en Caché',
          formulaOrLaw: 'Bits Total = Tag + Index + Offset',
          notes: 'Offset = log2(Tamaño Bloque en Bytes); Index = log2(Número de Conjuntos); Tag = Resto.'
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
          formalTheory: 'El pipeline estándar MIPS/RISC-V consta de 5 etapas: IF (Instruction Fetch), ID (Instruction Decode & Register Read), EX (Execution / ALU), MEM (Memory Access), WB (Write Back al banco de registros). Un riesgo RAW (Read After Write) ocurre cuando una instrucción I2 necesita leer un registro que I1 aún no ha terminado de escribir. Con adelantamiento (Forwarding), el resultado producido en la ALU en la etapa EX o leído en MEM se cablea directamente a la entrada de la ALU en el ciclo siguiente, evitando paradas en instrucciones ALU-ALU. Sin embargo, para la secuencia LW + uso inmediato, la lectura de datos de memoria ocurre al final de MEM, por lo que es IMPOSIBLE adelantar a tiempo para el inicio de EX: se produce obligatoriamente 1 ciclo de parada (Stall / Bubble).',
          keyFormulasOrRules: [
            'Adelantamiento EX/MEM -> EX: Si I1 escribe en Rd y I2 lee de Rs/Rt en el ciclo siguiente.',
            'Adelantamiento MEM/WB -> EX: Si I1 escribe en Rd y I3 lee de Rs/Rt dos ciclos después.',
            'Load-Use Hazard: LW R1, 0(R2) seguido inmediatamente de ADD R3, R1, R4 SIEMPRE requiere 1 ciclo de parada, incluso con el forwarding más avanzado.'
          ],
          examPitfalls: [
            'Olvidar que el registro $zero ($0) nunca cambia: si la instrucción anterior escribe en $0, NO hay forwarding ni dependencia que deba parar el cauce.',
            'Confundir paradas con adelantamiento: asumir erróneamente que el forwarding elimina la parada del Load-Use.',
            'En saltos condicionales (BEQ/BNE), olvidar si la resolución del salto se evalúa en ID (1 ciclo de penalización) o en EX (2 ciclos de penalización).'
          ]
        },
        codeOrExample: {
          language: 'mips',
          code: `# Ejemplo clásico de examen:
LW   $t1, 0($t0)    # Carga dato de memoria a $t1 (Disponible al final de MEM)
ADD  $t2, $t1, $t3  # Necesita $t1 en EX -> ¡PARADA OBLIGATORIA (1 burbuja)!
SUB  $t4, $t2, $t5  # Necesita $t2 en EX -> Resuelto por Forwarding EX/MEM -> EX
SW   $t4, 4($t0)    # Necesita $t4 en MEM -> Resuelto por Forwarding`,
          explanation: 'En este código, el procesador inserta una burbuja entre LW y ADD. Entre ADD y SUB, la ALU pasa el resultado directamente sin esperar a que se escriba en el banco de registros.'
        }
      },
      {
        id: 'aoc-cache-design',
        title: 'Jerarquía de Memoria: Cálculo de Cachés',
        subtitle: 'Caché Directa, N-Vías y Algoritmos de Reemplazo (LRU)',
        importance: 'CRÍTICO EN EXAMEN',
        difficulty: 'Avanzado',
        timeEstimateMin: 40,
        interactiveDemoId: 'cache',
        feynmanExplanation: {
          intuition: 'Una caché es como tu mesa de trabajo, mientras que la RAM es la estantería del fondo del almacén. Si tienes que ir al almacén tardas 100 segundos. Si lo tienes en la mesa tardas 1 segundo. El truco del hardware es adivinar qué papeles vas a necesitar mediante localidad espacial (si lees la página 4, te traes las páginas 4, 5, 6 en el mismo bloque) y localidad temporal (si acabas de usar un dato, lo volverás a usar pronto).',
          analogy: 'Caché Directa: Cada libro tiene exactamente una balda fija asignada según su código postal. Si dos libros van a la misma balda, se expulsan mutuamente aunque el resto de la estantería esté vacía (Fallo de conflicto). Asociativa por conjuntos: Cada libro puede ir a una de N baldas libres dentro de su sección.',
          formalTheory: 'Dada una dirección de memoria de $M$ bits: \n1) Offset = $\\log_2(\\text{Tamaño del bloque en bytes})$. \n2) Número de bloques en la caché = $\\frac{\\text{Capacidad de caché}}{\\text{Tamaño del bloque}}$. \n3) Número de conjuntos ($S$) = $\\frac{\\text{Número de bloques}}{N}$ (donde $N$ es la asociatividad. Para mapeo directo $N=1$). \n4) Índice (Index) = $\\log_2(S)$. \n5) Etiqueta (Tag) = $M - \\text{Index} - \\text{Offset}$. \nPara saber el tamaño total en bits del hardware de la caché: debe sumarse el bit de validez (1 bit), los bits de suciedad (Dirty bit en Write-Back) y los bits de Tag por cada línea.',
          keyFormulasOrRules: [
            'Offset determina qué byte concreto dentro del bloque se lee.',
            'Index determina a qué conjunto/línea se dirige la búsqueda.',
            'Tag se compara en paralelo con los tags de las vías del conjunto para confirmar un HIT.'
          ],
          examPitfalls: [
            'Calcular el número de conjuntos usando la capacidad de la caché en KB sin pasarla a bytes ($1\\text{ KB} = 1024\\text{ bytes}$, no $1000$).',
            'Confundir fallos forzosos (Cold/Compulsory), de capacidad (la caché entera es pequeña) y de conflicto (la asociatividad es insuficiente).',
            'En políticas de escritura: olvidar que Write-Back requiere un bit Dirty por línea para saber si hay que volcar a memoria al desalojar.'
          ]
        }
      }
    ]
  },
  {
    id: 'aso',
    code: '1907',
    name: 'Ampliación de Sistemas Operativos',
    shortName: 'ASO',
    semester: '1º Cuatrimestre · 3º Grado',
    color: 'from-amber-600 to-orange-700',
    accentColor: 'amber',
    icon: 'Layers',
    tagline: 'Las entrañas del Kernel de Linux: Concurrencia, Memoria Virtual y Syscalls',
    formulaCheatSheet: {
      title: 'Formulario & Algoritmos Clave de ASO',
      items: [
        {
          label: 'Traducción de Dirección Virtual a Física',
          formulaOrLaw: 'Dirección Física = (Marco \\times TamañoPágina) + Offset',
          notes: 'Número de Página Virtual = Dirección / TamañoPágina; Offset = Dirección % TamañoPágina.'
        },
        {
          label: 'Algoritmo del Banquero (Estado Seguro)',
          formulaOrLaw: 'Need[i][j] = Max[i][j] - Allocation[i][j] \\le Available[j]',
          notes: 'Si un proceso puede terminar con los recursos disponibles, libera su asignación: Available = Available + Allocation.'
        },
        {
          label: 'Semáforos de Dijkstra',
          formulaOrLaw: 'wait(S): S > 0 ? S-- : bloquear; \\quad signal(S): despertar_hilo() || S++',
          notes: 'Operaciones estrictamente atómicas garantizadas por hardware o deshabilitación de interrupciones.'
        }
      ]
    },
    concepts: [
      {
        id: 'aso-sync-semaphores',
        title: 'Sincronización: Semáforos, Mutex y Variables de Condición',
        subtitle: 'Resolviendo Productores-Consumidores y Secciones Críticas sin Deadlocks',
        importance: 'CRÍTICO EN EXAMEN',
        difficulty: 'Avanzado',
        timeEstimateMin: 45,
        feynmanExplanation: {
          intuition: 'Imagina un baño con 1 llave. Si está libre, coges la llave, entras, echas el pestillo (sección crítica) y cuando sales devuelves la llave. Si alguien intenta entrar mientras tú estás dentro, debe esperar fuera en la cola. Un semáforo contador es como un parking con 10 plazas: un cartel digital indica cuántas quedan. Cada coche que entra resta 1; si llega a 0, la barrera no se levanta hasta que alguien salga y sume 1.',
          analogy: 'Mutex = Semáforo binario con noción de PROPIETARIO (solo quien cerró el candado puede abrirlo). Semáforo contador = Señalizador genérico (un hilo puede hacer wait y otro hacer signal para avisar de que un dato está listo).',
          formalTheory: 'Una condición de carrera (race condition) se produce cuando dos o más hilos acceden y modifican datos compartidos concurrentemente y el resultado final depende del orden de ejecución. Para garantizar la exclusión mutua deben cumplirse 4 requisitos: 1) Dos procesos no pueden estar simultáneamente en su sección crítica. 2) No se deben hacer suposiciones sobre la velocidad ni el número de CPUs. 3) Ningún proceso fuera de su sección crítica puede bloquear a otros. 4) Ningún proceso debe esperar arbitrariamente mucho tiempo (ausencia de inanición / starvation).',
          keyFormulasOrRules: [
            'Productor-Consumidor requiere 3 semáforos: `mutex` (inicializado a 1), `huecos_libres` (inicializado a N), `elementos_disponibles` (inicializado a 0).',
            'REGLA DE ORO DE EXAMEN: El semáforo de sincronización (`wait(huecos)`) se ejecuta SIEMPRE ANTES que el semáforo de exclusión mutua (`wait(mutex)`). Si lo haces al revés, se produce un DEADLOCK instantáneo.'
          ],
          examPitfalls: [
            'Invertir el orden de los waits: hacer `wait(mutex)` antes de `wait(elementos)` bloquea el buffer mientras el consumidor duerme con el candado en la mano.',
            'Confundir `pthread_cond_signal` con semáforos: las variables de condición NO tienen memoria histórica; si haces signal y nadie está esperando en wait, la señal se pierde para siempre.'
          ]
        },
        codeOrExample: {
          language: 'c',
          code: `// Patrón canónico de examen en Linux/C:
sem_t mutex, huecos, elementos;

void* productor(void* arg) {
    while(1) {
        Item item = producir();
        sem_wait(&huecos);     // 1º Esperar a que haya espacio
        sem_wait(&mutex);      // 2º Entrar a la sección crítica (NUNCA AL REVÉS)
        insertar_buffer(item);
        sem_post(&mutex);      // 3º Salir de sección crítica
        sem_post(&elementos);  // 4º Notificar al consumidor
    }
}`,
          explanation: 'Observa el orden estricto de los sem_wait. Si el buffer se llena y se hiciera primero sem_wait(&mutex), el productor bloquearía el cerrojo y el consumidor jamás podría entrar a sacar elementos.'
        }
      },
      {
        id: 'aso-virtual-memory',
        title: 'Memoria Virtual, TLB y Algoritmos de Reemplazo',
        subtitle: 'Paginación Multinivel, Fallo de Página y Reemplazo (FIFO, LRU, Reloj)',
        importance: 'CRÍTICO EN EXAMEN',
        difficulty: 'Avanzado',
        timeEstimateMin: 50,
        interactiveDemoId: 'virtual-memory',
        feynmanExplanation: {
          intuition: 'Cada programa cree que es el único dueño de toda la memoria RAM del ordenador (un mapa continuo desde la dirección 0 hasta el final). En realidad, el sistema operativo corta esa memoria en trocitos idénticos llamados "páginas" y los esparce por donde haya hueco en la RAM física (en "marcos"). La tabla de páginas es el diccionario que traduce de la dirección imaginaria del programa a la dirección física real.',
          analogy: 'El TLB (Translation Lookaside Buffer) es como un post-it pegado en la pantalla con las últimas traducciones que has usado. En vez de buscar en el diccionario gordo (la tabla de páginas en RAM), miras el post-it. Si está ahí (TLB Hit), la traducción tarda 0 nanosegundos.',
          formalTheory: 'Una dirección virtual se divide en: Número de Página Virtual (VPN) y Desplazamiento (Offset). Con páginas de $4\\text{ KB}$ ($2^{12}$ bytes), los 12 bits inferiores son el Offset. Si una página referenciada no tiene el bit de presencia a 1, la MMU dispara una trampa al sistema operativo: un Fallo de Página (Page Fault). El kernel debe buscar la página en el disco de Swap, encontrar un marco libre en RAM (o desalojar uno usando una política de reemplazo) y actualizar la tabla de páginas.',
          keyFormulasOrRules: [
            'Algoritmo Óptimo (Belady): Desaloja la página que NO se usará durante el período de tiempo más largo en el futuro (inviable en la práctica, sirve como cota teórica superior).',
            'LRU (Least Recently Used): Desaloja la página que no se ha usado desde hace más tiempo.',
            'Algoritmo del Reloj (Segunda Oportunidad): Usa un puntero circular y 1 bit de referencia. Si el bit es 1, lo pone a 0 y avanza; si es 0, esa página es la víctima seleccionada.'
          ],
          examPitfalls: [
            'Anomalía de Belady: recordar que FIFO PUEDE aumentar el número de fallos de página al aumentar el número de marcos de memoria. ¡LRU y Óptimo nunca sufren anomalía de Belady porque son algoritmos de pila!',
            'Olvidar multiplicar el marco físico por el tamaño de página al calcular la dirección física final.'
          ]
        }
      }
    ]
  },
  {
    id: 'alf',
    code: '1896',
    name: 'Autómatas y Lenguajes Formales',
    shortName: 'ALF',
    semester: '1º Cuatrimestre · 2º Grado',
    color: 'from-emerald-600 to-teal-700',
    accentColor: 'emerald',
    icon: 'GitBranch',
    tagline: 'Fundamentos matemáticos de la computación: Autómatas, Gramáticas y Límites de Turing',
    formulaCheatSheet: {
      title: 'Formulario & Plantillas Infalibles de ALF',
      items: [
        {
          label: 'Lema del Bombeo para Lenguajes Regulares',
          formulaOrLaw: '\\forall L \\in Reg, \\exists n \\ge 1 \\text{ tal que } \\forall w \\in L, |w| \\ge n, \\exists w = xyz \\text{ con: } |y| \\ge 1, |xy| \\le n, \\forall i \\ge 0: xy^i z \\in L',
          notes: 'Para demostrar que un lenguaje NO es regular: supón que sí lo es por reducción al absurdo, elige una cadena astuta w en función de n, analiza los posibles cortes xy y bombea con i para hallar una contradicción.'
        },
        {
          label: 'Equivalencia de Autómatas (Subconjuntos)',
          formulaOrLaw: '\\delta\'(S, a) = \\bigcup_{q \\in S} \\delta(q, a)',
          notes: 'Un estado en el AFD resultante representa un conjunto de estados del AFND original.'
        }
      ]
    },
    concepts: [
      {
        id: 'alf-pumping-lemma',
        title: 'Lema del Bombeo: Plantilla de Demostración Perfecta',
        subtitle: 'Cómo sacar la máxima nota demostrando que un lenguaje NO es regular',
        importance: 'PUNTUACIÓN MÁXIMA',
        difficulty: 'Experto',
        timeEstimateMin: 45,
        feynmanExplanation: {
          intuition: 'Un autómata finito tiene una memoria finita (digamos $n$ estados). Si le metes una palabra de longitud mayor o igual a $n$, por el principio del palomar tiene que repetir al menos un estado en su camino. Eso significa que en la palabra hay un bucle en el medio ($y$). Si el lenguaje fuera regular, podrías dar tantas vueltas al bucle como quieras ($y^0, y^1, y^2, y^3...$) y la palabra seguiría perteneciendo al lenguaje. Si encuentras una palabra donde al inflar el bucle rompes la regla del lenguaje, demuestras que es IMPOSIBLE que un autómata finito lo reconozca.',
          analogy: 'Imagínate un contador que solo tiene dígitos del 0 al 9. Si quieres contar hasta 100 cosas, obligatoriamente tienes que reciclar números. Si el lenguaje exige que el número de "a" sea exactamente igual al de "b" ($a^n b^n$), el autómata no puede contarlas porque su memoria es finita.',
          formalTheory: 'Estructura formal obligatoria de la demostración en examen: \n1. Suponemos por reducción al absurdo que $L$ es regular. \n2. Por el Lema del Bombeo, existe una constante de bombeo $n \\ge 1$. \n3. Elegimos una cadena $w \\in L$ tal que $|w| \\ge n$. (Ejemplo para $L = \\{a^k b^k\\}$: elegimos $w = a^n b^n$). \n4. Por el lema, $w = xyz$ con $|xy| \\le n$ y $|y| \\ge 1$. \n5. Como $|xy| \\le n$, la subcadena $xy$ está formada EXCLUSIVAMENTE por letras "a", por lo que $y = a^k$ con $1 \\le k \\le n$. \n6. Bombeamos eligiendo un $i \\neq 1$ (ejemplo $i = 0$ o $i = 2$): la cadena $x y^2 z = a^{n+k} b^n$. \n7. Como $k \\ge 1$, el número de "a" ($n+k$) es estrictamente distinto del número de "b" ($n$), por tanto $x y^2 z \\notin L$. \n8. Contradicción con el Lema del Bombeo. Por tanto, $L$ no es regular.',
          keyFormulasOrRules: [
            'Elección de cadena: $w$ DEBE depender de $n$ (nunca fijes $n = 5$ o un número concreto).',
            'Restricción $|xy| \\le n$: Garantiza que $y$ cae en la primera porción de la cadena, limitando los casos posibles.',
            'Restricción $|y| \\ge 1$: Garantiza que estás bombeando algo real (no la cadena vacía).'
          ],
          examPitfalls: [
            'Elegir un valor numérico para $n$: suspende automáticamente el ejercicio. $n$ es una constante arbitraria.',
            'Elegir una cadena particular en vez de genérica: ej. decir "sea $w = aabb$". Debe ser $w = a^n b^n$.',
            'Olvidar justificar por qué $xy$ solo contiene el primer símbolo debido a la condición $|xy| \\le n$.'
          ]
        }
      },
      {
        id: 'alf-automata-runner',
        title: 'Conversión AFND a AFD y Minimización',
        subtitle: 'El algoritmo de subconjuntos y la tabla de transiciones paso a paso',
        importance: 'CRÍTICO EN EXAMEN',
        difficulty: 'Intermedio',
        timeEstimateMin: 40,
        interactiveDemoId: 'automata',
        feynmanExplanation: {
          intuition: 'Un autómata no determinista (AFND) es como tener un don de la ubicuidad: ante una letra, puede bifurcarse y estar en varios estados a la vez. Como una máquina real no puede dividirse mágicamente, creamos un autómata determinista (AFD) donde cada estado individual representa "el grupo de estados en los que el autómata original podría encontrarse al mismo tiempo".',
          analogy: 'Si en el laberinto hay dos puertas posibles ante la letra "0", en vez de elegir una, anotas en tu cuaderno: "ahora estoy en el grupo {A, B}". El grupo {A, B} se convierte en un único estado en el nuevo mapa.',
          formalTheory: 'Dado un AFND $N = (Q, \\Sigma, \\delta, q_0, F)$: \n1. El estado inicial del AFD $D$ es $\\epsilon\\text{-clausura}(q_0)$. \n2. Para cada nuevo conjunto de estados $S$ y cada símbolo $a \\in \\Sigma$, calculamos $\\delta_D(S, a) = \\epsilon\\text{-clausura}(\\bigcup_{q \\in S} \\delta(q, a))$. \n3. Repetimos hasta que no aparezcan nuevos conjuntos de estados. \n4. Un estado $S$ del AFD es final si contiene al menos un estado final del AFND original ($S \\cap F \\neq \\emptyset$).',
          keyFormulasOrRules: [
            'Minimización: Se eliminan estados inalcanzables desde el estado inicial.',
            'Tabla de pares (Moore): Se marcan pares $(p, q)$ distinguibles (uno es final y otro no). En rondas sucesivas, se marcan pares cuyas transiciones con algún símbolo caigan en un par ya marcado.'
          ],
          examPitfalls: [
            'Olvidar incluir transiciones épsilon ($\\epsilon$) si el autómata las tiene al calcular la clausura inicial.',
            'Olvidar marcar como finales todos los conjuntos que contengan al menos un estado de aceptación.'
          ]
        }
      }
    ]
  },
  {
    id: 'tds',
    code: '1905',
    name: 'Tecnologías de Desarrollo de Software',
    shortName: 'TDS',
    semester: '1º Cuatrimestre · 3º Grado',
    color: 'from-purple-600 to-pink-700',
    accentColor: 'purple',
    icon: 'PackageCheck',
    tagline: 'Arquitectura Profesional: Principios SOLID, Patrones GoF y Test-Driven Development (TDD)',
    officialRepoOrSite: 'https://github.com/cs-umu/tds-2026',
    formulaCheatSheet: {
      title: 'Los 5 Mandamientos SOLID & Patrones Clave',
      items: [
        {
          label: 'S - Single Responsibility Principle (SRP)',
          formulaOrLaw: 'Una clase debe tener una, y solo una, razón para cambiar.',
          notes: 'Separar lógica de negocio, persistencia en BD y presentación gráfica.'
        },
        {
          label: 'O - Open/Closed Principle (OCP)',
          formulaOrLaw: 'Abierto para la extensión, cerrado para la modificación.',
          notes: 'Usar polimorfismo e interfaces para añadir nuevos comportamientos sin tocar el código existente.'
        },
        {
          label: 'L - Liskov Substitution Principle (LSP)',
          formulaOrLaw: 'Los subtipos deben ser sustituibles por sus tipos base sin alterar la corrección.',
          notes: 'Si un Cuadrado hereda de Rectángulo y al cambiar el ancho cambias el alto, rompes LSP.'
        },
        {
          label: 'I - Interface Segregation Principle (ISP)',
          formulaOrLaw: 'Ningún cliente debe depender de métodos que no utiliza.',
          notes: 'Mejor muchas interfaces específicas y delgadas que una interfaz monolítica gigante.'
        },
        {
          label: 'D - Dependency Inversion Principle (DIP)',
          formulaOrLaw: 'Módulos de alto nivel no deben depender de módulos de bajo nivel; ambos dependen de abstracciones.',
          notes: 'Inyección de dependencias mediante constructores e interfaces.'
        }
      ]
    },
    concepts: [
      {
        id: 'tds-solid-gof',
        title: 'Masterclass SOLID & Patrones GoF Esenciales',
        subtitle: 'Factory, Strategy, Observer, Adapter y Decorator aplicados al Proyecto TDS',
        importance: 'CRÍTICO EN EXAMEN',
        difficulty: 'Avanzado',
        timeEstimateMin: 45,
        interactiveDemoId: 'solid-doctor',
        feynmanExplanation: {
          intuition: 'Programar sin patrones es como construir una casa sin planos: pones ladrillos hasta que se cae. Los patrones GoF no son código mágico, son plantillas de diseño probadas durante 30 años para resolver problemas repetitivos. Si necesitas cambiar algoritmos al vuelo, usas Strategy. Si necesitas que 5 pantallas se enteren cuando cambia un dato, usas Observer. Si una librería externa tiene nombres de funciones incompatibles, usas Adapter.',
          analogy: 'Strategy: Tu app de mapas puede calcular la ruta "en coche", "andando" o "en metro". En vez de un `if-else` monstruoso de 500 líneas en el controlador, creas una interfaz `RutaStrategy` con clases `RutaCoche`, `RutaAndando`. El mapa solo llama a `strategy.calcular()`.',
          formalTheory: 'Patrones indispensables para el proyecto de TDS (entrega 7 enero):\n1. **Strategy**: Encapsula una familia de algoritmos intercambiables en tiempo de ejecución. Evita switch-case gigantescos y cumple OCP.\n2. **Observer**: Define una dependencia uno-a-muchos entre objetos de modo que cuando uno cambia de estado, notifica automáticamente a todos sus dependientes (ej: interfaz gráfica reaccionando al modelo).\n3. **Factory Method / Abstract Factory**: Desacopla la creación de instancias complejas del código cliente que las consume.\n4. **Adapter**: Convierte la interfaz de una clase en otra interfaz que el cliente espera (imprescindible cuando integras librerías de terceros o APIs).\n5. **Singleton**: Garantiza que una clase solo tiene una instancia y proporciona un punto de acceso global (usar con prudencia por testabilidad).',
          keyFormulasOrRules: [
            'En TDD: Ciclo Rojo (Escribe test que falle) -> Verde (Escribe el código mínimo que pase el test) -> Refactor (Limpia sin romper tests).',
            'Test Doubles con Mockito: `when(servicioMock.obtenerDatos()).thenReturn(datos)` aislando la unidad bajo prueba.'
          ],
          examPitfalls: [
            'Herencia vs Composición: en exámenes de TDS penalizan fuertemente usar herencia para reutilizar código simple en vez de composición ("Favorece la composición sobre la herencia").',
            'Crear Mocks de la clase que estás probando (SUT): el objeto bajo prueba (System Under Test) se instancia REALMENTE; solo sus colaboradores dependientes se mockean.'
          ]
        },
        codeOrExample: {
          language: 'java',
          code: `// Patrón Strategy en Java (TDS):
public interface EstrategiaDescuento {
    double aplicar(double precioTotal);
}

public class DescuentoNavidad implements EstrategiaDescuento {
    @Override
    public double aplicar(double precio) { return precio * 0.85; } // 15% desc
}

public class CarritoCompra {
    private EstrategiaDescuento estrategia; // Inyección por interfaz (DIP y OCP)

    public CarritoCompra(EstrategiaDescuento estrategia) {
        this.estrategia = estrategia;
    }

    public double calcularTotal(double base) {
        return estrategia.aplicar(base);
    }
}`,
          explanation: 'Si mañana el profesor pide un nuevo descuento de "Estudiante", NO tocas la clase CarritoCompra: solo añades una clase DescuentoEstudiante. Eso es Open/Closed Principle puro.'
        }
      }
    ]
  }
];
