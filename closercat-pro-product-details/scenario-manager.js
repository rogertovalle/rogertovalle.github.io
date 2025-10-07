// ==================== SCENARIO MANAGER ====================
// Maneja los diferentes escenarios de conversación y comparaciones

class ScenarioManager {
    constructor() {
        this.currentScenario = 'real';
        this.scenarios = {
            'real': {
                name: 'Conversación Real',
                icon: '✅',
                metrics: {
                    conversion: '100%',
                    time: '10.5min',
                    guidelines: '15',
                    checkpoints: '1'
                },
                messages: this.getRealMessages(),
                description: 'Conversación exitosa que lleva a demo agendada'
            },
            'low-budget': {
                name: 'Presupuesto Bajo',
                icon: '💰',
                metrics: {
                    conversion: '60%',
                    time: '15.2min',
                    guidelines: '22',
                    checkpoints: '3'
                },
                messages: this.getLowBudgetMessages(),
                description: 'Usuario con presupuesto insuficiente, requiere plan alternativo'
            },
            'enterprise': {
                name: 'Empresa Grande',
                icon: '🏢',
                metrics: {
                    conversion: '95%',
                    time: '8.7min',
                    guidelines: '12',
                    checkpoints: '0'
                },
                messages: this.getEnterpriseMessages(),
                description: 'Empresa de 500+ empleados, proceso acelerado'
            }
        };
        
        this.init();
    }
    
    init() {
        this.attachEventListeners();
        this.updateMetrics();
    }
    
