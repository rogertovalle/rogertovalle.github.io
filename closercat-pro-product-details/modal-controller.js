// ==================== TURN MODAL CONTROLLER ====================

class TurnModal {
    constructor() {
        this.currentTurn = null;
        this.currentStep = 0;
        this.activeRole = 'pm'; // dev | architect | pm (for demo: default to PM)
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        this.createModalHTML();
        this.attachEventListeners();
        this.setupKeyboardShortcuts();
    }
    
    createModalHTML() {
        const overlay = document.createElement('div');
        overlay.className = 'turn-modal-overlay';
        overlay.id = 'turnModal';
        overlay.innerHTML = `
            <div class="turn-modal">
                <div class="modal-header">
                    <div class="modal-header-content">
                        <h2 class="modal-title" id="modalTitle"></h2>
                        <span class="modal-turn-number" id="modalTurnNumber"></span>
                    </div>
                    <button class="modal-close" id="modalClose" title="Cerrar (ESC)">×</button>
                </div>
                
                
                <div class="modal-content" id="modalContent">
                    <!-- Dynamic content here -->
                </div>
                
                <div class="modal-footer">
                    <div class="nav-buttons">
                        <button class="nav-btn prev" id="prevStep">←</button>
                        <button class="nav-btn next" id="nextStep">→</button>
                    </div>
                    
                    <div class="nav-steps" id="stepIndicators">
                        <!-- Dynamic step indicators -->
                    </div>
                    
                    <div class="step-counter">
                        <span id="currentStepNum">1</span> / <span id="totalSteps">8</span>
                    </div>
                </div>
            </div>
            
            <div class="keyboard-hint" id="keyboardHint">
                <kbd>←</kbd> <kbd>→</kbd> para navegar | <kbd>ESC</kbd> para cerrar
            </div>
        `;
        
        document.body.appendChild(overlay);
    }
    
