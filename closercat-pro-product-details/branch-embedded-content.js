// ==================== BRANCH OVERLAYS ====================
// Branch-specific modal content to override base when a branch is active

window.BRANCH_EMBEDDED_CONTENT = window.BRANCH_EMBEDDED_CONTENT || {};

window.BRANCH_EMBEDDED_CONTENT['compliance'] = {
  10: {
    1: {
      architect: `<div class="step-section">
  <h3>🔐 Compliance Policy Routing</h3>
  <div class="modal-diagram"><div class="mermaid">
sequenceDiagram
  participant GE as GuidelineEngine
  participant PR as PolicyRouter
  participant SS as SalesState

  GE->>PR: route_compliance_options(SS)
  PR-->>GE: [legal_review, SIG/CAIQ]
  GE-->>User: "¿Prefieren revisión legal directa o iniciar con SIG/CAIQ?"
  note over GE,SS: requires_actions verificados antes de preguntar
  </div></div>
  <p>El motor evalúa <strong>requires_actions</strong> y expone opciones válidas de cumplimiento.</p>
</div>`,
      pm: `<div class="step-section">
  <h3>🔐 Selección de Vía de Cumplimiento</h3>
  <p>Ofrecemos dos rutas: <strong>Revisión Legal</strong> o <strong>Cuestionario SIG/CAIQ</strong>. Elegimos según tu proceso.</p>
  <ul>
    <li>✅ Transparencia de opciones</li>
    <li>✅ Alineado a políticas de tu empresa</li>
    <li>✅ Evita pasos innecesarios</li>
  </ul>
</div>`
    },
    2: {
      architect: `<div class="step-section">
  <h3>⚙️ Requires Actions</h3>
  <div class="modal-diagram"><div class="mermaid">
graph TB
  GE[GuidelineEngine] --> RA[requires_actions]
  RA --> D[Docs ready? whitepaper, DPA]
  D --> Q[Questionnaire templates: SIG/CAIQ]
  class RA,D,Q internal;
  classDef internal fill:#c3dafe,color:#1a202c,stroke:#667eea;
  </div></div>
  <p>Validamos que recursos y plantillas estén disponibles antes de presentar opciones.</p>
</div>`,
      pm: `<div class="step-section">
  <h3>📄 ¿Qué enviaremos?</h3>
  <ul>
    <li>Whitepaper de seguridad + DPA</li>
    <li>Plantillas de cuestionario: SIG/CAIQ</li>
  </ul>
  <p>Listo para compartir inmediatamente tras tu elección.</p>
</div>`
    },
    3: {
      architect: `<div class="step-section">
  <h3>🧭 Esperando tu Selección</h3>
  <p>El sistema quedará a la espera de tu elección para persistirla y continuar el flujo.</p>
</div>`,
      pm: `<div class="step-section">
  <h3>🧭 Próximo Paso</h3>
  <p>Indica si prefieres <strong>Revisión Legal</strong> o <strong>SIG/CAIQ</strong> para avanzar.</p>
</div>`
    }
  },
  11: {
    1: {
      architect: `<div class="step-section">
  <h3>📝 Persistencia de Elección (SIG)</h3>
  <div class="modal-diagram"><div class="mermaid">
graph TB
  U[User: Empecemos con SIG] --> SA[SalesAgent]
  SA --> SS[SalesState.compliance.choice = "SIG"]
  SS --> DS[DocumentService.prepare(SIG package)]
  style SS fill:#667eea,color:#fff
  style DS fill:#48bb78,color:#fff
  </div></div>
  <p>Se guarda la preferencia y se prepara el paquete de documentos.</p>
</div>`,
      pm: `<div class="step-section">
  <h3>📝 Confirmación de Ruta</h3>
  <p>Elegiste <strong>SIG</strong>. Prepararemos el cuestionario y documentación asociada para enviártela.</p>
</div>`
    },
    2: {
      architect: `<div class="step-section">
  <h3>📦 Preparación de Paquete</h3>
  <p>Se generan enlaces temporales y metadatos (tracking) para el envío.</p>
</div>`,
      pm: `<div class="step-section">
  <h3>📦 Paquete Listo</h3>
  <p>Cuestionario SIG + Whitepaper + DPA listos para envío.</p>
</div>`
    },
    3: {
      architect: `<div class="step-section">
  <h3>⏳ Estado</h3>
  <p>Esperando confirmación de envío en el siguiente turno.</p>
</div>`,
      pm: `<div class="step-section">
  <h3>⏳ Siguiente</h3>
  <p>Enviaremos de inmediato y te confirmaremos.</p>
</div>`
    }
  },
  12: {
    1: {
      architect: `<div class="step-section">
  <h3>📧 Envío + ROI + Escalamiento</h3>
  <div class="modal-diagram"><div class="mermaid">
sequenceDiagram
  participant DS as DocumentService
  participant ES as EmailService
  participant FC as FinancialCalc
  participant RS as RelationsService

  DS->>ES: send(SIG/CAIQ + whitepaper + DPA)
  FC->>FC: calc_roi() = 82%
  RS->>RS: ESCALATES_TO(security_review + demo_tech)
  note over DS,ES: Confirmación de envío registrada
  </div></div>
  <p>Confirmamos el envío, reportamos ROI y proponemos la revisión + demo técnica.</p>
</div>`,
      pm: `<div class="step-section">
  <h3>📧 Envío Confirmado</h3>
  <div class="modal-message-box assistant">
    <strong>Asistente:</strong> "Compartimos los enlaces al SIG/CAIQ y al whitepaper + DPA por este canal. Si prefieres por email, indícanos cuál. Tu ROI estimado sigue en <strong>82%</strong>. ¿Agendamos revisión de seguridad y demo técnica?"
  </div>
  <ul>
    <li>✅ Documentos enviados</li>
    <li>✅ ROI consistente</li>
    <li>✅ Propuesta de siguientes pasos</li>
  </ul>
</div>`
    },
    2: {
      architect: `<div class="step-section">
  <h3>🔗 Trazabilidad</h3>
  <p>Se registran <code>action_results</code> con tiempos, estatus y enlaces de entrega.</p>
</div>`,
      pm: `<div class="step-section">
  <h3>🔗 Seguimiento</h3>
  <p>Podemos monitorear aperturas y completar el cuestionario.</p>
</div>`
    },
    3: {
      architect: `<div class="step-section">
  <h3>🗓️ Schedules</h3>
  <p>Creación de slots sugeridos para revisión y demo (integrable con agenda).</p>
</div>`,
      pm: `<div class="step-section">
  <h3>🗓️ Agendamiento</h3>
  <p>Propondremos horarios para revisión y demo técnica.</p>
</div>`
    }
  },
  13: {
    1: {
      architect: `<div class="step-section">
  <h3>✅ Confirmación de Revisión + Demo</h3>
  <p>El usuario acepta. Se crean tareas de coordinación (security + demo).</p>
</div>`,
      pm: `<div class="step-section">
  <h3>✅ Aceptado</h3>
  <p>Coordinaremos revisión y demo con tu equipo técnico.</p>
</div>`
    },
    2: {
      architect: `<div class="step-section">
  <h3>✉️ Email Capturado y Envío</h3>
  <div class="modal-diagram"><div class="mermaid">
sequenceDiagram
  participant SS as SalesState
  participant DS as DocumentService
  participant ES as EmailService

  SS->>SS: contact.email = "juan@empresa.com"
  DS->>ES: send(email=SS.contact.email, attachments=[SIG, DPA, whitepaper])
  ES-->>DS: status=sent
  note over DS,ES: action_results.send_email.status = sent
  </div></div>
  <p>Se persiste el email en el estado y se registra la confirmación de envío.</p>
</div>`,
      pm: `<div class="step-section">
  <h3>✉️ Confirmación de Envío</h3>
  <div class="modal-message-box assistant">
    <strong>Asistente:</strong> "Listo, enviamos la documentación a <strong>juan@empresa.com</strong>. También queda disponible por este canal."
  </div>
  <ul>
    <li>✅ Email capturado</li>
    <li>✅ Documentación enviada</li>
    <li>✅ Acceso por canal actual</li>
  </ul>
</div>`
    },
    3: {
      architect: `<div class="step-section">
  <h3>⚠️ Email Inválido (ICP Validation)</h3>
  <div class="modal-diagram"><div class="mermaid">
sequenceDiagram
  participant UI as UI
  participant VAL as EmailValidator
  participant SS as SalesState

  UI->>VAL: validate(email)
  VAL-->>UI: invalid
  UI-->>User: "Email no válido, ¿puedes confirmarlo?"
  note over UI,SS: No se persiste en SalesState hasta ser válido
  </div></div>
  <p>Se evita capturar emails inválidos y se solicita corrección.</p>
</div>`,
      pm: `<div class="step-section">
  <h3>⚠️ Validación de Email</h3>
  <p>Si el email no es válido, mostramos un aviso y pedimos confirmación antes del envío.</p>
</div>`
    }
  }
};

