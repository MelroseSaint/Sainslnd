import './style.css';
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, onSnapshot, collection, query, addDoc, serverTimestamp, setLogLevel } from "firebase/firestore";
import { loadStripe } from '@stripe/stripe-js';

// Set Firebase logging level to Debug
setLogLevel('Debug');

// --- GLOBAL FIREBASE/AUTH SETUP ---
// TODO: Replace with actual config from your Firebase Console
const firebaseConfig = {
    // apiKey: "...",
    // authDomain: "...",
    // projectId: "...",
    // storageBucket: "...",
    // messagingSenderId: "...",
    // appId: "..."
};
const appId = 'default-saintslnd-app';

let app, db, auth;

if (Object.keys(firebaseConfig).length > 0) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);

    // Expose for debugging if needed
    window.app = app;
    window.db = db;
    window.auth = auth;

    const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

    onAuthStateChanged(auth, async (user) => {
        const userId = user?.uid || crypto.randomUUID();
        window.currentUser = user;
        window.currentUserId = userId;

        // Initialize Stripe once Firebase auth is ready
        // Note: We use loadStripe which returns a promise, but for this legacy code structure
        // we'll just set it on window for now or use it directly.
        // Ideally, we should use the promise.
        window.stripe = await loadStripe('pk_live_51SKEFvFoTgg7qKhJyOs8KmtHLlE1BQO35kHFYx1wK2s3vpm9131Zlui3wc1L4TyNh7CfZBNsmCWGA2HpTN1OlcrT00BZenzLg6');

        // Setup listeners if needed
        if (user) {
            setupFirestoreListeners(userId);
        }
    });

    // Initial authentication check
    (async () => {
        try {
            if (initialAuthToken) {
                await signInWithCustomToken(auth, initialAuthToken);
                console.log("Signed in with custom token.");
            } else {
                await signInAnonymously(auth);
                console.log("Signed in anonymously.");
            }
        } catch (error) {
            console.error("Firebase Auth Error:", error);
        }
    })();

} else {
    console.warn("Firebase config is missing. Database functionality is disabled.");
    // Initialize Stripe anyway for the UI to work (mock mode)
    (async () => {
        window.stripe = await loadStripe('pk_live_51SKEFvFoTgg7qKhJyOs8KmtHLlE1BQO35kHFYx1wK2s3vpm9131Zlui3wc1L4TyNh7CfZBNsmCWGA2HpTN1OlcrT00BZenzLg6');
    })();
}

// --- FIRESTORE FUNCTIONS ---

/** Sets up real-time listener for public checkout events. */
function setupFirestoreListeners(userId) {
    if (!db) return;
    const eventsRef = collection(db, `artifacts/${appId}/public/data/checkoutEvents`);
    const q = query(eventsRef);

    onSnapshot(q, (snapshot) => {
        const events = [];
        snapshot.forEach((doc) => {
            events.push({ id: doc.id, ...doc.data() });
        });
        renderRecentEvents(events);
    }, (error) => {
        console.error("Error listening to events:", error);
    });
}

/** Renders the list of recent checkout events. */
function renderRecentEvents(events) {
    const container = document.getElementById('event-list');
    if (!container) return; // Guard clause if element doesn't exist
    container.innerHTML = '';

    // Sort by timestamp descending and take top 5
    events.sort((a, b) => (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0));
    const recentEvents = events.slice(0, 5);

    if (recentEvents.length === 0) {
        container.innerHTML = '<p class="text-gray-500 italic">No recent checkout events.</p>';
        return;
    }

    recentEvents.forEach(event => {
        const time = event.timestamp ? new Date(event.timestamp.seconds * 1000).toLocaleTimeString() : 'N/A';
        const item = document.createElement('li');
        item.className = 'text-sm p-2 bg-gray-700/50 rounded-lg flex justify-between items-center mb-1';
        item.innerHTML = `
            <span class="font-semibold text-white">${event.plan || 'Unknown'} - $${event.amount / 100 || 'N/A'}</span>
            <span class="text-gray-400 text-xs">${time} by ${event.userId.substring(0, 8)}...</span>
        `;
        container.appendChild(item);
    });
}

/** * Logs a payment event to Firestore. 
 * This simulates what a server would do after a successful Stripe payment.
 */
