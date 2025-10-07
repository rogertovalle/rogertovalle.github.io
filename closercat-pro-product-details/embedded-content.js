// ==================== EMBEDDED CONTENT ====================
// Auto-generated from data/ folder - Only architect and pm views

window.EMBEDDED_CONTENT = {
    1: {
        1: {
            architect: `<div class="step-section">
    <h3>📱 Mensaje del Usuario</h3>
    <div class="modal-message-box user">
        <strong>Usuario:</strong> "Hola, quisiera información sobre sus soluciones"
    </div>
    <h4>Flujo de Entrada</h4>
    <div class="modal-diagram"><div class="mermaid">
graph LR
    A[WhatsApp API] -->|Webhook| B[Message Handler]
    B --> C[SalesAgent]
    C --> D[Update SalesState]
    D --> E[GovernanceInput Adapter]
    E --> F[GuidelineEngine]
    
    style C fill:#667eea,color:#fff
    style F fill:#764ba2,color:#fff
    </div></div>
    <h4>Decisión de Diseño</h4>
    <p><strong>Patrón Adapter:</strong> Separamos la lógica de parsing del canal (WhatsApp/Web) de la lógica de negocio. Esto permite agregar nuevos canales sin modificar GuidelineEngine.</p>
</div>`,
            pm: `<div class="step-section">
    <h3>📱 Primer Contacto con Juan</h3>
    <div class="modal-message-box user">
        <strong>Juan Pérez:</strong> "Hola, quisiera información sobre sus soluciones"
    </div>
    <h4>Contexto de Negocio</h4>
    <p>Juan es un prospecto nuevo que llega por WhatsApp. Es dueño de una PYME y busca información general sobre nuestro software de gestión.</p>
    <h4>Objetivo del Sistema</h4>
    <ul>
        <li>✅ Dar bienvenida profesional</li>
        <li>✅ Capturar intención (info_request)</li>
        <li>✅ Iniciar proceso de calificación</li>
        <li>✅ Establecer rapport inicial</li>
    </ul>
    <h4>Valor para el Negocio</h4>
    <p><strong>Captura temprana de intent permite:</strong> Personalizar el pitch, priorizar según urgencia, y optimizar conversión desde el primer mensaje.</p>
</div>`
        },
        2: {
            architect: `<div class="step-section">
    <h3>📊 Estado Inicial del Sistema</h3>
    <h4>SalesState Architecture</h4>
    <p><strong>SalesState</strong> es el objeto central que mantiene todo el contexto de la conversación. Es un diccionario Python que se pasa entre componentes.</p>
    <div class="modal-diagram"><div class="mermaid">
graph TB
    SS[SalesState] --> UI[user_identity]
    SS --> BS[bant_state]
    SS --> LS[lead_state]
    SS --> CS[checkpoint_stack]
    
    UI -->|known_user: false| U1[email: null]
    BS --> B1[budget: null]
    LS --> L1[intent: null]

    style SS fill:#667eea,color:#fff
    </div></div>
    <h4>Patrón de Diseño</h4>
    <p><strong>State Object Pattern:</strong> Un único objeto de estado que pasa por todo el pipeline, evitando múltiples queries a BD.</p>
</div>`,
            pm: `<div class="step-section">
    <h3>📊 Estado Inicial</h3>
    <h4>Lo que Sabemos</h4>
    <ul>
        <li>✅ Canal: WhatsApp</li>
        <li>✅ Fase: Prospección</li>
        <li>✅ Marca: Brand ID 1</li>
    </ul>
    <h4>Lo que NO Sabemos</h4>
    <ul>
        <li>❌ Nombre del prospecto</li>
        <li>❌ Intent específico</li>
        <li>❌ Presupuesto</li>
        <li>❌ Tamaño de empresa</li>
    </ul>
    <h4>Próximos Pasos</h4>
    <p>El sistema buscará un guideline apropiado para dar bienvenida y capturar información inicial.</p>
</div>`
        },
        3: {
            architect: `<div class="step-section">
    <h3>🔍 Arquitectura de Matching</h3>
    <div class="modal-diagram"><div class="mermaid">
sequenceDiagram
    participant GE as GuidelineEngine
    participant DB as Database

    GE->>DB: Query inicial
    DB-->>GE: 87 candidatos
    
    rect rgb(200, 220, 255)
        Note over GE: Filtrado Determinístico
        GE->>GE: Filter tipo_input
        Note over GE: 23 candidatos
    end
    
    rect rgb(255, 240, 220)
        Note over GE: Matching Semántico
        GE->>GE: Calculate embedding
        GE->>GE: Cosine similarity
        Note over GE: 5 candidatos
    end
    
    rect rgb(220, 255, 220)
        Note over GE: Selección
        GE->>GE: Sort by prioridad_efectiva
        Note over GE: Top 1 selected
    end
    </div></div>
    <h4>Multi-Stage Filtering</h4>
    <p>Filtros en cascada para reducir progresivamente candidatos, optimizando performance.</p>
</div>`,
            pm: `<div class="step-section">
    <h3>🔍 Selección de Respuesta</h3>
    <h4>Proceso</h4>
    <p>El sistema evalúa <strong>87 posibles respuestas</strong> y las reduce:</p>
    <div class="modal-metrics">
        <div class="modal-metric">
            <div class="modal-metric-value">87</div>
            <div class="modal-metric-label">Candidatos Iniciales</div>
        </div>
        <div class="modal-metric">
            <div class="modal-metric-value">5</div>
            <div class="modal-metric-label">Alta Relevancia</div>
        </div>
        <div class="modal-metric">
            <div class="modal-metric-value">1</div>
            <div class="modal-metric-label">Seleccionado</div>
        </div>
    </div>
    <h4>Criterios</h4>
    <ol>
        <li><strong>Contexto:</strong> Fase, canal, tipo de mensaje</li>
        <li><strong>Relevancia:</strong> Similitud semántica</li>
        <li><strong>Prioridad:</strong> Importancia del objetivo</li>
    </ol>
</div>`
        }
    },
    2: {
        1: {
            architect: `<div class="step-section">
  <h3>👋 Bienvenida + Inicio de Calificación</h3>
  <div class="modal-message-box assistant">
    <strong>Asistente:</strong> "¡Hola Juan! Encantado de ayudarte. ¿Cuántos empleados tiene tu empresa?"
  </div>
  <div class="modal-diagram"><div class="mermaid">
sequenceDiagram
  participant U as Usuario
  participant SA as SalesAgent
  participant GE as GuidelineEngine

  U->>SA: "Hola..."
  SA->>GE: select_greeting_guideline()
  GE-->>SA: GL_PROSPECT_WELCOME
  SA-->>U: pregunta tamaño de empresa
</div></div>
  <p>Se dispara guideline de bienvenida y se inicia la calificación.</p>
</div>`,
            pm: `<div class="step-section">
  <h3>👋 Bienvenida + Calificación</h3>
  <div class="modal-message-box assistant">
    <strong>Asistente:</strong> "¡Hola Juan! Encantado de ayudarte. ¿Cuántos empleados tiene tu empresa?"
  </div>
  <h4>Objetivo</h4>
  <ul>
    <li>✅ Dar bienvenida profesional</li>
    <li>✅ Iniciar calificación (BANT)</li>
    <li>✅ Capturar tamaño de empresa</li>
  </ul>
  <p><strong>Valor:</strong> Pregunta simple que habilita pricing y segmentación.</p>
</div>`
        },
        2: {
            architect: `<div class="step-section">
  <h3>🧭 Detección de Metodología</h3>
  <div class="modal-diagram"><div class="mermaid">
sequenceDiagram
  participant GE as GuidelineEngine
  participant DM as MethodologyDetector
  participant SS as SalesState

  GE->>DM: determine_methodology(SS)
  DM-->>GE: BANT (fase: qualification)
  GE->>SS: set current_phase = qualification
</div></div>
  <p>Se selecciona BANT por contexto de calificación inicial.</p>
</div>`,
            pm: `<div class="step-section">
  <h3>🧭 Metodología Detectada</h3>
  <h4>Resultado</h4>
  <ul>
    <li>✅ Metodología: <strong>BANT</strong></li>
    <li>✅ Fase: <strong>Qualification</strong></li>
    <li>✅ Próxima pregunta: <em>Tamaño de empresa</em></li>
  </ul>
  <p><strong>Valor:</strong> Esta ruta acelera la calificación y prepara el terreno para pricing y ROI.</p>
</div>`
        },
        3: {
            architect: `<div class="step-section">
  <h3>✅ Guideline de Pregunta</h3>
  <div class="modal-diagram"><div class="mermaid">
graph TB
  O[OBJ_QUALIFY_LEAD] --> G[GL_QUAL_ASK_COMPANY_SIZE]
  G --> A[Adapter: response_template]
  G --> T[Tipo: question]

  style G fill:#48bb78,color:#fff
</div></div>
  <p>Se selecciona el guideline que solicita tamaño de empresa como primer dato clave.</p>
</div>`,
            pm: `<div class="step-section">
  <h3>✅ Pregunta Clave Realizada</h3>
  <div class="modal-message-box assistant">
    <strong>Asistente:</strong> "¿Cuántos empleados tiene tu empresa?"
  </div>
  <h4>Por qué esta pregunta</h4>
  <ul>
    <li>✅ Habilita cálculo de precio y descuento por volumen</li>
    <li>✅ Segmenta por tamaño (PYME vs Enterprise)</li>
    <li>✅ Mantiene la conversación simple y guiada</li>
  </ul>
  <p><strong>Resultado:</strong> Prepara el terreno para responder sobre precio en el Turno 3.</p>
</div>`
        }
    },
    3: {
        1: {
            architect: `<div class="step-section">
  <h3>📱 Mensaje del Usuario</h3>
  <div class="modal-message-box user">
    <strong>Usuario:</strong> "Somos 30 empleados. ¿Cuánto cuesta?"
  </div>
  <h4>Vista de Flujo</h4>
  <div class="modal-diagram"><div class="mermaid">
sequenceDiagram
  participant U as Usuario
  participant SA as SalesAgent
  participant GI as GovernanceInput
  participant GE as GuidelineEngine

  U->>SA: "Somos 30 empleados. ¿Cuánto cuesta?"
  SA->>GI: Adapt message to governance_input
  GI-->>GE: tipo_input=price_inquiry<br/>icp.company_size=30
  GE->>GE: Matching + condiciones
  GE-->>SA: Guideline seleccionado
</div></div>
  <h4>Decisiones</h4>
  <ul>
    <li>Detectar intención de precio para priorizar cálculos y políticas</li>
    <li>Extraer tamaño para habilitar descuentos por volumen</li>
  </ul>
</div>`,
            pm: `<div class="step-section">
  <h3>📱 Usuario pregunta precio</h3>
  <div class="modal-message-box user">
    <strong>Usuario:</strong> "Somos 30 empleados. ¿Cuánto cuesta?"
  </div>
  <h4>Objetivo de Negocio</h4>
  <ul>
    <li>✅ Capturar tamaño de empresa (30) para pricing</li>
    <li>✅ Clasificar intención como <strong>price_inquiry</strong></li>
    <li>✅ Preparar flujo de cálculo de descuentos</li>
  </ul>
  <h4>Valor</h4>
  <p>Permite ofrecer un precio personalizado y más competitivo, aumentando la probabilidad de conversión.</p>
</div>`
        },
        2: {
            architect: `<div class="step-section">
  <h3>🔍 Arquitectura de Matching y Condiciones</h3>
  <div class="modal-diagram"><div class="mermaid">
sequenceDiagram
  participant GE as GuidelineEngine
  participant ES as Embedding
  participant DB as Database

  GE->>DB: Query (brand, fase, metodologia, activa)
  DB-->>GE: Lista de candidatos
  GE->>GE: Filtros determinísticos (tipo_input, canal)
  GE->>GE: Evaluación condiciones JSONPath
  GE->>ES: Similaridad semántica (si aplica)
  ES-->>GE: top-k relevantes
  GE-->>GE: Ordenar por prioridad_efectiva
</div></div>
  <h4>Notas</h4>
  <ul>
    <li>Condiciones JSONPath permiten activar un guideline sólo si el estado cumple</li>
    <li>El orden final se rige por prioridad efectiva (objetivo*1000 + local)</li>
  </ul>
</div>`,
            pm: `<div class="step-section">
  <h3>🔍 Cómo decide el sistema en este turno</h3>
  <h4>Filtros aplicados</h4>
  <ul>
    <li>✅ Contexto: Fase = Qualification, Metodología = BANT</li>
    <li>✅ Tipo de mensaje: <strong>price_inquiry</strong></li>
    <li>✅ Canal: WhatsApp</li>
    <li>✅ Condiciones: company_size ≥ 10</li>
  </ul>
  <h4>Resultado</h4>
  <p>Se priorizan guidelines que piden presupuesto o preparan el cálculo de precio con descuento por volumen.</p>
</div>`
        },
        3: {
            architect: `<div class="step-section">
  <h3>✅ Guideline Seleccionado (Vista Arquitectura)</h3>
  <div class="modal-diagram"><div class="mermaid">
graph TB
  O[OBJ_PRES_VALUE_V1<br/>Demostrar valor] --> G1[GL_QUAL_PRICING_PREPARE]
  O --> G2[GL_QUAL_BUDGET_ASK]
  
  G1 -. DEPENDS_ON .-> G2
  G1 --> A1[Adapters:<br/>state_lookup]
  G1 --> C1[Calculations:<br/>discount_rate]

  style G1 fill:#48bb78,color:#fff
  style O fill:#667eea,color:#fff
</div></div>
  <h4>Relaciones</h4>
  <ul>
    <li><strong>DEPENDS_ON:</strong> Si el descuento requiere budget luego, G1 puede depender de G2 en pasos posteriores</li>
    <li><strong>PRECEDES:</strong> G2 puede preceder a pricing final si falta budget</li>
  </ul>
</div>`,
            pm: `<div class="step-section">
  <h3>✅ Resultado del Turno</h3>
  <h4>Guideline seleccionado</h4>
  <p><strong>GL_QUAL_PRICING_PREPARE_PRI70_V1</strong> — Prepara el cálculo de precio usando el tamaño de empresa capturado.</p>
  <h4>Qué logra</h4>
  <ul>
    <li>✅ Usa <strong>30 empleados</strong> para estimar un descuento preliminar</li>
    <li>✅ Mantiene la conversación fluida sin pedir todavía presupuesto</li>
    <li>✅ Deja listo el contexto para presentar precio + valor</li>
  </ul>
  <h4>Impacto de negocio</h4>
  <p>Permite responder con números relevantes rápidamente, mejorando la percepción de personalización y valor.</p>
</div>`
        }
    },
    4: {
        1: {
            architect: `<div class="step-section">
  <h3>⏸️ Creación de Checkpoint (Arquitectura)</h3>
  <div class="modal-diagram"><div class="mermaid">
sequenceDiagram
  participant GE as GuidelineEngine
  participant CE as CalculationExecutor
  participant CM as CheckpointManager
  participant SS as SalesState

  GE->>CE: Ejecutar cálculo descuento
  CE->>CE: Validar inputs
  CE-->>CE: Falta bant_state.budget
  CE->>CM: create_checkpoint(missing=[budget])
  CM->>SS: push checkpoint_stack
  CM-->>GE: checkpoint_id
  GE-->>GE: seleccionar fallback guideline (ask_user)
</div></div>
  <h4>Notas</h4>
  <ul>
    <li>El cálculo se pausa en un punto seguro y guarda contexto</li>
    <li>Se solicita el dato faltante con un guideline de fallback</li>
  </ul>
</div>`,
            pm: `<div class="step-section">
  <h3>⏸️ Se pausa para pedir presupuesto</h3>
  <div class="modal-message-box assistant">
    <strong>Sistema:</strong> "Para calcular el mejor precio, ¿cuál es tu presupuesto mensual aproximado?"
  </div>
  <h4>¿Por qué se detuvo?</h4>
  <p>El sistema necesita tu presupuesto para continuar con el cálculo de precio y descuento por volumen. En cuanto lo proporciones, retomará automáticamente.</p>
  <h4>Ventaja</h4>
  <ul>
    <li>✅ No se pierde el contexto</li>
    <li>✅ Continúa justo donde se quedó</li>
    <li>✅ Evita respuestas incompletas</li>
  </ul>
</div>`
        },
        2: {
            architect: `<div class="step-section">
  <h3>📦 Estado con Checkpoint</h3>
  <div class="modal-diagram"><div class="mermaid">
graph TB
  SS[SalesState] --> CS[checkpoint_stack]
  CS --> CP1[ckpt_001\\nmissing: budget\\ncollected: company_size=30]
  SS --> BS[bant_state]
  SS --> SO[solution_offer]

  style CS fill:#ed8936,color:#fff
  style CP1 fill:#fff,color:#ed8936,stroke:#ed8936
</div></div>
  <h4>Protecciones</h4>
  <ul>
    <li><strong>Max depth:</strong> 10</li>
    <li><strong>Loop detection:</strong> evita repetir mismo guideline</li>
    <li><strong>Retries globales:</strong> 3</li>
  </ul>
</div>`,
            pm: `<div class="step-section">
  <h3>📦 El sistema guardó tu progreso</h3>
  <h4>¿Qué significa el checkpoint?</h4>
  <ul>
    <li>✅ Guardamos dónde íbamos en el cálculo</li>
    <li>✅ Recordamos los datos ya capturados (30 empleados)</li>
    <li>✅ Retomaremos automáticamente cuando nos des el presupuesto</li>
  </ul>
  <h4>Próximo paso</h4>
  <p>Por favor indícanos tu <strong>presupuesto mensual aproximado</strong> para esta solución.</p>
</div>`
        },
        3: {
            architect: `<div class="step-section">
  <h3>▶️ Fallback + Continuación del Flujo</h3>
  <div class="modal-diagram"><div class="mermaid">
sequenceDiagram
  participant GE as GuidelineEngine
  participant CM as CheckpointManager
  participant SS as SalesState
  participant U as Usuario

  GE->>CM: checkpoint_required
  CM-->>GE: ckpt_001 (pending: calculate_volume_discount)
  GE->>GE: select fallback: GL_QUAL_BUDGET_ASK
  GE-->>U: "¿Cuál es tu presupuesto mensual aproximado?"
  
  Note right of SS: Esperando input -> resume en Turno 5
</div></div>
  <h4>Comportamiento esperado</h4>
  <ul>
    <li>El stack conserva el punto exacto de reanudación</li>
    <li>Al capturar budget en Turno 5, se ejecuta el cálculo pendiente</li>
  </ul>
</div>`,
            pm: `<div class="step-section">
  <h3>▶️ Pregunta y continuación</h3>
  <div class="modal-message-box assistant">
    <strong>Asistente:</strong> "Para calcular el mejor precio con descuento, ¿cuál es tu presupuesto mensual aproximado?"
  </div>
  <h4>¿Qué sigue?</h4>
  <p>El sistema espera tu respuesta. Cuando proporciones el presupuesto:</p>
  <ul>
    <li>✅ Retomará el cálculo interrumpido</li>
    <li>✅ Calculará el descuento por volumen</li>
    <li>✅ Presentará precio final personalizado</li>
  </ul>
  <h4>Ventaja para el negocio</h4>
  <p>Conversación fluida sin perder contexto ni repetir información ya capturada.</p>
</div>`
        }
    },
    5: {
        1: {
            architect: `<div class="step-section">
  <h3>▶️ Resume Checkpoint</h3>
  <div class="modal-message-box user">
    <strong>Usuario:</strong> "Tengo $15,000 mensuales disponibles"
  </div>
  <div class="modal-diagram"><div class="mermaid">
sequenceDiagram
  participant U as Usuario
  participant SA as SalesAgent
  participant CM as CheckpointManager
  participant CE as CalculationExecutor

  U->>SA: "$15,000 mensuales"
  SA->>CM: detect_resume_trigger
  CM->>CM: pop checkpoint_stack[0]
  CM->>CE: resume(ckpt_001)
  CE->>CE: execute with budget=15000
  CE-->>SA: calculation_result
</div></div>
  <p>Sistema detecta dato faltante y retoma automáticamente desde checkpoint.</p>
</div>`,
            pm: `<div class="step-section">
  <h3>▶️ Reanudación Automática</h3>
  <div class="modal-message-box user">
    <strong>Usuario:</strong> "Tengo $15,000 mensuales disponibles"
  </div>
  <h4>Qué Sucede</h4>
  <ul>
    <li>✅ Sistema captura: $15,000</li>
    <li>✅ Valida presupuesto ≥ $1,000</li>
    <li>✅ Retoma cálculo pausado</li>
    <li>✅ Presenta pricing final</li>
  </ul>
  <p><strong>Experiencia:</strong> Usuario no nota la pausa, conversación fluye naturalmente.</p>
</div>`
        },
        2: {
            architect: `<div class="step-section">
  <h3>🔍 ICP Validation</h3>
  <div class="modal-diagram"><div class="mermaid">
sequenceDiagram
  participant ICP as ICPActions
  participant V as Validator
  participant SS as SalesState

  ICP->>ICP: extract_currency("$15,000")
  ICP->>V: validate(value=15000, gte=1000)
  V-->>ICP: valid=true
  ICP->>SS: sync_to(bant_state.budget)
  SS-->>SS: budget = 15000
</div></div>
  <p><strong>Provenance Tracking:</strong> Registra fuente y validación del dato capturado.</p>
</div>`,
            pm: `<div class="step-section">
  <h3>🔍 Validación Automática</h3>
  <h4>Proceso</h4>
  <ol>
    <li>Extrae monto: $15,000</li>
    <li>Normaliza formato</li>
    <li>Valida ≥ $1,000</li>
    <li>Sincroniza a BANT state</li>
  </ol>
  <p><strong>Calidad de Datos:</strong> Validación automática asegura datos correctos en CRM.</p>
</div>`
        },
        3: {
            architect: `<div class="step-section">
  <h3>✅ Checkpoint Completado</h3>
  <div class="modal-diagram"><div class="mermaid">
graph TB
  SS[SalesState] --> CS[checkpoint_stack: empty]
  SS --> BS[bant_state<br/>budget: 15000]
  SS --> SO[solution_offer<br/>discount_rate: 0.15]

  style BS fill:#48bb78,color:#fff
  style SO fill:#48bb78,color:#fff
</div></div>
  <p>Stack vacío, todos los datos capturados, cálculo completado exitosamente.</p>
</div>`,
            pm: `<div class="step-section">
  <h3>✅ Datos Completos</h3>
  <h4>Estado Final</h4>
  <ul>
    <li>✅ Company size: 30</li>
    <li>✅ Budget: $15,000</li>
    <li>✅ Discount rate: 15%</li>
  </ul>
  <p><strong>Listo para:</strong> Presentar precio final con descuento personalizado.</p>
</div>`
        }
    },
    6: {
        1: {
            architect: `<div class="step-section">
  <h3>🧮 Calculations Registry</h3>
  <div class="modal-diagram"><div class="mermaid">
sequenceDiagram
  participant GE as GuidelineEngine
  participant CR as CalculationsRegistry
  participant CE as CalculationExecutor

  GE->>CR: load("pricing.volume_discount")
  CR-->>GE: formula + inputs
  GE->>CE: execute(formula, inputs)
  CE->>CE: base_price = 400 * 30
  CE->>CE: discount = 12000 * 0.15
  CE-->>GE: final_price = 10200
</div></div>
  <p>Registry centraliza fórmulas reutilizables con validación.</p>
</div>`,
            pm: `<div class="step-section">
  <h3>🧮 Precio Personalizado</h3>
  <div class="modal-message-box assistant">
    <strong>Asistente:</strong> "El plan para 30 usuarios es $12,000. Con tu volumen tienes 15% descuento: <strong>$10,200/mes</strong>"
  </div>
  <h4>Cálculo</h4>
  <ul>
    <li>Base: 30 × $400 = $12,000</li>
    <li>Descuento 15%: -$1,800</li>
    <li><strong>Final: $10,200</strong></li>
  </ul>
  <p><strong>Valor:</strong> Pricing transparente y personalizado aumenta confianza.</p>
</div>`
        },
        2: {
            architect: `<div class="step-section">
  <h3>📊 Inline + Registry Mix</h3>
  <div class="modal-diagram"><div class="mermaid">
graph TB
  G[Guideline] --> I[Inline Formula<br/>company_size >= 20 ? 0.15 : 0.10]
  G --> R[Registry Call<br/>pricing.volume_discount]
  
  I --> O[Output: discount_rate]
  R --> O2[Output: final_price]

  style I fill:#fbb6ce,color:#000
  style R fill:#c3dafe,color:#000
</div></div>
  <p>Combina fórmulas inline simples con registry para cálculos complejos.</p>
</div>`,
            pm: `<div class="step-section">
  <h3>📊 Transparencia en Pricing</h3>
  <h4>Componentes</h4>
  <ol>
    <li><strong>Base:</strong> $400/usuario/mes</li>
    <li><strong>Descuento:</strong> 15% por volumen</li>
    <li><strong>Total:</strong> $10,200/mes</li>
  </ol>
  <p><strong>Estrategia:</strong> Mostrar desglose aumenta percepción de valor y justifica precio.</p>
</div>`
        },
        3: {
            architect: `<div class="step-section">
  <h3>✅ State Actualizado</h3>
  <div class="modal-diagram"><div class="mermaid">
graph TB
  SS[SalesState] --> SO[solution_offer]
  SO --> P[base_price: 12000]
  SO --> D[discount_rate: 0.15]
  SO --> F[final_price: 10200]
  SO --> B[within_budget: true]

  style SO fill:#48bb78,color:#fff
</div></div>
  <p>Pricing calculado, dentro de presupuesto, listo para presentar beneficios.</p>
</div>`,
            pm: `<div class="step-section">
  <h3>✅ Propuesta Lista</h3>
  <h4>Resumen Ejecutivo</h4>
  <ul>
    <li>Precio: $10,200/mes</li>
    <li>Dentro de presupuesto ($15k)</li>
    <li>Descuento aplicado: 15%</li>
    <li>Ahorro: $1,800/mes</li>
  </ul>
  <p><strong>Siguiente:</strong> Mostrar beneficios y ROI para cerrar venta.</p>
</div>`
        }
    },
    7: {
        1: {
            architect: `<div class="step-section">
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
</div>`,
            pm: `<div class="step-section">
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
</div>`
        },
        2: {
            architect: `<div class="step-section">
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
</div>`,
            pm: `<div class="step-section">
  <h3>🔍 Validación de Secuencia</h3>
  <h4>Sistema Verifica</h4>
  <ul>
    <li>✅ ¿Mostró beneficios? No</li>
    <li>✅ ¿Demostró ROI? No</li>
    <li>❌ Bloquea: Solicitud de compromiso</li>
  </ul>
  <p><strong>Resultado:</strong> Presenta beneficios primero, siguiendo best practices.</p>
</div>`
        },
        3: {
            architect: `<div class="step-section">
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
</div>`,
            pm: `<div class="step-section">
  <h3>✅ Respuesta Adecuada</h3>
  <div class="modal-message-box assistant">
    <strong>Asistente:</strong> "Nuestro software te ayuda a: automatizar facturación, control de inventario, reportes en tiempo real..."
  </div>
  <p><strong>Orden Correcto:</strong> Primero valor, luego compromiso. Aumenta probabilidad de cierre.</p>
</div>`
        }
    },
    8: {
        1: {
            architect: `<div class="step-section">
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
</div>`,
            pm: `<div class="step-section">
  <h3>🎯 Personalización por Marca</h3>
  <div class="modal-message-box assistant">
    <strong>Asistente:</strong> "Nuestro software incluye módulos específicos: facturación electrónica, control PEPS, reportes SUNAT..."
  </div>
  <h4>Ventaja</h4>
  <ul>
    <li>✅ Marca 1: Enfoque PYME</li>
    <li>✅ Marca 2: Enterprise</li>
  </ul>
</div>`
        },
        2: {
            architect: `<div class="step-section">
  <h3>🔧 Config Merge</h3>
  <div class="modal-diagram"><div class="mermaid">
graph TB
  B[Base Guideline] --> M[Merge]
  O[Brand Override] --> M
  M --> F[Final Guideline]

  style F fill:#48bb78,color:#fff
</div></div>
  <p>Merge estratégico prioriza overrides específicos sobre base.</p>
</div>`,
            pm: `<div class="step-section">
  <h3>🔧 Configuración Flexible</h3>
  <h4>Niveles</h4>
  <ol>
    <li>Base: Guidelines genéricos</li>
    <li>Override: Personalización marca</li>
    <li>Final: Merge optimizado</li>
  </ol>
  <p>Escalable para múltiples marcas sin duplicación.</p>
</div>`
        },
        3: {
            architect: `<div class="step-section">
  <h3>✅ Override Aplicado</h3>
  <p>Guideline personalizado con features específicas de marca.</p>
</div>`,
            pm: `<div class="step-section">
  <h3>✅ Mensaje Relevante</h3>
  <p>Usuario recibe información específica a su industria y necesidades.</p>
</div>`
        }
    },
    9: {
        1: {
            architect: `<div class="step-section">
  <h3>🎯 Matching Semántico</h3>
  <div class="modal-message-box user">
    <strong>Usuario:</strong> "Hmm, me parece un poco caro..."
  </div>
  <div class="modal-diagram"><div class="mermaid">
sequenceDiagram
  participant GE as GuidelineEngine
  participant EM as EmbeddingService
  participant DB as VectorDB

  GE->>EM: encode("me parece caro")
  EM-->>GE: embedding_vector
  GE->>DB: similarity_search(vector)
  DB-->>GE: top_k similar guidelines
  GE->>GE: filter by threshold > 0.85
  GE-->>GE: select best match
</div></div>
  <p>Embeddings capturan intención semántica más allá de keywords exactas.</p>
</div>`,
            pm: `<div class="step-section">
  <h3>🎯 Objeción de Precio</h3>
  <div class="modal-message-box user">
    <strong>Usuario:</strong> "Hmm, me parece un poco caro..."
  </div>
  <h4>Detección Inteligente</h4>
  <p>Sistema identifica objeción de precio aunque no use palabra "caro" exacta.</p>
  <h4>Variantes Detectadas</h4>
  <ul>
    <li>"Es muy costoso"</li>
    <li>"No sé si puedo pagarlo"</li>
    <li>"Está fuera de mi presupuesto"</li>
    <li>"Me parece caro"</li>
  </ul>
  <p><strong>Ventaja:</strong> Responde apropiadamente a objeciones comunes sin programar cada variante.</p>
</div>`
        },
        2: {
            architect: `<div class="step-section">
  <h3>📊 Cosine Similarity</h3>
  <div class="modal-diagram"><div class="mermaid">
graph TB
  I[Input: "me parece caro"] --> E[Embedding Model]
  E --> V[Vector 768d]
  V --> C[Cosine Similarity]
  
  DB[Guidelines DB] --> G1[GL_OBJ_PRICE: 0.92]
  DB --> G2[GL_OBJ_QUALITY: 0.78]
  DB --> G3[GL_OBJ_TIMING: 0.65]
  
  G1 --> C
  G2 --> C
  G3 --> C
  
  C --> S[Select: GL_OBJ_PRICE]

  style S fill:#48bb78,color:#fff
</div></div>
  <p>Similarity score > 0.85 indica alta confianza en match semántico.</p>
</div>`,
            pm: `<div class="step-section">
  <h3>📊 Clasificación Automática</h3>
  <h4>Proceso</h4>
  <ol>
    <li>Analiza mensaje del usuario</li>
    <li>Compara con objeciones conocidas</li>
    <li>Identifica: Objeción de Precio (92% confianza)</li>
    <li>Selecciona respuesta apropiada</li>
  </ol>
  <p><strong>Resultado:</strong> Sistema responderá con ROI y justificación de valor.</p>
</div>`
        },
        3: {
            architect: `<div class="step-section">
  <h3>✅ Guideline de Objeción</h3>
  <div class="modal-diagram"><div class="mermaid">
graph TB
  G[GL_OBJ_PRICE_VALUE] --> A[Action: show_roi]
  G --> C[Calculation: savings]
  G --> R[Response Template]

  style G fill:#48bb78,color:#fff
</div></div>
  <p>Guideline especializado en manejar objeciones de precio con datos cuantitativos.</p>
</div>`,
            pm: `<div class="step-section">
  <h3>✅ Respuesta con Valor</h3>
  <div class="modal-message-box assistant">
    <strong>Asistente:</strong> "Entiendo tu preocupación. Déjame mostrarte el retorno: te ahorrarás $2,500/mes en tiempo..."
  </div>
  <h4>Estrategia</h4>
  <ul>
    <li>✅ Valida la preocupación</li>
    <li>✅ Presenta datos cuantitativos</li>
    <li>✅ Muestra ROI concreto</li>
  </ul>
  <p><strong>Conversión:</strong> Responder con valor aumenta 40% probabilidad de cierre.</p>
</div>`
        }
    },
    10: {
        1: {
            architect: `<div class="step-section">
  <h3>💰 Financial Calculator</h3>
  <div class="modal-diagram"><div class="mermaid">
sequenceDiagram
  participant GE as GuidelineEngine
  participant FC as FinancialCalculator
  participant CR as CalculationsRegistry

  GE->>CR: load("financial.calculate_roi")
  CR-->>GE: formula definition
  GE->>FC: execute(investment, savings, period)
  FC->>FC: roi = (savings*12 - investment) / investment
  FC-->>GE: roi_percentage = 82%
</div></div>
  <p>Registry de cálculos financieros con fórmulas validadas y testeadas.</p>
</div>`,
            pm: `<div class="step-section">
  <h3>💰 Demostración de Valor</h3>
  <div class="modal-message-box assistant">
    <strong>Asistente:</strong> "Te ahorrarás $2,500/mes en tiempo. Tu ROI es <strong>82% en el primer año</strong>"
  </div>
  <h4>Cálculo</h4>
  <ul>
    <li>Inversión: $10,200/mes</li>
    <li>Ahorro: $2,500/mes</li>
    <li>ROI anual: 82%</li>
    <li>Payback: 4.1 meses</li>
  </ul>
  <p><strong>Impacto:</strong> Datos cuantitativos concretos justifican inversión.</p>
</div>`
        },
        2: {
            architect: `<div class="step-section">
  <h3>📐 Fórmula Compleja</h3>
  <div class="modal-diagram"><div class="mermaid">
graph TB
  I[Inputs] --> C[Calculator]
  I --> I1[investment: 10200]
  I --> I2[monthly_savings: 2500]
  I --> I3[period_months: 12]
  
  C --> F[Formula:<br/>roi = savings*period - investment / investment * 100]
  F --> O[Output: 82%]

  style O fill:#48bb78,color:#fff
</div></div>
  <p>Cálculos complejos centralizados en registry para reutilización y testing.</p>
</div>`,
            pm: `<div class="step-section">
  <h3>📐 Números que Convencen</h3>
  <h4>Desglose Financiero</h4>
  <ol>
    <li><strong>Inversión:</strong> $122,400/año</li>
    <li><strong>Ahorro:</strong> $30,000/año</li>
    <li><strong>Retorno:</strong> 82% anual</li>
    <li><strong>Recuperación:</strong> 4 meses</li>
  </ol>
  <p><strong>Estrategia:</strong> Presentar ROI transforma objeción de precio en oportunidad de inversión.</p>
</div>`
        },
        3: {
            architect: `<div class="step-section">
  <h3>✅ Métricas Capturadas</h3>
  <div class="modal-diagram"><div class="mermaid">
graph TB
  SS[SalesState] --> SO[solution_offer]
  SO --> R[roi_percentage: 82]
  SO --> S[monthly_savings: 2500]
  SO --> P[payback_months: 4.1]

  style SO fill:#48bb78,color:#fff
</div></div>
  <p>Métricas financieras guardadas para reporting y seguimiento.</p>
</div>`,
            pm: `<div class="step-section">
  <h3>✅ Valor Cuantificado</h3>
  <h4>Resumen</h4>
  <ul>
    <li>✅ ROI calculado: 82%</li>
    <li>✅ Ahorro mensual: $2,500</li>
    <li>✅ Payback: 4.1 meses</li>
  </ul>
  <p><strong>Siguiente:</strong> Usuario tiene datos concretos para tomar decisión informada.</p>
</div>`
        }
    },
    11: {
        1: {
            architect: `<div class="step-section">
  <h3>🔍 State Retrieval</h3>
  <div class="modal-message-box user">
    <strong>Usuario:</strong> "¿Esto entra en mi presupuesto que mencioné?"
  </div>
  <div class="modal-diagram"><div class="mermaid">
sequenceDiagram
  participant GE as GuidelineEngine
  participant SL as StateLookup
  participant SS as SalesState

  GE->>SL: lookup("bant_state.budget")
  SL->>SS: get_path("bant_state.budget")
  SS-->>SL: value = 15000
  SL-->>GE: retrieved_value
  GE->>GE: compare with final_price
</div></div>
  <p>State lookup recupera datos capturados previamente sin re-preguntar.</p>
</div>`,
            pm: `<div class="step-section">
  <h3>🔍 Memoria Conversacional</h3>
  <div class="modal-message-box user">
    <strong>Usuario:</strong> "¿Esto entra en mi presupuesto que mencioné?"
  </div>
  <h4>Sistema Recuerda</h4>
  <ul>
    <li>✅ Presupuesto mencionado: $15,000</li>
    <li>✅ Precio propuesto: $10,200</li>
    <li>✅ Margen disponible: $4,800</li>
  </ul>
  <p><strong>Experiencia:</strong> Usuario no necesita repetir información, conversación fluye naturalmente.</p>
</div>`
        },
        2: {
            architect: `<div class="step-section">
  <h3>📊 JSONPath Resolution</h3>
  <div class="modal-diagram"><div class="mermaid">
graph TB
  P["Path: bant_state.budget"] --> R[Resolver]
  R --> SS[SalesState]
  SS --> BS[bant_state]
  BS --> V["budget: 15000"]
  
  V --> C[Compare]
  FP["final_price: 10200"] --> C
  C --> O["within_budget: true"]

  style O fill:#48bb78,color:#fff
</div></div>
  <p>JSONPath permite acceso estructurado a cualquier campo del estado.</p>
</div>`,
            pm: `<div class="step-section">
  <h3>📊 Análisis Automático</h3>
  <h4>Comparación</h4>
  <ol>
    <li>Recupera presupuesto: $15,000</li>
    <li>Compara con precio: $10,200</li>
    <li>Calcula margen: $4,800 (32%)</li>
    <li>Resultado: ✅ Dentro de presupuesto</li>
  </ol>
  <p><strong>Valor:</strong> Respuesta inmediata basada en datos del usuario.</p>
</div>`
        },
        3: {
            architect: `<div class="step-section">
  <h3>✅ Respuesta Contextual</h3>
  <div class="modal-diagram"><div class="mermaid">
graph TB
  G[Guideline] --> A[Adapter: state_lookup]
  A --> D[Data Retrieved]
  D --> R[Response Template]
  R --> M[Message Generated]

  style M fill:#48bb78,color:#fff
</div></div>
  <p>Guideline usa datos históricos para generar respuesta personalizada.</p>
</div>`,
            pm: `<div class="step-section">
  <h3>✅ Confirmación Personalizada</h3>
  <div class="modal-message-box assistant">
    <strong>Asistente:</strong> "Sí, con tu presupuesto de $15k/mes es viable. El precio de $10,200 te deja $4,800 de margen."
  </div>
  <h4>Impacto</h4>
  <ul>
    <li>✅ Refuerza viabilidad</li>
    <li>✅ Muestra margen disponible</li>
    <li>✅ Reduce fricción</li>
  </ul>
  <p><strong>Conversión:</strong> Confirmación con datos aumenta confianza para cerrar.</p>
</div>`
        }
    },
    12: {
        1: {
            architect: `<div class="step-section">
  <h3>🔁 Loop Detection</h3>
  <div class="modal-diagram"><div class="mermaid">
sequenceDiagram
  participant GE as GuidelineEngine
  participant LD as LoopDetector
  participant H as History

  GE->>LD: check_loop(guideline_id)
  LD->>H: get recent executions
  H-->>LD: [GL_X, GL_Y, GL_X, GL_Y]
  LD->>LD: detect pattern
  LD-->>GE: loop_detected = true
  GE->>GE: apply fallback strategy
</div></div>
  <p>Detecta patrones repetitivos y previene bucles infinitos.</p>
</div>`,
            pm: `<div class="step-section">
  <h3>🔁 Prevención de Frustración</h3>
  <h4>Situación</h4>
  <p>Usuario hace preguntas similares repetidamente, sistema detecta patrón.</p>
  <h4>Protección</h4>
  <ul>
    <li>✅ Detecta repetición</li>
    <li>✅ Cambia estrategia</li>
    <li>✅ Ofrece alternativa</li>
  </ul>
  <p><strong>Experiencia:</strong> Evita conversaciones circulares que frustran al usuario.</p>
</div>`
        },
        2: {
            architect: `<div class="step-section">
  <h3>⚙️ Fallback Strategy</h3>
  <div class="modal-diagram"><div class="mermaid">
graph TB
  L[Loop Detected] --> C{Depth Check}
  C -->|depth < 3| W[Warning Log]
  C -->|depth >= 3| F[Fallback]
  
  F --> E[Escalate to Human]
  F --> A[Alternative Guideline]
  F --> S[Summary + Next Steps]

  style F fill:#ed8936,color:#fff
  style E fill:#fc8181,color:#fff
</div></div>
  <p>Estrategias de fallback según profundidad del loop.</p>
</div>`,
            pm: `<div class="step-section">
  <h3>⚙️ Cambio de Estrategia</h3>
  <h4>Opciones del Sistema</h4>
  <ol>
    <li><strong>Reformular:</strong> Explica de otra manera</li>
    <li><strong>Resumir:</strong> Recapitula puntos clave</li>
    <li><strong>Escalar:</strong> Ofrece hablar con humano</li>
  </ol>
  <p><strong>Inteligencia:</strong> Sistema adapta enfoque cuando detecta que estrategia actual no funciona.</p>
</div>`
        },
        3: {
            architect: `<div class="step-section">
  <h3>✅ Protección Activa</h3>
  <div class="modal-diagram"><div class="mermaid">
graph TB
  SS[SalesState] --> H[conversation_history]
  H --> P[Pattern Analysis]
  P --> L{Loop?}
  L -->|No| N[Normal Flow]
  L -->|Yes| F[Fallback Activated]

  style F fill:#48bb78,color:#fff
</div></div>
  <p>Protección automática sin intervención manual.</p>
</div>`,
            pm: `<div class="step-section">
  <h3>✅ Conversación Productiva</h3>
  <div class="modal-message-box assistant">
    <strong>Asistente:</strong> "Déjame resumir lo que hemos cubierto y ofrecerte una demo para que veas el sistema en acción. ¿Te parece?"
  </div>
  <h4>Resultado</h4>
  <ul>
    <li>✅ Rompe el ciclo</li>
    <li>✅ Propone acción concreta</li>
    <li>✅ Mantiene momentum</li>
  </ul>
  <p><strong>Conversión:</strong> Cambio de estrategia recupera oportunidad de cierre.</p>
</div>`
        }
    },
    13: {
        1: {
            architect: `<div class="step-section">
  <h3>✅ Commitment Seeking</h3>
  <div class="modal-message-box user">
    <strong>Usuario:</strong> "Sí, me gustaría agendar una demo"
  </div>
  <div class="modal-diagram"><div class="mermaid">
sequenceDiagram
  participant U as Usuario
  participant SA as SalesAgent
  participant CS as CommitmentService
  participant CRM as CRM

  U->>SA: "Agendar demo"
  SA->>CS: detect_commitment
  CS-->>SA: commitment_type = demo_request
  SA->>CRM: create_opportunity
  CRM-->>SA: opportunity_id
  SA->>SA: schedule_next_action
</div></div>
  <p>Captura compromiso y activa flujo de seguimiento.</p>
</div>`,
            pm: `<div class="step-section">
  <h3>✅ Cierre Exitoso</h3>
  <div class="modal-message-box user">
    <strong>Usuario:</strong> "Sí, me gustaría agendar una demo"
  </div>
  <h4>Hito Alcanzado</h4>
  <ul>
    <li>✅ Usuario comprometido</li>
    <li>✅ Siguiente paso definido</li>
    <li>✅ Oportunidad creada</li>
  </ul>
  <p><strong>Conversión:</strong> De prospecto frío a oportunidad calificada con demo agendada.</p>
</div>`
        },
        2: {
            architect: `<div class="step-section">
  <h3>📊 Success Metrics</h3>
  <div class="modal-diagram"><div class="mermaid">
graph TB
  SS[SalesState] --> M[Metrics]
  M --> T[total_turns: 13]
  M --> C[commitment_secured: true]
  M --> D[demo_scheduled: true]
  M --> S[success_score: 0.95]

  style M fill:#48bb78,color:#fff
</div></div>
  <p>Métricas capturadas para análisis y optimización.</p>
</div>`,
            pm: `<div class="step-section">
  <h3>📊 Métricas de Éxito</h3>
  <h4>Conversación Completa</h4>
  <div class="modal-metrics">
    <div class="modal-metric">
      <div class="modal-metric-value">13</div>
      <div class="modal-metric-label">Turnos</div>
    </div>
    <div class="modal-metric">
      <div class="modal-metric-value">95%</div>
      <div class="modal-metric-label">Score</div>
    </div>
    <div class="modal-metric">
      <div class="modal-metric-value">✅</div>
      <div class="modal-metric-label">Demo</div>
    </div>
  </div>
  <p><strong>Resultado:</strong> Conversación exitosa con compromiso concreto.</p>
</div>`
        },
        3: {
            architect: `<div class="step-section">
  <h3>🎯 Next Actions</h3>
  <div class="modal-diagram"><div class="mermaid">
graph TB
  C[Commitment] --> A[Actions Queue]
  A --> A1[Send calendar invite]
  A --> A2[Prepare demo materials]
  A --> A3[Notify sales team]
  A --> A4[Create CRM opportunity]

  style A fill:#48bb78,color:#fff
</div></div>
  <p>Sistema automatiza acciones de seguimiento post-compromiso.</p>
</div>`,
            pm: `<div class="step-section">
  <h3>🎯 Siguientes Pasos</h3>
  <div class="modal-message-box assistant">
    <strong>Asistente:</strong> "¡Perfecto! Te enviaré un calendario para agendar la demo. Prepararé una presentación personalizada con tu caso de 30 empleados."
  </div>
  <h4>Acciones Automáticas</h4>
  <ul>
    <li>✅ Enviar invitación calendario</li>
    <li>✅ Preparar materiales demo</li>
    <li>✅ Notificar equipo ventas</li>
    <li>✅ Crear oportunidad CRM</li>
  </ul>
  <p><strong>Eficiencia:</strong> Sistema automatiza seguimiento, aumentando conversión y reduciendo tiempo de respuesta.</p>
</div>`
        }
    }
};