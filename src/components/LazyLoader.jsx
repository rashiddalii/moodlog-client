import { Suspense, lazy } from 'react';

// Lazy load components
export const Dashboard = lazy(() => import('../pages/Dashboard'));
export const Journal = lazy(() => import('../pages/Journal'));
export const MoodTrends = lazy(() => import('../pages/MoodTrends'));
export const Stories = lazy(() => import('../pages/Stories'));
export const StoryDetail = lazy(() => import('../pages/StoryDetail'));
export const Profile = lazy(() => import('../pages/Profile'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-64">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Lazy wrapper component
export const LazyComponent = ({ children }) => (
  <Suspense fallback={<LoadingSpinner />}>
    {children}
  </Suspense>
);

