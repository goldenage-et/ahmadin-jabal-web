'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { TSearchAnalyticsEvent, TSearchSuggestion } from '@repo/common';
import { Clock, Search, Star, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'popular' | 'recent' | 'trending';
  category?: string;
  bookCount?: number;
  searchCount?: number;
}

interface SearchSuggestionsProps {
  onSearch: (query: string) => void;
  searchSuggestions: TSearchSuggestion;
  className?: string;
}

// Convert backend analytics events to search suggestions
const convertAnalyticsToSuggestions = (
  events: TSearchAnalyticsEvent[] | undefined,
  type: 'popular' | 'recent' | 'trending',
): SearchSuggestion[] => {
  if (!events || !Array.isArray(events)) {
    return [];
  }
  return events.map((event) => ({
    id: event.id,
    text: event.query,
    type,
    bookCount: event.resultCount,
    searchCount: event.searchCount,
  }));
};

export function SearchSuggestions({
  onSearch,
  className,
  searchSuggestions,
}: SearchSuggestionsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<SearchSuggestion[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<
    SearchSuggestion[]
  >([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recent-searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse recent searches:', error);
      }
    }
  }, []);

  // Convert backend data to suggestions
  const popularSuggestions = convertAnalyticsToSuggestions(
    searchSuggestions.popularEvents,
    'popular',
  );
  const trendingSuggestions = convertAnalyticsToSuggestions(
    searchSuggestions.trendingEvents,
    'trending',
  );
  const recentSuggestions = convertAnalyticsToSuggestions(
    searchSuggestions.recentEvents,
    'recent',
  );

  // Filter suggestions based on search query
  // useEffect(() => {
  //     if (!searchQuery.trim()) {
  //         setFilteredSuggestions([]);
  //         return;
  //     }

  //     const query = searchQuery.toLowerCase();
  //     const allSuggestions = [...popularSuggestions, ...trendingSuggestions, ...recentSuggestions];

  //     const filtered = allSuggestions.filter(suggestion =>
  //         suggestion.text.toLowerCase().includes(query)
  //     );

  //     // Remove duplicates and limit results
  //     const unique = filtered.filter((suggestion, index, self) =>
  //         index === self.findIndex(s => s.text === suggestion.text)
  //     ).slice(0, 8);

  //     setFilteredSuggestions(unique);
  // }, [searchQuery, popularSuggestions, trendingSuggestions, recentSuggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputBlur = () => {
    // Delay closing to allow clicks on suggestions
    setTimeout(() => setIsOpen(false), 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev,
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && filteredSuggestions[selectedIndex]) {
          handleSuggestionClick(filteredSuggestions[selectedIndex]);
        } else if (searchQuery.trim()) {
          handleSearch(searchQuery.trim());
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    // Save to recent searches
    const newRecent = [
      { id: Date.now().toString(), text: query, type: 'recent' as const },
      ...recentSearches.filter((s) => s.text !== query),
    ].slice(0, 5);

    setRecentSearches(newRecent);
    localStorage.setItem('recent-searches', JSON.stringify(newRecent));

    setIsOpen(false);
    setSearchQuery('');
    onSearch(query);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    handleSearch(suggestion.text);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent-searches');
  };

  const getSuggestionIcon = (type: 'recent' | 'popular' | 'trending') => {
    switch (type) {
      case 'recent':
        return <Clock className='h-4 w-4 text-gray-400' />;
      case 'popular':
        return <TrendingUp className='h-4 w-4 text-blue-500' />;
      case 'trending':
        return <Star className='h-4 w-4 text-orange-500' />;
      default:
        return <Search className='h-4 w-4 text-gray-400' />;
    }
  };

  const getSuggestionBadge = (suggestion: SearchSuggestion) => {
    if (suggestion.category) {
      return (
        <Badge variant='secondary' className='text-xs'>
          {suggestion.category}
        </Badge>
      );
    }
    return null;
  };

  return (
    <div className={cn('relative w-full', className)}>
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
        <Input
          ref={inputRef}
          type='text'
          placeholder="I'm looking for..."
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          className='pl-10 pr-4 h-10 rounded-full border-2 border-gray-200 focus:border-primary focus:outline-none'
        />
        {searchQuery && (
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => {
              setSearchQuery('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className='absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 rounded-full'
          >
            ×
          </Button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && (
        <Card className='absolute top-full left-0 right-0 mt-2 z-50 shadow-lg border-0'>
          <CardContent className='p-0'>
            {searchQuery.trim() ? (
              // Filtered suggestions
              filteredSuggestions.length > 0 ? (
                <div className='py-2'>
                  {filteredSuggestions.map((suggestion, index) => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={cn(
                        'w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between group',
                        index === selectedIndex && 'bg-gray-50',
                      )}
                    >
                      <div className='flex items-center space-x-3'>
                        {getSuggestionIcon(suggestion.type)}
                        <span className='text-sm text-gray-900'>
                          {suggestion.text}
                        </span>
                        {suggestion.bookCount && (
                          <span className='text-xs text-gray-500'>
                            ({suggestion.bookCount} books)
                          </span>
                        )}
                      </div>
                      {getSuggestionBadge(suggestion)}
                    </button>
                  ))}
                </div>
              ) : (
                <div className='py-4 px-4 text-center text-sm text-gray-500'>
                  No suggestions found for "{searchQuery}"
                </div>
              )
            ) : (
              // Default suggestions when no search query
              <div className='py-2'>
                {/* Recent Searches */}
                {recentSuggestions.length > 0 && (
                  <div>
                    <div className='px-4 py-2 flex items-center justify-between'>
                      <span className='text-xs font-medium text-gray-500 uppercase tracking-wide'>
                        Recent Searches
                      </span>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={clearRecentSearches}
                        className='text-xs text-gray-400 hover:text-gray-600'
                      >
                        Clear
                      </Button>
                    </div>
                    {recentSuggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className='w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3'
                      >
                        {getSuggestionIcon('recent')}
                        <span className='text-sm text-gray-900'>
                          {suggestion.text}
                        </span>
                        {suggestion.bookCount && (
                          <span className='text-xs text-gray-500'>
                            ({suggestion.bookCount})
                          </span>
                        )}
                      </button>
                    ))}
                    <div className='border-t border-gray-100 my-2' />
                  </div>
                )}

                {/* Popular Searches */}
                <div className='px-4 py-2'>
                  <span className='text-xs font-medium text-gray-500 uppercase tracking-wide'>
                    Popular Searches
                  </span>
                </div>
                {popularSuggestions.slice(0, 6).map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className='w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between'
                  >
                    <div className='flex items-center space-x-3'>
                      {getSuggestionIcon('popular')}
                      <span className='text-sm text-gray-900'>
                        {suggestion.text}
                      </span>
                      {suggestion.bookCount && (
                        <span className='text-xs text-gray-500'>
                          ({suggestion.bookCount})
                        </span>
                      )}
                    </div>
                    {suggestion.searchCount && (
                      <Badge variant='secondary' className='text-xs'>
                        {suggestion.searchCount} searches
                      </Badge>
                    )}
                  </button>
                ))}

                {/* Trending Searches */}
                {trendingSuggestions.length > 0 && (
                  <div className='border-t border-gray-100 mt-2'>
                    <div className='px-4 py-2'>
                      <span className='text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center'>
                        <TrendingUp className='h-3 w-3 mr-1' />
                        Trending Now
                      </span>
                    </div>
                    {trendingSuggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className='w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between'
                      >
                        <div className='flex items-center space-x-3'>
                          <Star className='h-4 w-4 text-orange-500' />
                          <span className='text-sm text-gray-900'>
                            {suggestion.text}
                          </span>
                          {suggestion.bookCount && (
                            <span className='text-xs text-gray-500'>
                              ({suggestion.bookCount})
                            </span>
                          )}
                        </div>
                        {suggestion.searchCount && (
                          <Badge
                            variant='default'
                            className='text-xs bg-orange-500'
                          >
                            {suggestion.searchCount} searches
                          </Badge>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
