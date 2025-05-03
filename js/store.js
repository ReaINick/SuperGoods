/**
 * Store functionality - Main script for index.html
 */
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const productsGrid = document.getElementById('products-grid');
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    const cartButton = document.getElementById('cart-button');
    const cartModal = document.getElementById('cart-modal');
    const closeCartButton = cartModal.querySelector('.close');
    const continueShoppingButton = document.getElementById('continue-shopping');
    const checkoutButton = document.getElementById('checkout-button');
    const cartCountElement = document.getElementById('cart-count');
    
    // Cart summary elements
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSubtotalElement = document.getElementById('cart-subtotal');
    const cartTaxElement = document.getElementById('cart-tax');
    const cartTotalElement = document.getElementById('cart-total');
    
    // Update cart count badge
    function updateCartCount() {
        const count = cartManager.getItemCount();
        cartCountElement.textContent = count;
        
        // Hide count if zero
        if (count === 0) {
            cartCountElement.style.display = 'none';
        } else {
            cartCountElement.style.display = 'flex';
        }
    }
    
    // Format price to currency string
    function formatPrice(price) {
        return '$' + price.toFixed(2);
    }
    
    // Render product cards
    function renderProducts(products) {
        productsGrid.innerHTML = '';
        
        products.forEach(product => {
            const inStock = product.stock > 0;
            
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.dataset.productId = product.id;
            
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-details">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price">${formatPrice(product.price)}</div>
                    <div class="product-stock">${
                        inStock 
                            ? `In Stock (${product.stock})` 
                            : '<span class="out-of-stock">Out of Stock</span>'
                    }</div>
                    <div class="product-actions">
                        <button class="add-to-cart" ${!inStock ? 'disabled' : ''}>
                            Add to Cart
                        </button>
                    </div>
                </div>
            `;
            
            productsGrid.appendChild(productCard);
            
            // Add click event to "Add to Cart" button
            const addToCartButton = productCard.querySelector('.add-to-cart');
            addToCartButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (cartManager.addItem(product.id, 1)) {
                    // Show quick feedback
                    const originalText = addToCartButton.textContent;
                    addToCartButton.textContent = 'Added!';
                    setTimeout(() => {
                        addToCartButton.textContent = originalText;
                    }, 1500);
                    
                    updateCartCount();
                }
            });
        });
    }
    
    // Filter and sort products
    function filterAndSortProducts() {
        const category = categoryFilter.value;
        const sortBy = sortFilter.value;
        
        // Filter by category
        const filteredProducts = productsManager.filterByCategory(category);
        
        // Sort products
        const sortedProducts = productsManager.sortProducts(filteredProducts, sortBy);
        
        // Render the products
        renderProducts(sortedProducts);
    }
    
    // Render cart items
    function renderCartItems() {
        const cart = cartManager.getCart();
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
            checkoutButton.disabled = true;
        } else {
            checkoutButton.disabled = false;
            
            cart.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item';
                cartItemElement.dataset.productId = item.productId;
                
                cartItemElement.innerHTML = `
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${formatPrice(item.price)}</div>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrement">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn increment">+</button>
                    </div>
                    <div class="cart-item-remove">Remove</div>
                `;
                
                cartItemsContainer.appendChild(cartItemElement);
                
                // Add event listeners for cart item actions
                const decrementBtn = cartItemElement.querySelector('.decrement');
                const incrementBtn = cartItemElement.querySelector('.increment');
                const removeBtn = cartItemElement.querySelector('.cart-item-remove');
                
                decrementBtn.addEventListener('click', function() {
                    if (item.quantity > 1) {
                        cartManager.updateQuantity(item.productId, item.quantity - 1);
                        updateCart();
                    }
                });
                
                incrementBtn.addEventListener('click', function() {
                    const product = productsManager.getProductById(item.productId);
                    if (item.quantity < product.stock) {
                        cartManager.updateQuantity(item.productId, item.quantity + 1);
                        updateCart();
                    }
                });
                
                removeBtn.addEventListener('click', function() {
                    cartManager.removeItem(item.productId);
                    updateCart();
                });
            });
        }
        
        // Update cart summary
        updateCartSummary();
    }
    
    // Update cart summary (subtotal, tax, total)
    function updateCartSummary() {
        const subtotal = cartManager.getSubtotal();
        const tax = cartManager.calculateTax(subtotal);
        const total = cartManager.calculateTotal(subtotal, tax);
        
        cartSubtotalElement.textContent = formatPrice(subtotal);
        cartTaxElement.textContent = formatPrice(tax);
        cartTotalElement.textContent = formatPrice(total);
    }
    
    // Update cart (count badge and items if modal is open)
    function updateCart() {
        updateCartCount();
        
        // Only re-render cart items if the modal is visible
        if (cartModal.style.display === 'block') {
            renderCartItems();
        }
    }
    
    // Open the cart modal
    function openCartModal() {
        renderCartItems();
        cartModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
    }
    
    // Close the cart modal
    function closeCartModal() {
        cartModal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    // Event Listeners
    categoryFilter.addEventListener('change', filterAndSortProducts);
    sortFilter.addEventListener('change', filterAndSortProducts);
    
    cartButton.addEventListener('click', function(e) {
        e.preventDefault();
        openCartModal();
    });
    
    closeCartButton.addEventListener('click', closeCartModal);
    continueShoppingButton.addEventListener('click', closeCartModal);
    
    checkoutButton.addEventListener('click', function() {
        window.location.href = 'checkout.html';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === cartModal) {
            closeCartModal();
        }
    });
    
    // Initialize the store
    filterAndSortProducts();
    updateCartCount();
});
