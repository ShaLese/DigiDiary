import React, { useState } from 'react';
import { Mail, Quote } from 'lucide-react';
import { UserProfile } from '../../types';
import EditProfileModal from './EditProfileModal';

interface ProfileProps {
  profile: UserProfile;
  onEdit: (profile: UserProfile) => void;
}

export default function Profile({ profile, onEdit }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <img
              src={profile.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'}
              alt={profile.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-blue-100"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{profile.email}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Edit Profile
          </button>
        </div>
        
        <div className="flex items-start gap-2 text-gray-700">
          <Quote className="w-5 h-5 text-blue-500 flex-shrink-0" />
          <p className="italic">{profile.tagline}</p>
        </div>
      </div>

      {isEditing && (
        <EditProfileModal
          profile={profile}
          onSave={onEdit}
          onClose={() => setIsEditing(false)}
        />
      )}
    </>
  );
}