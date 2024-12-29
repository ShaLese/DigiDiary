import React, { useState } from 'react';
import { Search, Tag as TagIcon, Smile } from 'lucide-react';
import { DiaryEntry } from '../types';

interface EntrySearchProps {
  entries: DiaryEntry[];
  onFilterChange: (filtered: DiaryEntry[]) => void;
}

export default function EntrySearch({ entries, onFilterChange }: EntrySearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState<string>('');

  // Get unique tags from all entries
  const allTags = Array.from(new Set(entries.flatMap(entry => entry.tags)));
  const allMoods = Array.from(new Set(entries.map(entry => entry.mood)));

  const handleSearch = (term: string, tags: string[], mood: string) => {
    const filtered = entries.filter(entry => {
      const matchesTerm = term === '' || 
        entry.title.toLowerCase().includes(term.toLowerCase()) ||
        entry.content.toLowerCase().includes(term.toLowerCase());

      const matchesTags = tags.length === 0 || 
        tags.every(tag => entry.tags.includes(tag));

      const matchesMood = mood === '' || entry.mood === mood;

      return matchesTerm && matchesTags && matchesMood;
    });

    onFilterChange(filtered);
  };

  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    handleSearch(searchTerm, newTags, selectedMood);
  };

  const toggleMood = (mood: string) => {
    const newMood = selectedMood === mood ? '' : mood;
    setSelectedMood(newMood);
    handleSearch(searchTerm, selectedTags, newMood);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg space-y-4">
      <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search entries..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            handleSearch(e.target.value, selectedTags, selectedMood);
          }}
          className="flex-1 outline-none text-gray-700"
        />
      </div>

      {/* Tags filter */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <TagIcon className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter by tags</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`
                px-3 py-1 rounded-full text-sm transition-colors
                ${selectedTags.includes(tag)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
              `}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Mood filter */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Smile className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter by mood</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {allMoods.map(mood => (
            <button
              key={mood}
              onClick={() => toggleMood(mood)}
              className={`
                px-3 py-1 rounded-full text-sm capitalize transition-colors
                ${selectedMood === mood
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
              `}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
