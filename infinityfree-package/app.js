// RASHID LEAKS - InfinityFree Application
// Connects to Vercel Backend: https://rashidleaks.vercel.app

// ==================== CONFIGURATION ====================
const CONFIG = {
    API_URL: 'https://rashidleaks.vercel.app',
    SPLASH_DURATION: 3000, // 3 seconds
    STORAGE_PREFIX: 'rashidleaks_'
};

// ==================== STATE MANAGEMENT ====================
let state = {
    user: null,
    isAuthenticated: false,
    isAgeVerified: false,
    isLoading: true
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    // Show splash screen
    showSplashScreen();
    
    // Check if user is authenticated from session storage
    checkAuthStatus();
    
    // Check age verification
    checkAgeVerification();
    
    // Load initial data after splash
    setTimeout(async () => {
        hideSplashScreen();
        
        if (state.isAgeVerified) {
            showMainContent();
            await loadInitialData();
        } else {
            showAgeGate();
        }
        
        state.isLoading = false;
    }, CONFIG.SPLASH_DURATION);
}

// ==================== SPLASH SCREEN ====================
function showSplashScreen() {
    const splash = document.getElementById('splash-screen');
    if (splash) splash.classList.remove('hidden');
}

function hideSplashScreen() {
    const splash = document.getElementById('splash-screen');
    if (splash) {
        splash.classList.add('fade-out');
        setTimeout(() => {
            splash.classList.add('hidden');
            splash.classList.remove('fade-out');
        }, 500);
    }
}

// ==================== AGE VERIFICATION ====================
function checkAgeVerification() {
    const verified = localStorage.getItem(CONFIG.STORAGE_PREFIX + 'age_verified');
    state.isAgeVerified = verified === 'true';
}

function verifyAge(isAdult) {
    if (isAdult) {
        localStorage.setItem(CONFIG.STORAGE_PREFIX + 'age_verified', 'true');
        state.isAgeVerified = true;
        hideAgeGate();
        showMainContent();
        loadInitialData();
    } else {
        // Redirect to safe site or show message
        window.location.href = 'https://www.google.com';
    }
}

function showAgeGate() {
    const ageGate = document.getElementById('age-gate');
    if (ageGate) ageGate.classList.remove('hidden');
}

function hideAgeGate() {
    const ageGate = document.getElementById('age-gate');
    if (ageGate) ageGate.classList.add('hidden');
}

function showMainContent() {
    const app = document.getElementById('app');
    if (app) app.classList.remove('hidden');
}

// ==================== AUTHENTICATION ====================
function checkAuthStatus() {
    const userStr = localStorage.getItem(CONFIG.STORAGE_PREFIX + 'user');
    if (userStr) {
        try {
            state.user = JSON.parse(userStr);
            state.isAuthenticated = true;
            updateUIForAuthenticatedUser();
        } catch (e) {
            localStorage.removeItem(CONFIG.STORAGE_PREFIX + 'user');
        }
    }
}

async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');
    const submitBtn = document.getElementById('login-submit-btn');
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in...';
    errorDiv.classList.add('hidden');
    
    try {
        const response = await fetch(`${CONFIG.API_URL}/api/auth/[...nextauth]`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'signin',
                provider: 'credentials',
                credentials: { email, password },
                redirect: false
            })
        });
        
        const result = await response.json();
        
        if (result.error) {
            throw new Error(result.error);
        }
        
        // Simulate successful login (in production, this would use proper session handling)
        state.user = {
            id: 'user_' + Date.now(),
            email: email,
            username: email.split('@')[0],
            displayName: email.split('@')[0],
            role: email.includes('admin') ? 'ADMIN' : 'USER',
            isAuthenticated: true
        };
        state.isAuthenticated = true;
        
        // Save to localStorage
        localStorage.setItem(CONFIG.STORAGE_PREFIX + 'user', JSON.stringify(state.user));
        
        showToast('Welcome back!', 'success');
        closeAuthModal();
        updateUIForAuthenticatedUser();
        
        // Redirect admin users to admin panel
        if (state.user.role === 'ADMIN' || state.user.role === 'MODERATOR') {
            // For InfinityFree, we'll show admin content inline or redirect
            showAdminPanel();
        }
        
    } catch (error) {
        errorDiv.textContent = 'Invalid email or password. Please try again.';
        errorDiv.classList.remove('hidden');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign In';
    }
}

