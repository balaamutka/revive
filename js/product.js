document.addEventListener('DOMContentLoaded', function() {
    // Отримуємо ID продукту з URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    // Знаходимо продукт в масиві
    const product = productsData.products.find(p => p.id === productId);
    
    if (!product) {
        // Якщо продукт не знайдено, показуємо повідомлення
        document.getElementById('productDetails').innerHTML = `
            <div class="product-not-found">
                <h2>Product Not Found</h2>
                <p>The product you're looking for doesn't exist.</p>
                <a href="catalog.html" class="catalog-btn">Back to Catalog</a>
            </div>
        `;
        return;
    }
    
    document.title = `${product.name} - Revive Project`;
    
    renderProduct(product);
    
    initProductFunctionality(product);
});

function getTailorInfo(tailorId) {
    const users = loadUsersFromLocalStorage();
    return users.find(user => user.id === tailorId && user.type === 'Tailor');
}

function renderCreatorTab(product) {
    const tailor = getTailorInfo(product.tailorId);
    const creatorInfo = document.getElementById('creatorInfo');
    
    if (!tailor) {
        creatorInfo.innerHTML = '<p>Creator information not available.</p>';
        return;
    }
    
    creatorInfo.innerHTML = `
        <div class="creator-profile">
            <div class="creator-header">
                <img src="${tailor.image || '../pictures/default-avatar.jpg'}" 
                     alt="${tailor.name}" 
                     class="creator-avatar"
                     onerror="this.src='../pictures/default-avatar.jpg'">
                <div class="creator-details">
                    <h4>${tailor.name}</h4>
                    <div class="creator-rating">
                        ${'★'.repeat(Math.floor(tailor.rating || 5))}
                        ${'☆'.repeat(5 - Math.floor(tailor.rating || 5))}
                        <span>${tailor.rating || 4.9} (${tailor.completedProjects || 0} projects)</span>
                    </div>
                    <div class="creator-location">📍 ${tailor.location || 'Ukraine'}</div>
                </div>
            </div>
            
            <div class="creator-bio">
                <p><em>"${tailor.quote || 'Passionate about sustainable fashion'}"</em></p>
                <p>${tailor.bio || 'Professional tailor specializing in sustainable fashion.'}</p>
                
                ${tailor.specialty ? `
                <div class="creator-specialty">
                    <strong>Specialty:</strong> ${tailor.specialty}
                </div>
                ` : ''}
                
                ${tailor.experience ? `
                <div class="creator-experience">
                    <strong>Experience:</strong> ${tailor.experience}
                </div>
                ` : ''}
            </div>
            
            <div class="creator-actions">
                <a href="master.html?tailorId=${tailor.id}" class="btn btn-primary">View Full Profile</a>
                <a href="#" class="btn btn-outline">Contact Crafter</a>
            </div>
        </div>
    `;
}

function renderProduct(product) {
    const productDetails = document.getElementById('productDetails');
    
    // Отримуємо інформацію про кравця
    const tailor = getTailorInfo(product.tailorId);
    
    // Генеруємо мініатюри (можна додати більше зображень)
    const thumbnails = generateThumbnails(product);
    
    productDetails.innerHTML = `
        <!-- Product Images -->
        <div class="product-images">
            <div class="main-image">
                <img src="${product.image}" alt="${product.name}" id="mainImage">
            </div>
            <div class="image-thumbnails">
                ${thumbnails}
            </div>
        </div>

        <!-- Product Info -->
        <div class="product-info">
            <h1>${product.name}</h1>
            
            <!-- Блок з інформацією про кравця -->
            ${tailor ? `
            <div class="product-crafter-info">
                <div class="crafter-mini">
                    <span>Created by:</span>
                    <a href="master.html?tailorId=${tailor.id}" class="crafter-link">
                        <img src="${tailor.image || '../pictures/default-avatar.jpg'}" 
                             alt="${tailor.name}" 
                             class="crafter-avatar-mini"
                             onerror="this.src='../pictures/default-avatar.jpg'">
                        ${tailor.name}
                        <span class="crafter-rating-mini">★ ${tailor.rating || 4.9}</span>
                    </a>
                </div>
            </div>
            ` : ''}
            
            <div class="product-price">$${product.price}</div>
            <div class="product-rating">
                <div class="stars">
                    ★★★★★
                </div>
                <span class="rating-text">(4.8 • 124 reviews)</span>
            </div>
            
            <div class="product-description">
                <p>${product.description}</p>
                
                <div class="product-features">
                    <h3>Features:</h3>
                    <ul>
                        <li>Made from sustainable materials</li>
                        <li>Eco-friendly production</li>
                        <li>Unique, handcrafted design</li>
                        <li>High-quality craftsmanship</li>
                        <li>Machine washable</li>
                    </ul>
                </div>
            </div>

            <div class="size-selection">
                <label for="size">Size:</label>
                <select id="size" class="size-select">
                    <option value="">Select Size</option>
                    ${generateSizeOptions(product.size)}
                </select>
            </div>

            <div class="quantity-selection">
                <label for="quantity">Quantity:</label>
                <div class="quantity-controls">
                    <button class="quantity-btn" id="decreaseQty">-</button>
                    <input type="number" id="quantity" value="1" min="1" max="10">
                    <button class="quantity-btn" id="increaseQty">+</button>
                </div>
            </div>

            <div class="product-actions">
                <button class="add-to-cart-btn">Add to Cart</button>
                <button class="buy-now-btn">Buy Now</button>
                ${tailor ? `<a href="master.html?tailorId=${tailor.id}" class="btn btn-outline">About Creator</a>` : ''}
            </div>

            <div class="product-meta">
                <div class="meta-item">
                    <strong>Category:</strong> ${product.category}
                </div>
                <div class="meta-item">
                    <strong>Material:</strong> ${formatMaterial(product.material)}
                </div>
                ${tailor ? `
                <div class="meta-item">
                    <strong>Crafter:</strong> 
                    <a href="master.html?tailorId=${tailor.id}" class="crafter-link-inline">
                        ${tailor.name}
                    </a>
                </div>
                ` : ''}
                <div class="meta-item">
                    <strong>SKU:</strong> RV-${product.category.toUpperCase().substring(0,3)}-${product.id.toString().padStart(3, '0')}
                </div>
            </div>
        </div>
    `;
    
    // Оновлюємо деталі в табах
    updateProductDetails(product);
    
    // Рендеримо інформацію про кравця в новій вкладці
    if (tailor) {
        renderCreatorTab(product);
    }
}