    attachEventListeners() {
        // Close button
        document.getElementById('modalClose').addEventListener('click', () => this.close());
        
        // Click overlay to close
        document.getElementById('turnModal').addEventListener('click', (e) => {
            if (e.target.id === 'turnModal') this.close();
        });
        
        // Role buttons (delegated, will be added dynamically)
        document.getElementById('modalContent').addEventListener('click', (e) => {
            const roleBtn = e.target.closest('.role-btn');
            if (roleBtn) {
                const role = roleBtn.dataset.role;
                this.setRole(role);
                this.nextStep(); // Auto-advance after selecting role
            }
        });
        
        // Navigation buttons
        document.getElementById('prevStep').addEventListener('click', () => this.prevStep());
        document.getElementById('nextStep').addEventListener('click', () => this.nextStep());
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;
            
            switch(e.key) {
                case 'Escape':
                    this.close();
                    break;
                case 'ArrowLeft':
                    this.prevStep();
                    break;
                case 'ArrowRight':
                    this.nextStep();
                    break;
                case '1':
                    // dev view disabled in demo; keep PM
                    this.setRole('pm');
                    break;
                case '2':
                    // architect view hidden in demo; keep PM
                    this.setRole('pm');
                    break;
                case '3':
                    this.setRole('pm');
                    break;
            }
        });
        
        // Show keyboard hint on first open
        let hintShown = sessionStorage.getItem('keyboardHintShown');
        if (!hintShown) {
            setTimeout(() => {
                const hint = document.getElementById('keyboardHint');
                hint.classList.add('show');
                setTimeout(() => hint.classList.remove('show'), 3000);
                sessionStorage.setItem('keyboardHintShown', 'true');
            }, 1000);
        }
    }
    
    async open(turnId) {
        const config = window.TURN_CONFIG[turnId];
        if (!config) {
            console.error('Turn not found:', turnId);
            return;
        }
        
        this.currentTurn = config;
        this.currentTurnId = turnId;
        this.currentStep = 0;
        this.isOpen = true;
        
        // Update header (branch-aware)
        let branchLabel = '';
        try {
            const bm = window.branchManager;
            if (bm && bm.currentBranch && bm.currentBranch !== 'main') {
                const br = bm.branches[bm.currentBranch];
                if (br && br.name) branchLabel = ` — Rama: ${br.name}`;
            }
        } catch (e) { /* ignore */ }
        document.getElementById('modalTitle').textContent = config.title + branchLabel;
        document.getElementById('modalTurnNumber').textContent = `Turno ${config.id} de 13`;
        
        // Generate structure
        await this.generateContent();
        this.generateStepIndicators();
        await this.showStep(0);
        
        // Show modal
        const overlay = document.getElementById('turnModal');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Show keyboard hint
        setTimeout(() => {
            const hint = document.getElementById('keyboardHint');
            hint.classList.add('show');
            setTimeout(() => hint.classList.remove('show'), 3000);
        }, 500);
    }
    
    close() {
        this.isOpen = false;
        const overlay = document.getElementById('turnModal');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    setRole(role) {
        // Coerce hidden roles to PM for this demo
        if (role === 'architect' || role === 'dev') {
            role = 'pm';
        }
        this.activeRole = role;
        
        // Update button states
        document.querySelectorAll('.role-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.role === role);
        });
        
        // Update content visibility
        document.querySelectorAll('.role-content').forEach(content => {
            content.classList.toggle('active', content.dataset.role === role);
        });
    }
    
    async generateContent() {
        const container = document.getElementById('modalContent');
        container.innerHTML = '';
        
        // Step 0: Role selection
        const roleStep = document.createElement('div');
        roleStep.className = 'step-content active';
        roleStep.dataset.step = '0';
        roleStep.innerHTML = `
            <div class="role-selection-step">
                <h2>¿Cómo quieres ver este turno?</h2>
                <p>Selecciona tu perfil para ver contenido relevante para ti</p>
                <div class="role-buttons-grid" style="grid-template-columns: repeat(1, 1fr);">
                    <!-- Arquitecto oculto en esta demo -->
                    <button class="role-btn" data-role="pm">
                        <div class="icon">📊</div>
                        <div>Product Manager</div>
                        <small style="opacity:0.7;">Negocio, Valor, Capacidades</small>
                    </button>
                </div>
            </div>
        `;
        container.appendChild(roleStep);
        
        // Steps 1-N: Content steps
        for (let stepNum = 1; stepNum <= this.currentTurn.totalSteps; stepNum++) {
            const stepDiv = document.createElement('div');
            stepDiv.className = 'step-content';
            stepDiv.dataset.step = stepNum;
            
            // Generate content for each role (only architect and pm)
            for (const role of ['architect', 'pm']) {
                const roleContent = document.createElement('div');
                roleContent.className = `role-content ${role === this.activeRole ? 'active' : ''}`;
                roleContent.dataset.role = role;
                roleContent.innerHTML = '<p class="loading-dots">Cargando</p>';
                stepDiv.appendChild(roleContent);
            }
            
            container.appendChild(stepDiv);
        }
    }
    
    generateStepIndicators() {
        const container = document.getElementById('stepIndicators');
        container.innerHTML = '';
        
        // +1 para incluir step 0 (role selection)
        const totalStepsWithRole = this.currentTurn.totalSteps + 1;
        
        for (let i = 0; i < totalStepsWithRole; i++) {
            const indicator = document.createElement('div');
            indicator.className = `step-indicator ${i === 0 ? 'active' : ''}`;
            indicator.dataset.step = i;
            indicator.addEventListener('click', () => this.goToStep(i));
            indicator.title = i === 0 ? 'Selección de rol' : `Paso ${i}`;
            container.appendChild(indicator);
        }
        
        document.getElementById('totalSteps').textContent = totalStepsWithRole;
    }
    
    async showStep(stepIndex) {
        const steps = document.querySelectorAll('.step-content');
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
        });
        
        // Load content for current step if not loaded (skip step 0 = role selection)
        if (stepIndex > 0) {
            const currentStepEl = steps[stepIndex];
            if (currentStepEl) {
                const roleContents = currentStepEl.querySelectorAll('.role-content');
                for (const roleContent of roleContents) {
                    const role = roleContent.dataset.role;
                    // Solo cargar el contenido del rol activo (oculta arquitecto)
                    if (role !== this.activeRole) continue;
                    if (roleContent.innerHTML.includes('loading-dots')) {
                        const html = await window.ContentLoader.loadStepContent(
                            this.currentTurnId,
                            stepIndex, // stepIndex ya es 1-based después del step 0
                            role
                        );
                        roleContent.innerHTML = html;
                    }
                }
            }
        }
        
        // Update indicators
        document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
            indicator.classList.toggle('active', index === stepIndex);
        });
        
        // Update counter
        document.getElementById('currentStepNum').textContent = stepIndex + 1;
        
        // Update buttons
        const totalStepsWithRole = this.currentTurn.totalSteps + 1;
        document.getElementById('prevStep').disabled = stepIndex === 0;
        document.getElementById('nextStep').disabled = stepIndex === totalStepsWithRole - 1;
        
        // Scroll to top
        document.getElementById('modalContent').scrollTop = 0;
        
        // Re-render Mermaid diagrams if present
        if (window.mermaid && stepIndex > 0) {
            setTimeout(() => {
                const unprocessed = document.querySelectorAll('.step-content.active .mermaid:not([data-processed])');
                if (unprocessed.length > 0) {
                    mermaid.init(undefined, unprocessed);
                }
            }, 100);
        }
    }
    
    nextStep() {
        const totalStepsWithRole = this.currentTurn.totalSteps + 1;
        if (this.currentStep < totalStepsWithRole - 1) {
            this.currentStep++;
            this.showStep(this.currentStep);
        }
    }
    
    prevStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.showStep(this.currentStep);
        }
    }
    
    goToStep(stepIndex) {
        this.currentStep = stepIndex;
        this.showStep(stepIndex);
    }
}

// Initialize modal controller when DOM is ready (expose globally)
document.addEventListener('DOMContentLoaded', () => {
    window.turnModal = new TurnModal();
});

// Global function to open modal (called from timeline)
function openTurnModal(turnId) {
    try {
        // Solo permitir modal en la conversación principal
        const bm = window.branchManager;
        const isMain = !bm || bm.currentBranch === 'main';
        if (!isMain) return; // bloquear en ramas
    } catch (e) { /* ignore and continue */ }
    if (window.turnModal && typeof window.turnModal.open === 'function') {
        window.turnModal.open(turnId);
    } else {
        console.error('TurnModal not initialized or open() missing');
    }
}
