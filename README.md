# ⚡ FIUM Mastery OS | El Ecosistema Definitivo de Estudio y Gamificación (UMU)

> **Plataforma de Alto Rendimiento Académico diseñada para el Grado en Ingeniería Informática de la Facultad de Informática de la Universidad de Murcia (FIUM).**
> Creado para entender los conceptos de raíz sin medias tintas, dominar las trampas de examen de las convocatorias oficiales (2021–2026/2027) y transformar tu año en una experiencia RPG interactiva.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6.svg)
![Tailwind](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)
![Vite](https://img.shields.io/badge/Vite-8-646cff.svg)
![Web Audio API](https://img.shields.io/badge/Audio-Web%20Audio%20API-orange.svg)

---

## 🎯 ¿Por qué existe FIUM Mastery OS?

Muchos estudiantes de informática en la UMU caen en la trampa de memorizar diapositivas sin entender la arquitectura o las matemáticas subyacentes. Cuando llegan los parciales y finales con ejercicios que combinan conceptos, surgen los bloqueos.

**FIUM Mastery OS** ataca directamente este problema mediante el método de las tres capas:
1. **Intuición Física / Feynman:** Explicación analógica y directa de cómo funciona realmente en hardware, kernel o redes ("explicado para tu abuela").
2. **Rigor Matemático & Formal:** Demostraciones, fórmulas de rendimiento (Amdahl, CPI, AMAT, VLSM, RSA, Entropía de Shannon, A* Heurística) y código real en C, Java, Bash y R.
3. **Anatomía de las Trampas de Examen:** Errores sutiles diseñados por los tribunales de la FIUM para restar décimas (p.ej. muerte por `SIGPIPE` en tuberías POSIX, el stall obligatorio de Load-Use aun con forwarding completo, o la ordenación de mayor a menor en subredes VLSM).

---

## 🎮 Sistema de Gamificación RPG Completo

FIUM Mastery OS no es solo un gestor de apuntes; es un **juego de rol de ingeniería**:

- **⚡ Niveles y Rangos de Alumno (1 al 10):**
  1. *Novato de la FIUM* (0 XP)
  2. *Ensamblador de Binarios* (300 XP)
  3. *Decodificador RISC-V* (600 XP)
  4. *Domador de xv6 & Kernel Hacker* (900 XP)
  5. *Arquitecto de Redes & VLSM* (1300 XP)
  6. *Criptógrafo Asimétrico* (1800 XP)
  7. *Maestro de Heurísticas & Grafos* (2400 XP)
  8. *Ingeniero SOLID & Clean Code* (3100 XP)
  9. *Pesadilla del Tribunal de Examen* (4000 XP)
  10. *Leyenda de la FIUM (Matrícula de Honor)* (5000+ XP)
- **💎 Economía de Gemas:** Gana gemas completando misiones y acertando preguntas para recargar vidas o desbloquear recompensas.
- **📜 Misiones Diarias Renovadas:**
  - *Presencia en la FIUM* (Mantén tu racha diaria)
  - *Desafío de Examen* (Resuelve preguntas de convocatoria)
  - *Paseo por FIUMingo* (Completa lecciones guiadas)
  - *Práctica de Laboratorio* (Experimenta con simuladores visuales)
- **🏆 Sala de Trofeos (16 Logros Desbloqueables):**
  - Insignias categorizadas en Maestría, Exámenes, Supervivencia, Rachas y Foco Pomodoro.
- **📱 Modo Móvil "Entre Libros" (Desk Companion):**
  - Diseñado para estudiar con dos libros o apuntes físicos abiertos en la mesa.
  - Asaltos rápidos de 3 minutos (5 preguntas de retención activa).
  - Multiplicador de combo en llamas (x1.0 a x3.0 🔥) y contraste instantáneo entre la *Regla Formal del Libro* y la *Trampa del Profesor*.
- **📊 Aprobómetro FIUM:**
  - Medidor dinámico de probabilidad real de superar la convocatoria y calificación proyectada (Suspenso / Aprobado Seguro / Notable / Sobresaliente) en base al temario dominado en verde y constancia.
- **📱 PWA & Dock Móvil para Pulgar:**
  - Barra de navegación inferior fija estilo app nativa con zonas seguras (`pb-safe`) y diseño líquido con cristal refractivo.
- **🔊 Motor de Audio Sintético & Háptica Táctil (Web Audio API + Vibration API):**
  - Efectos de sonido generados matemáticamente mediante osciladores y filtros en tiempo real sin dependencias externas, sincronizados con micro-vibraciones hápticas en smartphones: acierto armónico, error, clics mecánicos, fanfarrias polifónicas al subir de nivel, tick de reloj y recompensas.
- **🗂️ Tarjetas de Memoria Activa (Anki FIUM):**
  - Tarjetas 3D con volteo para auto-evaluación basada en Repetición Espaciada (SRS) (*Difícil*, *Bien*, *Fácil*) sobre todas las trampas de examen.
- **🔥 Modo Supervivencia Convocatoria (Arcade Rush):**
  - 60 segundos contrarreloj con 3 vidas.
  - Multiplicador de combo dinámico ($x1 \to x4$).
  - Cada acierto añade **+5 segundos** al temporizador.
  - Banco aleatorio de problemas oficiales con tabla de récord histórico guardado en `localStorage`.

---

## 🔬 Laboratorio Central: 10 Simuladores Visuales Interactivos

Cada simulador permite manipular parámetros en tiempo real y observar las matemáticas y transiciones internas:

| # | Asignatura | Laboratorio | Capacidades Interactivas |
|---|------------|-------------|--------------------------|
| 1 | **AOC** | **Pipeline MIPS / RISC-V & Hazards** | Cauce de 5 etapas (IF, ID, EX, MEM, WB), detección de riesgos RAW, activación de Forwarding y visualización de la burbuja Load-Use. |
| 2 | **AOC** | **Calculadora de AMAT & Caché** | Desglose binario Tag-Index-Offset en memorias asociativas por conjuntos, decodificador de direcciones hex y cálculo de tiempo medio de acceso AMAT ($L_1 + M_1 \times Penalización$). |
| 3 | **ISO / ASO** | **Planificador de CPU & Gantt** | Simulación de **Round Robin** (quantum configurable), **SJF no apropiativo**, **SRTF apropiativo**, **FCFS** y **Prioridades**. Métricas exactas de $T_{espera}$ y $T_{retorno}$ con reglas de desempate FIUM. |
| 4 | **ASO** | **Memoria Virtual & x86 Paging** | Traducción de direcciones virtuales (Directorio -> Tabla -> Offset), fallos de página (*Page Faults*) y políticas de reemplazo **FIFO**, **LRU** y **Reloj (Segunda Oportunidad)**. |
| 5 | **ALF** | **Autómatas Finitos & Minimización** | Simulador de AFD/AFND con validación de cadenas sobre cinta de estados, transiciones $\lambda$ y algoritmo de minimización de estados equivalentes. |
| 6 | **TDS** | **Clínica SOLID & Code Smells** | Diagnóstico interactivo de violaciones SRP, OCP, LSP, ISP y DIP en Java con refactorizaciones limpias a patrones GoF (Strategy, Factory, Observer). |
| 7 | **AR** | **Calculadora Visual de Subredes & VLSM** | Desglose de 32 bits coloreando bits de Red vs Host, cálculo de rangos útiles, red y broadcast con presets de convocatorias oficiales de Arquitectura de Redes. |
| 8 | **ST** | **Laboratorio Criptográfico RSA** | Primos $p, q$, cálculo de $\phi(n)$ de Euler, verificación de coprimalidad para $e$, clave privada $d$ mediante Euclides Extendido y cifrado/descifrado modular $M^e \pmod n$. |
| 9 | **SI** | **Visualizador de Búsqueda Heurística A\*** | Rejilla 2D interactiva con dibujo de muros dinámico, comparación de A\* (Manhattan y Euclídea), BFS, Dijkstra y Greedy Best-First con inspección de listas abierta y cerrada. |
| 10 | **AC** | **Métricas ML & Árboles de Decisión** | Matriz de Confusión 2x2 interactiva (Accuracy, Precision, Recall, Specificity, F1-Score, punto ROC) y cálculo de Entropía de Shannon $H(S)$ y Ganancia de Información $Gain(S, A)$ (Quinlan PlayTennis). |

---

## 📚 Cobertura Total de las 9 Asignaturas FIUM (Convocatorias 2026/2027)

1. **AOC (1909 - Arquitectura y Organización de Computadores):**
   - Ley de Amdahl y rendimiento CPU (CPI, MIPS, Ciclo de reloj).
   - Cauce segmentado MIPS y riesgos estructurales, de datos (RAW) y de control.
   - Jerarquía de memoria, tiempos AMAT, políticas Write-Through vs Write-Back y coherencia MSI.
   - Tomasulo con Reorder Buffer (ROB) y ejecución fuera de orden.
2. **ASO (1910 - Ampliación de Sistemas Operativos):**
   - Tuberías POSIX, descriptores duplicados con `dup2()` y la señal mortal `SIGPIPE`.
   - Paginación x86 de dos niveles (CR3, PGD, PTE) y reserva perezosa (*lazy allocation*) en xv6.
   - Sistema de ficheros UNIX / Ext2-3: inodos, bloques directos, indirectos simples, dobles y triples.
   - Sincronización concurrente, cerrojos spinlock vs sleep-locks y Algoritmo del Banquero de Dijkstra.
   - Internals de xv6: interrupciones hardware, trapframe, `swtch.S` y cambio de contexto.
3. **ALF (1905 - Autómatas y Lenguajes Formales):**
   - Jerarquía de Chomsky y clasificación de lenguajes.
   - Lema del Bombeo (*Pumping Lemma*) para demostrar no regularidad ($w = xyz$).
   - Gramáticas Libres de Contexto (GLC), derivaciones y Forma Normal de Chomsky (FNC).
   - Autómatas de Pila (PDA) y equivalencia con lenguajes independientes del contexto.
   - Máquinas de Turing, tesis de Church-Turing y el Problema de la Parada (*Halting Problem*).
4. **TDS (1907 - Tecnologías de Desarrollo de Software):**
   - Principios SOLID aplicados a diseño orientado a objetos en Java.
   - Patrones GRASP (Experto, Creador, Controlador, Bajo Acoplamiento, Alta Cohesión).
   - Patrones GoF (Strategy, State, Observer, Decorator, Composite, Factory Method).
   - Programación Funcional con Java Streams API y lambdas.
   - TDD, tests unitarios con JUnit 5 y dobles de prueba con Mockito (`when().thenReturn()`, `verify()`).
5. **ISO (1904 - Introducción a los Sistemas Operativos):**
   - Planificación de CPU: FCFS, SJF, Round Robin y prioridades con envejecimiento dinámico (*aging*).
   - Gestión de memoria física: particiones variables, huecos (First-Fit, Best-Fit, Worst-Fit) y fragmentación.
   - Shell scripting en Bash: manipulación de argumentos (`$#`, `$*`, `$@`), pipes y filtros (`grep`, `awk`, `sed`).
   - Bloques lógicos en UNIX, mapas de bits de inodos y cálculo de capacidad máxima de partición.
6. **AC (1912 - Aprendizaje Computacional):**
   - Árboles de decisión (ID3 / C4.5), división por impureza de Gini y Entropía de Shannon.
   - Evaluación rigurosa de clasificadores: Matriz de Confusión, curvas ROC y métrica AUC.
   - Algoritmo K-NN, normalización z-score y maldición de la dimensionalidad.
   - Flujo de trabajo profesional en R con el paquete `caret` (particionado estratificado, trainControl, 10-fold CV).
7. **AR (1908 - Arquitectura de Redes):**
   - Direccionamiento VLSM y agregación de rutas con prefijos CIDR (regla de oro de ordenación decreciente).
   - Protocolos de encaminamiento interior: Vector Distancia (RIP) vs Estado de Enlace (OSPF con Dijkstra).
   - Encaminamiento exterior BGP: atributos AS-Path, Next-Hop y peering inter-dominio.
   - Protocolo de transporte TCP: ventana deslizante, temporizadores RTO, y control de congestión (Reno vs Tahoe).
8. **ST (1911 - Servicios Telemáticos):**
   - Criptografía asimétrica RSA, función totiente de Euler $\phi(n)$ y ataques por factorización.
   - Seguridad en la capa de transporte: negociación SSL/TLS 1.2 vs 1.3 y certificados X.509.
   - Sistema de Nombres de Dominio (DNS): registros A, AAAA, CNAME, MX, NS y resolución iterativa vs recursiva.
   - Evolución de protocolos web: HTTP/1.1 (pipelining) vs HTTP/2 (multiplexación binaria, server push).
9. **SI (1906 - Sistemas Inteligentes):**
   - Algoritmo de búsqueda informada A\*: funciones $f(n) = g(n) + h(n)$, condición de admisibilidad y consistencia monótona.
   - Juegos con adversario: Algoritmo Minimax y optimización mediante Poda Alfa-Beta ($\alpha \ge \beta$).
   - Algoritmos Genéticos (AG): codificación de cromosomas, selección por ruleta/torneo, cruce monopunto y mutación.
   - Sistemas basados en reglas y motores de inferencia (Forward Chaining y Backward Chaining).

---

## 🦉 FIUMingo: Modo Duolingo

Ruta de aprendizaje paso a paso estructurada en unidades formativas con:
- Vidas recargables.
- Cofres de gemas.
- Guías teóricas del Aula Virtual integradas por unidad.
- Módulos interactivos de selección múltiple, reordenación de código y preguntas de verdadero/falso.

---

## ⏱️ Estación de Enfoque Profundo (Pomodoro)

- Ciclos 25 min de foco / 5 min de descanso / 15 min de descanso largo.
- Efectos de sonido analógicos para inicio y finalización de sesión.
- Acumulador de minutos de estudio concentrado con desbloqueo directo de logros (*Modo Monje FIUM*).
- Persistencia local automática en el navegador.

---

## 🛠️ Stack Tecnológico

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite 8
- **Estilos:** Tailwind CSS v4
- **Iconografía:** Lucide React
- **Síntesis Sonora:** Web Audio API nativo
- **Efectos Visuales:** Canvas Confetti

---

## 📦 Instalación y Puesta en Marcha

```bash
# 1. Clonar el repositorio
git clone https://github.com/JoseFerVG/fium-mastery-os.git
cd fium-mastery-os

# 2. Instalar dependencias (Node.js 18+)
npm install

# 3. Iniciar servidor de desarrollo con Hot Reload
npm run dev

# 4. Compilar para producción (typecheck + minificación Vite)
npm run build

# 5. Vista previa del bundle de producción
npm run preview
```

---

## 👨‍💻 Autor y Convocatorias

- **Autor:** José Fernando
- **Entorno:** Grado en Ingeniería Informática — Facultad de Informática, Universidad de Murcia (FIUM)
- **Convocatorias Objetivo:** Enero 2027 / Junio 2027 / Julio 2027
- **Lema:** *La constancia y el entendimiento profundo baten a la memorización vacía.*
