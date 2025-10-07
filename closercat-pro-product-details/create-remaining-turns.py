#!/usr/bin/env python3
"""
Script para crear contenido de turnos 7-13 rápidamente
"""
from pathlib import Path

BASE_DIR = Path(__file__).parent / "data"

# Definiciones de contenido para cada turno
TURNS_CONTENT = {
    7: {  # Relaciones PRECEDES
        "steps": [
            {
                "architect": """<div class="step-section">
  <h3>🔗 Relación PRECEDES</h3>
  <div class="modal-message-box user">
    <strong>Usuario:</strong> "¿Qué beneficios ofrece?"
  </div>
  <div class="modal-diagram"><div class="mermaid">
graph LR
  G1[GL_PRES_SHOW_BENEFITS] -.PRECEDES.-> G2[GL_CLOS_COMMITMENT]
  
  G1 --> C{Executed?}
  C -->|No| B[Block G2]
  C -->|Yes| A[Allow G2]

  style G1 fill:#ed8936,color:#fff
  style B fill:#fc8181,color:#fff
</div></div>
  <p>PRECEDES bloquea guidelines hasta que prerequisito se ejecute.</p>
</div>""",
                "pm": """<div class="step-section">
  <h3>🔗 Flujo de Ventas Ordenado</h3>
  <div class="modal-message-box user">
    <strong>Usuario:</strong> "¿Qué beneficios ofrece?"
  </div>
  <h4>¿Por qué Este Orden?</h4>
  <p>Solicitar compromiso ANTES de mostrar beneficios reduce conversión.</p>
  <h4>Flujo Correcto</h4>
  <ol>
    <li>Mostrar beneficios</li>
    <li>Demostrar ROI</li>
    <li>Solicitar compromiso</li>
  </ol>
  <p><strong>Best Practice:</strong> Sistema fuerza metodología probada.</p>
</div>"""
            },
            {
                "architect": """<div class="step-section">
  <h3>🔍 Precedence Checking</h3>
  <div class="modal-diagram"><div class="mermaid">
sequenceDiagram
  participant GE as GuidelineEngine
  participant RC as RelationChecker
  participant H as History

  GE->>RC: check_precedes(guideline_id)
  RC->>H: lookup executed_guidelines
  H-->>RC: [GL_PRES_SHOW_BENEFITS]
  RC-->>GE: precedence_satisfied = false
  GE->>GE: filter_out(GL_CLOS_COMMITMENT)
</div></div>
  <p>Revisa historial para verificar que prerequisitos se ejecutaron.</p>
</div>""",
                "pm": """<div class="step-section">
  <h3>🔍 Validación de Secuencia</h3>
  <h4>Sistema Verifica</h4>
  <ul>
    <li>✅ ¿Mostró beneficios? No</li>
    <li>✅ ¿Demostró ROI? No</li>
    <li>❌ Bloquea: Solicitud de compromiso</li>
  </ul>
  <p><strong>Resultado:</strong> Presenta beneficios primero, siguiendo best practices.</p>
</div>"""
            },
            {
                "architect": """<div class="step-section">
  <h3>✅ Guideline Alternativo</h3>
  <div class="modal-diagram"><div class="mermaid">
graph TB
  Q[Query] --> C[Candidates]
  C --> F[Filter PRECEDES]
  F --> R[Remaining]
  R --> S[GL_PRES_SHOW_BENEFITS<br/>Selected]

  style S fill:#48bb78,color:#fff
</div></div>
  <p>Sistema selecciona guideline apropiado sin relaciones bloqueantes.</p>
</div>""",
                "pm": """<div class="step-section">
  <h3>✅ Respuesta Adecuada</h3>
  <div class="modal-message-box assistant">
    <strong>Asistente:</strong> "Nuestro software te ayuda a: automatizar facturación, control de inventario, reportes en tiempo real..."
  </div>
  <p><strong>Orden Correcto:</strong> Primero valor, luego compromiso. Aumenta probabilidad de cierre.</p>
</div>"""
            }
        ]
    },
    8: {  # Brand Override
        "steps": [
            {
                "architect": """<div class="step-section">
  <h3>🎯 Brand-Specific Config</h3>
  <div class="modal-diagram"><div class="mermaid">
sequenceDiagram
  participant GE as GuidelineEngine
  participant BC as BrandConfig
  participant GL as Guideline

  GE->>BC: load_config(brand_id=1)
  BC-->>GE: brand_overrides
  GE->>GL: apply_overrides(guideline)
  GL-->>GE: customized_guideline
</div></div>
  <p>Brand overrides personalizan sin duplicar guidelines.</p>
</div>""",
                "pm": """<div class="step-section">
  <h3>🎯 Personalización por Marca</h3>
  <div class="modal-message-box assistant">
    <strong>Asistente:</strong> "Nuestro software incluye módulos específicos: facturación electrónica, control PEPS, reportes SUNAT..."
  </div>
  <h4>Ventaja</h4>
  <ul>
    <li>✅ Marca 1: Enfoque PYME</li>
    <li>✅ Marca 2: Enterprise</li>
  </ul>
</div>"""
            },
            {
                "architect": """<div class="step-section">
  <h3>🔧 Config Merge</h3>
  <div class="modal-diagram"><div class="mermaid">
graph TB
  B[Base Guideline] --> M[Merge]
  O[Brand Override] --> M
  M --> F[Final Guideline]

  style F fill:#48bb78,color:#fff
</div></div>
  <p>Merge estratégico prioriza overrides específicos sobre base.</p>
</div>""",
                "pm": """<div class="step-section">
  <h3>🔧 Configuración Flexible</h3>
  <h4>Niveles</h4>
  <ol>
    <li>Base: Guidelines genéricos</li>
    <li>Override: Personalización marca</li>
    <li>Final: Merge optimizado</li>
  </ol>
  <p>Escalable para múltiples marcas sin duplicación.</p>
</div>"""
            },
            {
                "architect": """<div class="step-section">
  <h3>✅ Override Aplicado</h3>
  <p>Guideline personalizado con features específicas de marca.</p>
</div>""",
                "pm": """<div class="step-section">
  <h3>✅ Mensaje Relevante</h3>
  <p>Usuario recibe información específica a su industria y necesidades.</p>
</div>"""
            }
        ]
    },
    # ... continuaré con los demás turnos
}

def create_turn_files(turn_num, steps_content):
    """Crea archivos para un turno específico"""
    turn_dir = BASE_DIR / f"turn{turn_num}"
    turn_dir.mkdir(exist_ok=True)
    
    for step_num, step_data in enumerate(steps_content, 1):
        for role in ["architect", "pm"]:
            file_path = turn_dir / f"step{step_num}-{role}.html"
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(step_data[role])
    
    print(f"✅ Turno {turn_num}: {len(steps_content)} steps creados")

# Crear turnos definidos
for turn_num, data in TURNS_CONTENT.items():
    create_turn_files(turn_num, data["steps"])

print("\\n✅ Turnos 7-8 creados. Ejecuta generate-embedded.py para actualizar embedded-content.js")
