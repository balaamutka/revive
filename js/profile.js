// Dynamic profile system
document.addEventListener('DOMContentLoaded', function() {
    initializeProfilePage();
    updateNavAvatar(); // Оновлюємо аватарку в меню одразу
});

// 1. БАЗА ДАНИХ ПРОЕКТІВ
const allProjectsDB = [
    {
        id: 1, 
        title: "Patchwork Denim Jacket",
        price: "$120",
        description: "Transformed old jeans into a unique statement piece with floral embroidery.",
        fullDescription: "This jacket was created from 3 pairs of old jeans. We used the patchwork technique to create a unique sustainable piece with hand-stitched floral details.",
        image: "../pictures/photo_2025-10-20_23-10-01.jpg", 
        date: "March 15, 2025",
        customerName: 'Maria K.',
        customerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop',
        review: 'My favorite item in the wardrobe! Looks very stylish and unique.'
    },
    {
        id: 2,
        title: "Knitted jacket sleeve",
        price: "$85",
        description: "Created from knitted elements to highlight individuality.",
        fullDescription: "The client brought a vintage jacket. We added knitted wool sleeves to give it a cozy, modern look suitable for autumn weather.",
        image: "../pictures/photo_2025-10-20_23-09-58.jpg",
        date: "February 28, 2025",
        customerName: 'Elena V.',
        customerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop',
        review: 'Fits perfectly, thanks for the new life for my jacket.'
    },
    {
        id: 3,
        title: "Scrap Fabric Tote",
        price: "$45",
        description: "Woven from leftover fabric scraps in a colorful geometric pattern.",
        fullDescription: "Durable shopper made from coat production scraps. Eco-friendly, stylish, and can hold all your daily essentials including a laptop.",
        image: "../pictures/photo_2025-10-20_23-09-52.jpg",
        date: "January 10, 2025",
        customerName: 'Irene D.',
        customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
        review: 'Very convenient bag for every day. I get compliments all the time!'
    }
];

let userProjectsData = [...allProjectsDB]; 

function initializeProfilePage() {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        window.location.href = '../html/signin.html';
        return;
    }
    
    updateNavigation();
    
    if (currentUser.type === 'User') {
        loadUserProfile(currentUser);
    } else if (currentUser.type === 'Tailor') {
        loadTailorProfile(currentUser);
    }
}

// --- ВИПРАВЛЕНА ФУНКЦІЯ ШЛЯХІВ (ПОВЕРНУЛИ profile_photo) ---
function getCorrectImagePath(imagePath) {
    // 1. Запасна картинка - Майк з папки profile_photo
    const fallback = '../profile_photo/mike.jpg'; 

    if (!imagePath) return fallback;
    if (imagePath.startsWith('data:image') || imagePath.startsWith('http')) return imagePath;

    let filename = imagePath.split(/[/\\]/).pop();
    let lowerName = filename.toLowerCase();

    // 2. АВАТАРКИ ЛЮДЕЙ -> profile_photo
    if (lowerName.includes('anna')) return '../profile_photo/anna.jpg';
    if (lowerName.includes('petro')) return '../profile_photo/petro.jpg';
    if (lowerName.includes('julie')) return '../profile_photo/julie.jpg';
    if (lowerName.includes('mike')) return '../profile_photo/mike.jpg';
    if (lowerName.includes('alex')) return '../profile_photo/alex.jpg';

    // 3. ФОТО РОБІТ -> pictures
    if (lowerName.includes('photo_')) return `../pictures/${filename}`;

    // 4. За замовчуванням -> profile_photo
    return `../profile_photo/${filename}`;
}

// Функція для оновлення аватарки в Навігації
function updateNavAvatar() {
    const navImg = document.getElementById('navProfileImg');
    const currentUser = getCurrentUser();
    
    if (navImg && currentUser) {
        const correctPath = getCorrectImagePath(currentUser.image);
        navImg.src = correctPath;
        
        // Якщо фото не знайдено - ставимо Майка з папки profile_photo
        navImg.onerror = function() { 
            this.src = '../profile_photo/mike.jpg'; 
        };
    }
}

