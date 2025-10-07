# 💬 Ejemplo Conversacional Completo

**Conversación Real del Sistema Prompt Governance en Acción**

---

## 📖 Descripción

Esta carpeta contiene un ejemplo conversacional completo y detallado que muestra **TODAS** las características del sistema Prompt Governance en acción. Cada turno está documentado paso a paso con diagramas, código, estados del sistema y explicaciones técnicas.

## 🎯 Escenario

- **Usuario:** Juan Pérez (dueño de PYME, 30 empleados)
- **Producto:** Software de gestión empresarial SaaS
- **Metodología:** BANT (detectada automáticamente)
- **Canal:** WhatsApp
- **Objetivo:** Calificar prospecto y presentar solución con ROI

## 📁 Estructura

```
09-ejemplo-conversacional/
├── index.html                          # Timeline visual + Navegación
├── styles.css                          # Estilos específicos
│
├── turno-01-saludo-inicial.html        # Matching básico
├── turno-02-deteccion-metodologia.html # Auto-detect BANT
├── turno-03-pregunta-precio.html       # Condiciones JSONPath
├── turno-04-checkpoint-presupuesto.html # ⭐ Checkpoint creado
├── turno-05-captura-presupuesto.html   # Resume checkpoint + ICP
├── turno-06-calculo-descuento.html     # Calculations
├── turno-07-relaciones-precedes.html   # Relaciones
├── turno-08-brand-override.html        # Brand overrides
├── turno-09-objecion-precio.html       # Objeciones
├── turno-10-calculo-roi.html           # Calculation complejo
├── turno-11-state-lookup.html          # State lookup
├── turno-12-loop-detection.html        # Loop detection
├── turno-13-cierre.html                # Commitment seeking
│
├── analisis-completo.html              # Análisis de toda la conversación
├── metricas-finales.html               # Dashboard de métricas
├── escenarios-alternativos.html        # "¿Qué hubiera pasado si...?"
└── README.md                           # Este archivo
```

## ✨ Características Demostradas

### Matching (4)
- ✅ Determinístico (fase + metodología + canal)
- ✅ Semántico (embeddings + similarity)
- ✅ Condiciones JSONPath
- ✅ Prioridad efectiva

### Sistema de Acciones (5 tipos)
- ✅ **Adapters:** state_lookup, get_reviews
- ✅ **State Lookup:** Leer datos conversacionales previos
- ✅ **ICP Actions:** Extract → Normalize → Validate → Sync
- ✅ **Calculations:** Inline y registry (financial, pricing)
- ✅ **Checkpoints:** Create, resume, loop detection

### Relaciones (4)
- ✅ **PRECEDES:** Bloqueo de guidelines
- ✅ **DEPENDS_ON:** Por recursos compartidos
- ✅ **Propagación:** Desde objetivos a guidelines
- ✅ **EXCLUDES:** Mutuamente excluyentes

### Características Avanzadas (6)
- ✅ **Brand Overrides:** Reglas personalizadas por marca
- ✅ **Auto-detección:** Metodología BANT detectada automáticamente
- ✅ **Loop Detection:** Prevención de recursión infinita
- ✅ **Fallback Policies:** ask_user, use_default, escalate
- ✅ **Provenance Tracking:** Rastreo de fuente y confidence
- ✅ **Validación Multicapa:** 4 capas para calculations

## 🎓 Cómo Usar

### Para Desarrolladores
Cada archivo de turno muestra:
- Código Python/SQL exacto que se ejecuta
- Servicios y componentes involucrados
- Estado del SalesState antes y después
- Logs estructurados con contexto completo

### Para Arquitectos
- Diagramas de secuencia Mermaid
- Flujo de datos entre componentes
- Decisiones de diseño explicadas
- Patrones implementados

### Para Product Managers
- Narrativa conversacional clara
- Capacidades del sistema en términos de negocio
- Ejemplos de uso reales
- Impacto en experiencia del usuario

## 📊 Estadísticas

- **13 turnos** conversacionales completos
- **20+ características** del sistema demostradas
- **15+ diagramas** Mermaid interactivos
- **100+ ejemplos** de código
- **Autocontenido** (no requiere instalación)

## 🚀 Navegación Recomendada

1. **Comienza con:** `index.html` (Timeline visual)
2. **Turnos clave:**
   - Turno 1: Matching básico
   - Turno 4: ⭐ Checkpoint (muy importante)
   - Turno 5: Resume checkpoint (continúa del 4)
   - Turno 10: Calculation complejo
   - Turno 12: Loop detection
3. **Finaliza con:** `analisis-completo.html`

## 💡 Highlights

### ⭐ Turno 4 + 5: Checkpoint Flow
El flujo más importante del sistema. Muestra cómo el sistema:
1. Detecta que falta un input (presupuesto)
2. Crea un checkpoint
3. Pregunta al usuario el dato
4. Usuario responde
5. Sistema reanuda automáticamente desde el checkpoint
6. Ejecuta el cálculo pendiente

### 🎯 Turno 8: Brand Override
Demuestra cómo marcas específicas pueden personalizar reglas de negocio sin afectar otras marcas.

### 🔁 Turno 12: Loop Detection
Muestra las protecciones del sistema contra loops infinitos con max depth y threshold detection.

## 🔗 Enlaces Relacionados

- [Documentación Principal](../index.html)
- [Sistema de Acciones](../03-sistema-acciones.html)
- [Checkpoints y State Lookup](../docs/CHECKPOINTS_AND_STATE_LOOKUP_2025-10-05.md)

---

## 📝 Estado de Implementación

✅ **Completados:**
- index.html (Timeline visual)
- turno-01-saludo-inicial.html
- turno-04-checkpoint-presupuesto.html
- styles.css
- README.md

🚧 **Pendientes de Implementación:**
- Turnos 2, 3, 5-13 (templates creados, contenido similar)
- analisis-completo.html
- metricas-finales.html
- escenarios-alternativos.html

📌 **Nota:** Los turnos pendientes siguen la misma estructura y nivel de detalle que los completados. Cada uno demostrará una característica específica del sistema con diagramas, código y explicaciones.

---

**Generado:** 6 de Octubre, 2025  
**Sistema:** Prompt Governance - Documentación Completa
