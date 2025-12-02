document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const tailorId = params.get('id');
    
    // Завантажуємо деталі кравця
    loadTailorDetails(parseInt(tailorId));
});

// --- БАЗА ДАНИХ (З розширеними описами та відгуками) ---
const tailorsDatabase = [
    {
        id: 1, // АННА
        name: "Anna Shevchenko",
        specialty: "Dresses, Jackets",
        location: "Lviv",
        experience: "10 years",
        rating: 4.8,
        completedProjects: 145,
        email: "anna.shevchenko@example.com",
        bio: "Specializing in giving a second life to vintage dresses. I love working with delicate fabrics and creating modern silhouettes from retro styles.",
        quote: "Fashion fades, only style remains the same.",
        image: "anna.jpg", 
        portfolio: [
            { 
                image: "../pictures/photo_2025-10-20_23-10-01.jpg", 
                title: "Velvet Dress Redesign", 
                desc: "Turned a vintage maxi dress into a modern midi with a completely new silhouette and added lace details." 
            },
            { 
                image: "../pictures/photo_2025-10-20_23-09-58.jpg", 
                title: "Knitted Sleeves", 
                desc: "Added cozy merino wool sleeves to a classic denim vest to make it suitable for chilly autumn evenings." 
            },
            { 
                image: "../pictures/photo_2025-10-20_23-09-53.jpg", 
                title: "Summer Shorts", 
                desc: "Upcycled old linen trousers into breezy and stylish summer shorts with custom embroidery on the pockets." 
            }
        ],
        reviews: [
            { name: "Maria K.", text: "Ideally stitched! Anna understood exactly what I wanted. The dress looks brand new.", rating: 5 },
            { name: "Olena T.", text: "My grandmother's dress got a second life. Thank you for preserving the history!", rating: 5 },
            { name: "Iryna V.", text: "Very professional approach and fast delivery. Highly recommend.", rating: 4 }
        ]
    },
    {
        id: 2, // ПЕТРО
        name: "Petro Kovalenko",
        specialty: "Denim, Accessories",
        location: "Kyiv",
        experience: "7 years",
        rating: 4.9,
        completedProjects: 89,
        email: "petro.k@example.com",
        bio: "Master of denim upcycling. I turn old jeans into durable bags, jackets, and accessories. Zero waste is my philosophy.",
        quote: "Denim never dies, it just gets better with age.",
        image: "petro.jpg",
        portfolio: [
            { 
                image: "../pictures/photo_2025-10-20_23-08-17.jpg", 
                title: "Denim Jacket Art", 
                desc: "Complex patchwork design using 5 different shades of denim scraps from old jeans." 
            },
            { 
                image: "../pictures/photo_2025-10-20_23-09-52.jpg", 
                title: "Jeans Tote Bag", 
                desc: "Sturdy shopper bag made from recycled Levi's jeans. Perfect size for a laptop and daily groceries." 
            }
        ],
        reviews: [
            { name: "Alex D.", text: "The bag is indestructible and looks super stylish. I use it every day.", rating: 5 },
            { name: "Dmytro", text: "Cool jacket, fits perfectly. A true master of denim.", rating: 5 }
        ]
    }
];

function loadTailorDetails(id) {
    const tailor = tailorsDatabase.find(t => t.id === id);
    const container = document.getElementById('tailorContent');

    if (!tailor) {
        container.innerHTML = '<h2 style="text-align:center; margin-top:50px;">Tailor not found</h2>';
        return;
    }

    // Правильний шлях до папки з фото профілів
    const imagePath = `../profile_photo/${tailor.image}`;
    const fallbackImage = '../profile_photo/mike.jpg';

    container.innerHTML = `
        <section class="hero" style="margin-top: 20px;">
            <div class="profile-container">
                <img src="${imagePath}" alt="${tailor.name}" class="profile-img" onerror="this.src='${fallbackImage}'">
                
                <div class="profile-info">
                    <p class="welcome-text">Tailor Profile</p>
                    <h1 class="user-name">${tailor.name} ✂️</h1>
                    <p class="user-tagline">${tailor.quote}</p>
                    
                    <div class="tailor-stats" style="display:flex; gap:20px; margin-bottom:20px;">
                        <div class="stat"><strong>${tailor.rating} ⭐</strong> Rating</div>
                        <div class="stat"><strong>${tailor.completedProjects}</strong> Projects</div>
                        <div class="stat"><strong>${tailor.experience}</strong> Exp.</div>
                    </div>
                    
                    <div class="contact-info">
                         <div class="contact-item">
                            <div class="contact-icon"><i class="fas fa-tools"></i></div>
                            <div class="contact-details"><h4>Specialty</h4><p>${tailor.specialty}</p></div>
                        </div>
                        <div class="contact-item">
                            <div class="contact-icon"><i class="fas fa-map-marker-alt"></i></div>
                            <div class="contact-details"><h4>Location</h4><p>${tailor.location}</p></div>
                        </div>
                        <div class="contact-item">
                            <div class="contact-icon"><i class="fas fa-envelope"></i></div>
                            <div class="contact-details"><h4>Contact</h4><p>${tailor.email}</p></div>
                        </div>
                    </div>
                    
                    <div class="user-bio" style="margin-top:20px;">
                        <p>${tailor.bio}</p>
                    </div>

                    <button class="cta-btn" style="margin-top:20px;" onclick="window.location.href='../html/chat.html'">Contact for Order</button>
                </div>
            </div>
        </section>

        <section class="your_container">
            <h2 class="section-title">Portfolio</h2>
            <p class="section-subtitle">Latest works by ${tailor.name}</p>
            
            <div class="revived-grid">
                ${tailor.portfolio.map(item => `
                    <div class="project-card">
                        <img src="${item.image}" alt="${item.title}" class="project-img" style="height:300px; object-fit:cover; width:100%;" onerror="this.src='../profile/default-avatar.jpg'">
                        <div class="project-info">
                            <h3 class="project-title" style="margin-top:10px;">${item.title}</h3>
                            <p class="project-desc" style="font-size:0.9em; color:#666; margin-bottom:0;">${item.desc}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>
        
        <section class="inspiration">
             <div class="video-container">
                <h2 class="section-title">Client Reviews</h2>
                
                <div class="reviews-grid-styled">
                    ${tailor.reviews.map(review => `
                        <div class="review-card">
                            <div class="review-header">
                                <span class="review-author">${review.name}</span>
                                <span class="review-stars">${'⭐'.repeat(Math.round(review.rating))}</span>
                            </div>
                            <p class="review-text">"${review.text}"</p>
                        </div>
                    `).join('')}
                </div>

            </div>
        </section>
    `;
}