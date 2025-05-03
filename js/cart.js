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
                console.error('Error loading cart from localStorage:', e);
                this.cart = [];
            }
        }
    }

    /**
     * Save cart to local storage
     */
    saveCart() {
        localStorage.setItem('merchStoreCart', JSON.stringify(this.cart));
        this.updateCartCount();
    }

    /**
     * Add item to cart
     * @param {number} productId - Product ID
     * @param {number} quantity - Quantity to add
     * @returns {boolean} Success status
     */
    addItem(productId, quantity = 1) {
        const product = productsManager.getProductById(productId);
        
        if (!product) {
            console.error('Product not found:', productId);
            return false;
        }
        
        if (!productsManager.isInStock(productId, quantity)) {
            showNotification('Sorry, this item is out of stock or not enough quantity available.', 'error');
            return false;
        }
        
        // Check if product already in cart
        const existingItem = this.cart.find(item => item.productId === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                productId,
                quantity,
                price: product.price, // Store the current price
                name: product.name,
                image: product.image
            });
        }
        
        this.saveCart();
        showNotification(`${product.name} added to cart`, 'success');
        return true;
    }

    /**
     * Remove item from cart
     * @param {number} productId - Product ID
     * @returns {boolean} Success status
     */
    removeItem(productId) {
        const initialLength = this.cart.length;
        this.cart = this.cart.filter(item => item.productId !== productId);
        
        if (this.cart.length !== initialLength) {
            this.saveCart();
            return true;
        }
        
        return false;
    }

    /**
     * Update item quantity
     * @param {number} productId - Product ID
     * @param {number} quantity - New quantity
     * @returns {boolean} Success status
     */
    updateQuantity(productId, quantity) {
        if (quantity <= 0) {
            return this.removeItem(productId);
        }
        
        const item = this.cart.find(item => item.productId === productId);
        if (!item) {
            return false;
        }
        
        // Check if enough stock
        if (!productsManager.isInStock(productId, quantity)) {
            showNotification('Sorry, not enough stock available for this quantity.', 'error');
            return false;
        }
        
        item.quantity = quantity;
        this.saveCart();
        return true;
    }

    /**
     * Clear cart
     */
    clearCart() {
        this.cart = [];
        this.saveCart();
    }

    /**
     * Get cart items
     * @returns {Array} Cart items
     */
    getItems() {
        return this.cart;
    }

    /**
     * Get cart item count
     * @returns {number} Total items in cart
     */
    getItemCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    /**
     * Get cart subtotal
     * @returns {number} Cart subtotal
     */
    getSubtotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    /**
     * Get cart tax
     * @param {number} taxRate - Tax rate as decimal (default: 0.08 for 8%)
     * @returns {number} Cart tax amount
     */
    getTax(taxRate = 0.08) {
        return calculateTax(this.getSubtotal(), taxRate);
    }

    /**
     * Get cart total
     * @param {number} taxRate - Tax rate as decimal (default: 0.08 for 8%)
     * @returns {number} Cart total
     */
    getTotal(taxRate = 0.08) {
        return this.getSubtotal() + this.getTax(taxRate);
    }

    /**
     * Update cart count badge
     */
    updateCartCount() {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = this.getItemCount();
        }
    }

    /**
     * Render cart items to DOM
     * @param {HTMLElement} container - Container element
     */
    renderCartItems(container) {
        if (!container) return;
        
        // Clear container
        container.innerHTML = '';
        
        // If cart is empty
        if (this.cart.length === 0) {
            container.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
            return;
        }
        
        // Create cart items
        this.cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            
            cartItem.innerHTML = `
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>${formatCurrency(item.price)}</p>
                </div>
                <div class="item-quantity">
                    <button class="quantity-btn" data-action="decrease" data-product-id="${item.productId}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" data-action="increase" data-product-id="${item.productId}">+</button>
                </div>
                <div class="item-price">
                    ${formatCurrency(item.price * item.quantity)}
                </div>
                <div class="item-remove">
                    <button class="remove-btn" data-product-id="${item.productId}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            container.appendChild(cartItem);
        });
        
        // Add event listeners for quantity buttons
        container.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', () => {
                const productId = parseInt(button.dataset.productId);
                const action = button.dataset.action;
                const item = this.cart.find(item => item.productId === productId);
                
                if (!item) return;
                
                if (action === 'increase') {
                    this.updateQuantity(productId, item.quantity + 1);
                } else if (action === 'decrease') {
                    this.updateQuantity(productId, item.quantity - 1);
                }
                
                // Re-render cart
                this.renderCartItems(container);
                this.updateCartSummary();
            });
        });
        
        // Add event listeners for remove buttons
        container.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', () => {
                const productId = parseInt(button.dataset.productId);
                this.removeItem(productId);
                
                // Re-render cart
                this.renderCartItems(container);
                this.updateCartSummary();
            });
        });
    }

    /**
     * Update cart summary
     */
    updateCartSummary() {
        const subtotalElement = document.getElementById('cart-subtotal');
        const taxElement = document.getElementById('cart-tax');
        const totalElement = document.getElementById('cart-total');
        
        if (subtotalElement) {
            subtotalElement.textContent = formatCurrency(this.getSubtotal());
        }
        
        if (taxElement) {
            taxElement.textContent = formatCurrency(this.getTax());
        }
        
        if (totalElement) {
            totalElement.textContent = formatCurrency(this.getTotal());
        }
    }
}

// Create global instance of the cart manager
const cartManager = new CartManager();
