import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, Tag as TagIcon, Edit, Clock, Smile } from 'lucide-react';
import { DiaryEntry } from '../types';
import ImageGallery from './ImageGallery';

interface EntryViewProps {
  entries: DiaryEntry[];
  onUpdate?: (entry: DiaryEntry) => void;
}

const formatDate = (dateString: string | undefined, formatStr: string): string => {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

export default function EntryView({ entries, onUpdate }: EntryViewProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const entry = entries.find(e => e.id === id);

  useEffect(() => {
    if (entry && onUpdate) {
      const updatedEntry = {
        ...entry,
        lastOpenedAt: new Date().toISOString()
      };
      onUpdate(updatedEntry);
    }
  }, [entry?.id]);

  if (!entry) {
    navigate('/entries');
    return null;
  }

  return (
    <article className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <h1 className="text-3xl font-bold text-gray-900">{entry.title}</h1>
        <button
          onClick={() => navigate(`/edit/${entry.id}`)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Edit className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(entry.date, 'MMMM d, yyyy')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>Created: {formatDate(entry.createdAt, 'MMM d, yyyy h:mm a')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>Last updated: {formatDate(entry.updatedAt, 'MMM d, yyyy h:mm a')}</span>
        </div>
      </div>

      <div className="prose max-w-none mb-8">
        {entry.content.split('\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {(entry.images.length > 0 || entry.videos.length > 0) && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Media</h2>
          <ImageGallery images={entry.images} videos={entry.videos} />
        </div>
      )}

      {entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {entry.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center gap-2">
        <Smile className="w-5 h-5 text-gray-500" />
        <span className="px-3 py-1 bg-gray-100 rounded-full text-sm capitalize">
          {entry.mood}
        </span>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={() => navigate('/entries')}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to all entries
        </button>
      </div>
    </article>
  );
}