function loadUserProfile(user) {
    const profileContent = document.getElementById('profileContent');
    const userImage = getCorrectImagePath(user.image);
    const fallbackImage = '../profile_photo/mike.jpg';

    profileContent.innerHTML = `
        <section class="hero">
            <div class="profile-container">
                <img src="${userImage}" alt="${user.name}" class="profile-img" id="profileImage" onerror="this.src='${fallbackImage}'">
                <div class="profile-info">
                    <p class="welcome-text">Welcome back,</p>
                    <h1 class="user-name" id="userName">${user.name}</h1>
                    <p class="user-tagline" id="userTagline">${user.quote}</p>
                    
                    <div class="contact-info">
                        <div class="contact-item"><div class="contact-icon"><i class="fas fa-envelope"></i></div><div class="contact-details"><h4>Email Address</h4><p id="userEmail">${user.email}</p></div></div>
                        <div class="contact-item"><div class="contact-icon"><i class="fas fa-map-marker-alt"></i></div><div class="contact-details"><h4>Location</h4><p id="userLocation">${user.location}</p></div></div>
                    </div>
                    
                    <div class="user-bio"><p>${user.bio}</p></div>
                    <a href="../html/Edit_Profile.html" class="edit-profile-btn" id="editProfileBtn"><i class="fas fa-edit"></i> Edit Profile</a>
                </div>
            </div>
        </section>

        <section class="your_container">
            <h2 class="section-title">Your Revived Things</h2>
            <p class="section-subtitle">Your creative transformations that gave fabrics a second life.</p>
            <div class="revived-grid" id="userProjectsGrid"></div>
            <div class="btn-container"><button class="add-project-btn" id="addProjectBtn"><i class="fas fa-plus"></i> Add New Project</button></div>
        </section>

        <section class="achievements-section">
            <div class="achive-container"><h2 class="section-title">Your Achievements</h2><div class="achievements-grid" id="achievementsGrid"></div></div>
        </section>

        <section class="inspiration">
            <div class="video-container">
                <h2 class="section-title">Inspiration Ideas</h2>
                <p class="section-subtitle">Get inspired by creations from our community members</p>
                <div class="video-grid">
                    <div class="video-card"><video class="inspiration-video" src="../videos/IMG_9922.MP4" autoplay loop muted playsinline controls></video></div>
                    <div class="video-card"><video class="inspiration-video" src="../videos/IMG_9923.MP4" autoplay loop muted playsinline controls></video></div>
                    <div class="video-card"><video class="inspiration-video" src="../videos/IMG_9924.MP4" autoplay loop muted playsinline controls></video></div>
                </div>
                <p class="divider-text">Discover stunning upcycling techniques in action above! Dive into these exclusive videos showcasing creative fabric transformations.</p>
                <div class="inspiration-grid">
                    <div class="inspiration-card"><img src="../pictures/photo_2025-10-20_23-10-01.jpg" class="inspiration-img"><div class="inspiration-overlay"><h3>Sweater</h3><p>By Sarah</p></div></div>
                    <div class="inspiration-card"><img src="../pictures/photo_2025-10-20_23-09-53.jpg" class="inspiration-img"><div class="inspiration-overlay"><h3>Shorts</h3><p>By Maria</p></div></div>
                    <div class="inspiration-card"><img src="../pictures/photo_2025-10-20_23-09-52.jpg" class="inspiration-img"><div class="inspiration-overlay"><h3>Bag</h3><p>By Chloe</p></div></div>
                    <div class="inspiration-card"><img src="../pictures/photo_2025-10-20_23-08-17.jpg" class="inspiration-img"><div class="inspiration-overlay"><h3>Jacket</h3><p>By James</p></div></div>
                </div>
                <div class="btn-container">
                    <a href="../html/explore.html" class="explore-more-btn">
                        <i class="fas fa-compass"></i> Explore More Ideas
                    </a>
                </div>
            </div>
        </section>

        <section class="inspiration">
            <div class="video-container">
                <h2 class="section-title">Meet Our Tailors</h2>
                <div class="tailors-grid" id="tailorsGrid"></div>
            </div>
        </section>

        <section class="quote-section">
            <p class="quote">"${user.quote}"</p>
            <button class="cta-btn" onclick="window.location.href='../html/redesign.html'">Start Your Design</button>
        </section>

        <div id="projectDetailModal" class="modal-overlay" onclick="closeDetailModal(event)">
            <div class="modal-content">
                <span class="close-modal" onclick="closeDetailModal(event, true)">&times;</span>
                <div class="modal-image-container">
                    <img id="m-img" src="" alt="Project Image" onerror="this.src='../profile_photo/mike.jpg'">
                    <div class="modal-price-tag" id="m-price"></div>
                </div>
                <div class="modal-info">
                    <h2 id="m-title" class="modal-title"></h2>
                    <p id="m-desc" class="modal-description"></p>
                    <div class="modal-divider"></div>
                    <div class="client-feedback">
                        <div class="client-header">
                            <img id="m-c-avatar" src="" alt="Creator" class="client-avatar" onerror="this.src='../profile_photo/mike.jpg'">
                            <div>
                                <span style="font-size:0.8em; color:#888;">CREATED BY:</span>
                                <h4 id="m-c-name" class="client-name"></h4>
                            </div>
                        </div>
                        <p id="m-c-review" class="client-review-text"></p>
                    </div>
                    <button class="modal-action-btn" onclick="window.location.href='../html/chat.html'">I want something similar!</button>
                </div>
            </div>
        </div>
    `;
    
    loadUserProjects();
    loadUserAchievements();
    loadTailorsList();
    setupUserEventListeners();
    setupAddProjectLogic();
}

