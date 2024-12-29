import React, { useState, useEffect, useRef } from 'react';
import Profile from './Profile';
import Calendar from './Calendar';
import RecentEntries from './RecentEntries';
import { DiaryEntry, UserProfile } from '../../types';
import { isSameDay } from 'date-fns';

interface DashboardProps {
  entries: DiaryEntry[];
  profile: UserProfile;
  onEditProfile: (profile: UserProfile) => void;
}

export default function Dashboard({ entries, profile, onEditProfile }: DashboardProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredDate, setFilteredDate] = useState<Date | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setFilteredDate(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setFilteredDate(date);
  };

  const filteredEntries = filteredDate
    ? entries.filter(entry => isSameDay(new Date(entry.date), filteredDate))
    : entries;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Profile profile={profile} onEdit={onEditProfile} />
        <RecentEntries entries={filteredEntries} />
      </div>
      <div ref={calendarRef}>
        <Calendar
          entries={entries}
          selectedDate={selectedDate}
          onSelectDate={handleDateSelect}
        />
      </div>
    </div>
  );
}