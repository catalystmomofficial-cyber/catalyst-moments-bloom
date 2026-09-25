import { Skeleton } from '@/components/ui/skeleton';

const LoadingHeader = () => (
  <div className="safe-area-top border-b border-border bg-background/95">
    <div className="container mx-auto flex h-16 items-center justify-between px-4">
      <Skeleton className="h-9 w-36 rounded-lg" />
      <div className="hidden gap-3 sm:flex">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-24" />
      </div>
      <Skeleton className="h-11 w-11 rounded-full sm:hidden" />
    </div>
  </div>
);

const AuthLoadingSkeleton = () => (
  <div className="flex flex-1 items-center justify-center px-4 py-10">
    <div className="w-full max-w-md space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="space-y-3 text-center">
        <Skeleton className="mx-auto h-8 w-48" />
        <Skeleton className="mx-auto h-4 w-64 max-w-full" />
      </div>
      <div className="space-y-4 pt-2">
        <Skeleton className="h-11 w-full rounded-md" />
        <Skeleton className="h-11 w-full rounded-md" />
        <Skeleton className="h-11 w-full rounded-md" />
      </div>
    </div>
  </div>
);

const EditorialLoadingSkeleton = () => (
  <main className="container mx-auto max-w-5xl space-y-7 px-4 py-8">
    <div className="space-y-3">
      <Skeleton className="h-5 w-28" />
      <Skeleton className="h-10 w-full max-w-2xl" />
      <Skeleton className="h-5 w-full max-w-xl" />
    </div>
    <Skeleton className="aspect-[16/7] w-full rounded-2xl" />
    <div className="space-y-3">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  </main>
);

const AppRouteLoadingSkeleton = () => (
  <main className="container mx-auto max-w-6xl space-y-6 px-4 py-6">
    <div className="flex items-center justify-between gap-4">
      <div className="space-y-2">
        <Skeleton className="h-8 w-56 max-w-[70vw]" />
        <Skeleton className="h-4 w-72 max-w-[78vw]" />
      </div>
      <Skeleton className="h-11 w-11 rounded-full" />
    </div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((item) => (
        <div key={item} className="space-y-4 rounded-2xl border border-border p-5">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  </main>
);

const MarketingLoadingSkeleton = () => (
  <main className="container mx-auto max-w-6xl space-y-8 px-4 py-8">
    <div className="space-y-3">
      <Skeleton className="h-10 w-3/4 max-w-xl" />
      <Skeleton className="h-5 w-full max-w-2xl" />
    </div>
    <div className="grid gap-5 md:grid-cols-3">
      {[0, 1, 2].map((item) => (
        <div key={item} className="space-y-4 rounded-2xl border border-border p-5">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      ))}
    </div>
  </main>
);

const AppLoadingSkeleton = () => {
  const pathname = typeof window === 'undefined' ? '/' : window.location.pathname;
  const isAuthRoute = ['/login', '/register', '/signup', '/forgot-password', '/reset-password'].some(
    (route) => pathname.startsWith(route),
  );
  const isEditorialRoute = pathname.startsWith('/blog') || pathname.startsWith('/guides');
  const isAppRoute = [
    '/dashboard', '/progress', '/workouts', '/meal-plan', '/wellness', '/community',
    '/coach', '/profile', '/courses', '/programs', '/birth-ball-guide', '/onboarding',
  ].some((route) => pathname.startsWith(route));

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background" aria-busy="true" aria-live="polite" aria-label="Loading page">
      <LoadingHeader />
      {isAuthRoute ? <AuthLoadingSkeleton /> : isEditorialRoute ? <EditorialLoadingSkeleton /> : isAppRoute ? <AppRouteLoadingSkeleton /> : <MarketingLoadingSkeleton />}
      <span className="sr-only">Loading {isAuthRoute ? 'account' : isEditorialRoute ? 'article' : isAppRoute ? 'app' : 'page'} content</span>
    </div>
  );
};

export default AppLoadingSkeleton;
