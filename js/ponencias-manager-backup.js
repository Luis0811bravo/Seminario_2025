// Módulo para manejar las ponencias dinámicamente - Versión Optimizada
class PonenciasManager {
    constructor() {
        this.ponenciasData = null;
        this.cache = new Map();
        this.init();
    }

    /**
     * Inicializa el manager
     */
    async init() {
        try {
            await this.cargarPonencias();
            this.detectarPaginaYRenderizar();
        } catch (error) {
            console.error('Error al inicializar PonenciasManager:', error);
        }
    }

    /**
     * Carga las ponencias desde el archivo JSON con cache
     */
    async cargarPonencias() {
        if (this.ponenciasData) return this.ponenciasData;
        
        try {
            const response = await fetch('js/ponencias.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.ponenciasData = await response.json();
            console.log('Ponencias cargadas exitosamente:', this.ponenciasData);
            return this.ponenciasData;
        } catch (error) {
            console.error('Error al cargar las ponencias:', error);
            throw error;
        }
    }

    /**
     * Detecta la página actual y renderiza las ponencias correspondientes
     */
    detectarPaginaYRenderizar() {
        const currentPage = window.location.pathname.toLowerCase();
        
        if (currentPage.includes('dia1.html')) {
            this.renderizarPonencias('dia1');
        } else if (currentPage.includes('dia2.html')) {
            this.renderizarPonencias('dia2');
        } else {
            console.log('Página no reconocida para renderizar ponencias');
        }
    }

    /**
     * Genera el HTML para una ponencia optimizado
     */
    generarPonenciaHTML(ponencia) {
        const cacheKey = `${ponencia.id}-${ponencia.tipo}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        let html = '';

        switch (ponencia.tipo) {
            case 'receso':
                html = this.generarRecesoHTML(ponencia);
                break;
            case 'almuerzo':
                html = this.generarAlmuerzoHTML(ponencia);
                break;
            case 'evento':
                html = this.generarEventoHTML(ponencia);
                break;
            case 'clausura':
                html = this.generarClausuraHTML(ponencia);
                break;
            case 'ponencia':
                html = this.generarPonenciaCardHTML(ponencia);
                break;
            case 'taller':
                html = this.generarTallerHTML(ponencia);
                break;
            case 'cartel':
                html = this.generarCartelHTML(ponencia);
                break;
            default:
                console.warn('Tipo de ponencia no reconocido:', ponencia.tipo);
                html = this.generarPonenciaCardHTML(ponencia);
        }

        this.cache.set(cacheKey, html);
        return html;
    }

    /**
     * Genera HTML para receso
     */
    generarRecesoHTML(ponencia) {
        return `
            <div class="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 bg-white p-6 rounded-lg shadow-lg border-l-4 border-yellow-500">
                <div class="text-center sm:w-24 flex-shrink-0">
                    <span class="text-2xl font-bold text-yellow-600">${ponencia.horario.split(' - ')[0]}</span>
                    <span class="block sm:inline text-gray-500">${ponencia.horario.split(' - ')[1]}</span>
                </div>
                <div class="flex-1">
                    <h3 class="text-xl font-bold text-gray-800 mb-2">${ponencia.titulo}</h3>
                    <span class="text-sm font-medium text-yellow-600 bg-yellow-100 py-1 px-3 rounded-full">Receso</span>
                </div>
                <div class="flex-shrink-0">
                    <div class="h-28 w-28 rounded-full bg-yellow-100 flex items-center justify-center mx-auto sm:mx-0">
                        <span class="text-yellow-600 text-2xl">☕</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Genera HTML para almuerzo
     */
    generarAlmuerzoHTML(ponencia) {
        return `
            <div class="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 bg-white p-6 rounded-lg shadow-lg border-l-4 border-orange-500">
                <div class="text-center sm:w-24 flex-shrink-0">
                    <span class="text-2xl font-bold text-orange-600">${ponencia.horario.split(' - ')[0]}</span>
                    <span class="block sm:inline text-gray-500">${ponencia.horario.split(' - ')[1]}</span>
                </div>
                <div class="flex-1">
                    <h3 class="text-xl font-bold text-gray-800 mb-2">${ponencia.titulo}</h3>
                    <span class="text-sm font-medium text-orange-600 bg-orange-100 py-1 px-3 rounded-full">Almuerzo</span>
                </div>
                <div class="flex-shrink-0">
                    <div class="h-28 w-28 rounded-full bg-orange-100 flex items-center justify-center mx-auto sm:mx-0">
                        <span class="text-orange-600 text-2xl">🍽️</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Genera HTML para eventos generales
     */
    generarEventoHTML(ponencia) {
        return `
            <div class="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 bg-white p-6 rounded-lg shadow-lg border-l-4 border-gray-400">
                <div class="text-center sm:w-24 flex-shrink-0">
                    <span class="text-2xl font-bold text-gray-800">${ponencia.horario.split(' - ')[0]}</span>
                    <span class="block sm:inline text-gray-500">${ponencia.horario.split(' - ')[1]}</span>
                </div>
                <div class="flex-1">
                    <h3 class="text-xl font-bold text-gray-800 mb-1">${ponencia.titulo}</h3>
                    <span class="text-sm font-medium text-gray-500 bg-gray-100 py-1 px-3 rounded-full">Evento General</span>
                </div>
            </div>
        `;
    }

    /**
     * Genera HTML para clausura
     */
    generarClausuraHTML(ponencia) {
        return `
            <div class="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500">
                <div class="text-center sm:w-24 flex-shrink-0">
                    <span class="text-2xl font-bold text-red-600">${ponencia.horario.split(' - ')[0]}</span>
                    <span class="block sm:inline text-gray-500">${ponencia.horario.split(' - ')[1] || ''}</span>
                </div>
                <div class="flex-1">
                    <h3 class="text-xl font-bold text-gray-800 mb-2">${ponencia.titulo}</h3>
                    <span class="text-sm font-medium text-red-600 bg-red-100 py-1 px-3 rounded-full">Clausura</span>
                </div>
            </div>
        `;
    }

    /**
     * Genera HTML para ponencias
     */
    generarPonenciaCardHTML(ponencia) {
        const badgeText = ponencia.categoria === 'doctorado' ? 'Doctorado' : 'Maestría';
        const avatar = ponencia.avatar || 'https://placehold.co/112x112/EBF4FF/3B82F6?text=Perfil';
        
        // Determinar colores específicos basados en badgeColor
        let borderColor, textColor, bgColorLight, bgColorDark;
        switch(ponencia.badgeColor) {
            case 'blue':
                borderColor = 'border-blue-500';
                textColor = 'text-blue-600';
                bgColorLight = 'bg-blue-50';
                bgColorDark = 'bg-blue-100';
                break;
            case 'red':
                borderColor = 'border-red-500';
                textColor = 'text-red-600';
                bgColorLight = 'bg-red-50';
                bgColorDark = 'bg-red-100';
                break;
            case 'green':
                borderColor = 'border-green-500';
                textColor = 'text-green-600';
                bgColorLight = 'bg-green-50';
                bgColorDark = 'bg-green-100';
                break;
            case 'purple':
                borderColor = 'border-purple-500';
                textColor = 'text-purple-600';
                bgColorLight = 'bg-purple-50';
                bgColorDark = 'bg-purple-100';
                break;
            default:
                borderColor = 'border-blue-500';
                textColor = 'text-blue-600';
                bgColorLight = 'bg-blue-50';
                bgColorDark = 'bg-blue-100';
        }
        
        return `
            <div class="bg-white rounded-lg shadow-lg border-l-4 ${borderColor} overflow-hidden">
                <!-- Layout Mobile - Todo vertical -->
                <div class="block sm:hidden">
                    <!-- Imagen en la parte superior -->
                    <div class="flex justify-center p-4 pb-0">
                        <img class="h-20 w-20 rounded-full object-cover shadow-md" src="${avatar}" alt="${ponencia.ponente}">
                    </div>
                    
                    <!-- Toda la información debajo -->
                    <div class="p-4 pt-3 space-y-3">
                        <!-- Título -->
                        <h3 class="text-sm font-bold text-gray-800 text-center leading-tight">${ponencia.titulo}</h3>
                        
                        <!-- Ponente -->
                        <p class="text-xs text-gray-500 text-center">
                            Ponente: <span class="font-semibold text-gray-700">${ponencia.ponente}</span>
                        </p>
                        
                        <!-- Horario en caja destacada -->
                        <div class="text-center ${bgColorLight} py-2 px-3 rounded-md">
                            <div class="text-sm font-bold ${textColor}">
                                ${ponencia.horario.split(' - ')[0]} - ${ponencia.horario.split(' - ')[1]}
                            </div>
                        </div>
                        
                        <!-- Badge -->
                        <div class="text-center">
                            <span class="inline-block text-xs font-medium ${textColor} ${bgColorDark} py-1 px-3 rounded-full">${badgeText}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Layout Desktop -->
                <div class="hidden sm:flex items-start space-x-6 p-6">
                    <!-- Horario izquierdo -->
                    <div class="text-center w-20 lg:w-24 flex-shrink-0">
                        <span class="text-xl lg:text-2xl font-bold ${textColor} block">${ponencia.horario.split(' - ')[0]}</span>
                        <span class="text-sm text-gray-500 block">${ponencia.horario.split(' - ')[1]}</span>
                    </div>
                    <!-- Contenido -->
                    <div class="flex-1 min-w-0">
                        <h3 class="text-lg font-bold text-gray-800 mb-2 leading-tight">${ponencia.titulo}</h3>
                        <p class="text-gray-500 text-sm mb-3 truncate">Ponente: <span class="font-semibold text-gray-700">${ponencia.ponente}</span></p>
                        <span class="text-sm font-medium ${textColor} ${bgColorDark} py-1 px-3 rounded-full">${badgeText}</span>
                    </div>
                    <!-- Imagen -->
                    <div class="flex-shrink-0">
                        <img class="h-24 w-24 lg:h-28 lg:w-28 rounded-full object-cover shadow-md" src="${avatar}" alt="${ponencia.ponente}">
                    </div>
                </div>
            </div>
        `;
    }
    }

    /**
     * Genera HTML para talleres
     */
    generarTallerHTML(ponencia) {
        const presenter = ponencia.tallerista || ponencia.talleristas || ponencia.ponente;
        const avatar = ponencia.avatar || 'src/talleres/taller.jpg';
        
        return `
            <div class="bg-white rounded-lg shadow-lg border-l-4 border-green-500 overflow-hidden">
                <!-- Layout Mobile - Todo vertical -->
                <div class="block sm:hidden">
                    <!-- Imagen en la parte superior -->
                    <div class="flex justify-center p-4 pb-0">
                        <img class="h-20 w-20 rounded-full object-${ponencia.avatar && ponencia.avatar.includes('Citlalmina') ? 'contain' : 'cover'} shadow-md" src="${avatar}" alt="Taller Especializado">
                    </div>
                    
                    <!-- Toda la información debajo -->
                    <div class="p-4 pt-3 space-y-3">
                        <!-- Título -->
                        <h3 class="text-sm font-bold text-gray-800 text-center leading-tight">${ponencia.titulo}</h3>
                        
                        <!-- Tallerista -->
                        <p class="text-xs text-gray-500 text-center">
                            Tallerista${ponencia.talleristas ? 's' : ''}: <span class="font-semibold text-gray-700">${presenter}</span>
                        </p>
                        
                        <!-- Horario en caja destacada -->
                        <div class="text-center bg-green-50 py-2 px-3 rounded-md">
                            <div class="text-sm font-bold text-green-600">
                                ${ponencia.horario.split(' - ')[0]} - ${ponencia.horario.split(' - ')[1]}
                            </div>
                        </div>
                        
                        <!-- Badge -->
                        <div class="text-center">
                            <span class="inline-block text-xs font-medium text-green-600 bg-green-100 py-1 px-3 rounded-full">Taller</span>
                        </div>
                    </div>
                </div>
                
                <!-- Layout Desktop -->
                <div class="hidden sm:flex items-start space-x-6 p-6">
                    <!-- Horario izquierdo -->
                    <div class="text-center w-20 lg:w-24 flex-shrink-0">
                        <span class="text-xl lg:text-2xl font-bold text-green-600 block">${ponencia.horario.split(' - ')[0]}</span>
                        <span class="text-sm text-gray-500 block">${ponencia.horario.split(' - ')[1]}</span>
                    </div>
                    <!-- Contenido -->
                    <div class="flex-1 min-w-0">
                        <h3 class="text-lg font-bold text-gray-800 mb-2 leading-tight">${ponencia.titulo}</h3>
                        <p class="text-gray-500 text-sm mb-3 truncate">Tallerista${ponencia.talleristas ? 's' : ''}: <span class="font-semibold text-gray-700">${presenter}</span></p>
                        <span class="text-sm font-medium text-green-600 bg-green-100 py-1 px-3 rounded-full">Taller</span>
                    </div>
                    <!-- Imagen -->
                    <div class="flex-shrink-0">
                        <img class="h-24 w-24 lg:h-28 lg:w-28 rounded-full object-${ponencia.avatar && ponencia.avatar.includes('Citlalmina') ? 'contain' : 'cover'} shadow-md" src="${avatar}" alt="Taller Especializado">
                    </div>
                </div>
            </div>
        `;
    }
    }

    /**
     * Genera HTML para carteles
     */
    generarCartelHTML(ponencia) {
        const avatar = ponencia.avatar || 'src/talleres/cartel.jpg';
        const badgeText = ponencia.categoria === 'doctorado' ? 'Doctorado' : 'Maestría';
        
        return `
            <div class="bg-white rounded-lg shadow-lg border-l-4 border-purple-500 overflow-hidden">
                <!-- Layout Mobile - Todo vertical -->
                <div class="block sm:hidden">
                    <!-- Imagen en la parte superior -->
                    <div class="flex justify-center p-4 pb-0">
                        <img class="h-20 w-20 rounded-full object-cover shadow-md" src="${avatar}" alt="Cartel de Resultados">
                    </div>
                    
                    <!-- Toda la información debajo -->
                    <div class="p-4 pt-3 space-y-3">
                        <!-- Título -->
                        <h3 class="text-sm font-bold text-gray-800 text-center leading-tight">${ponencia.titulo}</h3>
                        
                        <!-- Ponente -->
                        <p class="text-xs text-gray-500 text-center">
                            Ponente: <span class="font-semibold text-gray-700">${ponencia.ponente}</span>
                        </p>
                        
                        <!-- Horario en caja destacada -->
                        <div class="text-center bg-purple-50 py-2 px-3 rounded-md">
                            <div class="text-sm font-bold text-purple-600">
                                ${ponencia.horario.split(' - ')[0]} - ${ponencia.horario.split(' - ')[1]}
                            </div>
                        </div>
                        
                        <!-- Badge -->
                        <div class="text-center">
                            <span class="inline-block text-xs font-medium text-purple-600 bg-purple-100 py-1 px-3 rounded-full">Cartel</span>
                        </div>
                    </div>
                </div>
                
                <!-- Layout Desktop -->
                <div class="hidden sm:flex items-start space-x-6 p-6">
                    <!-- Imagen -->
                    <div class="flex-shrink-0">
                        <img class="h-24 w-24 lg:h-28 lg:w-28 rounded-full object-cover shadow-md" src="${avatar}" alt="Cartel de Resultados">
                    </div>
                    <!-- Contenido -->
                    <div class="flex-1 min-w-0">
                        <h3 class="text-lg font-bold text-gray-800 mb-2 leading-tight">${ponencia.titulo}</h3>
                        <p class="text-gray-500 text-sm mb-3 truncate">Ponente: <span class="font-semibold text-gray-700">${ponencia.ponente}</span></p>
                        <span class="text-sm font-medium text-purple-600 bg-purple-100 py-1 px-3 rounded-full">Cartel</span>
                    </div>
                    <!-- Horario derecho -->
                    <div class="text-center w-24 lg:w-32 flex-shrink-0">
                        <div class="bg-purple-50 px-2 py-2 rounded-lg">
                            <span class="text-base lg:text-lg font-bold text-purple-600 block">${ponencia.horario.split(' - ')[0]}</span>
                            <span class="text-base lg:text-lg font-bold text-purple-600 block">${ponencia.horario.split(' - ')[1]}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Renderiza las ponencias de un día específico
     */
    renderizarPonencias(dia) {
        if (!this.ponenciasData) {
            console.error('Las ponencias no han sido cargadas');
            return;
        }

        const datosDia = this.ponenciasData[dia];
        if (!datosDia) {
            console.error(`No se encontraron datos para ${dia}`);
            return;
        }

        // Actualizar metadatos del día
        this.actualizarMetadatos(dia, datosDia);

        // Renderizar ponencias por bloques
        this.renderizarPorBloques(dia, datosDia.ponencias);

        console.log(`Ponencias del ${dia} renderizadas exitosamente`);
    }

    /**
     * Actualiza los metadatos del día (fecha, lugar)
     */
    actualizarMetadatos(dia, datosDia) {
        const fechaElemento = document.getElementById(`fecha-${dia}`);
        if (fechaElemento) {
            fechaElemento.textContent = `${datosDia.fecha} - ${datosDia.lugar}`;
        }
    }

    /**
     * Renderiza las ponencias organizadas por bloques
     */
    renderizarPorBloques(dia, ponencias) {
        // Separar por tipos de presentación
        const bloques = {
            presentaciones: ponencias.filter(p => p.tipo === 'ponencia'),
            talleres: ponencias.filter(p => p.tipo === 'taller'),
            carteles: ponencias.filter(p => p.tipo === 'cartel'),
            eventos: ponencias.filter(p => ['receso', 'almuerzo', 'evento', 'clausura'].includes(p.tipo))
        };

        // Renderizar cada bloque
        this.renderizarBloque('presentaciones', dia, bloques.presentaciones);
        this.renderizarBloque('talleres', dia, bloques.talleres);
        this.renderizarBloque('carteles', dia, bloques.carteles);
        this.renderizarBloque('eventos', dia, bloques.eventos);
    }

    /**
     * Renderiza un bloque específico
     */
    renderizarBloque(tipoBloque, dia, ponencias) {
        if (ponencias.length === 0) return;

        const contenedor = document.getElementById(`${tipoBloque}-${dia}`) || 
                          document.getElementById(`ponencias-${dia}`);
        
        if (!contenedor) {
            console.warn(`No se encontró contenedor para ${tipoBloque}-${dia}`);
            return;
        }

        const html = ponencias.map(p => this.generarPonenciaHTML(p)).join('\n');
        
        if (tipoBloque === 'eventos') {
            // Los eventos se insertan en sus posiciones correspondientes
            const parser = new DOMParser();
            ponencias.forEach(evento => {
                const eventHtml = this.generarPonenciaHTML(evento);
                const eventElement = parser.parseFromString(eventHtml, 'text/html').body.firstChild;
                contenedor.appendChild(eventElement);
            });
        } else {
            contenedor.innerHTML = html;
        }
    }

    /**
     * API pública para obtener datos
     */
    obtenerDatosDia(dia) {
        return this.ponenciasData?.[dia] || null;
    }

    /**
     * API pública para obtener una ponencia específica
     */
    obtenerPonencia(dia, ponenciaId) {
        const datosDia = this.obtenerDatosDia(dia);
        return datosDia?.ponencias.find(p => p.id === ponenciaId) || null;
    }

    /**
     * API pública para buscar ponencias
     */
    buscarPonencias(termino, dia = null) {
        if (!this.ponenciasData) return [];

        const dias = dia ? [dia] : ['dia1', 'dia2'];
        const resultados = [];

        dias.forEach(d => {
            const datosDia = this.ponenciasData[d];
            if (datosDia) {
                const coincidencias = datosDia.ponencias.filter(p => 
                    p.titulo?.toLowerCase().includes(termino.toLowerCase()) ||
                    p.ponente?.toLowerCase().includes(termino.toLowerCase()) ||
                    p.tallerista?.toLowerCase().includes(termino.toLowerCase()) ||
                    p.talleristas?.toLowerCase().includes(termino.toLowerCase())
                );
                resultados.push(...coincidencias.map(p => ({ ...p, dia: d })));
            }
        });

        return resultados;
    }

    /**
     * Limpia el cache
     */
    limpiarCache() {
        this.cache.clear();
    }
}

// Inicialización optimizada
document.addEventListener('DOMContentLoaded', function() {
    window.ponenciasManager = new PonenciasManager();
});

// Exportar para uso global
window.PonenciasManager = PonenciasManager;