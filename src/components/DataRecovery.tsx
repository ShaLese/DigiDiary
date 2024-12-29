import React, { useState, useEffect } from 'react';
import { migrateLocalEntries } from '../lib/supabase';
import { DiaryEntry } from '../types';

export default function DataRecovery() {
  const [status, setStatus] = useState('');
  const [recoveredEntries, setRecoveredEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    const checkAllStorageLocations = async () => {
      try {
        // Check IndexedDB
        const databases = await window.indexedDB.databases();
        console.log('Available IndexedDB databases:', databases);

        // Check all localStorage keys
        const allKeys = Object.keys(localStorage);
        console.log('All localStorage keys:', allKeys);

        // Check sessionStorage
        const sessionKeys = Object.keys(sessionStorage);
        console.log('All sessionStorage keys:', sessionKeys);

        // Try to find any keys containing 'diary' or 'entries'
        const potentialKeys = allKeys.filter(key => 
          key.toLowerCase().includes('diary') || 
          key.toLowerCase().includes('entries') ||
          key.toLowerCase().includes('backup')
        );

        console.log('Potential diary-related keys:', potentialKeys);

        // Check each potential key
        let foundEntries: DiaryEntry[] = [];
        potentialKeys.forEach(key => {
          try {
            const value = localStorage.getItem(key);
            if (value) {
              const parsed = JSON.parse(value);
              if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].title) {
                foundEntries = parsed;
                console.log(`Found entries in key: ${key}`, foundEntries);
              }
            }
          } catch (e) {
            console.log(`Error parsing key ${key}:`, e);
          }
        });

        if (foundEntries.length > 0) {
          setRecoveredEntries(foundEntries);
          setStatus(`Found ${foundEntries.length} entries! Click to migrate them.`);
        } else {
          setStatus('No recoverable entries found in browser storage.');
        }

      } catch (error) {
        console.error('Error checking storage:', error);
        setStatus('Error checking storage locations');
      }
    };

    checkAllStorageLocations();
  }, []);

  const handleRecover = async () => {
    if (recoveredEntries.length === 0) {
      return;
    }

    try {
      setStatus('Migrating recovered entries...');
      await migrateLocalEntries(recoveredEntries);
      setStatus(`Successfully migrated ${recoveredEntries.length} entries! Please refresh the page.`);
    } catch (error) {
      console.error('Recovery error:', error);
      setStatus('Error during migration. Please try again.');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white rounded-lg shadow-lg max-w-sm">
      <h3 className="text-lg font-semibold mb-2">Data Recovery</h3>
      <p className="text-sm text-gray-600 mb-4">
        Attempting to recover diary entries from browser storage...
      </p>
      {recoveredEntries.length > 0 && (
        <button
          onClick={handleRecover}
          className="w-full px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700"
        >
          Recover {recoveredEntries.length} Entries
        </button>
      )}
      {status && (
        <p className="mt-2 text-sm text-gray-600">{status}</p>
      )}
    </div>
  );
}
