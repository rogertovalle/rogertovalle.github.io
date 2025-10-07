#!/usr/bin/env python3
"""
Script para generar embedded-content.js desde archivos HTML
Solo incluye architect y pm (no dev)
"""
import os
import json
from pathlib import Path

# Configuración
BASE_DIR = Path(__file__).parent / "data"
OUTPUT_FILE = Path(__file__).parent / "embedded-content.js"
ROLES = ["architect", "pm"]  # Solo estos roles
TURNS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]  # Turnos a incluir (incluye 2)

def escape_js_string(content):
    """Escapa contenido HTML para JavaScript template literal"""
    # Escapar backticks y ${} 
    content = content.replace('\\', '\\\\')
    content = content.replace('`', '\\`')
    content = content.replace('${', '\\${')
    return content

def generate_embedded_content():
    """Genera el archivo embedded-content.js"""
    output = []
    output.append("// ==================== EMBEDDED CONTENT ====================")
    output.append("// Auto-generated from data/ folder - Only architect and pm views")
    output.append("")
    output.append("window.EMBEDDED_CONTENT = {")
    
    for turn_num in TURNS:
        turn_dir = BASE_DIR / f"turn{turn_num}"
        if not turn_dir.exists():
            print(f"⚠️  Turno {turn_num}: Directorio no existe, usando placeholder")
            output.append(f"    {turn_num}: {{")
            output.append(f"        1: {{")
            output.append(f"            architect: `<div class='step-section'><h3>⚠️ Contenido pendiente</h3><p>Turno {turn_num} - Step 1</p></div>`,")
            output.append(f"            pm: `<div class='step-section'><h3>⚠️ Contenido pendiente</h3><p>Turno {turn_num} - Step 1</p></div>`")
            output.append(f"        }}")
            output.append(f"    }},")
            continue
        
        # Determinar número de steps
        step_files = list(turn_dir.glob("step*-architect.html"))
        num_steps = len(step_files)
        
        if num_steps == 0:
            print(f"⚠️  Turno {turn_num}: Sin archivos, usando placeholder")
            continue
        
        output.append(f"    {turn_num}: {{")
        
        for step_num in range(1, num_steps + 1):
            output.append(f"        {step_num}: {{")
            
            for role in ROLES:
                file_path = turn_dir / f"step{step_num}-{role}.html"
                
                if file_path.exists():
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read().strip()
                        escaped = escape_js_string(content)
                        output.append(f"            {role}: `{escaped}`{',' if role != ROLES[-1] else ''}")
                else:
                    print(f"⚠️  Falta: {file_path}")
                    output.append(f"            {role}: `<div class='step-section'><h3>⚠️ Archivo faltante</h3></div>`{',' if role != ROLES[-1] else ''}")
            
            output.append(f"        }}{',' if step_num < num_steps else ''}")
        
        output.append(f"    }}{',' if turn_num != TURNS[-1] else ''}")
    
    output.append("};")
    
    # Escribir archivo
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write('\n'.join(output))
    
    print(f"✅ Generado: {OUTPUT_FILE}")
    print(f"📊 Turnos procesados: {len(TURNS)}")

if __name__ == "__main__":
    generate_embedded_content()