window.logCheckoutEvent = async (plan, amountCents, userId) => {
    if (!db) return;
    try {
        const eventsRef = collection(db, `artifacts/${appId}/public/data/checkoutEvents`);
        await addDoc(eventsRef, {
            plan: plan,
            amount: amountCents,
            userId: userId,
            timestamp: serverTimestamp()
        });
        console.log(`Checkout event logged for ${plan}`);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};


// --- CLIENT-SIDE JS LOGIC ---

window.showModal = function (id, message = '') {
    const modal = document.getElementById(id);
    if (message && id === 'success-message') {
        document.getElementById('modal-text').textContent = message;
    }
    modal.classList.remove('hidden');
}

window.hideModal = function (id) {
    document.getElementById(id).classList.add('hidden');
}

/**
 * Simulates a secure payment flow using Stripe Checkout.
 * The price is passed, but the actual Stripe Session creation must happen on a server.
 * We redirect the user to a mock success/cancel page for demonstration.
 */
window.handleCheckout = async function (planName, amountCents) {
    if (!window.stripe) {
        window.showModal('success-message', 'Stripe.js not initialized.');
        return;
    }
    try {
        const response = await fetch('http://localhost:4242/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plan: planName, amount: amountCents })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to create session');

        // Optional demo logging
        if (window.logCheckoutEvent && window.currentUserId) {
            window.logCheckoutEvent(planName, amountCents, window.currentUserId);
        }

        if (data.url) {
            window.location.href = data.url;
        } else {
            // Fallback for older implementations or if URL is missing
            const result = await window.stripe.redirectToCheckout({ sessionId: data.id });
            if (result.error) {
                window.showModal('success-message', result.error.message || 'Redirect failed');
            }
        }
    } catch (err) {
        window.showModal('success-message', err.message || 'Checkout failed');
    }
}

// --- Handle post-payment URL parameters (for mock success/cancel) ---
window.addEventListener('load', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const plan = urlParams.get('plan');
    const price = urlParams.get('price');

    if (paymentStatus === 'success') {
        window.showModal('success-message', `Payment for ${plan} successful! Price: $${price / 100}.`);
        // Clear URL parameters to prevent modal from reappearing on refresh
        history.replaceState(null, '', window.location.pathname);
    } else if (paymentStatus === 'cancel') {
        window.showModal('success-message', 'Payment cancelled. Please try again.');
        // Clear URL parameters
        history.replaceState(null, '', window.location.pathname);
    }

    // Enable subtle parallax for swoosh layers
    const scene = document.querySelector('.swoosh-scene');
    const layers = document.querySelectorAll('.swoosh-layer');
    let mouseX = 0, mouseY = 0;
    if (scene && layers.length) {
        window.addEventListener('mousemove', (e) => {
            const { innerWidth: w, innerHeight: h } = window;
            mouseX = (e.clientX / w - 0.5) * 2; // -1 to 1
            mouseY = (e.clientY / h - 0.5) * 2; // -1 to 1
            layers.forEach((layer, i) => {
                const depth = (i + 1) * 6; // different depth per layer
                layer.style.transform = `translateZ(-60px) rotateX(${8 - mouseY * depth}deg) rotateY(${-6 + mouseX * depth}deg) rotate(${(performance.now() / (18000 - i * 2000)) * 360}deg) scale(1.05)`;
            });
        });
    }

    // Tilt effect for pricing cards
    const cards = document.querySelectorAll('.pricing-card');
    cards.forEach((card) => {
        card.setAttribute('data-tilt', 'true');
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const cx = e.clientX - rect.left;
            const cy = e.clientY - rect.top;
            const rx = ((cy / rect.height) - 0.5) * -8; // tilt X
            const ry = ((cx / rect.width) - 0.5) * 8;  // tilt Y
            card.style.setProperty('--rx', `${rx}deg`);
            card.style.setProperty('--ry', `${ry}deg`);
        });
        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--rx', `0deg`);
            card.style.setProperty('--ry', `0deg`);
        });
    });

    // YouTube Player API loader and synced visualizer
    const ytContainer = document.getElementById('yt-embed');
    const playBtn = document.getElementById('yt-play');
    const playIconSvg = document.getElementById('yt-play-icon');
    const playIconPath = playIconSvg ? playIconSvg.querySelector('path') : null;
    const muteBtn = document.getElementById('yt-mute');
    const muteIconSvg = document.getElementById('yt-mute-icon');
    const muteIconPath = muteIconSvg ? muteIconSvg.querySelector('path') : null;
    const progressFill = document.getElementById('yt-progress');
    let player; let rafId;

    window.onYouTubeIframeAPIReady = function () {
        player = new YT.Player('yt-embed', {
            height: '0', width: '0',
            videoId: 'b0x-ccdkdKA',
            playerVars: {
                autoplay: 1, mute: 1, playsinline: 1, loop: 1, playlist: 'b0x-ccdkdKA',
                rel: 0, modestbranding: 1
            },
            events: {
                onReady: () => {
                    const vol = miniVol ? Number(miniVol.value) || 60 : 60;
                    player.setVolume(vol);
                    setPlayIcon(true);
                    setMuteIcon(true);
                    animate();
                },
            }
        });
    };
    // load api
    const tag = document.createElement('script'); tag.src = "https://www.youtube.com/iframe_api"; document.body.appendChild(tag);

    function fmt(t) { t = Math.max(0, t | 0); const m = (t / 60) | 0; const s = (t % 60) | 0; return m + ":" + (s < 10 ? "0" : "") + s; }
    const timeElapsedEl = document.getElementById('yt-time-elapsed');
    const timeTotalEl = document.getElementById('yt-time-total');
    const progressBar = document.getElementById('yt-progress-bar');
    // Mini player refs
    const mini = document.getElementById('mini-player');
    const miniPlay = document.getElementById('mini-play');
    const miniPlayIconSvg = document.getElementById('mini-play-icon');
    const miniPlayIconPath = miniPlayIconSvg ? miniPlayIconSvg.querySelector('path') : null;
    const miniMute = document.getElementById('mini-mute');
    const miniMuteIconSvg = document.getElementById('mini-mute-icon');
    const miniMuteIconPath = miniMuteIconSvg ? miniMuteIconSvg.querySelector('path') : null;
    const miniVol = document.getElementById('mini-volume');
    const miniElapsed = document.getElementById('mini-elapsed');
    const miniTotal = document.getElementById('mini-total');
    const miniProgress = document.getElementById('mini-progress');

    function animate() {
        if (!player || typeof player.getDuration !== 'function') { rafId = requestAnimationFrame(animate); return; }
        const dur = player.getDuration() || 1; const cur = player.getCurrentTime() || 0;
        const pct = Math.max(0, Math.min(100, (cur / dur) * 100));
        if (progressFill) progressFill.style.width = pct + '%';
        if (timeElapsedEl) timeElapsedEl.textContent = fmt(cur);
        if (timeTotalEl) timeTotalEl.textContent = fmt(dur);
        if (miniProgress) miniProgress.style.width = pct + '%';
        if (miniElapsed) miniElapsed.textContent = fmt(cur);
        if (miniTotal) miniTotal.textContent = fmt(dur);
        rafId = requestAnimationFrame(animate);
    }

    function setPlayIcon(isPlaying) {
        const playD = 'M8 5v14l11-7z';
        const pauseD = 'M6 5h4v14H6zm8 0h4v14h-4z';
        if (playIconPath) playIconPath.setAttribute('d', isPlaying ? playD : pauseD);
        if (miniPlayIconPath) miniPlayIconPath.setAttribute('d', isPlaying ? playD : pauseD);
    }
    function setMuteIcon(isMuted) {
        const mutedD = 'M7 9v6h4l5 5V4l-5 5H7z';
        const unmutedD = 'M5 9v6h4l5 5V4l-5 5H5zm10-1.5 1.5-1.5A8 8 0 0 1 20 12a8 8 0 0 1-3.5 6.5L15 17a5 5 0 0 0 0-10z';
        if (muteIconPath) muteIconPath.setAttribute('d', isMuted ? mutedD : unmutedD);
        if (miniMuteIconPath) miniMuteIconPath.setAttribute('d', isMuted ? mutedD : unmutedD);
    }
    function togglePlay() {
        const state = player?.getPlayerState?.();
        if (state === YT.PlayerState.PLAYING) {
            player.pauseVideo();
            setPlayIcon(false);
        } else {
            player.playVideo();
            setPlayIcon(true);
        }
    }
    function toggleMute() {
        const isMuted = player?.isMuted?.();
        if (isMuted) {
            player.unMute();
            setMuteIcon(false);
        } else {
            player.mute();
            setMuteIcon(true);
        }
    }
    playBtn?.addEventListener('click', togglePlay);
    muteBtn?.addEventListener('click', toggleMute);
    miniPlay?.addEventListener('click', togglePlay);
    miniMute?.addEventListener('click', toggleMute);

    // Attach event listeners to checkout buttons
    document.querySelectorAll('.js-checkout-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const plan = btn.dataset.plan;
            const amount = parseInt(btn.dataset.amount, 10);
            window.handleCheckout(plan, amount);
        });
    });

    // Seek via click/keyboard
    function seekTo(clientX) {
        const rect = progressBar.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const dur = player?.getDuration?.() || 0; player?.seekTo?.(dur * ratio, true);
    }
    progressBar?.addEventListener('click', (e) => seekTo(e.clientX));
    progressBar?.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            const cur = player?.getCurrentTime?.() || 0;
            player?.seekTo?.(cur + 5, true);
        } else if (e.key === 'ArrowLeft') {
            const cur = player?.getCurrentTime?.() || 0;
            player?.seekTo?.(cur - 5, true);
        }
    });
    // Scroll listener for Mini Player visibility
    const playerCard = document.querySelector('.player-card');
    window.addEventListener('scroll', () => {
        if (!playerCard || !mini) return;
        const rect = playerCard.getBoundingClientRect();
        // Show mini player if main player is scrolled out of view (top < -height or bottom < 0)
        // Simple check: if bottom of player card is above the viewport
        if (rect.bottom < 0) {
            mini.style.display = 'block';
        } else {
            mini.style.display = 'none';
        }
    });
});
