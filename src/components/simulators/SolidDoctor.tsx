import React, { useState } from 'react';
import { Stethoscope, CheckCircle2, XCircle, ArrowRight, Code2, Sparkles } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

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
  },
  {
    id: 'lsp-composition',
    principle: 'L - Liskov Substitution & Favorecer Composición',
    name: 'El Antipatrón de la Herencia Frágil (Efecto "Yo-Yo")',
    symptom: 'Al heredar de HashSet para contar elementos añadidos, addAll() cuenta el doble debido a la ligadura dinámica interna.',
    badCode: `// ❌ MAL: Herencia directa viola encapsulación y LSP (Effective Java Item 16)
public class InstrumentedHashSet<E> extends HashSet<E> {
    private int addCount = 0;
    
    @Override
    public boolean add(E e) {
        addCount++;
        return super.add(e);
    }
    
    @Override
    public boolean addAll(Collection<? extends E> c) {
        addCount += c.size(); // Suma 3
        return super.addAll(c); // ¡HashSet.addAll llama a this.add() 3 veces! Contador = 6
    }
    public int getAddCount() { return addCount; }
}`,
    cleanCode: `// ✅ BIEN: Composición y delegación (Patrón Decorator / Wrapper)
public class InstrumentedSet<E> implements Set<E> {
    private final Set<E> s; // Delegación "caja negra"
    private int addCount = 0;
    
    public InstrumentedSet(Set<E> s) { this.s = s; }
    
    @Override
    public boolean add(E e) {
        addCount++;
        return s.add(e);
    }
    @Override
    public boolean addAll(Collection<? extends E> c) {
        addCount += c.size();
        return s.addAll(c); // s.addAll NO llama al add() de InstrumentedSet
    }
    public int getAddCount() { return addCount; }
    // El resto de métodos de Set delegan limpiamente: public int size() { return s.size(); }
}`,
    diagnosis: 'La superclase no fue diseñada explícitamente para herencia. Cualquier cambio interno en HashSet rompe la subclase. La composición evita sorpresas en tiempo de ejecución.',
    examRule: 'Pregunta fija de teoría: "Explica por qué la herencia rompe la encapsulación citando el ejemplo de InstrumentedHashSet y cómo lo resuelve la composición".'
  },
  {
    id: 'grasp-mvc',
    principle: 'GRASP - Controlador & Separación Modelo-Vista',
    name: 'Lógica de Dominio incrustada en la GUI (JavaFX / Swing)',
    symptom: 'El botón de la vista busca directamente en repositorios, recorre colecciones con bucles anidados y ejecuta lógica de negocio.',
    badCode: `// ❌ MAL: La vista conoce repositorios y entidades del dominio (0 puntos en examen)
public class VentanaProductosFX extends Application {
    // En el manejador del botón:
    btnAñadir.setOnAction(ev -> {
        List<Producto> productos = RepoProductos.INSTANCE.getTodosProductos();
        for (Producto p : productos) {
            if (p.getNombre().equals(txtNombre.getText())) {
                LineaVenta linea = new LineaVenta(p, Integer.parseInt(txtCant.getText()));
                ventaActual.addLineaVenta(linea); // La GUI crea e interactúa con el modelo
            }
        }
    });
}`,
    cleanCode: `// ✅ BIEN: La vista solo delega en el Controlador; el dominio crea sus objetos
public class VentanaProductosFX extends Application {
    btnAñadir.setOnAction(ev -> {
        // La vista SOLO recoge datos y delega en el Controlador
        ControladorVentas.INSTANCE.añadirProductoAVenta(
            txtNombre.getText(), 
            Integer.parseInt(txtCant.getText())
        );
    });
}

public class ControladorVentas {
    public void añadirProductoAVenta(String nombre, int cant) {
        Producto p = RepoProductos.INSTANCE.buscarPorNombre(nombre);
        ventaActual.crearLineaVenta(p, cant); // Patrón Creador: Venta crea sus LineaVenta
    }
}`,
    diagnosis: 'La capa de presentación solo debe encargarse de mostrar widgets y capturar eventos. Todo cálculo, búsqueda o agregación debe remitirse al Controlador y al Modelo.',
    examRule: 'Criterio de corrección UMU (Boletín GRASP, Ej. 6): Si la clase Ventana hace un "new LineaVenta" o accede a "RepoProductos", se penaliza por violar Controlador, Experto y Separación Modelo-Vista.'
  }
];

