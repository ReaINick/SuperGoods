/**
 * Checkout functionality - Main script for checkout.html
 */
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutItemsContainer = document.getElementById('checkout-items');
    const subtotalElement = document.getElementById('checkout-subtotal');
    const taxElement = document.getElementById('checkout-tax');
    const shippingElement = document.getElementById('checkout-shipping');
    const totalElement = document.getElementById('checkout-total');
    const cartCountElement = document.getElementById('cart-count');
    
    // Confirmation modal elements
    const confirmationModal = document.getElementById('confirmation-modal');
    const closeConfirmationButton = confirmationModal.querySelector('.close');
    const orderNumberElement = document.getElementById('order-number');
    const confirmationEmailElement = document.getElementById('confirmation-email');
    
    // Format price to currency string
    function formatPrice(price) {
        return '$' + price.toFixed(2);
    }
    
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
    
    // Generate a random order number
    function generateOrderNumber() {
        const orderDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `ORD-${orderDate}-${randomNum}`;
    }
    
    // Validate the checkout form
    function validateForm() {
        // Basic validation
        const requiredFields = checkoutForm.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });
        
        // Card validation (very basic for demo)
        const cardNumber = document.getElementById('card-number');
        if (cardNumber.value.trim() && !/^\d{16}$/.test(cardNumber.value.replace(/\s/g, ''))) {
            isValid = false;
            cardNumber.classList.add('error');
        }
        
        const expiry = document.getElementById('expiry');
        if (expiry.value.trim() && !/^\d{2}\/\d{2}$/.test(expiry.value)) {
            isValid = false;
            expiry.classList.add('error');
        }
        
        const cvv = document.getElementById('cvv');
        if (cvv.value.trim() && !/^\d{3,4}$/.test(cvv.value)) {
            isValid = false;
            cvv.classList.add('error');
        }
        
        return isValid;
    }
    
    // Display cart items in the order summary
    function displayCartItems() {
        const cart = cartManager.getCart();
        checkoutItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            checkoutItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
            return;
        }
        
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            
            itemElement.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${formatPrice(item.price)} × ${item.quantity}</div>
                </div>
                <div class="cart-item-total">
                    ${formatPrice(item.price * item.quantity)}
                </div>
            `;
            
            checkoutItemsContainer.appendChild(itemElement);
        });
        
        updateOrderSummary();
    }
    
    // Update order summary totals
    function updateOrderSummary() {
        const subtotal = cartManager.getSubtotal();
        const tax = cartManager.calculateTax(subtotal);
        const shipping = 5.99; // Fixed shipping cost
        const total = subtotal + tax + shipping;
        
        subtotalElement.textContent = formatPrice(subtotal);
        taxElement.textContent = formatPrice(tax);
        shippingElement.textContent = formatPrice(shipping);
        totalElement.textContent = formatPrice(total);
    }
    
    // Show the confirmation modal
    function showConfirmationModal(email) {
        const orderNumber = generateOrderNumber();
        orderNumberElement.textContent = orderNumber;
        confirmationEmailElement.textContent = email;
        
        confirmationModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    // Close the confirmation modal
    function closeConfirmationModal() {
        confirmationModal.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    // Process the checkout
    function processCheckout(e) {
        e.preventDefault();
        
        if (cartManager.getCart().length === 0) {
            alert('Your cart is empty. Please add items before checking out.');
            return;
        }
        
        if (!validateForm()) {
            alert('Please correct the errors in the form.');
            return;
        }
        
        // In a real app, this would send data to a payment processor
        // For this demo, we'll just show confirmation and clear the cart
        
        const email = document.getElementById('email').value;
        
        // "Process payment" - in a real app, this would call a payment API
        setTimeout(() => {
            // Clear the cart
            cartManager.clearCart();
            updateCartCount();
            
            // Show confirmation
            showConfirmationModal(email);
        }, 1000);
    }
    
    // Event Listeners
    checkoutForm.addEventListener('submit', processCheckout);
    
    closeConfirmationButton.addEventListener('click', closeConfirmationModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === confirmationModal) {
            closeConfirmationModal();
        }
    });
    
    // Initialize
    displayCartItems();
    updateCartCount();
});
