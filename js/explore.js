const pins = [
    {
        id: 1, 
        category: 'vintage', 
        title: 'Vintage Oversized Hoodie', 
        crafter: 'Max R.', 
        img: '../inspiration/pic1.jpg', 
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
        desc: 'Oversized vintage hoodie with distressed details and comfortable fit. Made from reclaimed cotton with a relaxed silhouette perfect for casual wear.'
    },
    {
        id: 2, 
        category: 'vintage', 
        title: 'Zip-Up Vintage Hoodie', 
        crafter: 'Maria K.', 
        img: '../inspiration/pic2.jpg', 
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
        desc: 'Classic zip-up hoodie crafted from vintage fabrics. Features ribbed cuffs and hem with a comfortable fit ideal for layering.'
    },
    {
        id: 3, 
        category: 'vintage', 
        title: 'Distressed Pullover Hoodie', 
        crafter: 'Irene D.', 
        img: '../inspiration/pic3.jpg', 
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
        desc: 'Vintage pullover hoodie with unique distressing and raw edges. Made from reclaimed materials for an authentic worn-in feel.'
    },
    {
        id: 4, 
        category: 'denim', 
        title: 'Denim Shirt', 
        crafter: 'Elena V.', 
        img: '../inspiration/pic4.jpg', 
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
        desc: 'Classic denim shirt upcycled from vintage jeans. Features custom distressing and a comfortable relaxed fit perfect for casual styling.'
    },
    {
        id: 5, 
        category: 'denim', 
        title: 'Graphic T-Shirt', 
        crafter: 'Alex K.', 
        img: '../inspiration/pic5.jpg', 
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        desc: 'Upcycled t-shirt with unique graphic details. Made from reclaimed cotton with a soft, comfortable fit and artistic design elements.'
    },
    {
        id: 6, 
        category: 'patchwork', 
        title: 'Patchwork Cape', 
        crafter: 'Max R.', 
        img: '../inspiration/pic6.jpg', 
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
        desc: 'Bohemian patchwork cape created from various fabric remnants. Features mixed patterns and textures with a flowing, elegant silhouette.'
    },
    {
        id: 7, 
        category: 'patchwork', 
        title: 'Textured Shawl', 
        crafter: 'Alex K.', 
        img: '../inspiration/pic7.jpg', 
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        desc: 'Artistic shawl made from patchwork fabrics. Combines different textures and patterns for a unique layered accessory.'
    },
    {
        id: 8, 
        category: 'vintage', 
        title: 'Vintage Cardigan', 
        crafter: 'Elena V.', 
        img: '../inspiration/pic8.jpg', 
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
        desc: 'Cozy vintage cardigan crafted from reclaimed wool. Features a classic knit pattern and comfortable fit perfect for cooler weather.'
    }
];

const grid = document.getElementById('masonryGrid');

// RENDER FUNCTION
function renderGrid(filter) {
    grid.innerHTML = '';
    
    const filteredPins = filter === 'all' ? pins : pins.filter(p => p.category === filter);

    filteredPins.forEach(pin => {
        const item = document.createElement('div');
        item.className = 'pin-item';
        item.onclick = () => openModal(pin.id);
        
        item.innerHTML = `
            <img src="${pin.img}" class="pin-img" loading="lazy">
            <button class="pin-btn">Save</button>
            <div class="pin-overlay">
                <div class="pin-info">
                    <div class="pin-title">${pin.title}</div>
                    <div class="pin-author">
                        <img src="${pin.avatar}" class="author-avatar">
                        by ${pin.crafter}
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(item);
    });
}

// FILTER LOGIC
function filterGrid(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderGrid(category);
}

// MODAL LOGIC
function openModal(id) {
    const pin = pins.find(p => p.id === id);
    document.getElementById('modalImg').src = pin.img;
    document.getElementById('modalTag').innerText = pin.category;
    document.getElementById('modalTitle').innerText = pin.title;
    document.getElementById('modalDesc').innerText = pin.desc;
    document.getElementById('modalCrafter').innerText = pin.crafter;
    document.getElementById('modalAvatar').src = pin.avatar;
    
    document.getElementById('exploreModal').style.display = 'flex';
}

function closeModal(event, force) {
    if (force || event.target.id === 'exploreModal') {
        document.getElementById('exploreModal').style.display = 'none';
    }
}

// Initial Render
renderGrid('all');