async function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    const errorDiv = document.getElementById('register-error');
    const submitBtn = document.getElementById('register-submit-btn');
    
    // Validate passwords match
    if (password !== confirmPassword) {
        errorDiv.textContent = 'Passwords do not match.';
        errorDiv.classList.remove('hidden');
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account...';
    errorDiv.classList.add('hidden');
    
    try {
        const response = await fetch(`${CONFIG.API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Registration failed');
        }
        
        showToast('Account created successfully! Please sign in.', 'success');
        switchAuthForm('login');
        
        // Pre-fill login form
        document.getElementById('login-email').value = email;
        
    } catch (error) {
        errorDiv.textContent = error.message || 'Registration failed. Please try again.';
        errorDiv.classList.remove('hidden');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Account';
    }
}

function logout() {
    state.user = null;
    state.isAuthenticated = false;
    localStorage.removeItem(CONFIG.STORAGE_PREFIX + 'user');
    
    updateUIForUnauthenticatedUser();
    showToast('Signed out successfully', 'success');
    closeUserDropdown();
}

function isAdmin() {
    return state.user && (state.user.role === 'ADMIN' || state.user.role === 'MODERATOR');
}

// ==================== UI UPDATES ====================
function updateUIForAuthenticatedUser() {
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');
    const heroRegisterBtn = document.getElementById('hero-register-btn');
    const mobileAccountBtn = document.getElementById('mobile-account-btn');
    
    if (authButtons) authButtons.classList.add('hidden');
    if (userMenu) userMenu.classList.remove('hidden');
    if (heroRegisterBtn) heroRegisterBtn.style.display = 'none';
    
    // Update avatar
    const avatarHeader = document.getElementById('user-avatar-header');
    if (avatarHeader && state.user) {
        avatarHeader.textContent = (state.user.displayName || state.user.username || 'A').charAt(0).toUpperCase();
    }
    
    // Update mobile account button
    if (mobileAccountBtn && state.user) {
        mobileAccountBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>Profile</span>
        `;
        mobileAccountBtn.onclick = toggleUserDropdown;
    }
    
    // Show/hide admin link
    const adminLink = document.getElementById('admin-link');
    if (adminLink) {
        adminLink.style.display = isAdmin() ? 'block' : 'none';
    }
}

function updateUIForUnauthenticatedUser() {
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');
    const heroRegisterBtn = document.getElementById('hero-register-btn');
    
    if (authButtons) authButtons.classList.remove('hidden');
    if (userMenu) userMenu.classList.add('hidden');
    if (heroRegisterBtn) heroRegisterBtn.style.display = '';
}

// ==================== MODAL FUNCTIONS ====================
function showAuthModal(mode) {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.remove('hidden');
    switchAuthForm(mode);
}

function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.add('hidden');
}

function switchAuthForm(mode) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (mode === 'login') {
        loginForm?.classList.remove('hidden');
        registerForm?.classList.add('hidden');
    } else {
        loginForm?.classList.add('hidden');
        registerForm?.classList.remove('hidden');
    }
}

function openSearch() {
    const modal = document.getElementById('search-modal');
    if (modal) {
        modal.classList.remove('hidden');
        document.getElementById('search-input')?.focus();
    }
}

function closeSearch() {
    const modal = document.getElementById('search-modal');
    if (modal) modal.classList.add('hidden');
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
    }
}

// ==================== MOBILE MENU ====================
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) menu.classList.toggle('hidden');
}

function closeMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) menu.classList.add('hidden');
}

// ==================== USER DROPDOWN ====================
function toggleUserDropdown() {
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) dropdown.classList.toggle('hidden');
}

function closeUserDropdown() {
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) dropdown.classList.add('hidden');
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const userMenu = document.getElementById('user-menu');
    const dropdown = document.getElementById('user-dropdown');
    
    if (userMenu && dropdown && !userMenu.contains(e.target)) {
        dropdown.classList.add('hidden');
    }
});

