// RASHID LEAKS - Search Results Page
// With filters, sorting, and Android Back support for state preservation

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search as SearchIcon, SlidersHorizontal, X, Grid3X3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { VideoGrid } from '@/components/video';
import { useBackNavigation } from '@/hooks/useBackNavigation';
import { useSearchStore } from '@/lib/store';
import type { Video, SearchFilters } from '@/types';

// Mock search results
const MOCK_SEARCH_RESULTS: Video[] = [
  {
    id: 's1',
    title: 'Search Result - Premium HD Content',
    slug: 'search-1',
    creatorId: 'u1',
    categoryId: 'c1',
    videoUrl: '',
    thumbnailUrl: null,
    duration: 1500,
    viewCount: 89000,
    likeCount: 5600,
    favoriteCount: 2300,
    commentCount: 189,
    moderationStatus: 'APPROVED',
    visibility: 'PUBLIC',
    isExplicit: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    creator: {
      id: 'u1', username: 'creator', email: 'c@ex.com', role: 'CREATOR',
      displayName: 'Creator', emailVerified: true, isBanned: false, ageVerified: true,
      createdAt: new Date(), updatedAt: new Date(),
    },
  },
  // ... more mock results would go here
];

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'views', label: 'Most Viewed' },
  { value: 'likes', label: 'Most Liked' },
  { value: 'duration', label: 'Longest' },
];

const DURATION_OPTIONS = [
  { value: 'all', label: 'Any Duration' },
  { value: 'short', label: 'Under 10 min' },
  { value: 'medium', label: '10-30 min' },
  { value: 'long', label: 'Over 30 min' },
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const { addRecentSearch, recentSearches } = useSearchStore();

  // CRITICAL: Save search state for back navigation restoration
  const { saveFormState, getFormState } = useBackNavigation({
    pageKey: 'search',
  });

  // Restore saved state on mount (using initializer instead of setState in effect)
  const [savedQueryRestored, setSavedQueryRestored] = useState(false);
  
  // Initialize with saved state if available
  const [query, setQuery] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('rashid-leaks-search-state');
        if (saved) {
          const parsed = JSON.parse(saved);
          return parsed?.query || initialQuery || '';
        }
      } catch (e) { /* ignore */ }
    }
    return initialQuery || '';
  });

  const [filters, setFilters] = useState<SearchFilters>(() => ({
    query: initialQuery,
    sortBy: (searchParams.get('sort') as SearchFilters['sortBy']) || 'relevance',
    duration: (searchParams.get('duration') as SearchFilters['duration']) || 'all',
  }));
  
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Video[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Restore filters from saved state after mount
  useEffect(() => {
    if (!savedQueryRestored) {
      const savedState = getFormState('search');
      if (savedState && savedState.query) {
        setQuery(savedState.query as string);
        setFilters(prev => ({ ...prev, query: savedState.query as string }));
      }
      setSavedQueryRestored(true);
    }
  }, [getFormState, savedQueryRestored]);

  // Perform search
  const performSearch = useCallback(async (searchQuery: string, searchFilters?: Partial<SearchFilters>) => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    
    // Save current state for potential back navigation
    saveFormState('search', { 
      query: searchQuery, 
      filters: { ...filters, ...searchFilters } 
    });

    // Add to recent searches
    addRecentSearch(searchQuery);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // In real app: const response = await fetch(`/api/search?q=${searchQuery}&...`);
    setResults(MOCK_SEARCH_RESULTS);
    setIsLoading(false);
  }, [filters, saveFormState, addRecentSearch]);

  // Initial search on mount
  useEffect(() => {
    if (initialQuery && !savedQueryRestored) {
      performSearch(initialQuery);
    }
  }, [initialQuery, savedQueryRestored]);

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  // Handle filter change
  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    performSearch(query, newFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({ query, sortBy: 'relevance', duration: 'all' });
  };

  const hasActiveFilters = filters.sortBy !== 'relevance' || filters.duration !== 'all';

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <div className="container mx-auto px-4 py-6">
        {/* Search Header */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search videos, creators, tags..."
              className="pl-12 pr-12 py-4 text-lg bg-white/5 border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:border-red-500/50 focus:ring-red-500/20"
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </form>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-3 justify-between">
            {/* Sort & Duration Selects */}
            <div className="flex flex-wrap items-center gap-3">
              <Select value={filters.sortBy} onValueChange={(v) => handleFilterChange('sortBy', v)}>
                <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10">
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.duration} onValueChange={(v) => handleFilterChange('duration', v)}>
                <SelectTrigger className="w-36 bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10">
                  {DURATION_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-400 hover:text-white">
                  Clear filters
                </Button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-500'}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-500'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div className="max-w-2xl mx-auto">
              <p className="text-sm text-gray-500 mb-2">Recent Searches</p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.slice(0, 8).map((term, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setQuery(term);
                      performSearch(term);
                    }}
                    className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {/* Results Count */}
          {query && !isLoading && (
            <div className="flex items-center justify-between">
              <p className="text-gray-400">
                Showing results for{' '}
                <span className="text-white font-medium">"{query}"</span>
                {' '}({results.length} videos)
              </p>
              
              {/* Mobile Filters Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden border-white/20 text-white">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-[#1a1a1a] border-white/10 w-80 p-6">
                  <SheetHeader>
                    <SheetTitle className="text-white">Filters</SheetTitle>
                  </SheetHeader>
                  
                  <div className="space-y-6 mt-6">
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Sort By</label>
                      <Select value={filters.sortBy} onValueChange={(v) => handleFilterChange('sortBy', v)}>
                        <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1a1a] border-white/10">
                          {SORT_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Duration</label>
                      <Select value={filters.duration} onValueChange={(v) => handleFilterChange('duration', v)}>
                        <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1a1a] border-white/10">
                          {DURATION_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {hasActiveFilters && (
                      <Button variant="outline" onClick={clearFilters} className="w-full border-white/20">
                        Clear All Filters
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <VideoGrid videos={[]} isLoading skeletonCount={12} columns={4} />
          )}

          {/* No Results State */}
          {!isLoading && query && results.length === 0 && (
            <div className="text-center py-16">
              <SearchIcon className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
              <p className="text-gray-400 mb-4">
                We couldn't find any videos matching "{query}"
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Suggestions:</p>
                <ul className="text-sm text-gray-500 list-disc list-inside">
                  <li>Check your spelling</li>
                  <li>Try different keywords</li>
                  <li>Use more general terms</li>
                </ul>
              </div>
            </div>
          )}

          {/* Results Grid/List */}
          {!isLoading && results.length > 0 && (
            <VideoGrid 
              videos={results} 
              columns={viewMode === 'grid' ? 4 : 1}
              variant={viewMode === 'list' ? 'horizontal' : 'default'}
            />
          )}
        </div>
      </div>
    </div>
  );
}
