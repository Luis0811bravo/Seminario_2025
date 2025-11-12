// Script de inicialización para cargar ponencias dinámicamente
document.addEventListener('DOMContentLoaded', function() {
    console.log('Iniciando sistema de ponencias dinámico...');
    
    // Verificar si existe el contenedor principal
    const mainContainer = document.querySelector('main');
    if (!mainContainer) {
        console.error('No se encontró contenedor principal');
        return;
    }

    // Agregar indicador de carga
    const loadingIndicator = document.createElement('div');
    loadingIndicator.id = 'loading-indicator';
    loadingIndicator.className = 'fixed top-0 left-0 w-full bg-blue-600 text-white text-center py-2 z-50';
    loadingIndicator.innerHTML = '<span>Cargando ponencias...</span>';
    loadingIndicator.style.display = 'none';
    document.body.appendChild(loadingIndicator);

    // Función para mostrar/ocultar carga
    window.mostrarCarga = function(mostrar = true) {
        loadingIndicator.style.display = mostrar ? 'block' : 'none';
    };

    // Verificar que el manager se haya cargado correctamente
    const checkManager = setInterval(() => {
        if (window.ponenciasManager) {
            console.log('PonenciasManager cargado exitosamente');
            clearInterval(checkManager);
            
            // El manager ya maneja la detección de página y renderizado automático
            // Solo agregamos algunos handlers adicionales aquí si son necesarios
            
            // Agregar funcionalidad de búsqueda si existe campo de búsqueda
            const searchInput = document.getElementById('search-ponencias');
            if (searchInput) {
                setupBusqueda(searchInput);
            }
            
            console.log('Sistema de ponencias dinámico iniciado correctamente');
        }
    }, 100);

    // Timeout para evitar espera infinita
    setTimeout(() => {
        clearInterval(checkManager);
        if (!window.ponenciasManager) {
            console.error('Timeout: No se pudo cargar PonenciasManager');
        }
    }, 5000);
});

// Función para configurar búsqueda (opcional)
function setupBusqueda(searchInput) {
    let timeoutId;
    
    searchInput.addEventListener('input', function(e) {
        clearTimeout(timeoutId);
        const termino = e.target.value.trim();
        
        if (termino.length < 2) return;
        
        timeoutId = setTimeout(() => {
            if (window.ponenciasManager) {
                const resultados = window.ponenciasManager.buscarPonencias(termino);
                mostrarResultadosBusqueda(resultados);
            }
        }, 300);
    });
}

// Función para mostrar resultados de búsqueda (opcional)
function mostrarResultadosBusqueda(resultados) {
    console.log('Resultados de búsqueda:', resultados);
    // Aquí se podría implementar un modal o sección de resultados
}

// API global para interactuar con las ponencias
window.seminarioAPI = {
    buscar: function(termino, dia = null) {
        return window.ponenciasManager?.buscarPonencias(termino, dia) || [];
    },
    
    obtenerPonencia: function(dia, id) {
        return window.ponenciasManager?.obtenerPonencia(dia, id) || null;
    },
    
    obtenerDia: function(dia) {
        return window.ponenciasManager?.obtenerDatosDia(dia) || null;
    },
    
    recargar: function() {
        if (window.ponenciasManager) {
            window.ponenciasManager.limpiarCache();
            window.ponenciasManager.detectarPaginaYRenderizar();
        }
    }
};