// ==================== DATA LOADING ====================
async function loadInitialData() {
    await Promise.all([
        loadFeaturedVideos(),
        loadCategories(),
        loadTrendingVideos(),
        loadCreators()
    ]);
}

async function loadFeaturedVideos() {
    const container = document.getElementById('featured-videos');
    const skeletons = document.getElementById('featured-skeletons');
    
    try {
        // Try to load from API
        const response = await fetch(`${CONFIG.API_URL}/api/videos?limit=6&sort=featured`);
        if (response.ok) {
            const videos = await response.json();
            renderVideoCards(container, videos.data || videos, true);
            if (skeletons) skeletons.classList.add('hidden');
            return;
        }
    } catch (error) {
        console.log('Using mock data for featured videos');
    }
    
    // Use mock data if API fails
    const mockVideos = getMockVideos().slice(0, 3);
    renderVideoCards(container, mockVideos, true);
    if (skeletons) skeletons.classList.add('hidden');
}

async function loadTrendingVideos() {
    const container = document.getElementById('trending-videos');
    
    try {
        const response = await fetch(`${CONFIG.API_URL}/api/videos?limit=8&sort=popular`);
        if (response.ok) {
            const videos = await response.json();
            renderVideoCards(container, videos.data || videos, false);
            return;
        }
    } catch (error) {
        console.log('Using mock data for trending videos');
    }
    
    const mockVideos = getMockVideos().sort((a, b) => b.viewCount - a.viewCount);
    renderVideoCards(container, mockVideos, false);
}

async function loadCategories() {
    const container = document.getElementById('categories-grid');
    
    try {
        const response = await fetch(`${CONFIG.API_URL}/api/categories`);
        if (response.ok) {
            const categories = await response.json();
            renderCategoryCards(container, categories.data || categories);
            return;
        }
    } catch (error) {
        console.log('Using mock data for categories');
    }
    
    renderCategoryCards(container, getMockCategories());
}

async function loadCreators() {
    const container = document.getElementById('creators-grid');
    
    try {
        const response = await fetch(`${CONFIG.API_URL}/api/creators?limit=8`);
        if (response.ok) {
            const creators = await response.json();
            renderCreatorCards(container, creators.data || creators);
            return;
        }
    } catch (error) {
        console.log('Using mock data for creators');
    }
    
    renderCreatorCards(container, getMockCreators());
}

// ==================== RENDER FUNCTIONS ====================
function renderVideoCards(container, videos, isScrollable) {
    if (!container) return;
    
    const html = videos.map(video => createVideoCardHTML(video)).join('');
    container.innerHTML = html;
    
    if (!isScrollable) {
        container.className = 'videos-grid';
    }
}

function createVideoCardHTML(video) {
    const duration = formatDuration(video.duration || 0);
    const views = formatNumber(video.viewCount || 0);
    const creatorName = video.creator?.displayName || video.creator?.username || 'Anonymous';
    const creatorInitial = creatorName.charAt(0).toUpperCase();
    
    return `
        <div class="video-card" onclick="playVideo('${video.id}')">
            <div class="video-thumbnail">
                ${video.thumbnailUrl 
                    ? `<img src="${video.thumbnailUrl}" alt="${escapeHtml(video.title)}" loading="lazy">`
                    : `<div style="width:100%;height:100%;background:linear-gradient(135deg,#1a1a1a,#0a0a0a);display:flex;align-items:center;justify-content:center;">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                       </div>`
                }
                <div class="video-play-overlay">
                    <div class="play-button">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                    </div>
                </div>
                <span class="video-duration">${duration}</span>
            </div>
            <div class="video-info">
                <h3 class="video-title">${escapeHtml(video.title)}</h3>
                <div class="video-meta">
                    <span>${views} views</span>
                    <span>•</span>
                    <span>${formatNumber(video.likeCount || 0)} likes</span>
                </div>
                <div class="video-creator">
                    <div class="creator-avatar-xs">${creatorInitial}</div>
                    <span class="creator-name">${escapeHtml(creatorName)}</span>
                </div>
            </div>
        </div>
    `;
}

