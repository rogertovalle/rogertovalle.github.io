// ==================== BRANCH MANAGER ====================
// Maneja las ramas conversacionales y bifurcaciones interactivas

class BranchManager {
    constructor() {
        this.currentBranch = 'main';
        this.branches = {
            'main': {
                name: 'Ruta Principal',
                path: '📍 Ruta Principal',
                messages: this.getMainMessages(),
                metrics: {
                    conversion: '100%',
                    time: '10.5min',
                    guidelines: '15',
                    outcome: '✅ Demo'
                }
            }
        };
        // Contexto por rama (v2): metodología/idioma/moneda
        this.branches.main.context = { methodology: 'BANT', language: 'es', currency: 'MXN' };
        
        this.branchHistory = ['main'];
        this.chatSkeleton = '';
        this.init();
    }
    
    init() {
        const mainChat = document.getElementById('main-chat');
        if (mainChat) {
            this.chatSkeleton = mainChat.innerHTML;
        }
        this.loadState();
        this.addEventListeners();
        this.refreshUI(false);
    }
    
    refreshUI(scrollToFromTurn = false) {
        this.updatePathDisplay();
        this.updateMetrics();
        this.updateConversation(scrollToFromTurn);
        this.updateBranchButtons();
        this.updateBackButton();
        // Chips de contexto
        this.renderContextChips('context-chips', this.currentBranch);
    }

    addEventListeners() {
        // Hotkeys
        window.addEventListener('keydown', (e) => {
            if (e.key === '1') {
                this.switchToBranch('main');
            } else if (e.key === 'ArrowLeft') {
                this.goBack();
            } else if (e.key.toLowerCase() === 's') {
                this.toggleScenarioPanel();
            }
        });

        // Persist scroll on unload
        window.addEventListener('beforeunload', () => {
            this.persistScrollFor(this.currentBranch, document.getElementById('main-chat'));
        });
    }
    
    createBranch(fromTurn, branchType) {
        const branchId = `${branchType}_${Date.now()}`;
        const branchData = this.getBranchData(branchType);
        
        // Crear nueva rama
        this.branches[branchId] = {
            name: branchData.name,
            path: `📍 ${branchData.name} (desde Turno ${fromTurn})`,
            messages: this.createBranchedMessages(fromTurn, branchData),
            metrics: branchData.metrics,
            fromTurn: fromTurn,
            parentBranch: this.currentBranch,
            context: this.deriveContextForBranch(branchType),
            baseType: branchType,
            // Estado mutable por rama (contadores, flags, etc.)
            state: { priceObjectionCount: 0, altTacticApplied: false, budget_monthly: null }
        };
        
        // Cambiar a la nueva rama
        this.switchToBranch(branchId);
        
        // Mostrar animación de bifurcación
        this.showBranchAnimation(fromTurn, branchData.name);
        // Persistir
        this.saveState();
    }
    
    switchToBranch(branchId) {
        if (!this.branches[branchId]) return;
        
        const previousBranch = this.currentBranch;
        this.currentBranch = branchId;
        this.branchHistory.push(branchId);
        
        // Actualizar UI
        this.updateConversation(true); // desplazar al fromTurn de la rama
        this.updatePathDisplay();
        this.updateMetrics();
        this.updateBranchButtons();
        this.updateBackButton();
        
        // Mostrar notificación
        this.showBranchNotification(previousBranch, branchId);
        // Persistir
        this.saveState();
    }
    
    resetToMain() {
        // Volver a la rama principal sin duplicar historial
        this.currentBranch = 'main';
        this.branchHistory = ['main'];
        this.updateConversation();
        this.updatePathDisplay();
        this.updateMetrics();
        this.updateBranchButtons();
        this.updateBackButton();
    }
    
    goBack() {
        if (this.branchHistory.length > 1) {
            this.branchHistory.pop(); // Remover actual
            const previousBranch = this.branchHistory[this.branchHistory.length - 1];
            this.currentBranch = previousBranch;
            this.updateConversation();
            this.updatePathDisplay();
            this.updateMetrics();
            this.updateBackButton();
            this.saveState();
        }
    }
    