function loadTailorProfile(tailor) {
    const profileContent = document.getElementById('profileContent');
    const tailorImage = getCorrectImagePath(tailor.image);
    const fallbackImage = '../profile_photo/mike.jpg';

    profileContent.innerHTML = `
        <section class="hero">
            <div class="profile-container">
               <img src="${tailorImage}" alt="${tailor.name}" class="profile-img" id="profileImage" onerror="this.src='${fallbackImage}'">
                <div class="profile-info">
                    <p class="welcome-text">Welcome back,</p>
                    <h1 class="user-name">${tailor.name} 👨‍🔧</h1>
                    <p class="user-tagline">${tailor.quote}</p>
                    <div class="tailor-stats">
                        <div class="stat"><span class="stat-value">${tailor.rating} ⭐</span><span class="stat-label">Rating</span></div>
                        <div class="stat"><span class="stat-value">${tailor.completedProjects}</span><span class="stat-label">Projects</span></div>
                        <div class="stat"><span class="stat-value">${tailor.experience}</span><span class="stat-label">Experience</span></div>

                    </div>
                    <div class="contact-info">
                        <div class="contact-item"><div class="contact-icon"><i class="fas fa-envelope"></i></div><div class="contact-details"><h4>Email</h4><p>${tailor.email}</p></div></div>
                        <div class="contact-item"><div class="contact-icon"><i class="fas fa-map-marker-alt"></i></div><div class="contact-details"><h4>Location</h4><p>${tailor.location}</p></div></div>
                        <div class="contact-item"><div class="contact-icon"><i class="fas fa-tools"></i></div><div class="contact-details"><h4>Specialty</h4><p>${tailor.specialty}</p></div></div>
                    </div>
                    <div class="user-bio"><p>${tailor.bio}</p></div>
                    <a href="../html/Edit_Profile.html" class="edit-profile-btn"><i class="fas fa-edit"></i> Edit Profile</a>
                    <a href="../html/master_dashboard.html" class="edit-profile-btn"></i>Dashboard</a>
                </div>
            </div>
        </section>
        <section class="your_container">
            <h2 class="section-title">My Portfolio</h2>
            <div class="revived-grid" id="tailorPortfolioGrid"></div>
            <div class="btn-container"><button class="add-project-btn" id="addPortfolioItemBtn"><i class="fas fa-plus"></i> Add Portfolio Item</button></div>
        </section>
        <section class="quote-section"><p class="quote">"${tailor.quote}"</p></section>
    `;
    
    loadTailorPortfolio();
    loadTailorServices();
    loadTailorReviews();
    setupTailorEventListeners();
}

function loadUserProjects() {
    const grid = document.getElementById('userProjectsGrid');
    if (!grid) return;
    const fallbackImage = '../profile_photo/mike.jpg';
    
    grid.innerHTML = userProjectsData.map(project => `
        <div class="project-card">
            <img src="${getCorrectImagePath(project.image)}" alt="${project.title}" class="project-img" onerror="this.onerror=null;this.src='${fallbackImage}'">
            <div class="project-info">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-desc">${project.description}</p>
                <p class="project-date">Revived on ${project.date}</p>
                <button class="btn btn-view" onclick="openProject(${project.id})" style="margin-top: 10px; width: 100%;">View Details</button>
            </div>
        </div>
    `).join('');
}

function loadTailorPortfolio() {
    const grid = document.getElementById('tailorPortfolioGrid');
    if (grid) {
        const fallbackImage = '../profile_photo/mike.jpg';
        grid.innerHTML = userProjectsData.map(project => `
            <div class="project-card">
                <img src="${getCorrectImagePath(project.image)}" alt="${project.title}" class="project-img" onerror="this.onerror=null;this.src='${fallbackImage}'">
                <div class="project-info">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-desc">${project.description}</p>
                    <button class="btn btn-view" onclick="openProject(${project.id})" style="margin-top: 10px; width: 100%;">View Details</button>
                </div>
            </div>
        `).join('');
    }
}