function generateThumbnails(product) {
    // Можна додати додаткові зображення для кожного продукту
    // За замовчуванням використовуємо основне зображення кілька разів
    const thumbnails = [
        product.image,
        product.image,
        product.image
    ];
    
    return thumbnails.map((thumb, index) => `
        <div class="thumbnail ${index === 0 ? 'active' : ''}" data-image="${thumb}">
            <img src="${thumb}" alt="${product.name} Thumbnail ${index + 1}">
        </div>
    `).join('');
}

function generateSizeOptions(size) {
    if (size === 'One Size') {
        return '<option value="One Size">One Size</option>';
    }
    
    const sizes = ['S', 'M', 'L', 'XL'];
    return sizes.map(s => `
        <option value="${s}" ${s === size ? 'selected' : ''}>${s}</option>
    `).join('');
}

function formatMaterial(material) {
    const materialMap = {
        'organic': 'Organic Cotton',
        'recycled': 'Recycled Materials',
        'sustainable': 'Sustainable Wool',
        'reclaimed': 'Reclaimed Denim'
    };
    
    return materialMap[material] || material;
}

function updateProductDetails(product) {
    // Оновлюємо список деталей
    const detailsList = document.getElementById('productDetailsList');
    detailsList.innerHTML = `
        <li><strong>Material:</strong> ${formatMaterial(product.material)}</li>
        <li><strong>Size:</strong> ${product.size}</li>
        <li><strong>Care:</strong> Machine wash cold, tumble dry low</li>
        <li><strong>Origin:</strong> Handcrafted in our local workshop</li>
        <li><strong>Weight:</strong> 1.2 kg</li>
    `;
    
    // Оновлюємо повний опис
    const fullDescription = document.getElementById('productFullDescription');
    fullDescription.textContent = product.description;
}

function initProductFunctionality(product) {
    // Image Thumbnail Functionality
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('mainImage');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // Update main image
            const newImageSrc = this.getAttribute('data-image');
            mainImage.src = newImageSrc;
        });
    });
    
    // Quantity Controls
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');
    
    decreaseBtn.addEventListener('click', function() {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });
    
    increaseBtn.addEventListener('click', function() {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue < 10) {
            quantityInput.value = currentValue + 1;
        }
    });
    
    // Tab Functionality
    const tabHeaders = document.querySelectorAll('.tab-header');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all headers and panes
            tabHeaders.forEach(h => h.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked header and corresponding pane
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
    
    // Add to Cart Functionality
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    const buyNowBtn = document.querySelector('.buy-now-btn');
    
    addToCartBtn.addEventListener('click', function() {
        const size = document.getElementById('size').value;
        const quantity = document.getElementById('quantity').value;
        
        if (!size) {
            alert('Please select a size before adding to cart.');
            return;
        }
        
        // In a real application, you would add to cart here
        alert(`Added to cart: ${quantity} x ${product.name} (Size: ${size})`);
    });
    
    buyNowBtn.addEventListener('click', function() {
        const size = document.getElementById('size').value;
        const quantity = document.getElementById('quantity').value;
        
        if (!size) {
            alert('Please select a size before purchasing.');
            return;
        }
        
        // In a real application, you would proceed to checkout here
        alert(`Proceeding to checkout: ${quantity} x ${product.name} (Size: ${size})`);
    });
    
    // Size selection validation
    const sizeSelect = document.getElementById('size');
    sizeSelect.addEventListener('change', function() {
        if (this.value) {
            this.style.borderColor = '#6686AC';
        }
    });
}

// Додаємо стилі для повідомлення "продукт не знайдено"
const style = document.createElement('style');
style.textContent = `
    .product-not-found {
        text-align: center;
        padding: 60px 20px;
        grid-column: 1 / -1;
    }
    
    .product-not-found h2 {
        color: var(--navy);
        margin-bottom: 20px;
        font-size: 2rem;
    }
    
    .product-not-found p {
        color: var(--dark_gray);
        margin-bottom: 30px;
        font-size: 1.1rem;
    }
`;
document.head.appendChild(style);