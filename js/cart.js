/**
 * Shopping Cart functionality
 */
class CartManager {
    constructor() {
        this.cart = [];
        this.loadCart();
    }

    /**
     * Load cart from local storage
     */
    loadCart() {
        const savedCart = localStorage.getItem('merchStoreCart');
        if (savedCart) {
            try {
                this.cart = JSON.parse(savedCart);
            } catch (e) {
                console.error('Error loading cart from local storage:', e);
                this.cart = [];
            }
        }
    }

    /**
     * Save cart to local storage
     */
    saveCart() {
        localStorage.setItem('merchStoreCart', JSON.stringify(this.cart));
    }

    /**
     * Get all items in cart
     * @returns {Array} Cart items array
     */
    getCart() {
        return this.cart;
    }

    /**
     * Get cart item count
     * @returns {number} Total number of items in cart
     */
    getItemCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    /**
     * Add item to cart
     * @param {number} productId - Product ID to add
     * @param {number} quantity - Quantity to add (default: 1)
     * @returns {boolean} True if item added successfully, false otherwise
     */
    addItem(productId, quantity = 1) {
        // Validate product exists and is in stock
        const product = productsManager.getProductById(productId);
        if (!product || !productsManager.isInStock(productId)) {
            return false;
        }

        // Check if product already in cart
        const existingItem = this.cart.find(item => item.productId === productId);
        
        if (existingItem) {
            // Ensure we don't exceed available stock
            const newQuantity = existingItem.quantity + quantity;
            if (newQuantity > product.stock) {
                return false;
            }
            existingItem.quantity = newQuantity;
        } else {
            // Add new item to cart
            this.cart.push({
                productId,
                quantity,
                name: product.name,
                price: product.price,
                image: product.image
            });
        }

        this.saveCart();
        return true;
    }

    /**
     * Remove item from cart
     * @param {number} productId - Product ID to remove
     * @returns {boolean} True if item removed successfully, false if not found
     */
    removeItem(productId) {
        const initialLength = this.cart.length;
        this.cart = this.cart.filter(item => item.productId !== productId);
        
        const removed = initialLength > this.cart.length;
        if (removed) {
            this.saveCart();
        }
        
        return removed;
    }

    /**
     * Update item quantity
     * @param {number} productId - Product ID to update
     * @param {number} quantity - New quantity
     * @returns {boolean} True if updated successfully, false otherwise
     */
    updateQuantity(productId, quantity) {
        // Validate quantity
        if (quantity < 1) {
            return this.removeItem(productId);
        }

        const product = productsManager.getProductById(productId);
        if (!product || quantity > product.stock) {
            return false;
        }

        const item = this.cart.find(item => item.productId === productId);
        if (!item) {
            return false;
        }

        item.quantity = quantity;
        this.saveCart();
        return true;
    }

    /**
     * Calculate cart subtotal
     * @returns {number} Cart subtotal
     */
    getSubtotal() {
        return this.cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    /**
     * Calculate tax amount
     * @param {number} subtotal - Subtotal amount
     * @returns {number} Tax amount
     */
    calculateTax(subtotal = this.getSubtotal()) {
        // Default tax rate of 8%
        return subtotal * 0.08;
    }

    /**
     * Calculate order total
     * @param {number} subtotal - Subtotal amount
     * @param {number} tax - Tax amount
     * @param {number} shipping - Shipping amount
     * @returns {number} Order total
     */
    calculateTotal(subtotal = this.getSubtotal(), tax = this.calculateTax(), shipping = 0) {
        return subtotal + tax + shipping;
    }

    /**
     * Clear the cart
     */
    clearCart() {
        this.cart = [];
        this.saveCart();
    }
}

// Create global instance of the cart manager
const cartManager = new CartManager();