    attachEventListeners() {
        // Tabs de escenarios
        document.querySelectorAll('.scenario-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const scenario = e.currentTarget.dataset.scenario;
                if (scenario === 'compare') {
                    this.showComparison();
                } else {
                    this.switchScenario(scenario);
                }
            });
        });
    }
    
    switchScenario(scenarioId) {
        if (scenarioId === this.currentScenario) return;
        
        const chatContainer = document.querySelector('.conversation-chat');
        const previousScenario = this.currentScenario;
        
        // Animación de salida
        chatContainer.classList.add('switching');
        
        setTimeout(() => {
            // Cambiar contenido
            this.currentScenario = scenarioId;
            this.updateTabs();
            this.updateMessages();
            this.updateMetrics();
            this.hideComparison();
            
            // Animación de entrada
            chatContainer.classList.remove('switching');
            chatContainer.classList.add('switched');
            
            setTimeout(() => {
                chatContainer.classList.remove('switched');
            }, 300);
            
            // Mostrar notificación de cambio
            this.showChangeNotification(previousScenario, scenarioId);
            
        }, 150);
    }
    
    updateTabs() {
        document.querySelectorAll('.scenario-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.scenario === this.currentScenario) {
                tab.classList.add('active');
            }
        });
    }
    
    updateMessages() {
        const chatContainer = document.querySelector('.conversation-chat');
        const scenario = this.scenarios[this.currentScenario];
        
        // Actualizar mensajes del chat
        const messages = chatContainer.querySelectorAll('.chat-message');
        messages.forEach((message, index) => {
            if (scenario.messages[index]) {
                const bubble = message.querySelector('.message-text');
                const meta = message.querySelector('.message-meta');
                
                if (bubble) bubble.textContent = scenario.messages[index].text;
                if (meta) meta.textContent = scenario.messages[index].meta;
            }
        });
    }
    
    updateMetrics() {
        const scenario = this.scenarios[this.currentScenario];
        const metrics = scenario.metrics;
        
        // Actualizar valores con animación
        this.animateMetricChange('conversion-rate', metrics.conversion);
        this.animateMetricChange('time-duration', metrics.time);
        this.animateMetricChange('guidelines-count', metrics.guidelines);
        this.animateMetricChange('checkpoints-count', metrics.checkpoints);
        
        // Actualizar tendencias
        this.updateTrends();
    }
    
    animateMetricChange(elementId, newValue) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const oldValue = element.textContent;
        
        // Animación de cambio
        element.style.transform = 'scale(1.1)';
        element.style.color = '#667eea';
        
        setTimeout(() => {
            element.textContent = newValue;
            element.style.transform = 'scale(1)';
            element.style.color = '#2d3748';
        }, 150);
    }
    
    updateTrends() {
        const realMetrics = this.scenarios.real.metrics;
        const currentMetrics = this.scenarios[this.currentScenario].metrics;
        
        this.updateTrend('conversion-trend', 
            parseFloat(realMetrics.conversion), 
            parseFloat(currentMetrics.conversion));
            
        this.updateTrend('time-trend', 
            parseFloat(realMetrics.time), 
            parseFloat(currentMetrics.time), true);
            
        this.updateTrend('guidelines-trend', 
            parseInt(realMetrics.guidelines), 
            parseInt(currentMetrics.guidelines));
            
        this.updateTrend('checkpoints-trend', 
            parseInt(realMetrics.checkpoints), 
            parseInt(currentMetrics.checkpoints), true);
    }
    
    updateTrend(elementId, realValue, currentValue, lowerIsBetter = false) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        element.classList.remove('up', 'down', 'stable');
        
        if (currentValue > realValue) {
            element.classList.add(lowerIsBetter ? 'down' : 'up');
            element.textContent = lowerIsBetter ? '↗' : '↗';
        } else if (currentValue < realValue) {
            element.classList.add(lowerIsBetter ? 'up' : 'down');
            element.textContent = lowerIsBetter ? '↘' : '↘';
        } else {
            element.classList.add('stable');
            element.textContent = '→';
        }
    }
    
    showComparison() {
        // Ocultar chat normal
        document.querySelector('.conversation-chat').style.display = 'none';
        
        // Mostrar vista de comparación
        let comparisonView = document.querySelector('.comparison-view');
        if (!comparisonView) {
            comparisonView = this.createComparisonView();
            document.querySelector('.conversation-chat').parentNode.appendChild(comparisonView);
        }
        
        comparisonView.classList.add('active');
        this.updateComparisonContent();
        
        // Actualizar tabs
        document.querySelectorAll('.scenario-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.scenario === 'compare') {
                tab.classList.add('active');
            }
        });
    }
    
    hideComparison() {
        const comparisonView = document.querySelector('.comparison-view');
        if (comparisonView) {
            comparisonView.classList.remove('active');
        }
        document.querySelector('.conversation-chat').style.display = 'block';
    }
    
    createComparisonView() {
        const div = document.createElement('div');
        div.className = 'comparison-view';
        div.innerHTML = `
            <div class="comparison-column left">
                <div class="comparison-header">Conversación Real</div>
                <div class="comparison-content" id="comparison-real"></div>
            </div>
            <div class="comparison-column right">
                <div class="comparison-header">Escenario Alternativo</div>
                <div class="comparison-content" id="comparison-alt"></div>
            </div>
        `;
        return div;
    }
    
    updateComparisonContent() {
        const realContent = document.getElementById('comparison-real');
        const altContent = document.getElementById('comparison-alt');
        
        if (realContent && altContent) {
            realContent.innerHTML = this.getComparisonHTML('real');
            altContent.innerHTML = this.getComparisonHTML(this.currentScenario);
        }
    }
    
    getComparisonHTML(scenarioId) {
        const scenario = this.scenarios[scenarioId];
        return `
            <div class="comparison-metrics">
                <div class="comp-metric">
                    <strong>Conversión:</strong> ${scenario.metrics.conversion}
                </div>
                <div class="comp-metric">
                    <strong>Tiempo:</strong> ${scenario.metrics.time}
                </div>
                <div class="comp-metric">
                    <strong>Guidelines:</strong> ${scenario.metrics.guidelines}
                </div>
                <div class="comp-metric">
                    <strong>Checkpoints:</strong> ${scenario.metrics.checkpoints}
                </div>
            </div>
            <div class="comparison-description">
                <p>${scenario.description}</p>
            </div>
            <div class="comparison-messages">
                <h4>Mensajes Clave:</h4>
                ${scenario.messages.slice(0, 3).map(msg => 
                    `<div class="comp-message">"${msg.text.substring(0, 60)}..."</div>`
                ).join('')}
            </div>
        `;
    }
    
    showChangeNotification(from, to) {
        const notification = document.createElement('div');
        notification.className = 'scenario-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <strong>Escenario cambiado:</strong> ${this.scenarios[from].name} → ${this.scenarios[to].name}
                <div class="notification-impact">
                    Conversión: ${this.scenarios[from].metrics.conversion} → ${this.scenarios[to].metrics.conversion}
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Datos de mensajes para cada escenario
    getRealMessages() {
        return [
            { text: "Hola, quisiera información sobre sus soluciones", meta: "Matching básico + Captura de intent" },
            { text: "¡Hola Juan! Encantado de ayudarte. ¿Cuántos empleados tiene tu empresa?", meta: "Detección metodología BANT" },
            { text: "Somos 30 empleados. ¿Cuánto cuesta?", meta: "ICP Actions + Condiciones JSONPath" },
            { text: "Para calcular el mejor precio, ¿cuál es tu presupuesto mensual aproximado?", meta: "Checkpoint creado (falta dato)" },
            { text: "Tengo unos $15,000 mensuales disponibles", meta: "Resume checkpoint + ICP validation" },
            { text: "Perfecto. El plan para 30 usuarios es $12,000. Con tu volumen tienes 15% descuento: $10,200", meta: "Calculations (inline + registry)" },
            { text: "¿Qué beneficios ofrece?", meta: "Relación PRECEDES" },
            { text: "Nuestro software te ayuda a: automatizar facturación, control de inventario, reportes en tiempo real...", meta: "Brand override" },
            { text: "Hmm, me parece un poco caro...", meta: "Matching semántico" },
            { text: "Te ahorrarás $2,500/mes en tiempo. Tu ROI es 82% en el primer año", meta: "Cálculo ROI" },
            { text: "¿Esto entra en mi presupuesto que mencioné?", meta: "State lookup" },
            { text: "Sí, con tu presupuesto de $15k/mes es viable. ¿Te gustaría una demo?", meta: "Loop detection" },
            { text: "Sí, me gustaría agendar una demo", meta: "Cierre exitoso ✅" }
        ];
    }
    
    getLowBudgetMessages() {
        return [
            { text: "Hola, quisiera información sobre sus soluciones", meta: "Matching básico + Captura de intent" },
            { text: "¡Hola! Encantado de ayudarte. ¿Cuántos empleados tiene tu empresa?", meta: "Detección metodología BANT" },
            { text: "Somos 30 empleados. ¿Cuánto cuesta?", meta: "ICP Actions + Condiciones JSONPath" },
            { text: "Para calcular el mejor precio, ¿cuál es tu presupuesto mensual aproximado?", meta: "Checkpoint creado (falta dato)" },
            { text: "Solo tengo $3,000 mensuales disponibles", meta: "Presupuesto insuficiente detectado" },
            { text: "Entiendo tu situación. Tenemos un plan básico por $2,800/mes para 20 usuarios", meta: "Plan alternativo activado" },
            { text: "¿Qué incluye el plan básico?", meta: "Información de plan reducido" },
            { text: "Incluye funciones core: facturación, inventario básico y 2 reportes", meta: "Características limitadas" },
            { text: "Hmm, necesito más funciones...", meta: "Objeción de características" },
            { text: "Podemos ofrecer financiamiento a 12 meses sin intereses", meta: "Opción de financiamiento" },
            { text: "¿Cómo funciona el financiamiento?", meta: "Interés en alternativa" },
            { text: "Pagarías $850/mes por el plan completo. ¿Te interesa una demo?", meta: "Propuesta de financiamiento" },
            { text: "Déjame pensarlo y te contacto", meta: "Follow-up requerido ⏳" }
        ];
    }
    
    getEnterpriseMessages() {
        return [
            { text: "Hola, necesito información para mi empresa", meta: "Matching básico + Captura de intent" },
            { text: "¡Hola! ¿Cuántos empleados tiene su empresa?", meta: "Detección rápida de segmento" },
            { text: "Somos 500 empleados. Necesito pricing enterprise", meta: "Segmento enterprise detectado" },
            { text: "Perfecto. Para 500 usuarios el precio es $150,000/año con 25% descuento enterprise", meta: "Pricing enterprise inmediato" },
            { text: "¿Qué incluye el plan enterprise?", meta: "Características premium" },
            { text: "Incluye: API completa, SSO, soporte 24/7, manager dedicado y customizaciones", meta: "Features enterprise" },
            { text: "¿Tienen integración con Salesforce?", meta: "Requerimiento técnico específico" },
            { text: "Sí, integración nativa con Salesforce, HubSpot y 50+ herramientas", meta: "Confirmación técnica" },
            { text: "Perfecto. ¿Cuándo podemos hacer una demo?", meta: "Interés confirmado" },
            { text: "Puedo agendar para mañana con nuestro Enterprise Solutions Manager", meta: "Escalación a especialista" },
            { text: "Excelente, agendemos para mañana a las 2pm", meta: "Compromiso confirmado" },
            { text: "Perfecto. Te envío invitación y preparo demo personalizada", meta: "Cierre enterprise ✅" }
        ];
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.scenarioManager = new ScenarioManager();
});

// Estilos adicionales para notificaciones
const notificationStyles = `
.scenario-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    z-index: 1000;
    max-width: 300px;
}

.scenario-notification.show {
    transform: translateX(0);
}

.notification-content {
    font-size: 0.9em;
}

.notification-impact {
    margin-top: 5px;
    font-size: 0.8em;
    opacity: 0.9;
}

.comparison-metrics {
    margin-bottom: 15px;
}

.comp-metric {
    padding: 5px 0;
    border-bottom: 1px solid #e2e8f0;
}

.comp-metric:last-child {
    border-bottom: none;
}

.comparison-description {
    margin: 15px 0;
    padding: 10px;
    background: #f7fafc;
    border-radius: 6px;
    font-size: 0.9em;
}

.comparison-messages h4 {
    margin-bottom: 10px;
    color: #2d3748;
}

.comp-message {
    background: #e2e8f0;
    padding: 8px;
    margin: 5px 0;
    border-radius: 4px;
    font-size: 0.85em;
}
`;

// Inyectar estilos
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);
