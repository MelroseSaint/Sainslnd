// Stripe Initialization Fix
// This script ensures Stripe is properly initialized with the live key
(function () {
    'use strict';

    // Wait for Stripe.js to load
    function initStripe() {
        if (typeof Stripe === 'undefined') {
            setTimeout(initStripe, 100);
            return;
        }

        // Initialize Stripe with live key
        window.stripe = Stripe('pk_live_51SKEFvFoTgg7qKhJyOs8KmtHLlE1BQO35kHFYx1wK2s3vpm9131Zlui3wc1L4TyNh7CfZBNsmCWGA2HpTN1OlcrT00BZenzLg6');
        console.log('✅ Stripe initialized with live key');
    }

    // Start initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initStripe);
    } else {
        initStripe();
    }
})();
