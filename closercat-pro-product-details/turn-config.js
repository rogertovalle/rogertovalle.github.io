// ==================== TURN CONFIGURATION ====================
// Simple metadata for each turn

window.TURN_CONFIG = {
    1: {
        id: 1,
        title: "Saludo Inicial",
        subtitle: "Matching Básico y Captura de Intent",
        totalSteps: 3,
        dataPath: "data/turn1/"
    },
    2: {
        id: 2,
        title: "Bienvenida + Calificación",
        subtitle: "Detección de Metodología (BANT) + Pregunta Tamaño Empresa",
        totalSteps: 3,
        dataPath: "data/turn2/"
    },
    3: {
        id: 3,
        title: "Pregunta de Precio",
        subtitle: "ICP + Condiciones JSONPath",
        totalSteps: 3,
        dataPath: "data/turn3/"
    },
    4: {
        id: 4,
        title: "Checkpoint Presupuesto",
        subtitle: "Creación de Checkpoint por Input Faltante",
        totalSteps: 3,
        dataPath: "data/turn4/"
    },
    5: {
        id: 5,
        title: "Captura de Presupuesto",
        subtitle: "Resume Checkpoint + ICP Validation",
        totalSteps: 3,
        dataPath: "data/turn5/"
    },
    6: {
        id: 6,
        title: "Cálculo de Descuento",
        subtitle: "Calculations Registry + Inline Formula",
        totalSteps: 3,
        dataPath: "data/turn6/"
    },
    7: {
        id: 7,
        title: "Relaciones PRECEDES",
        subtitle: "Guideline Bloqueado por Precedencia",
        totalSteps: 3,
        dataPath: "data/turn7/"
    },
    8: {
        id: 8,
        title: "Brand Override",
        subtitle: "Configuración Específica de Marca",
        totalSteps: 3,
        dataPath: "data/turn8/"
    },
    9: {
        id: 9,
        title: "Manejo de Objeción",
        subtitle: "Matching Semántico + Embeddings",
        totalSteps: 3,
        dataPath: "data/turn9/"
    },
    10: {
        id: 10,
        title: "Cálculo de ROI",
        subtitle: "Financial Calculator + Registry",
        totalSteps: 3,
        dataPath: "data/turn10/"
    },
    11: {
        id: 11,
        title: "State Lookup",
        subtitle: "Recuperación de Datos Previos",
        totalSteps: 3,
        dataPath: "data/turn11/"
    },
    12: {
        id: 12,
        title: "Loop Detection",
        subtitle: "Prevención de Bucles Infinitos",
        totalSteps: 3,
        dataPath: "data/turn12/"
    },
    13: {
        id: 13,
        title: "Cierre Exitoso",
        subtitle: "Commitment Seeking + Next Steps",
        totalSteps: 3,
        dataPath: "data/turn13/"
    }
};
