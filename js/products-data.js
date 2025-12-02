const productsData = {
    products: [
        {
            id: 1,
            name: "Sustainable T-Shirt",
            category: "t-shirt",
            description: "Comfortable tee from organic cotton. This sustainable t-shirt is made from 100% organic cotton and features a classic fit that's perfect for everyday wear.",
            price: 35,
            image: "../catalog/SustainableT-Shirt.jpg",
            material: "organic",
            size: "S",
            tailorId: 3
        },
        {
            id: 2,
            name: "Upcycled Backpack",
            category: "accessories",
            description: "Stylish backpack from repurposed materials. Each backpack is uniquely crafted from discarded materials, giving new life to what would otherwise be waste.",
            price: 55,
            image: "../catalog/UpcycledBackpack.jpg",
            material: "recycled",
            size: "One Size",
            tailorId: 4
        },
        {
            id: 3,
            name: "Eco-Friendly Sweater",
            category: "longsleeve",
            description: "Warm sweater made from sustainable wool. This cozy sweater is perfect for chilly days, made from ethically sourced sustainable wool.",
            price: 48,
            image: "../catalog/Eco-FriendlySweater.jpg",
            material: "sustainable",
            size: "L",
            tailorId: 3
        },
        {
            id: 4,
            name: "Vintage Denim Jacket",
            category: "coat",
            description: "Classic jacket made from upcycled denim. This vintage-inspired denim jacket has been carefully reconstructed from reclaimed denim.",
            price: 75,
            image: "../catalog/VintageDenimJacket.jpg",
            material: "reclaimed",
            size: "M",
            tailorId: 4
        },
        {
            id: 5,
            name: "Recycled Skirt",
            category: "skirts",
            description: "Elegant skirt from repurposed textiles. Beautifully crafted from reclaimed fabrics with unique patterns.",
            price: 52,
            image: "../catalog/RecycledSkirt.jpg",
            material: "recycled",
            size: "XS",
            tailorId: 3
        },
        {
            id: 6,
            name: "Organic Linen Pants",
            category: "pans",
            description: "Breathable pants from organic linen. Comfortable and sustainable pants perfect for everyday wear.",
            price: 68,
            image: "../catalog/OrganicLinenPants.jpg",
            material: "organic",
            size: "M",
            tailorId: 4
        }
    ]
};

// Product Template Function (для каталогу)
function createProductCard(product) {
    // Знаходимо кравця за tailorId
    const users = loadUsersFromLocalStorage();
    const tailor = users.find(user => user.id === product.tailorId);
    
    return `
        <div class="product-card" data-category="${product.category.toLowerCase()}" data-price="${product.price}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='../pictures/placeholder.jpg'">
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">$${product.price}</div>
                <div class="product-actions">
                    <a href="product.html?id=${product.id}" class="btn btn-primary">View Product</a>
                    <a href="master.html?tailorId=${product.tailorId}" class="btn btn-secondary">About Creator</a>
                </div>
                ${tailor ? `<div class="product-crafter">By: ${tailor.name}</div>` : ''}
            </div>
        </div>
    `;
}