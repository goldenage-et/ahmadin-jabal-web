'use client';

import { getPopularSearchAnalytics } from '@/actions/book.action';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useApiMutation } from '@/hooks/use-api-mutation';
import {
  Clock,
  Filter,
  Info,
  Search,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface SearchInsightsProps {
  searchQuery: string;
  resultCount: number;
  filters?: Record<string, any>;
  onFilterChange?: (filters: Record<string, any>) => void;
}

export function SearchInsights({
  searchQuery,
  resultCount,
  filters = {},
  onFilterChange,
}: SearchInsightsProps) {
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<string[]>([]);
  const [showInsights, setShowInsights] = useState(false);
  const { mutate } = useApiMutation();

  useEffect(() => {
    mutate(() => getPopularSearchAnalytics(), {
      onSuccess: (data) => {
        setPopularSearches(data.popularEvents.map((event) => event.query));
        setRecentSearches(data.recentEvents.map((event) => event.query));
        setTrendingSearches(data.trendingEvents.map((event) => event.query));
      },
    });
  }, []);

  if (!searchQuery) return null;

  const hasFilters = Object.keys(filters).length > 0;
  const isPopularSearch = popularSearches.includes(searchQuery.toLowerCase());
  const isRecentSearch = recentSearches.includes(searchQuery.toLowerCase());

  const getSearchInsight = () => {
    if (resultCount === 0) {
      return {
        icon: Search,
        title: 'No results found',
        description: 'Try different keywords or adjust your filters',
        color: 'text-gray-500',
        bgColor: 'bg-gray-50',
      };
    }

    if (resultCount < 10) {
      return {
        icon: Info,
        title: 'Limited results',
        description: 'Consider broadening your search or removing filters',
        color: 'text-orange-500',
        bgColor: 'bg-orange-50',
      };
    }

    if (resultCount > 1000) {
      return {
        icon: TrendingUp,
        title: 'Many results',
        description: 'Try adding filters to narrow down your search',
        color: 'text-blue-500',
        bgColor: 'bg-blue-50',
      };
    }

    return {
      icon: Sparkles,
      title: 'Good results',
      description: 'Found relevant books for your search',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    };
  };

  const insight = getSearchInsight();
  const IconComponent = insight.icon;

  return (
    <div className='mb-6 space-y-4'>
      {/* Search Status Card */}
      <Card className={`border-l-4 ${insight.bgColor}`}>
        <CardContent className='p-4'>
          <div className='flex items-start justify-between'>
            <div className='flex items-start space-x-3'>
              <div className={`p-2 rounded-full ${insight.bgColor}`}>
                <IconComponent className={`h-4 w-4 ${insight.color}`} />
              </div>
              <div>
                <h3 className={`font-medium ${insight.color}`}>
                  {insight.title}
                </h3>
                <p className='text-sm text-gray-600 mt-1'>
                  {insight.description}
                </p>
                <div className='flex items-center space-x-2 mt-2'>
                  <span className='text-sm font-medium text-gray-900'>
                    "{searchQuery}"
                  </span>
                  <span className='text-sm text-gray-500'>
                    • {resultCount} {resultCount === 1 ? 'result' : 'results'}
                  </span>
                  {hasFilters && (
                    <Badge variant='secondary' className='text-xs'>
                      <Filter className='h-3 w-3 mr-1' />
                      Filtered
                    </Badge>
                  )}
                  {isPopularSearch && (
                    <Badge variant='default' className='text-xs bg-orange-500'>
                      <TrendingUp className='h-3 w-3 mr-1' />
                      Popular
                    </Badge>
                  )}
                  {isRecentSearch && (
                    <Badge variant='outline' className='text-xs'>
                      <Clock className='h-3 w-3 mr-1' />
                      Recent
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setShowInsights(!showInsights)}
              className='text-gray-400 hover:text-gray-600'
            >
              <Info className='h-4 w-4' />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Expanded Insights */}
      {showInsights && (
        <Card>
          <CardContent className='p-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Search Suggestions */}
              <div>
                <h4 className='font-medium text-gray-900 mb-3 flex items-center'>
                  <Search className='h-4 w-4 mr-2' />
                  Related Searches
                </h4>
                <div className='space-y-2'>
                  {popularSearches
                    .filter(
                      (search) =>
                        search !== searchQuery.toLowerCase() &&
                        search.includes(
                          searchQuery.toLowerCase().split(' ')[0],
                        ),
                    )
                    .slice(0, 5)
                    .map((relatedSearch, index) => (
                      <Button
                        key={index}
                        variant='ghost'
                        size='sm'
                        className='w-full justify-start text-left h-auto py-2 px-3'
                        onClick={() =>
                          onFilterChange?.({ search: relatedSearch })
                        }
                      >
                        <span className='text-sm text-gray-600 hover:text-gray-900'>
                          {relatedSearch}
                        </span>
                      </Button>
                    ))}
                </div>
              </div>

              {/* Search Tips */}
              <div>
                <h4 className='font-medium text-gray-900 mb-3 flex items-center'>
                  <Sparkles className='h-4 w-4 mr-2' />
                  Search Tips
                </h4>
                <div className='space-y-2 text-sm text-gray-600'>
                  <div className='flex items-start space-x-2'>
                    <span className='text-blue-500 mt-1'>•</span>
                    <span>Use specific book names for better results</span>
                  </div>
                  <div className='flex items-start space-x-2'>
                    <span className='text-blue-500 mt-1'>•</span>
                    <span>Try different keywords if no results found</span>
                  </div>
                  <div className='flex items-start space-x-2'>
                    <span className='text-blue-500 mt-1'>•</span>
                    <span>Use filters to narrow down your search</span>
                  </div>
                  <div className='flex items-start space-x-2'>
                    <span className='text-blue-500 mt-1'>•</span>
                    <span>Check spelling and try synonyms</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