    updateConversation(scrollToFromTurn = false) {
        const chatContainer = document.getElementById('main-chat');
        const branch = this.branches[this.currentBranch];
        if (!chatContainer || !branch) return;
        chatContainer.classList.add('switching');
        
        setTimeout(() => {
            // Actualizar mensajes uno por uno (dinámico según cantidad en DOM)
            const turnNodes = chatContainer.querySelectorAll('[data-turn]');
            turnNodes.forEach((node) => {
                const turnNum = parseInt(node.dataset.turn);
                const idx = turnNum - 1;
                if (branch.messages[idx]) {
                    const textElement = node.querySelector('.message-text');
                    const metaElement = node.querySelector('.message-meta');
                    // Loop guard avanzado: cambiar táctica si hay objeción de precio repetida
                    try {
                        const isAssistant = !node.classList.contains('user');
                        if (isAssistant && branch.baseType === 'objection' && branch.state && branch.state.priceObjectionCount > 1 && !branch.state.altTacticApplied) {
                            // Tras reordenar, el turno 12 es la propuesta de piloto; sustituimos por táctica alternativa
                            if (turnNum === 12) {
                                branch.messages[idx].text = '"Para ajustar a tu presupuesto, podemos: 1) reducir el alcance inicial a módulos críticos y escalar luego, o 2) ofrecer financiamiento con facturación anual/en tramos. ¿Cuál prefieres?"';
                                branch.messages[idx].modified = true;
                                branch.messages[idx].meta = 'Cambio de táctica por loop guard (alternativa a piloto)';
                                const existing = Array.isArray(branch.messages[idx].badges) ? branch.messages[idx].badges : [];
                                if (!existing.includes('loop')) existing.push('loop');
                                branch.messages[idx].badges = existing;
                                branch.state.altTacticApplied = true;
                            }
                        }
                    } catch (_) { /* noop */ }

                    if (textElement) textElement.textContent = branch.messages[idx].text;
                    if (metaElement && branch.messages[idx].meta) metaElement.textContent = branch.messages[idx].meta;
                    // Render opcional de timeline cuando hay badge 'timing' o meta con 'Timing:'
                    try {
                        const msg = branch.messages[idx] || {};
                        const hasTimingBadge = Array.isArray(msg.badges) && msg.badges.includes('timing');
                        const timingText = (msg.meta || '').includes('Timing:') ? msg.meta : '';
                        const bubble = node.querySelector('.message-bubble');
                        if (bubble) {
                            const existing = bubble.querySelector('.timing-hint');
                            if (existing) existing.remove();
                            if (hasTimingBadge || timingText) {
                                const hint = document.createElement('div');
                                hint.className = 'timing-hint';
                                hint.textContent = timingText ? timingText : 'Timing: before_gov + governance + persist';
                                bubble.appendChild(hint);
                            }
                        }
                    } catch (_) { /* noop */ }
                    // Captura de email opcional (si el usuario lo provee en el texto)
                    try {
                        if (node.classList.contains('user')) {
                            const msgText = (branch.messages[idx].text || '').toString();
                            const emailMatch = msgText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
                            if (emailMatch && emailMatch[0]) {
                                const found = emailMatch[0];
                                const valid = this.isValidEmail(found);
                                if (valid) {
                                    this.captureEmail(found, branch, idx);
                                } else {
                                    // Marcar visualmente como inválido
                                    const msg = branch.messages[idx];
                                    if (msg) {
                                        if (!Array.isArray(msg.badges)) msg.badges = [];
                                        if (!msg.badges.includes('email_invalid')) msg.badges.push('email_invalid');
                                    }
                                    // Render hint en UI
                                    const bubble = node.querySelector('.message-bubble');
                                    if (bubble && !bubble.querySelector('.validation-error')) {
                                        const hint = document.createElement('div');
                                        hint.className = 'validation-error';
                                        hint.textContent = 'Email no válido. Por favor confirma la dirección.';
                                        bubble.appendChild(hint);
                                    }
                                }
                            }

                            // Captura de presupuesto mensual (budget) desde mensajes del usuario
                            try {
                                // patrones: "$15,000", "$15k", "15k", "15 mil", seguido de palabras como mensual/mes opcional
                                const budgetRegex = /\$?\s*(\d{1,3}(?:[.,]\d{3})+|\d+(?:[.,]\d+)?)(\s*k|\s*mil)?/i;
                                const match = msgText.match(budgetRegex);
                                if (match) {
                                    let raw = match[1].replace(/\./g, '').replace(/,/g, '');
                                    let value = parseFloat(raw);
                                    const suffix = (match[2] || '').trim().toLowerCase();
                                    if (suffix === 'k' || suffix === 'mil') {
                                        value = value * 1000;
                                    }
                                    if (!isNaN(value) && value > 0) {
                                        branch.state.budget_monthly = value;
                                        branch.context = branch.context || {};
                                        branch.context.budget_monthly = value;
                                    }
                                }
                            } catch (_) { /* noop */ }

                            // Contar objeción de precio (palabras clave)
                            try {
                                const lower = msgText.toLowerCase();
                                const isPriceObjection = /caro|costoso|muy caro|precio alto/.test(lower);
                                if (isPriceObjection) {
                                    branch.state.priceObjectionCount = (branch.state.priceObjectionCount || 0) + 1;
                                }
                            } catch (_) { /* noop */ }
                        }
                    } catch (e) { /* ignore */ }
                    if (branch.messages[idx].modified) node.classList.add('branch-modified');
                    else node.classList.remove('branch-modified');
                    // Badges
                    this.renderMessageBadges(node, branch.messages[idx]);
                }
            });

            // Actualizar visibilidad de botones
            this.updateBranchButtons();

            // Aplicar contexto visual de la rama
            this.applyBranchVisualContext(chatContainer, branch);
            this.applyFromTurnMarker(chatContainer, branch);
            chatContainer.dataset.theme = this.getBranchTheme(this.currentBranch);
            
            // Restaurar/Priorizar scroll
            const restored = this.restoreScrollFor(this.currentBranch, chatContainer);
            if (!restored && scrollToFromTurn && branch.fromTurn) {
                const turnElement = chatContainer.querySelector(`[data-turn="${branch.fromTurn}"]`);
                if (turnElement) turnElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            // Remover animación
            chatContainer.classList.remove('switching');
            chatContainer.classList.add('switched');
            
            setTimeout(() => {
                chatContainer.classList.remove('switched');
            }, 300);
            
        }, 150);
    }

    // Renderiza badges dentro de una burbuja de mensaje
    renderMessageBadges(node, msg) {
        const bubble = node.querySelector('.message-bubble');
        if (!bubble) return;
        let badgesEl = bubble.querySelector('.message-badges');
        if (!badgesEl) {
            badgesEl = document.createElement('div');
            badgesEl.className = 'message-badges';
            bubble.insertBefore(badgesEl, bubble.firstChild);
        }
        badgesEl.innerHTML = '';
        const badges = Array.isArray(msg.badges) ? msg.badges : [];
        badges.forEach((b) => {
            const span = document.createElement('span');
            span.className = 'message-badge dynamic';
            span.textContent = this.formatBadge(b);
            badgesEl.appendChild(span);
        });
    }

    formatBadge(b) {
        // formatos simples para demo
        if (b === 'checkpoint') return '⏸️ Checkpoint';
        if (b === 'loop') return '🔄 Loop';
        if (b === 'icp') return '🧩 ICP';
        if (b === 'compliance') return '🔐 Compliance';
        if (b === 'email') return '✉️ Email';
        if (b === 'email_invalid') return '⚠️ Email inválido';
        if (b === 'timing') return '⏱️ Timing';
        if (b === 'requires_actions') return '🔗 Requires_Actions';
        if (b === 'predictive') return '🔮 Predictivo';
        if (b === 'prefetch') return '⚙️ Prefetch';
        if (b === 'phase_transition') return '🧭 Transición de Fase';
        if (b && /^phase\(/.test(b)) return '🧩 Fase ' + b.replace('phase(','').replace(')','');
        if (b === 'multicanal') return '🔁 Multicanal';
        if (b === 'vip') return '👑 VIP';
        if (b.startsWith('language(')) return '🌍 ' + b.replace('language(','').replace(')','').toUpperCase();
        if (b === 'priority_high') return '⚠️ Alta';
        return b;
    }

    // Validación simple de email
    isValidEmail(email) {
        try {
            // Patrón razonable (no RFC completo) + TLD >= 2, sin espacios
            const re = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
            if (!re.test(email)) return false;
            // Reglas adicionales básicas
            if (email.endsWith('.')) return false;
            if (email.includes('..')) return false;
            const [local, domain] = email.split('@');
            if (!local || !domain) return false;
            if (domain.startsWith('-') || domain.endsWith('-')) return false;
            return true;
        } catch (_) { return false; }
    }

    // Chips de contexto en cabeceras
    renderContextChips(containerId, branchId) {
        const el = document.getElementById(containerId);
        if (!el) return;
        el.innerHTML = '';
        const br = this.branches[branchId];
        if (!br || !br.context) return;
        const fields = [
            { key: 'methodology', label: '', map: { BANT: 'BANT', MEDDIC: 'MEDDIC', CONSULTATIVE: 'Consultative' } },
            { key: 'language', label: '', map: { es: 'ES', en: 'EN' } },
            { key: 'currency', label: '', map: { MXN: 'MXN', USD: 'USD', COP: 'COP' } },
            { key: 'contact_email', label: 'email', map: {} }
        ];
        // Chip de presupuesto si existe
        if (typeof br.context.budget_monthly === 'number') {
            const cur = br.context.currency || 'USD';
            const fmt = new Intl.NumberFormat('es-ES');
            const val = fmt.format(br.context.budget_monthly);
            const chip = document.createElement('span');
            chip.className = 'context-chip';
            chip.textContent = `presupuesto: ${cur} ${val}/mes`;
            el.appendChild(chip);
        }
        fields.forEach(f => {
            const val = br.context[f.key];
            if (!val) return;
            const chip = document.createElement('span');
            chip.className = 'context-chip';
            chip.textContent = (f.label ? f.label+': ' : '') + (f.map[val] || String(val));
            el.appendChild(chip);
        });
    }

    // Deriva contexto por rama a partir de la actual + overrides
    deriveContextForBranch(branchType) {
        const base = (this.branches[this.currentBranch] && this.branches[this.currentBranch].context) || { methodology: 'BANT', language: 'es', currency: 'MXN' };
        const ctx = { ...base };
        const ov = this.getContextOverride(branchType);
        return { ...ctx, ...ov };
    }

    getContextOverride(branchType) {
        if (branchType === 'enterprise') return { methodology: 'MEDDIC' };
        if (branchType === 'language_en') return { language: 'en', currency: 'USD' };
        if (branchType === 'brand_premium') return { brand_id: 5, methodology: 'CONSULTATIVE' };
        return {};
    }
    
    updatePathDisplay() {
        const pathElement = document.querySelector('.current-path');
        if (pathElement) {
            pathElement.textContent = this.branches[this.currentBranch].path;
        }
    }
    
    updateMetrics() {
        const branch = this.branches[this.currentBranch];
        const metrics = branch.metrics;
        
        // Actualizar valores con animación
        this.animateMetricChange('conversion-rate', metrics.conversion);
        this.animateMetricChange('time-duration', metrics.time);
        this.animateMetricChange('guidelines-count', metrics.guidelines);
        this.animateMetricChange('outcome-status', metrics.outcome);
        
        // Actualizar tendencias comparando con main
        this.updateTrends();
        this.updateOutcomeTrend();
    }
    
    animateMetricChange(elementId, newValue) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const oldValue = element.textContent;
        
        if (oldValue !== newValue) {
            // Animación de cambio
            element.style.transform = 'scale(1.1)';
            element.style.color = '#667eea';
            
            setTimeout(() => {
                element.textContent = newValue;
                element.style.transform = 'scale(1)';
                element.style.color = '#2d3748';
            }, 150);
        }
    }
    
    updateTrends() {
        const mainMetrics = this.branches.main.metrics;
        const currentMetrics = this.branches[this.currentBranch].metrics;
        
        this.updateTrend('conversion-trend', 
            parseFloat(mainMetrics.conversion), 
            parseFloat(currentMetrics.conversion));
            
        this.updateTrend('time-trend', 
            parseFloat(mainMetrics.time), 
            parseFloat(currentMetrics.time), true);
            
        this.updateTrend('guidelines-trend', 
            parseInt(mainMetrics.guidelines), 
            parseInt(currentMetrics.guidelines));
    }
    
    updateTrend(elementId, mainValue, currentValue, lowerIsBetter = false) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        element.classList.remove('up', 'down', 'stable');
        
        if (currentValue > mainValue) {
            element.classList.add(lowerIsBetter ? 'down' : 'up');
            element.textContent = lowerIsBetter ? '↗' : '↗';
        } else if (currentValue < mainValue) {
            element.classList.add(lowerIsBetter ? 'up' : 'down');
            element.textContent = lowerIsBetter ? '↘' : '↘';
        } else {
            element.classList.add('stable');
            element.textContent = '→';
        }
    }
    
