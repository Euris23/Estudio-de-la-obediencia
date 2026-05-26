// ==========================================================================
// LOGICA DE NAVEGACION DE LA PRESENTACIÓN
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Referencias de elementos del DOM
    const presentation = document.getElementById('presentation');
    const slides = document.querySelectorAll('.slide');
    const progressBar = document.getElementById('progressBar');
    const currentCounter = document.querySelector('.slide-counter .current');
    const totalCounter = document.querySelector('.slide-counter .total');
    
    // Botones de control
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const playBtn = document.getElementById('playBtn');
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    const fullscreenBtn = document.getElementById('fullscreenBtn');

    let currentSlideIndex = 0;
    const totalSlides = slides.length;
    
    // Configuración de Autoplay
    let isAutoplayActive = false;
    let autoplayTimer = null;
    const autoplayDelay = 10000; // 10 segundos por slide

    // Inicializar total en el contador
    if (totalCounter) {
        totalCounter.textContent = String(totalSlides).padStart(2, '0');
    }

    /**
     * Muestra el slide correspondiente al índice y gestiona transiciones
     * @param {number} index - Índice del slide a mostrar
     */
    function showSlide(index) {
        // Validar límites
        if (index < 0 || index >= totalSlides) return;

        // Desactivar slide actual
        slides[currentSlideIndex].classList.remove('active');
        
        // Actualizar índice
        currentSlideIndex = index;
        
        // Activar nuevo slide
        const activeSlide = slides[currentSlideIndex];
        activeSlide.classList.add('active');

        // Gestionar el tema de color (Dorado/Azul vs Carmesí/Tensión para Saúl)
        const theme = activeSlide.getAttribute('data-theme');
        if (theme === 'tension') {
            presentation.classList.add('tension-theme');
        } else {
            presentation.classList.remove('tension-theme');
        }

        // Actualizar barra de progreso
        const progressPercentage = (currentSlideIndex / (totalSlides - 1)) * 100;
        progressBar.style.width = `${progressPercentage}%`;

        // Actualizar contador numérico
        currentCounter.textContent = String(currentSlideIndex + 1).padStart(2, '0');

        // Habilitar/Deshabilitar botones de navegación extremos
        if (prevBtn) prevBtn.disabled = currentSlideIndex === 0;
        if (nextBtn) nextBtn.disabled = currentSlideIndex === totalSlides - 1;

        // Si el autoplay está activo, resetear el temporizador para evitar saltos rápidos
        if (isAutoplayActive) {
            resetAutoplayTimer();
        }
    }

    // Funciones globales expuestas para botones del HTML
    window.nextSlide = function() {
        if (currentSlideIndex < totalSlides - 1) {
            showSlide(currentSlideIndex + 1);
        } else if (isAutoplayActive) {
            // Si llega al final con autoplay, detener o reiniciar
            toggleAutoplay();
        }
    };

    window.prevSlide = function() {
        if (currentSlideIndex > 0) {
            showSlide(currentSlideIndex - 1);
        }
    };

    window.restartPresentation = function() {
        showSlide(0);
    };

    // ==========================================================================
    // SISTEMA DE REPRODUCCIÓN AUTOMÁTICA (AUTOPLAY)
    // ==========================================================================

    window.toggleAutoplay = function() {
        isAutoplayActive = !isAutoplayActive;
        
        if (isAutoplayActive) {
            // Cambiar iconos
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            playBtn.title = 'Pausar reproducción automática';
            playBtn.setAttribute('aria-label', 'Pausar reproducción automática');
            // Iniciar temporizador
            resetAutoplayTimer();
        } else {
            // Cambiar iconos
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            playBtn.title = 'Iniciar reproducción automática';
            playBtn.setAttribute('aria-label', 'Iniciar reproducción automática');
            // Detener temporizador
            clearTimeout(autoplayTimer);
        }
    };

    function resetAutoplayTimer() {
        clearTimeout(autoplayTimer);
        autoplayTimer = setTimeout(() => {
            window.nextSlide();
        }, autoplayDelay);
    }

    // ==========================================================================
    // PANTALLA COMPLETA (FULLSCREEN API)
    // ==========================================================================

    window.toggleFullscreen = function() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error al intentar activar pantalla completa: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    // Cambiar la apariencia del botón de pantalla completa si cambia el estado
    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            fullscreenBtn.classList.add('active-fullscreen');
        } else {
            fullscreenBtn.classList.remove('active-fullscreen');
        }
    });

    // ==========================================================================
    // CAPTURA DE TECLADO Y NAVEGACIÓN COMODA
    // ==========================================================================

    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowRight':
            case ' ':
            case 'Enter':
            case 'PageDown':
                e.preventDefault();
                window.nextSlide();
                break;
            case 'ArrowLeft':
            case 'Backspace':
            case 'PageUp':
                e.preventDefault();
                window.prevSlide();
                break;
            case 'f':
            case 'F':
                window.toggleFullscreen();
                break;
        }
    });

    // Inicializar primer slide al cargar
    showSlide(0);
});
