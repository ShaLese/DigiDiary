import React, { useState, useEffect } from 'react';
import { migrateLocalEntries } from '../lib/supabase';
import { DiaryEntry } from '../types';

export default function DataMigration() {
  const [migrating, setMigrating] = useState(false);
  const [status, setStatus] = useState('');
  const [hasLocalData, setHasLocalData] = useState(false);

  useEffect(() => {
    // Check localStorage on component mount
    const checkLocalStorage = () => {
      const keys = Object.keys(localStorage);
      console.log('All localStorage keys:', keys);
      
      const saved = localStorage.getItem('diaryEntries');
      console.log('diaryEntries raw value:', saved);
      
      if (saved) {
        try {
          const entries = JSON.parse(saved);
          console.log('Parsed entries:', entries);
          setHasLocalData(entries && entries.length > 0);
          setStatus(`Found ${entries.length} entries in local storage`);
        } catch (e) {
          console.error('Error parsing localStorage:', e);
          setStatus('Error reading local storage data');
        }
      }
    };

    checkLocalStorage();
  }, []);

  const handleMigration = async () => {
    try {
      setMigrating(true);
      setStatus('Starting migration...');

      // Get entries from localStorage
      const saved = localStorage.getItem('diaryEntries');
      if (!saved) {
        setStatus('No local entries found to migrate.');
        return;
      }

      const localEntries: DiaryEntry[] = JSON.parse(saved);
      if (localEntries.length === 0) {
        setStatus('No entries to migrate.');
        return;
      }

      setStatus(`Migrating ${localEntries.length} entries...`);
      await migrateLocalEntries(localEntries);
      
      // Clear localStorage after successful migration
      localStorage.removeItem('diaryEntries');
      
      setStatus(`Successfully migrated ${localEntries.length} entries! Please refresh the page.`);
    } catch (error) {
      console.error('Migration error:', error);
      setStatus('Error during migration. Please try again.');
    } finally {
      setMigrating(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white rounded-lg shadow-lg max-w-sm">
      <h3 className="text-lg font-semibold mb-2">Data Migration</h3>
      <p className="text-sm text-gray-600 mb-4">
        {hasLocalData 
          ? 'Local entries found! Click below to migrate them to the database.'
          : 'Checking for local entries...'}
      </p>
      <button
        onClick={handleMigration}
        disabled={migrating || !hasLocalData}
        className={`w-full px-4 py-2 rounded-lg text-white ${
          migrating || !hasLocalData ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {migrating ? 'Migrating...' : 'Migrate Entries'}
      </button>
      {status && (
        <p className="mt-2 text-sm text-gray-600">{status}</p>
      )}
    </div>
  );
}
