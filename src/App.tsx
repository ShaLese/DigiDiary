import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Book, Layout, PenSquare, LogOut, Calendar } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import Dashboard from './components/Dashboard';
import EntryForm from './components/EntryForm';
import EntryList from './components/EntryList';
import EntryEdit from './components/EntryEdit';
import EntryView from './components/EntryView';
import Clock from './components/Clock';
import BackupRestore from './components/BackupRestore';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AuthCallback from './pages/AuthCallback';
import Profile from './pages/Profile'; // Import Profile component
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DiaryEntry } from './types';
import { getAllEntries, saveEntry, deleteEntry } from './lib/supabase';
import { signOut } from './lib/auth';

const sortEntriesByDate = (entries: DiaryEntry[]): DiaryEntry[] => {
  return [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [entriesLoading, setEntriesLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setEntriesLoading(true);
      getAllEntries()
        .then(dbEntries => {
          setEntries(sortEntriesByDate(dbEntries));
        })
        .catch(error => {
          console.error('Error loading entries:', error);
        })
        .finally(() => {
          setEntriesLoading(false);
        });
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {user && (
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link to="/dashboard" className="flex items-center gap-2">
                <Book className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-semibold">DigiDiary</h1>
              </Link>
              <nav className="flex items-center gap-6">
                <Link to="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                  <Layout className="w-5 h-5" />
                  Dashboard
                </Link>
                <Link to="/entries" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                  <Calendar className="w-5 h-5" />
                  All Moments
                </Link>
                <Link to="/new" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                  <PenSquare className="w-5 h-5" />
                  New Entry
                </Link>
                <Link to="/profile" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </nav>
            </div>
          </div>
        </header>
      )}

      <main className={user ? "max-w-7xl mx-auto px-4 py-8" : ""}>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <SignUp />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard entries={entries} loading={entriesLoading} />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/entries"
            element={
              <ProtectedRoute>
                <EntryList entries={entries} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/new"
            element={
              <ProtectedRoute>
                <EntryForm
                  onSave={async (entry) => {
                    const savedEntry = await saveEntry(entry);
                    setEntries(sortEntriesByDate([...entries, savedEntry]));
                    return savedEntry;
                  }}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/entry/:id"
            element={
              <ProtectedRoute>
                <EntryView
                  entries={entries}
                  onDelete={async (id) => {
                    await deleteEntry(id);
                    setEntries(entries.filter(e => e.id !== id));
                  }}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <EntryEdit
                  entries={entries}
                  onSave={async (entry) => {
                    const updatedEntry = await saveEntry(entry);
                    setEntries(sortEntriesByDate(
                      entries.map(e => e.id === entry.id ? updatedEntry : e)
                    ));
                    return updatedEntry;
                  }}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {user && (
        <BackupRestore 
          entries={entries} 
          onEntriesImported={() => {
            getAllEntries().then(dbEntries => {
              setEntries(sortEntriesByDate(dbEntries));
            });
          }} 
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <AppContent />
      </Router>
    </AuthProvider>
  );
}