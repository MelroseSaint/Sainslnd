export const TEMPLATE_MANIFEST = [
    {
        id: 'tpl_basic_landing',
        name: 'Minimalist Landing',
        tier: 'Basic',
        description: 'Clean, high-conversion landing page with CSS micro-animations.',
        features: ['CSS Animations', 'Responsive Layout', 'Contact Form'],
        previewType: 'css', // CSS/SVG only
        requiredFeatures: []
    },
    {
        id: 'tpl_basic_portfolio',
        name: 'Dev Portfolio',
        tier: 'Basic',
        description: 'Showcase your work with a simple, static grid layout.',
        features: ['Project Grid', 'About Section', 'Social Links'],
        previewType: 'css',
        requiredFeatures: []
    },
    {
        id: 'tpl_pro_saas',
        name: 'SaaS Starter',
        tier: 'Pro',
        description: 'Complete SaaS boilerplate with authentication and dashboard.',
        features: ['Authentication', 'User Dashboard', 'Lottie Animations'],
        previewType: 'lottie',
        requiredFeatures: ['auth', 'dashboard']
    },
    {
        id: 'tpl_pro_blog',
        name: 'Content Creator Blog',
        tier: 'Pro',
        description: 'CMS-integrated blog with rich media support.',
        features: ['CMS Integration', 'Newsletter Signup', 'Embedded Media'],
        previewType: 'lottie',
        requiredFeatures: ['cms']
    },
    {
        id: 'tpl_prem_marketplace',
        name: 'Full Marketplace',
        tier: 'Premium',
        description: 'Multi-vendor marketplace with realtime chat and admin console.',
        features: ['Realtime Chat', 'Admin Console', 'Stripe Connect', 'Video Previews'],
        previewType: 'video', // MP4 + Lottie
        requiredFeatures: ['realtime', 'admin', 'payments']
    },
    {
        id: 'tpl_prem_social',
        name: 'Social Network App',
        tier: 'Premium',
        description: 'Community platform with live feeds and notifications.',
        features: ['Live Feed', 'Notifications', 'User Profiles', 'Advanced Theming'],
        previewType: 'video',
        requiredFeatures: ['realtime', 'notifications']
    }
];

export const TIER_LEVELS = {
    Basic: 1,
    Pro: 2,
    Premium: 3
};
