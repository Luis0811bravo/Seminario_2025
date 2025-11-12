/**
 * Seminario Cards Manager - Sistema simple y limpio
 * Versión 2.0 - Enfoque minimalista
 */

class SeminarioManager {
    constructor() {
        this.datos = null;
    }

    // Inicializar el sistema
    async inicializar() {
        try {
            await this.cargarDatos();
            console.log('✅ Seminario Manager inicializado');
        } catch (error) {
            console.error('❌ Error inicializando:', error);
        }
    }

    // Cargar datos del JSON
    async cargarDatos() {
        const response = await fetch('js/ponencias.json');
        this.datos = await response.json();
    }

    // Renderizar día completo
    renderizarDia(dia) {
        if (!this.datos || !this.datos[dia]) {
            console.error(`No se encontraron datos para ${dia}`);
            return;
        }

        const datosDia = this.datos[dia];
        
        // Actualizar información del día
        this.actualizarInfoDia(dia, datosDia);
        
        // Separar por tipos
        const ponencias = datosDia.ponencias.filter(p => p.tipo === 'ponencia');
        const talleres = datosDia.ponencias.filter(p => p.tipo === 'taller');
        const carteles = datosDia.ponencias.filter(p => p.tipo === 'cartel');
        
        // Renderizar cada sección
        this.renderizarSeccion('ponencias', ponencias);
        
        // Para día 2, dividir talleres en dos secciones
        if (dia === 'dia2') {
            // Talleres primera sesión (10:20 - 12:05): taller-2-1 a taller-2-4
            const talleresPrimera = talleres.filter(t => 
                ['taller-2-1', 'taller-2-2', 'taller-2-3', 'taller-2-4'].includes(t.id)
            );
            
            // Talleres segunda sesión (12:25 - 14:40): taller-2-5 a taller-2-9
            const talleresSegunda = talleres.filter(t => 
                ['taller-2-5', 'taller-2-6', 'taller-2-7', 'taller-2-8', 'taller-2-9'].includes(t.id)
            );
            
            this.renderizarSeccion('talleres-primera', talleresPrimera);
            this.renderizarSeccion('talleres-segunda', talleresSegunda);
        } else {
            this.renderizarSeccion('talleres', talleres);
        }
        
        this.renderizarSeccion('carteles', carteles);
    }

    // Actualizar información del día en el header
    actualizarInfoDia(dia, datosDia) {
        const elementos = {
            'dia-actual': `Día ${dia.charAt(dia.length-1)}`,
            'fecha-actual': datosDia.fecha,
            'salon-actual': datosDia.lugar || 'Salón por confirmar'
        };

        Object.entries(elementos).forEach(([id, texto]) => {
            const elemento = document.getElementById(id);
            if (elemento) elemento.textContent = texto;
        });
    }

    // Renderizar una sección específica
    renderizarSeccion(tipo, items) {
        const contenedor = document.getElementById(`${tipo}-container`);
        if (!contenedor) {
            console.warn(`⚠️ No se encontró contenedor: ${tipo}-container`);
            return;
        }

        if (!items || items.length === 0) {
            contenedor.innerHTML = this.crearMensajeVacio(tipo);
            return;
        }

        const html = items.map(item => this.crearTarjeta(item)).join('');
        contenedor.innerHTML = html;
    }

    // Crear HTML para una tarjeta
    crearTarjeta(item) {
        const tipo = item.tipo || 'ponencia';
        const badgeTexto = this.obtenerBadgeTexto(item);
        const avatar = item.avatar || this.obtenerAvatarDefault(tipo);
        const horarios = item.horario.split(' - ');
        const presentador = this.obtenerPresentador(item);

        return `
            <article class="seminario-card tipo-${tipo}">
                <div class="card-content">
                    <!-- Sección Avatar -->
                    <div class="avatar-section">
                        <img class="avatar" src="${avatar}" alt="${presentador}" loading="lazy">
                    </div>
                    
                    <!-- Sección Información -->
                    <div class="info-section">
                        <h3 class="titulo">${item.titulo}</h3>
                        <p class="ponente">
                            ${this.obtenerTituloPresentador(item)}: 
                            <span class="ponente-nombre">${presentador}</span>
                        </p>
                    </div>
                    
                    <!-- Sección Horario Desktop -->
                    <div class="horario-section">
                        <div class="horario-inicio">${horarios[0]}</div>
                        <div class="horario-fin">${horarios[1] || ''}</div>
                        <!-- Horario Mobile -->
                        <div class="horario-box">${item.horario}</div>
                    </div>
                    
                    <!-- Sección Badge -->
                    <div class="badge-section">
                        <span class="badge">${badgeTexto}</span>
                    </div>
                </div>
            </article>
        `;
    }

    // Obtener texto del badge
    obtenerBadgeTexto(item) {
        if (item.tipo === 'taller') return 'Taller';
        if (item.tipo === 'cartel') return 'Cartel';
        if (item.categoria === 'academico') return 'Académico';
        return item.categoria === 'doctorado' ? 'Doctorado' : 'Maestría';
    }

    // Obtener nombre del presentador
    obtenerPresentador(item) {
        return item.tallerista || item.talleristas || item.ponente || 'Por confirmar';
    }

    // Obtener título del presentador
    obtenerTituloPresentador(item) {
        if (item.tipo === 'taller') {
            return item.talleristas ? 'Talleristas' : 'Tallerista';
        }
        return 'Ponente';
    }

    // Avatar por defecto según el tipo
    obtenerAvatarDefault(tipo) {
        const defaults = {
            'ponencia': 'https://placehold.co/112x112/EBF4FF/3B82F6?text=👨‍🎓',
            'taller': 'src/talleres/taller.jpg',
            'cartel': 'src/talleres/cartel.jpg'
        };
        return defaults[tipo] || defaults.ponencia;
    }

    // Mensaje cuando no hay elementos
    crearMensajeVacio(tipo) {
        const mensajes = {
            'ponencias': 'No hay ponencias programadas',
            'talleres': 'No hay talleres programados',
            'talleres-primera': 'No hay talleres programados para la primera sesión',
            'talleres-segunda': 'No hay talleres programados para la segunda sesión',
            'carteles': 'No hay carteles programados'
        };
        
        return `
            <div style="text-align: center; padding: 40px 20px; color: #6b7280;">
                <p style="font-size: 16px; margin: 0;">${mensajes[tipo] || 'No hay elementos'}</p>
            </div>
        `;
    }
}

// Instancia global
window.seminarioManager = new SeminarioManager();

// Auto-inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    await window.seminarioManager.inicializar();
    
    // Detectar qué día estamos renderizando
    const currentPage = window.location.pathname;
    if (currentPage.includes('dia1')) {
        window.seminarioManager.renderizarDia('dia1');
    } else if (currentPage.includes('dia2')) {
        window.seminarioManager.renderizarDia('dia2');
    }
});