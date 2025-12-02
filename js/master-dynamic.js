document.addEventListener('DOMContentLoaded', function() {
    // Отримати tailorId з URL параметрів
    const urlParams = new URLSearchParams(window.location.search);
    const tailorId = parseInt(urlParams.get('tailorId')) || 3; // За замовчуванням Anna Shevchenko
    
    // Завантажити користувачів
    const users = loadUsersFromLocalStorage();
    
    // Знайти кравеця за ID
    const tailor = users.find(user => user.id === tailorId && user.type === 'Tailor');
    
    if (tailor) {
        // Заповнити профільну картку
        document.getElementById('crafterName').textContent = tailor.name;
        document.getElementById('crafterPhoto').src = tailor.image;
        document.getElementById('crafterPhoto').onerror = function() {
            this.src = 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop';
        };
        document.getElementById('crafterBio').textContent = tailor.bio || 'Professional tailor with experience in sustainable fashion.';
        
        // Оновити теги (спеціалізацію)
        const tagsContainer = document.getElementById('crafterTags');
        if (tailor.specialty) {
            const specialties = tailor.specialty.split(',').map(s => s.trim());
            tagsContainer.innerHTML = specialties.map(s => `<span class="tag">${s}</span>`).join('');
        }
        
        // Оновити рейтинг
        const ratingContainer = document.getElementById('crafterRating');
        const rating = tailor.rating || 4.8;
        const completedProjects = tailor.completedProjects || 47;
        const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
        ratingContainer.innerHTML = `<span class="stars">${stars}</span> <span>${rating} (${completedProjects} orders)</span>`;
        
        // Оновити посилання на email
        const emailLink = document.getElementById('crafterEmail');
        if (tailor.email) {
            emailLink.href = `mailto:${tailor.email}`;
        }
        
        // Оновити кількість відгуків
        document.getElementById('reviewCount').textContent = completedProjects;
        
        // Оновити портфоліо та відгуки в залежності від кравеця
        loadTailorPortfolio(tailor.id);
        loadTailorReviews(tailor.id);
        
        // Змінити заголовок сторінки
        document.title = `Revive Project - ${tailor.name}`;
    } else {
        // Якщо кравець не знайдений, показати повідомлення
        document.getElementById('crafterName').textContent = 'Crafter not found';
        document.getElementById('crafterBio').textContent = 'The requested crafter profile could not be loaded.';
    }
});

function loadTailorPortfolio(tailorId) {
    const portfolioGrid = document.getElementById('portfolioGrid');
    
    // Для прикладу, різне портфоліо для різних кравеців
    const portfolios = {
        3: [ // Anna Shevchenko
            {
                id: 1,
                img: '../master_photo/photo_2025-11-25_21-20-13.jpg',
                title: 'Denim Jacket "Patch"',
                details: 'Upcycled Denim',
                price: '$120'
            },
            {
                id: 2,
                img: '../master_photo/photo_2025-11-29_18-03-15.jpg',
                title: 'Shirt Corset',
                details: 'Vintage Cotton',
                price: '$85'
            },
            {
                id: 3,
                img: '../master_photo/photo_2025-11-29_19-15-33.jpg',
                title: 'Shopper Bag',
                details: 'Mixed Fabric',
                price: '$45'
            }
        ],
        4: [ // Petro Kovalenko
            {
                id: 4,
                img: '../master_photo/photo_2025-11-25_21-20-15.jpg',
                title: 'Denim Vest',
                details: 'Reclaimed Denim',
                price: '$95'
            },
            {
                id: 5,
                img: '../master_photo/photo_2025-11-25_21-20-18.jpg',
                title: 'Linen Shirt',
                details: 'Organic Linen',
                price: '$75'
            },
            {
                id: 6,
                img: '../master_photo/photo_2025-11-29_18-03-15.jpg',
                title: 'Canvas Tote',
                details: 'Upcycled Canvas',
                price: '$40'
            }
        ]
    };
    
    const portfolioItems = portfolios[tailorId] || portfolios[3];
    
    portfolioGrid.innerHTML = portfolioItems.map(item => `
        <div class="portfolio-item" onclick="openProject(${item.id})">
            <img src="${item.img}" class="portfolio-img" onerror="this.src='../pictures/placeholder.jpg'">
            <div class="portfolio-overlay"><span class="view-btn">View Details</span></div>
            <div class="portfolio-details">
                <div class="portfolio-title">${item.title}</div>
                <div class="portfolio-meta"><span>${item.details}</span><span>${item.price}</span></div>
            </div>
        </div>
    `).join('');
}

function loadTailorReviews(tailorId) {
    const reviewsContainer = document.getElementById('reviews');
    
    // Різні відгуки для різних кравеців
    const reviews = {
        3: [ // Anna Shevchenko
            {
                name: 'Maria K.',
                stars: '★★★★★',
                date: 'Nov 12, 2024',
                text: 'This is just wow! Anna made an incredibly cool skirt from my old jeans. The sewing quality is perfect.'
            },
            {
                name: 'Oleg P.',
                stars: '★★★★★',
                date: 'Oct 05, 2024',
                text: 'Great communication, the master quickly understood the idea and even improved it.'
            }
        ],
        4: [ // Petro Kovalenko
            {
                name: 'Ivan S.',
                stars: '★★★★★',
                date: 'Dec 01, 2024',
                text: 'Petro transformed my old denim jacket into a modern masterpiece. Highly recommended!'
            },
            {
                name: 'Sofia M.',
                stars: '★★★★☆',
                date: 'Nov 20, 2024',
                text: 'Excellent work on the accessories. Very creative use of materials.'
            }
        ]
    };
    
    const tailorReviews = reviews[tailorId] || reviews[3];
    
    reviewsContainer.innerHTML = tailorReviews.map(review => `
        <div class="review-item">
            <div class="review-header">
                <span class="reviewer-name">${review.name} <span class="stars">${review.stars}</span></span>
                <span class="review-date">${review.date}</span>
            </div>
            <p class="review-text">${review.text}</p>
        </div>
    `).join('');
}