    updateBranchButtons() {
        // Render dinámico de botones de bifurcación por rama/turno
        const branch = this.branches[this.currentBranch];
        const optionsMap = this.getBranchOptions(this.currentBranch);
        const mainChat = document.getElementById('main-chat');
        if (!mainChat) return;
        const containers = mainChat.querySelectorAll('.branch-buttons');
        containers.forEach(container => {
            const msgNode = container.closest('.chat-message');
            const turn = parseInt(msgNode.dataset.turn);
            const isUserTurn = msgNode.classList.contains('user');
            // Ocultar botones anteriores al punto de bifurcación cuando no estamos en main
            if (this.currentBranch !== 'main' && branch.fromTurn && turn <= branch.fromTurn) {
                container.innerHTML = '';
                container.style.display = 'none';
                return;
            }
            // Mostrar opciones solo en turnos de usuario para coherencia
            const options = isUserTurn ? (optionsMap[turn] || []) : [];
            container.innerHTML = '';
            if (options.length === 0) {
                container.style.display = 'none';
                return;
            }
            options.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'branch-btn';
                btn.title = opt.title || '';
                btn.textContent = opt.label;
                btn.addEventListener('click', (e) => {
                    // Evitar que el click burbujee y dispare el modal del turno
                    e.preventDefault();
                    e.stopPropagation();
                    if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
                    this.createBranch(turn, opt.type);
                });
                container.appendChild(btn);
            });
            container.style.display = 'flex';
        });
    }

    updateBackButton() {
        const backBtn = document.getElementById('back-branch-btn');
        if (!backBtn) return;
        const disabled = (this.branchHistory.length <= 1) || (this.currentBranch === 'main');
        backBtn.disabled = disabled;
        backBtn.style.opacity = disabled ? '0.5' : '1';
        backBtn.style.cursor = disabled ? 'not-allowed' : 'pointer';
    }

    renderBranchChips() {
        const chips = document.getElementById('branch-chips');
        if (!chips) return;
        chips.innerHTML = '';
        const entries = Object.entries(this.branches);
        // Orden: main primero, luego por creación (aprox. id contiene timestamp)
        entries.sort(([aId],[bId]) => (aId === 'main' ? -1 : bId === 'main' ? 1 : aId.localeCompare(bId)));
        entries.forEach(([id, br]) => {
            const chip = document.createElement('button');
            chip.className = 'branch-chip' + (id === this.currentBranch ? ' active' : '');
            chip.textContent = (id === 'main') ? 'Ruta Principal' : br.name;
            chip.title = br.path || br.name;
            chip.addEventListener('click', () => {
                if (id !== this.currentBranch) {
                    this.switchToBranch(id);
                }
            });
            chips.appendChild(chip);
        });
    }

    applyBranchVisualContext(container, branch) {
        const turnNodes = container.querySelectorAll('[data-turn]');
        turnNodes.forEach(n => n.classList.remove('pre-branch-dim'));
        if (!branch || !branch.fromTurn || branch === this.branches['main']) return;
        turnNodes.forEach((node) => {
            const turnNum = parseInt(node.dataset.turn);
            if (turnNum < branch.fromTurn) node.classList.add('pre-branch-dim');
        });
    }

    applyFromTurnMarker(container, branch) {
        const prev = container.querySelector('.chat-message.from-turn');
        if (prev) prev.classList.remove('from-turn');
        if (!branch || !branch.fromTurn) return;
        const el = container.querySelector(`[data-turn="${branch.fromTurn}"]`);
        if (el) el.classList.add('from-turn');
    }

    updateOutcomeTrend() {
        const el = document.getElementById('outcome-trend');
        if (!el) return;
        const mainScore = this.getOutcomeScore(this.branches.main.metrics.outcome);
        const currentScore = this.getOutcomeScore(this.branches[this.currentBranch].metrics.outcome);
        el.classList.remove('up','down','stable');
        if (currentScore > mainScore) {
            el.classList.add('up');
            el.textContent = '↗';
        } else if (currentScore < mainScore) {
            el.classList.add('down');
            el.textContent = '↘';
        } else {
            el.classList.add('stable');
            el.textContent = '→';
        }
    }

    getOutcomeScore(outcome) {
        // Mapea outcomes a un score para comparación
        const map = {
            '✅ Demo': 3,
            '⏳ Follow-up': 2,
            '❌ No interés': 1
        };
        return map[outcome] || 0;
    }
    
    showBranchAnimation(fromTurn, branchName) {
        const turnElement = document.querySelector(`[data-turn="${fromTurn}"]`);
        if (!turnElement) return;
        
        // Crear indicador visual de bifurcación
        const branchIndicator = document.createElement('div');
        branchIndicator.className = 'branch-indicator';
        branchIndicator.innerHTML = `
            <div class="branch-arrow">🌿</div>
            <div class="branch-label">Bifurcando a: ${branchName}</div>
        `;
        
        turnElement.appendChild(branchIndicator);
        
        // Animar aparición
        setTimeout(() => {
            branchIndicator.classList.add('show');
        }, 100);
        
        // Remover después de la animación
        setTimeout(() => {
            branchIndicator.classList.remove('show');
            setTimeout(() => {
                if (branchIndicator.parentNode) {
                    branchIndicator.parentNode.removeChild(branchIndicator);
                }
            }, 300);
        }, 2000);
    }
    
    showBranchNotification(fromBranch, toBranch) {
        const fromName = this.branches[fromBranch].name;
        const toName = this.branches[toBranch].name;
        
        const notification = document.createElement('div');
        notification.className = 'branch-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <strong>🌿 Rama cambiada:</strong> ${fromName} → ${toName}
                <div class="notification-metrics">
                    Conversión: ${this.branches[fromBranch].metrics.conversion} → ${this.branches[toBranch].metrics.conversion}
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
    
    // Datos de las diferentes ramas
    getBranchData(branchType) {
        const branchTypes = {
            'enterprise': {
                name: 'Empresa Grande',
                metrics: {
                    conversion: '95%',
                    time: '8.7min',
                    guidelines: '12',
                    outcome: '✅ Demo'
                },
                changes: {
                    3: { text: '"Somos 500 empleados. Necesito pricing enterprise"', modified: true },
                    4: { text: '"Perfecto. Para 500 usuarios el precio es $150,000/año con 25% descuento enterprise"', modified: true },
                    5: { text: '"¿Qué incluye el plan enterprise?"', modified: true },
                    6: { text: '"Incluye: API completa, SSO, soporte 24/7, manager dedicado y customizaciones"', modified: true },
                    7: { text: '"¿Incluye SSO, SCIM y roles de auditoría?"', modified: true, meta: 'Consulta enterprise features', badges: ['priority_high'] },
                    8: { text: '"Sí, SSO (SAML/OIDC), SCIM, RBAC avanzado y auditoría. Además soporte 24/7 y manager dedicado"', modified: true, meta: 'Brand override + Enterprise features' },
                    10: { text: '"Con el plan enterprise, tu ROI estimado es 88% en el primer año"', modified: true, meta: 'Cálculo ROI (enterprise)', badges: ['icp'] }
                }
            },
            'reframe': {
                name: 'Reencuadre de Valor',
                metrics: {
                    conversion: '45%',
                    time: '12.0min',
                    guidelines: '20',
                    outcome: '⏳ Follow-up'
                },
                changes: {
                    4: { text: '"Entiendo. ¿Qué objetivo te importa más ahora: ahorrar costos, acelerar ventas o control de procesos?"', modified: true, meta: 'Guideline reframe + preguntas de valor', badges: ['reframe'] },
                    5: { text: '"Reducir costos operativos"', modified: true },
                    6: { text: '"Con tu volumen, puedes ahorrar $2,500/mes. ROI ~82% en el primer año"', modified: true, meta: 'Calculations + registry', badges: ['icp'] },
                    10: { text: '"Si quieres, armamos un piloto de 7 días para medir ROI real con tus datos"', modified: true, meta: 'Pilot strategy + Loop guard', badges: ['loop'] }
                }
            },
            'compliance': {
                name: 'Evaluación de Seguridad',
                metrics: {
                    conversion: '88%',
                    time: '9.2min',
                    guidelines: '19',
                    outcome: '✅ Demo'
                },
                changes: {
                    7: { text: '"Necesitamos evaluación de seguridad y cumplimiento"', modified: true, badges: ['compliance'] },
                    8: { text: '"Contamos con SSO, SOC2, ISO27001 y DPA. Puedo enviar cuestionario estándar y whitepaper hoy"', modified: true, badges: ['compliance'] },
                    9: { text: '"Sí, requerimos revisión legal y cuestionario SIG/CAIQ"', modified: true, meta: 'Matching semántico (detalles legales)', badges: ['compliance'] },
                    10: { text: '"¿Prefieren revisión legal directa o iniciar con cuestionario SIG/CAIQ?"', modified: true, meta: 'Policy routing (requires_actions)', badges: ['compliance'] },
                    11: { text: '"Empecemos con SIG"', modified: true, meta: 'Selección de procedimiento' },
                    12: { text: '"Perfecto. Te comparto por este canal los enlaces al cuestionario SIG/CAIQ y al whitepaper + DPA. Si prefieres por email, indícame cuál te funciona y lo envío también. En paralelo, tu ROI estimado se mantiene en 82% con las políticas de seguridad aplicadas. ¿Te agendo la revisión de seguridad y una demo técnica?"', modified: true, meta: 'Preferencia de canal + Cálculo ROI + ESCALATES_TO + Loop guard', badges: ['compliance','icp','priority_high'] },
                    13: { text: '"Sí, envíalo a juan@empresa.com y coordinemos la revisión y demo"', modified: true, meta: 'Email capturado + cierre exitoso ✅', badges: ['compliance'] }
                }
            },
            'low_budget': {
                name: 'Presupuesto Bajo',
                metrics: {
                    conversion: '60%',
                    time: '15.2min',
                    guidelines: '22',
                    outcome: '⏳ Follow-up'
                },
                changes: {
                    5: { text: '"Solo tengo $3,000 mensuales disponibles"', modified: true },
                    6: { text: '"Entiendo tu situación. Tenemos un plan básico por $2,800/mes para 20 usuarios"', modified: true },
                    7: { text: '"¿Qué incluye el plan básico?"', modified: true },
                    8: { text: '"Incluye funciones core: facturación, inventario básico y 2 reportes"', modified: true },
                    9: { text: '"Hmm, me parece un poco caro..."', modified: true, meta: 'Matching semántico' },
                    10: { text: '"Para maximizar valor dentro de tu presupuesto, podemos empezar con el plan básico y priorizar módulos críticos; luego escalamos. "', modified: true, meta: 'Estrategia de valor dentro de presupuesto', badges: ['icp'] },
                    11: { text: '"¿Esto entra en mi presupuesto que mencioné?"', modified: true, meta: 'State lookup' },
                    12: { text: '"Sí, con tu presupuesto de $3k/mes es viable. ¿Te gustaría una demo?"', modified: true, meta: 'Confirmación dentro de presupuesto + Loop guard' }
                }
            },
            'objection': {
                name: 'Rechazo Directo',
                metrics: {
                    conversion: '55%',
                    time: '12.0min',
                    guidelines: '22',
                    outcome: '⏳ Follow-up'
                },
                changes: {
                    // [0] Usuario rechaza
                    3: { text: '"No me interesa, gracias"', modified: true, badges: ['objection','checkpoint'], meta: 'Rechazo directo + Checkpoint(hard_objection)' },
                    // [1] Reencuadre breve
                    4: { text: '"Entiendo. ¿Qué te hace pensarlo? ¿Precio, tiempos o integración?"', modified: true, badges: ['reframe','checkpoint'], meta: 'Reencuadre breve + Checkpoint(asked_reason)' },
                    // [2] Usuario explicita razón (precio)
                    5: { text: '"Principalmente por el precio"', modified: true, meta: 'Razón de objeción capturada' },
                    // [3] Asistente pide presupuesto
                    6: { text: '"¿Manejas un presupuesto mensual aproximado para esto?"', modified: true, badges: ['icp','checkpoint'], meta: 'Solicitud de presupuesto + Checkpoint(budget_request)' },
                    // [4] Usuario indica budget
                    7: { text: '"Tengo unos $15,000 mensuales disponibles"', modified: true, badges: ['icp'], meta: 'Resume checkpoint + ICP validation' },
                    // [5] Pricing con cálculo y descuento
                    8: { text: '"Perfecto. El plan para 30 usuarios es $12,000. Con tu volumen tienes 15% de descuento: $10,200"', modified: true, badges: ['calculations','checkpoint'], meta: 'Calculations (inline + registry) + quote_shown' },
                    // [6] Usuario pregunta beneficios
                    9: { text: '"¿Qué beneficios ofrece?"', modified: true, meta: 'Relación PRECEDES' },
                    // [7] Beneficios alineados a marca
                    10: { text: '"Nuestro software te ayuda a: automatizar facturación, control de inventario, reportes en tiempo real..."', modified: true, badges: ['brand_override'], meta: 'Beneficios alineados a marca' },
                    // [8] Objeción de precio
                    11: { text: '"Hmm, me parece un poco caro..."', modified: true, badges: ['loop'], meta: 'Objeción de precio detectada' },
                    // [9] Estrategia piloto + ROI (o táctica alternativa por loop guard)
                    12: { text: '"Para ayudarte a decidir, podemos hacer un piloto de 7 días y ver el ROI real con tus datos"', modified: true, badges: ['loop','relations'], meta: 'Cálculo ROI + Estrategia piloto (relations)' },
                    // [10] Usuario valida presupuesto contra oferta
                    13: { text: '"¿Esto entra en mi presupuesto que mencioné?"', modified: true, meta: 'State lookup' },
                    // [11] Confirmación de encaje con presupuesto y CTA
                    14: { text: '"Sí, con tu presupuesto de $15k/mes es viable. ¿Te gustaría una demo?"', modified: true, badges: ['checkpoint'], meta: 'Loop detection + budget_fit' },
                    // [12] Cierre
                    15: { text: '"Sí, me gustaría agendar una demo"', modified: true, meta: 'Cierre exitoso ✅' }
                }
            },
            'loop': {
                name: 'Loop Detectado',
                metrics: {
                    conversion: '78%',
                    time: '9.8min',
                    guidelines: '20',
                    outcome: '⏳ Follow-up'
                },
                changes: {
                    3: { text: '"Veo que es importante el precio. Propongo una demo rápida para ver el fit y resolver dudas de ROI"', modified: true },
                    4: { text: '"¿Prefieres que agendemos una llamada de 10 min hoy mismo?"', modified: true }
                }
            },
            'urgency': {
                name: 'Urgencia Alta',
                metrics: {
                    conversion: '96%',
                    time: '7.5min',
                    guidelines: '17',
                    outcome: '✅ Demo'
                },
                changes: {
                    4: { text: '"Si necesitas implementar esta semana, agendemos demo hoy y aceleramos onboarding"', modified: true },
                    12: { text: '"Marcando prioridad alta en CRM y coordinando equipo para onboarding express"', modified: true }
                }
            },
            'language_en': {
                name: 'English (US Market)',
                metrics: {
                    conversion: '90%',
                    time: '10.0min',
                    guidelines: '16',
                    outcome: '✅ Demo'
                },
                changes: {
                    1: { text: '"Hello, I need information about your solutions"', modified: true, badges: ['language(en)'] },
                    2: { text: '"Hi John! Happy to help. How many employees does your company have?"', modified: true, badges: ['language(en)'] },
                    6: { text: '"The plan for 30 users is $650/month (USD). With your volume you get 15% off: $552"', modified: true, badges: ['language(en)'] },
                    10: { text: '"With annual billing, your ROI is 95% in the first year"', modified: true, badges: ['language(en)'] }
                }
            },
            'discount': {
                name: 'Negociación con Descuento',
                metrics: {
                    conversion: '65%',
                    time: '14.0min',
                    guidelines: '24',
                    outcome: '⏳ Follow-up'
                },
                changes: {
                    7: { text: '"¿Pueden aplicar descuento?"', modified: true, meta: 'Solicitud de descuento', badges: ['discount'] },
                    8: { text: '"Podemos ofrecer 10% de descuento si eliges facturación anual"', modified: true },
                    10: { text: '"Con el descuento anual, tu ROI mejora a 95% en el primer año"', modified: true }
                }
            },
            // Multicanal básico: WhatsApp → Email
            'channel_switch': {
                name: 'Cambio de Canal (WA → Email)',
                metrics: { conversion: '92%', time: '11.0min', guidelines: '18', outcome: '✅ Demo' },
                changes: {
                    8: { text: '"Envíame la cotización por email a juan@empresa.com"', modified: true, badges: ['email','multicanal'], meta: 'Detección cambio de canal' },
                    9: { text: '"Perfecto, te envié el detalle por email y aquí te dejo el resumen corto"', modified: true, badges: ['multicanal'], meta: 'Estado compartido cross-channel' },
                    10: { text: '"📧 Email enviado\n\nAsunto: Cotización CRM Pro\n\nEstimado Juan,\nAdjunto cotización: $10,200/mes (15% desc.). Beneficios: facturación, inventario, reportes. ROI 82%.\n\nSaludos,\nAsistente"', modified: true, badges: ['email'], meta: 'Template diferenciado por canal (email)'}
                }
            },
            // Predictivo
            'predictive': {
                name: 'Sistema Predictivo',
                metrics: { conversion: '88%', time: '10.2min', guidelines: '19', outcome: '⏳ Follow-up' },
                changes: {
                    9: { text: '"🔮 Probabilidad 78% de que preguntes por beneficios; prefetch features y FAQs"', modified: true, badges: ['predictive','prefetch'], meta: 'Prefetch reduce latencia -35% en próximo turno' }
                }
            },
            // Fase salteable
            'phase_skip': {
                name: 'Fase Salteable',
                metrics: { conversion: '93%', time: '9.8min', guidelines: '16', outcome: '✅ Demo' },
                changes: {
                    5: { text: '"BANT completeness: 85% → qualification saltada → prospection → presentation"', modified: true, badges: ['phase_transition'], meta: 'Fase qualification saltada (req <80%)' }
                }
            },
            // Panel de emociones
            'emotions': {
                name: 'Análisis Emocional',
                metrics: { conversion: '80%', time: '11.5min', guidelines: '20', outcome: '⏳ Follow-up' },
                changes: {
                    11: { text: '"🧠 Polaridad=-0.4 | Emoción: preocupación | Signal: resistance → guideline reframe_value"', modified: true, badges: ['emotions','intelligence'], meta: 'AFINN/NRC rápidos + gating DISC' }
                }
            },
            // Marca Premium VIP
            'brand_premium': {
                name: 'Marca Premium (VIP)',
                metrics: { conversion: '90%', time: '10.0min', guidelines: '18', outcome: '✅ Demo' },
                changes: {
                    4: { text: '"Detectamos que calificas para servicio VIP. Asigno gerente dedicado y soporte 24/7"', modified: true, badges: ['brand_override','vip'], meta: 'VIP concierge (brand_id=5)'}
                }
            }
        };
        
        return branchTypes[branchType] || branchTypes['enterprise'];
    }

    getBranchOptions(branchId) {
        // Devuelve un mapa: turno -> [opciones]
        if (branchId === 'main') {
            return {
                3: [ { type: 'objection', label: '❌ "No me interesa"', title: 'Rechazo directo' }, { type: 'enterprise', label: '🏢 "Somos 500 empleados"', title: 'Empresa grande' } ],
                5: [ { type: 'low_budget', label: '💰 "Solo tengo $3,000"', title: 'Presupuesto insuficiente' }, { type: 'phase_skip', label: '⏭️ "Saltar qualification"', title: 'Fase salteable' } ],
                6: [ { type: 'channel_switch', label: '🔁 "Envíame por email"', title: 'Cambio WhatsApp→Email' }, { type: 'predictive', label: '🔮 "Mostrar predictivo"', title: 'Sistema predictivo' }, { type: 'brand_premium', label: '👑 "VIP premium"', title: 'Marca premium' } ],
                11: [ { type: 'emotions', label: '🧠 "Analizar emoción"', title: 'Panel emocional' } ]
            };
        }
        // Opciones derivadas por rama
        if (branchId.startsWith('low_budget')) {
            return {
                7: [ { type: 'discount', label: '🏷️ "¿Pueden aplicar descuento?"', title: 'Negociar descuento' } ]
            };
        }
        if (branchId.startsWith('enterprise')) {
            return {
                7: [ { type: 'compliance', label: '🏛️ "Necesitamos evaluación de seguridad"', title: 'Revisión de seguridad/compliance' } ]
            };
        }
        if (branchId.startsWith('objection')) {
            return {
                3: [ { type: 'reframe', label: '🎯 "Reencuadrar valor"', title: 'Reencuadre de valor' } ]
            };
        }
        // Por ahora, otras ramas no tienen derivadas
        return {};
    }

    // Compare mode
    toggleCompareMode() {
        this.compareMode = !this.compareMode;
        if (this.compareMode && !this.compareBranchId) {
            // Seleccionar una rama distinta de la actual si existe, o main
            const ids = Object.keys(this.branches).filter(id => id !== this.currentBranch);
            this.compareBranchId = ids[0] || 'main';
        }
        this.refreshUI(false);
        this.saveState();
    }

    setCompareBranch(branchId) {
        if (!this.branches[branchId]) return;
        this.compareBranchId = branchId;
        this.renderCompareConversation();
        this.saveState();
    }

    renderCompareConversation() {
        const wrapper = document.getElementById('conversation-compare');
        const col = document.getElementById('compare-column');
        const chat = document.getElementById('compare-chat');
        if (!wrapper || !col || !chat) return;
        if (!this.compareMode || !this.compareBranchId) {
            this.hideCompareColumn();
            return;
        }
        // Mostrar columna
        wrapper.classList.add('compare-active');
        col.style.display = 'block';
        col.setAttribute('aria-hidden', 'false');
        // Renderizar skeleton si vacío
        if (!chat.hasChildNodes() && this.chatSkeleton) {
            chat.innerHTML = this.chatSkeleton;
        }
        // Aplicar contenido de la rama a comparar
        this.renderConversationFor(chat, this.compareBranchId);
        // Restaurar scroll guardado para rama comparada
        this.restoreScrollFor(this.compareBranchId, chat);
        // Resaltar diferencias si está activo
        if (this.diffHighlight) {
            this.applyDiffHighlight(chat, this.currentBranch, this.compareBranchId);
        } else {
            this.clearDiffHighlight(chat);
        }
        this.updateDiffToggleUI();
        // Chips de contexto
        this.renderContextChips('compare-context-chips', this.compareBranchId);
    }

    hideCompareColumn() {
        const wrapper = document.getElementById('conversation-compare');
        const col = document.getElementById('compare-column');
        if (wrapper) wrapper.classList.remove('compare-active');
        if (col) {
            col.style.display = 'none';
            col.setAttribute('aria-hidden', 'true');
        }
    }

    updateCompareButtonUI() {
        const btn = document.getElementById('compare-btn');
        if (!btn) return;
        const totalBranches = Object.keys(this.branches).length;
        btn.disabled = totalBranches < 2; // Necesita al menos 2 ramas
        btn.textContent = this.compareMode ? '❌ Cerrar comparación' : '⚖️ Comparar';
        btn.classList.toggle('active', !!this.compareMode);
        this.updateDiffToggleUI();
    }

    // Diff highlight controls
    toggleDiffHighlight() {
        this.diffHighlight = !this.diffHighlight;
        if (this.compareMode && this.compareBranchId) {
            const chat = document.getElementById('compare-chat');
            if (this.diffHighlight) this.applyDiffHighlight(chat, this.currentBranch, this.compareBranchId);
            else this.clearDiffHighlight(chat);
        }
        this.updateDiffToggleUI();
        this.saveState();
    }
    updateDiffToggleUI() {
        const btn = document.getElementById('diff-toggle');
        if (!btn) return;
        btn.classList.toggle('active', !!this.diffHighlight);
        btn.textContent = this.diffHighlight ? 'Ocultar diferencias' : 'Resaltar diferencias';
        btn.disabled = !this.compareMode || !this.compareBranchId;
    }
    applyDiffHighlight(compareContainer, baseBranchId, compareBranchId) {
        const base = this.branches[baseBranchId];
        const cmp = this.branches[compareBranchId];
        if (!base || !cmp || !compareContainer) return;
        const nodes = compareContainer.querySelectorAll('[data-turn]');
        nodes.forEach((node) => {
            const turnNum = parseInt(node.dataset.turn);
            const idx = turnNum - 1;
            const baseMsg = base.messages[idx];
            const cmpMsg = cmp.messages[idx];
            const textDiff = !!(baseMsg && cmpMsg && baseMsg.text !== cmpMsg.text);
            const metaDiff = !!(baseMsg && cmpMsg && baseMsg.meta !== cmpMsg.meta);
            const added = !baseMsg && !!cmpMsg;
            const removed = !!baseMsg && !cmpMsg;
            const isDiff = textDiff || metaDiff || added || removed;
            node.classList.toggle('branch-diff', isDiff);
            node.classList.toggle('diff-text', textDiff);
            node.classList.toggle('diff-meta', metaDiff);
            node.classList.toggle('diff-added', added);
            node.classList.toggle('diff-removed', removed);
            // Indicadores +/-
            this.renderDiffIndicator(node, { added, removed, textDiff, metaDiff });
        });
    }
    clearDiffHighlight(compareContainer) {
        if (!compareContainer) return;
        compareContainer.querySelectorAll('[data-turn]').forEach(n => {
            n.classList.remove('branch-diff','diff-text','diff-meta','diff-added','diff-removed');
            const ind = n.querySelector('.diff-indicator');
            if (ind && ind.parentNode) ind.parentNode.removeChild(ind);
        });
    }

    renderDiffIndicator(node, flags) {
        let ind = node.querySelector('.diff-indicator');
        if (!ind) {
            ind = document.createElement('div');
            ind.className = 'diff-indicator';
            node.appendChild(ind);
        }
        ind.innerHTML = '';
        if (flags.added) ind.textContent = '+ añadido';
        else if (flags.removed) ind.textContent = '− removido';
        else if (flags.textDiff || flags.metaDiff) ind.textContent = '≠ diferente';
        else ind.textContent = '';
    }

    // Scroll persistence helpers
    persistScrollFor(branchId, container) {
        try {
            if (!branchId || !container) return;
            localStorage.setItem(`scroll:${branchId}`, String(container.scrollTop));
        } catch {}
    }
    restoreScrollFor(branchId, container) {
        try {
            if (!branchId || !container) return false;
            const v = localStorage.getItem(`scroll:${branchId}`);
            if (v !== null) {
                container.scrollTop = parseInt(v, 10) || 0;
                return true;
            }
        } catch {}
        return false;
    }

    renderConversationFor(container, branchId) {
        const branch = this.branches[branchId];
        if (!container || !branch) return;
        // Asegurar que tenga estructura
        if (!container.hasChildNodes() && this.chatSkeleton) {
            container.innerHTML = this.chatSkeleton;
        }
        const nodes = container.querySelectorAll('[data-turn]');
        nodes.forEach((node) => {
            const turnNum = parseInt(node.dataset.turn);
            const idx = turnNum - 1;
            if (branch.messages[idx]) {
                const textElement = node.querySelector('.message-text');
                const metaElement = node.querySelector('.message-meta');
                if (textElement) textElement.textContent = branch.messages[idx].text;
                if (metaElement && branch.messages[idx].meta) metaElement.textContent = branch.messages[idx].meta;
                if (branch.messages[idx].modified) node.classList.add('branch-modified');
                else node.classList.remove('branch-modified');
                // Badges
                this.renderMessageBadges(node, branch.messages[idx]);
            }
            // Nunca mostrar botones de bifurcación en panel de comparación
            const btns = node.querySelector('.branch-buttons');
            if (btns) { btns.innerHTML = ''; btns.style.display = 'none'; }
        });
        // Aplicar contexto visual y marcador
        this.applyBranchVisualContext(container, branch);
        this.applyFromTurnMarker(container, branch);
        // Tema
        container.dataset.theme = this.getBranchTheme(branchId);
    }

    // Compare chips (derecha)
    renderCompareChips() {
        const cont = document.getElementById('compare-chips');
        if (!cont) return;
        cont.innerHTML = '';
        Object.entries(this.branches).forEach(([id, br]) => {
            if (id === this.currentBranch) return; // no comparar contra la actual
            const chip = document.createElement('button');
            chip.className = 'branch-chip' + (id === this.compareBranchId ? ' active' : '');
            chip.textContent = (id === 'main') ? 'Ruta Principal' : br.name;
            chip.addEventListener('click', () => this.setCompareBranch(id));
            cont.appendChild(chip);
        });
    }

    // Escenarios
    toggleScenarioPanel() {
        const panel = document.getElementById('scenario-panel');
        if (!panel) return;
        const hidden = panel.getAttribute('aria-hidden') === 'true';
        panel.setAttribute('aria-hidden', hidden ? 'false' : 'true');
        panel.classList.toggle('open', hidden);
    }

    applyScenario(scenarioId) {
        // Mapear escenarios a ramas/overlays predefinidos
        if (scenarioId === 'low_budget') this.createBranch(5, 'low_budget');
        else if (scenarioId === 'enterprise') this.createBranch(3, 'enterprise');
        else if (scenarioId === 'objection') this.createBranch(2, 'objection');
        else if (scenarioId === 'loop') this.createBranch(3, 'loop');
        else if (scenarioId === 'urgency') this.createBranch(4, 'urgency');
        else if (scenarioId === 'language_en') this.createBranch(1, 'language_en');
        this.toggleScenarioPanel();
    }

    // Persistence
    saveState() {
        try {
            const state = {
                currentBranch: this.currentBranch,
                branchHistory: this.branchHistory,
                // Persistir solo datos mínimos de ramas creadas (no main skeleton)
                branches: Object.fromEntries(Object.entries(this.branches).map(([id, b]) => [id, {
                    name: b.name,
                    path: b.path,
                    messages: b.messages,
                    metrics: b.metrics,
                    fromTurn: b.fromTurn,
                    parentBranch: b.parentBranch || null,
                    context: b.context || { methodology: 'BANT', language: 'es', currency: 'MXN' }
                }]))
            };
            localStorage.setItem('branchManagerState_v2', JSON.stringify(state));
        } catch (e) { /* ignore */ }
    }

    loadState() {
        try {
            // Intentar v2 primero
            let state = null;
            const rawV2 = localStorage.getItem('branchManagerState_v2');
            if (rawV2) {
                state = JSON.parse(rawV2);
            } else {
                const rawV1 = localStorage.getItem('branchManagerState_v1');
                if (rawV1) state = JSON.parse(rawV1);
            }
            if (!state) return;
            if (state && state.branches) {
                // Asegurar main existe y sobrescribir solo si falta
                this.branches = { ...state.branches };
                if (!this.branches['main']) {
                    this.branches['main'] = {
                        name: 'Ruta Principal',
                        path: '📍 Ruta Principal',
                        messages: this.getMainMessages(),
                        metrics: { conversion: '100%', time: '10.5min', guidelines: '15', outcome: '✅ Demo' }
                    };
                }
                // Migración no destructiva: añadir badges/meta nuevos desde plantilla actual
                try {
                    const template = this.getMainMessages();
                    const main = this.branches['main'];
                    if (main && Array.isArray(main.messages) && Array.isArray(template)) {
                        for (let i = 0; i < Math.min(main.messages.length, template.length); i++) {
                            const savedMsg = main.messages[i] || {};
                            const tplMsg = template[i] || {};
                            // Añadir badges si la versión guardada no los tiene
                            if (!Array.isArray(savedMsg.badges) && Array.isArray(tplMsg.badges)) {
                                savedMsg.badges = tplMsg.badges.slice();
                            }
                            // Garantizar timing/meta en turno 6 (idx 5)
                            if (i === 5) {
                                const hasTimingBadge = Array.isArray(savedMsg.badges) && savedMsg.badges.includes('timing');
                                if (!hasTimingBadge) {
                                    savedMsg.badges = Array.isArray(savedMsg.badges) ? savedMsg.badges : [];
                                    savedMsg.badges.push('timing');
                                }
                                if (typeof savedMsg.meta !== 'string' || !savedMsg.meta.includes('Timing:')) {
                                    savedMsg.meta = tplMsg.meta || 'Timing: before_gov(100ms)+gov(800ms)+persist(50ms)=950ms';
                                }
                            }
                            main.messages[i] = savedMsg;
                        }
                    }
                } catch (_) { /* ignore migration errors */ }
                // Migración de contexto (si falta)
                Object.keys(this.branches).forEach((id) => {
                    if (!this.branches[id].context) {
                        this.branches[id].context = { methodology: 'BANT', language: 'es', currency: 'MXN' };
                    }
                });
            }
            if (state.currentBranch) this.currentBranch = state.currentBranch;
            if (state.branchHistory) this.branchHistory = state.branchHistory;
            if (typeof state.compareMode === 'boolean') this.compareMode = !!state.compareMode;
            if (typeof state.compareBranchId !== 'undefined') this.compareBranchId = state.compareBranchId || null;
            if (typeof state.diffHighlight === 'boolean') this.diffHighlight = state.diffHighlight;
        } catch (e) { /* ignore */ }
    }

    // Theming
    getBranchTheme(branchId) {
        if (!branchId || branchId === 'main') return 'main';
        if (branchId.startsWith('enterprise')) return 'enterprise';
        if (branchId.startsWith('low_budget')) return 'low_budget';
        if (branchId.startsWith('discount')) return 'discount';
        if (branchId.startsWith('objection')) return 'objection';
        if (branchId.startsWith('compliance')) return 'compliance';
        if (branchId.startsWith('reframe')) return 'reframe';
        if (branchId.startsWith('channel_switch')) return 'channel';
        if (branchId.startsWith('predictive')) return 'predictive';
        if (branchId.startsWith('phase_skip')) return 'phase_skip';
        if (branchId.startsWith('emotions')) return 'emotions';
        if (branchId.startsWith('brand_premium')) return 'brand_premium';
        return 'main';
    }
    
    createBranchedMessages(fromTurn, branchData) {
        // Base debe ser la conversación de la rama actual para no perder contexto
        const baseMessages = (this.branches[this.currentBranch] && this.branches[this.currentBranch].messages)
            ? this.branches[this.currentBranch].messages
            : this.getMainMessages();
        const branchedMessages = JSON.parse(JSON.stringify(baseMessages));
        
        // Aplicar cambios específicos de la rama
        Object.entries(branchData.changes).forEach(([turn, change]) => {
            const turnIndex = parseInt(turn) - 1;
            if (branchedMessages[turnIndex]) {
                branchedMessages[turnIndex] = {
                    ...branchedMessages[turnIndex],
                    ...change
                };
            }
        });
        
        return branchedMessages;
    }
    
    getMainMessages() {
        return [
            { text: "Hola, quisiera información sobre sus soluciones", meta: "Matching básico + Captura de intent", badges: ['phase(prospection)'] },
            { text: "¡Hola Juan! Encantado de ayudarte. ¿Cuántos empleados tiene tu empresa?", meta: "Detección metodología BANT", badges: ['phase(prospection)'] },
            { text: "Somos 30 empleados. ¿Cuánto cuesta?", meta: "ICP Actions + Condiciones JSONPath", badges: ['phase(prospection)'] },
            { text: "Para calcular el mejor precio, ¿cuál es tu presupuesto mensual aproximado?", meta: "Checkpoint creado (falta dato)", badges: ['checkpoint','phase(prospection)'] },
            { text: "Tengo unos $15,000 mensuales disponibles", meta: "Resume checkpoint + ICP validation", badges: ['icp'] },
            { text: "Perfecto. El plan para 30 usuarios es $12,000. Con tu volumen tienes 15% descuento: $10,200", meta: "Timing: before_gov(100ms)+gov(800ms)+persist(50ms)=950ms | requires_actions: fetch_exchange_rate(completed)", badges: ['calculations','timing','requires_actions','phase(presentation)'] },
            { text: "¿Qué beneficios ofrece?", meta: "Relación PRECEDES", badges: [] },
            { text: "Nuestro software te ayuda a: automatizar facturación, control de inventario, reportes en tiempo real...", meta: "Brand override", badges: [] },
            { text: "Hmm, me parece un poco caro...", meta: "Matching semántico", badges: [] },
            { text: "Te ahorrarás $2,500/mes en tiempo. Tu ROI es 82% en el primer año", meta: "Cálculo ROI", badges: [] },
            { text: "¿Esto entra en mi presupuesto que mencioné?", meta: "State lookup", badges: [] },
            { text: "Sí, con tu presupuesto de $15k/mes es viable. ¿Te gustaría una demo?", meta: "Loop detection", badges: [] },
            { text: "Sí, me gustaría agendar una demo", meta: "Cierre exitoso ✅", badges: [] }
        ];
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.branchManager = new BranchManager();
});