function loadTailorsList() {
    const tailorsGrid = document.getElementById('tailorsGrid');
    if(!tailorsGrid) return;

    const users = loadUsersFromLocalStorage();
    const tailors = users.filter(user => user.type === 'Tailor');
    const fallbackImage = '../profile_photo/mike.jpg';
    
    tailorsGrid.innerHTML = tailors.map(tailor => {
        const imagePath = getCorrectImagePath(tailor.image);
        let realId = tailor.id;
        if (tailor.name.includes('Anna')) realId = 1;
        if (tailor.name.includes('Petro')) realId = 2;

        return `
        <div class="tailor-card">
            <img src="${imagePath}" alt="${tailor.name}" class="tailor-img" onerror="this.onerror=null;this.src='${fallbackImage}'">
            <div class="tailor-info">
                <h3 class="tailor-name">${tailor.name}</h3>
                <p class="tailor-specialty">${tailor.specialty}</p>
                <div class="tailor-rating">⭐ ${tailor.rating}</div>
                <p class="tailor-location">📍 ${tailor.location}</p>
                <button class="btn btn-view" onclick="viewTailorProfile(${realId})">View Profile</button>
            </div>
        </div>
        `;
    }).join('');
}

function loadUserAchievements() {
    const achievementsGrid = document.getElementById('achievementsGrid');
    if(!achievementsGrid) return;
    
    const achievements = [
        { id: 1, icon: "🥇", title: "First Creation", desc: "You created your first revived item!", progress: 100, status: "Unlocked", locked: false },
        { id: 2, icon: "🏆", title: "Revival Champion", desc: "Successfully revived 5 unique garments.", progress: 60, status: "3/5 Completed", locked: false },
        { id: 3, icon: "⭐", title: "Creative Visionary", desc: "Designed 3 original pieces.", progress: 100, status: "Unlocked", locked: false },
        { id: 4, icon: "🌿", title: "Eco Warrior", desc: "Prevented 10kg of textile waste.", progress: 70, status: "7/10 kg Saved", locked: false },
        { id: 5, icon: "👑", title: "Community Star", desc: "Shared 5 creations with community.", progress: 40, status: "2/5 Shared", locked: false },
        { id: 6, icon: "💎", title: "Master Craftsman", desc: "Created 10 revived items.", progress: 30, status: "3/10 Items", locked: true },
        { id: 7, icon: "♻️", title: "Zero Waste Hero", desc: "Used 100% of materials.", progress: 80, status: "4/5 Projects", locked: false },
        { id: 8, icon: "🎨", title: "Innovation Leader", desc: "Developed 3 unique techniques.", progress: 33, status: "1/3 Techniques", locked: true },
        { id: 9, icon: "🤝", title: "Collaboration Pro", desc: "Completed 2 collaborative projects.", progress: 100, status: "Unlocked", locked: false },
        { id: 10, icon: "🌟", title: "Revive Legend", desc: "Reached highest level.", progress: 25, status: "Keep creating!", locked: true }
    ];
    
    achievementsGrid.innerHTML = achievements.map(ach => {
        const isLocked = ach.locked ? 'locked' : '';
        const isUnlocked = ach.progress === 100 ? 'unlocked' : '';
        const lockedOverlay = ach.locked ? '<div class="locked-overlay">🔒</div>' : '';

        return `
        <div class="achievement-card ${isLocked} ${isUnlocked}">
            <div class="achievement-icon">${ach.icon}</div>
            <h3 class="achievement-title">${ach.title}</h3>
            <p class="achievement-desc">${ach.desc}</p>
            <div class="achievement-progress"><div class="progress-bar" style="width: ${ach.progress}%"></div></div>
            <div class="achievement-status">${ach.status}</div>
            ${lockedOverlay}
        </div>
    `}).join('');
}

// --- ФУНКЦІЯ ВІДКРИТТЯ ДЕТАЛЕЙ (View Details) ---
function openProject(id) {
    const modal = document.getElementById('projectDetailModal');
    if (!modal) return;

    const data = userProjectsData.find(p => p.id == id);

    if (data) {
        document.getElementById('m-img').src = getCorrectImagePath(data.image);
        document.getElementById('m-title').innerText = data.title;
        document.getElementById('m-price').innerText = data.price || 'N/A';
        document.getElementById('m-desc').innerText = data.fullDescription || data.description;
        
        document.getElementById('m-c-avatar').src = getCorrectImagePath(data.customerAvatar);
        document.getElementById('m-c-name').innerText = data.customerName || 'Happy Customer';
        document.getElementById('m-c-review').innerText = `"${data.review || 'Great work!'}"`;
        
        const actionBtn = modal.querySelector('.modal-action-btn');
        if (actionBtn) {
            actionBtn.onclick = function() {
                window.location.href = '../html/chat.html';
            };
        }

        modal.style.display = 'flex';
    }
}

