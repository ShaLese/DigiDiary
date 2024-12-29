import React, { useState } from 'react';
import { format } from 'date-fns';

interface BackupRestoreProps {
  entries: any[];
  onEntriesImported: (entries: any[]) => void;
}

export default function BackupRestore({ entries, onEntriesImported }: BackupRestoreProps) {
  const [lastBackup, setLastBackup] = useState<string | null>(
    localStorage.getItem('lastBackupTime')
  );

  const handleBackup = () => {
    const backup = {
      entries,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `digidiary-backup-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    const now = new Date().toISOString();
    setLastBackup(now);
    localStorage.setItem('lastBackupTime', now);
  };

  const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const backup = JSON.parse(e.target?.result as string);
        if (backup.entries) {
          await onEntriesImported(backup.entries);
          alert('Backup restored successfully!');
        }
      } catch (error) {
        console.error('Error restoring backup:', error);
        alert('Error restoring backup. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed bottom-4 right-4 z-10">
      <div className="relative group">
        <button 
          className="bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          title="Backup & Restore"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </button>
        
        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
          <div className="bg-white rounded-lg shadow-lg p-4 w-64">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Backup & Restore</h3>
            
            <div className="space-y-2">
              <button
                onClick={handleBackup}
                className="w-full px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download Backup
              </button>
              
              <label className="w-full px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Restore Backup
                <input
                  type="file"
                  accept=".json"
                  onChange={handleRestore}
                  className="hidden"
                />
              </label>
            </div>
            
            {lastBackup && (
              <p className="mt-2 text-xs text-gray-500">
                Last backup: {format(new Date(lastBackup), 'M/d/yyyy, h:mm a')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
