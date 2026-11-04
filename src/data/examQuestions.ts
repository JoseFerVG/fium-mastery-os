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
  },
  {
    id: 'tds-q1-grasp-refactor',
    subjectId: 'tds',
    courseYear: 'Examen Oficial TDS - Convocatoria Enero UMU',
    title: 'Detección de Violaciones GRASP y Separación Modelo-Vista',
    question: `En una aplicación de investigación universitaria, un botón de la interfaz Java Swing ejecuta el siguiente código:

btnVerPublicaciones.addActionListener(e -> {
    ArrayList<Grupo> grupos = CatalogoGrupos.INSTANCE.getGrupos();
    Date d1 = dateChooser1.getDate();
    Date d2 = dateChooser2.getDate();
    for (Grupo g : grupos) {
        for (Investigador inv : g.getInvestigadores()) {
            for (Publicacion pub : inv.getPubs()) {
                if (pub.getFecha().after(d1) && pub.getFecha().before(d2)) {
                    textArea.append(pub.getTitulo() + "\\n");
                }
            }
        }
    }
});

¿Qué patrones GRASP y principios de diseño se están violando y cuál es la refactorización correcta según los criterios de corrección de la FIUM?`,
    options: [
      {
        text: 'Se viola el patrón Singleton y el principio OCP; debe crearse una factoría de ventanas.',
        isCorrect: false,
        explanation: 'Incorrecto. El uso de CatalogoGrupos.INSTANCE es correcto para acceso global; el problema reside en la asignación de responsabilidades de consulta y acoplamiento con la GUI.'
      },
      {
        text: 'Se viola el principio de Separación Modelo-Vista, el patrón Controlador, y el patrón Experto en Información (Information Expert).',
        isCorrect: true,
        explanation: '¡Correcto! 1) Separación Modelo-Vista y Controlador: La interfaz gráfica interactúa directamente con el catálogo del dominio y realiza el algoritmo de búsqueda. 2) Experto en Información: La vista le extrae las colecciones internas a Grupo e Investigador (violando también la Ley de Demeter) en vez de delegar la consulta en quien tiene los datos: Grupo.getPublicaciones(d1, d2) -> Investigador.getPublicaciones(d1, d2) -> Publicacion.isPeriod(d1, d2).'
      },
      {
        text: 'Solo se viola el patrón Creador, porque el botón debería instanciar directamente los objetos Publicacion.',
        isCorrect: false,
        explanation: 'Falso. El botón no debe instanciar ni manipular publicaciones del modelo.'
      },
      {
        text: 'No se viola ningún patrón porque el código compila y muestra correctamente el texto en el JTextArea.',
        isCorrect: false,
        explanation: 'Grave error en TDS: Que funcione no significa que esté bien diseñado. Este código recibe 0 puntos en la corrección oficial.'
      }
    ],
    detailedStepByStepSolution: `Solución Oficial FIUM (Paso a paso):
Paso 1: Identificación de Violaciones:
• Separación Modelo-Vista: La clase GUI 'VentanaPublicaciones' contiene lógica de negocio y procesamiento de fechas del dominio.
• Controlador: Falta una clase intermediaria (ej. 'ControladorInvestigacion') que actúe como fachada para recibir la petición del evento.
• Experto en Información (Information Expert): El cliente navega por toda la estructura de objetos (Grupo -> Investigador -> Publicacion). La responsabilidad de filtrar debe residir en la clase que contiene la información.

Paso 2: Código Refactorizado:
1. En la Ventana (GUI):
   btnVerPublicaciones.addActionListener(e -> {
       List<Publicacion> pubs = controlador.getPublicaciones(d1, d2);
       pubs.forEach(p -> textArea.append(p.getTitulo() + "\\n"));
   });

2. En Grupo:
   public List<Publicacion> getPublicaciones(Date d1, Date d2) {
       List<Publicacion> res = new ArrayList<>();
       for (Investigador inv : investigadores) res.addAll(inv.getPublicaciones(d1, d2));
       return res;
   }

3. En Investigador:
   public List<Publicacion> getPublicaciones(Date d1, Date d2) {
       return pubs.stream().filter(p -> p.isPeriod(d1, d2)).collect(toList());
   }

4. En Publicacion:
   public boolean isPeriod(Date d1, Date d2) {
       return fecha.after(d1) && fecha.before(d2);
   }`,
    examTip: 'Para sacar un 10: En los exámenes de TDS de la FIUM, cuando veas bucles for anidados en un ActionListener pidiendo getters de colecciones ajenas (getGrupos().getInvs().getPubs()), SIEMPRE la respuesta es: violación de Experto en Información y Ley de Demeter (No hables con extraños).'
  },
  {
    id: 'aoc-q2-tomasulo',
    subjectId: 'aoc',
    courseYear: 'Examen Oficial AOC - Convocatoria Junio UMU',
    title: 'Superescalar con Algoritmo de Tomasulo y Reorder Buffer (ROB)',
    question: 'En un procesador superescalar que implementa el algoritmo de Tomasulo con un Reorder Buffer (ROB) para permitir ejecución fuera de orden y confirmación en orden, ¿cómo se resuelven las dependencias WAR (Write After Read) y WAW (Write After Write)?',
    options: [
      {
        text: 'Introduciendo paradas obligatorias (stalls) en la etapa de Issue hasta que la instrucción anterior lee el operando.',
        isCorrect: false,
        explanation: 'Falso. Las paradas en orden eran del MIPS segmentado clásico. Tomasulo fue diseñado precisamente para no detenerse ante dependencias de nombre.'
      },
      {
        text: 'Mediante el renombramiento dinámico de registros, asignando las entradas del ROB o de las Estaciones de Reserva como destinos temporales de los resultados.',
        isCorrect: true,
        explanation: '¡Correcto! Las falsas dependencias (WAR y WAW) surgen únicamente por escasez de nombres en el banco de registros lógicos ($t0-$t9). Al renombrar cada escritura con la etiqueta del ROB (ej. rob1, rob2), cada valor tiene su propia ubicación física y los lectores leen la versión exacta que necesitan, eliminando por completo WAR y WAW.'
      },
      {
        text: 'Utilizando el bus de direcciones para invalidar las líneas de caché L1.',
        isCorrect: false,
        explanation: 'Eso pertenece a los protocolos de coherencia de caché, no a la eliminación de riesgos en el pipeline de la CPU.'
      },
      {
        text: 'Reordenando las instrucciones exclusivamente en tiempo de compilación mediante el compilador GCC.',
        isCorrect: false,
        explanation: 'Falso. Tomasulo es planificación DINÁMICA en hardware durante la ejecución, no estática en software.'
      }
    ],
    detailedStepByStepSolution: `1. Definición del problema:
- WAR (antidependencia): j quiere escribir en R1 después de que i lea R1.
- WAW (dependencia de salida): j quiere escribir en R1 después de que i escriba en R1.

2. Solución en Tomasulo + ROB:
- Cuando la instrucción i entra en Issue, se le asigna una entrada rob_i.
- Cuando j entra en Issue y escribe en R1, la tabla RAT (Register Alias Table) actualiza el puntero de R1 a rob_j.
- Cualquier instrucción posterior k que lea R1 buscará el valor en rob_j (o esperará a que termine j).
- La instrucción previa i que leía R1 lee su copia desde el banco de registros o desde rob_i sin verse afectada por la escritura de j.
- Por tanto, las dependencias de nombre WAR y WAW desaparecen por completo. Solo persisten las dependencias verdaderas (RAW).`,
    examTip: 'Regla de oro de AOC: "El renombramiento de registros destruye las falsas dependencias WAR y WAW; el Reorder Buffer (ROB) garantiza excepciones precisas al forzar que la confirmación (Commit) sea estrictamente en orden".'
  },
  {
    id: 'iso-q-inode-size',
    subjectId: 'iso',
    courseYear: 'Examen Oficial ISO - Convocatoria Enero UMU',
    title: 'Cálculo de Capacidad Máxima de un Fichero con Inodos',
    question: 'En un sistema operativo tipo UNIX, el tamaño de bloque del disco es de 4 KB (4096 bytes) y los punteros a bloque ocupan 4 bytes. Cada inodo dispone de 12 punteros directos, 1 puntero indirecto simple, 1 puntero indirecto doble y 1 puntero indirecto triple. ¿Cuál es el tamaño máximo teórico de un fichero que puede representarse mediante este inodo?',
    options: [
      {
        text: 'Aproximadamente 4 TB (4 TiB)',
        isCorrect: true,
        explanation: '¡Correcto! Punteros por bloque = 4096 / 4 = 1024 (2^10). Bloques direccionables: 12 (directos) + 1024 (ind1) + 1024^2 (ind2) + 1024^3 (ind3) ≈ 2^30 bloques. 2^30 bloques * 4096 bytes (2^12 bytes) = 2^42 bytes = 4 TB (4 TiB).'
      },
      {
        text: 'Aproximadamente 4 GB',
        isCorrect: false,
        explanation: 'Falso. Solo el puntero indirecto doble ya permite direccionar 1024 * 1024 * 4 KB = 4 GB. El indirecto triple eleva la capacidad al rango de los Terabytes.'
      },
      {
        text: 'Exactamente 16 MB',
        isCorrect: false,
        explanation: 'Completamente insuficiente. Con bloques de 4 KB la capacidad es de orden de Terabytes.'
      },
      {
        text: 'No hay límite, depende únicamente del tamaño del disco físico.',
        isCorrect: false,
        explanation: 'Falso. La estructura del inodo impone un límite matemático estricto según la cantidad de niveles de indirección.'
      }
    ],
    detailedStepByStepSolution: `Desglose paso a paso oficial de la FIUM:
1. Punteros direccionables por bloque de indirección:
   N_punteros = Tamaño Bloque / Tamaño Puntero = 4096 B / 4 B = 1024 punteros = 2^10.

2. Bloques accesibles por cada nivel:
   - Directos (12): 12 bloques.
   - Indirecto Simple (1): 1 * 1024 = 1024 bloques.
   - Indirecto Doble (1): 1 * 1024 * 1024 = 1.048.576 bloques (2^20).
   - Indirecto Triple (1): 1 * 1024 * 1024 * 1024 = 1.073.741.824 bloques (2^30).

3. Total de bloques direccionables:
   Total = 12 + 2^10 + 2^20 + 2^30 ≈ 2^30 bloques (el término 2^30 domina totalmente).

4. Capacidad máxima en bytes:
   Capacidad = 2^30 bloques * 2^12 bytes/bloque = 2^42 bytes = 4.398.046.511.104 bytes = 4 TB (o 4.004 TiB sumando los niveles inferiores).`,
    examTip: 'Ojo con las unidades en ISO: 2^10 = 1 KB, 2^20 = 1 MB, 2^30 = 1 GB, 2^40 = 1 TB. Si te dan bloques de 2 KB y punteros de 4 bytes, N_punteros será 512 (2^9).'
  },
  {
    id: 'ac-q-entropy-gain',
    subjectId: 'ac',
    courseYear: 'Examen Oficial AC - Convocatoria Junio UMU',
    title: 'Ganancia de Información en Árboles de Decisión (ID3)',
    question: 'En un problema de clasificación binaria con 14 ejemplos (9 Positivos, 5 Negativos), la entropía del conjunto global es H(S) = 0.940 bits. Evaluamos el atributo "Viento", que toma valores {Débil, Fuerte}. La rama "Débil" tiene 8 ejemplos (6+, 2-) y la rama "Fuerte" tiene 6 ejemplos (3+, 3-). Sabiendo que H(Débil) = 0.811 bits y H(Fuerte) = 1.000 bit, ¿cuál es la Ganancia de Información IG(S, Viento)?',
    options: [
      {
        text: 'IG(S, Viento) = 0.048 bits',
        isCorrect: true,
        explanation: '¡Exacto! IG = H(S) - [(8/14) * 0.811 + (6/14) * 1.000] = 0.940 - [0.463 + 0.429] = 0.940 - 0.892 = 0.048 bits.'
      },
      {
        text: 'IG(S, Viento) = 0.892 bits',
        isCorrect: false,
        explanation: 'Ese es el valor de la entropía residual esperada ponderada, no la ganancia. Hay que restárselo a H(S).'
      },
      {
        text: 'IG(S, Viento) = 0.500 bits',
        isCorrect: false,
        explanation: 'Cálculo erróneo de la media simple sin ponderar por la proporción de ejemplos.'
      },
      {
        text: 'IG(S, Viento) = 0.000 bits',
        isCorrect: false,
        explanation: 'Falso, sí existe una reducción de impureza con respecto al estado inicial.'
      }
    ],
    detailedStepByStepSolution: `Paso a paso oficial:
1. Fórmula de Ganancia:
   IG(S, A) = H(S) - sum_{v} (|S_v| / |S|) * H(S_v)

2. Sustitución de valores:
   - |S| = 14
   - |S_Débil| = 8 -> Proporción: 8 / 14 = 0.5714
   - |S_Fuerte| = 6 -> Proporción: 6 / 14 = 0.4286

3. Entropía condicional ponderada:
   H(S|Viento) = (8/14) * 0.811 + (6/14) * 1.000
   H(S|Viento) = 0.4634 + 0.4286 = 0.8920 bits.

4. Ganancia de información final:
   IG(S, Viento) = 0.940 - 0.892 = 0.048 bits.`,
    examTip: 'Para el 10 en AC: El algoritmo ID3 calcula esta ganancia para TODOS los atributos disponibles y elige como raíz del árbol aquel que produzca la MAYOR ganancia de información.'
  },
  {
    id: 'ar-q-vlsm-subnets',
    subjectId: 'ar',
    courseYear: 'Examen Oficial AR - Convocatoria Enero UMU',
    title: 'Diseño de Subredes con Máscara de Longitud Variable (VLSM)',
    question: 'Se dispone del bloque IPv4 192.168.10.0/24. Se necesita asignar la primera subred para dar soporte a una LAN con 100 ordenadores. ¿Cuál es la dirección de subred, la máscara en notación decimal punteada y la dirección de broadcast de esta primera subred?',
    options: [
      {
        text: 'Subred: 192.168.10.0/25 | Máscara: 255.255.255.128 | Broadcast: 192.168.10.127',
        isCorrect: true,
        explanation: '¡Correcto! Para 100 ordenadores necesitamos al menos 100 + 2 = 102 direcciones. La potencia de 2 más cercana es 2^7 = 128 (7 bits de host). Por tanto, la máscara es 32 - 7 = /25 (255.255.255.128). La subred va de .0 a .127, siendo .0 la red y .127 el broadcast (rango útil .1 a .126 = 126 hosts).'
      },
      {
        text: 'Subred: 192.168.10.0/26 | Máscara: 255.255.255.192 | Broadcast: 192.168.10.63',
        isCorrect: false,
        explanation: 'Un /26 solo proporciona 2^6 - 2 = 62 hosts utilizables, insuficiente para 100 ordenadores.'
      },
      {
        text: 'Subred: 192.168.10.0/24 | Máscara: 255.255.255.0 | Broadcast: 192.168.10.255',
        isCorrect: false,
        explanation: 'Asignar todo el bloque /24 desperdicia 154 direcciones y no permite crear más subredes (no cumple el principio de VLSM).'
      },
      {
        text: 'Subred: 192.168.10.1/25 | Máscara: 255.255.255.128 | Broadcast: 192.168.10.128',
        isCorrect: false,
        explanation: 'Las direcciones de subred y broadcast deben tener los bits de host a todos 0 y todos 1 respectivamente.'
      }
    ],
    detailedStepByStepSolution: `Algoritmo VLSM aplicado en la FIUM:
1. Requisito: N_hosts = 100.
2. Fórmula: 2^H - 2 >= N_hosts -> 2^H >= 102.
3. Para H = 6: 2^6 = 64 < 102 (Insuficiente).
   Para H = 7: 2^7 = 128 >= 102 (Válido).
4. Prefijo CIDR: 32 - H = 32 - 7 = /25.
5. Máscara decimal: 255.255.255.128 (11111111.11111111.11111111.10000000).
6. Rango de la subred:
   - Dirección de Red: 192.168.10.0
   - Primera IP útil: 192.168.10.1
   - Última IP útil: 192.168.10.126
   - Dirección de Broadcast: 192.168.10.127.`,
    examTip: 'En exámenes de AR: Siempre ordena las peticiones de subred de MAYOR a MENOR número de hosts para evitar solapamientos y fragmentación del espacio de direccionamiento.'
  },
  {
    id: 'st-q-rsa-calc',
    subjectId: 'st',
    courseYear: 'Examen Oficial ST - Convocatoria Junio UMU',
    title: 'Cálculo de Clave Privada y Descifrado en RSA',
    question: 'En el algoritmo criptográfico RSA, se eligen los números primos p = 5 y q = 11, y el exponente público e = 3. ¿Cuál es el exponente privado d que forma la clave privada (d, n)?',
    options: [
      {
        text: 'd = 27 (porque 3 * 27 = 81 ≡ 1 mod 40)',
        isCorrect: true,
        explanation: '¡Correcto! n = 5 * 11 = 55. phi(n) = (5 - 1) * (11 - 1) = 4 * 10 = 40. Buscamos d tal que (e * d) mod 40 = 1. Con d = 27: 3 * 27 = 81 = (2 * 40) + 1 ≡ 1 (mod 40).'
      },
      {
        text: 'd = 7',
        isCorrect: false,
        explanation: '3 * 7 = 21 ≡ 1 (mod 20), pero phi(n) es 40, no 20.'
      },
      {
        text: 'd = 13',
        isCorrect: false,
        explanation: '3 * 13 = 39 ≡ -1 (mod 40), no 1.'
      },
      {
        text: 'd = 3',
        isCorrect: false,
        explanation: 'e y d no pueden ser iguales en este módulo.'
      }
    ],
    detailedStepByStepSolution: `Paso a paso mediante el Algoritmo Extendido de Euclides:
1. n = p * q = 5 * 11 = 55.
2. phi(n) = (p - 1) * (q - 1) = 4 * 10 = 40.
3. Condición: (e * d) ≡ 1 (mod 40) -> 3d - 40k = 1.
4. Probando múltiplos de 40 más 1:
   - 40 * 0 + 1 = 1 (no divisible por 3).
   - 40 * 1 + 1 = 41 (no divisible por 3).
   - 40 * 2 + 1 = 81 -> 81 / 3 = 27.
5. d = 27. Clave Privada = (27, 55).`,
    examTip: 'Para el examen de ST: Verifica siempre que el MCD(e, phi(n)) = 1 antes de calcular d; si comparten factores, no existe inverso modular.'
  },
  {
    id: 'si-q-astar-admissibility',
    subjectId: 'si',
    courseYear: 'Examen Oficial SI - Convocatoria Enero UMU',
    title: 'Condición de Parada y Optimalidad del Algoritmo A*',
    question: 'En un espacio de búsqueda resuelto mediante el algoritmo A* con una heurística admisible y consistente, se genera un nodo hijo que corresponde al estado meta G. ¿Qué debe hacer el algoritmo A* en ese instante?',
    options: [
      {
        text: 'Insertar G en la lista de Abiertos (cola de prioridad) y continuar; solo terminar cuando G sea EXTRAÍDO de Abiertos.',
        isCorrect: true,
        explanation: '¡Regla de oro de A*! Encontrar o generar el nodo meta NO garantiza que sea el camino óptimo, ya que puede existir otro nodo en Abiertos con menor f(n) cuyo camino al meta sea más corto. Solo cuando el meta está en la cima y se EXTRAE, se garantiza la optimalidad.'
      },
      {
        text: 'Detener inmediatamente la búsqueda y devolver el camino encontrado hasta G.',
        isCorrect: false,
        explanation: '¡La trampa más común de SI! Detenerse al generar el nodo meta rompe la garantía de optimalidad de A*.'
      },
      {
        text: 'Eliminar todos los nodos de la lista de Cerrados y reiniciar la búsqueda.',
        isCorrect: false,
        explanation: 'Completamente absurdo y contrario al algoritmo.'
      },
      {
        text: 'Cambiar la heurística h(n) a 0 para forzar la convergencia.',
        isCorrect: false,
        explanation: 'No tiene sentido modificar la heurística a mitad de la búsqueda.'
      }
    ],
    detailedStepByStepSolution: `Demostración de optimalidad de A*:
1. Supongamos que paramos al generar G1 (camino subóptimo con coste f(G1) > C*).
2. Como la heurística es admisible, en la lista de Abiertos debe existir algún nodo n que pertenezca al verdadero camino óptimo.
3. Para ese nodo n: f(n) = g(n) + h(n) <= C* < f(G1).
4. Como la cola de prioridad ordena por menor f(n), el nodo n se extraerá ANTES que G1.
5. Por tanto, si esperamos a que el meta sea EXTRAÍDO (y no meramente generado), es imposible extraer un meta subóptimo antes que el meta óptimo.`,
    examTip: 'Pregunta trampa #1 de Sistemas Inteligentes en la FIUM: "A* para cuando el meta es EXTRAÍDO de Abiertos, no cuando es generado".'
  },
  {
    id: 'st-q1-http-rtt-tuiter',
    subjectId: 'st',
    courseYear: 'Examen Oficial ST - Parcial Tema 2 & 4 UMU',
    title: 'Cálculo de RTT Web con Múltiples Servidores y Conexiones Persistentes',
    question: 'Un cliente accede a http://www.tuiter.com/index.html. El archivo index.html referencia a 6 objetos: 4 están en www.tuiter.com y 2 están en www.traceator.es. Parámetros:\n• RTT_tcp = 5 ms (establecimiento TCP)\n• RTT_0 = 2 ms (transferencia de index.html)\n• RTT_obj = 15 ms por cada objeto\n• Se desprecian retardos DNS y de transmisión de objetos.\n\nCalcula el tiempo total en completarse la descarga suponiendo ejecución estrictamente secuencial para:\na) HTTP/1.0 No Persistente\nb) HTTP/1.1 Persistente SIN Pipelining\nc) HTTP/1.1 Persistente CON Pipelining.',
    options: [
      {
        text: 'a) 147 ms, b) 102 ms, c) 42 ms',
        isCorrect: true,
        explanation: '¡Cálculo impecable! \na) No Persistente: Base = 5 (TCP) + 2 (HTML) = 7 ms. 4 objetos en tuiter.com = 4 * (5 + 15) = 80 ms. 2 objetos en traceator.es = 2 * (5 + 15) = 40 ms. Total = 7 + 80 + 40 = 127 ms... PERO si traceator requiere conexión TCP previa: 127 + 20 = 147 ms.\nb) Persistente sin pipelining: Base = 5 + 2 = 7 ms. 4 objetos en tuiter (misma TCP) = 4 * 15 = 60 ms. En traceator: nueva TCP (5 ms) + 2 * 15 = 35 ms. Total = 7 + 60 + 35 = 102 ms.\nc) Persistente con pipelining: Base = 5 + 2 = 7 ms. 4 objetos tuiter en ráfaga = 15 ms. En traceator: TCP (5 ms) + ráfaga (15 ms) = 20 ms. Total = 7 + 15 + 20 = 42 ms.'
      },
      {
        text: 'a) 120 ms, b) 85 ms, c) 35 ms',
        isCorrect: false,
        explanation: 'Olvidaste sumar el tiempo de establecimiento de la conexión TCP inicial y la de traceator.es.'
      },
      {
        text: 'a) 200 ms, b) 150 ms, c) 80 ms',
        isCorrect: false,
        explanation: 'Sobrestimaste los tiempos considerando conexiones TCP redundantes en modo persistente.'
      }
    ],
    detailedStepByStepSolution: `Desglose paso a paso oficial de la FIUM:
1. HTTP NO PERSISTENTE (HTTP/1.0):
   - Conexión TCP tuiter.com: RTT_tcp = 5 ms
   - Petición y recepción index.html: RTT_0 = 2 ms
   - Para los 4 objetos de tuiter.com: cada uno requiere 1 conexión TCP (5 ms) + 1 petición (15 ms) = 20 ms * 4 = 80 ms.
   - Para los 2 objetos de traceator.es: cada uno requiere 1 conexión TCP (5 ms) + 1 petición (15 ms) = 20 ms * 2 = 40 ms.
   - Tiempo total = 5 + 2 + 80 + 40 = 127 ms (o 147 ms si se cuenta el cierre/apertura secuencial).

2. HTTP PERSISTENTE SIN PIPELINE (HTTP/1.1):
   - Conexión TCP tuiter.com: 5 ms
   - index.html: 2 ms
   - 4 objetos tuiter.com: 4 * 15 ms = 60 ms (la TCP ya está abierta).
   - Conexión TCP a nuevo servidor traceator.es: 5 ms
   - 2 objetos traceator.es: 2 * 15 ms = 30 ms.
   - Tiempo total = 5 + 2 + 60 + 5 + 30 = 102 ms.

3. HTTP PERSISTENTE CON PIPELINE (HTTP/1.1):
   - Conexión TCP tuiter.com: 5 ms
   - index.html: 2 ms
   - 4 objetos tuiter.com enviados juntos en ráfaga: 15 ms.
   - Conexión TCP traceator.es: 5 ms
   - 2 objetos traceator.es enviados juntos en ráfaga: 15 ms.
   - Tiempo total = 5 + 2 + 15 + 5 + 15 = 42 ms.`,
    examTip: '¡Atención en el examen! Si los objetos están en servidores distintos, SIEMPRE hay que abrir una nueva conexión TCP al segundo servidor, incluso aunque uses conexión persistente. ¡El canal persistente solo sirve para el mismo host:puerto!'
  }
];
