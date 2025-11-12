import re

def update_ponencias_with_titles(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Patrón para encontrar ponencias con información de horario y ponente
    pattern = r'(<div class="flex-1">)\s*<div class="flex items-center justify-between mb-2">\s*<h3 class="text-(?:xl|lg) font-bold text-gray-800">([^<]+)</h3>\s*<div class="text-right ml-4 flex-shrink-0">\s*(?:<span class="text-lg font-bold text-(?:blue|green)-600">([^<]+)</span>|<div class="bg-(?:blue|green)-50 px-3 py-1 rounded-lg">[^<]*<span class="text-sm font-bold text-(?:blue|green)-600">([^<]+)</span>[^<]*<span class="text-sm font-bold text-(?:blue|green)-600">([^<]+)</span>[^<]*</div>)\s*</div>\s*</div>\s*<p class="text-gray-500 text-sm mb-3">Ponente: <span class="font-semibold text-gray-700">([^<]+)</span></p>\s*<span class="text-sm font-medium text-(?:blue|green)-600 bg-(?:blue|green)-100 py-1 px-3 rounded-full">(Doctorado|Maestría)</span>'
    
    def replace_ponencia(match):
        start_tag = match.group(1)
        titulo = match.group(2)
        horario_simple = match.group(3)
        hora_inicio = match.group(4)
        hora_fin = match.group(5)
        ponente = match.group(6)
        tipo = match.group(7)
        
        # Determinar el título académico basado en el tipo
        if tipo == "Doctorado":
            titulo_academico = "MC."
            color = "blue"
        else:  # Maestría
            titulo_academico = "Lic."
            color = "blue"
        
        # Formatear horario
        if horario_simple:
            # Formato simple, convertir a formato con cajas
            horarios = horario_simple.split(' - ')
            if len(horarios) == 2:
                horario_formatted = f'''<div class="bg-{color}-50 px-3 py-1 rounded-lg">
                                        <span class="text-sm font-bold text-{color}-600">{horarios[0]}</span>
                                        <span class="text-xs text-{color}-500"> - </span>
                                        <span class="text-sm font-bold text-{color}-600">{horarios[1]}</span>
                                    </div>'''
            else:
                horario_formatted = f'<span class="text-lg font-bold text-{color}-600">{horario_simple}</span>'
        else:
            # Ya está en formato de cajas
            horario_formatted = f'''<div class="bg-{color}-50 px-3 py-1 rounded-lg">
                                        <span class="text-sm font-bold text-{color}-600">{hora_inicio}</span>
                                        <span class="text-xs text-{color}-500"> - </span>
                                        <span class="text-sm font-bold text-{color}-600">{hora_fin}</span>
                                    </div>'''
        
        return f'''{start_tag}
                            <div class="flex items-center justify-between mb-2">
                                <h3 class="text-lg font-bold text-gray-800">{titulo}</h3>
                                <div class="text-right ml-4 flex-shrink-0">
                                    {horario_formatted}
                                </div>
                            </div>
                            <p class="text-gray-500 text-sm mb-3">Ponente: <span class="font-semibold text-gray-700">{titulo_academico} {ponente}</span></p>
                            <span class="text-sm font-medium text-{color}-600 bg-{color}-100 py-1 px-3 rounded-full">{tipo}</span>'''
    
    updated_content = re.sub(pattern, replace_ponencia, content, flags=re.DOTALL)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(updated_content)
    
    print(f"Actualizado: {file_path}")

# Actualizar ambos archivos
update_ponencias_with_titles('dia1.html')
update_ponencias_with_titles('dia2.html')

print("¡Actualización de ponencias completada!")