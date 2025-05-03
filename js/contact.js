/**
 * Contact Form functionality
 */
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const contactForm = document.getElementById('contact-form');
    
    /**
     * Initialize the contact page
     */
    function init() {
        // Set up event listeners
        setupEventListeners();
        
        // Update cart count (shared with store.js)
        if (typeof cartManager !== 'undefined') {
            cartManager.updateCartCount();
        }
    }
    
    /**
     * Set up event listeners for the contact page
     */
    function setupEventListeners() {
        // Form submission
        if (contactForm) {
            contactForm.addEventListener('submit', handleFormSubmit);
        }
        
        // Cart functionality (shared with store.js)
        const cartButton = document.getElementById('cart-button');
        const closeCartButton = document.querySelector('.modal-header .close');
        const continueShoppingButton = document.getElementById('continue-shopping');
        
        if (cartButton && typeof openCartModal === 'function') {
            cartButton.addEventListener('click', function(event) {
                event.preventDefault();
                openCartModal();
            });
        }
        
        if (closeCartButton && typeof closeCartModal === 'function') {
            closeCartButton.addEventListener('click', closeCartModal);
        }
        
        if (continueShoppingButton && typeof closeCartModal === 'function') {
            continueShoppingButton.addEventListener('click', closeCartModal);
        }
    }
    
    /**
     * Handle contact form submission
     * @param {Event} event - Form submission event
     */
    function handleFormSubmit(event) {
        event.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Validate email
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Create submission message
        const submissionMessage = document.createElement('div');
        submissionMessage.className = 'submission-message success';
        submissionMessage.innerHTML = '<h4>Thank you for your message!</h4><p>We have received your inquiry and will get back to you as soon as possible.</p>';
        
        // Replace form with success message
        contactForm.style.display = 'none';
        contactForm.parentNode.insertBefore(submissionMessage, contactForm.nextSibling);
        
        // In a real application, you would send the form data to a server here
        console.log('Form submission:', { name, email, subject, message });
        
        // Show notification
        showNotification('Message sent successfully!', 'success');
        
        // Reset form (hidden but reset for good practice)
        contactForm.reset();
    }
    
    // Initialize the contact page
    init();
});
