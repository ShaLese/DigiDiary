import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, Tag as TagIcon, Search, Clock, Smile, Image, Plus } from 'lucide-react';
import { DiaryEntry } from '../types';

interface EntryListProps {
  entries: DiaryEntry[];
}

const getContentPreview = (content: string, maxLength: number = 150) => {
  if (!content) return '';
  if (content.length <= maxLength) return content;
  return content.substring(0, content.lastIndexOf(' ', maxLength)) + '...';
};

export default function EntryList({ entries }: EntryListProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">All Moments</h2>
        <Link
          to="/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Moment</span>
        </Link>
      </div>
      
      <div className="grid gap-4">
        {entries.map((entry) => (
          <Link
            key={entry.id}
            to={`/entry/${entry.id}`}
            className="block bg-white rounded-lg shadow hover:shadow-lg transition-all duration-200 overflow-hidden group"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {entry.title}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <time>{format(new Date(entry.created_at), 'MMM d, yyyy')}</time>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <time>{format(new Date(entry.created_at), 'h:mm a')}</time>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Smile className="w-4 h-4" />
                      <span className="capitalize">{entry.mood}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 line-clamp-2 mt-3">
                    {getContentPreview(entry.content)}
                  </p>
                </div>

                <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
                  <Search className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-6">
                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <TagIcon className="w-4 h-4 text-gray-400 shrink-0" />
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map(tag => (
                        <span 
                          key={tag}
                          className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {(entry.images?.length > 0 || entry.videos?.length > 0) && (
                  <div className="flex items-center gap-2">
                    <Image className="w-4 h-4 text-gray-400" />
                    <div className="flex -space-x-2">
                      {entry.images?.slice(0, 3).map((img, i) => (
                        <div 
                          key={i}
                          className="inline-block h-8 w-8 rounded-full ring-2 ring-white overflow-hidden"
                        >
                          <img
                            src={img}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                      {((entry.images?.length || 0) + (entry.videos?.length || 0)) > 3 && (
                        <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 ring-2 ring-white">
                          <span className="text-xs text-gray-500">
                            +{((entry.images?.length || 0) + (entry.videos?.length || 0)) - 3}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}

        {entries.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 mb-4">No moments captured yet. Start writing your first moment!</p>
            <Link
              to="/new"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Create your first moment</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}