// ============ LOW BUDGET OVERLAYS ============
window.BRANCH_EMBEDDED_CONTENT['low_budget'] = {
  5: {
    1: {
      architect: `<div class="step-section">
  <h3>▶️ Resume Checkpoint (Budget)</h3>
  <div class="modal-message-box user">
    <strong>Usuario:</strong> "Solo tengo $3,000 mensuales disponibles"
  </div>
  <p>Se persiste <code>bant_state.budget = 3000</code> y se retoma el flujo con opciones dentro de presupuesto.</p>
</div>`,
      pm: `<div class="step-section">
  <h3>💵 Presupuesto Capturado</h3>
  <p>Usuario indica <strong>$3,000/mes</strong>. El sistema adaptará la propuesta al presupuesto.</p>
</div>`
    }
  },
  6: {
    1: {
      architect: `<div class="step-section">
  <h3>🧮 Selección de Plan Básico</h3>
  <p>Oferta ajustada: <strong>$2,800/mes</strong> para 20 usuarios, dentro del presupuesto de $3,000.</p>
</div>`,
      pm: `<div class="step-section">
  <h3>🧮 Plan dentro de Presupuesto</h3>
  <ul>
    <li>Plan básico: $2,800/mes (20 usuarios)</li>
    <li>Margen restante: $200/mes</li>
  </ul>
</div>`
    }
  },
  10: {
    1: {
      architect: `<div class="step-section">
  <h3>🎯 Estrategia Budget-Aware</h3>
  <p>Priorización de módulos críticos y escalamiento posterior. Evita cálculos de ROI extensos en esta rama.</p>
</div>`,
      pm: `<div class="step-section">
  <h3>🎯 Maximizar Valor con $3k</h3>
  <ul>
    <li>Empieza con módulos críticos</li>
    <li>Escala funciones cuando el valor esté validado</li>
  </ul>
</div>`
    }
  },
  11: {
    1: {
      architect: `<div class="step-section">
  <h3>🔍 State Lookup (Budget)</h3>
  <p>Comparación: <code>bant_state.budget = 3000</code> vs <code>plan_price = 2800</code> → <strong>within_budget = true</strong>.</p>
</div>`,
      pm: `<div class="step-section">
  <h3>🔍 Confirmación de Presupuesto</h3>
  <p>Precio propuesto $2,800 <strong>entra</strong> en tu presupuesto de $3,000.</p>
</div>`
    }
  },
  12: {
    1: {
      architect: `<div class="step-section">
  <h3>✅ Viabilidad + Próximo Paso</h3>
  <p>Se confirma viabilidad con $3k y se propone demo.</p>
</div>`,
      pm: `<div class="step-section">
  <h3>✅ Dentro de Presupuesto</h3>
  <div class="modal-message-box assistant">
    <strong>Asistente:</strong> "Sí, con tu presupuesto de $3k/mes es viable. ¿Te gustaría una demo?"
  </div>
</div>`
    }
  }
};
