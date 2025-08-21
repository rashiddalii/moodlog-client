import React from 'react';

// Loading skeleton for cards
export const CardSkeleton = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-pulse ${className}`}>
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  );
};

// Loading skeleton for dashboard stats
export const StatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Loading skeleton for journal entry form
export const JournalFormSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 animate-pulse">
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
      </div>
      
      <div className="space-y-8">
        {/* Mood selection skeleton */}
        <div>
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
        
        {/* Textarea skeleton */}
        <div>
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-40 bg-gray-200 rounded-xl"></div>
        </div>
        
        {/* Button skeleton */}
        <div className="h-12 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );
};

// Loading skeleton for recent entries
export const RecentEntriesSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 rounded-xl border border-gray-200 animate-pulse">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-full ml-4"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Loading skeleton for sidebar navigation
export const SidebarSkeleton = () => {
  return (
    <div className="space-y-2 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center px-4 py-3">
          <div className="w-5 h-5 bg-gray-200 rounded mr-3"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Loading skeleton for welcome header
export const WelcomeHeaderSkeleton = () => {
  return (
    <div className="mb-8 animate-pulse">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-14 h-14 bg-gray-200 rounded-2xl"></div>
        <div className="flex-1">
          <div className="h-10 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-5 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
};