// Estilos adicionales para las ramas
const branchStyles = `
.branch-controls {
    background: #f7fafc;
    border-radius: 12px;
    padding: 20px;
    margin: 20px 0;
    border: 2px solid #e2e8f0;
}

.branch-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.current-path {
    font-weight: 600;
    color: #2d3748;
    font-size: 1.1em;
}

.reset-branches {
    background: #667eea;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9em;
    transition: background 0.2s;
}

.reset-branches:hover {
    background: #5a67d8;
}

.branch-buttons {
    margin-top: 12px; /* separar más de la burbuja principal */
    display: none; /* Se mostrará cuando haya opciones */
    gap: 8px; /* separación entre opciones */
    flex-wrap: wrap;
}

.branch-btn {
    background: rgba(255, 255, 255, 0.85);
    color: #4a5568;
    border: 1px solid rgba(45, 55, 72, 0.25); /* énfasis en bordes */
    padding: 6px 12px;
    border-radius: 14px; /* más sutil que una burbuja principal */
    cursor: pointer;
    font-size: 0.8em;
    transition: background 0.2s, box-shadow 0.2s, border-color 0.2s, color 0.2s;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.branch-btn:hover {
    background: #ffffff;
    border-color: rgba(45, 55, 72, 0.45);
    color: #2d3748;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.branch-modified {
    position: relative;
}

.branch-modified::before {
    content: '🌿';
    position: absolute;
    top: -5px;
    right: -5px;
    font-size: 0.8em;
    background: #48bb78;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.branch-indicator {
    position: absolute;
    top: 50%;
    right: -100px;
    transform: translateY(-50%);
    background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
    color: white;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 0.8em;
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 10;
    box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
}

.branch-indicator.show {
    opacity: 1;
    right: -80px;
}

.branch-arrow {
    font-size: 1.2em;
    margin-bottom: 2px;
}

.branch-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(72, 187, 120, 0.3);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    z-index: 1000;
    max-width: 300px;
}

.branch-notification.show {
    transform: translateX(0);
}

.notification-metrics {
    margin-top: 5px;
    font-size: 0.8em;
    opacity: 0.9;
}

.conversation-chat.switching {
    opacity: 0.5;
    transform: scale(0.98);
    transition: all 0.3s ease;
}

.conversation-chat.switched {
    opacity: 1;
    transform: scale(1);
    transition: all 0.3s ease;
}

/* Controles de rama */
.branch-actions {
    display: flex;
    gap: 8px;
}
.branch-action-btn {
    background: #edf2f7;
    color: #2d3748;
    border: 1px solid #e2e8f0;
    padding: 6px 10px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.85em;
}
.branch-action-btn:hover { background: #e2e8f0; }
.branch-action-btn.active { background: #667eea; color: #fff; border-color: #667eea; }

/* Layout comparación */
.conversation-compare {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
}
.conversation-compare.compare-active {
    grid-template-columns: 1fr 1fr;
}
.chat-column { width: 100%; }
#compare-column { display: none; }

/* Compare header */
.compare-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 8px;
}
.compare-title { font-weight: 600; color: #4a5568; }
.branch-action-btn.active { background: #2b6cb0; color: #fff; border-color: #2b6cb0; }

/* Diff highlight */
.branch-diff .message-bubble {
    background: #fffaf0 !important;
    box-shadow: 0 0 0 2px #fbd38d inset;
}
.diff-indicator { font-size: 11px; color: #b7791f; margin-top: 2px; }
.diff-text .message-text { text-decoration: underline dotted #b7791f; }
.diff-meta .message-meta { border-bottom: 1px dotted #b7791f; }
.diff-added .message-bubble { box-shadow: 0 0 0 2px #9ae6b4 inset; background: #f0fff4 !important; }
.diff-removed .message-bubble { box-shadow: 0 0 0 2px #feb2b2 inset; background: #fff5f5 !important; }

/* Badges */
.message-badges { display: flex; gap: 6px; margin-bottom: 4px; flex-wrap: wrap; }
.message-badge { font-size: 11px; padding: 2px 6px; border-radius: 12px; background: #edf2f7; color: #2d3748; }
.message-badge.dynamic { background: #e6fffa; color: #234e52; }

/* Context chips - Improved design */
.context-chips { 
    display: flex; 
    gap: 6px; 
    margin: 12px 0; 
    flex-wrap: wrap; 
    align-items: center;
}
.context-chip { 
    font-size: 11px; 
    font-weight: 500;
    padding: 4px 10px; 
    border-radius: 16px; 
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #ffffff;
    border: none;
    box-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    line-height: 1;
}

/* Scenario sidebar */
.scenario-panel {
    position: fixed;
    right: 16px;
    top: 120px;
    width: 280px;
    max-height: 70vh;
    overflow: auto;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
    padding: 12px;
    transform: translateX(120%);
    transition: transform 0.25s ease;
    z-index: 10;
}
.scenario-panel.open { transform: translateX(0); }
.scenario-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.scenario-list { display: grid; gap: 8px; }
.scenario-item {
    text-align: left;
    background: #f7fafc;
    border: 1px solid #e2e8f0;
    color: #2d3748;
    padding: 8px 10px;
    border-radius: 8px;
    cursor: pointer;
}
.scenario-item:hover { background: #edf2f7; }

/* Tema por rama (acento de burbuja) */
.conversation-chat[data-theme="main"] .message-bubble { border-left: 4px solid #A0AEC0; }
.conversation-chat[data-theme="enterprise"] .message-bubble { border-left: 4px solid #6B46C1; }
.conversation-chat[data-theme="low_budget"] .message-bubble { border-left: 4px solid #B7791F; }
.conversation-chat[data-theme="discount"] .message-bubble { border-left: 4px solid #D53F8C; }
.conversation-chat[data-theme="objection"] .message-bubble { border-left: 4px solid #E53E3E; }
.conversation-chat[data-theme="compliance"] .message-bubble { border-left: 4px solid #2B6CB0; }
.conversation-chat[data-theme="reframe"] .message-bubble { border-left: 4px solid #38A169; }
.conversation-chat[data-theme="channel"] .message-bubble { border-left: 4px solid #319795; }
.conversation-chat[data-theme="predictive"] .message-bubble { border-left: 4px solid #805AD5; }
.conversation-chat[data-theme="phase_skip"] .message-bubble { border-left: 4px solid #DD6B20; }
.conversation-chat[data-theme="emotions"] .message-bubble { border-left: 4px solid #D69E2E; }
.conversation-chat[data-theme="brand_premium"] .message-bubble { border-left: 4px solid #9F7AEA; }

/* Marcador sutil del fromTurn */
.chat-message.from-turn .message-bubble {
    box-shadow: 0 0 0 2px rgba(102,126,234,0.35);
    position: relative;
}
.chat-message.from-turn .message-bubble::after {
    content: '↘ Rama';
    position: absolute;
    top: -10px;
    right: 8px;
    background: #edf2f7;
    color: #4a5568;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 1px 6px;
    font-size: 10px;
}


/* Atenuar turnos previos al punto de bifurcación */
.pre-branch-dim {
    opacity: 0.5;
    filter: grayscale(0.2);
}

/* Timing hint (timeline visual) */
.timing-hint {
    font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace;
    border-left: 3px dotted #718096;
    background: #f7fafc;
    padding: 6px 8px;
    margin-top: 6px;
    font-size: 11px;
    color: #2d3748;
    border-radius: 4px;
    line-height: 1.4;
}

/* Colores de tendencia */
.metric-trend.up { color: #38a169; }
.metric-trend.down { color: #e53e3e; }
.metric-trend.stable { color: #718096; }

/* Validation error styling */
.validation-error {
    background: #fed7d7;
    color: #c53030;
    padding: 6px 10px;
    border-radius: 6px;
    font-size: 11px;
    margin-top: 6px;
    border-left: 3px solid #e53e3e;
    font-weight: 500;
}

/* Mobile optimizations */
@media (max-width: 768px) {
    .container {
        padding: 12px;
        margin: 0;
    }
    
    .branch-controls {
        padding: 12px;
        margin: 12px 0;
        border-radius: 8px;
    }
    
    .branch-info {
        flex-direction: column;
        gap: 8px;
        align-items: flex-start;
    }
    
    .branch-actions {
        width: 100%;
        justify-content: space-between;
    }
    
    .live-metrics {
        grid-template-columns: 1fr 1fr;
        gap: 8px;
    }
    
    .metric-item {
        padding: 8px;
        text-align: center;
    }
    
    .metric-label {
        font-size: 11px;
    }
    
    .metric-value {
        font-size: 14px;
    }
    
    .context-chips {
        margin: 8px 0;
    }
    
    .context-chip {
        font-size: 10px;
        padding: 3px 8px;
    }
    
    
    .conversation-chat {
        padding: 8px;
    }
    
    .chat-message {
        margin-bottom: 12px;
    }
    
    .message-bubble {
        padding: 10px 12px;
        font-size: 14px;
        line-height: 1.4;
    }
    
    .message-meta {
        font-size: 11px;
        margin-top: 4px;
    }
    
    .branch-buttons {
        gap: 6px;
        margin-top: 8px;
    }
    
    .branch-btn {
        font-size: 11px;
        padding: 6px 10px;
    }
    
    .scenario-panel {
        width: 90vw;
        right: 5vw;
        top: 80px;
        max-height: 60vh;
    }
    
    .message-badges {
        gap: 4px;
        margin-bottom: 6px;
    }
    
    .message-badge {
        font-size: 10px;
        padding: 2px 5px;
    }
}
`;

// Inyectar estilos
const styleSheet = document.createElement('style');
styleSheet.textContent = branchStyles;
document.head.appendChild(styleSheet);
