import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import { DiaryEntry } from '../../types';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  entries: DiaryEntry[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export default function Calendar({ entries, selectedDate, onSelectDate }: CalendarProps) {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const hasEntryOnDate = (date: Date) => {
    return entries.some(entry => isSameDay(new Date(entry.date), date));
  };

  const handlePrevMonth = () => {
    onSelectDate(subMonths(selectedDate, 1));
  };

  const handleNextMonth = () => {
    onSelectDate(addMonths(selectedDate, 1));
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Calendar</h2>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h3 className="text-lg font-medium text-gray-900">
          {format(selectedDate, 'MMMM yyyy')}
        </h3>
        <button 
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
        
        {days.map(day => {
          const hasEntry = hasEntryOnDate(day);
          const isSelected = isSameDay(day, selectedDate);
          
          return (
            <button
              key={day.toString()}
              onClick={() => onSelectDate(day)}
              className={`
                aspect-square p-2 rounded-lg text-sm relative
                ${isSelected ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}
                ${hasEntry ? 'font-semibold' : ''}
              `}
            >
              {format(day, 'd')}
              {hasEntry && !isSelected && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}