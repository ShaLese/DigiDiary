import React from 'react';
import { format } from 'date-fns';
import { DiaryEntry } from '../../types';
import { Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RecentEntriesProps {
  entries: DiaryEntry[];
}

export default function RecentEntries({ entries }: RecentEntriesProps) {
  const recentEntries = entries.slice(0, 10);

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Recent Entries</h2>
        </div>
        <Link
          to="/entries"
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-4">
        {recentEntries.map(entry => (
          <Link
            key={entry.id}
            to={`/entries/${entry.id}`}
            className="block p-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900">{entry.title}</h3>
              <span className="text-sm text-gray-500">
                {format(new Date(entry.date), 'MMM d, yyyy')}
              </span>
            </div>
            <p className="text-gray-600 text-sm line-clamp-2">{entry.content}</p>
            {entry.tags.length > 0 && (
              <div className="flex gap-2 mt-2">
                {entry.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}