function renderCategoryCards(container, categories) {
    if (!container) return;
    
    const html = categories.map(cat => `
        <a href="#category/${cat.slug}" class="category-card" onclick="filterByCategory('${cat.id}')">
            <span class="category-icon">${cat.icon || '🎬'}</span>
            <h3 class="category-name">${escapeHtml(cat.name)}</h3>
            <p class="category-count">${formatNumber(cat._count?.videos || 0)} videos</p>
            <svg class="category-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        </a>
    `).join('');
    
    container.innerHTML = html;
}

function renderCreatorCards(container, creators) {
    if (!container) return;
    
    const html = creators.map(creator => {
        const initial = (creator.displayName || creator.username || 'U').charAt(0).toUpperCase();
        return `
            <a href="#creator/${creator.username}" class="creator-card">
                <div class="creator-avatar">${initial}</div>
                <h3 class="creator-display-name">${escapeHtml(creator.displayName || creator.username)}</h3>
                <p class="creator-username">@${escapeHtml(creator.username)}</p>
                <span class="creator-badge">✓ Verified</span>
            </a>
        `;
    }).join('');
    
    container.innerHTML = html;
}

// ==================== SEARCH ====================
async function handleSearch(event) {
    const query = event.target.value.trim();
    const resultsContainer = document.getElementById('search-results');
    
    if (!resultsContainer) return;
    
    if (query.length < 2) {
        resultsContainer.innerHTML = '<p class="text-gray-500 text-center p-4">Type at least 2 characters to search...</p>';
        return;
    }
    
    resultsContainer.innerHTML = '<p class="text-center p-4 text-gray-400">Searching...</p>';
    
    try {
        const response = await fetch(`${CONFIG.API_URL}/api/search?q=${encodeURIComponent(query)}`);
        if (response.ok) {
            const results = await response.json();
            displaySearchResults(results.data || results);
        } else {
            displaySearchResults(getMockSearchResults(query));
        }
    } catch (error) {
        displaySearchResults(getMockSearchResults(query));
    }
}

function displaySearchResults(results) {
    const container = document.getElementById('search-results');
    if (!container) return;
    
    if (!results || results.length === 0) {
        container.innerHTML = '<p class="text-center p-4 text-gray-400">No results found.</p>';
        return;
    }
    
    const html = results.slice(0, 10).map(item => {
        if (item.title) {
            return `<div class="p-3 hover:bg-white/5 rounded cursor-pointer" onclick="playVideo('${item.id}'); closeSearch();">
                <p class="font-medium">${escapeHtml(item.title)}</p>
                <p class="text-sm text-gray-500">${formatNumber(item.viewCount || 0)} views</p>
            </div>`;
        }
        return '';
    }).join('');
    
    container.innerHTML = html;
}

// ==================== VIDEO PLAYER ====================
function playVideo(videoId) {
    showToast('Loading video player...', 'success');
    // In a real implementation, this would open a video player modal or navigate to video page
    console.log('Playing video:', videoId);
}

// ==================== ADMIN PANEL ====================
function showAdminPanel() {
    if (!isAdmin()) {
        showToast('Access denied', 'error');
        return;
    }
    
    // For static frontend, we could show an admin interface or redirect
    // Since this is InfinityFree, let's show a simple admin message
    showToast('Admin panel available on main platform', 'warning');
}

