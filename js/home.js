// Carousel functionality
function initProductsCarousel() {
    const carouselTrack = document.getElementById('carouselTrack');
    const carouselDots = document.getElementById('carouselDots');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let currentIndex = 0;
    const products = productsData.products;
    let cardsPerView = getCardsPerView();
    
    // Clear existing content
    carouselTrack.innerHTML = '';
    
    // Add product cards to carousel
    products.forEach(product => {
        const productCard = createProductCard(product);
        carouselTrack.innerHTML += productCard;
    });
    
    // Створення крапок навігації
    function createDots() {
        carouselDots.innerHTML = '';
        const totalSlides = Math.ceil(products.length / cardsPerView);
        
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(i);
            });
            carouselDots.appendChild(dot);
        }
    }
    
    createDots();
    
    // Функція для визначення кількості карток на екрані
    function getCardsPerView() {
        if (window.innerWidth < 576) return 1;
        if (window.innerWidth < 992) return 2;
        return 3;
    }
    
    // Функція для переміщення до певного слайду
    function goToSlide(index) {
        const trackWidth = carouselTrack.offsetWidth;
        const cardWidth = trackWidth / cardsPerView;
        currentIndex = index;
        
        carouselTrack.style.transform = `translateX(-${currentIndex * cardWidth * cardsPerView}px)`;
        
        // Оновлення активних крапок
        document.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }
    
    // Обробники подій для кнопок навігації
    prevBtn.addEventListener('click', () => {
        const totalSlides = Math.ceil(products.length / cardsPerView);
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1);
        }
    });
    
    nextBtn.addEventListener('click', () => {
        const totalSlides = Math.ceil(products.length / cardsPerView);
        if (currentIndex < totalSlides - 1) {
            goToSlide(currentIndex + 1);
        }
    });
    
    // Обробник події зміни розміру вікна
    window.addEventListener('resize', () => {
        const newCardsPerView = getCardsPerView();
        if (newCardsPerView !== cardsPerView) {
            cardsPerView = newCardsPerView;
            createDots();
            goToSlide(0);
        }
    });
    
    // Initialize first slide
    goToSlide(0);
}

function viewProduct(productId) {
    alert(`Viewing product ${productId}`);
}

const images = [
    '../pictures/home1.png',
    '../pictures/home2.png',
    '../pictures/home3.png'
];

const slides = document.querySelectorAll('.hero-slide');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');

let current = 0;

// Assign background images
slides.forEach((slide, index) => {
    slide.style.backgroundImage = `url(${images[index]})`;
});

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
}

function nextSlide() {
    current = (current + 1) % slides.length;
    showSlide(current);
}

function prevSlide() {
    current = (current - 1 + slides.length) % slides.length;
    showSlide(current);
}

next.addEventListener('click', nextSlide);
prev.addEventListener('click', prevSlide);

// Auto-slide every 5 seconds
setInterval(nextSlide, 3000);

// Initialize first slide
showSlide(current);

// Initialize products carousel when page loads
document.addEventListener('DOMContentLoaded', function() {
    initProductsCarousel();
});