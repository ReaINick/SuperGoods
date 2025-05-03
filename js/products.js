/**
 * Product data management
 */
class ProductsManager {
    constructor() {
        // Initialize products array
        this.products = [
            {
                id: 1,
                name: "Classic T-Shirt",
                price: 24.99,
                category: "apparel",
                image: "https://via.placeholder.com/400x300?text=T-Shirt",
                description: "Soft cotton t-shirt with our logo. Available in multiple sizes.",
                featured: true,
                stock: 100
            },
            {
                id: 2,
                name: "Hoodie",
                price: 49.99,
                category: "apparel",
                image: "https://via.placeholder.com/400x300?text=Hoodie",
                description: "Warm and comfortable hoodie for cold days. Brushed fleece inside.",
                featured: true,
                stock: 75
            },
            {
                id: 3,
                name: "Baseball Cap",
                price: 19.99,
                category: "accessories",
                image: "https://via.placeholder.com/400x300?text=Cap",
                description: "Adjustable cotton cap with embroidered logo.",
                featured: false,
                stock: 50
            },
            {
                id: 4,
                name: "Tote Bag",
                price: 14.99,
                category: "accessories",
                image: "https://via.placeholder.com/400x300?text=Tote",
                description: "Canvas tote bag with reinforced handles. Perfect for shopping.",
                featured: true,
                stock: 60
            },
            {
                id: 5,
                name: "Water Bottle",
                price: 29.99,
                category: "accessories",
                image: "https://via.placeholder.com/400x300?text=Bottle",
                description: "Stainless steel insulated bottle. Keeps drinks cold for 24 hours.",
                featured: false,
                stock: 40
            },
            {
                id: 6,
                name: "Coffee Mug",
                price: 14.99,
                category: "home",
                image: "https://via.placeholder.com/400x300?text=Mug",
                description: "Ceramic mug with our logo, microwave and dishwasher safe.",
                featured: true,
                stock: 80
            },
            {
                id: 7,
                name: "Notebook",
                price: 9.99,
                category: "home",
                image: "https://via.placeholder.com/400x300?text=Notebook",
                description: "Lined notebook with hardcover and bookmark ribbon.",
                featured: false,
                stock: 120
            },
            {
                id: 8,
                name: "Socks",
                price: 12.99,
                category: "apparel",
                image: "https://via.placeholder.com/400x300?text=Socks",
                description: "Comfortable cotton socks with cushioned sole.",
                featured: false,
                stock: 90
            },
            {
                id: 9,
                name: "Sticker Pack",
                price: 5.99,
                category: "accessories",
                image: "https://via.placeholder.com/400x300?text=Stickers",
                description: "Set of 5 vinyl stickers. Waterproof and UV resistant.",
                featured: true,
                stock: 200
            },
            {
                id: 10,
                name: "Poster",
                price: 18.99,
                category: "home",
                image: "https://via.placeholder.com/400x300?text=Poster",
                description: "High quality printed poster on premium paper.",
                featured: false,
                stock: 30
            }
        ];
    }

    /**
     * Get all products
     * @returns {Array} Array of product objects
     */
    getAllProducts() {
        return this.products;
    }

    /**
     * Get product by ID
     * @param {number} id - Product ID
     * @returns {Object|null} Product object or null if not found
     */
    getProductById(id) {
        return this.products.find(product => product.id === id) || null;
    }

    /**
     * Get products by category
     * @param {string} category - Category name
     * @returns {Array} Array of product objects in the category
     */
    getProductsByCategory(category) {
        if (category === 'all') {
            return this.getAllProducts();
        }
        return this.products.filter(product => product.category === category);
    }

    /**
     * Get featured products
     * @returns {Array} Array of featured product objects
     */
    getFeaturedProducts() {
        return this.products.filter(product => product.featured);
    }

    /**
     * Sort products by criteria
     * @param {Array} products - Products to sort
     * @param {string} sortBy - Sort criteria (default, price-low, price-high, name)
     * @returns {Array} Sorted array of product objects
     */
    sortProducts(products, sortBy = 'default') {
        const productsCopy = [...products];
        
        switch (sortBy) {
            case 'price-low':
                return productsCopy.sort((a, b) => a.price - b.price);
            case 'price-high':
                return productsCopy.sort((a, b) => b.price - a.price);
            case 'name':
                return productsCopy.sort((a, b) => a.name.localeCompare(b.name));
            case 'default':
            default:
                // Featured products first, then by ID
                return productsCopy.sort((a, b) => {
                    if (a.featured === b.featured) {
                        return a.id - b.id;
                    }
                    return a.featured ? -1 : 1;
                });
        }
    }

    /**
     * Check if product is in stock
     * @param {number} id - Product ID
     * @param {number} quantity - Quantity to check
     * @returns {boolean} True if in stock, false otherwise
     */
    isInStock(id, quantity = 1) {
        const product = this.getProductById(id);
        return product && product.stock >= quantity;
    }

    /**
     * Update product stock
     * @param {number} id - Product ID
     * @param {number} quantity - Quantity to update (negative for decrease)
     * @returns {boolean} True if successful, false otherwise
     */
    updateStock(id, quantity) {
        const product = this.getProductById(id);
        if (!product) return false;
        
        const newStock = product.stock + quantity;
        if (newStock < 0) return false;
        
        product.stock = newStock;
        return true;
    }

    /**
     * Search products by name
     * @param {string} query - Search query
     * @returns {Array} Array of matching product objects
     */
    searchProducts(query) {
        if (!query || query.trim() === '') {
            return this.getAllProducts();
        }
        
        const searchTerm = query.toLowerCase().trim();
        return this.products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm)
        );
    }
}

// Create global instance of the products manager
const productsManager = new ProductsManager();