export const SolidDoctor: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<number>(0);
  const current = CASES[selectedCase];

  return (
    <div className="duo-card p-6 sm:p-8 bg-white border-2 border-b-[6px] border-[#E5E5E5] text-[#4B4B4B] font-sans">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-[#E5E5E5]">
        <span className="p-2.5 bg-[#F5EAFF] text-[#CE82FF] rounded-2xl border-2 border-[#CE82FF]">
          <Stethoscope className="w-5 h-5 stroke-[2.5]" />
        </span>
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-[#4B4B4B]">SOLID Code Doctor (TDS & Patrones GoF)</h3>
          <p className="text-xs text-[#777777] font-bold mt-0.5">Compara código sucio vs arquitectura limpia con las reglas de corrección del profesor.</p>
        </div>
      </div>

      {/* Principle Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {CASES.map((c, idx) => (
          <button
            key={c.id}
            onClick={() => {
              soundManager.playClick();
              setSelectedCase(idx);
            }}
            className={`p-3.5 text-left rounded-2xl border-2 border-b-4 transition cursor-pointer ${
              selectedCase === idx
                ? 'bg-[#F5EAFF] border-[#CE82FF] text-[#A559D9]'
                : 'bg-white border-[#E5E5E5] text-[#4B4B4B] hover:bg-[#F7F7F7]'
            }`}
          >
            <div className="text-xs font-black text-[#CE82FF] uppercase tracking-wider">{c.principle.split('-')[0]}</div>
            <div className="font-black text-sm text-[#4B4B4B] mt-1">{c.name}</div>
          </button>
        ))}
      </div>

      {/* Case Header */}
      <div className="bg-[#F7F7F7] p-5 rounded-2xl border-2 border-[#E5E5E5] mb-6">
        <div className="text-xs font-black text-[#CE82FF] uppercase tracking-wider">{current.principle}</div>
        <h4 className="text-lg font-black text-[#4B4B4B] mt-1">{current.name}</h4>
        <p className="text-xs text-[#EA2B2B] mt-1.5 flex items-center gap-1.5 font-bold">
          <XCircle className="w-4 h-4 shrink-0 text-[#FF4B4B]" />
          <span>Síntoma: {current.symptom}</span>
        </p>
      </div>

      {/* Side-by-side Code Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 font-mono text-xs">
        {/* Bad Code */}
        <div className="bg-[#FFF0F0] rounded-2xl border-2 border-b-4 border-[#FF4B4B] overflow-hidden">
          <div className="bg-[#FFE5E5] px-4 py-2.5 border-b border-[#FFD0D0] flex items-center justify-between text-[#EA2B2B] font-black font-sans">
            <span className="flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-[#FF4B4B]" /> Antipatrón (Suspenso en TDS)
            </span>
            <span className="text-[10px] bg-[#FFDFE0] px-2 py-0.5 rounded-full text-[#EA2B2B] font-black">CÓDIGO ACOPLADO</span>
          </div>
          <pre className="p-4 text-[#EA2B2B] overflow-x-auto leading-relaxed whitespace-pre-wrap font-bold">
            {current.badCode}
          </pre>
        </div>

        {/* Clean Code */}
        <div className="bg-[#F0FFF4] rounded-2xl border-2 border-b-4 border-[#58CC02] overflow-hidden">
          <div className="bg-[#D7FFB8] px-4 py-2.5 border-b border-[#B2E690] flex items-center justify-between text-[#58A700] font-black font-sans">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#58CC02]" /> Solución Profesional (Nota 10)
            </span>
            <span className="text-[10px] bg-[#EAFBEA] px-2 py-0.5 rounded-full text-[#58A700] font-black">DESACOPLADO & TESTABLE</span>
          </div>
          <pre className="p-4 text-[#58A700] overflow-x-auto leading-relaxed whitespace-pre-wrap font-bold">
            {current.cleanCode}
          </pre>
        </div>
      </div>

      {/* Diagnosis & Exam Advice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="bg-[#F5EAFF] p-4 rounded-2xl border-2 border-b-4 border-[#CE82FF] text-[#A559D9] font-bold">
          <div className="font-black text-[#A559D9] mb-1 flex items-center gap-1.5 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#CE82FF]" />
            <span>Diagnóstico Arquitectónico:</span>
          </div>
          <p className="leading-relaxed opacity-90">{current.diagnosis}</p>
        </div>

        <div className="bg-[#FFF4D0] p-4 rounded-2xl border-2 border-b-4 border-[#FFC800] text-[#E08500] font-bold">
          <div className="font-black text-[#FF9600] mb-1 flex items-center gap-1.5 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-[#FF9600]" />
            <span>Criterio de Evaluación en el Proyecto UMU:</span>
          </div>
          <p className="leading-relaxed opacity-90">{current.examRule}</p>
        </div>
      </div>
    </div>
  );
};
