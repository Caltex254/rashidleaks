// RASHID LEAKS - CRITICAL: Android Back Button History Manager
// This module handles all navigation state for proper Android Back button support
// Uses History API (pushState, replaceState, popstate) for correct back navigation

import type { HistoryState, NavigationState } from '@/types';

type StateHandler = (state: HistoryState) => void;
type PopStateCallback = (state: HistoryState | null) => void;

class HistoryManager {
  private state: NavigationState;
  private listeners: Set<PopStateCallback>;
  private isHandlingPopState: boolean = false;
  private scrollPositions: Map<string, number>;
  private formStates: Map<string, Record<string, unknown>>;

  constructor() {
    this.state = {
      currentPage: typeof window !== 'undefined' ? window.location.pathname : '/',
      historyStack: [],
      modalOpen: false,
      drawerOpen: false,
      fullscreenVideo: false,
      searchQuery: '',
      searchFilters: {},
    };
    this.listeners = new Set();
    this.scrollPositions = new Map();
    this.formStates = new Map();

    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }

  private initialize(): void {
    // Listen for popstate events (Back/Forward button)
    window.addEventListener('popstate', this.handlePopState.bind(this));
    
    // Initialize with current state
    const initialState: HistoryState = {
      type: 'page',
      key: window.location.pathname,
      timestamp: Date.now(),
    };
    
    // Replace initial state to avoid duplicate entries on first load
    history.replaceState(
      { ...initialState, rashidLeaks: true },
      '',
      window.location.pathname
    );
    
    this.state.historyStack = [initialState];
  }

  private handlePopState(event: PopStateEvent): void {
    if (this.isHandlingPopState) return;
    
    this.isHandlingPopState = true;
    
    const poppedState = event.state as HistoryState | null;
    
    // Update internal state
    if (poppedState && this.state.historyStack.length > 0) {
      this.state.historyStack.pop();
      
      if (poppedState.type === 'modal' || poppedState.type === 'drawer') {
        this.state.modalOpen = false;
        this.state.drawerOpen = false;
      } else if (poppedState.type === 'fullscreen') {
        this.state.fullscreenVideo = false;
      } else if (poppedState.type === 'page') {
        this.state.previousPage = this.state.currentPage;
        this.state.currentPage = poppedState.key;
      }
    }
    
    // Notify all listeners
    this.listeners.forEach(callback => {
      try {
        callback(poppedState);
      } catch (error) {
        console.error('Error in popstate listener:', error);
      }
    });
    
    // Restore scroll position if available
    if (poppedState?.key && poppedState.scrollPosition !== undefined) {
      requestAnimationFrame(() => {
        window.scrollTo(0, poppedState.scrollPosition!);
      });
    }
    
    setTimeout(() => {
      this.isHandlingPopState = false;
    }, 100);
  }

  /**
   * Navigate to a new page - creates a new history entry
   * Use this for page navigations (Home -> Video, Category -> Video, etc.)
   */
  pushPage(path: string, data?: Record<string, unknown>, saveScrollPosition: boolean = true): void {
    // Save current scroll position before navigating
    if (saveScrollPosition) {
      this.saveScrollPosition(this.state.currentPage);
    }
    
    const newState: HistoryState = {
      type: 'page',
      key: path,
      data,
      scrollPosition: 0,
      timestamp: Date.now(),
    };
    
    this.state.previousPage = this.state.currentPage;
    this.state.currentPage = path;
    this.state.historyStack.push(newState);
    
    // Push new history entry
    history.pushState({ ...newState, rashidLeaks: true }, '', path);
  }

  /**
   * Replace current state without creating history entry
   * Use this for modals, drawers, overlays (so Back closes them)
   */
  replaceState(type: 'modal' | 'drawer' | 'fullscreen' | 'overlay', key: string, data?: Record<string, unknown>): void {
    const newState: HistoryState = {
      type,
      key,
      data,
      scrollPosition: window.scrollY,
      timestamp: Date.now(),
    };
    
    // Update internal state
    if (type === 'modal') {
      this.state.modalOpen = true;
    } else if (type === 'drawer') {
      this.state.drawerOpen = true;
    } else if (type === 'fullscreen') {
      this.state.fullscreenVideo = true;
    }
    
    // Replace current history entry (no new entry created)
    history.replaceState({ ...newState, rashidLeaks: true }, '', window.location.pathname);
  }

