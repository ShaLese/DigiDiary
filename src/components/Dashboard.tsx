import React from 'react';
import { Link } from 'react-router-dom';
import { PenSquare, Calendar, Tag, Search, Clock as ClockIcon } from 'lucide-react';
import { DiaryEntry } from '../types';
import { useAuth } from '../contexts/AuthContext';
import Clock from './Clock';

interface DashboardProps {
  entries: DiaryEntry[];
  loading?: boolean;
}

export default function Dashboard({ entries, loading = false }: DashboardProps) {
  const { user } = useAuth();

  const recentEntries = entries.slice(0, 5);
  const totalEntries = entries.length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="h-8 w-64 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-48 bg-gray-200 rounded"></div>
            </div>
            <div className="h-10 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Quick Actions Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Entries Skeleton */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="h-6 w-48 bg-gray-200 rounded"></div>
          </div>
          <div className="divide-y">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6">
                <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {getGreeting()}, {user?.user_metadata?.full_name || 'there'}!
            </h1>
            <p className="text-gray-600">
              Welcome to your personal digital diary space.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
            <Clock />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/new"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow flex items-center gap-4"
        >
          <div className="bg-blue-100 rounded-lg p-3">
            <PenSquare className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">New Entry</h3>
            <p className="text-sm text-gray-600">Write about your day</p>
          </div>
        </Link>

        <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
          <div className="bg-green-100 rounded-lg p-3">
            <Calendar className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Total Entries</h3>
            <p className="text-sm text-gray-600">{totalEntries} entries</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
          <div className="bg-purple-100 rounded-lg p-3">
            <Tag className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Tags</h3>
            <p className="text-sm text-gray-600">Organize your thoughts</p>
          </div>
        </div>
      </div>

      {/* Recent Entries */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Recent Entries</h2>
          <Link
            to="/entries"
            className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
          >
            View all
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {recentEntries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentEntries.map((entry) => (
              <Link
                key={entry.id}
                to={`/entry/${entry.id}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-200 group"
              >
                <div className="p-6 space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600 line-clamp-1">
                      {entry.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs capitalize ${
                      entry.mood === 'happy' ? 'bg-green-100 text-green-700' :
                      entry.mood === 'sad' ? 'bg-red-100 text-red-700' :
                      entry.mood === 'excited' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {entry.mood}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2">
                    {entry.content}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <time>{new Date(entry.created_at).toLocaleDateString()}</time>
                    </div>

                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Tag className="w-4 h-4 text-gray-400" />
                        <div className="flex gap-1">
                          {entry.tags.slice(0, 2).map(tag => (
                            <span 
                              key={tag}
                              className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                          {entry.tags.length > 2 && (
                            <span className="text-gray-500 text-xs">
                              +{entry.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {(entry.images?.length > 0 || entry.videos?.length > 0) && (
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {entry.images?.length || 0} images, {entry.videos?.length || 0} videos
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 mb-4">No entries yet. Start writing your first entry!</p>
            <Link
              to="/new"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <span>Create your first entry</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
