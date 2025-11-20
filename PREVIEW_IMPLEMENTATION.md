# Template Preview Implementation Plan

## Overview
Add animated preview thumbnails directly under each pricing tier (Basic, Pro, Premium) to showcase included templates.

## Implementation Steps

### 1. Add CSS for Preview Cards (in index.html `<style>` section)

```css
/* Preview Strip Styles */
.preview-strip {
    display: flex;
    gap: 0.75rem;
    overflow-x: auto;
    padding: 1rem 0;
    scrollbar-width: thin;
    scrollbar-color: rgba(255,255,255,0.2) transparent;
    mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
}

.preview-strip::-webkit-scrollbar {
    height: 4px;
}

.preview-strip::-webkit-scrollbar-track {
    background: transparent;
}

.preview-strip::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.2);
    border-radius: 2px;
}

.preview-card {
    flex: 0 0 180px;
    height: 120px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 0.5rem;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;
}

.preview-card:hover {
    transform: translateY(-4px) scale(1.02);
    border-color: rgba(255, 255, 255, 0.25);
    box-shadow: 0 8px 20px rgba(0,0,0,0.3);
}

.preview-animation {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #1a1a1a, #2a2a2a, #1a1a1a);
    background-size: 200% 200%;
    animation: shimmer 4s infinite linear;
    opacity: 0.6;
    transition: opacity 0.3s ease, animation-play-state 0.3s ease;
}

.preview-card:hover .preview-animation {
    opacity: 0.9;
    animation-play-state: paused;
}

.preview-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0.5rem;
    background: linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.7), transparent);
    transform: translateY(100%);
    transition: transform 0.3s ease;
}

.preview-card:hover .preview-overlay {
    transform: translateY(0);
}

@keyframes shimmer {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

/* Modal Styles */
.preview-modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(8px);
    z-index: 100;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}

.preview-modal.active {
    display: flex;
}

.preview-modal-content {
    background: #1a1a1a;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    width: 90%;
    max-width: 900px;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transform: scale(0.95);
    opacity: 0;
    transition: all 0.3s ease;
}

.preview-modal.active .preview-modal-content {
    transform: scale(1);
    opacity: 1;
}
```

### 2. Add HTML Structure (insert after each tier's price, before features list)

**For Basic Tier (after line with `<p class="text-5xl font-extrabold mb-6">$40</p>`):**

```html
<!-- Basic Tier Previews -->
<div class="w-full mb-4">
    <p class="text-[10px] text-gray-500 text-left mb-2 uppercase tracking-wider font-semibold">Included Templates</p>
    <div class="preview-strip">
        <div class="preview-card" onclick="openPreview('basic_landing')">
            <div class="preview-animation" style="background: linear-gradient(135deg, #0e7490, #155e75, #0e7490); background-size: 200% 200%;"></div>
            <div class="preview-overlay">
                <p class="text-[10px] font-bold text-white">Starter Landing</p>
                <p class="text-[8px] text-cyan-300">Click to preview</p>
            </div>
        </div>
        <div class="preview-card" onclick="openPreview('basic_saas')">
            <div class="preview-animation" style="background: linear-gradient(135deg, #0e7490, #155e75, #0e7490); background-size: 200% 200%;"></div>
            <div class="preview-overlay">
                <p class="text-[10px] font-bold text-white">Micro-SaaS</p>
                <p class="text-[8px] text-cyan-300">Click to preview</p>
            </div>
        </div>
        <div class="preview-card" onclick="openPreview('basic_portfolio')">
            <div class="preview-animation" style="background: linear-gradient(135deg, #0e7490, #155e75, #0e7490); background-size: 200% 200%;"></div>
            <div class="preview-overlay">
                <p class="text-[10px] font-bold text-white">Dev Portfolio</p>
                <p class="text-[8px] text-cyan-300">Click to preview</p>
            </div>
        </div>
    </div>
</div>
```

**For Pro Tier:**

```html
<!-- Pro Tier Previews -->
<div class="w-full mb-4">
    <p class="text-[10px] text-gray-500 text-left mb-2 uppercase tracking-wider font-semibold">Included Templates</p>
    <div class="preview-strip">
        <div class="preview-card" onclick="openPreview('pro_auth')">
            <div class="preview-animation" style="background: linear-gradient(135deg, #701a75, #86198f, #701a75); background-size: 200% 200%;"></div>
            <div class="preview-overlay">
                <p class="text-[10px] font-bold text-white">Auth App Shell</p>
                <p class="text-[8px] text-fuchsia-300">Click to preview</p>
            </div>
        </div>
        <div class="preview-card" onclick="openPreview('pro_cms')">
            <div class="preview-animation" style="background: linear-gradient(135deg, #701a75, #86198f, #701a75); background-size: 200% 200%;"></div>
            <div class="preview-overlay">
                <p class="text-[10px] font-bold text-white">Content Manager</p>
                <p class="text-[8px] text-fuchsia-300">Click to preview</p>
            </div>
        </div>
        <div class="preview-card" onclick="openPreview('pro_store')">
            <div class="preview-animation" style="background: linear-gradient(135deg, #701a75, #86198f, #701a75); background-size: 200% 200%;"></div>
            <div class="preview-overlay">
                <p class="text-[10px] font-bold text-white">Creator Store</p>
                <p class="text-[8px] text-fuchsia-300">Click to preview</p>
            </div>
        </div>
    </div>
</div>
```

**For Premium Tier:**

