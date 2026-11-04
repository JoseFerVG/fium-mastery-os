# ⚡ FIUM Mastery OS | Plataforma de Recuperación y Alto Rendimiento (UMU)

> **Diseñada para el Grado en Ingeniería Informática de la Universidad de Murcia (FIUM).**
> Creado para entender los conceptos de raíz sin medias tintas, dominar las trampas de examen y garantizar el 10.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6.svg)
![Tailwind](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)

---

## 🎯 ¿Por qué existe esta plataforma?

Muchos estudiantes de informática en la UMU caen en la trampa de memorizar diapositivas sin entender la arquitectura o las matemáticas subyacentes. Cuando llegan los parciales y finales con ejercicios que combinan conceptos, surgen los bloqueos.

**FIUM Mastery OS** ataca directamente este problema mediante el método de las tres capas:
1. **Intuición Física / Feynman:** Explicación analógica y directa de cómo funciona realmente en hardware o en memoria.
2. **Rigor Matemático & Formal:** Demostraciones, fórmulas de rendimiento (Amdahl, CPI, MIPS) y teoremas formales.
3. **Anatomía de las Trampas de Examen:** Errores sutiles diseñados por los profesores de la UMU para restar décimas (p.ej. confundir bloques con conjuntos en memorias asociativas por conjuntos, o saltarse la condición de dependencia RAW en saltos condicionales con Branch Delay Slot).

---

## 🚀 Módulos y Simuladores Interactivos Integrados

### 1. 💻 AOC (Arquitectura y Organización de Computadores)
- **Simulador de Segmentación MIPS (Pipeline 5 Etapas):**
  - Pasos por ciclos (IF, ID, EX, MEM, WB).
  - Detección de riesgos RAW (Read After Write) y paradas (*stalls*).
  - Activación/desactivación del mecanismo de cortocircuito (*forwarding*).
- **Calculador de Arquitectura de Memoria Caché:**
  - Ajuste de tamaño de caché, tamaño de bloque y asociatividad (Directa, 2-vías, 4-vías, Totalmente Asociativa).
  - Cálculo instantáneo de bits de Tag, Index y Offset para direcciones de 32 bits.
  - Decodificador interactivo de direcciones hexadecimales reales (`0x00403A2C`).
  - Cálculo de la sobrecarga física en hardware (bits de etiqueta + bit de validez).

### 2. 🐧 ASO (Ampliación de Sistemas Operativos)
- **Simulador de Memoria Virtual & Algoritmos de Reemplazo:**
  - Análisis paso a paso de fallos de página (*Page Faults*).
  - Comparador interactivo de políticas: **FIFO**, **LRU** (Least Recently Used) y **Reloj (Segunda Oportunidad)**.
  - Gestión de tablas de páginas multinivel (CR3, PGD, PMD, PTE) y TLB.

### 3. ⚙️ ALF (Autómatas y Lenguajes Formales)
- **Ejecutor de Autómatas Finitos Deterministas (DFA):**
  - Verificador de cadenas en tiempo real sobre la cinta de entrada.
  - Transición paso a paso entre estados ($q_0 \to q_1 \to q_2$).
  - Distinción rigurosa de lenguajes regulares frente a libres de contexto (Lema del Bombeo).

### 4. 🧩 TDS (Tecnologías de Desarrollo de Software)
- **SOLID Code Doctor:**
  - Diagnóstico interactivo de código espagueti vs. arquitectura desacoplada.
  - Violaciones típicas del Principio de Inversión de Dependencias (DIP) y Responsabilidad Única (SRP).
  - Patrones de diseño esenciales (Factory, Strategy, Observer).

---

## 🧠 Entrenador de Exámenes UMU

Banco interactivo de preguntas tipo examen con:
- Enunciados basados en problemas de convocatorias reales de la FIUM.
- Corrección inmediata con argumentación matemática y teórica.
- Detección explícita de la trampa en la que caen el 80% de los alumnos.

---

## ⏱️ Estación de Enfoque Profundo (Pomodoro)

- Ciclos 25 min estudio / 5 min descanso / 15 min descanso largo.
- Contador de racha y persistencia local (`localStorage`).
- Sin distracciones, adaptado al ritmo de resolución de problemas de ingeniería.

---

## 🛠️ Tecnologías Utilizadas

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite 8
- **Estilos:** Tailwind CSS v4
- **Iconografía:** Lucide React
- **Efectos:** Canvas Confetti

---

## 📦 Instalación y Ejecución Local

```bash
# Clonar el repositorio
git clone https://github.com/JoseFerVG/fium-mastery-os.git
cd fium-mastery-os

# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Compilar para producción
npm run build
```

---

## 🎓 Autor
- **José Fernando** (`JoseFerVG`)
- Estudiante de Grado en Ingeniería Informática
- Universidad de Murcia (UMU)
