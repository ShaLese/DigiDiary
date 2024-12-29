import { createClient } from '@supabase/supabase-js';
import { DiaryEntry } from '../types';
import { v4 as uuidv4 } from 'uuid';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getAllEntries(): Promise<DiaryEntry[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  console.log('Fetching entries for user:', user.id); // Debug log

  const { data, error } = await supabase
    .from('diary_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching entries:', error);
    throw error;
  }

  console.log('Found entries:', data?.length || 0); // Debug log
  return data || [];
}

export async function saveEntry(entry: DiaryEntry): Promise<DiaryEntry> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Ensure we have all required fields
  const entryData = {
    ...entry,
    id: entry.id || uuidv4(),
    user_id: user.id,
    title: entry.title || '',
    content: entry.content || '',
    date: entry.date || new Date().toISOString(),
    mood: entry.mood || '',
    tags: entry.tags || [],
    images: entry.images || [],
    videos: entry.videos || [],
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('diary_entries')
    .upsert(entryData)
    .select()
    .single();

  if (error) {
    console.error('Error saving entry:', error);
    throw error;
  }

  if (!data) {
    throw new Error('No data returned from save operation');
  }

  return data;
}

export async function deleteEntry(id: string): Promise<void> {
  const { error } = await supabase
    .from('diary_entries')
    .delete()
    .match({ id });

  if (error) {
    console.error('Error deleting entry:', error);
    throw error;
  }
}

export async function migrateLocalEntries(entries: DiaryEntry[]): Promise<void> {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('User not authenticated');

  for (const entry of entries) {
    await saveEntry({
      ...entry,
      user_id: user.id
    });
  }
}
