// RASHID LEAKS - CRITICAL: Android Back Button Hook
// This hook provides Android Back button support for all pages and components

'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { historyManager, getNavigationHelpers } from '@/lib/navigation/history-manager';

interface UseBackNavigationOptions {
  /** Custom handler when back is pressed. Return true to prevent default behavior */
  onBack?: () => boolean | void;
  /** Enable/disable the hook */
  enabled?: boolean;
  /** Current page key for scroll position saving */
  pageKey?: string;
  /** Whether there's a modal/overlay open that should close first */
  hasOverlay?: boolean;
  /** Whether video is in fullscreen mode */
  isFullscreen?: boolean;
}

interface BackNavigationState {
  canGoBack: boolean;
  hasOverlayOpen: boolean;
}

export function useBackNavigation(options: UseBackNavigationOptions = {}) {
  const {
    onBack,
    enabled = true,
    pageKey,
    hasOverlay: externalHasOverlay,
    isFullscreen: externalIsFullscreen,
  } = options;

  const [state, setState] = useState<BackNavigationState>({
    canGoBack: false,
    hasOverlayOpen: false,
  });

  const optionsRef = useRef(options);

  // Update ref when options change (not during render)
  useEffect(() => {
    optionsRef.current = { onBack, enabled, pageKey, hasOverlay: externalHasOverlay, isFullscreen: externalIsFullscreen };
  }, [onBack, enabled, pageKey, externalHasOverlay, externalIsFullscreen]);

  // Handle popstate event
  useEffect(() => {
    if (!enabled || !historyManager) return;

    const unsubscribe = historyManager.subscribe((poppedState) => {
      const { onBack: currentOnBack } = optionsRef.current;
      
      // Call custom handler if provided
      if (currentOnBack) {
        const handled = currentOnBack();
        if (handled === true) {
          return; // Prevented default behavior
        }
      }
      
      // Update state
      setState({
        canGoBack: historyManager.canGoBack(),
        hasOverlayOpen: historyManager.hasOverlayOpen(),
      });
    });

    return unsubscribe;
  }, [enabled]);

  // Save scroll position on unmount or page change
  useEffect(() => {
    if (!enabled || !pageKey || !historyManager) return;

    const handleScroll = () => {
      historyManager.saveScrollPosition(pageKey);
    };

    // Debounced scroll handler
    let scrollTimeout: NodeJS.Timeout;
    const debouncedScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 150);
    };

    window.addEventListener('scroll', debouncedScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', debouncedScroll);
      clearTimeout(scrollTimeout);
      if (pageKey && historyManager) {
        historyManager.saveScrollPosition(pageKey);
      }
    };
  }, [enabled, pageKey]);

  // Restore scroll position on mount
  useEffect(() => {
    if (!enabled || !pageKey || !historyManager) return;

    const savedPosition = historyManager.getScrollPosition(pageKey);
    if (savedPosition > 0) {
      requestAnimationFrame(() => {
        window.scrollTo(0, savedPosition);
      });
    }
  }, [enabled, pageKey]);

  /**
   * Navigate to a new page (creates history entry)
   */
  const pushPage = useCallback((path: string, data?: Record<string, unknown>) => {
    if (!historyManager) {
      window.location.href = path;
      return;
    }
    historyManager.pushPage(path, data);
  }, []);

  /**
   * Open a modal/drawer (replaces state so Back closes it)
   */
  const openOverlay = useCallback((
    type: 'modal' | 'drawer' | 'fullscreen' | 'overlay',
    key: string,
    data?: Record<string, unknown>
  ) => {
    if (!historyManager) return;
    historyManager.replaceState(type, key, data);
    setState(prev => ({ ...prev, hasOverlayOpen: type !== 'fullscreen' }));
  }, []);

  /**
   * Close current overlay
   */
  const closeOverlay = useCallback((): boolean => {
    if (!historyManager) return false;
    const closed = historyManager.closeOverlay();
    setState({
      canGoBack: historyManager.canGoBack(),
      hasOverlayOpen: historyManager.hasOverlayOpen(),
    });
    return closed;
  }, []);

  /**
   * Go back (handles overlays first, then browser back)
   */
  const goBack = useCallback(() => {
    if (!historyManager) {
      window.history.back();
      return;
    }

    // Check custom handler first
    const { onBack: currentOnBack } = optionsRef.current;
    if (currentOnBack) {
      const handled = currentOnBack();
      if (handled === true) return;
    }

    // Check for fullscreen first
    if (externalIsFullscreen || historyManager.getState().fullscreenVideo) {
      closeOverlay();
      return;
    }

    // Check for overlay
    if (externalHasOverlay || historyManager.hasOverlayOpen()) {
      closeOverlay();
      return;
    }

    // Normal back navigation
    historyManager.goBack();
  }, [closeOverlay, externalHasOverlay, externalIsFullscreen]);

  /**
   * Save form/search state for restoration
   */
  const saveFormState = useCallback((key: string, data: Record<string, unknown>) => {
    if (!historyManager) return;
    historyManager.saveFormState(key, data);
  }, []);

  /**
   * Get saved form state
   */
  const getFormState = useCallback((key: string) => {
    if (!historyManager) return undefined;
    return historyManager.getFormState(key);
  }, []);

  return {
    ...state,
    pushPage,
    openOverlay,
    closeOverlay,
    goBack,
    saveFormState,
    getFormState,
  };
}

export default useBackNavigation;

/**
 * Higher-order component wrapper for Android Back support
 * Wraps a component with back navigation handling
 */
export function withBackNavigation<T extends object>(
  Component: React.ComponentType<T>,
  options?: UseBackNavigationOptions
) {
  return function WrappedComponent(props: T) {
    const navigation = useBackNavigation(options);
    return <Component {...props} navigation={navigation} />;
  };
}
