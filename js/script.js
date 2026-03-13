/**
 * =============================================
 * KERO'S MOTEL - JavaScript
 * Site institucional para motel em Campo Grande MS
 * =============================================
 */

// ===== DOM ELEMENTS =====
const header = document.getElementById('header');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const modal = document.getElementById('suite-modal');
const carouselTrack = document.getElementById('carousel-track');
const carouselPrev = document.getElementById('carousel-prev');
const carouselNext = document.getElementById('carousel-next');
const carouselDotsContainer = document.getElementById('carousel-dots');

// ===== SUITES DATA =====
const suitesData = {
    luxo: {
        title: 'Suíte Luxo',
        description: 'A Suíte Luxo oferece um ambiente elegante e confortável, perfeito para momentos especiais a dois. Com decoração moderna e iluminação suave, este espaço foi projetado para proporcionar uma experiência única de relaxamento e intimidade.',
        image: 'images/suite-luxo.jpg',
        amenities: [
            'Ar-condicionado Split',
            'TV LED 42"',
            'Wi-Fi gratuito',
            'Frigobar abastecido',
            'Iluminação ambiente',
            'Espelho decorativo',
            'Chuveiro com ducha',
            'Toalhas e roupas de cama premium'
        ]
    },
    hidro: {
        title: 'Suíte Hidro',
        description: 'A Suíte Hidro é ideal para quem busca relaxamento total. Com banheira de hidromassagem para duas pessoas, esta suíte oferece o ambiente perfeito para relaxar e desfrutar de momentos inesquecíveis em um cenário romântico.',
        image: 'images/suite-hidro.jpg',
        amenities: [
            'Banheira de Hidromassagem',
            'Ar-condicionado Split',
            'TV LED 42"',
            'Wi-Fi gratuito',
            'Frigobar abastecido',
            'Iluminação cromática',
            'Som ambiente',
            'Kit romântico disponível'
        ]
    },
    premium: {
        title: 'Suíte Premium',
        description: 'Nossa suíte mais exclusiva. A Suíte Premium oferece o máximo em conforto e sofisticação, com jacuzzi de casal, decoração luxuosa e todos os detalhes pensados para uma experiência memorável.',
        image: 'images/suite-premium.jpg',
        amenities: [
            'Jacuzzi de casal',
            'Ar-condicionado Split',
            'TV LED 50"',
            'Som ambiente Bluetooth',
            'Wi-Fi gratuito',
            'Frigobar premium',
            'Iluminação cromática',
            'Decoração temática',
            'Kit champanhe disponível',
            'Sauna seca'
        ]
    }
};

// ===== HEADER SCROLL EFFECT =====
function handleHeaderScroll() {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// ===== MOBILE MENU TOGGLE =====
function toggleMobileMenu() {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
}

function closeMobileMenu() {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== SMOOTH SCROLL FOR NAV LINKS =====
function setupSmoothScroll() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    closeMobileMenu();
                }
            }
        });
    });
}

// ===== ACTIVE NAV LINK ON SCROLL =====
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 200;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ===== SCROLL ANIMATIONS =====
function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// ===== MODAL FUNCTIONS =====
function openModal(suiteType) {
    const suiteData = suitesData[suiteType];
    
    if (!suiteData) return;
    
    // Update modal content
    document.getElementById('modal-title').textContent = suiteData.title;
    document.getElementById('modal-description').textContent = suiteData.description;
    
    // Update gallery
    const gallery = document.getElementById('modal-gallery');
    gallery.innerHTML = `<img src="${suiteData.image}" alt="${suiteData.title}">`;
    
    // Update amenities
    const amenitiesList = document.getElementById('modal-amenities');
    amenitiesList.innerHTML = suiteData.amenities
        .map(amenity => `<li>${amenity}</li>`)
        .join('');
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// ===== CAROUSEL =====
let currentSlide = 0;
let totalSlides = 0;
let autoplayInterval = null;

function initCarousel() {
    if (!carouselTrack) return;
    
    const slides = carouselTrack.querySelectorAll('.carousel-slide');
    totalSlides = slides.length;
    
    // Create dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.setAttribute('aria-label', `Ir para slide ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        carouselDotsContainer.appendChild(dot);
    }
    
    // Start autoplay
    startAutoplay();
    
    // Pause on hover
    const carousel = document.getElementById('carousel');
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
}

function goToSlide(index) {
    currentSlide = index;
    
    if (currentSlide < 0) currentSlide = totalSlides - 1;
    if (currentSlide >= totalSlides) currentSlide = 0;
    
    carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update dots
    const dots = carouselDotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

function nextSlide() {
    goToSlide(currentSlide + 1);
}

function prevSlide() {
    goToSlide(currentSlide - 1);
}

function startAutoplay() {
    if (autoplayInterval) return;
    autoplayInterval = setInterval(nextSlide, 5000);
}

function stopAutoplay() {
    if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
    }
}

// ===== LAZY LOADING IMAGES =====
function setupLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        return;
    }
    
    // Fallback for browsers without native lazy loading
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== WHATSAPP FLOAT ANIMATION =====
function setupWhatsAppFloat() {
    const whatsappBtn = document.querySelector('.whatsapp-float');
    
    if (!whatsappBtn) return;
    
    // Add pulse animation after page load
    setTimeout(() => {
        whatsappBtn.style.animation = 'pulse 2s infinite';
    }, 3000);
}

// Pulse animation keyframes
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes pulse {
        0% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7);
        }
        70% {
            box-shadow: 0 0 0 15px rgba(37, 211, 102, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
        }
    }
`;
document.head.appendChild(styleSheet);

// ===== FORM VALIDATION (if form exists) =====
function setupFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    });
}

// ===== PARALLAX EFFECT (subtle) =====
function setupParallax() {
    const parallaxElements = document.querySelectorAll('.hero, .promocoes, .cta-final');
    
    window.addEventListener('scroll', () => {
        parallaxElements.forEach(element => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            
            if (element.classList.contains('hero')) {
                element.style.backgroundPositionY = `${rate}px`;
            }
        });
    });
}

// ===== PERFORMANCE: Throttle scroll events =====
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    // Setup event listeners
    window.addEventListener('scroll', throttle(handleHeaderScroll, 100));
    window.addEventListener('scroll', throttle(updateActiveNavLink, 100));
    
    navToggle.addEventListener('click', toggleMobileMenu);
    
    if (carouselPrev) carouselPrev.addEventListener('click', prevSlide);
    if (carouselNext) carouselNext.addEventListener('click', nextSlide);
    
    // Initialize functions
    setupSmoothScroll();
    setupScrollAnimations();
    initCarousel();
    setupLazyLoading();
    setupWhatsAppFloat();
    setupFormValidation();
    
    // Only enable parallax on desktop for performance
    if (window.innerWidth > 768) {
        setupParallax();
    }
    
    // Initial calls
    handleHeaderScroll();
    updateActiveNavLink();
});

// ===== TOUCH SUPPORT FOR CAROUSEL =====
let touchStartX = 0;
let touchEndX = 0;

if (carouselTrack) {
    carouselTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carouselTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
    }
}

// ===== EXPORT FUNCTIONS FOR INLINE ONCLICK =====
window.openModal = openModal;
window.closeModal = closeModal;
