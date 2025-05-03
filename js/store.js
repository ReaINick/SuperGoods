/**
 * Store functionality - Main script for index.html
 */
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const productsGrid = document.getElementById('products-grid');
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    const cartModal = document.getElementById('cart-modal');
    const cartButton = document.getElementById('cart-button');
    const closeCartButton = document.querySelector('.modal-header .close');
    const continueShoppingButton = document.getElementById('continue-shopping');
    const checkoutButton = document.getElementById('checkout-button');
    const cartItemsContainer = document.getElementById('cart-items');
    
    let currentCategory = 'all';
    let currentSortBy = 'default';
    
    /**
     * Initialize the store
     */
    function init() {
        // Load and display products
        displayProducts();
        
        // Set up event listeners
        setupEventListeners();
        
        // Update cart count
        cartManager.updateCartCount();
    }
    
    /**
     * Display products in the grid
     */
    function displayProducts() {
        if (!productsGrid) return;
        
        // Clear products grid
        productsGrid.innerHTML = '';
        
        // Get filtered products
        let products = productsManager.getProductsByCategory(currentCategory);
        
        // Sort products
        products = productsManager.sortProducts(products, currentSortBy);
        
        // Create product cards
        products.forEach(product => {
            const productCard = createProductCard(product);
            productsGrid.appendChild(productCard);
        });
    }
    
    /**
     * Create a product card
     * @param {Object} product - Product object
     * @returns {HTMLElement} Product card element
     */
    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-price">${formatCurrency(product.price)}</p>
                <p class="product-description">${truncateText(product.description, 60)}</p>
                <div class="product-stock">
                    <span class="${product.stock > 0 ? 'in-stock' : 'out-of-stock'}">
                        ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                </div>
                <button class="button primary add-to-cart" 
                    data-product-id="${product.id}" 
                    ${product.stock <= 0 ? 'disabled' : ''}>
                    Add to Cart
                </button>
            </div>
        `;
        
        return card;
    }
    
    /**
     * Set up event listeners
     */
    function setupEventListeners() {
        // Category filter change
        if (categoryFilter) {
            categoryFilter.addEventListener('change', function() {
                currentCategory = this.value;
                displayProducts();
            });
        }
        
        // Sort filter change
        if (sortFilter) {
            sortFilter.addEventListener('change', function() {
                currentSortBy = this.value;
                displayProducts();
            });
        }
        
        // Add to cart buttons
        document.addEventListener('click', function(event) {
            if (event.target.classList.contains('add-to-cart')) {
                const productId = parseInt(event.target.dataset.productId);
                cartManager.addItem(productId, 1);
            }
        });
        
        // Cart button click
        if (cartButton) {
            cartButton.addEventListener('click', function(event) {
                event.preventDefault();
                openCartModal();
            });
        }
        
        // Close cart modal
        if (closeCartButton) {
            closeCartButton.addEventListener('click', closeCartModal);
        }
        
        // Continue shopping button
        if (continueShoppingButton) {
            continueShoppingButton.addEventListener('click', closeCartModal);
        }
        
        // Checkout button
        if (checkoutButton) {
            checkoutButton.addEventListener('click', function() {
                if (cartManager.getItems().length === 0) {
                    showNotification('Your cart is empty', 'error');
                    return;
                }
                window.location.href = 'checkout.html';
            });
        }
        
        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === cartModal) {
                closeCartModal();
            }
        });
    }
    
    /**
     * Open cart modal
     */
    function openCartModal() {
        if (!cartModal) return;
        
        // Render cart items
        cartManager.renderCartItems(cartItemsContainer);
        
        // Update cart summary
        cartManager.updateCartSummary();
        
        // Show modal
        cartModal.style.display = 'flex';
        
        // Add body class to prevent scrolling
        document.body.classList.add('modal-open');
    }
    
    /**
     * Close cart modal
     */
    function closeCartModal() {
        if (!cartModal) return;
        
        // Hide modal
        cartModal.style.display = 'none';
        
        // Remove body class
        document.body.classList.remove('modal-open');
    }
    
    // Initialize the store
    init();
});
