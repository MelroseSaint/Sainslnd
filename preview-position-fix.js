// Preview System Position Fix
// This ensures preview cards appear BEFORE the features list, not after the price

document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        console.log('🔧 Adjusting preview card positions...');

        // Find all preview strips that were inserted after the price
        const pricingCards = document.querySelectorAll('.pricing-card');

        pricingCards.forEach((card, index) => {
            // Find the preview strip (if it exists)
            const previewStrip = card.querySelector('.w-full.mb-4');
            const featuresList = card.querySelector('ul.space-y-3');

            // If preview strip exists and features list exists
            if (previewStrip && featuresList) {
                // Move preview strip to be before the features list
                featuresList.parentNode.insertBefore(previewStrip, featuresList);
                console.log(`✅ Moved preview strip for tier ${index + 1}`);
            }
        });
    }, 1000); // Wait for preview-system.js to finish
});
