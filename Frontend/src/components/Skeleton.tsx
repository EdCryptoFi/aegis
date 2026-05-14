'use client';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-slate-700 rounded ${className}`} />
  );
}

export function AgentCardSkeleton() {
  return (
    <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-slate-700/50 rounded-xl p-4 text-center">
            <Skeleton className="h-3 w-20 mx-auto mb-2" />
            <Skeleton className="h-8 w-12 mx-auto" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-slate-900/50 rounded-lg p-3">
            <Skeleton className="h-2 w-16 mb-1" />
            <Skeleton className="h-5 w-24" />
          </div>
        ))}
      </div>

      <div className="bg-slate-900/50 rounded-xl p-5">
        <Skeleton className="h-4 w-32 mb-4" />
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-center">
              <Skeleton className="h-6 w-8 mx-auto mb-1" />
              <Skeleton className="h-3 w-12 mx-auto mb-1" />
              <Skeleton className="h-2 w-16 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AgentListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-slate-800/80 border border-slate-700 rounded-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Skeleton className="h-8 rounded" />
            <Skeleton className="h-8 rounded" />
            <Skeleton className="h-8 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function BadgeSkeleton() {
  return (
    <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex items-center gap-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-4 w-24 mb-1" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4">
      <div className="flex justify-between mb-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-8 w-24 rounded" />
        ))}
      </div>
      <Skeleton className="h-40 w-full rounded" />
      <div className="grid grid-cols-3 gap-4 mt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="text-center">
            <Skeleton className="h-3 w-12 mx-auto mb-1" />
            <Skeleton className="h-5 w-8 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}