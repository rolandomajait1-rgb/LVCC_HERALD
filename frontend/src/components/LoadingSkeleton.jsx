export const ArticleCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200"></div>
    <div className="p-4">
      <div className="flex justify-between items-start mb-2">
        <div className="h-5 w-20 bg-gray-200 rounded"></div>
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
      </div>
      <div className="h-6 bg-gray-200 rounded mb-2"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      <div className="h-3 bg-gray-200 rounded w-32 mt-3 ml-auto"></div>
    </div>
  </div>
);

export const ArticleListSkeleton = ({ count = 3 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ArticleCardSkeleton key={i} />
    ))}
  </div>
);

export const SearchResultSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row mb-6 animate-pulse">
    <div className="md:w-1/3 h-48 md:h-auto bg-gray-200"></div>
    <div className="p-6 md:w-2/3 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-2">
          <div className="h-5 w-20 bg-gray-200 rounded"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
        <div className="h-7 bg-gray-200 rounded mb-2"></div>
        <div className="h-7 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-4/5"></div>
      </div>
      <div className="h-3 bg-gray-200 rounded w-32 mt-4 ml-auto"></div>
    </div>
  </div>
);

export const SearchResultListSkeleton = ({ count = 3 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <SearchResultSkeleton key={i} />
    ))}
  </>
);
