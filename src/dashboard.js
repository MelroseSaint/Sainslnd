import { TEMPLATE_MANIFEST, TIER_LEVELS } from './data/templates.js';

// --- STATE ---
let currentUserTier = 'Basic'; // Default for demo

// --- DOM ELEMENTS ---
const grid = document.getElementById('templates-grid');
const tierBadge = document.getElementById('user-tier-badge');
const tierSelect = document.getElementById('demo-tier-select');
const upgradeModal = document.getElementById('upgrade-modal');
const modalRequiredTier = document.getElementById('modal-required-tier');

// --- INITIALIZATION ---
function init() {
    // Handle demo tier switching
    tierSelect.addEventListener('change', (e) => {
        currentUserTier = e.target.value;
        renderDashboard();
    });

    // Initial Render
    renderDashboard();
}

// --- CORE LOGIC ---

/**
 * Renders the dashboard based on the current user tier.
 * Enforces the "Lock/Blur" logic described in the requirements.
 */
function renderDashboard() {
    // Update Header Badge
    updateTierBadge(currentUserTier);

    // Clear Grid
    grid.innerHTML = '';

    // Render Cards
    TEMPLATE_MANIFEST.forEach(template => {
        const isLocked = TIER_LEVELS[template.tier] > TIER_LEVELS[currentUserTier];
        const card = createTemplateCard(template, isLocked);
        grid.appendChild(card);
    });
}

function updateTierBadge(tier) {
    tierBadge.textContent = tier;
    tierBadge.className = `font-bold px-2 py-1 rounded ${getTierColor(tier)}`;
}

function getTierColor(tier) {
    switch (tier) {
        case 'Basic': return 'bg-cyan-900 text-cyan-300 border border-cyan-700';
        case 'Pro': return 'bg-fuchsia-900 text-fuchsia-300 border border-fuchsia-700';
        case 'Premium': return 'bg-emerald-900 text-emerald-300 border border-emerald-700';
        default: return 'bg-gray-700';
    }
}

/**
 * Creates the HTML element for a template card.
 */
function createTemplateCard(template, isLocked) {
    const div = document.createElement('div');
    div.className = `glass-container p-0 overflow-hidden flex flex-col h-full transition-all duration-300 ${isLocked ? 'opacity-70' : 'hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/10'}`;

    // Visual Lock Effect
    const lockOverlay = isLocked ? `
        <div class="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-4">
            <div class="bg-gray-800/90 p-3 rounded-full mb-3 border border-gray-600">
                <svg class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
            <span class="font-bold text-white tracking-wide uppercase text-sm">Locked</span>
            <span class="text-xs text-gray-300 mt-1">Requires ${template.tier}</span>
        </div>
    ` : '';

    // Preview Area (Mock)
    const previewColor = template.tier === 'Basic' ? 'bg-cyan-900/30' : (template.tier === 'Pro' ? 'bg-fuchsia-900/30' : 'bg-emerald-900/30');

    div.innerHTML = `
        <div class="relative h-40 ${previewColor} border-b border-white/5 flex items-center justify-center group">
            ${lockOverlay}
            <span class="text-4xl opacity-50 group-hover:scale-110 transition duration-500">
                ${getPreviewIcon(template.previewType)}
            </span>
            <div class="absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${getTierBadgeStyle(template.tier)}">
                ${template.tier}
            </div>
        </div>
        <div class="p-6 flex-grow flex flex-col">
            <h3 class="text-xl font-bold mb-2 text-white">${template.name}</h3>
            <p class="text-sm text-gray-400 mb-4 flex-grow">${template.description}</p>
            
            <div class="space-y-2 mb-6">
                ${template.features.map(f => `<div class="flex items-center text-xs text-gray-500"><span class="mr-2 text-cyan-500">●</span>${f}</div>`).join('')}
            </div>

            <button 
                onclick="window.handleUseTemplate('${template.id}', '${template.tier}')"
                class="w-full py-2 rounded-lg font-semibold text-sm transition-colors ${isLocked ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-cyan-700 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-900/20'}"
            >
                ${isLocked ? `Unlock ${template.tier}` : 'Use Template'}
            </button>
        </div>
    `;

    return div;
}

function getTierBadgeStyle(tier) {
    switch (tier) {
        case 'Basic': return 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30';
        case 'Pro': return 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30';
        case 'Premium': return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
            return 'bg-gray-500';
    }
}

function getPreviewIcon(type) {
    if (type === 'css') return '🎨';
    if (type === 'lottie') return '🎬';
    if (type === 'video') return '📹';
    return '📄';
}

// --- GLOBAL HANDLERS ---

window.handleUseTemplate = async (templateId, templateTier) => {
    // 1. INTEGRITY CHECK: Client-side pre-validation
    if (TIER_LEVELS[templateTier] > TIER_LEVELS[currentUserTier]) {
        // Auto-upgrade pathway logic
        modalRequiredTier.textContent = templateTier;
        upgradeModal.classList.remove('hidden');
        return;
    }

    // 2. LOGGING & CREATION
    console.log(`[Integrity Check] Validating access for User Tier: ${currentUserTier} -> Template Tier: ${templateTier}`);

    try {
        const response = await fetch('http://localhost:4242/api/log-delivery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: 'demo-user-123', // Mock ID
                userTier: currentUserTier,
                templateId: templateId,
                templateTier: templateTier,
                timestamp: new Date().toISOString()
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert(`Success! \n\nTemplate: ${templateId}\nBundle: ${result.bundle}\n\nIntegrity check passed. Files are being prepared.`);
        } else {
            alert(`Error: ${result.error}`);
        }

    } catch (error) {
        console.error('Delivery failed:', error);
        alert('System error during delivery validation.');
    }
};

// Start
init();
