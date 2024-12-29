import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Heart, Shield, Users } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-8">
          Your Digital Safe Space for
          <span className="text-blue-600"> Personal Reflections</span>
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          DigiDiary helps you capture life's moments, organize your thoughts, and track your personal growth
          in a secure and beautiful digital environment.
        </p>
        <div className="flex justify-center gap-6">
          <Link
            to="/signup"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started Free
          </Link>
          <Link
            to="/login"
            className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-colors border border-blue-600"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
            <p className="text-gray-600">
              Your entries are encrypted and stored securely. Only you have access to your personal thoughts.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Beautiful Experience</h3>
            <p className="text-gray-600">
              A clean, intuitive interface that makes writing and reflecting a joy.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Personal Growth</h3>
            <p className="text-gray-600">
              Track your moods, tag entries, and watch your journey unfold over time.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <Book className="w-5 h-5" />
          <span className="font-semibold">DigiDiary</span>
        </div>
        <p className="text-center text-sm text-gray-500 mt-4">
          © {new Date().getFullYear()} DigiDiary. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
