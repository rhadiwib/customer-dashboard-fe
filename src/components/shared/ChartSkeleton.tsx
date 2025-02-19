export function ChartSkeleton() {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="bg-gray-200 animate-pulse rounded-lg h-80 w-full">
        {/* Title skeleton */}
        <div className="h-6 w-1/3 bg-gray-200 rounded mb-4"></div>
        
        {/* Chart area skeleton */}
        <div className="h-60 bg-gray-200 rounded"></div>
        
        {/* Legend skeleton */}
        <div className="mt-4 flex gap-2">
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function SelectSkeleton() {
  return (
    <div className="animate-pulse rounded-md bg-gray-200 h-10 w-64">
      {/* Label skeleton */}
      <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
      
      {/* Select box skeleton */}
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  );
}