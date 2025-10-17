// Configuración de la aplicación
const pages = ['home', 'day1', 'day2'];

// Referencias a elementos del DOM (solo para páginas SPA)
const navLinks = {
    home: document.getElementById('nav-home'),
    day1: document.getElementById('nav-day1'),
    day2: document.getElementById('nav-day2')
};

const pageElements = {
    home: document.getElementById('page-home'),
    day1: document.getElementById('page-day1'),
    day2: document.getElementById('page-day2')
};

/**
 * Muestra una página específica y oculta las demás (solo para navegación SPA)
 * @param {string} pageId - ID de la página a mostrar ('home', 'day1', 'day2')
 */
function showPage(pageId) {
    // Solo funciona si los elementos existen (modo SPA)
    if (!pageElements[pageId]) {
        console.log('Navegación por archivos separados activa');
        return;
    }

    // Ocultar todas las páginas
    pages.forEach(page => {
        if (pageElements[page]) {
            pageElements[page].classList.add('hidden');
        }
        if (navLinks[page]) {
            navLinks[page].classList.remove('active');
        }
    });
    
    // Mostrar la página seleccionada
    pageElements[pageId].classList.remove('hidden');
    if (navLinks[pageId]) {
        navLinks[pageId].classList.add('active');
    }

    // Asegurarse de que el scroll vuelva al inicio
    window.scrollTo(0, 0);
}

/**
 * Cierra el menú móvil
 */
function closeMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.add('hidden');
    }
}

/**
 * Inicialización cuando el DOM está completamente cargado
 */
document.addEventListener('DOMContentLoaded', function() {
    // Configuración del menú móvil
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Cerrar menú al hacer clic fuera de él
        document.addEventListener('click', function(event) {
            if (!menuBtn.contains(event.target) && !mobileMenu.contains(event.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }

    // Configurar eventos de navegación solo si estamos en modo SPA
    setupNavigation();
});

/**
 * Configura los eventos de navegación (solo para modo SPA)
 */
function setupNavigation() {
    // Solo agregar eventos SPA si los elementos de página existen
    const hasPageElements = Object.values(pageElements).some(el => el !== null);
    
    if (hasPageElements) {
        Object.keys(navLinks).forEach(pageId => {
            const link = navLinks[pageId];
            if (link && pageElements[pageId]) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    showPage(pageId);
                    closeMenu();
                });
            }
        });
    }
}

/**
 * Navega a una página específica del día
 * @param {number} day - Número del día (1 o 2)
 */
function goToDay(day) {
    const pageId = `day${day}`;
    if (pages.includes(pageId)) {
        // Si estamos en modo SPA, usar showPage
        if (pageElements[pageId]) {
            showPage(pageId);
        } else {
            // Si no, navegar por URL
            window.location.href = `dia${day}.html`;
        }
    }
}

// Exponer funciones globalmente para compatibilidad con inline handlers
window.showPage = showPage;
window.closeMenu = closeMenu;
window.goToDay = goToDay;