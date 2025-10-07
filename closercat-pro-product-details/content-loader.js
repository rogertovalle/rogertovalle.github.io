// ==================== CONTENT LOADER ====================
// Loads HTML content dynamically for each step/role

class ContentLoader {
    static async loadStepContent(turnId, stepNum, role) {
        // Branch-aware overlay: prefer branch-specific embedded content if available
        try {
            const bm = window.branchManager;
            if (bm && bm.currentBranch && bm.currentBranch !== 'main') {
                const br = bm.branches && bm.branches[bm.currentBranch];
                const branchType = ((br && br.baseType) || (bm.currentBranch.split('_')[0] || '')).toLowerCase();
                if (branchType && window.BRANCH_EMBEDDED_CONTENT &&
                    window.BRANCH_EMBEDDED_CONTENT[branchType] &&
                    window.BRANCH_EMBEDDED_CONTENT[branchType][turnId] &&
                    window.BRANCH_EMBEDDED_CONTENT[branchType][turnId][stepNum] &&
                    window.BRANCH_EMBEDDED_CONTENT[branchType][turnId][stepNum][role]) {
                    return window.BRANCH_EMBEDDED_CONTENT[branchType][turnId][stepNum][role];
                }
            }
        } catch (_) { /* ignore overlay errors */ }
        
        // Check if content is embedded first
        if (window.EMBEDDED_CONTENT && 
            window.EMBEDDED_CONTENT[turnId] && 
            window.EMBEDDED_CONTENT[turnId][stepNum] &&
            window.EMBEDDED_CONTENT[turnId][stepNum][role]) {
            return window.EMBEDDED_CONTENT[turnId][stepNum][role];
        }
        
        const config = window.TURN_CONFIG[turnId];
        if (!config) {
            console.error(`Turn ${turnId} not found`);
            return '<p>Error: Turn not found</p>';
        }
        
        const filename = `step${stepNum}-${role}.html`;
        const path = `${config.dataPath}${filename}`;
        
        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const html = await response.text();
            return html;
        } catch (error) {
            // Si fetch falla (file://), intentar con XMLHttpRequest
            return new Promise((resolve) => {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', path, true);
                xhr.onload = function() {
                    if (xhr.status === 200 || xhr.status === 0) {
                        resolve(xhr.responseText);
                    } else {
                        resolve(`<div class="step-section">
                            <h3>⚠️ Contenido no disponible</h3>
                            <p>No se pudo cargar: ${filename}</p>
                            <p style="font-size: 0.9em; color: #718096;">Para ver el contenido, abre este archivo en un servidor web local o usa el contenido embebido.</p>
                        </div>`);
                    }
                };
                xhr.onerror = function() {
                    resolve(`<div class="step-section">
                        <h3>⚠️ Error de carga (CORS)</h3>
                        <p>Este step no se puede cargar desde file://</p>
                        <p style="font-size: 0.9em; color: #718096;">Solución: Usa un servidor local (ej: <code>python -m http.server 8000</code>)</p>
                    </div>`);
                };
                xhr.send();
            });
        }
    }
    
    static async preloadTurn(turnId) {
        const config = window.TURN_CONFIG[turnId];
        if (!config) return;
        
        const roles = ['dev', 'architect', 'pm'];
        const promises = [];
        
        for (let step = 1; step <= config.totalSteps; step++) {
            for (const role of roles) {
                promises.push(this.loadStepContent(turnId, step, role));
            }
        }
        
        return await Promise.all(promises);
    }
}

window.ContentLoader = ContentLoader;
