// Módulo para manejar las ponencias dinámicamente
class PonenciasManager {
    constructor() {
        this.ponenciasData = null;
        this.init();
    }

    /**
     * Inicializa el manager
     */
    async init() {
        await this.cargarPonencias();
        this.detectarPaginaYRenderizar();
    }

    /**
     * Carga las ponencias desde el archivo JSON
     */
    async cargarPonencias() {
        try {
            const response = await fetch('js/ponencias.json');
            this.ponenciasData = await response.json();
            console.log('Ponencias cargadas exitosamente:', this.ponenciasData);
        } catch (error) {
            console.error('Error al cargar las ponencias:', error);
        }
    }

    /**
     * Detecta la página actual y renderiza las ponencias correspondientes
     */
    detectarPaginaYRenderizar() {
        const currentPage = window.location.pathname;
        
        if (currentPage.includes('dia1.html')) {
            this.renderizarPonencias('dia1');
        } else if (currentPage.includes('dia2.html')) {
            this.renderizarPonencias('dia2');
        }
    }

    /**
     * Genera el HTML para una ponencia
     */
    generarPonenciaHTML(ponencia) {
        if (ponencia.tipo === 'receso') {
            return `
                <div class="text-center my-8">
                    <div class="bg-gray-100 p-4 rounded-lg inline-block">
                        <p class="font-semibold text-gray-700">${ponencia.horario} - ${ponencia.titulo}</p>
                    </div>
                </div>
            `;
        }

        if (ponencia.tipo === 'clausura') {
            return `
                <div class="bg-blue-600 text-white p-6 rounded-lg shadow-lg text-center">
                    <h2 class="text-2xl font-bold mb-2">${ponencia.horario}</h2>
                    <h3 class="text-xl font-bold mb-2">${ponencia.titulo}</h3>
                </div>
            `;
        }

        return `
            <div class="ponencia-card ponencia-${ponencia.tipo} flex items-center space-x-6">
                <div class="flex-shrink-0">
                    <img class="avatar" src="${ponencia.avatar}" alt="Foto de ${ponencia.ponente}">
                </div>
                <div class="flex-1">
                    <div class="flex flex-col sm:flex-row justify-between sm:items-start mb-2">
                        <h2 class="text-xl font-bold text-gray-800">${ponencia.titulo}</h2>
                        <span class="time-badge time-badge-${ponencia.badgeColor} mt-2 sm:mt-0 sm:ml-2">${ponencia.horario}</span>
                    </div>
                    <p class="text-gray-500 text-sm mb-3">Por <span class="font-semibold text-gray-700">${ponencia.ponente}</span></p>
                    <p class="text-gray-600 text-sm">${ponencia.descripcion}</p>
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

        const contenedor = document.getElementById(`ponencias-${dia}`);
        if (!contenedor) {
            console.error(`No se encontró el contenedor para ${dia}`);
            return;
        }

        const datosDia = this.ponenciasData[dia];
        if (!datosDia) {
            console.error(`No se encontraron datos para ${dia}`);
            return;
        }

        // Actualizar fecha y lugar
        const fechaElemento = document.getElementById(`fecha-${dia}`);
        if (fechaElemento) {
            fechaElemento.textContent = `${datosDia.fecha} - ${datosDia.lugar}`;
        }

        // Generar HTML para todas las ponencias
        const ponenciasHTML = datosDia.ponencias.map(ponencia => this.generarPonenciaHTML(ponencia)).join('');
        contenedor.innerHTML = ponenciasHTML;

        console.log(`Ponencias del ${dia} renderizadas exitosamente`);
    }

    /**
     * Obtiene los datos de un día específico
     */
    obtenerDatosDia(dia) {
        return this.ponenciasData ? this.ponenciasData[dia] : null;
    }

    /**
     * Obtiene una ponencia específica por ID
     */
    obtenerPonencia(dia, ponenciaId) {
        const datosDia = this.obtenerDatosDia(dia);
        if (!datosDia) return null;
        
        return datosDia.ponencias.find(ponencia => ponencia.id === ponenciaId);
    }
}

// Inicializar el manager cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    window.ponenciasManager = new PonenciasManager();
});

// Exportar para uso global
window.PonenciasManager = PonenciasManager;