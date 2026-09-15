import { Skeleton } from '@/components/ui/skeleton';

const AppLoadingSkeleton = () => (
  <div className="min-h-screen bg-background" aria-busy="true" aria-label="Loading page">
    <div className="border-b border-border bg-background/95">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Skeleton className="h-9 w-36 rounded-lg" />
        <div className="hidden gap-3 sm:flex">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
        <Skeleton className="h-9 w-9 rounded-full sm:hidden" />
      </div>
    </div>
    <main className="container mx-auto max-w-6xl space-y-8 px-4 py-8">
      <div className="space-y-3">
        <Skeleton className="h-9 w-3/4 max-w-xl" />
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
  </div>
);

export default AppLoadingSkeleton;
