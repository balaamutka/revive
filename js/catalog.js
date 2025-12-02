// Load and display products
function loadProducts() {
    const productsGrid = document.getElementById('products-grid');
    
    // Clear existing content
    productsGrid.innerHTML = '';
    
    // Check if we have products
    if (!productsData.products || productsData.products.length === 0) {
        productsGrid.innerHTML = 
            '<p style="text-align: center; color: #666; grid-column: 1 / -1; padding: 40px;">No products found.</p>';
        return;
    }
    
    // Create and append product cards
    productsData.products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.innerHTML += productCard;
    });
    
    // Add event listeners for filters
    setupFilters();
}

// Filter functionality
function setupFilters() {
    const categoryFilter = document.getElementById('category');
    const priceFilter = document.getElementById('price');
    const sortFilter = document.getElementById('sort');
    
    if (categoryFilter) categoryFilter.addEventListener('change', filterProducts);
    if (priceFilter) priceFilter.addEventListener('change', filterProducts);
    if (sortFilter) sortFilter.addEventListener('change', sortProducts);
}

function filterProducts() {
    const categoryValue = document.getElementById('category').value;
    const priceValue = document.getElementById('price').value;
    const products = document.querySelectorAll('.product-card');
    
    let visibleCount = 0;
    
    products.forEach(product => {
        const productCategory = product.getAttribute('data-category');
        const productPrice = parseInt(product.getAttribute('data-price'));
        
        let categoryMatch = categoryValue === 'all' || productCategory === categoryValue;
        let priceMatch = true;
        
        if (priceValue === 'low') {
            priceMatch = productPrice < 50;
        } else if (priceValue === 'medium') {
            priceMatch = productPrice >= 50 && productPrice <= 100;
        } else if (priceValue === 'high') {
            priceMatch = productPrice > 100;
        }
        
        if (categoryMatch && priceMatch) {
            product.style.display = 'block';
            visibleCount++;
        } else {
            product.style.display = 'none';
        }
    });
    
    // Show message if no products match filters
    const productsGrid = document.getElementById('products-grid');
    let noResultsMsg = productsGrid.querySelector('.no-results');
    
    if (visibleCount === 0) {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('p');
            noResultsMsg.className = 'no-results';
            noResultsMsg.style.cssText = 'text-align: center; color: #666; grid-column: 1 / -1; padding: 40px;';
            noResultsMsg.textContent = 'No products match your filters.';
            productsGrid.appendChild(noResultsMsg);
        }
    } else if (noResultsMsg) {
        noResultsMsg.remove();
    }
}

function sortProducts() {
    const sortValue = document.getElementById('sort').value;
    const productsGrid = document.getElementById('products-grid');
    const products = Array.from(document.querySelectorAll('.product-card'));
    
    products.sort((a, b) => {
        const priceA = parseInt(a.getAttribute('data-price'));
        const priceB = parseInt(b.getAttribute('data-price'));
        
        switch (sortValue) {
            case 'low-high':
                return priceA - priceB;
            case 'high-low':
                return priceB - priceA;
            case 'newest':
                // For newest, you might want to add a date attribute
                return 0; // Default order for now
            default:
                return 0; // Featured - keep original order
        }
    });
    
    // Clear and re-append sorted products
    products.forEach(product => productsGrid.appendChild(product));
}

// Product action functions
function viewProduct(productId) {
    window.location.href = `product.html?id=${productId}`;
}

function editProduct(productId) {
    alert(`Editing product ${productId}`);
    // You can redirect to an edit page or show an edit form
    // window.location.href = `edit-product.html?id=${productId}`;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, initializing products...');
    loadProducts();
});