```html
<!-- Premium Tier Previews -->
<div class="w-full mb-4">
    <p class="text-[10px] text-gray-500 text-left mb-2 uppercase tracking-wider font-semibold">Included Templates</p>
    <div class="preview-strip">
        <div class="preview-card" onclick="openPreview('prem_admin')">
            <div class="preview-animation" style="background: linear-gradient(135deg, #065f46, #047857, #065f46); background-size: 200% 200%;"></div>
            <div class="preview-overlay">
                <p class="text-[10px] font-bold text-white">Admin Console</p>
                <p class="text-[8px] text-emerald-300">Click to preview</p>
            </div>
        </div>
        <div class="preview-card" onclick="openPreview('prem_market')">
            <div class="preview-animation" style="background: linear-gradient(135deg, #065f46, #047857, #065f46); background-size: 200% 200%;"></div>
            <div class="preview-overlay">
                <p class="text-[10px] font-bold text-white">Marketplace</p>
                <p class="text-[8px] text-emerald-300">Click to preview</p>
            </div>
        </div>
        <div class="preview-card" onclick="openPreview('prem_collab')">
            <div class="preview-animation" style="background: linear-gradient(135deg, #065f46, #047857, #065f46); background-size: 200% 200%;"></div>
            <div class="preview-overlay">
                <p class="text-[10px] font-bold text-white">Realtime App</p>
                <p class="text-[8px] text-emerald-300">Click to preview</p>
            </div>
        </div>
    </div>
</div>
```

### 3. Add Modal HTML (before closing `</body>` tag)

```html
<!-- Preview Modal -->
<div id="preview-modal" class="preview-modal">
    <div class="preview-modal-content">
        <div class="p-6 border-b border-gray-800 flex justify-between items-center">
            <div>
                <h3 id="modal-title" class="text-2xl font-bold text-white">Template Preview</h3>
                <p id="modal-tier" class="text-sm text-gray-400 mt-1"></p>
            </div>
            <button onclick="closePreview()" class="text-gray-400 hover:text-white transition">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
        <div class="flex-1 overflow-y-auto p-8">
            <div id="modal-preview" class="w-full h-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-6 flex items-center justify-center">
                <span class="text-6xl">🎬</span>
            </div>
            <p id="modal-desc" class="text-gray-300 mb-4"></p>
            <div class="space-y-2">
                <p class="text-sm font-bold text-gray-400 uppercase">Features</p>
                <ul id="modal-features" class="text-sm text-gray-300 space-y-1"></ul>
            </div>
        </div>
    </div>
</div>
```

### 4. Add JavaScript (in main.js at the end)

```javascript
// Preview Modal Logic
const PREVIEW_DATA = {
    'basic_landing': { title: 'Starter Landing', tier: 'Basic', desc: 'Clean, high-conversion landing page with CSS micro-animations.', features: ['Hero with CTA', 'Feature Grid', 'Contact Form', 'Responsive Design'] },
    'basic_saas': { title: 'Micro-SaaS Promo', tier: 'Basic', desc: 'Perfect for launching your first SaaS product.', features: ['Pricing Table', 'FAQ Section', 'Feature Highlights', 'Email Capture'] },
    'basic_portfolio': { title: 'Dev Portfolio', tier: 'Basic', desc: 'Showcase your work with a simple, static grid layout.', features: ['Project Grid', 'About Section', 'Social Links', 'Contact Info'] },
    
    'pro_auth': { title: 'Auth App Shell', tier: 'Pro', desc: 'Complete boilerplate with authentication flows ready to go.', features: ['Login/Signup Pages', 'Password Reset', 'Session Management', 'Protected Routes'] },
    'pro_cms': { title: 'Content Manager', tier: 'Pro', desc: 'Headless CMS integration for managing your content.', features: ['Rich Text Editor', 'Media Library', 'Draft Mode', 'API Integration'] },
    'pro_store': { title: 'Creator Store', tier: 'Pro', desc: 'Sell digital products with a built-in storefront.', features: ['Product Grid', 'Cart Logic', 'Checkout Flow', 'Order Management'] },

    'prem_admin': { title: 'Admin Console', tier: 'Premium', desc: 'Full-featured admin dashboard for managing users and data.', features: ['Analytics Charts', 'User Management', 'Settings Panel', 'Activity Logs'] },
    'prem_market': { title: 'Marketplace', tier: 'Premium', desc: 'Multi-vendor marketplace platform.', features: ['Vendor Profiles', 'Commission Logic', 'Realtime Chat', 'Payment Processing'] },
    'prem_collab': { title: 'Realtime App', tier: 'Premium', desc: 'Collaborative workspace with live cursors.', features: ['WebSockets', 'Presence System', 'Live Updates', 'Conflict Resolution'] }
};

window.openPreview = function(id) {
    const data = PREVIEW_DATA[id];
    if (!data) return;

    const modal = document.getElementById('preview-modal');
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-tier').textContent = `${data.tier} Tier Template`;
    document.getElementById('modal-desc').textContent = data.desc;
    document.getElementById('modal-features').innerHTML = data.features.map(f => 
        `<li class="flex items-center"><span class="mr-2 text-gray-500">●</span>${f}</li>`
    ).join('');

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.closePreview = function() {
    const modal = document.getElementById('preview-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
};

// Close on backdrop click
document.getElementById('preview-modal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closePreview();
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePreview();
});
```

## Summary

This implementation adds:
1. **3 preview cards per tier** - horizontally scrollable
2. **Animated shimmer effect** - looping gradient animation
3. **Hover interactions** - pause animation, show overlay
4. **Click to expand** - full modal with details
5. **Tier-specific colors** - cyan for Basic, fuchsia for Pro, emerald for Premium
6. **Responsive design** - works on all screen sizes

The previews are purely visual and don't grant access - they're marketing tools to help users choose the right tier.
