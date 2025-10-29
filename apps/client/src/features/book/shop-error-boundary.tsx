'use client';

import { Component, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ShopErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Shop Error Boundary caught an error:', error, errorInfo);

    // In a real app, you would send this to your error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
          <Card className='w-full max-w-md'>
            <CardHeader className='text-center'>
              <div className='mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4'>
                <AlertCircle className='h-8 w-8 text-red-600' />
              </div>
              <CardTitle className='text-xl text-gray-900'>
                Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className='text-center space-y-4'>
              <p className='text-gray-600'>
                We encountered an unexpected error while loading the shop page.
                Please try refreshing the page or contact support if the problem
                persists.
              </p>

              {this.state.error && (
                <details className='text-left bg-gray-50 p-3 rounded-md'>
                  <summary className='cursor-pointer text-sm font-medium text-gray-700 mb-2'>
                    Error Details
                  </summary>
                  <pre className='text-xs text-gray-600 overflow-auto'>
                    {this.state.error.message}
                  </pre>
                </details>
              )}

              <div className='flex flex-col sm:flex-row gap-3'>
                <Button
                  onClick={() => window.location.reload()}
                  className='flex-1'
                >
                  <RefreshCw className='h-4 w-4 mr-2' />
                  Refresh Page
                </Button>
                <Button
                  variant='outline'
                  onClick={() => (window.location.href = '/')}
                  className='flex-1'
                >
                  <Home className='h-4 w-4 mr-2' />
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export function useErrorHandler() {
  const handleError = (error: Error, context?: string) => {
    console.error(`Error in ${context || 'unknown context'}:`, error);

    // In a real app, you would send this to your error reporting service
    // Example: Sentry.captureException(error, { tags: { context } });
  };

  return { handleError };
}
