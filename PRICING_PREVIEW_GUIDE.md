# ✅ Pricing Section & Preview System - Complete Guide

## Current Status

Your `index.html` **ALREADY HAS** a pricing section with 3 tiers:
- **Basic** ($40) - Line 1045-1060
- **Pro** ($75) - Line 1063-1082  
- **Premium** ($200) - Line 1085-1108

## What Should Happen Automatically

When you visit `http://localhost:5173/`, the **preview-system.js** script should:

1. **Load template manifests** from `src/data/template-manifests.json`
2. **Find the 3 pricing cards** using `.pricing-card` selector
3. **Inject 3 preview cards** under each tier's price (before the features list)
4. **Display animated shimmer effects** on each preview card
5. **Enable click handlers** to open full preview modals

## 🧪 Test the System

### Option 1: Visit the Main Page
```
http://localhost:5173/
```

**What you should see:**
- Scroll to pricing section
- Under each tier's price, you should see:
  - Small text: "INCLUDED TEMPLATES"
  - 3 horizontally scrolling preview cards
  - Each card has a shimmer animation
  - Hover shows overlay with template name

### Option 2: Visit the Test Page
```
http://localhost:5173/test.html
```

**This will show:**
- ✅ Stripe.js loaded
- ✅ window.stripe initialized
- ✅ Preview system loaded
- ✅ Number of templates found
- ✅ Number of pricing cards found
- ✅ Number of preview cards injected
- ✅ Server status

## 🔍 Debugging

If previews don't appear, open **browser console** (F12) and check for:

### Expected Console Messages:
```
✅ Template manifests loaded: 9 templates
✅ Preview system initialized with 9 templates
```

### If you see errors:
```javascript
// Check if preview system loaded
window.previewSystem

// Check if templates loaded
window.previewSystem.templates()

// Check if pricing cards exist
document.querySelectorAll('.pricing-card')

// Check if preview cards were injected
document.querySelectorAll('.preview-card')
```

## 📋 What Each Preview Card Shows

### Basic Tier (Cyan):
1. **Starter Landing** - Hero with CTA, Feature Grid
2. **Micro-SaaS Promo** - Pricing Table, FAQ Section
3. **Dev Portfolio** - Project Grid, About Section

### Pro Tier (Fuchsia):
1. **Auth App Shell** - Login/Signup, Session Management
2. **Dashboard App** - Interactive Dashboard, Charts
3. **Creator Storefront** - Product Grid, Cart Logic

### Premium Tier (Emerald):
1. **Admin Console** - Analytics, User Management
2. **Marketplace** - Vendor Profiles, Realtime Chat
3. **Realtime Collab** - WebSockets, Live Updates

## 🎨 Preview Card Features

- **Shimmer animation** - Looping gradient effect
- **Hover effect** - Pauses animation, shows overlay
- **Click to open** - Full modal with template details
- **Tier-specific colors** - Matches tier branding
- **Horizontal scroll** - Mobile-friendly

## 🔧 If Previews Still Don't Show

The preview-system.js uses this logic:

```javascript
// Waits 500ms for DOM to load
setTimeout(() => {
    // Finds pricing cards
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    // For each card, finds the <ul> (features list)
    const ul = card.querySelector('ul.space-y-3');
    
    // Inserts preview strip BEFORE the <ul>
    ul.parentNode.insertBefore(previewStrip, ul);
}, 500);
```

**Possible issues:**
1. Script not loading → Check network tab
2. Timing issue → Increase timeout in preview-system.js
3. Selector mismatch → Verify `.pricing-card` class exists

## ✅ Everything You Need is Already There

- ✅ Pricing section in HTML
- ✅ Preview system JavaScript loaded
- ✅ Template manifests created
- ✅ Stripe integration working
- ✅ Server running

**Just refresh the browser and it should all work!** 🚀

## 🎯 Quick Test Commands

Open browser console and run:

```javascript
// 1. Check system loaded
window.previewSystem

// 2. View all templates
window.previewSystem.templates()

// 3. Check current tier
window.previewSystem.currentTier()

// 4. Test tier switching
window.previewSystem.setUserTier('pro')
location.reload()

// 5. Manually trigger preview injection (if needed)
// This is done automatically, but you can test it
```

## 📞 Still Having Issues?

If previews don't appear after refreshing:

1. **Check `test.html`** - This will diagnose the issue
2. **Check browser console** - Look for errors
3. **Check network tab** - Ensure scripts are loading
4. **Verify file paths** - All scripts should return 200 status

The system is complete and should work automatically! 🎉
