// RASHID LEAKS - Global State Management (Zustand)

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, Video, Category, SearchFilters, NavigationState } from '@/types';

// ==================== AUTH STORE ====================

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'rashid-leaks-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

// ==================== AGE VERIFICATION STORE ====================

interface AgeVerificationState {
  isVerified: boolean;
  verifiedAt: Date | null;
  rememberChoice: boolean;
  verify: (remember?: boolean) => void;
  reset: () => void;
}

export const useAgeVerificationStore = create<AgeVerificationState>()(
  persist(
    (set) => ({
      isVerified: false,
      verifiedAt: null,
      rememberChoice: true,
      verify: (remember = true) => 
        set({ isVerified: true, verifiedAt: new Date(), rememberChoice: remember }),
      reset: () => set({ isVerified: false, verifiedAt: null }),
    }),
    {
      name: 'rashid-leaks-age-verification',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ==================== NAVIGATION STORE ====================

interface NavigationStoreState extends NavigationState {
  setCurrentPage: (page: string) => void;
  setModalOpen: (open: boolean) => void;
  setDrawerOpen: (open: boolean) => void;
  setFullscreenVideo: (fullscreen: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSearchFilters: (filters: SearchFilters) => void;
}

export const useNavigationStore = create<NavigationStoreState>()((set) => ({
  currentPage: '/',
  previousPage: undefined,
  historyStack: [],
  modalOpen: false,
  drawerOpen: false,
  fullscreenVideo: false,
  searchQuery: '',
  searchFilters: {},
  
  setCurrentPage: (currentPage) => set({ currentPage }),
  setModalOpen: (modalOpen) => set({ modalOpen }),
  setDrawerOpen: (drawerOpen) => set({ drawerOpen }),
  setFullscreenVideo: (fullscreenVideo) => set({ fullscreenVideo }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSearchFilters: (searchFilters) => set({ searchFilters }),
}));

// ==================== VIDEO PLAYER STORE ====================

interface VideoPlayerState {
  currentVideo: Video | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  playbackRate: number;
  quality: string;
  showControls: boolean;
  isBuffering: boolean;
  
  setCurrentVideo: (video: Video | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  setIsMuted: (muted: boolean) => void;
  setIsFullscreen: (fullscreen: boolean) => void;
  setPlaybackRate: (rate: number) => void;
  setQuality: (quality: string) => void;
  setShowControls: (show: boolean) => void;
  setIsBuffering: (buffering: boolean) => void;
  resetPlayer: () => void;
}

const initialPlayerState = {
  currentVideo: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  isMuted: false,
  isFullscreen: false,
  playbackRate: 1,
  quality: 'auto',
  showControls: true,
  isBuffering: false,
};

export const useVideoPlayerStore = create<VideoPlayerState>()((set) => ({
  ...initialPlayerState,
  
  setCurrentVideo: (currentVideo) => set({ currentVideo }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  setVolume: (volume) => set({ volume, isMuted: volume === 0 }),
  setIsMuted: (isMuted) => set({ isMuted }),
  setIsFullscreen: (isFullscreen) => set({ isFullscreen }),
  setPlaybackRate: (playbackRate) => set({ playbackRate }),
  setQuality: (quality) => set({ quality }),
  setShowControls: (showControls) => set({ showControls }),
  setIsBuffering: (isBuffering) => set({ isBuffering }),
  resetPlayer: () => set(initialPlayerState),
}));

// ==================== UI STORE ====================

interface UIState {
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  searchOpen: boolean;
  activeModal: string | null;
  toastMessage: string | null;
  toastType: 'success' | 'error' | 'info' | 'warning';
  
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: false,
  mobileMenuOpen: false,
  searchOpen: false,
  activeModal: null,
  toastMessage: null,
  toastType: 'info',
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
  openModal: (activeModal) => set({ activeModal }),
  closeModal: () => set({ activeModal: null }),
  showToast: (toastMessage, toastType = 'info') => set({ toastMessage, toastType }),
  hideToast: () => set({ toastMessage: null }),
}));

// ==================== SEARCH STORE ====================

interface SearchStoreState {
  query: string;
  filters: SearchFilters;
  results: Video[];
  isSearching: boolean;
  totalResults: number;
  currentPage: number;
  suggestions: string[];
  recentSearches: string[];
  
  setQuery: (query: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  setResults: (results: Video[], total: number) => void;
  setIsSearching: (searching: boolean) => void;
  setCurrentPage: (page: number) => void;
  setSuggestions: (suggestions: string[]) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  resetSearch: () => void;
}

export const useSearchStore = create<SearchStoreState>()(
  persist(
    (set) => ({
      query: '',
      filters: {},
      results: [],
      isSearching: false,
      totalResults: 0,
      currentPage: 1,
      suggestions: [],
      recentSearches: [],
      
      setQuery: (query) => set({ query }),
      setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
      setResults: (results, totalResults) => set({ results, totalResults }),
      setIsSearching: (isSearching) => set({ isSearching }),
      setCurrentPage: (currentPage) => set({ currentPage }),
      setSuggestions: (suggestions) => set({ suggestions }),
      addRecentSearch: (query) => set((state) => ({
        recentSearches: [query, ...state.recentSearches.filter(s => s !== query)].slice(0, 10)
      })),
      clearRecentSearches: () => set({ recentSearches: [] }),
      resetSearch: () => set({
        query: '',
        filters: {},
        results: [],
        isSearching: false,
        totalResults: 0,
        currentPage: 1,
        suggestions: [],
      }),
    }),
    {
      name: 'rashid-leaks-search',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ recentSearches: state.recentSearches }),
    }
  )
);
