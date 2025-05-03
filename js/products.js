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
