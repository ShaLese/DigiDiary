export interface DiaryEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
  images: string[];
  videos: string[];
  mood: 'happy' | 'sad' | 'neutral' | 'excited' | 'tired';
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  updated_at: string;
  full_name: string;
  avatar_url: string;
  tagline: string;
  contact: string;
  address: string;
}

export interface AuthError {
  message: string;
  status?: number;
}