window.closeDetailModal = function(event, force) {
    const modal = document.getElementById('projectDetailModal');
    if (force || event.target.id === 'projectDetailModal') {
        modal.style.display = 'none';
    }
};

// --- ФУНКЦІЯ ДОДАВАННЯ ПРОЕКТУ ---
function setupAddProjectLogic() {
    const modalHTML = `
        <div id="projectModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:1000; align-items:center; justify-content:center;">
            <div style="background:white; padding:30px; border-radius:16px; width:400px; box-shadow:0 4px 15px rgba(0,0,0,0.2);">
                <h2 style="margin-bottom:20px; color:#1A2940; text-align:center;">Add New Project</h2>
                <input type="text" id="newProjTitle" placeholder="Title" style="width:100%; padding:10px; margin-bottom:10px; border:1px solid #ddd; border-radius:8px;">
                <textarea id="newProjDesc" placeholder="Description" rows="3" style="width:100%; padding:10px; margin-bottom:10px; border:1px solid #ddd; border-radius:8px;"></textarea>
                <input type="file" id="newProjImage" accept="image/*" style="width:100%; margin-bottom:10px;">
                <input type="date" id="newProjDate" style="width:100%; padding:10px; margin-bottom:20px; border:1px solid #ddd; border-radius:8px;">
                <div style="display:flex; gap:10px;">
                    <button id="saveNewProjectBtn" style="flex:1; background:#6686AC; color:white; border:none; padding:10px; border-radius:8px;">Save</button>
                    <button id="closeModalBtn" style="flex:1; background:#f8f9fa; border:1px solid #ddd; padding:10px; border-radius:8px;">Cancel</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('projectModal');
    const addBtn = document.getElementById('addProjectBtn');
    const saveBtn = document.getElementById('saveNewProjectBtn');
    const closeBtn = document.getElementById('closeModalBtn');

    if (addBtn) addBtn.addEventListener('click', () => modal.style.display = 'flex');
    closeBtn.addEventListener('click', () => modal.style.display = 'none');

    saveBtn.addEventListener('click', () => {
        const title = document.getElementById('newProjTitle').value;
        const desc = document.getElementById('newProjDesc').value;
        const fileInput = document.getElementById('newProjImage');
        const dateInput = document.getElementById('newProjDate').value;

        if (title && desc && dateInput) {
            const dateObj = new Date(dateInput);
            const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
            
            const createProject = (imgSrc) => {
                const newProject = {
                    id: Date.now(),
                    title: title,
                    description: desc,
                    fullDescription: desc,
                    image: imgSrc,
                    date: formattedDate,
                    price: 'Priceless',
                    customerName: 'You',
                    review: 'New masterpiece added!'
                };
                userProjectsData.unshift(newProject);
                loadUserProjects();
                
                document.getElementById('newProjTitle').value = '';
                document.getElementById('newProjDesc').value = '';
                document.getElementById('newProjImage').value = '';
                modal.style.display = 'none';
            };

            if (fileInput.files && fileInput.files[0]) {
                const reader = new FileReader();
                reader.onload = (e) => createProject(e.target.result);
                reader.readAsDataURL(fileInput.files[0]);
            } else {
                createProject("../pictures/photo_2025-10-20_23-08-17.jpg");
            }
        } else {
            alert('Please fill all fields');
        }
    });
}

function setupUserEventListeners() {
    setTimeout(() => {
        document.querySelectorAll('.action-btn').forEach(btn => btn.addEventListener('click', e => e.stopPropagation()));
    }, 100);
}
function setupTailorEventListeners() {
    const btn = document.getElementById('addPortfolioItemBtn');
    if(btn) btn.addEventListener('click', () => alert('Feature coming soon'));
}
function loadTailorServices() {}
function loadTailorReviews() {}

function viewTailorProfile(tailorId) {
    window.location.href = `tailor_details.html?id=${tailorId}`;
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') && !this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const href = this.href;
                document.body.classList.add('fade-out');
                setTimeout(() => { window.location.href = href; }, 300);
            }
        });
    });
});