// ==================== UTILITY FUNCTIONS ====================
function formatDuration(seconds) {
    if (!seconds) return '0:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hrs > 0) {
        return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatNumber(num) {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function filterByCategory(categoryId) {
    showToast(`Filtering by category...`, 'info');
    console.log('Filter by category:', categoryId);
}

// ==================== TOAST NOTIFICATIONS ====================
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${type === 'success' ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>' :
              type === 'error' ? '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>' :
              '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'}
        </svg>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ==================== MOCK DATA ====================
function getMockVideos() {
    return [
        {
            id: '1',
            title: 'Premium Content Collection Vol. 1',
            slug: 'premium-content-1',
            duration: 1245,
            viewCount: 125000,
            likeCount: 8900,
            creator: { id: 'u1', username: 'creator_one', displayName: 'Creator One' },
            thumbnailUrl: null
        },
        {
            id: '2',
            title: 'Exclusive Behind The Scenes Footage',
            slug: 'exclusive-bts',
            duration: 2340,
            viewCount: 89000,
            likeCount: 6700,
            creator: { id: 'u2', username: 'star_creator', displayName: 'Star Creator' },
            thumbnailUrl: null
        },
        {
            id: '3',
            title: 'Hot New Release - Full HD Quality',
            slug: 'hot-new-release',
            duration: 1890,
            viewCount: 234000,
            likeCount: 15600,
            creator: { id: 'u3', username: 'hot_studio', displayName: 'Hot Studio' },
            thumbnailUrl: null
        },
        {
            id: '4',
            title: 'Trending Now - Most Watched This Week',
            slug: 'trending-now',
            duration: 1567,
            viewCount: 456000,
            likeCount: 23400,
            creator: { id: 'u4', username: 'viral_queen', displayName: 'Viral Queen' },
            thumbnailUrl: null
        },
        {
            id: '5',
            title: 'Fan Favorite Collection 2024',
            slug: 'fan-favorite-2024',
            duration: 3210,
            viewCount: 178000,
            likeCount: 11200,
            creator: { id: 'u5', username: 'fan_favorite', displayName: 'Fan Favorite' },
            thumbnailUrl: null
        },
        {
            id: '6',
            title: 'Exclusive Premium Content - Members Only',
            slug: 'exclusive-premium',
            duration: 2789,
            viewCount: 98000,
            likeCount: 7800,
            creator: { id: 'u1', username: 'creator_one', displayName: 'Creator One' },
            thumbnailUrl: null
        }
    ];
}

function getMockCategories() {
    return [
        { id: 'cat1', name: 'Amateur', slug: 'amateur', icon: '🎥', _count: { videos: 1234 } },
        { id: 'cat2', name: 'Professional', slug: 'professional', icon: '🎬', _count: { videos: 856 } },
        { id: 'cat3', name: 'Solo', slug: 'solo', icon: '✨', _count: { videos: 2341 } },
        { id: 'cat4', name: 'Couple', slug: 'couple', icon: '💑', _count: { videos: 987 } },
        { id: 'cat5', name: 'POV', slug: 'pov', icon: '📹', _count: { videos: 654 } },
        { id: 'cat6', name: 'Roleplay', slug: 'roleplay', icon: '🎭', _count: { videos: 432 } },
        { id: 'cat7', name: 'Vintage', slug: 'vintage', icon: '📼', _count: { videos: 321 } },
        { id: 'cat8', name: 'HD/4K', slug: 'hd-4k', icon: '📺', _count: { videos: 1543 } }
    ];
}

function getMockCreators() {
    return [
        { id: 'u1', username: 'creator_one', displayName: 'Creator One' },
        { id: 'u2', username: 'star_creator', displayName: 'Star Creator' },
        { id: 'u3', username: 'hot_studio', displayName: 'Hot Studio' },
        { id: 'u4', username: 'viral_queen', displayName: 'Viral Queen' }
    ];
}

function getMockSearchResults(query) {
    return getMockVideos().filter(v => 
        v.title.toLowerCase().includes(query.toLowerCase())
    );
}

// ==================== ANDROID BACK BUTTON SUPPORT ====================
if (window.history && window.history.pushState) {
    // Initial state
    window.history.replaceState({ page: 'home' }, '', window.location.href);
    
    // Listen for back button
    window.addEventListener('popstate', (event) => {
        const state = event.state;
        
        if (!state || state.page === 'home') {
            // Close any open modals
            closeSearch();
            closeAuthModal();
            closeMobileMenu();
            closeUserDropdown();
            
            // Prevent going back further
            window.history.pushState({ page: 'home' }, '', window.location.href);
        }
    });
}

// Handle mobile menu close on back navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeSearch();
        closeAuthModal();
        closeMobileMenu();
        closeUserDropdown();
    }
});
