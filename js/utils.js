/**
 * Utility functions for MerchStore
 */

/**
 * Format currency value
 * @param {number} value - Value to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(value);
}

/**
 * Calculate tax amount
 * @param {number} amount - Amount to calculate tax for
 * @param {number} taxRate - Tax rate as decimal (default: 0.08 for 8%)
 * @returns {number} Calculated tax amount
 */
function calculateTax(amount, taxRate = 0.08) {
    return amount * taxRate;
}

/**
 * Truncate text to a specific length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength) + '...';
}

/**
 * Show notification popup
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, info)
 * @param {number} duration - Duration in milliseconds
 */
function showNotification(message, type = 'info', duration = 3000) {
    // Check if notification container exists, create if not
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        document.body.appendChild(container);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-message">${message}</div>
        <button class="notification-close">&times;</button>
    `;
    
    // Add to container
    container.appendChild(notification);
    
    // Add event listener for close button
    const closeButton = notification.querySelector('.notification-close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                container.removeChild(notification);
            }, 300);
        });
    }
    
    // Auto-remove after duration
    setTimeout(() => {
        if (notification.parentNode === container) {
            notification.classList.add('fade-out');
            setTimeout(() => {
                if (notification.parentNode === container) {
                    container.removeChild(notification);
                }
            }, 300);
        }
    }, duration);
}

/**
 * Validate email address
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}

/**
 * Generate a random order ID
 * @returns {string} Random order ID
 */
function generateOrderId() {
    // Create a timestamp component
    const timestamp = new Date().getTime().toString().slice(-6);
    
    // Create a random component
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    // Combine with a prefix
    return `MS-${timestamp}-${random}`;
}

/**
 * Get URL query parameters
 * @param {string} name - Parameter name
 * @returns {string|null} Parameter value or null if not found
 */
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}
