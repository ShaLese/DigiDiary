import React, { useState, useRef, useEffect } from 'react';
import { PlusCircle, Image, Video, Tag as TagIcon, Smile, Save, Calendar } from 'lucide-react';
import { DiaryEntry } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import MiniCalendar from './MiniCalendar';
import { format } from 'date-fns';

interface EntryFormProps {
  initialEntry?: DiaryEntry;
  onSave: (entry: DiaryEntry) => void;
}

const moods = ['happy', 'sad', 'neutral', 'excited', 'tired'] as const;

export default function EntryForm({ initialEntry, onSave }: EntryFormProps) {
  const navigate = useNavigate();
  const [title, setTitle] = useState(initialEntry?.title || '');
  const [content, setContent] = useState(initialEntry?.content || '');
  const [tags, setTags] = useState<string[]>(initialEntry?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [images, setImages] = useState<string[]>(initialEntry?.images || []);
  const [videos, setVideos] = useState<string[]>(initialEntry?.videos || []);
  const [mood, setMood] = useState<DiaryEntry['mood']>(initialEntry?.mood || 'neutral');
  const [selectedDate, setSelectedDate] = useState<Date>(initialEntry?.date ? new Date(initialEntry.date) : new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setVideos(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      if (tagInput.trim()) {
        setTags([...tags, tagInput.trim()]);
        setTagInput('');
      }
    }
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const updatedEntry: DiaryEntry = {
      id: initialEntry?.id || uuidv4(),
      user_id: initialEntry?.user_id || '', // This will be set by the backend
      title,
      content,
      date: selectedDate.toISOString(),
      tags,
      images,
      videos,
      mood,
      created_at: initialEntry?.created_at || now,
      updated_at: now
    };
    onSave(updatedEntry);
    navigate('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-start gap-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title your memory..."
          className="flex-1 px-4 py-2 text-xl font-semibold border-b-2 border-gray-200 focus:border-blue-500 outline-none"
          required
        />
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowCalendar(!showCalendar)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span>{format(selectedDate, 'MMM d, yyyy')}</span>
          </button>
          {showCalendar && (
            <div className="absolute right-0 mt-2 z-50">
              <MiniCalendar
                selectedDate={selectedDate}
                onSelectDate={(date) => {
                  setSelectedDate(date);
                  setShowCalendar(false);
                }}
              />
            </div>
          )}
        </div>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write about your day..."
        className="w-full h-40 px-4 py-2 text-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
        required
      />

      <div className="space-y-2">
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-white">
          {tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-sm"
            >
              #{tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 hover:text-blue-900"
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            id="tags"
            value={tagInput}
            onChange={handleTagInputChange}
            onKeyDown={handleTagKeyDown}
            placeholder="Add tags..."
            className="flex-1 min-w-[120px] border-0 focus:ring-0 p-0 text-sm"
          />
        </div>
        <p className="text-sm text-gray-500">
          Press Enter to add a tag
        </p>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
          <div className="flex items-center gap-1 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            <Image className="w-4 h-4" />
            <span className="text-sm">Add Images</span>
          </div>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="file"
            accept="video/*"
            multiple
            onChange={handleVideoUpload}
            className="hidden"
          />
          <div className="flex items-center gap-1 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            <Video className="w-4 h-4" />
            <span className="text-sm">Add Videos</span>
          </div>
        </label>
      </div>

      {(images.length > 0 || videos.length > 0) && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((img, i) => (
            <img key={i} src={img} alt="" className="w-full h-24 object-cover rounded-lg" />
          ))}
          {videos.map((video, i) => (
            <video key={i} src={video} className="w-full h-24 object-cover rounded-lg" controls />
          ))}
        </div>
      )}

      <div className="flex items-center gap-4">
        <Smile className="w-5 h-5 text-gray-500" />
        <select
          value={mood}
          onChange={(e) => setMood(e.target.value as DiaryEntry['mood'])}
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        >
          {moods.map(m => (
            <option key={m} value={m}>
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Save className="w-5 h-5" />
        {initialEntry ? 'Update Entry' : 'Save Entry'}
      </button>
    </form>
  );
}