import React, { useState } from 'react';
import { Stethoscope, CheckCircle2, XCircle, ArrowRight, Code2, Sparkles } from 'lucide-react';

interface CaseStudy {
  id: string;
  principle: string;
  name: string;
  symptom: string;
  badCode: string;
  cleanCode: string;
  diagnosis: string;
  examRule: string;
}

const CASES: CaseStudy[] = [
  {
    id: 'srp',
    principle: 'S - Single Responsibility Principle',
    name: 'Violación Clásica: La Clase "Dios" que hace todo',
    symptom: 'Una clase Factura calcula precios, imprime PDFs y guarda en base de datos MySQL.',
    badCode: `// ❌ MAL: 3 razones diferentes para cambiar
public class Factura {
    public double calcularTotal() { /* cálculo */ }
    public void imprimirPDF() { /* lógica gráfica iText */ }
    public void guardarEnMySQL() { /* conexión JDBC/SQL */ }
}`,
    cleanCode: `// ✅ BIEN: Separación en responsabilidades atómicas
public class Factura {
    public double calcularTotal() { /* solo lógica de negocio */ }
}
public class FacturaPrinter {
    public void imprimir(Factura f) { /* solo presentación */ }
}
public class FacturaRepository {
    public void guardar(Factura f) { /* solo persistencia */ }
}`,
    diagnosis: 'Si cambia la librería de PDFs o cambiamos MySQL por PostgreSQL, la clase Factura no debe verse afectada.',
    examRule: 'En el examen de TDS: Si una clase tiene imports de UI (Swing/JavaFX) Y de persistencia (SQL/Ficheros), penalización máxima por violar SRP.'
  },
  {
    id: 'ocp-strategy',
    principle: 'O - Open / Closed Principle + Patrón Strategy',
    name: 'El Antipatrón del Switch-Case Infinito',
    symptom: 'Cada vez que hay un nuevo tipo de envío o descuento hay que editar el código existente.',
    badCode: `// ❌ MAL: Modificamos la clase ante cada nuevo transporte
public class CalculadorEnvio {
    public double calcular(String tipo) {
        if (tipo.equals("ESTANDAR")) return 5.0;
        else if (tipo.equals("EXPRESS")) return 15.0;
        else if (tipo.equals("DRON")) return 30.0; // ¡Tuvimos que editar aquí!
        return 0;
    }
}`,
    cleanCode: `// ✅ BIEN: Abierto a la extensión mediante interfaz Strategy
public interface MetodoEnvio {
    double getCoste();
}
public class EnvioEstandar implements MetodoEnvio { public double getCoste() { return 5.0; } }
public class EnvioDron implements MetodoEnvio { public double getCoste() { return 30.0; } }

public class CalculadorEnvio {
    public double calcular(MetodoEnvio metodo) {
        return metodo.getCoste(); // ¡Nunca se modifica!
    }
}`,
    diagnosis: 'Cumple OCP: añadimos nuevos medios de transporte creando nuevas clases, sin tocar una sola coma de CalculadorEnvio.',
    examRule: 'En el proyecto de TDS: Los profesores exigen explícitamente usar Strategy para cualquier lógica variable o de tarificación.'
  },
  {
    id: 'dip',
    principle: 'D - Dependency Inversion Principle',
    name: 'Acoplamiento Fuerte a Clases Concretas',
    symptom: 'El controlador instancia directamente con "new" una base de datos específica.',
    badCode: `// ❌ MAL: Alto nivel acoplado a bajo nivel
public class ServicioUsuarios {
    private MySQLDatabase database = new MySQLDatabase(); // ¡new rígido!
}`,
    cleanCode: `// ✅ BIEN: Inversión de dependencias mediante interfaz
public interface RepositorioUsuarios {
    Usuario findById(int id);
}

public class ServicioUsuarios {
    private final RepositorioUsuarios repo;
    
    // Inyección de dependencia por constructor
    public ServicioUsuarios(RepositorioUsuarios repo) {
        this.repo = repo;
    }
}`,
    diagnosis: 'Permite hacer tests unitarios con Mockito instantáneos pasando un mock en el constructor sin levantar ninguna base de datos real.',
    examRule: 'Si no puedes mockear un servicio en JUnit porque tiene `new` dentro, no pasarás las pruebas automáticas del proyecto.'
  }
];

export const SolidDoctor: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<number>(0);
  const current = CASES[selectedCase];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center gap-2 mb-6">
        <span className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
          <Stethoscope className="w-5 h-5" />
        </span>
        <div>
          <h3 className="text-xl font-bold text-white">SOLID Code Doctor (TDS & Patrones GoF)</h3>
          <p className="text-sm text-slate-400">Compara código sucio vs arquitectura limpia con las reglas de corrección del profesor.</p>
        </div>
      </div>

      {/* Principle Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {CASES.map((c, idx) => (
          <button
            key={c.id}
            onClick={() => setSelectedCase(idx)}
            className={`p-3 text-left rounded-xl border transition ${
              selectedCase === idx
                ? 'bg-purple-600/15 border-purple-500 text-white'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-bold text-purple-400 uppercase tracking-wider">{c.principle.split('-')[0]}</div>
            <div className="font-semibold text-sm text-slate-200 mt-1">{c.name}</div>
          </button>
        ))}
      </div>

      {/* Case Header */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6">
        <div className="text-xs font-bold text-purple-400 uppercase tracking-wider">{current.principle}</div>
        <h4 className="text-lg font-bold text-white mt-1">{current.name}</h4>
        <p className="text-xs text-rose-300 mt-1.5 flex items-center gap-1.5 font-medium">
          <XCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>Síntoma: {current.symptom}</span>
        </p>
      </div>

      {/* Side-by-side Code Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 font-mono text-xs">
        {/* Bad Code */}
        <div className="bg-slate-950 rounded-xl border border-rose-900/40 overflow-hidden">
          <div className="bg-rose-950/40 px-4 py-2 border-b border-rose-900/40 flex items-center justify-between text-rose-300 font-bold font-sans">
            <span className="flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-rose-400" /> Antipatrón (Suspenso en TDS)
            </span>
            <span className="text-[10px] bg-rose-500/20 px-2 py-0.5 rounded text-rose-300">CÓDIGO ACOPLADO</span>
          </div>
          <pre className="p-4 text-slate-300 overflow-x-auto leading-relaxed whitespace-pre-wrap">
            {current.badCode}
          </pre>
        </div>

        {/* Clean Code */}
        <div className="bg-slate-950 rounded-xl border border-emerald-900/40 overflow-hidden">
          <div className="bg-emerald-950/40 px-4 py-2 border-b border-emerald-900/40 flex items-center justify-between text-emerald-300 font-bold font-sans">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Solución Profesional (Nota 10)
            </span>
            <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-300">DESACOPLADO & TESTABLE</span>
          </div>
          <pre className="p-4 text-emerald-200 overflow-x-auto leading-relaxed whitespace-pre-wrap">
            {current.cleanCode}
          </pre>
        </div>
      </div>

      {/* Diagnosis & Exam Advice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300">
          <div className="font-bold text-white mb-1 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Diagnóstico Arquitectónico:</span>
          </div>
          <p className="text-slate-400 leading-relaxed">{current.diagnosis}</p>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 text-amber-200">
          <div className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Criterio de Evaluación en el Proyecto UMU:</span>
          </div>
          <p className="leading-relaxed opacity-90">{current.examRule}</p>
        </div>
      </div>
    </div>
  );
};
