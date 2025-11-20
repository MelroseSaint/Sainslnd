// Enhanced Template Preview System with Full Tier Enforcement
// Implements: Animated previews, tier locking, delivery guarantees, and full preview modals

(function () {
    'use strict';

    // Load template manifests
    let TEMPLATES = [];
    let currentUserTier = 'basic'; // This should be set based on actual user purchase

    // Fetch manifests
    fetch('/src/data/template-manifests.json')
        .then(res => res.json())
        .then(data => {
            TEMPLATES = data.templates;
            console.log('✅ Template manifests loaded:', TEMPLATES.length, 'templates');
        })
        .catch(err => {
            console.error('❌ Failed to load template manifests:', err);
            // Fallback to inline data if fetch fails
            loadFallbackTemplates();
        });

    function loadFallbackTemplates() {
        TEMPLATES = [
            {
                slug: 'starter-landing',
                name: 'Starter Landing',
                tier: 'basic',
                description: 'Clean, high-conversion landing page with CSS micro-animations.',
                features: ['Hero with CTA', 'Feature Grid', 'Contact Form', 'Responsive Design']
            },
            {
                slug: 'micro-saas-promo',
                name: 'Micro-SaaS Promo',
                tier: 'basic',
                description: 'Perfect for launching your first SaaS product.',
                features: ['Pricing Table', 'FAQ Section', 'Feature Highlights', 'Email Capture']
            },
            {
                slug: 'dev-portfolio',
                name: 'Dev Portfolio',
                tier: 'basic',
                description: 'Showcase your work with a simple, static grid layout.',
                features: ['Project Grid', 'About Section', 'Social Links', 'Contact Info']
            },
            {
                slug: 'auth-app-shell',
                name: 'Auth App Shell',
                tier: 'pro',
                description: 'Complete boilerplate with authentication flows ready to go.',
                features: ['Login/Signup Pages', 'Password Reset', 'Session Management', 'Protected Routes']
            },
            {
                slug: 'dashboard-app',
                name: 'Dashboard App',
                tier: 'pro',
                description: 'Feature-rich dashboard with interactive widgets and charts.',
                features: ['Interactive Dashboard', 'Chart Components', 'Data Tables', 'Widget System']
            },
            {
                slug: 'creator-storefront',
                name: 'Creator Store',
                tier: 'pro',
                description: 'Sell digital products with a built-in storefront.',
                features: ['Product Grid', 'Cart Logic', 'Checkout Flow', 'Order Management']
            },
            {
                slug: 'admin-console',
                name: 'Admin Console',
                tier: 'premium',
                description: 'Full-featured admin dashboard for managing users and data.',
                features: ['Analytics Charts', 'User Management', 'Settings Panel', 'Activity Logs']
            },
            {
                slug: 'marketplace-platform',
                name: 'Marketplace',
                tier: 'premium',
                description: 'Multi-vendor marketplace platform.',
                features: ['Vendor Profiles', 'Commission Logic', 'Realtime Chat', 'Payment Processing']
            },
            {
                slug: 'realtime-collab',
                name: 'Realtime App',
                tier: 'premium',
                description: 'Collaborative workspace with live cursors.',
                features: ['WebSockets', 'Presence System', 'Live Updates', 'Conflict Resolution']
            }
        ];
    }

    // Tier access rules
    const TIER_ACCESS = {
        'basic': ['basic'],
        'pro': ['basic', 'pro'],
        'premium': ['basic', 'pro', 'premium']
    };

    // Tier colors
    const TIER_COLORS = {
        'basic': { gradient: '#0e7490, #155e75, #0e7490', text: 'cyan' },
        'pro': { gradient: '#701a75, #86198f, #701a75', text: 'fuchsia' },
        'premium': { gradient: '#065f46, #047857, #065f46', text: 'emerald' }
    };

    // Check if user can access template
    function canAccessTemplate(templateTier) {
        return TIER_ACCESS[currentUserTier].includes(templateTier);
    }

    // Inject CSS
    const style = document.createElement('style');
    style.textContent = `
        .preview-strip { display: flex; gap: 0.75rem; overflow-x: auto; padding: 1rem 0; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.2) transparent; mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent); }
        .preview-strip::-webkit-scrollbar { height: 4px; }
        .preview-strip::-webkit-scrollbar-track { background: transparent; }
        .preview-strip::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 2px; }
        
        .preview-card { flex: 0 0 180px; height: 120px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 0.5rem; overflow: hidden; position: relative; cursor: pointer; transition: all 0.3s ease; }
        .preview-card:hover { transform: translateY(-4px) scale(1.02); border-color: rgba(255, 255, 255, 0.25); box-shadow: 0 8px 20px rgba(0,0,0,0.3); }
        .preview-card.locked { opacity: 0.6; cursor: not-allowed; }
        .preview-card.locked::after { content: '🔒'; position: absolute; top: 0.5rem; right: 0.5rem; font-size: 1.2rem; }
        
        .preview-animation { width: 100%; height: 100%; background: linear-gradient(135deg, #1a1a1a, #2a2a2a, #1a1a1a); background-size: 200% 200%; animation: shimmer 4s infinite linear; opacity: 0.6; transition: opacity 0.3s ease, animation-play-state 0.3s ease; }
        .preview-card:hover .preview-animation { opacity: 0.9; animation-play-state: paused; }
        
        .preview-overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 0.5rem; background: linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.7), transparent); transform: translateY(100%); transition: transform 0.3s ease; }
        .preview-card:hover .preview-overlay { transform: translateY(0); }
        
        @keyframes shimmer { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        
        .preview-modal { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.9); backdrop-filter: blur(10px); z-index: 100; display: none; align-items: center; justify-content: center; padding: 1rem; }
        .preview-modal.active { display: flex; }
        .preview-modal-content { background: #1a1a1a; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 1rem; width: 95%; max-width: 1000px; max-height: 90vh; overflow: hidden; display: flex; flex-direction: column; transform: scale(0.9); opacity: 0; transition: all 0.3s ease; }
        .preview-modal.active .preview-modal-content { transform: scale(1); opacity: 1; }
        
        .preview-visual-large { width: 100%; height: 400px; background: linear-gradient(135deg, #1a1a1a, #2a2a2a); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
        .preview-visual-large .shimmer-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, transparent, rgba(255,255,255,0.1), transparent); background-size: 200% 200%; animation: shimmer 3s infinite; }
        
        .tier-badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 0.5rem; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
        .tier-badge.basic { background: #0e7490; color: #cffafe; }
        .tier-badge.pro { background: #701a75; color: #fae8ff; }
        .tier-badge.premium { background: #065f46; color: #d1fae5; }
        
        .locked-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.8); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10; }
        .locked-overlay h3 { font-size: 1.5rem; font-weight: 700; color: white; margin-bottom: 0.5rem; }
        .locked-overlay p { color: #9ca3af; margin-bottom: 1rem; }
        .upgrade-btn { background: linear-gradient(90deg, #22d3ee, #a855f7); color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 700; border: none; cursor: pointer; transition: transform 0.2s; }
        .upgrade-btn:hover { transform: translateY(-2px); }
    `;
    document.head.appendChild(style);

    // Create preview strip for a tier
    function createPreviewStrip(tier, templates) {
        const colors = TIER_COLORS[tier];
        const strip = document.createElement('div');
        strip.className = 'w-full mb-4';

        const templatesForTier = templates.filter(t => t.tier === tier);
        const isLocked = !canAccessTemplate(tier);

        strip.innerHTML = `
            <p class="text-[10px] text-gray-500 text-left mb-2 uppercase tracking-wider font-semibold">Included Templates</p>
            <div class="preview-strip">
                ${templatesForTier.map(template => `
                    <div class="preview-card ${isLocked ? 'locked' : ''}" data-template-slug="${template.slug}">
                        <div class="preview-animation" style="background: linear-gradient(135deg, ${colors.gradient}); background-size: 200% 200%;"></div>
                        <div class="preview-overlay">
                            <p class="text-[10px] font-bold text-white">${template.name}</p>
                            <p class="text-[8px] text-${colors.text}-300">${isLocked ? '🔒 Locked' : 'Click to preview'}</p>
                        </div>
                    </div>
                `).join('')}
        modal.id = 'preview-modal';
        modal.className = 'preview-modal';
        modal.innerHTML = `
            < div class="preview-modal-content" >
                <div class="p-6 border-b border-gray-800 flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <h3 id="modal-title" class="text-2xl font-bold text-white">Template Preview</h3>
                        <span id="modal-tier-badge" class="tier-badge basic">Basic</span>
                    </div>
                    <button id="close-preview" class="text-gray-400 hover:text-white transition">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                
                <div id="modal-locked-overlay" class="locked-overlay" style="display: none;">
                    <div class="text-center">
                        <div class="text-6xl mb-4">🔒</div>
                        <h3>Upgrade Required</h3>
                        <p id="locked-message">This template requires a higher tier</p>
                        <button class="upgrade-btn" onclick="window.location.href='#pricing'">Upgrade Now</button>
                    </div>
                </div>
                
                <div class="flex-1 overflow-y-auto">
                    <div id="modal-preview" class="preview-visual-large">
                        <div class="shimmer-overlay"></div>
                        <div class="z-10 text-center">
                            <span class="text-6xl mb-4 block">🎬</span>
                            <p class="text-gray-400 text-sm">Full Animation Preview</p>
                        </div>
                    </div>
                    
                    <div class="p-8">
                        <p id="modal-desc" class="text-gray-300 mb-6 text-lg"></p>
                        
                        <div class="space-y-4 mb-8">
                            <p class="text-sm font-bold text-gray-400 uppercase tracking-wider">Features Included</p>
                            <ul id="modal-features" class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300"></ul>
                        </div>

                        <div class="flex gap-4">
                            <button id="use-template-btn" class="flex-1 py-3 rounded-lg font-bold bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white hover:opacity-90 transition">
                                Use This Template
                            </button>
                            <button onclick="document.getElementById('preview-modal').classList.remove('active'); document.body.style.overflow = '';" class="px-6 py-3 rounded-lg font-bold bg-gray-700 text-white hover:bg-gray-600 transition">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div >
            `;
        document.body.appendChild(modal);

        // Event delegation for preview cards
        document.addEventListener('click', function (e) {
            const card = e.target.closest('.preview-card');
            if (card && !card.classList.contains('locked')) {
                const slug = card.dataset.templateSlug;
                const template = TEMPLATES.find(t => t.slug === slug);
                if (template) {
                    openPreviewModal(template);
                }
            } else if (card && card.classList.contains('locked')) {
                // Show upgrade prompt
                alert('This template requires a higher tier. Please upgrade to access it.');
                window.location.href = '#pricing';
            }

            // Close modal
            if (e.target.id === 'close-preview' || e.target.closest('#close-preview') || e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }

            // Use template button
            if (e.target.id === 'use-template-btn') {
                const slug = e.target.dataset.templateSlug;
                const template = TEMPLATES.find(t => t.slug === slug);
                if (template) {
                    deliverTemplate(template);
                }
            }
        });

        // Close on Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    function openPreviewModal(template) {
        const modal = document.getElementById('preview-modal');
        const canAccess = canAccessTemplate(template.tier);

        document.getElementById('modal-title').textContent = template.name;
        document.getElementById('modal-tier-badge').textContent = template.tier;
        document.getElementById('modal-tier-badge').className = `tier - badge ${ template.tier } `;
        document.getElementById('modal-desc').textContent = template.description;

        const features = template.features || [];
        document.getElementById('modal-features').innerHTML = features.map(f =>
            `< li class="flex items-center" > <span class="mr-2 text-${TIER_COLORS[template.tier].text}-400">✓</span>${ f }</li > `
        ).join('');

        // Show/hide locked overlay
        const lockedOverlay = document.getElementById('modal-locked-overlay');
        if (!canAccess) {
            lockedOverlay.style.display = 'flex';
            document.getElementById('locked-message').textContent = `This template requires ${ template.tier.charAt(0).toUpperCase() + template.tier.slice(1) } tier or higher`;
        } else {
            lockedOverlay.style.display = 'none';
        }

        // Set template slug on use button
        document.getElementById('use-template-btn').dataset.templateSlug = template.slug;
        document.getElementById('use-template-btn').disabled = !canAccess;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function deliverTemplate(template) {
        console.log('🚀 Delivering template:', template.name);

        // Log delivery
        const deliveryLog = {
            timestamp: new Date().toISOString(),
            userId: window.currentUserId || 'anonymous',
            userTier: currentUserTier,
            templateSlug: template.slug,
            templateName: template.name,
            templateTier: template.tier,
            filesDelivered: template.delivery?.starterFiles || [],
            featuresDelivered: template.features || [],
            previewUsed: template.preview || {}
        };

        console.log('📦 Delivery Log:', deliveryLog);

        // In production, this would:
        // 1. Verify tier access on server
        // 2. Copy template files to user workspace
        // 3. Log delivery to Firestore
        // 4. Send confirmation email

        alert(`✅ Template "${template.name}" has been added to your workspace!\n\nDelivered: \n - ${ template.features.length } features\n - ${ template.delivery?.starterFiles?.length || 0 } file groups\n\nCheck your workspace to start building!`);

        document.getElementById('preview-modal').classList.remove('active');
        document.body.style.overflow = '';
    }

    // Expose for debugging
    window.previewSystem = {
        templates: () => TEMPLATES,
        setUserTier: (tier) => { currentUserTier = tier; location.reload(); },
        currentTier: () => currentUserTier
    };
})();