  /**
   * Close modal/drawer/fullscreen - restores previous state
   */
  closeOverlay(): boolean {
    if (this.state.fullscreenVideo) {
      this.restorePreviousState();
      this.state.fullscreenVideo = false;
      return true;
    }
    
    if (this.state.modalOpen || this.state.drawerOpen) {
      this.restorePreviousState();
      this.state.modalOpen = false;
      this.state.drawerOpen = false;
      return true;
    }
    
    return false;
  }

  /**
   * Go back in history programmatically
   */
  goBack(): void {
    // First check if there's an overlay to close
    if (this.closeOverlay()) {
      return;
    }
    
    // Otherwise go back in browser history
    if (this.state.historyStack.length > 1) {
      history.back();
    }
  }

  /**
   * Restore the previous state from stack
   */
  private restorePreviousState(): void {
    if (this.state.historyStack.length > 0) {
      const prevState = this.state.historyStack[this.state.historyStack.length - 1];
      history.replaceState({ ...prevState, rashidLeaks: true }, '', window.location.pathname);
    }
  }

  /**
   * Save scroll position for a specific page
   */
  saveScrollPosition(key: string): void {
    this.scrollPositions.set(key, window.scrollY);
  }

  /**
   * Get saved scroll position for a page
   */
  getScrollPosition(key: string): number {
    return this.scrollPositions.get(key) ?? 0;
  }

  /**
   * Save form/search state for restoration on back navigation
   */
  saveFormState(key: string, state: Record<string, unknown>): void {
    this.formStates.set(key, state);
  }

  /**
   * Get saved form/search state
   */
  getFormState(key: string): Record<string, unknown> | undefined {
    return this.formStates.get(key);
  }

  /**
   * Subscribe to popstate events
   */
  subscribe(callback: PopStateCallback): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Get current navigation state
   */
  getState(): NavigationState {
    return { ...this.state };
  }

  /**
   * Check if there's an overlay open that should be closed first
   */
  hasOverlayOpen(): boolean {
    return this.state.modalOpen || this.state.drawerOpen || this.state.fullscreenVideo;
  }

  /**
   * Update search state (without creating history entry)
   */
  updateSearchState(query: string, filters?: Record<string, unknown>): void {
    this.state.searchQuery = query;
    if (filters) {
      this.state.searchFilters = { ...this.state.searchFilters, ...filters };
    }
    
    // Save search state for potential restoration
    this.saveFormState('search', { query, filters: this.state.searchFilters });
  }

  /**
   * Clear all stored states (useful for logout)
   */
  clearAll(): void {
    this.state = {
      currentPage: '/',
      historyStack: [],
      modalOpen: false,
      drawerOpen: false,
      fullscreenVideo: false,
      searchQuery: '',
      searchFilters: {},
    };
    this.scrollPositions.clear();
    this.formStates.clear();
  }

  /**
   * Get the number of pages in history stack
   */
  getHistoryLength(): number {
    return this.state.historyStack.length;
  }

  /**
   * Can we go back?
   */
  canGoBack(): boolean {
    return this.hasOverlayOpen() || this.state.historyStack.length > 1 || window.history.length > 1;
  }
}

// Singleton instance
export const historyManager = typeof window !== 'undefined' ? new HistoryManager() : null;

/**
 * Hook-like function for using history manager in components
 * Returns methods for managing navigation state
 */
export function getNavigationHelpers() {
  if (!historyManager) {
    return {
      pushPage: () => {},
      replaceState: () => {},
      closeOverlay: () => false,
      goBack: () => {},
      saveScrollPosition: () => {},
      getScrollPosition: () => 0,
      saveFormState: () => {},
      getFormState: () => undefined,
      subscribe: () => () => {},
      getState: () => ({}) as NavigationState,
      hasOverlayOpen: () => false,
      updateSearchState: () => {},
      canGoBack: () => false,
    };
  }

  return {
    pushPage: historyManager.pushPage.bind(historyManager),
    replaceState: historyManager.replaceState.bind(historyManager),
    closeOverlay: historyManager.closeOverlay.bind(historyManager),
    goBack: historyManager.goBack.bind(historyManager),
    saveScrollPosition: historyManager.saveScrollPosition.bind(historyManager),
    getScrollPosition: historyManager.getScrollPosition.bind(historyManager),
    saveFormState: historyManager.saveFormState.bind(historyManager),
    getFormState: historyManager.getFormState.bind(historyManager),
    subscribe: historyManager.subscribe.bind(historyManager),
    getState: historyManager.getState.bind(historyManager),
    hasOverlayOpen: historyManager.hasOverlayOpen.bind(historyManager),
    updateSearchState: historyManager.updateSearchState.bind(historyManager),
    canGoBack: historyManager.canGoBack.bind(historyManager),
  };
}

export default historyManager;
