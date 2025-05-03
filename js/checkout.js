/**
 * Checkout functionality - Main script for checkout.html
 */
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutItemsContainer = document.getElementById('checkout-items');
    const checkoutSubtotal = document.getElementById('checkout-subtotal');
    const checkoutTax = document.getElementById('checkout-tax');
    const checkoutShipping = document.getElementById('checkout-shipping');
    const checkoutTotal = document.getElementById('checkout-total');
    const confirmationModal = document.getElementById('confirmation-modal');
    const orderIdElement = document.getElementById('order-id');
    const confirmationEmailElement = document.getElementById('confirmation-email');
    const closeConfirmationButton = confirmationModal.querySelector('.close');
    const continueButton = document.getElementById('continue-button');
    
    // Default shipping cost
    const shippingCost = 5.00;
    
    /**
     * Initialize checkout page
     */
    function init() {
        // Check if cart has items
        if (cartManager.getItems().length === 0) {
            // Redirect to shop page if cart is empty
            window.location.href = 'index.html';
            return;
        }
        
        // Display order summary
        displayOrderSummary();
        
        // Update cart count badge
        cartManager.updateCartCount();
        
        // Set up event listeners
        setupEventListeners();
    }
    
    /**
     * Display order summary
     */
    function displayOrderSummary() {
        // Display cart items
        displayCartItems();
        
        // Update summary totals
        updateSummaryTotals();
    }
    
    /**
     * Display cart items in checkout
     */
    function displayCartItems() {
        if (!checkoutItemsContainer) return;
        
        // Clear container
        checkoutItemsContainer.innerHTML = '';
        
        // Get cart items
        const items = cartManager.getItems();
        
        // Create item elements
        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'checkout-item';
            
            itemElement.innerHTML = `
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>${formatCurrency(item.price)} × ${item.quantity}</p>
                </div>
                <div class="item-total">
                    ${formatCurrency(item.price * item.quantity)}
                </div>
            `;
            
            checkoutItemsContainer.appendChild(itemElement);
        });
    }
    
    /**
     * Update summary totals
     */
    function updateSummaryTotals() {
        const subtotal = cartManager.getSubtotal();
        const tax = cartManager.getTax();
        const total = subtotal + tax + shippingCost;
        
        if (checkoutSubtotal) {
            checkoutSubtotal.textContent = formatCurrency(subtotal);
        }
        
        if (checkoutTax) {
            checkoutTax.textContent = formatCurrency(tax);
        }
        
        if (checkoutShipping) {
            checkoutShipping.textContent = formatCurrency(shippingCost);
        }
        
        if (checkoutTotal) {
            checkoutTotal.textContent = formatCurrency(total);
        }
    }
    
    /**
     * Set up event listeners
     */
    function setupEventListeners() {
        // Checkout form submission
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', handleCheckoutSubmit);
        }
        
        // Close confirmation modal
        if (closeConfirmationButton) {
            closeConfirmationButton.addEventListener('click', closeConfirmationModal);
        }
        
        // Continue shopping button
        if (continueButton) {
            continueButton.addEventListener('click', function() {
                window.location.href = 'index.html';
            });
        }
        
        // Input validation for card number (numbers only)
        const cardNumberInput = document.getElementById('card-number');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', function() {
                this.value = this.value.replace(/[^\d\s]/g, '');
            });
        }
        
        // Input validation for expiry date (MM/YY format)
        const expiryDateInput = document.getElementById('expiry-date');
        if (expiryDateInput) {
            expiryDateInput.addEventListener('input', function() {
                this.value = this.value.replace(/[^\d/]/g, '');
                if (this.value.length === 2 && !this.value.includes('/')) {
                    this.value += '/';
                }
            });
        }
        
        // Input validation for CVV (numbers only)
        const cvvInput = document.getElementById('cvv');
        if (cvvInput) {
            cvvInput.addEventListener('input', function() {
                this.value = this.value.replace(/\D/g, '');
            });
        }
    }
    
    /**
     * Handle checkout form submission
     * @param {Event} event - Form submit event
     */
    function handleCheckoutSubmit(event) {
        event.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Process order
        processOrder();
    }
    
    /**
     * Validate checkout form
     * @returns {boolean} Validation result
     */
    function validateForm() {
        // Get form inputs
        const fullName = document.getElementById('full-name').value.trim();
        const email = document.getElementById('email').value.trim();
        const address = document.getElementById('address').value.trim();
        const city = document.getElementById('city').value.trim();
        const state = document.getElementById('state').value.trim();
        const zip = document.getElementById('zip').value.trim();
        const country = document.getElementById('country').value;
        const cardName = document.getElementById('card-name').value.trim();
        const cardNumber = document.getElementById('card-number').value.trim();
        const expiryDate = document.getElementById('expiry-date').value.trim();
        const cvv = document.getElementById('cvv').value.trim();
        
        // Check required fields
        if (!fullName || !email || !address || !city || !state || !zip || !country || 
            !cardName || !cardNumber || !expiryDate || !cvv) {
            showNotification('Please fill in all required fields', 'error');
            return false;
        }
        
        // Validate email
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return false;
        }
        
        // Validate card number (simple check for 16 digits)
        const cardNumberClean = cardNumber.replace(/\s/g, '');
        if (cardNumberClean.length !== 16 || isNaN(cardNumberClean)) {
            showNotification('Please enter a valid card number', 'error');
            return false;
        }
        
        // Validate expiry date (MM/YY format)
        const expiryPattern = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
        if (!expiryPattern.test(expiryDate)) {
            showNotification('Please enter a valid expiry date (MM/YY)', 'error');
            return false;
        }
        
        // Validate CVV (3 or 4 digits)
        if (cvv.length < 3 || cvv.length > 4 || isNaN(cvv)) {
            showNotification('Please enter a valid CVV', 'error');
            return false;
        }
        
        return true;
    }
    
    /**
     * Process order
     */
    function processOrder() {
        // Generate order ID
        const orderId = generateOrderId();
        
        // Get customer email
        const email = document.getElementById('email').value.trim();
        
        // Simulate order processing (would normally send to a server)
        setTimeout(() => {
            // Clear cart
            cartManager.clearCart();
            
            // Show confirmation modal
            showConfirmationModal(orderId, email);
        }, 1000);
    }
    
    /**
     * Show confirmation modal
     * @param {string} orderId - Order ID
     * @param {string} email - Customer email
     */
    function showConfirmationModal(orderId, email) {
        if (!confirmationModal) return;
        
        // Set order ID and email
        if (orderIdElement) {
            orderIdElement.textContent = orderId;
        }
        
        if (confirmationEmailElement) {
            confirmationEmailElement.textContent = email;
        }
        
        // Show modal
        confirmationModal.style.display = 'flex';
        
        // Add body class to prevent scrolling
        document.body.classList.add('modal-open');
    }
    
    /**
     * Close confirmation modal
     */
    function closeConfirmationModal() {
        if (!confirmationModal) return;
        
        // Hide modal
        confirmationModal.style.display = 'none';
        
        // Remove body class
        document.body.classList.remove('modal-open');
        
        // Redirect to shop page
        window.location.href = 'index.html';
    }
    
    // Initialize checkout page
    init();
});
