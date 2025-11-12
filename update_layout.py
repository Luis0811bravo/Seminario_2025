import re

def update_ponencia_layout(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Patrón para encontrar las ponencias (no los eventos generales)
    pattern = r'(<div class="flex items-start space-x-6 bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">)\s*<div class="text-center w-24 flex-shrink-0">\s*<span class="text-2xl font-bold text-blue-600">([^<]+)</span>\s*<span class="text-gray-500">([^<]+)</span>\s*</div>\s*<div class="flex-1">\s*<h3 class="text-xl font-bold text-gray-800 mb-2">([^<]+)</h3>\s*<p class="text-gray-500 text-sm mb-3">([^<]+)</p>\s*<span class="text-sm font-medium text-blue-600 bg-blue-100 py-1 px-3 rounded-full">([^<]+)</span>\s*</div>\s*<div class="flex-shrink-0">\s*<img class="h-20 w-20 rounded-full object-cover shadow-md" src="([^"]+)" alt="([^"]+)">\s*</div>'
    
    def replace_ponencia(match):
        start_tag = match.group(1)
        hora_inicio = match.group(2)
        hora_fin = match.group(3)
        titulo = match.group(4)
        ponente_info = match.group(5)
        tipo = match.group(6)
        img_src = match.group(7)
        img_alt = match.group(8)
        
        return f'''{start_tag}
                        <div class="flex-shrink-0">
                            <img class="h-20 w-20 rounded-full object-cover shadow-md" src="{img_src}" alt="{img_alt}">
                        </div>
                        <div class="flex-1">
                            <div class="flex items-center justify-between mb-2">
                                <h3 class="text-xl font-bold text-gray-800">{titulo}</h3>
                                <div class="text-right ml-4 flex-shrink-0">
                                    <span class="text-lg font-bold text-blue-600">{hora_inicio} - {hora_fin}</span>
                                </div>
                            </div>
                            <p class="text-gray-500 text-sm mb-3">{ponente_info}</p>
                            <span class="text-sm font-medium text-blue-600 bg-blue-100 py-1 px-3 rounded-full">{tipo}</span>
                        </div>'''
    
    updated_content = re.sub(pattern, replace_ponencia, content, flags=re.DOTALL)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(updated_content)
    
    print(f"Actualizado: {file_path}")

# Actualizar ambos archivos
update_ponencia_layout('dia1.html')
update_ponencia_layout('dia2.html')

print("¡Actualización completada!")