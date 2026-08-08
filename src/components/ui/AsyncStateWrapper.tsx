import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AlertCircle, FolderOpen, RefreshCw } from 'lucide-react';

interface AsyncStateWrapperProps {
  isLoading: boolean;
  error?: Error | string | null;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onRetry?: () => void;
  loadingSkeleton?: React.ReactNode;
  children: React.ReactNode;
}

export const AsyncStateWrapper: React.FC<AsyncStateWrapperProps> = ({
  isLoading,
  error,
  isEmpty,
  emptyTitle = 'No items found',
  emptyDescription = 'There is no data to display at the moment.',
  onRetry,
  loadingSkeleton,
  children,
}) => {
  if (isLoading) {
    if (loadingSkeleton) return <>{loadingSkeleton}</>;
    return (
      <div className="space-y-4 p-4 w-full">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-16 w-2/3" />
      </div>
    );
  }

  if (error) {
    const errorMessage = typeof error === 'string' ? error : error.message || 'An unexpected error occurred';
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center my-4">
        <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-foreground mb-1">Failed to load content</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">{errorMessage}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center my-4">
        <FolderOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <h3 className="text-lg font-medium text-foreground mb-1">{emptyTitle}</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">{emptyDescription}</p>
      </div>
    );
  }

  return <>{children}</>;
};
